import React from 'react';
import { Accordion, AWSInput, AWSSelect } from '../ui/AWS';
import { ResourceConfig, FSxType, FSxDeploymentType } from '../../types';

interface FSxModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const FSxArchitectureConfig: React.FC<FSxModuleProps> = ({ config, onUpdate }) => {
  const attrs = config.attributes;

  const updateAttribute = (key: string, value: any) => {
    onUpdate({
        ...config,
        attributes: { ...attrs, [key]: value }
    });
  };

  const addFileSystem = () => {
      const newFS = {
          id: `fsx-${Date.now()}`,
          name: `fs-${(attrs.fsxFileSystems?.length || 0) + 1}`,
          type: FSxType.WINDOWS,
          deploymentType: FSxDeploymentType.MULTI_AZ,
          storageCapacity: 32,
          throughputCapacity: 8,
          backupStorage: 0
      };
      updateAttribute('fsxFileSystems', [...(attrs.fsxFileSystems || []), newFS]);
  };

  const removeFileSystem = (id: string) => {
      updateAttribute('fsxFileSystems', attrs.fsxFileSystems.filter(fs => fs.id !== id));
  };

  const updateFileSystem = (id: string, field: string, value: any) => {
      const updated = attrs.fsxFileSystems.map(fs => {
          if (fs.id === id) return { ...fs, [field]: value };
          return fs;
      });
      updateAttribute('fsxFileSystems', updated);
  };

  return (
    <div className="space-y-6">
        <Accordion title="File Systems" defaultOpen={true}>
            <div className="space-y-6">
                <div className="space-y-4">
                    {attrs.fsxFileSystems && attrs.fsxFileSystems.map((fs, index) => (
                        <div key={fs.id} className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm relative group animate-in fade-in">
                            <div className="absolute top-3 right-3">
                                <button 
                                    onClick={() => removeFileSystem(fs.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            
                            <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center">
                                <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-2 text-xs">{index + 1}</span>
                                {fs.name}
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <AWSInput 
                                    label="Name" 
                                    value={fs.name}
                                    onChange={(e) => updateFileSystem(fs.id, 'name', e.target.value)}
                                />
                                <AWSSelect 
                                    label="Type" 
                                    value={fs.type} 
                                    onChange={(e) => updateFileSystem(fs.id, 'type', e.target.value)}
                                >
                                    <option value={FSxType.WINDOWS}>Windows File Server</option>
                                    <option value={FSxType.LUSTRE}>Lustre</option>
                                </AWSSelect>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                {fs.type === FSxType.WINDOWS && (
                                    <AWSSelect 
                                        label="Deployment" 
                                        value={fs.deploymentType} 
                                        onChange={(e) => updateFileSystem(fs.id, 'deploymentType', e.target.value)}
                                    >
                                        <option value={FSxDeploymentType.MULTI_AZ}>Multi-AZ</option>
                                        <option value={FSxDeploymentType.SINGLE_AZ}>Single-AZ</option>
                                    </AWSSelect>
                                )}
                                <AWSInput 
                                    label="Storage (GB)" 
                                    type="number" min={32}
                                    value={fs.storageCapacity}
                                    onChange={(e) => updateFileSystem(fs.id, 'storageCapacity', Number(e.target.value))}
                                    unit="GB"
                                />
                            </div>

                            {fs.type === FSxType.WINDOWS && (
                                <div className="mt-4">
                                    <AWSInput 
                                        label="Throughput (MB/s)" 
                                        type="number" min={8}
                                        value={fs.throughputCapacity}
                                        onChange={(e) => updateFileSystem(fs.id, 'throughputCapacity', Number(e.target.value))}
                                        unit="MB/s"
                                    />
                                </div>
                            )}
                        </div>
                    ))}

                    <button 
                        onClick={addFileSystem}
                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-aws-primary hover:text-aws-primary transition-colors text-sm font-medium flex items-center justify-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Add File System
                    </button>
                </div>
            </div>
        </Accordion>
    </div>
  );
};

export const FSxUsageConfig: React.FC<FSxModuleProps> = ({ config, onUpdate }) => {
    const attrs = config.attributes;
    const updateAttribute = (key: string, value: any) => {
        onUpdate({
            ...config,
            attributes: { ...attrs, [key]: value }
        });
    };

    const updateFileSystem = (id: string, field: string, value: any) => {
        const updated = attrs.fsxFileSystems.map(fs => {
            if (fs.id === id) return { ...fs, [field]: value };
            return fs;
        });
        updateAttribute('fsxFileSystems', updated);
    };

    return (
        <div className="space-y-4">
            <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                    <span className="w-2 h-8 bg-green-500 rounded-full mr-3"></span>
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Backups</h4>
                </div>
                
                <div className="space-y-6">
                    {attrs.fsxFileSystems && attrs.fsxFileSystems.map(fs => (
                        <div key={fs.id} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                            <h5 className="text-xs font-bold text-gray-500 uppercase mb-3">{fs.name}</h5>
                            <AWSInput 
                                label="Backup Storage (GB)" 
                                type="number" min={0}
                                value={fs.backupStorage} 
                                onChange={(e) => updateFileSystem(fs.id, 'backupStorage', Number(e.target.value))}
                                unit="GB"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};