import React from 'react';
import { Accordion, FormSection, AWSSlider, AWSInput, AWSSelect } from '../ui/AWS';
import { ResourceConfig, ServiceType } from '../../types';
import { usePricing } from '../../contexts/PricingContext';

interface ElasticDRModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const ElasticDRArchitectureConfig: React.FC<ElasticDRModuleProps> = ({ config, onUpdate }) => {
  const attrs = config.attributes;
  const { getServiceOptions } = usePricing();
  // Elastic DR uses EC2 Instance Types for the replication server
  const instanceTypes = getServiceOptions(ServiceType.EC2, 'instance');

  const updateAttribute = (key: string, value: any) => {
    onUpdate({
        ...config,
        attributes: { ...attrs, [key]: value }
    });
  };

  return (
    <div className="space-y-6">
        {/* 1. Source Servers */}
        <Accordion title="Replication Configuration" defaultOpen={true}>
            <div className="space-y-6">
                <FormSection 
                    label="Resource Name" 
                    info="Identifier for this DR project"
                >
                     <AWSInput 
                        value={config.name} 
                        onChange={(e) => onUpdate({...config, name: e.target.value})} 
                        placeholder="My Disaster Recovery"
                    />
                </FormSection>

                <FormSection 
                    label="Source Servers" 
                    info="Number of servers replicating"
                    tooltip="Flat fee per replicating server per hour (~$20/month)."
                >
                     <AWSInput 
                        type="number" min={1}
                        value={attrs.drsSourceServerCount} 
                        onChange={(e) => updateAttribute('drsSourceServerCount', Number(e.target.value))}
                        unit="Servers"
                    />
                </FormSection>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormSection 
                        label="Replication Server Type" 
                        info="EC2 instance for data replication"
                        tooltip="Small EC2 instances used as staging area. t3.small is common for standard workloads."
                    >
                         <AWSSelect 
                            value={attrs.drsReplicationServerType} 
                            onChange={(e) => updateAttribute('drsReplicationServerType', e.target.value)}
                        >
                            {instanceTypes.map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </AWSSelect>
                    </FormSection>
                </div>
            </div>
        </Accordion>

        {/* 2. Retention */}
        <Accordion title="Retention Settings">
            <div className="space-y-6">
                <FormSection 
                    label="Point-in-Time Retention" 
                    info="Number of days to keep snapshots"
                    tooltip="Snapshots allow you to recover to a previous point in time. Stored as EBS Snapshots."
                >
                    <AWSSlider 
                        min={1} max={90} 
                        value={attrs.drsPointInTimeRetention} 
                        onChange={(val) => updateAttribute('drsPointInTimeRetention', val)}
                        unit="Days"
                        labels={["1", "45", "90"]}
                    />
                </FormSection>
            </div>
        </Accordion>
    </div>
  );
};

export const ElasticDRUsageConfig: React.FC<ElasticDRModuleProps> = ({ config, onUpdate }) => {
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
                    <span className="w-2 h-8 bg-green-500 rounded-full mr-3"></span>
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Data Change Rate</h4>
                </div>
                
                <div className="space-y-6">
                    <FormSection 
                        label="Average Daily Change Rate" 
                        tooltip="Percentage of disk data that changes daily. Affects snapshot storage costs."
                    >
                        <AWSSlider 
                            min={0} max={50} 
                            value={attrs.drsAvgChangeRate} 
                            onChange={(val) => updateAttribute('drsAvgChangeRate', val)}
                            unit="%"
                            labels={["0%", "25%", "50%"]}
                        />
                    </FormSection>
                </div>
            </div>
        </div>
    );
};