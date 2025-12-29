import React from 'react';
import { Accordion, FormSection, AWSSlider, AWSInput, AWSButton } from '../ui/AWS';
import { ResourceConfig } from '../../types';

interface GlacierModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const GlacierArchitectureConfig: React.FC<GlacierModuleProps> = ({ config, onUpdate }) => {
  const attrs = config.attributes;

  const updateAttribute = (key: string, value: any) => {
    onUpdate({
        ...config,
        attributes: { ...attrs, [key]: value }
    });
  };

  const addVault = () => {
      const newVault = {
          id: `glacier-${Date.now()}`,
          name: `vault-${(attrs.glacierVaults?.length || 0) + 1}`,
          storage: 0,
          retrieval: 0,
          requests: 0
      };
      updateAttribute('glacierVaults', [...(attrs.glacierVaults || []), newVault]);
  };

  const removeVault = (id: string) => {
      updateAttribute('glacierVaults', attrs.glacierVaults.filter(v => v.id !== id));
  };

  const updateVault = (id: string, field: string, value: any) => {
      const updated = attrs.glacierVaults.map(v => {
          if (v.id === id) return { ...v, [field]: value };
          return v;
      });
      updateAttribute('glacierVaults', updated);
  };

  return (
    <div className="space-y-6">
        <Accordion title="Vaults" defaultOpen={true}>
            <div className="space-y-6">
                <div className="space-y-4">
                    {attrs.glacierVaults && attrs.glacierVaults.map((vault, index) => (
                        <div key={vault.id} className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm relative group animate-in fade-in">
                            <div className="absolute top-3 right-3">
                                <button 
                                    onClick={() => removeVault(vault.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            
                            <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center">
                                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 text-xs">{index + 1}</span>
                                {vault.name}
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <AWSInput 
                                    label="Vault Name" 
                                    value={vault.name}
                                    onChange={(e) => updateVault(vault.id, 'name', e.target.value)}
                                />
                            </div>
                        </div>
                    ))}

                    <button 
                        onClick={addVault}
                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-aws-primary hover:text-aws-primary transition-colors text-sm font-medium flex items-center justify-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Add Archive Vault
                    </button>
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

    const updateVault = (id: string, field: string, value: any) => {
        const updated = attrs.glacierVaults.map(v => {
            if (v.id === id) return { ...v, [field]: value };
            return v;
        });
        updateAttribute('glacierVaults', updated);
    };

    return (
        <div className="space-y-4">
            <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                    <span className="w-2 h-8 bg-blue-600 rounded-full mr-3"></span>
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Archives & Retrieval</h4>
                </div>
                
                <div className="space-y-6">
                    {attrs.glacierVaults && attrs.glacierVaults.map(vault => (
                        <div key={vault.id} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                            <h5 className="text-xs font-bold text-gray-500 uppercase mb-3">{vault.name}</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <AWSInput 
                                    label="Storage Amount (GB)" 
                                    type="number" min={0}
                                    value={vault.storage} 
                                    onChange={(e) => updateVault(vault.id, 'storage', Number(e.target.value))}
                                    unit="GB"
                                />
                                <AWSInput 
                                    label="Data Retrieval (GB)" 
                                    type="number" min={0}
                                    value={vault.retrieval} 
                                    onChange={(e) => updateVault(vault.id, 'retrieval', Number(e.target.value))}
                                    unit="GB"
                                />
                            </div>
                            <AWSInput 
                                label="Upload Requests (per 1000)" 
                                type="number" min={0}
                                value={vault.requests} 
                                onChange={(e) => updateVault(vault.id, 'requests', Number(e.target.value))}
                                unit="x 1k Reqs"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};