import React from 'react';
import { Accordion, FormSection, AWSSlider, AWSInput } from '../ui/AWS';
import { ResourceConfig } from '../../types';

interface SecretsManagerModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const SecretsManagerArchitectureConfig: React.FC<SecretsManagerModuleProps> = ({ config, onUpdate }) => {
  const attrs = config.attributes;

  const updateAttribute = (key: string, value: any) => {
    onUpdate({
        ...config,
        attributes: { ...attrs, [key]: value }
    });
  };

  return (
    <div className="space-y-6">
        {/* 1. Secrets Configuration */}
        <Accordion title="Secrets Configuration" defaultOpen={true}>
            <div className="space-y-6">
                <FormSection 
                    label="Resource Name" 
                    info="Identifier for this Secrets Manager configuration"
                >
                     <AWSInput 
                        value={config.name} 
                        onChange={(e) => onUpdate({...config, name: e.target.value})} 
                        placeholder="My Secrets Vault"
                    />
                </FormSection>

                <FormSection 
                    label="Number of Secrets" 
                    info="Total secrets stored"
                    tooltip="The number of secrets stored in AWS Secrets Manager. Charged per secret per month ($0.40/secret)."
                >
                     <AWSInput 
                        type="number" min={0}
                        value={attrs.smSecretCount}
                        onChange={(e) => updateAttribute('smSecretCount', Number(e.target.value))}
                        unit="Secrets"
                    />
                </FormSection>
            </div>
        </Accordion>
    </div>
  );
};

export const SecretsManagerUsageConfig: React.FC<SecretsManagerModuleProps> = ({ config, onUpdate }) => {
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
                    <span className="w-2 h-8 bg-purple-600 rounded-full mr-3"></span>
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">API Activity</h4>
                </div>
                
                <div className="space-y-6">
                    <FormSection 
                        label="API Interactions" 
                        tooltip="Total API calls to retrieve or rotate secrets. Charged per 10,000 requests ($0.05/10k)."
                    >
                        <AWSSlider 
                            min={0} max={100} 
                            value={attrs.smApiRequests} 
                            onChange={(val) => updateAttribute('smApiRequests', val)}
                            unit="Million Reqs"
                            labels={["0", "50M", "100M"]}
                        />
                    </FormSection>
                </div>
            </div>
        </div>
    );
};