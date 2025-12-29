import React from 'react';
import { Accordion, FormSection, AWSSlider, AWSInput, AWSSelect, AWSToggle, AWSButton } from '../ui/AWS';
import { ResourceConfig, EbsVolumeType, ServiceType } from '../../types';
import { usePricing } from '../../contexts/PricingContext';

interface OpenSearchModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const OpenSearchArchitectureConfig: React.FC<OpenSearchModuleProps> = ({ config, onUpdate }) => {
  const attrs = config.attributes;
  const { getServiceOptions } = usePricing();
  
  const instanceTypes = getServiceOptions(ServiceType.OPENSEARCH, 'instance');
  const storageTypes = getServiceOptions(ServiceType.OPENSEARCH, 'volume');

  const updateAttribute = (key: string, value: any) => {
    onUpdate({
        ...config,
        attributes: { ...attrs, [key]: value }
    });
  };

  const addDomain = () => {
      const newDomain = {
          id: `os-${Date.now()}`,
          name: `domain-${(attrs.openSearchDomains?.length || 0) + 1}`,
          instanceType: "t3.small.search",
          instanceCount: 1,
          masterEnabled: false,
          masterType: "t3.small.search",
          masterCount: 3,
          storageType: EbsVolumeType.GP3,
          storageSizePerNode: 10,
          multiAZ: false,
          dataTransferOut: 0
      };
      updateAttribute('openSearchDomains', [...(attrs.openSearchDomains || []), newDomain]);
  };

  const removeDomain = (id: string) => {
      updateAttribute('openSearchDomains', attrs.openSearchDomains.filter(d => d.id !== id));
  };

  const updateDomain = (id: string, field: string, value: any) => {
      const updated = attrs.openSearchDomains.map(d => {
          if (d.id === id) return { ...d, [field]: value };
          return d;
      });
      updateAttribute('openSearchDomains', updated);
  };

  return (
    <div className="space-y-6">
        <Accordion title="Domains" defaultOpen={true}>
            <div className="space-y-6">
                <div className="space-y-4">
                    {attrs.openSearchDomains && attrs.openSearchDomains.map((domain, index) => (
                        <div key={domain.id} className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm relative group animate-in fade-in">
                            <div className="absolute top-3 right-3">
                                <button 
                                    onClick={() => removeDomain(domain.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            
                            <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center">
                                <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-2 text-xs">{index + 1}</span>
                                {domain.name}
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <AWSInput 
                                    label="Domain Name" 
                                    value={domain.name}
                                    onChange={(e) => updateDomain(domain.id, 'name', e.target.value)}
                                />
                                <AWSToggle 
                                    label="Enable Multi-AZ"
                                    checked={domain.multiAZ}
                                    onChange={(val) => updateDomain(domain.id, 'multiAZ', val)}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <AWSSelect 
                                    label="Instance Type" 
                                    value={domain.instanceType} 
                                    onChange={(e) => updateDomain(domain.id, 'instanceType', e.target.value)}
                                >
                                    {instanceTypes.map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </AWSSelect>
                                <AWSInput 
                                    label="Node Count" 
                                    type="number" min={1}
                                    value={domain.instanceCount} 
                                    onChange={(e) => updateDomain(domain.id, 'instanceCount', Number(e.target.value))}
                                    unit="Nodes"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                                <AWSSelect 
                                    label="Storage Type"
                                    value={domain.storageType} 
                                    onChange={(e) => updateDomain(domain.id, 'storageType', e.target.value)}
                                >
                                    {storageTypes.length > 0 ? (
                                        storageTypes.map(t => <option key={t} value={t}>{t}</option>)
                                    ) : (
                                        <>
                                            <option value={EbsVolumeType.GP3}>General Purpose (gp3)</option>
                                            <option value={EbsVolumeType.IO1}>Provisioned IOPS (io1)</option>
                                        </>
                                    )}
                                </AWSSelect>
                                <AWSInput 
                                    label="Size Per Node"
                                    type="number" min={10}
                                    value={domain.storageSizePerNode}
                                    onChange={(e) => updateDomain(domain.id, 'storageSizePerNode', Number(e.target.value))}
                                    unit="GB"
                                />
                            </div>

                            <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-100">
                                <div className="mb-3">
                                    <AWSToggle 
                                        label="Dedicated Master Nodes" 
                                        checked={domain.masterEnabled}
                                        onChange={(val) => updateDomain(domain.id, 'masterEnabled', val)}
                                    />
                                </div>
                                {domain.masterEnabled && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <AWSSelect 
                                            label="Master Type"
                                            value={domain.masterType} 
                                            onChange={(e) => updateDomain(domain.id, 'masterType', e.target.value)}
                                        >
                                            {instanceTypes.map(t => (
                                                <option key={t} value={t}>{t}</option>
                                            ))}
                                        </AWSSelect>
                                        <AWSSelect 
                                            label="Count"
                                            value={domain.masterCount} 
                                            onChange={(e) => updateDomain(domain.id, 'masterCount', Number(e.target.value))}
                                        >
                                            <option value={3}>3</option>
                                            <option value={5}>5</option>
                                        </AWSSelect>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    <button 
                        onClick={addDomain}
                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-aws-primary hover:text-aws-primary transition-colors text-sm font-medium flex items-center justify-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Add Domain
                    </button>
                </div>
            </div>
        </Accordion>
    </div>
  );
};

export const OpenSearchUsageConfig: React.FC<OpenSearchModuleProps> = ({ config, onUpdate }) => {
    const attrs = config.attributes;
    const updateAttribute = (key: string, value: any) => {
        onUpdate({
            ...config,
            attributes: { ...attrs, [key]: value }
        });
    };

    const updateDomain = (id: string, field: string, value: any) => {
        const updated = attrs.openSearchDomains.map(d => {
            if (d.id === id) return { ...d, [field]: value };
            return d;
        });
        updateAttribute('openSearchDomains', updated);
    };

    return (
        <div className="space-y-4">
            <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                    <span className="w-2 h-8 bg-green-500 rounded-full mr-3"></span>
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Data Transfer</h4>
                </div>
                
                <div className="space-y-6">
                    {attrs.openSearchDomains && attrs.openSearchDomains.map(domain => (
                        <div key={domain.id} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                            <h5 className="text-xs font-bold text-gray-500 uppercase mb-3">{domain.name}</h5>
                            <FormSection 
                                label="Data Transfer Out" 
                                tooltip="Amount of data transferred from the OpenSearch domain to the Internet."
                            >
                                <AWSSlider 
                                    min={0} max={5000} 
                                    value={domain.dataTransferOut} 
                                    onChange={(val) => updateDomain(domain.id, 'dataTransferOut', val)}
                                    unit="GB/Mo"
                                    labels={["0", "2.5 TB", "5 TB"]}
                                />
                            </FormSection>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};