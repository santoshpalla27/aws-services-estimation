import React from 'react';
import { Accordion, FormSection, AWSSlider, AWSInput } from '../ui/AWS';
import { ResourceConfig } from '../../types';

interface CodeDeployModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const CodeDeployArchitectureConfig: React.FC<CodeDeployModuleProps> = ({ config, onUpdate }) => {
  return (
    <div className="space-y-6">
        <Accordion title="Deployment Configuration" defaultOpen={true}>
            <div className="space-y-6">
                <FormSection 
                    label="Application Name" 
                    info="Identifier for this deployment application"
                >
                     <AWSInput 
                        value={config.name} 
                        onChange={(e) => onUpdate({...config, name: e.target.value})} 
                        placeholder="My App Deploy"
                    />
                </FormSection>

                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-800">
                    <h4 className="font-bold flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        EC2/Lambda Deployments are Free
                    </h4>
                    <p className="mt-1">
                        There is no additional charge for code deployments to Amazon EC2 or AWS Lambda. 
                        You only pay for deployments to on-premises instances ($0.02 per instance update).
                    </p>
                </div>
            </div>
        </Accordion>
    </div>
  );
};

export const CodeDeployUsageConfig: React.FC<CodeDeployModuleProps> = ({ config, onUpdate }) => {
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
                    <span className="w-2 h-8 bg-orange-500 rounded-full mr-3"></span>
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">On-Premises Activity</h4>
                </div>
                
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormSection 
                            label="On-Premises Instances" 
                            tooltip="Number of non-AWS servers you are deploying to."
                        >
                            <AWSInput 
                                type="number" min={0}
                                value={attrs.codeDeployOnPremInstances} 
                                onChange={(e) => updateAttribute('codeDeployOnPremInstances', Number(e.target.value))}
                                unit="Instances"
                            />
                        </FormSection>

                        <FormSection 
                            label="Deployments per Instance" 
                            tooltip="Average number of updates pushed to each on-prem instance per month."
                        >
                            <AWSInput 
                                type="number" min={0}
                                value={attrs.codeDeployUpdates} 
                                onChange={(e) => updateAttribute('codeDeployUpdates', Number(e.target.value))}
                                unit="Updates/Mo"
                            />
                        </FormSection>
                    </div>
                </div>
            </div>
        </div>
    );
};