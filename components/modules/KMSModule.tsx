import React from 'react';
import { Accordion, FormSection, AWSSlider, AWSInput } from '../ui/AWS';
import { ResourceConfig } from '../../types';

interface KMSModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const KMSArchitectureConfig: React.FC<KMSModuleProps> = ({ config, onUpdate }) => {
  const attrs = config.attributes;

  const updateAttribute = (key: string, value: any) => {
    onUpdate({
        ...config,
        attributes: { ...attrs, [key]: value }
    });
  };

  return (
    <div className="space-y-6">
        {/* 1. Key Configuration */}
        <Accordion title="Key Configuration" defaultOpen={true}>
            <div className="space-y-6">
                <FormSection 
                    label="Resource Name" 
                    info="Identifier for this KMS configuration"
                >
                     <AWSInput 
                        value={config.name} 
                        onChange={(e) => onUpdate({...config, name: e.target.value})} 
                        placeholder="My Encryption Keys"
                    />
                </FormSection>

                <FormSection 
                    label="Customer Managed Keys (CMKs)" 
                    info="Total keys managed"
                    tooltip="Number of Customer Managed Keys you created. AWS Managed Keys are free for storage (you pay for usage). CMKs cost $1.00/month/key."
                >
                     <AWSInput 
                        type="number" min={0}
                        value={attrs.kmsKeyCount}
                        onChange={(e) => updateAttribute('kmsKeyCount', Number(e.target.value))}
                        unit="Keys"
                    />
                </FormSection>
            </div>
        </Accordion>
    </div>
  );
};

export const KMSUsageConfig: React.FC<KMSModuleProps> = ({ config, onUpdate }) => {
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
                    <span className="w-2 h-8 bg-red-600 rounded-full mr-3"></span>
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">API Activity</h4>
                </div>
                
                <div className="space-y-6">
                    <FormSection 
                        label="Cryptographic Requests" 
                        tooltip="Total number of encryption/decryption requests. Includes requests for both Customer Managed and AWS Managed Keys. $0.03 per 10,000 requests."
                    >
                        <AWSSlider 
                            min={0} max={100} 
                            value={attrs.kmsRequests} 
                            onChange={(val) => updateAttribute('kmsRequests', val)}
                            unit="Million Reqs"
                            labels={["0", "50M", "100M"]}
                        />
                    </FormSection>
                </div>
            </div>
        </div>
    );
};