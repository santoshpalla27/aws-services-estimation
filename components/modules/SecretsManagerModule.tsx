import React from 'react';
import { Accordion, FormSection, AWSSlider, AWSInput, AWSButton } from '../ui/AWS';
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

  const addSecret = () => {
      const newSecret = {
          id: `secret-${Date.now()}`,
          name: `secret-group-${(attrs.smSecrets?.length || 0) + 1}`,
          count: 1
      };
      updateAttribute('smSecrets', [...(attrs.smSecrets || []), newSecret]);
  };

  const removeSecret = (id: string) => {
      updateAttribute('smSecrets', attrs.smSecrets.filter(s => s.id !== id));
  };

  const updateSecret = (id: string, field: string, value: any) => {
      const updated = attrs.smSecrets.map(s => {
          if (s.id === id) return { ...s, [field]: value };
          return s;
      });
      updateAttribute('smSecrets', updated);
  };

  return (
    <div className="space-y-6">
        <Accordion title="Secrets Configuration" defaultOpen={true}>
            <div className="space-y-6">
                <div className="space-y-4">
                    {attrs.smSecrets && attrs.smSecrets.map((secret, index) => (
                        <div key={secret.id} className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm relative group animate-in fade-in">
                            <div className="absolute top-3 right-3">
                                <button 
                                    onClick={() => removeSecret(secret.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            
                            <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center">
                                <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-2 text-xs">{index + 1}</span>
                                {secret.name}
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <AWSInput 
                                    label="Secret Name/Group" 
                                    value={secret.name}
                                    onChange={(e) => updateSecret(secret.id, 'name', e.target.value)}
                                />
                                <AWSInput 
                                    label="Count" 
                                    type="number" min={1}
                                    value={secret.count} 
                                    onChange={(e) => updateSecret(secret.id, 'count', Number(e.target.value))}
                                    unit="Secrets"
                                />
                            </div>
                        </div>
                    ))}

                    <button 
                        onClick={addSecret}
                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-aws-primary hover:text-aws-primary transition-colors text-sm font-medium flex items-center justify-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Add Secret Group
                    </button>
                </div>
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