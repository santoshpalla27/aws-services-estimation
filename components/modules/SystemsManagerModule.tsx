import React from 'react';
import { Accordion, FormSection, AWSSlider, AWSInput } from '../ui/AWS';
import { ResourceConfig } from '../../types';

interface SSMModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const SystemsManagerArchitectureConfig: React.FC<SSMModuleProps> = ({ config, onUpdate }) => {
  const attrs = config.attributes;

  const updateAttribute = (key: string, value: any) => {
    onUpdate({
        ...config,
        attributes: { ...attrs, [key]: value }
    });
  };

  return (
    <div className="space-y-6">
        {/* 1. Node Management */}
        <Accordion title="Node Management" defaultOpen={true}>
            <div className="space-y-6">
                <FormSection 
                    label="Resource Name" 
                    info="Identifier for this SSM configuration"
                >
                     <AWSInput 
                        value={config.name} 
                        onChange={(e) => onUpdate({...config, name: e.target.value})} 
                        placeholder="My Systems Manager"
                    />
                </FormSection>

                <FormSection 
                    label="Advanced On-Premises Instances" 
                    info="Hybrid/Multicloud instances"
                    tooltip="Number of on-premises or non-AWS instances managed by Systems Manager (Advanced Tier). Includes Session Manager interactive shell access. ~$5/instance/month."
                >
                     <AWSInput 
                        type="number" min={0}
                        value={attrs.ssmAdvancedInstances}
                        onChange={(e) => updateAttribute('ssmAdvancedInstances', Number(e.target.value))}
                        unit="Instances"
                    />
                </FormSection>
            </div>
        </Accordion>

        {/* 2. Application Management */}
        <Accordion title="Parameter Store">
            <div className="space-y-6">
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                    <p className="text-sm text-gray-600 mb-4">
                        Standard parameters (up to 4KB, standard throughput) are free. Advanced parameters (larger size, policies, high throughput) incur costs.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormSection 
                            label="Advanced Parameters" 
                            tooltip="Number of parameters configured as Advanced (e.g. >4KB or using policies). $0.05/parameter/month."
                        >
                            <AWSInput 
                                type="number" min={0}
                                value={attrs.ssmParameterStoreAdvancedCount} 
                                onChange={(e) => updateAttribute('ssmParameterStoreAdvancedCount', Number(e.target.value))}
                                unit="Params"
                            />
                        </FormSection>

                        <FormSection 
                            label="API Interactions (High Throughput)" 
                            tooltip="Total number of GetParameter/GetParameters API calls using High Throughput. $0.05 per 10,000 interactions."
                        >
                            <AWSSlider 
                                min={0} max={100} 
                                value={attrs.ssmParameterStoreAPIGets} 
                                onChange={(val) => updateAttribute('ssmParameterStoreAPIGets', val)}
                                unit="Million API Calls"
                                labels={["0", "50M", "100M"]}
                            />
                        </FormSection>
                    </div>
                </div>
            </div>
        </Accordion>
    </div>
  );
};

export const SystemsManagerUsageConfig: React.FC<SSMModuleProps> = ({ config, onUpdate }) => {
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
                    <span className="w-2 h-8 bg-blue-600 rounded-full mr-3"></span>
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Operations Management</h4>
                </div>
                
                <div className="space-y-6">
                    <FormSection 
                        label="OpsCenter OpsItems" 
                        tooltip="Number of operational issues (OpsItems) created/updated per month. ~$2.97 per 1000 items."
                    >
                        <AWSInput 
                            type="number" min={0}
                            value={attrs.ssmOpsItems} 
                            onChange={(e) => updateAttribute('ssmOpsItems', Number(e.target.value))}
                            unit="Items"
                        />
                    </FormSection>

                    <FormSection 
                        label="Automation Steps" 
                        tooltip="Total number of steps executed in Automation runbooks. First 100,000 steps are free."
                    >
                        <AWSSlider 
                            min={0} max={1000} 
                            value={attrs.ssmAutomationSteps} 
                            onChange={(val) => updateAttribute('ssmAutomationSteps', val)}
                            unit="Thousand Steps"
                            labels={["0", "500k", "1M"]}
                        />
                    </FormSection>

                    <div className="pt-4 border-t border-gray-100">
                        <FormSection 
                            label="Change Manager Requests" 
                            tooltip="Number of change requests created. ~$0.296 per request."
                        >
                            <AWSInput 
                                type="number" min={0}
                                value={attrs.ssmChangeManagerRequests} 
                                onChange={(e) => updateAttribute('ssmChangeManagerRequests', Number(e.target.value))}
                                unit="Requests"
                            />
                        </FormSection>
                    </div>
                </div>
            </div>
        </div>
    );
};