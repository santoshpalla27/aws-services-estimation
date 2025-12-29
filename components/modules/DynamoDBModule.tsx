import React from 'react';
import { Accordion, FormSection, AWSSlider, AWSInput, AWSSelect, AWSToggle } from '../ui/AWS';
import { ResourceConfig, DynamoDBCapacityMode, DynamoDBTableClass } from '../../types';

interface DynamoDBModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const DynamoDBArchitectureConfig: React.FC<DynamoDBModuleProps> = ({ config, onUpdate }) => {
  const attrs = config.attributes;

  const updateAttribute = (key: string, value: any) => {
    onUpdate({
        ...config,
        attributes: { ...attrs, [key]: value }
    });
  };

  return (
    <div className="space-y-6">
        {/* 1. Table Settings */}
        <Accordion title="Table Settings" defaultOpen={true}>
            <div className="space-y-6">
                <FormSection 
                    label="Table Name" 
                    info="Identifier for this table"
                >
                     <AWSInput 
                        value={config.name} 
                        onChange={(e) => onUpdate({...config, name: e.target.value})} 
                        placeholder="MyTable"
                    />
                </FormSection>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <FormSection 
                        label="Table Class" 
                        info="Optimization for access frequency"
                        tooltip="Standard-IA offers lower storage costs for infrequently accessed data, but higher access costs."
                    >
                         <AWSSelect 
                            value={attrs.ddbTableClass} 
                            onChange={(e) => updateAttribute('ddbTableClass', e.target.value)}
                        >
                            <option value={DynamoDBTableClass.STANDARD}>Standard</option>
                            <option value={DynamoDBTableClass.STANDARD_IA}>Standard-IA</option>
                        </AWSSelect>
                    </FormSection>

                    <FormSection 
                        label="Capacity Mode" 
                        info="Throughput management"
                        tooltip="On-Demand scales automatically. Provisioned requires specifying WCU/RCU."
                    >
                         <AWSSelect 
                            value={attrs.ddbCapacityMode} 
                            onChange={(e) => updateAttribute('ddbCapacityMode', e.target.value)}
                        >
                            <option value={DynamoDBCapacityMode.PROVISIONED}>Provisioned</option>
                            <option value={DynamoDBCapacityMode.ON_DEMAND}>On-Demand</option>
                        </AWSSelect>
                    </FormSection>
                </div>
            </div>
        </Accordion>

        {/* 2. Additional Features */}
        <Accordion title="Features & Protection">
            <div className="space-y-6">
                <FormSection 
                    label="Backups & Recovery"
                >
                    <div className="space-y-4">
                        <AWSToggle 
                            label="Enable Point-in-Time Recovery (PITR)" 
                            checked={attrs.ddbPitRecoveryEnabled}
                            onChange={(val) => updateAttribute('ddbPitRecoveryEnabled', val)}
                            tooltip="Continuous backups for the last 35 days. Charged per GB-month."
                        />
                         <AWSToggle 
                            label="Enable On-Demand Backups" 
                            checked={attrs.ddbBackupEnabled}
                            onChange={(val) => updateAttribute('ddbBackupEnabled', val)}
                            tooltip="Full table snapshots for long-term retention."
                        />
                         {attrs.ddbBackupEnabled && (
                             <div className="pl-4 border-l-2 border-aws-link animate-in fade-in">
                                 <AWSInput 
                                    label="Backup Storage Size"
                                    type="number" min={0}
                                    value={attrs.ddbBackupSize}
                                    onChange={(e) => updateAttribute('ddbBackupSize', Number(e.target.value))}
                                    unit="GB"
                                />
                             </div>
                         )}
                    </div>
                </FormSection>

                <div className="pt-4 border-t border-gray-100">
                    <FormSection label="Global Tables">
                         <AWSToggle 
                            label="Enable Global Tables (Replication)" 
                            checked={attrs.ddbGlobalTablesEnabled}
                            onChange={(val) => updateAttribute('ddbGlobalTablesEnabled', val)}
                            tooltip="Replicate your table to other AWS regions for multi-region active-active workloads."
                        />
                        {attrs.ddbGlobalTablesEnabled && (
                             <div className="mt-4 pl-4 border-l-2 border-aws-link animate-in fade-in">
                                 <AWSInput 
                                    label="Additional Regions"
                                    type="number" min={1} max={5}
                                    value={attrs.ddbGlobalTableRegions}
                                    onChange={(e) => updateAttribute('ddbGlobalTableRegions', Number(e.target.value))}
                                    unit="Regions"
                                    tooltip="Number of additional regions to replicate to."
                                />
                             </div>
                         )}
                    </FormSection>
                </div>
            </div>
        </Accordion>
    </div>
  );
};

