import React from 'react';
import { Accordion, FormSection, AWSSlider, AWSInput, AWSButton } from '../ui/AWS';
import { ResourceConfig } from '../../types';

interface BackupModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const BackupArchitectureConfig: React.FC<BackupModuleProps> = ({ config, onUpdate }) => {
  const attrs = config.attributes;

  const updateAttribute = (key: string, value: any) => {
    onUpdate({
        ...config,
        attributes: { ...attrs, [key]: value }
    });
  };

  const addVault = () => {
      const newVault = {
          id: `vault-${Date.now()}`,
          name: `vault-${(attrs.backupVaults?.length || 0) + 1}`,
          storageWarm: 50,
          restoreData: 0
      };
      updateAttribute('backupVaults', [...(attrs.backupVaults || []), newVault]);
  };

  const removeVault = (id: string) => {
      updateAttribute('backupVaults', attrs.backupVaults.filter(v => v.id !== id));
  };

  const updateVault = (id: string, field: string, value: any) => {
      const updated = attrs.backupVaults.map(v => {
          if (v.id === id) return { ...v, [field]: value };
          return v;
      });
      updateAttribute('backupVaults', updated);
  };

  return (
    <div className="space-y-6">
        <Accordion title="Backup Vaults" defaultOpen={true}>
            <div className="space-y-6">
                <div className="space-y-4">
                    {attrs.backupVaults && attrs.backupVaults.map((vault, index) => (
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
                        Add Backup Vault
                    </button>
                </div>
            </div>
        </Accordion>
    </div>
  );
};

export const BackupUsageConfig: React.FC<BackupModuleProps> = ({ config, onUpdate }) => {
    const attrs = config.attributes;
    const updateAttribute = (key: string, value: any) => {
        onUpdate({
            ...config,
            attributes: { ...attrs, [key]: value }
        });
    };

    const updateVault = (id: string, field: string, value: any) => {
        const updated = attrs.backupVaults.map(v => {
            if (v.id === id) return { ...v, [field]: value };
            return v;
        });
        updateAttribute('backupVaults', updated);
    };

    return (
        <div className="space-y-4">
            <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                    <span className="w-2 h-8 bg-blue-600 rounded-full mr-3"></span>
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Storage & Restore</h4>
                </div>
                
                <div className="space-y-6">
                    {attrs.backupVaults && attrs.backupVaults.map(vault => (
                        <div key={vault.id} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                            <h5 className="text-xs font-bold text-gray-500 uppercase mb-3">{vault.name}</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <AWSInput 
                                    label="Warm Storage (GB)" 
                                    type="number" min={0}
                                    value={vault.storageWarm} 
                                    onChange={(e) => updateVault(vault.id, 'storageWarm', Number(e.target.value))}
                                    unit="GB"
                                />
                                <AWSInput 
                                    label="Restored Data (GB)" 
                                    type="number" min={0}
                                    value={vault.restoreData} 
                                    onChange={(e) => updateVault(vault.id, 'restoreData', Number(e.target.value))}
                                    unit="GB"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};