import React from 'react';
import { Accordion, FormSection, AWSSlider, AWSInput } from '../ui/AWS';
import { ResourceConfig } from '../../types';

interface CodeCommitModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const CodeCommitArchitectureConfig: React.FC<CodeCommitModuleProps> = ({ config, onUpdate }) => {
  return (
    <div className="space-y-6">
        <Accordion title="Repository Configuration" defaultOpen={true}>
            <div className="space-y-6">
                <FormSection 
                    label="Repository Name" 
                    info="Identifier for this Git repository"
                >
                     <AWSInput 
                        value={config.name} 
                        onChange={(e) => onUpdate({...config, name: e.target.value})} 
                        placeholder="My Git Repo"
                    />
                </FormSection>

                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-800">
                    <h4 className="font-bold flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Private Git Repositories
                    </h4>
                    <p className="mt-1">
                        First 5 active users per month are free. Additional users are $1.00/month. 
                        Includes 50GB storage and 10,000 Git requests per user/month.
                    </p>
                </div>
            </div>
        </Accordion>
    </div>
  );
};

export const CodeCommitUsageConfig: React.FC<CodeCommitModuleProps> = ({ config, onUpdate }) => {
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
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Users & Storage</h4>
                </div>
                
                <div className="space-y-6">
                    <FormSection 
                        label="Active Users" 
                        tooltip="Number of unique users accessing the repository this month."
                    >
                        <AWSInput 
                            type="number" min={0}
                            value={attrs.codeCommitUsers} 
                            onChange={(e) => updateAttribute('codeCommitUsers', Number(e.target.value))}
                            unit="Users"
                        />
                    </FormSection>

                    <FormSection 
                        label="Storage Used" 
                        tooltip="Total storage for all repositories. 50GB free, then $0.06/GB."
                    >
                        <AWSSlider 
                            min={0} max={500} 
                            value={attrs.codeCommitStorage} 
                            onChange={(val) => updateAttribute('codeCommitStorage', val)}
                            unit="GB"
                            labels={["0", "250 GB", "500 GB"]}
                        />
                    </FormSection>
                    
                    <FormSection 
                        label="Git Requests" 
                        tooltip="Pull/Push requests. Usually free within quota."
                    >
                        <AWSSlider 
                            min={0} max={100000} 
                            value={attrs.codeCommitRequests} 
                            onChange={(val) => updateAttribute('codeCommitRequests', val)}
                            unit="Requests"
                            labels={["0", "50k", "100k"]}
                        />
                    </FormSection>
                </div>
            </div>
        </div>
    );
};