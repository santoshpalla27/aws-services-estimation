import React from 'react';
import { Accordion, FormSection, AWSSlider, AWSInput } from '../ui/AWS';
import { ResourceConfig } from '../../types';

interface CodeArtifactModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const CodeArtifactArchitectureConfig: React.FC<CodeArtifactModuleProps> = ({ config, onUpdate }) => {
  return (
    <div className="space-y-6">
        <Accordion title="Repository Settings" defaultOpen={true}>
            <div className="space-y-6">
                <FormSection 
                    label="Domain/Repository Name" 
                    info="Identifier for this artifact repository"
                >
                     <AWSInput 
                        value={config.name} 
                        onChange={(e) => onUpdate({...config, name: e.target.value})} 
                        placeholder="my-artifact-repo"
                    />
                </FormSection>

                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-800">
                    <h4 className="font-bold flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Software Package Management
                    </h4>
                    <p className="mt-1">
                        Securely store, publish, and share software packages used in your software development process. 
                        You pay for storage consumed and requests made to your repositories.
                    </p>
                </div>
            </div>
        </Accordion>
    </div>
  );
};

export const CodeArtifactUsageConfig: React.FC<CodeArtifactModuleProps> = ({ config, onUpdate }) => {
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
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Storage & Requests</h4>
                </div>
                
                <div className="space-y-6">
                    <FormSection 
                        label="Storage" 
                        tooltip="Total size of all packages and assets stored ($0.05/GB-month)."
                    >
                        <AWSSlider 
                            min={0} max={1000} 
                            value={attrs.codeArtifactStorage} 
                            onChange={(val) => updateAttribute('codeArtifactStorage', val)}
                            unit="GB"
                            labels={["0", "500 GB", "1 TB"]}
                        />
                    </FormSection>

                    <FormSection 
                        label="Requests (per 10k)" 
                        tooltip="Number of requests (e.g., npm install, pip install). $0.05 per 10,000 requests."
                    >
                        <AWSInput 
                            type="number" min={0}
                            value={attrs.codeArtifactRequests} 
                            onChange={(e) => updateAttribute('codeArtifactRequests', Number(e.target.value))}
                            unit="x 10k Reqs"
                        />
                    </FormSection>
                </div>
            </div>
        </div>
    );
};