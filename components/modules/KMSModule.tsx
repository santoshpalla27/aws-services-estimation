import React from 'react';
import { Accordion, FormSection, AWSSlider, AWSInput, AWSButton } from '../ui/AWS';
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

  const addKey = () => {
      const newKey = {
          id: `key-${Date.now()}`,
          name: `key-${(attrs.kmsKeys?.length || 0) + 1}`,
          requests: 0
      };
      updateAttribute('kmsKeys', [...(attrs.kmsKeys || []), newKey]);
  };

  const removeKey = (id: string) => {
      updateAttribute('kmsKeys', attrs.kmsKeys.filter(k => k.id !== id));
  };

  const updateKey = (id: string, field: string, value: any) => {
      const updated = attrs.kmsKeys.map(k => {
          if (k.id === id) return { ...k, [field]: value };
          return k;
      });
      updateAttribute('kmsKeys', updated);
  };

  return (
    <div className="space-y-6">
        <Accordion title="Customer Managed Keys" defaultOpen={true}>
            <div className="space-y-6">
                <div className="space-y-4">
                    {attrs.kmsKeys && attrs.kmsKeys.map((k, index) => (
                        <div key={k.id} className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm relative group animate-in fade-in">
                            <div className="absolute top-3 right-3">
                                <button 
                                    onClick={() => removeKey(k.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            
                            <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center">
                                <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center mr-2 text-xs">{index + 1}</span>
                                {k.name}
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <AWSInput 
                                    label="Key Alias" 
                                    value={k.name}
                                    onChange={(e) => updateKey(k.id, 'name', e.target.value)}
                                />
                            </div>
                        </div>
                    ))}

                    <button 
                        onClick={addKey}
                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-aws-primary hover:text-aws-primary transition-colors text-sm font-medium flex items-center justify-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Add Key
                    </button>
                </div>
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