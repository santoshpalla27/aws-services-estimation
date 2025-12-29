import React from 'react';
import { Accordion, FormSection, AWSSlider, AWSInput, AWSToggle } from '../ui/AWS';
import { ResourceConfig } from '../../types';

interface S3ModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const S3ArchitectureConfig: React.FC<S3ModuleProps> = ({ config, onUpdate }) => {
  const attrs = config.attributes;

  const updateAttribute = (key: string, value: any) => {
    onUpdate({
        ...config,
        attributes: { ...attrs, [key]: value }
    });
  };

  const addBucket = () => {
      const newBucket = {
          id: `bkt-${Date.now()}`,
          name: `bucket-${(attrs.s3Buckets?.length || 0) + 1}`,
          standardStorage: 0,
          iaStorage: 0,
          glacierStorage: 0,
          deepArchiveStorage: 0,
          putRequests: 0,
          getRequests: 0,
          lifecycleTransitions: 0,
          versioning: false,
          dataTransferOut: 0
      };
      updateAttribute('s3Buckets', [...(attrs.s3Buckets || []), newBucket]);
  };

  const removeBucket = (id: string) => {
      updateAttribute('s3Buckets', attrs.s3Buckets.filter(b => b.id !== id));
  };

  const updateBucket = (id: string, field: string, value: any) => {
      const updated = attrs.s3Buckets.map(b => {
          if (b.id === id) return { ...b, [field]: value };
          return b;
      });
      updateAttribute('s3Buckets', updated);
  };

  return (
    <div className="space-y-6">
        <Accordion title="Buckets" defaultOpen={true}>
            <div className="space-y-6">
                <div className="space-y-4">
                    {attrs.s3Buckets && attrs.s3Buckets.map((bucket, index) => (
                        <div key={bucket.id} className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm relative group animate-in fade-in">
                            <div className="absolute top-3 right-3">
                                <button 
                                    onClick={() => removeBucket(bucket.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            
                            <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center">
                                <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-2 text-xs">{index + 1}</span>
                                {bucket.name}
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <AWSInput 
                                    label="Bucket Name" 
                                    value={bucket.name}
                                    onChange={(e) => updateBucket(bucket.id, 'name', e.target.value)}
                                />
                                <div className="flex items-center pt-6">
                                    <AWSToggle 
                                        label="Versioning Enabled" 
                                        checked={bucket.versioning}
                                        onChange={(val) => updateBucket(bucket.id, 'versioning', val)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <p className="text-xs font-semibold text-gray-500 uppercase border-b border-gray-100 pb-1">Storage Classes (GB)</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <AWSInput 
                                        label="Standard" 
                                        type="number" min={0}
                                        value={bucket.standardStorage}
                                        onChange={(e) => updateBucket(bucket.id, 'standardStorage', Number(e.target.value))}
                                    />
                                    <AWSInput 
                                        label="Standard-IA" 
                                        type="number" min={0}
                                        value={bucket.iaStorage}
                                        onChange={(e) => updateBucket(bucket.id, 'iaStorage', Number(e.target.value))}
                                    />
                                    <AWSInput 
                                        label="Glacier Flexible" 
                                        type="number" min={0}
                                        value={bucket.glacierStorage}
                                        onChange={(e) => updateBucket(bucket.id, 'glacierStorage', Number(e.target.value))}
                                    />
                                    <AWSInput 
                                        label="Deep Archive" 
                                        type="number" min={0}
                                        value={bucket.deepArchiveStorage}
                                        onChange={(e) => updateBucket(bucket.id, 'deepArchiveStorage', Number(e.target.value))}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    <button 
                        onClick={addBucket}
                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-aws-primary hover:text-aws-primary transition-colors text-sm font-medium flex items-center justify-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Add Bucket
                    </button>
                </div>
            </div>
        </Accordion>

        <Accordion title="Management Features">
            <div className="space-y-6">
                <FormSection 
                    label="S3 Inventory (Total)" 
                    tooltip="Aggregated count of objects across all buckets for inventory reports."
                >
                    <AWSInput 
                        type="number" min={0} step={0.1}
                        value={attrs.s3InventoryObjects}
                        onChange={(e) => updateAttribute('s3InventoryObjects', Number(e.target.value))}
                        unit="M Objs"
                    />
                </FormSection>
                <FormSection 
                    label="Analytics" 
                    tooltip="Storage Class Analysis."
                >
                    <AWSToggle 
                        label="Enable Analysis" 
                        checked={attrs.s3AnalyticsEnabled}
                        onChange={(val) => updateAttribute('s3AnalyticsEnabled', val)}
                    />
                </FormSection>
            </div>
        </Accordion>
    </div>
  );
};

export const S3UsageConfig: React.FC<S3ModuleProps> = ({ config, onUpdate }) => {
    const attrs = config.attributes;
    const updateAttribute = (key: string, value: any) => {
        onUpdate({
            ...config,
            attributes: { ...attrs, [key]: value }
        });
    };

    const updateBucket = (id: string, field: string, value: any) => {
        const updated = attrs.s3Buckets.map(b => {
            if (b.id === id) return { ...b, [field]: value };
            return b;
        });
        updateAttribute('s3Buckets', updated);
    };

    return (
        <div className="space-y-4">
            <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                    <span className="w-2 h-8 bg-yellow-500 rounded-full mr-3"></span>
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Per-Bucket Usage</h4>
                </div>
                
                <div className="space-y-6">
                    {attrs.s3Buckets && attrs.s3Buckets.map(bucket => (
                        <div key={bucket.id} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                            <h5 className="text-xs font-bold text-gray-500 uppercase mb-3">{bucket.name}</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <AWSInput 
                                    label="PUT/COPY/POST Requests"
                                    type="number" min={0}
                                    value={bucket.putRequests}
                                    onChange={(e) => updateBucket(bucket.id, 'putRequests', Number(e.target.value))}
                                    unit="Reqs"
                                />
                                <AWSInput 
                                    label="GET/SELECT Requests"
                                    type="number" min={0}
                                    value={bucket.getRequests}
                                    onChange={(e) => updateBucket(bucket.id, 'getRequests', Number(e.target.value))}
                                    unit="Reqs"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <AWSInput 
                                    label="Data Transfer Out (GB)"
                                    type="number" min={0}
                                    value={bucket.dataTransferOut}
                                    onChange={(e) => updateBucket(bucket.id, 'dataTransferOut', Number(e.target.value))}
                                    unit="GB"
                                />
                                <AWSInput 
                                    label="Lifecycle Transitions"
                                    type="number" min={0}
                                    value={bucket.lifecycleTransitions}
                                    onChange={(e) => updateBucket(bucket.id, 'lifecycleTransitions', Number(e.target.value))}
                                    unit="Reqs"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};