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

  return (
    <div className="space-y-6">
        {/* 1. General Configuration */}
        <Accordion title="Bucket Configuration" defaultOpen={true}>
            <div className="space-y-6">
                <FormSection 
                    label="Bucket Name" 
                    info="Globally unique name for the bucket"
                    tooltip="A container for storing objects. Bucket names must be globally unique across all AWS accounts."
                >
                     <AWSInput 
                        value={config.name} 
                        onChange={(e) => onUpdate({...config, name: e.target.value})} 
                        placeholder="my-app-data-bucket"
                    />
                </FormSection>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <FormSection 
                        label="Versioning" 
                        tooltip="Keep multiple variants of an object in the same bucket. Increases storage costs as all versions are stored."
                    >
                         <AWSToggle 
                            label="Enable Bucket Versioning" 
                            checked={attrs.s3VersioningEnabled}
                            onChange={(val) => updateAttribute('s3VersioningEnabled', val)}
                        />
                    </FormSection>
                    
                    <FormSection 
                        label="Object Lock" 
                        tooltip="Prevent objects from being deleted or overwritten for a fixed amount of time or indefinitely (WORM)."
                    >
                         <AWSToggle 
                            label="Enable Object Lock" 
                            checked={attrs.s3ObjectLockEnabled}
                            onChange={(val) => updateAttribute('s3ObjectLockEnabled', val)}
                        />
                    </FormSection>
                </div>
            </div>
        </Accordion>

        {/* 2. Storage Classes */}
        <Accordion title="Storage Class Distribution">
             <div className="space-y-6">
                 <FormSection 
                    label="S3 Standard" 
                    info="General purpose storage for frequently accessed data"
                    tooltip="High durability, availability, and performance for frequently accessed data."
                 >
                     <AWSSlider 
                        min={0} max={100000} 
                        value={attrs.s3StandardStorage} 
                        onChange={(val) => updateAttribute('s3StandardStorage', val)}
                        unit="GB"
                        labels={["0", "50 TB", "100 TB"]}
                    />
                 </FormSection>
                 
                 <FormSection 
                    label="S3 Standard-IA" 
                    info="Infrequent Access"
                    tooltip="For data that is accessed less frequently, but requires rapid access when needed. Lower storage cost, higher retrieval cost."
                 >
                     <AWSSlider 
                        min={0} max={100000} 
                        value={attrs.s3InfrequentAccessStorage} 
                        onChange={(val) => updateAttribute('s3InfrequentAccessStorage', val)}
                        unit="GB"
                        labels={["0", "50 TB", "100 TB"]}
                    />
                 </FormSection>

                 <div className="pt-4 border-t border-gray-100">
                    <FormSection 
                        label="Archival Storage (Glacier)" 
                        info="Low cost storage for data archiving"
                        tooltip="Secure, durable, and low-cost storage classes for data archiving. Long retrieval times for Deep Archive."
                    >
                        <div className="space-y-6">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Glacier Flexible Retrieval</label>
                                <AWSSlider 
                                    min={0} max={100000} 
                                    value={attrs.s3GlacierStorage} 
                                    onChange={(val) => updateAttribute('s3GlacierStorage', val)}
                                    unit="GB"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Glacier Deep Archive</label>
                                <AWSSlider 
                                    min={0} max={100000} 
                                    value={attrs.s3DeepArchiveStorage} 
                                    onChange={(val) => updateAttribute('s3DeepArchiveStorage', val)}
                                    unit="GB"
                                />
                            </div>
                        </div>
                    </FormSection>
                 </div>
             </div>
        </Accordion>

        {/* 3. Management & Features */}
        <Accordion title="Management & Features">
            <div className="space-y-6">
                <FormSection 
                    label="S3 Inventory" 
                    tooltip="Scheduled reports listing objects and their metadata. Charged per million objects listed."
                >
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-600">Total Object Count (Millions)</label>
                        <AWSInput 
                            type="number" min={0} step={0.1}
                            value={attrs.s3InventoryObjects}
                            onChange={(e) => updateAttribute('s3InventoryObjects', Number(e.target.value))}
                            unit="M Objs"
                        />
                    </div>
                </FormSection>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                    <FormSection 
                        label="Analytics" 
                        tooltip="Storage Class Analysis to visualize data access patterns."
                    >
                        <AWSToggle 
                            label="Enable Storage Class Analysis" 
                            checked={attrs.s3AnalyticsEnabled}
                            onChange={(val) => updateAttribute('s3AnalyticsEnabled', val)}
                        />
                    </FormSection>
                    
                     <FormSection 
                        label="Transfer Acceleration" 
                        tooltip="Enables fast, easy, and secure transfers of files over long distances between your client and your S3 bucket."
                    >
                        <div className="flex flex-col gap-2">
                             <div className="text-sm font-medium text-gray-700">Accelerated Transfer Amount</div>
                             <AWSInput 
                                type="number" min={0}
                                value={attrs.s3DataTransferAcceleration}
                                onChange={(e) => updateAttribute('s3DataTransferAcceleration', Number(e.target.value))}
                                unit="GB/Mo"
                            />
                        </div>
                    </FormSection>
                </div>
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

    return (
        <div className="space-y-4">
            {/* Requests */}
            <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                    <span className="w-2 h-8 bg-yellow-500 rounded-full mr-3"></span>
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">API Requests</h4>
                </div>
                
                <div className="space-y-6">
                    <FormSection 
                        label="PUT, COPY, POST, LIST" 
                        info="Heavy API requests"
                        tooltip="Requests that add or list data. These are more expensive ($0.005/1000)."
                    >
                        <AWSSlider 
                            min={0} max={1000000} 
                            value={attrs.s3PutRequests} 
                            onChange={(val) => updateAttribute('s3PutRequests', val)}
                            unit="Reqs"
                            labels={["0", "500k", "1M"]}
                        />
                    </FormSection>

                    <FormSection 
                        label="GET, SELECT, and Other" 
                        info="Retrieval API requests"
                        tooltip="Requests to retrieve data. Less expensive ($0.0004/1000)."
                    >
                        <AWSSlider 
                            min={0} max={10000000} 
                            value={attrs.s3GetRequests} 
                            onChange={(val) => updateAttribute('s3GetRequests', val)}
                            unit="Reqs"
                            labels={["0", "5M", "10M"]}
                        />
                    </FormSection>
                    
                     <FormSection 
                        label="Lifecycle Transitions" 
                        tooltip="Requests generated by lifecycle rules moving objects between storage classes."
                    >
                        <AWSInput 
                            type="number" min={0}
                            label="Transition Requests"
                            value={attrs.s3LifecycleTransitions}
                            onChange={(e) => updateAttribute('s3LifecycleTransitions', Number(e.target.value))}
                            unit="Reqs"
                        />
                    </FormSection>
                </div>
            </div>

            {/* Data Transfer */}
            <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                    <span className="w-2 h-8 bg-green-500 rounded-full mr-3"></span>
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Data Transfer</h4>
                </div>
                <FormSection 
                    label="Data Transfer Out" 
                    tooltip="Amount of data transferred from S3 to the Internet."
                >
                    <AWSSlider 
                        min={0} max={10000} 
                        value={attrs.s3DataTransferOut} 
                        onChange={(val) => updateAttribute('s3DataTransferOut', val)}
                        unit="GB/mo"
                        labels={["0", "10 TB"]}
                    />
                </FormSection>

                 <div className="pt-4 mt-2 border-t border-gray-100">
                    <FormSection 
                        label="Replication Data (CRR)" 
                        tooltip="Data transferred to another region via Cross-Region Replication."
                    >
                        <AWSSlider 
                            min={0} max={5000} 
                            value={attrs.s3ReplicationData} 
                            onChange={(val) => updateAttribute('s3ReplicationData', val)}
                            unit="GB/mo"
                            labels={["0", "5 TB"]}
                        />
                    </FormSection>
                </div>
            </div>
        </div>
    );
};