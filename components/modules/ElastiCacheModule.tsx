import React from 'react';
import { Accordion, FormSection, AWSSlider, AWSInput, AWSSelect } from '../ui/AWS';
import { ResourceConfig, ElastiCacheEngine, ElastiCacheNodeType } from '../../types';

interface ElastiCacheModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const ElastiCacheArchitectureConfig: React.FC<ElastiCacheModuleProps> = ({ config, onUpdate }) => {
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
        <Accordion title="Cluster Settings" defaultOpen={true}>
            <div className="space-y-6">
                <FormSection 
                    label="Cluster Name" 
                    info="Identifier for this cache cluster"
                >
                     <AWSInput 
                        value={config.name} 
                        onChange={(e) => onUpdate({...config, name: e.target.value})} 
                        placeholder="my-redis-cluster"
                    />
                </FormSection>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <FormSection 
                        label="Engine" 
                        info="Cache engine compatibility"
                    >
                         <AWSSelect 
                            value={attrs.elastiCacheEngine} 
                            onChange={(e) => updateAttribute('elastiCacheEngine', e.target.value)}
                        >
                            <option value={ElastiCacheEngine.REDIS}>Redis</option>
                            <option value={ElastiCacheEngine.MEMCACHED}>Memcached</option>
                        </AWSSelect>
                    </FormSection>
                    
                    <FormSection 
                        label="Node Type" 
                        info="Compute and memory capacity"
                    >
                         <AWSSelect 
                            value={attrs.elastiCacheNodeType} 
                            onChange={(e) => updateAttribute('elastiCacheNodeType', e.target.value)}
                        >
                            {Object.values(ElastiCacheNodeType).map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </AWSSelect>
                    </FormSection>
                </div>

                <div className="pt-4 border-t border-gray-100">
                    <FormSection 
                        label="Number of Nodes" 
                        tooltip="Total number of cache nodes in the cluster (including replicas)."
                    >
                        <AWSInput 
                            type="number" min={1}
                            value={attrs.elastiCacheNodeCount} 
                            onChange={(e) => updateAttribute('elastiCacheNodeCount', Number(e.target.value))}
                            unit="Nodes"
                        />
                    </FormSection>
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

    return (
        <div className="space-y-4">
            {attrs.elastiCacheEngine === ElastiCacheEngine.REDIS ? (
                <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
                    <div className="flex items-center mb-4">
                        <span className="w-2 h-8 bg-blue-600 rounded-full mr-3"></span>
                        <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Backup Storage</h4>
                    </div>
                    
                    <FormSection 
                        label="Snapshot Storage" 
                        tooltip="Storage for backup snapshots. One backup roughly equivalent to the size of data in memory is free per active cluster."
                    >
                        <AWSSlider 
                            min={0} max={1000} 
                            value={attrs.elastiCacheSnapshotStorage} 
                            onChange={(val) => updateAttribute('elastiCacheSnapshotStorage', val)}
                            unit="GB/Mo"
                            labels={["0", "500 GB", "1 TB"]}
                        />
                    </FormSection>
                </div>
            ) : (
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center text-sm text-gray-500">
                    Memcached does not support persistence or backups. Usage costs are primarily determined by node uptime configured in the Architecture tab.
                </div>
            )}
        </div>
    );
};