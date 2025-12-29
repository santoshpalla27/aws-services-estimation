import React from 'react';
import { Accordion, AWSInput, AWSSelect } from '../ui/AWS';
import { ResourceConfig, ServiceType } from '../../types';
import { usePricing } from '../../contexts/PricingContext';

interface MSKModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const MSKArchitectureConfig: React.FC<MSKModuleProps> = ({ config, onUpdate }) => {
  const attrs = config.attributes;
  const { getServiceOptions } = usePricing();
  const brokerTypes = getServiceOptions(ServiceType.MSK, 'broker');

  const updateAttribute = (key: string, value: any) => {
    onUpdate({
        ...config,
        attributes: { ...attrs, [key]: value }
    });
  };

  const addCluster = () => {
      const newCluster = {
          id: `msk-${Date.now()}`,
          name: `cluster-${(attrs.mskClusters?.length || 0) + 1}`,
          brokerNodeType: "kafka.m5.large",
          brokerNodes: 2,
          storagePerBroker: 1000
      };
      updateAttribute('mskClusters', [...(attrs.mskClusters || []), newCluster]);
  };

  const removeCluster = (id: string) => {
      updateAttribute('mskClusters', attrs.mskClusters.filter(c => c.id !== id));
  };

  const updateCluster = (id: string, field: string, value: any) => {
      const updated = attrs.mskClusters.map(c => {
          if (c.id === id) return { ...c, [field]: value };
          return c;
      });
      updateAttribute('mskClusters', updated);
  };

  return (
    <div className="space-y-6">
        <Accordion title="MSK Clusters" defaultOpen={true}>
            <div className="space-y-6">
                <div className="space-y-4">
                    {attrs.mskClusters && attrs.mskClusters.map((cluster, index) => (
                        <div key={cluster.id} className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm relative group animate-in fade-in">
                            <div className="absolute top-3 right-3">
                                <button 
                                    onClick={() => removeCluster(cluster.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            
                            <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center">
                                <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mr-2 text-xs">{index + 1}</span>
                                {cluster.name}
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <AWSInput 
                                    label="Cluster Name" 
                                    value={cluster.name}
                                    onChange={(e) => updateCluster(cluster.id, 'name', e.target.value)}
                                />
                                <AWSSelect 
                                    label="Broker Type" 
                                    value={cluster.brokerNodeType} 
                                    onChange={(e) => updateCluster(cluster.id, 'brokerNodeType', e.target.value)}
                                >
                                    {brokerTypes.map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </AWSSelect>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <AWSInput 
                                    label="Broker Nodes" 
                                    type="number" min={1}
                                    value={cluster.brokerNodes} 
                                    onChange={(e) => updateCluster(cluster.id, 'brokerNodes', Number(e.target.value))}
                                    unit="Nodes"
                                />
                                <AWSInput 
                                    label="Storage Per Broker (GB)" 
                                    type="number" min={1}
                                    value={cluster.storagePerBroker} 
                                    onChange={(e) => updateCluster(cluster.id, 'storagePerBroker', Number(e.target.value))}
                                    unit="GB"
                                />
                            </div>
                        </div>
                    ))}

                    <button 
                        onClick={addCluster}
                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-aws-primary hover:text-aws-primary transition-colors text-sm font-medium flex items-center justify-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Add MSK Cluster
                    </button>
                </div>
            </div>
        </Accordion>
    </div>
  );
};

export const MSKUsageConfig: React.FC<MSKModuleProps> = ({ config, onUpdate }) => {
    return (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center text-sm text-gray-500">
            <p>For Provisioned MSK clusters, costs are primarily driven by the number of brokers and provisioned storage configured in the Architecture tab.</p>
        </div>
    );
};