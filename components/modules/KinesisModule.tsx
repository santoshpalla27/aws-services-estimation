import React from 'react';
import { Accordion, FormSection, AWSSlider, AWSInput, AWSSelect, AWSToggle } from '../ui/AWS';
import { ResourceConfig, KinesisStreamMode } from '../../types';

interface KinesisModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const KinesisArchitectureConfig: React.FC<KinesisModuleProps> = ({ config, onUpdate }) => {
  const attrs = config.attributes;

  const updateAttribute = (key: string, value: any) => {
    onUpdate({
        ...config,
        attributes: { ...attrs, [key]: value }
    });
  };

  return (
    <div className="space-y-6">
        {/* 1. Stream Configuration */}
        <Accordion title="Data Stream Configuration" defaultOpen={true}>
            <div className="space-y-6">
                <FormSection 
                    label="Stream Name" 
                    info="Identifier for this Kinesis Data Stream"
                >
                     <AWSInput 
                        value={config.name} 
                        onChange={(e) => onUpdate({...config, name: e.target.value})} 
                        placeholder="My Data Stream"
                    />
                </FormSection>

                <FormSection 
                    label="Capacity Mode" 
                    info="Choose between Provisioned and On-Demand"
                    tooltip="Provisioned requires specifying shards. On-Demand scales automatically."
                >
                     <AWSSelect 
                        value={attrs.kinesisStreamMode} 
                        onChange={(e) => updateAttribute('kinesisStreamMode', e.target.value)}
                    >
                        <option value={KinesisStreamMode.PROVISIONED}>Provisioned</option>
                        <option value={KinesisStreamMode.ON_DEMAND}>On-Demand</option>
                    </AWSSelect>
                </FormSection>

                {attrs.kinesisStreamMode === KinesisStreamMode.PROVISIONED && (
                    <div className="pl-4 border-l-2 border-aws-link animate-in fade-in">
                        <FormSection 
                            label="Number of Shards" 
                            tooltip="One shard provides 1MB/s ingestion and 2MB/s egress capacity."
                        >
                            <AWSInput 
                                type="number" min={1}
                                value={attrs.kinesisShardCount} 
                                onChange={(e) => updateAttribute('kinesisShardCount', Number(e.target.value))}
                                unit="Shards"
                            />
                        </FormSection>
                    </div>
                )}
            </div>
        </Accordion>

        {/* 2. Retention & Consumers */}
        <Accordion title="Retention & Consumers">
            <div className="space-y-6">
                <FormSection 
                    label="Data Retention Period" 
                    info="How long data records are accessible"
                    tooltip="Default is 24 hours. Extended retention up to 365 days incurs additional costs."
                >
                    <AWSSlider 
                        min={24} max={8760} 
                        value={attrs.kinesisDataRetentionHours} 
                        onChange={(val) => updateAttribute('kinesisDataRetentionHours', val)}
                        unit="Hours"
                        labels={["24h", "6 Mo", "1 Yr"]}
                    />
                </FormSection>

                <div className="pt-4 border-t border-gray-100">
                    <FormSection 
                        label="Enhanced Fan-Out" 
                        tooltip="Dedicated throughput for consumers. Charges apply per consumer-shard hour and per GB retrieved."
                    >
                        <div className="space-y-4">
                            <AWSToggle 
                                label="Enable Enhanced Fan-Out" 
                                checked={attrs.kinesisEnhancedFanOut}
                                onChange={(val) => updateAttribute('kinesisEnhancedFanOut', val)}
                            />
                            
                            {attrs.kinesisEnhancedFanOut && (
                                <div className="pl-4 border-l-2 border-aws-link animate-in fade-in">
                                    <AWSInput 
                                        label="Number of Consumers"
                                        type="number" min={1}
                                        value={attrs.kinesisConsumerCount}
                                        onChange={(e) => updateAttribute('kinesisConsumerCount', Number(e.target.value))}
                                        unit="Consumers"
                                    />
                                </div>
                            )}
                        </div>
                    </FormSection>
                </div>
            </div>
        </Accordion>
    </div>
  );
};

export const KinesisUsageConfig: React.FC<KinesisModuleProps> = ({ config, onUpdate }) => {
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
                    <span className="w-2 h-8 bg-blue-500 rounded-full mr-3"></span>
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Throughput</h4>
                </div>
                
                <div className="space-y-6">
                    <FormSection 
                        label="Data Processed" 
                        tooltip="Total volume of data ingested into the stream per month."
                    >
                        <AWSSlider 
                            min={0} max={5000} 
                            value={attrs.kinesisDataProcessed} 
                            onChange={(val) => updateAttribute('kinesisDataProcessed', val)}
                            unit="GB/Mo"
                            labels={["0", "2.5 TB", "5 TB"]}
                        />
                    </FormSection>
                </div>
            </div>
        </div>
    );
};