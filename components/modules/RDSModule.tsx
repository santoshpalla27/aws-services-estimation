import React from 'react';
import { Accordion, FormSection, AWSSlider, AWSInput, AWSSelect, AWSToggle } from '../ui/AWS';
import { ResourceConfig, RDSEngine, RDSDeploymentOption, EbsVolumeType, ServiceType } from '../../types';
import { usePricing } from '../../contexts/PricingContext';

interface RDSModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const RDSArchitectureConfig: React.FC<RDSModuleProps> = ({ config, onUpdate }) => {
  const attrs = config.attributes;
  const { getServiceOptions } = usePricing();
  
  const instanceClasses = getServiceOptions(ServiceType.RDS, 'instance');
  const storageTypes = getServiceOptions(ServiceType.RDS, 'volume');

  const updateAttribute = (key: string, value: any) => {
    onUpdate({
        ...config,
        attributes: { ...attrs, [key]: value }
    });
  };

  const addInstance = () => {
      const newInst = {
          id: `db-${Date.now()}`,
          name: `db-${(attrs.rdsInstances?.length || 0) + 1}`,
          engine: RDSEngine.MYSQL,
          instanceClass: "db.t3.micro",
          deploymentOption: RDSDeploymentOption.SINGLE_AZ,
          storageType: EbsVolumeType.GP3,
          storageSize: 20,
          storageIops: 0,
          backupStorage: 0
      };
      updateAttribute('rdsInstances', [...(attrs.rdsInstances || []), newInst]);
  };

  const removeInstance = (id: string) => {
      updateAttribute('rdsInstances', attrs.rdsInstances.filter(i => i.id !== id));
  };

  const updateInstance = (id: string, field: string, value: any) => {
      const updated = attrs.rdsInstances.map(i => {
          if (i.id === id) return { ...i, [field]: value };
          return i;
      });
      updateAttribute('rdsInstances', updated);
  };

  return (
    <div className="space-y-6">
        <Accordion title="Database Instances" defaultOpen={true}>
            <div className="space-y-6">
                <div className="space-y-4">
                    {attrs.rdsInstances && attrs.rdsInstances.map((inst, index) => (
                        <div key={inst.id} className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm relative group animate-in fade-in">
                            <div className="absolute top-3 right-3">
                                <button 
                                    onClick={() => removeInstance(inst.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            
                            <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center">
                                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 text-xs">{index + 1}</span>
                                {inst.name}
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <AWSInput 
                                    label="DB Identifier" 
                                    value={inst.name}
                                    onChange={(e) => updateInstance(inst.id, 'name', e.target.value)}
                                />
                                <AWSSelect 
                                    label="Engine" 
                                    value={inst.engine} 
                                    onChange={(e) => updateInstance(inst.id, 'engine', e.target.value)}
                                >
                                    {Object.values(RDSEngine).map(e => (
                                        <option key={e} value={e}>{e}</option>
                                    ))}
                                </AWSSelect>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <AWSSelect 
                                    label="Instance Class" 
                                    value={inst.instanceClass} 
                                    onChange={(e) => updateInstance(inst.id, 'instanceClass', e.target.value)}
                                >
                                    {instanceClasses.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </AWSSelect>
                                <AWSSelect 
                                    label="Deployment" 
                                    value={inst.deploymentOption} 
                                    onChange={(e) => updateInstance(inst.id, 'deploymentOption', e.target.value)}
                                >
                                    <option value={RDSDeploymentOption.SINGLE_AZ}>Single-AZ</option>
                                    <option value={RDSDeploymentOption.MULTI_AZ}>Multi-AZ</option>
                                </AWSSelect>
                            </div>

                            <div className="pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <AWSSelect 
                                    label="Storage Type" 
                                    value={inst.storageType} 
                                    onChange={(e) => updateInstance(inst.id, 'storageType', e.target.value)}
                                >
                                    {storageTypes.length > 0 ? (
                                        storageTypes.map(t => <option key={t} value={t}>{t}</option>)
                                    ) : (
                                        // Fallback
                                        <>
                                            <option value={EbsVolumeType.GP3}>gp3</option>
                                            <option value={EbsVolumeType.GP2}>gp2</option>
                                            <option value={EbsVolumeType.IO2}>io2</option>
                                        </>
                                    )}
                                </AWSSelect>
                                <AWSInput 
                                    label="Allocated Storage" 
                                    type="number" min={20}
                                    value={inst.storageSize}
                                    onChange={(e) => updateInstance(inst.id, 'storageSize', Number(e.target.value))}
                                    unit="GB"
                                />
                                {inst.storageType.includes('io') && (
                                    <AWSInput 
                                        label="IOPS" 
                                        type="number" min={1000}
                                        value={inst.storageIops}
                                        onChange={(e) => updateInstance(inst.id, 'storageIops', Number(e.target.value))}
                                        unit="IOPS"
                                    />
                                )}
                            </div>
                        </div>
                    ))}

                    <button 
                        onClick={addInstance}
                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-aws-primary hover:text-aws-primary transition-colors text-sm font-medium flex items-center justify-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Add Database Instance
                    </button>
                </div>
            </div>
        </Accordion>
    </div>
  );
};

export const RDSUsageConfig: React.FC<RDSModuleProps> = ({ config, onUpdate }) => {
    const attrs = config.attributes;
    
    const updateAttribute = (key: string, value: any) => {
        onUpdate({
            ...config,
            attributes: { ...attrs, [key]: value }
        });
    };

    const updateInstance = (id: string, field: string, value: any) => {
        const updated = attrs.rdsInstances.map(i => {
            if (i.id === id) return { ...i, [field]: value };
            return i;
        });
        updateAttribute('rdsInstances', updated);
    };

    return (
        <div className="space-y-4">
            <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                    <span className="w-2 h-8 bg-blue-600 rounded-full mr-3"></span>
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Backups & Transfer</h4>
                </div>
                
                <div className="space-y-6">
                    {attrs.rdsInstances && attrs.rdsInstances.map(inst => (
                        <div key={inst.id} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                            <h5 className="text-xs font-bold text-gray-500 uppercase mb-3">{inst.name} Usage</h5>
                            <FormSection 
                                label="Additional Backup Storage" 
                                tooltip="Storage for automated backups beyond allocated size."
                            >
                                <AWSSlider 
                                    min={0} max={5000} 
                                    value={inst.backupStorage} 
                                    onChange={(val) => updateInstance(inst.id, 'backupStorage', val)}
                                    unit="GB/Mo"
                                    labels={["0", "2.5 TB", "5 TB"]}
                                />
                            </FormSection>
                        </div>
                    ))}

                    <div className="pt-4 border-t border-gray-100">
                        <FormSection 
                            label="Data Transfer Out (Total)" 
                            tooltip="Aggregated data transfer out from all RDS instances to the internet."
                        >
                            <AWSSlider 
                                min={0} max={5000} 
                                value={attrs.rdsDataTransferOut} 
                                onChange={(val) => updateAttribute('rdsDataTransferOut', val)}
                                unit="GB/Mo"
                                labels={["0", "2.5 TB", "5 TB"]}
                            />
                        </FormSection>
                    </div>
                </div>
            </div>
        </div>
    );
};