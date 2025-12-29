import React from 'react';
import { Accordion, AWSInput, AWSButton } from '../ui/AWS';
import { ResourceConfig, ServiceType } from '../../types';

interface ECRModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const ECRArchitectureConfig: React.FC<ECRModuleProps> = ({ config, onUpdate }) => {
  const attrs = config.attributes;
  const isPublic = config.serviceType === ServiceType.ECR_PUBLIC;

  const updateAttribute = (key: string, value: any) => {
    onUpdate({
        ...config,
        attributes: { ...attrs, [key]: value }
    });
  };

  const addRepo = () => {
      const newRepo = {
          id: `repo-${Date.now()}`,
          name: `repo-${(attrs.ecrRepositories?.length || 0) + 1}`,
          storage: 1,
          dataTransferOut: 0
      };
      updateAttribute('ecrRepositories', [...(attrs.ecrRepositories || []), newRepo]);
  };

  const removeRepo = (id: string) => {
      updateAttribute('ecrRepositories', attrs.ecrRepositories.filter(r => r.id !== id));
  };

  const updateRepo = (id: string, field: string, value: any) => {
      const updated = attrs.ecrRepositories.map(r => {
          if (r.id === id) return { ...r, [field]: value };
          return r;
      });
      updateAttribute('ecrRepositories', updated);
  };

  // For Public ECR, keeping it scalar since it's simpler and less frequently split by distinct cost policies in estimates
  if (isPublic) {
      return (
        <div className="space-y-6">
            <Accordion title="Repository Configuration" defaultOpen={true}>
                <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-800">
                        <h4 className="font-bold flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Amazon ECR Public
                        </h4>
                        <p className="mt-1">
                            Share container software publicly. Includes free storage (50GB) and generous data transfer tiers.
                        </p>
                    </div>
                </div>
            </Accordion>
        </div>
      );
  }

  return (
    <div className="space-y-6">
        <Accordion title="Repositories" defaultOpen={true}>
            <div className="space-y-6">
                <div className="space-y-4">
                    {attrs.ecrRepositories && attrs.ecrRepositories.map((repo, index) => (
                        <div key={repo.id} className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm relative group animate-in fade-in">
                            <div className="absolute top-3 right-3">
                                <button 
                                    onClick={() => removeRepo(repo.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            
                            <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center">
                                <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mr-2 text-xs">{index + 1}</span>
                                {repo.name}
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <AWSInput 
                                    label="Repository Name" 
                                    value={repo.name}
                                    onChange={(e) => updateRepo(repo.id, 'name', e.target.value)}
                                />
                            </div>
                        </div>
                    ))}

                    <button 
                        onClick={addRepo}
                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-aws-primary hover:text-aws-primary transition-colors text-sm font-medium flex items-center justify-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Add Repository
                    </button>
                </div>
            </div>
        </Accordion>
    </div>
  );
};

export const ECRUsageConfig: React.FC<ECRModuleProps> = ({ config, onUpdate }) => {
    const attrs = config.attributes;
    const isPublic = config.serviceType === ServiceType.ECR_PUBLIC;

    const updateAttribute = (key: string, value: any) => {
        onUpdate({
            ...config,
            attributes: { ...attrs, [key]: value }
        });
    };

    const updateRepo = (id: string, field: string, value: any) => {
        const updated = attrs.ecrRepositories.map(r => {
            if (r.id === id) return { ...r, [field]: value };
            return r;
        });
        updateAttribute('ecrRepositories', updated);
    };

    if (isPublic) {
        return (
            <div className="space-y-4">
                <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
                    <div className="flex items-center mb-4">
                        <span className="w-2 h-8 bg-orange-500 rounded-full mr-3"></span>
                        <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Public Usage</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AWSInput 
                            label="Storage (GB)" 
                            type="number" min={0}
                            value={attrs.ecrPublicStorage} 
                            onChange={(e) => updateAttribute('ecrPublicStorage', Number(e.target.value))}
                            unit="GB"
                        />
                        <AWSInput 
                            label="Data Transfer Out (GB)" 
                            type="number" min={0}
                            value={attrs.ecrPublicDataTransferOut} 
                            onChange={(e) => updateAttribute('ecrPublicDataTransferOut', Number(e.target.value))}
                            unit="GB"
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                    <span className="w-2 h-8 bg-orange-500 rounded-full mr-3"></span>
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Storage & Transfer</h4>
                </div>
                
                <div className="space-y-6">
                    {attrs.ecrRepositories && attrs.ecrRepositories.map(repo => (
                        <div key={repo.id} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                            <h5 className="text-xs font-bold text-gray-500 uppercase mb-3">{repo.name}</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <AWSInput 
                                    label="Storage (GB)" 
                                    type="number" min={0}
                                    value={repo.storage} 
                                    onChange={(e) => updateRepo(repo.id, 'storage', Number(e.target.value))}
                                    unit="GB"
                                />
                                <AWSInput 
                                    label="Data Transfer Out (GB)" 
                                    type="number" min={0}
                                    value={repo.dataTransferOut} 
                                    onChange={(e) => updateRepo(repo.id, 'dataTransferOut', Number(e.target.value))}
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