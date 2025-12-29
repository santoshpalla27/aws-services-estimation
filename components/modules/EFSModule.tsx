import React from 'react';
import { Accordion, FormSection, AWSSlider, AWSInput, AWSSelect, AWSToggle } from '../ui/AWS';
import { ResourceConfig, EFSThroughputMode } from '../../types';

interface EFSModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const EFSArchitectureConfig: React.FC<EFSModuleProps> = ({ config, onUpdate }) => {
  const attrs = config.attributes;

  const updateAttribute = (key: string, value: any) => {
    onUpdate({
        ...config,
        attributes: { ...attrs, [key]: value }
    });
  };

  return (
    <div className="space-y-6">
        {/* 1. File System Settings */}
        <Accordion title="File System Settings" defaultOpen={true}>
            <div className="space-y-6">
                <FormSection 
                    label="Name" 
                    info="Identifier for this file system"
                >
                     <AWSInput 
                        value={config.name} 
                        onChange={(e) => onUpdate({...config, name: e.target.value})} 
                        placeholder="MyEFS"
                    />
                </FormSection>

                <FormSection 
                    label="Availability & Durability" 
                    info="Choose between Regional or One Zone"
                    tooltip="Standard stores data across multiple AZs. One Zone stores data in a single AZ for lower cost."
                >
                     <div className="flex gap-4">
                        <button
                            onClick={() => updateAttribute('efsIsOneZone', false)}
                            className={`flex-1 p-3 border rounded-md text-sm font-semibold transition-all ${!attrs.efsIsOneZone ? 'bg-aws-primary text-white border-aws-primary' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                        >
                            Standard (Multi-AZ)
                        </button>
                        <button
                            onClick={() => updateAttribute('efsIsOneZone', true)}
                            className={`flex-1 p-3 border rounded-md text-sm font-semibold transition-all ${attrs.efsIsOneZone ? 'bg-aws-primary text-white border-aws-primary' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                        >
                            One Zone (Single-AZ)
                        </button>
                     </div>
                </FormSection>
            </div>
        </Accordion>

        {/* 2. Performance */}
        <Accordion title="Throughput Mode">
            <div className="space-y-6">
                <FormSection 
                    label="Throughput Mode" 
                    tooltip="Bursting scales with storage. Provisioned is fixed. Elastic scales automatically with workload."
                >
                    <AWSSelect 
                        value={attrs.efsThroughputMode} 
                        onChange={(e) => updateAttribute('efsThroughputMode', e.target.value)}
                    >
                        <option value={EFSThroughputMode.BURSTING}>Bursting (Default)</option>
                        <option value={EFSThroughputMode.ELASTIC}>Elastic (Pay per use)</option>
                        <option value={EFSThroughputMode.PROVISIONED}>Provisioned (Fixed)</option>
                    </AWSSelect>
                </FormSection>

                {attrs.efsThroughputMode === EFSThroughputMode.PROVISIONED && (
                    <div className="pl-4 border-l-2 border-aws-link animate-in fade-in">
                        <FormSection 
                            label="Provisioned Throughput (MB/s)" 
                            tooltip="Amount of throughput to provision independent of storage size."
                        >
                            <AWSInput 
                                type="number" min={1}
                                value={attrs.efsProvisionedThroughput} 
                                onChange={(e) => updateAttribute('efsProvisionedThroughput', Number(e.target.value))}
                                unit="MB/s"
                            />
                        </FormSection>
                    </div>
                )}
            </div>
        </Accordion>
    </div>
  );
};

export const EFSUsageConfig: React.FC<EFSModuleProps> = ({ config, onUpdate }) => {
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
                    <span className="w-2 h-8 bg-blue-600 rounded-full mr-3"></span>
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Storage</h4>
                </div>
                
                <div className="space-y-6">
                    <FormSection 
                        label="Standard Storage" 
                        tooltip="Frequently accessed data."
                    >
                        <AWSSlider 
                            min={0} max={1000} 
                            value={attrs.efsStorageStandard} 
                            onChange={(val) => updateAttribute('efsStorageStandard', val)}
                            unit="GB"
                            labels={["0", "500 GB", "1 TB"]}
                        />
                    </FormSection>

                    <FormSection 
                        label="Infrequent Access (IA)" 
                        tooltip="Data not accessed daily. Lower storage cost, but incurs access fees."
                    >
                        <AWSSlider 
                            min={0} max={5000} 
                            value={attrs.efsStorageIA} 
                            onChange={(val) => updateAttribute('efsStorageIA', val)}
                            unit="GB"
                            labels={["0", "2.5 TB", "5 TB"]}
                        />
                    </FormSection>

                    {!attrs.efsIsOneZone && (
                        <div className="pt-4 border-t border-gray-100">
                            <FormSection 
                                label="Archive Storage" 
                                tooltip="Long-term retention. Lowest cost, higher access fees. Not available in One Zone."
                            >
                                <AWSSlider 
                                    min={0} max={10000} 
                                    value={attrs.efsStorageArchive} 
                                    onChange={(val) => updateAttribute('efsStorageArchive', val)}
                                    unit="GB"
                                    labels={["0", "5 TB", "10 TB"]}
                                />
                            </FormSection>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                    <span className="w-2 h-8 bg-green-500 rounded-full mr-3"></span>
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Activity & Throughput</h4>
                </div>

                <div className="space-y-6">
                    {attrs.efsThroughputMode === EFSThroughputMode.ELASTIC && (
                        <div className="space-y-6 pb-6 border-b border-gray-100">
                            <FormSection 
                                label="Elastic Read Data" 
                                tooltip="Total data read per month in Elastic mode."
                            >
                                <AWSSlider 
                                    min={0} max={5000} 
                                    value={attrs.efsElasticReadData} 
                                    onChange={(val) => updateAttribute('efsElasticReadData', val)}
                                    unit="GB/Mo"
                                    labels={["0", "2.5 TB", "5 TB"]}
                                />
                            </FormSection>
                            <FormSection 
                                label="Elastic Write Data" 
                                tooltip="Total data written per month in Elastic mode."
                            >
                                <AWSSlider 
                                    min={0} max={1000} 
                                    value={attrs.efsElasticWriteData} 
                                    onChange={(val) => updateAttribute('efsElasticWriteData', val)}
                                    unit="GB/Mo"
                                    labels={["0", "500 GB", "1 TB"]}
                                />
                            </FormSection>
                        </div>
                    )}

                    <FormSection 
                        label="IA Data Retrieval" 
                        tooltip="Amount of data read from Infrequent Access storage."
                    >
                        <AWSInput 
                            type="number" min={0}
                            value={attrs.efsIaRetrieval}
                            onChange={(e) => updateAttribute('efsIaRetrieval', Number(e.target.value))}
                            unit="GB/Mo"
                        />
                    </FormSection>

                    {!attrs.efsIsOneZone && (
                        <FormSection 
                            label="Archive Data Retrieval" 
                            tooltip="Amount of data read from Archive storage."
                        >
                            <AWSInput 
                                type="number" min={0}
                                value={attrs.efsArchiveRetrieval}
                                onChange={(e) => updateAttribute('efsArchiveRetrieval', Number(e.target.value))}
                                unit="GB/Mo"
                            />
                        </FormSection>
                    )}
                </div>
            </div>
        </div>
    );
};