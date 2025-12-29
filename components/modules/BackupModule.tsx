import React from 'react';
import { Accordion, FormSection, AWSSlider, AWSInput } from '../ui/AWS';
import { ResourceConfig } from '../../types';

interface BackupModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const BackupArchitectureConfig: React.FC<BackupModuleProps> = ({ config, onUpdate }) => {
  return (
    <div className="space-y-6">
        <Accordion title="Backup Vault Configuration" defaultOpen={true}>
            <div className="space-y-6">
                <FormSection 
                    label="Vault Name" 
                    info="Identifier for this backup vault"
                >
                     <AWSInput 
                        value={config.name} 
                        onChange={(e) => onUpdate({...config, name: e.target.value})} 
                        placeholder="Central Backup Vault"
                    />
                </FormSection>

                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-800">
                    <h4 className="font-bold flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Centralized Backup
                    </h4>
                    <p className="mt-1">
                        AWS Backup provides a centralized way to protect data across AWS services like EBS, RDS, DynamoDB, EFS, and FSx.
                        Costs are based on the total amount of backup storage used and the amount of data restored.
                    </p>
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

    return (
        <div className="space-y-4">
            <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                    <span className="w-2 h-8 bg-blue-600 rounded-full mr-3"></span>
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Storage & Restore</h4>
                </div>
                
                <div className="space-y-6">
                    <FormSection 
                        label="Total Backup Storage" 
                        tooltip="Total volume of warm backup data stored per month ($0.05/GB-Mo)."
                    >
                        <AWSSlider 
                            min={0} max={10000} 
                            value={attrs.backupStorageSize} 
                            onChange={(val) => updateAttribute('backupStorageSize', val)}
                            unit="GB"
                            labels={["0", "5 TB", "10 TB"]}
                        />
                    </FormSection>

                    <FormSection 
                        label="Data Restored" 
                        tooltip="Amount of data restored from backups ($0.02/GB)."
                    >
                        <AWSSlider 
                            min={0} max={1000} 
                            value={attrs.backupRestoreData} 
                            onChange={(val) => updateAttribute('backupRestoreData', val)}
                            unit="GB/Mo"
                            labels={["0", "500 GB", "1 TB"]}
                        />
                    </FormSection>
                </div>
            </div>
        </div>
    );
};