export const DynamoDBUsageConfig: React.FC<DynamoDBModuleProps> = ({ config, onUpdate }) => {
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
                <FormSection 
                    label="Data Storage" 
                    tooltip="Total size of data stored in your table."
                >
                    <AWSSlider 
                        min={0} max={5000} 
                        value={attrs.ddbStorageSize} 
                        onChange={(val) => updateAttribute('ddbStorageSize', val)}
                        unit="GB"
                        labels={["0", "2.5 TB", "5 TB"]}
                    />
                </FormSection>
            </div>

            <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                    <span className="w-2 h-8 bg-orange-500 rounded-full mr-3"></span>
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Throughput & Capacity</h4>
                </div>
                
                {attrs.ddbCapacityMode === DynamoDBCapacityMode.PROVISIONED ? (
                    <div className="space-y-6 animate-in fade-in">
                         <FormSection 
                            label="Write Capacity Units (WCU)" 
                            tooltip="Provisioned capacity for writes. 1 WCU = 1KB/s."
                        >
                            <AWSSlider 
                                min={1} max={10000} 
                                value={attrs.ddbWCU} 
                                onChange={(val) => updateAttribute('ddbWCU', val)}
                                unit="WCU"
                                labels={["1", "5k", "10k"]}
                            />
                        </FormSection>
                         <FormSection 
                            label="Read Capacity Units (RCU)" 
                            tooltip="Provisioned capacity for reads. 1 RCU = 4KB/s."
                        >
                            <AWSSlider 
                                min={1} max={10000} 
                                value={attrs.ddbRCU} 
                                onChange={(val) => updateAttribute('ddbRCU', val)}
                                unit="RCU"
                                labels={["1", "5k", "10k"]}
                            />
                        </FormSection>
                    </div>
                ) : (
                    <div className="space-y-6 animate-in fade-in">
                         <FormSection 
                            label="Monthly Write Requests" 
                            tooltip="Total number of write requests per month."
                        >
                            <AWSSlider 
                                min={0} max={1000} 
                                value={attrs.ddbWriteRequestUnits} 
                                onChange={(val) => updateAttribute('ddbWriteRequestUnits', val)}
                                unit="Million WRU"
                                labels={["0", "500M", "1B"]}
                            />
                        </FormSection>
                         <FormSection 
                            label="Monthly Read Requests" 
                            tooltip="Total number of read requests per month."
                        >
                            <AWSSlider 
                                min={0} max={1000} 
                                value={attrs.ddbReadRequestUnits} 
                                onChange={(val) => updateAttribute('ddbReadRequestUnits', val)}
                                unit="Million RRU"
                                labels={["0", "500M", "1B"]}
                            />
                        </FormSection>
                    </div>
                )}
            </div>

             <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                    <span className="w-2 h-8 bg-green-500 rounded-full mr-3"></span>
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Data Transfer & Streams</h4>
                </div>
                
                 <div className="space-y-6">
                     <AWSToggle 
                        label="Enable DynamoDB Streams"
                        checked={attrs.ddbStreamsEnabled}
                        onChange={(val) => updateAttribute('ddbStreamsEnabled', val)}
                     />
                     
                     {attrs.ddbStreamsEnabled && (
                          <div className="pl-4 border-l-2 border-green-200 animate-in fade-in">
                               <FormSection 
                                label="Stream Read Requests"
                               >
                                <AWSSlider 
                                    min={0} max={500} 
                                    value={attrs.ddbStreamReads} 
                                    onChange={(val) => updateAttribute('ddbStreamReads', val)}
                                    unit="Million Reqs"
                                    labels={["0", "250M", "500M"]}
                                />
                               </FormSection>
                          </div>
                     )}

                    <div className="pt-4 border-t border-gray-100">
                        <FormSection 
                            label="Data Transfer Out" 
                            tooltip="Data transferred from DynamoDB to the internet."
                        >
                            <AWSSlider 
                                min={0} max={5000} 
                                value={attrs.ddbDataTransferOut} 
                                onChange={(val) => updateAttribute('ddbDataTransferOut', val)}
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