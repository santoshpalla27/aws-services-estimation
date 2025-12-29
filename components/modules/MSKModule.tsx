import React from 'react';
import { Accordion, FormSection, AWSSlider, AWSInput, AWSSelect } from '../ui/AWS';
import { ResourceConfig, MSKBrokerNodeType } from '../../types';

interface MSKModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const MSKArchitectureConfig: React.FC<MSKModuleProps> = ({ config, onUpdate }) => {
  const attrs = config.attributes;

  const updateAttribute = (key: string, value: any) => {
    onUpdate({
        ...config,
        attributes: { ...attrs, [key]: value }
    });
  };

  return (
    <div className="space-y-6">
        {/* 1. Cluster Settings */}
        <Accordion title="Cluster Configuration" defaultOpen={true}>
            <div className="space-y-6">
                <FormSection 
                    label="Cluster Name" 
                    info="Identifier for this MSK cluster"
                >
                     <AWSInput 
                        value={config.name} 
                        onChange={(e) => onUpdate({...config, name: e.target.value})} 
                        placeholder="My Kafka Cluster"
                    />
                </FormSection>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <FormSection 
                        label="Broker Node Type" 
                        info="Instance size for brokers"
                        tooltip="The instance type to use for the brokers. Larger instances have more CPU, memory, and network bandwidth."
                    >
                         <AWSSelect 
                            value={attrs.mskBrokerNodeType} 
                            onChange={(e) => updateAttribute('mskBrokerNodeType', e.target.value)}
                        >
                            <option value={MSKBrokerNodeType.KAFKA_T3_SMALL}>kafka.t3.small (Testing)</option>
                            <option value={MSKBrokerNodeType.KAFKA_M5_LARGE}>kafka.m5.large</option>
                            <option value={MSKBrokerNodeType.KAFKA_M5_XLARGE}>kafka.m5.xlarge</option>
                            <option value={MSKBrokerNodeType.KAFKA_M5_2XLARGE}>kafka.m5.2xlarge</option>
                        </AWSSelect>
                    </FormSection>
                    
                    <FormSection 
                        label="Number of Brokers" 
                        info="Total brokers in cluster"
                        tooltip="Total number of broker nodes in the cluster. For high availability, deploy at least 2 brokers (one per AZ)."
                    >
                         <AWSInput 
                            type="number" min={1}
                            value={attrs.mskBrokerNodes} 
                            onChange={(e) => updateAttribute('mskBrokerNodes', Number(e.target.value))}
                            unit="Brokers"
                        />
                    </FormSection>
                </div>
            </div>
        </Accordion>

        {/* 2. Storage */}
        <Accordion title="Storage">
            <div className="space-y-6">
                <FormSection 
                    label="Storage per Broker" 
                    tooltip="Amount of EBS storage attached to each broker node. Total storage = Brokers * Storage Per Broker."
                >
                    <AWSSlider 
                        min={100} max={16000} 
                        value={attrs.mskStoragePerBroker} 
                        onChange={(val) => updateAttribute('mskStoragePerBroker', val)}
                        unit="GB"
                        labels={["100 GB", "8 TB", "16 TB"]}
                    />
                </FormSection>
            </div>
        </Accordion>
    </div>
  );
};

export const MSKUsageConfig: React.FC<MSKModuleProps> = ({ config, onUpdate }) => {
    // MSK (Provisioned) doesn't have many variable usage costs outside of data transfer, 
    // which we typically handle generically or omit for simplicity in this specific module 
    // unless cross-AZ traffic is explicitly modeled.
    return (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center text-sm text-gray-500">
            <p>For Provisioned MSK clusters, costs are primarily driven by the number of brokers and provisioned storage.</p>
            <p className="mt-2">Standard AWS data transfer rates apply for cross-AZ or cross-region traffic.</p>
        </div>
    );
};