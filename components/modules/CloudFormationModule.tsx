import React from 'react';
import { Accordion, FormSection, AWSSlider, AWSInput } from '../ui/AWS';
import { ResourceConfig } from '../../types';

interface CloudFormationModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const CloudFormationArchitectureConfig: React.FC<CloudFormationModuleProps> = ({ config, onUpdate }) => {
  const attrs = config.attributes;

  const updateAttribute = (key: string, value: any) => {
    onUpdate({
        ...config,
        attributes: { ...attrs, [key]: value }
    });
  };

  return (
    <div className="space-y-6">
        {/* 1. Stack Configuration */}
        <Accordion title="Stack Configuration" defaultOpen={true}>
            <div className="space-y-6">
                <FormSection 
                    label="Resource Name" 
                    info="Identifier for this CloudFormation cost estimate"
                >
                     <AWSInput 
                        value={config.name} 
                        onChange={(e) => onUpdate({...config, name: e.target.value})} 
                        placeholder="My Stack"
                    />
                </FormSection>

                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-800">
                    <h4 className="font-bold flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        CloudFormation Pricing
                    </h4>
                    <p className="mt-1">
                        There is no additional charge for using AWS CloudFormation with standard AWS resource providers (e.g., `AWS::EC2::Instance`). 
                        You only pay for the AWS resources created.
                    </p>
                    <p className="mt-2 font-medium">
                        Costs below apply ONLY to the CloudFormation Registry (Hooks and Custom/Private Resource Providers).
                    </p>
                </div>
            </div>
        </Accordion>
    </div>
  );
};

export const CloudFormationUsageConfig: React.FC<CloudFormationModuleProps> = ({ config, onUpdate }) => {
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
                    <span className="w-2 h-8 bg-red-500 rounded-full mr-3"></span>
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Registry Operations (Hooks & Custom Resources)</h4>
                </div>
                
                <div className="space-y-6">
                    <FormSection 
                        label="Handler Operations" 
                        tooltip="Number of handler operations performed per month (e.g. Create, Update, Delete on custom resources, or Hook invocations). $0.0009 per op."
                    >
                        <AWSInput 
                            type="number" min={0}
                            value={attrs.cfnHandlerOperations} 
                            onChange={(e) => updateAttribute('cfnHandlerOperations', Number(e.target.value))}
                            unit="Ops/Mo"
                        />
                    </FormSection>

                    <FormSection 
                        label="Average Duration (Seconds)" 
                        tooltip="Average duration of each handler operation in seconds. $0.00008 per second."
                    >
                        <AWSInput 
                            type="number" min={0} step={0.1}
                            value={attrs.cfnHandlerDurationSeconds} 
                            onChange={(e) => updateAttribute('cfnHandlerDurationSeconds', Number(e.target.value))}
                            unit="Seconds"
                        />
                    </FormSection>
                </div>
            </div>
        </div>
    );
};