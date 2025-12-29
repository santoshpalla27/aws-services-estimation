import React from 'react';
import { Accordion, AWSInput, AWSSelect } from '../ui/AWS';
import { ResourceConfig, AmazonMQEngine, AmazonMQDeploymentMode, ServiceType } from '../../types';
import { usePricing } from '../../contexts/PricingContext';

interface AmazonMQModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const AmazonMQArchitectureConfig: React.FC<AmazonMQModuleProps> = ({ config, onUpdate }) => {
  const attrs = config.attributes;
  const { getServiceOptions } = usePricing();
  const brokerTypes = getServiceOptions(ServiceType.MQ, 'broker');

  const updateAttribute = (key: string, value: any) => {
    onUpdate({
        ...config,
        attributes: { ...attrs, [key]: value }
    });
  };

  const addBroker = () => {
      const newBroker = {
          id: `mq-${Date.now()}`,
          name: `broker-${(attrs.mqBrokers?.length || 0) + 1}`,
          engine: AmazonMQEngine.ACTIVEMQ,
          deploymentMode: AmazonMQDeploymentMode.SINGLE_INSTANCE,
          instanceType: "mq.t3.micro",
          brokerCount: 1,
          storage: 10
      };
      updateAttribute('mqBrokers', [...(attrs.mqBrokers || []), newBroker]);
  };

  const removeBroker = (id: string) => {
      updateAttribute('mqBrokers', attrs.mqBrokers.filter(b => b.id !== id));
  };

  const updateBroker = (id: string, field: string, value: any) => {
      const updated = attrs.mqBrokers.map(b => {
          if (b.id === id) return { ...b, [field]: value };
          return b;
      });
      updateAttribute('mqBrokers', updated);
  };

  return (
    <div className="space-y-6">
        <Accordion title="Brokers" defaultOpen={true}>
            <div className="space-y-6">
                <div className="space-y-4">
                    {attrs.mqBrokers && attrs.mqBrokers.map((broker, index) => (
                        <div key={broker.id} className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm relative group animate-in fade-in">
                            <div className="absolute top-3 right-3">
                                <button 
                                    onClick={() => removeBroker(broker.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            
                            <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center">
                                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 text-xs">{index + 1}</span>
                                {broker.name}
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <AWSInput 
                                    label="Broker Name" 
                                    value={broker.name}
                                    onChange={(e) => updateBroker(broker.id, 'name', e.target.value)}
                                />
                                <AWSSelect 
                                    label="Engine" 
                                    value={broker.engine} 
                                    onChange={(e) => updateBroker(broker.id, 'engine', e.target.value)}
                                >
                                    <option value={AmazonMQEngine.ACTIVEMQ}>ActiveMQ</option>
                                    <option value={AmazonMQEngine.RABBITMQ}>RabbitMQ</option>
                                </AWSSelect>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <AWSSelect 
                                    label="Deployment Mode" 
                                    value={broker.deploymentMode} 
                                    onChange={(e) => updateBroker(broker.id, 'deploymentMode', e.target.value)}
                                >
                                    <option value={AmazonMQDeploymentMode.SINGLE_INSTANCE}>Single Instance</option>
                                    {broker.engine === AmazonMQEngine.ACTIVEMQ && (
                                        <option value={AmazonMQDeploymentMode.ACTIVE_STANDBY_MULTI_AZ}>Active/Standby (Multi-AZ)</option>
                                    )}
                                    {broker.engine === AmazonMQEngine.RABBITMQ && (
                                        <option value={AmazonMQDeploymentMode.CLUSTER_MULTI_AZ}>Cluster (Multi-AZ)</option>
                                    )}
                                </AWSSelect>
                                <AWSSelect 
                                    label="Instance Type" 
                                    value={broker.instanceType} 
                                    onChange={(e) => updateBroker(broker.id, 'instanceType', e.target.value)}
                                >
                                    {brokerTypes.map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </AWSSelect>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {broker.deploymentMode === AmazonMQDeploymentMode.CLUSTER_MULTI_AZ && (
                                    <AWSInput 
                                        label="Cluster Nodes" 
                                        type="number" min={3}
                                        value={broker.brokerCount}
                                        onChange={(e) => updateBroker(broker.id, 'brokerCount', Number(e.target.value))}
                                        unit="Nodes"
                                    />
                                )}
                                <AWSInput 
                                    label="Storage (GB)" 
                                    type="number" min={1}
                                    value={broker.storage}
                                    onChange={(e) => updateBroker(broker.id, 'storage', Number(e.target.value))}
                                    unit="GB"
                                />
                            </div>
                        </div>
                    ))}

                    <button 
                        onClick={addBroker}
                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-aws-primary hover:text-aws-primary transition-colors text-sm font-medium flex items-center justify-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Add Broker
                    </button>
                </div>
            </div>
        </Accordion>
    </div>
  );
};

export const AmazonMQUsageConfig: React.FC<AmazonMQModuleProps> = ({ config, onUpdate }) => {
    return (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center text-sm text-gray-500">
            <p>Amazon MQ pricing is primarily based on broker instance hours and storage provisioned, configured in the Architecture tab.</p>
        </div>
    );
};