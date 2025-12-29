import React from 'react';
import { Accordion, FormSection, AWSSlider, AWSInput } from '../ui/AWS';
import { ResourceConfig } from '../../types';

interface IAMModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const IAMArchitectureConfig: React.FC<IAMModuleProps> = ({ config, onUpdate }) => {
  const attrs = config.attributes;

  const updateAttribute = (key: string, value: any) => {
    onUpdate({
        ...config,
        attributes: { ...attrs, [key]: value }
    });
  };

  return (
    <div className="space-y-6">
        {/* 1. Identity Management */}
        <Accordion title="Identity Management" defaultOpen={true}>
            <div className="space-y-6">
                <FormSection 
                    label="Resource Name" 
                    info="Identifier for this IAM setup"
                >
                     <AWSInput 
                        value={config.name} 
                        onChange={(e) => onUpdate({...config, name: e.target.value})} 
                        placeholder="My IAM Configuration"
                    />
                </FormSection>

                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-800 mb-6">
                    <h4 className="font-bold flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        No Additional Charge
                    </h4>
                    <p className="mt-1">
                        AWS Identity and Access Management (IAM) is a feature of your AWS account offered at no additional charge. You will be charged only for the use of other AWS services by your users.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <FormSection 
                        label="IAM Users" 
                        tooltip="The number of users you plan to create in your account."
                    >
                         <AWSInput 
                            type="number" min={0}
                            value={attrs.iamUserCount}
                            onChange={(e) => updateAttribute('iamUserCount', Number(e.target.value))}
                            unit="Users"
                        />
                    </FormSection>
                    
                    <FormSection 
                        label="User Groups" 
                        tooltip="The number of user groups for organizing users."
                    >
                         <AWSInput 
                            type="number" min={0}
                            value={attrs.iamGroupCount}
                            onChange={(e) => updateAttribute('iamGroupCount', Number(e.target.value))}
                            unit="Groups"
                        />
                    </FormSection>
                </div>
            </div>
        </Accordion>

        {/* 2. Access Management */}
        <Accordion title="Access Management">
             <div className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <FormSection 
                        label="IAM Roles" 
                        tooltip="An IAM identity that you can create in your account that has specific permissions."
                     >
                         <AWSInput 
                            type="number" min={0}
                            value={attrs.iamRoleCount}
                            onChange={(e) => updateAttribute('iamRoleCount', Number(e.target.value))}
                            unit="Roles"
                        />
                     </FormSection>
                     
                     <FormSection 
                        label="Customer Managed Policies" 
                        tooltip="Standalone policies that you administer in your own AWS account."
                     >
                         <AWSInput 
                            type="number" min={0}
                            value={attrs.iamPolicyCount}
                            onChange={(e) => updateAttribute('iamPolicyCount', Number(e.target.value))}
                            unit="Policies"
                        />
                     </FormSection>
                 </div>
             </div>
        </Accordion>
    </div>
  );
};

export const IAMUsageConfig: React.FC<IAMModuleProps> = ({ config, onUpdate }) => {
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
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">API Activity</h4>
                </div>
                
                <div className="space-y-6">
                    <FormSection 
                        label="API Requests" 
                        tooltip="Total number of calls to the IAM API. Although free, tracking this helps estimate CloudTrail usage."
                    >
                        <AWSSlider 
                            min={0} max={100} 
                            value={attrs.iamApiRequests} 
                            onChange={(val) => updateAttribute('iamApiRequests', val)}
                            unit="Million Reqs"
                            labels={["0", "50M", "100M"]}
                        />
                    </FormSection>
                </div>
            </div>
        </div>
    );
};