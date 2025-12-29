import React from 'react';
import { Accordion, FormSection, AWSSlider, AWSInput, AWSSelect, AWSToggle } from '../ui/AWS';
import { ResourceConfig, InstanceType } from '../../types';

interface ASGModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const ASGArchitectureConfig: React.FC<ASGModuleProps> = ({ config, onUpdate }) => {
  const attrs = config.attributes;

  const updateAttribute = (key: string, value: any) => {
    onUpdate({
        ...config,
        attributes: { ...attrs, [key]: value }
    });
  };

  return (
    <div className="space-y-6">
        {/* 1. Launch Template / Configuration */}
        <Accordion title="Launch Configuration" defaultOpen={true}>
            <div className="space-y-6">
                <FormSection 
                    label="Auto Scaling Group Name" 
                    info="Identifier for this ASG"
                >
                     <AWSInput 
                        value={config.name} 
                        onChange={(e) => onUpdate({...config, name: e.target.value})} 
                        placeholder="My App ASG"
                    />
                </FormSection>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <FormSection 
                        label="Instance Type" 
                        info="Compute capacity"
                        tooltip="The EC2 instance type used by the Auto Scaling Group."
                    >
                         <AWSSelect 
                            value={attrs.asgInstanceType} 
                            onChange={(e) => updateAttribute('asgInstanceType', e.target.value)}
                        >
                            {Object.values(InstanceType).map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </AWSSelect>
                    </FormSection>
                    
                    <FormSection 
                        label="Purchase Option" 
                        info="On-Demand or Spot"
                        tooltip="Spot instances allow you to request unused EC2 instances at steep discounts."
                    >
                         <AWSSelect 
                            value={attrs.asgPurchaseOption} 
                            onChange={(e) => updateAttribute('asgPurchaseOption', e.target.value)}
                        >
                            <option value="On-Demand">On-Demand</option>
                            <option value="Spot">Spot Instances</option>
                        </AWSSelect>
                    </FormSection>
                </div>

                {attrs.asgPurchaseOption === 'Spot' && (
                    <div className="pl-4 border-l-2 border-purple-200 animate-in fade-in">
                        <FormSection label="Estimated Discount %">
                            <AWSSlider 
                                min={0} max={90} 
                                value={attrs.asgSpotPercentage} 
                                onChange={(val) => updateAttribute('asgSpotPercentage', val)}
                                unit="%"
                                labels={["0%", "90%"]}
                            />
                        </FormSection>
                    </div>
                )}
            </div>
        </Accordion>

        {/* 2. Scaling Limits */}
        <Accordion title="Group Size & Scaling">
            <div className="space-y-6">
                <FormSection 
                    label="Desired Capacity" 
                    info="Initial and baseline instance count"
                    tooltip="The number of instances that the ASG attempts to maintain. Cost estimation uses this number as the average running count."
                >
                     <AWSInput 
                        type="number" min={0}
                        value={attrs.asgDesiredCapacity} 
                        onChange={(e) => updateAttribute('asgDesiredCapacity', Number(e.target.value))}
                        unit="Instances"
                    />
                </FormSection>
            </div>
        </Accordion>
    </div>
  );
};

export const ASGUsageConfig: React.FC<ASGModuleProps> = ({ config, onUpdate }) => {
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
                    <span className="w-2 h-8 bg-purple-500 rounded-full mr-3"></span>
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Monitoring</h4>
                </div>
                
                <div className="space-y-6">
                    <AWSToggle 
                        label="Enable Detailed Monitoring" 
                        checked={attrs.asgDetailedMonitoring}
                        onChange={(val) => updateAttribute('asgDetailedMonitoring', val)}
                        tooltip="Enable 1-minute CloudWatch metrics for instances in the ASG. Incurs additional CloudWatch charges per instance."
                    />
                </div>
            </div>
        </div>
    );
};