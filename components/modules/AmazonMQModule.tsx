import React from 'react';
import { Accordion, FormSection, AWSSlider, AWSInput, AWSSelect } from '../ui/AWS';
import { ResourceConfig, AmazonMQEngine, AmazonMQDeploymentMode, AmazonMQInstanceType } from '../../types';

interface AmazonMQModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const AmazonMQArchitectureConfig: React.FC<AmazonMQModuleProps> = ({ config, onUpdate }) => {
  const attrs = config.attributes;

  const updateAttribute = (key: string, value: any) => {
    onUpdate({
        ...config,
        attributes: { ...attrs, [key]: value }
    });
  };

  return (
    <div className="space-y-6">
        <Accordion title="Broker Configuration" defaultOpen={true}>
            <div className="space-y-6">
                <FormSection 
                    label="Broker Name" 
                    info="Identifier for this message broker"
                >
                     <AWSInput 
                        value={config.name} 
                        onChange={(e) => onUpdate({...config, name: e.target.value})} 
                        placeholder="My Broker"
                    />
                </FormSection>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <FormSection 
                        label="Broker Engine" 
                        info="Message broker type"
                    >
                         <AWSSelect 
                            value={attrs.mqEngine} 
                            onChange={(e) => updateAttribute('mqEngine', e.target.value)}
                        >
                            <option value={AmazonMQEngine.ACTIVEMQ}>Apache ActiveMQ</option>
                            <option value={AmazonMQEngine.RABBITMQ}>RabbitMQ</option>
                        </AWSSelect>
                    </FormSection>
                    
                    <FormSection 
                        label="Deployment Mode" 
                        info="Availability configuration"
                    >
                         <AWSSelect 
                            value={attrs.mqDeploymentMode} 
                            onChange={(e) => updateAttribute('mqDeploymentMode', e.target.value)}
                        >
                            <option value={AmazonMQDeploymentMode.SINGLE_INSTANCE}>Single Instance</option>
                            {attrs.mqEngine === AmazonMQEngine.ACTIVEMQ && (
                                <option value={AmazonMQDeploymentMode.ACTIVE_STANDBY_MULTI_AZ}>Active/Standby (Multi-AZ)</option>
                            )}
                            {attrs.mqEngine === AmazonMQEngine.RABBITMQ && (
                                <option value={AmazonMQDeploymentMode.CLUSTER_MULTI_AZ}>Cluster Deployment</option>
                            )}
                        </AWSSelect>
                    </FormSection>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                    <FormSection 
                        label="Instance Type" 
                        info="Compute capacity per node"
                    >
                         <AWSSelect 
                            value={attrs.mqInstanceType} 
                            onChange={(e) => updateAttribute('mqInstanceType', e.target.value)}
                        >
                            <option value={AmazonMQInstanceType.MQ_T3_MICRO}>mq.t3.micro</option>
                            <option value={AmazonMQInstanceType.MQ_M5_LARGE}>mq.m5.large</option>
                        </AWSSelect>
                    </FormSection>

                    {attrs.mqDeploymentMode === AmazonMQDeploymentMode.CLUSTER_MULTI_AZ && (
                        <FormSection 
                            label="Broker Count" 
                            info="Total nodes in cluster"
                        >
                            <AWSInput 
                                type="number" min={3}
                                value={attrs.mqBrokerCount} 
                                onChange={(e) => updateAttribute('mqBrokerCount', Number(e.target.value))}
                                unit="Nodes"
                            />
                        </FormSection>
                    )}
                </div>
            </div>
        </Accordion>

        <Accordion title="Storage">
            <div className="space-y-6">
                <FormSection 
                    label="Storage per Broker" 
                    tooltip="Amount of storage allocated to each broker node."
                >
                    <AWSSlider 
                        min={10} max={1000} 
                        value={attrs.mqStorage} 
                        onChange={(val) => updateAttribute('mqStorage', val)}
                        unit="GB"
                        labels={["10 GB", "500 GB", "1 TB"]}
                    />
                </FormSection>
            </div>
        </Accordion>
    </div>
  );
};

export const AmazonMQUsageConfig: React.FC<AmazonMQModuleProps> = ({ config, onUpdate }) => {
    return (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center text-sm text-gray-500">
            <p>Amazon MQ pricing is primarily based on broker instance hours and storage provisioned, configured in the Architecture tab.</p>
            <p className="mt-2">Data transfer costs apply but are typically accounted for in the VPC or Data Transfer services.</p>
        </div>
    );
};