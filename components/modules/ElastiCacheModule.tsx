import React from 'react';
import { Accordion, FormSection, AWSSlider, AWSInput, AWSSelect, AWSButton } from '../ui/AWS';
import { ResourceConfig, ElastiCacheEngine, ServiceType } from '../../types';
import { usePricing } from '../../contexts/PricingContext';

interface ElastiCacheModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const ElastiCacheArchitectureConfig: React.FC<ElastiCacheModuleProps> = ({ config, onUpdate }) => {
  const attrs = config.attributes;
  const { getServiceOptions } = usePricing();
  const nodeTypes = getServiceOptions(ServiceType.ELASTICACHE, 'node');

  const updateAttribute = (key: string, value: any) => {
    onUpdate({
        ...config,
        attributes: { ...attrs, [key]: value }
    });
  };

  const addCluster = () => {
      const newCluster = {
          id: `cache-${Date.now()}`,
          name: `cluster-${(attrs.elastiCacheClusters?.length || 0) + 1}`,
          engine: ElastiCacheEngine.REDIS,
          nodeType: "cache.t3.micro",
          nodeCount: 1,
          snapshotStorage: 0
      };
      updateAttribute('elastiCacheClusters', [...(attrs.elastiCacheClusters || []), newCluster]);
  };

  const removeCluster = (id: string) => {
      updateAttribute('elastiCacheClusters', attrs.elastiCacheClusters.filter(c => c.id !== id));
  };

  const updateCluster = (id: string, field: string, value: any) => {
      const updated = attrs.elastiCacheClusters.map(c => {
          if (c.id === id) return { ...c, [field]: value };
          return c;
      });
      updateAttribute('elastiCacheClusters', updated);
  };

  return (
    <div className="space-y-6">
        <Accordion title="Cache Clusters" defaultOpen={true}>
            <div className="space-y-6">
                <div className="space-y-4">
                    {attrs.elastiCacheClusters && attrs.elastiCacheClusters.map((cluster, index) => (
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
                                <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center mr-2 text-xs">{index + 1}</span>
                                {cluster.name}
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <AWSInput 
                                    label="Cluster Name" 
                                    value={cluster.name}
                                    onChange={(e) => updateCluster(cluster.id, 'name', e.target.value)}
                                />
                                <AWSSelect 
                                    label="Engine" 
                                    value={cluster.engine} 
                                    onChange={(e) => updateCluster(cluster.id, 'engine', e.target.value)}
                                >
                                    <option value={ElastiCacheEngine.REDIS}>Redis</option>
                                    <option value={ElastiCacheEngine.MEMCACHED}>Memcached</option>
                                </AWSSelect>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <AWSSelect 
                                    label="Node Type" 
                                    value={cluster.nodeType} 
                                    onChange={(e) => updateCluster(cluster.id, 'nodeType', e.target.value)}
                                >
                                    {nodeTypes.map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </AWSSelect>
                                <AWSInput 
                                    label="Number of Nodes" 
                                    type="number" min={1}
                                    value={cluster.nodeCount} 
                                    onChange={(e) => updateCluster(cluster.id, 'nodeCount', Number(e.target.value))}
                                    unit="Nodes"
                                />
                            </div>
                        </div>
                    ))}

                    <button 
                        onClick={addCluster}
                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-aws-primary hover:text-aws-primary transition-colors text-sm font-medium flex items-center justify-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Add Cache Cluster
                    </button>
                </div>
            </div>
        </Accordion>
    </div>
  );
};

export const ElastiCacheUsageConfig: React.FC<ElastiCacheModuleProps> = ({ config, onUpdate }) => {
    const attrs = config.attributes;
    const updateAttribute = (key: string, value: any) => {
        onUpdate({
            ...config,
            attributes: { ...attrs, [key]: value }
        });
    };

    const updateCluster = (id: string, field: string, value: any) => {
        const updated = attrs.elastiCacheClusters.map(c => {
            if (c.id === id) return { ...c, [field]: value };
            return c;
        });
        updateAttribute('elastiCacheClusters', updated);
    };

    return (
        <div className="space-y-4">
            <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                    <span className="w-2 h-8 bg-blue-600 rounded-full mr-3"></span>
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Backup Storage</h4>
                </div>
                
                <div className="space-y-6">
                    {attrs.elastiCacheClusters && attrs.elastiCacheClusters.map(cluster => (
                        cluster.engine === ElastiCacheEngine.REDIS ? (
                            <div key={cluster.id} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                                <h5 className="text-xs font-bold text-gray-500 uppercase mb-3">{cluster.name}</h5>
                                <FormSection 
                                    label="Snapshot Storage" 
                                    tooltip="Storage for backup snapshots."
                                >
                                    <AWSSlider 
                                        min={0} max={1000} 
                                        value={cluster.snapshotStorage} 
                                        onChange={(val) => updateCluster(cluster.id, 'snapshotStorage', val)}
                                        unit="GB/Mo"
                                        labels={["0", "500 GB", "1 TB"]}
                                    />
                                </FormSection>
                            </div>
                        ) : null
                    ))}
                    
                    {(!attrs.elastiCacheClusters || attrs.elastiCacheClusters.every(c => c.engine === ElastiCacheEngine.MEMCACHED)) && (
                        <p className="text-sm text-gray-500 italic">No Redis clusters configured. Memcached does not support backups.</p>
                    )}
                </div>
            </div>
        </div>
    );
};