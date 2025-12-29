import React from 'react';
import { Accordion, FormSection, AWSSlider, AWSInput } from '../ui/AWS';
import { ResourceConfig } from '../../types';

interface GlacierModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const GlacierArchitectureConfig: React.FC<GlacierModuleProps> = ({ config, onUpdate }) => {
  return (
    <div className="space-y-6">
        <Accordion title="Vault Settings" defaultOpen={true}>
            <div className="space-y-6">
                <FormSection 
                    label="Vault Name" 
                    info="Identifier for this Glacier Vault"
                >
                     <AWSInput 
                        value={config.name} 
                        onChange={(e) => onUpdate({...config, name: e.target.value})} 
                        placeholder="My Archive Vault"
                    />
                </FormSection>

                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-800">
                    <h4 className="font-bold flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        S3 Glacier (Vaults)
                    </h4>
                    <p className="mt-1">
                        This module estimates costs for the standalone Amazon S3 Glacier service (Vaults). 
                        For S3 buckets using Glacier storage classes, use the <strong>Amazon S3</strong> module.
                    </p>
                </div>
            </div>
        </Accordion>
    </div>
  );
};

export const GlacierUsageConfig: React.FC<GlacierModuleProps> = ({ config, onUpdate }) => {
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
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Archives & Retrieval</h4>
                </div>
                
                <div className="space-y-6">
                    <FormSection 
                        label="Storage Amount" 
                        tooltip="Total volume of data stored in the vault."
                    >
                        <AWSSlider 
                            min={0} max={100000} 
                            value={attrs.glacierStorage} 
                            onChange={(val) => updateAttribute('glacierStorage', val)}
                            unit="GB"
                            labels={["0", "50 TB", "100 TB"]}
                        />
                    </FormSection>

                    <FormSection 
                        label="Data Retrieval" 
                        tooltip="Amount of data retrieved per month. Standard retrieval applies."
                    >
                        <AWSSlider 
                            min={0} max={5000} 
                            value={attrs.glacierRetrieval} 
                            onChange={(val) => updateAttribute('glacierRetrieval', val)}
                            unit="GB/Mo"
                            labels={["0", "2.5 TB", "5 TB"]}
                        />
                    </FormSection>

                    <FormSection 
                        label="Upload Requests" 
                        tooltip="Number of upload requests (per 1000)."
                    >
                        <AWSInput 
                            type="number" min={0}
                            value={attrs.glacierRequests} 
                            onChange={(e) => updateAttribute('glacierRequests', Number(e.target.value))}
                            unit="x 1000 Reqs"
                        />
                    </FormSection>
                </div>
            </div>
        </div>
    );
};