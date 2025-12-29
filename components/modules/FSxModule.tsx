import React from 'react';
import { Accordion, FormSection, AWSSlider, AWSInput, AWSSelect } from '../ui/AWS';
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

  return (
    <div className="space-y-6">
        <Accordion title="File System Settings" defaultOpen={true}>
            <div className="space-y-6">
                <FormSection 
                    label="File System Name" 
                    info="Identifier for this file system"
                >
                     <AWSInput 
                        value={config.name} 
                        onChange={(e) => onUpdate({...config, name: e.target.value})} 
                        placeholder="MyCorpShare"
                    />
                </FormSection>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <FormSection 
                        label="File System Type" 
                        info="Choose engine"
                    >
                         <AWSSelect 
                            value={attrs.fsxType} 
                            onChange={(e) => updateAttribute('fsxType', e.target.value)}
                        >
                            <option value={FSxType.WINDOWS}>Amazon FSx for Windows File Server</option>
                            <option value={FSxType.LUSTRE}>Amazon FSx for Lustre</option>
                        </AWSSelect>
                    </FormSection>
                    
                    {attrs.fsxType === FSxType.WINDOWS && (
                        <FormSection 
                            label="Deployment Type" 
                            info="Availability configuration"
                        >
                             <AWSSelect 
                                value={attrs.fsxDeploymentType} 
                                onChange={(e) => updateAttribute('fsxDeploymentType', e.target.value)}
                            >
                                <option value={FSxDeploymentType.MULTI_AZ}>Multi-AZ (High Availability)</option>
                                <option value={FSxDeploymentType.SINGLE_AZ}>Single-AZ (Lower Cost)</option>
                            </AWSSelect>
                        </FormSection>
                    )}
                </div>
            </div>
        </Accordion>

        <Accordion title="Capacity">
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormSection 
                        label="Storage Capacity" 
                        tooltip="Amount of SSD storage provisioned."
                    >
                        <AWSInput 
                            type="number" min={32} step={10}
                            value={attrs.fsxStorageCapacity} 
                            onChange={(e) => updateAttribute('fsxStorageCapacity', Number(e.target.value))}
                            unit="GB"
                        />
                    </FormSection>

                    {attrs.fsxType === FSxType.WINDOWS && (
                        <FormSection 
                            label="Throughput Capacity" 
                            tooltip="Throughput capacity determines the speed at which the file server can serve data."
                        >
                            <AWSInput 
                                type="number" min={8}
                                value={attrs.fsxThroughputCapacity} 
                                onChange={(e) => updateAttribute('fsxThroughputCapacity', Number(e.target.value))}
                                unit="MB/s"
                            />
                        </FormSection>
                    )}
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

    return (
        <div className="space-y-4">
            <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                    <span className="w-2 h-8 bg-green-500 rounded-full mr-3"></span>
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Backup & Transfer</h4>
                </div>
                
                <div className="space-y-6">
                    <FormSection 
                        label="Backup Storage" 
                        tooltip="Amount of backup storage used for automated and manual backups ($0.05/GB-Mo)."
                    >
                        <AWSSlider 
                            min={0} max={5000} 
                            value={attrs.fsxBackupStorage} 
                            onChange={(val) => updateAttribute('fsxBackupStorage', val)}
                            unit="GB"
                            labels={["0", "2.5 TB", "5 TB"]}
                        />
                    </FormSection>
                </div>
            </div>
        </div>
    );
};