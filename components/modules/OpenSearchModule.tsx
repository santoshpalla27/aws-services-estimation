import React from 'react';
import { Accordion, FormSection, AWSSlider, AWSInput, AWSSelect, AWSToggle } from '../ui/AWS';
import { ResourceConfig, OpenSearchInstanceType, EbsVolumeType } from '../../types';

interface OpenSearchModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const OpenSearchArchitectureConfig: React.FC<OpenSearchModuleProps> = ({ config, onUpdate }) => {
  const attrs = config.attributes;

  const updateAttribute = (key: string, value: any) => {
    onUpdate({
        ...config,
        attributes: { ...attrs, [key]: value }
    });
  };

  return (
    <div className="space-y-6">
        {/* 1. Domain Configuration */}
        <Accordion title="Domain Configuration" defaultOpen={true}>
            <div className="space-y-6">
                <FormSection 
                    label="Domain Name" 
                    info="Identifier for this OpenSearch Domain"
                >
                     <AWSInput 
                        value={config.name} 
                        onChange={(e) => onUpdate({...config, name: e.target.value})} 
                        placeholder="my-search-domain"
                    />
                </FormSection>

                <FormSection 
                    label="Availability Zones (Multi-AZ)" 
                    info="Deploy nodes across multiple AZs for high availability."
                    tooltip="If enabled, ensure your instance count is a multiple of 2 or 3 to distribute evenly."
                >
                     <AWSToggle 
                        label="Enable Multi-AZ"
                        checked={attrs.osMultiAZ}
                        onChange={(val) => updateAttribute('osMultiAZ', val)}
                     />
                </FormSection>
            </div>
        </Accordion>

        {/* 2. Data Nodes */}
        <Accordion title="Data Nodes">
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <FormSection 
                        label="Instance Type" 
                        info="Compute and memory capacity for data nodes"
                    >
                         <AWSSelect 
                            value={attrs.osInstanceType} 
                            onChange={(e) => updateAttribute('osInstanceType', e.target.value)}
                        >
                            {Object.values(OpenSearchInstanceType).map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </AWSSelect>
                    </FormSection>
                    
                    <FormSection 
                        label="Number of Nodes" 
                        info="Total count of data nodes"
                    >
                         <AWSInput 
                            type="number" min={1}
                            value={attrs.osInstanceCount}
                            onChange={(e) => updateAttribute('osInstanceCount', Number(e.target.value))}
                            unit="Nodes"
                        />
                    </FormSection>
                </div>

                <div className="pt-4 border-t border-gray-100">
                    <FormSection 
                        label="Storage Configuration" 
                        info="EBS storage attached to each data node"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <AWSSelect 
                                label="Volume Type"
                                value={attrs.osStorageType} 
                                onChange={(e) => updateAttribute('osStorageType', e.target.value)}
                            >
                                <option value={EbsVolumeType.GP3}>General Purpose (gp3)</option>
                                <option value={EbsVolumeType.IO1}>Provisioned IOPS (io1)</option>
                            </AWSSelect>
                            <AWSInput 
                                label="Size Per Node"
                                type="number" min={10}
                                value={attrs.osStorageSizePerNode}
                                onChange={(e) => updateAttribute('osStorageSizePerNode', Number(e.target.value))}
                                unit="GB"
                            />
                        </div>
                    </FormSection>
                </div>
            </div>
        </Accordion>

        {/* 3. Dedicated Master Nodes */}
        <Accordion title="Dedicated Master Nodes">
             <div className="space-y-6">
                 <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                     <div className="mb-4">
                        <AWSToggle 
                            label="Enable Dedicated Master Nodes" 
                            checked={attrs.osDedicatedMasterEnabled}
                            onChange={(val) => updateAttribute('osDedicatedMasterEnabled', val)}
                            tooltip="Dedicated master nodes improve the stability of the cluster by offloading cluster management tasks from data nodes."
                        />
                     </div>

                     {attrs.osDedicatedMasterEnabled && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
                             <FormSection label="Master Instance Type">
                                 <AWSSelect 
                                    value={attrs.osDedicatedMasterType} 
                                    onChange={(e) => updateAttribute('osDedicatedMasterType', e.target.value)}
                                >
                                    {Object.values(OpenSearchInstanceType).map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </AWSSelect>
                            </FormSection>
                            <FormSection label="Number of Masters">
                                 <AWSSelect 
                                    value={attrs.osDedicatedMasterCount} 
                                    onChange={(e) => updateAttribute('osDedicatedMasterCount', Number(e.target.value))}
                                >
                                    <option value={3}>3 (Recommended)</option>
                                    <option value={5}>5</option>
                                </AWSSelect>
                            </FormSection>
                        </div>
                     )}
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

    return (
        <div className="space-y-4">
            <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                    <span className="w-2 h-8 bg-green-500 rounded-full mr-3"></span>
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Data Transfer</h4>
                </div>
                
                <FormSection 
                    label="Data Transfer Out" 
                    tooltip="Amount of data transferred from the OpenSearch domain to the Internet."
                >
                    <AWSSlider 
                        min={0} max={5000} 
                        value={attrs.osDataTransferOut} 
                        onChange={(val) => updateAttribute('osDataTransferOut', val)}
                        unit="GB/Mo"
                        labels={["0", "2.5 TB", "5 TB"]}
                    />
                </FormSection>
            </div>
        </div>
    );
};