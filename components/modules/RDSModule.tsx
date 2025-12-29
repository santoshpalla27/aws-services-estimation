import React from 'react';
import { Accordion, FormSection, AWSSlider, AWSInput, AWSSelect, AWSToggle } from '../ui/AWS';
import { ResourceConfig, RDSEngine, RDSInstanceClass, RDSDeploymentOption, EbsVolumeType } from '../../types';

interface RDSModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const RDSArchitectureConfig: React.FC<RDSModuleProps> = ({ config, onUpdate }) => {
  const attrs = config.attributes;

  const updateAttribute = (key: string, value: any) => {
    onUpdate({
        ...config,
        attributes: { ...attrs, [key]: value }
    });
  };

  return (
    <div className="space-y-6">
        {/* 1. Engine & Instance */}
        <Accordion title="Engine & Instance" defaultOpen={true}>
            <div className="space-y-6">
                <FormSection 
                    label="DB Identifier" 
                    info="Name for your database instance"
                >
                     <AWSInput 
                        value={config.name} 
                        onChange={(e) => onUpdate({...config, name: e.target.value})} 
                        placeholder="production-db"
                    />
                </FormSection>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <FormSection 
                        label="Engine Type" 
                        info="Database Engine"
                    >
                         <AWSSelect 
                            value={attrs.rdsEngine} 
                            onChange={(e) => updateAttribute('rdsEngine', e.target.value)}
                        >
                            {Object.values(RDSEngine).map(e => (
                                <option key={e} value={e}>{e}</option>
                            ))}
                        </AWSSelect>
                    </FormSection>
                    
                    <FormSection 
                        label="DB Instance Class" 
                        info="Compute and memory capacity"
                    >
                         <AWSSelect 
                            value={attrs.rdsInstanceClass} 
                            onChange={(e) => updateAttribute('rdsInstanceClass', e.target.value)}
                        >
                            {Object.values(RDSInstanceClass).map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </AWSSelect>
                    </FormSection>
                </div>
            </div>
        </Accordion>

        {/* 2. Availability & Durability */}
        <Accordion title="Availability & Durability">
             <div className="space-y-6">
                 <FormSection 
                    label="Deployment Option" 
                    info="Multi-AZ deployment for high availability"
                    tooltip="Multi-AZ deployments provide enhanced availability and durability for Database Instances. Costs are roughly double."
                 >
                     <div className="flex gap-4">
                        <button
                            onClick={() => updateAttribute('rdsDeploymentOption', RDSDeploymentOption.SINGLE_AZ)}
                            className={`flex-1 p-3 border rounded-md text-sm font-semibold transition-all ${attrs.rdsDeploymentOption === RDSDeploymentOption.SINGLE_AZ ? 'bg-aws-primary text-white border-aws-primary' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                        >
                            Single-AZ
                        </button>
                        <button
                            onClick={() => updateAttribute('rdsDeploymentOption', RDSDeploymentOption.MULTI_AZ)}
                            className={`flex-1 p-3 border rounded-md text-sm font-semibold transition-all ${attrs.rdsDeploymentOption === RDSDeploymentOption.MULTI_AZ ? 'bg-aws-primary text-white border-aws-primary' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                        >
                            Multi-AZ (Standby)
                        </button>
                     </div>
                 </FormSection>
             </div>
        </Accordion>

        {/* 3. Storage */}
        <Accordion title="Storage">
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <FormSection 
                        label="Storage Type" 
                    >
                         <AWSSelect 
                            value={attrs.rdsStorageType} 
                            onChange={(e) => updateAttribute('rdsStorageType', e.target.value)}
                        >
                             <option value={EbsVolumeType.GP2}>General Purpose SSD (gp2)</option>
                             <option value={EbsVolumeType.GP3}>General Purpose SSD (gp3)</option>
                             <option value={EbsVolumeType.IO2}>Provisioned IOPS SSD (io2)</option>
                        </AWSSelect>
                    </FormSection>
                    
                    <FormSection 
                        label="Allocated Storage" 
                    >
                         <AWSInput 
                            type="number" min={20}
                            value={attrs.rdsStorageSize}
                            onChange={(e) => updateAttribute('rdsStorageSize', Number(e.target.value))}
                            unit="GB"
                        />
                    </FormSection>
                </div>

                {attrs.rdsStorageType === EbsVolumeType.IO2 && (
                    <FormSection label="Provisioned IOPS">
                        <AWSInput 
                            type="number" min={1000}
                            value={attrs.rdsStorageIops}
                            onChange={(e) => updateAttribute('rdsStorageIops', Number(e.target.value))}
                            unit="IOPS"
                        />
                    </FormSection>
                )}
            </div>
        </Accordion>
    </div>
  );
};

export const RDSUsageConfig: React.FC<RDSModuleProps> = ({ config, onUpdate }) => {
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
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Backup & Data Transfer</h4>
                </div>
                
                <div className="space-y-6">
                    <FormSection 
                        label="Additional Backup Storage" 
                        tooltip="Storage for automated backups and DB snapshots beyond the allocated storage size (which is free)."
                    >
                        <AWSSlider 
                            min={0} max={5000} 
                            value={attrs.rdsBackupStorage} 
                            onChange={(val) => updateAttribute('rdsBackupStorage', val)}
                            unit="GB/Mo"
                            labels={["0", "2.5 TB", "5 TB"]}
                        />
                    </FormSection>

                    <FormSection 
                        label="Data Transfer Out" 
                        tooltip="Data transferred from your RDS instance to the internet."
                    >
                        <AWSSlider 
                            min={0} max={5000} 
                            value={attrs.rdsDataTransferOut} 
                            onChange={(val) => updateAttribute('rdsDataTransferOut', val)}
                            unit="GB/Mo"
                            labels={["0", "2.5 TB", "5 TB"]}
                        />
                    </FormSection>
                </div>
            </div>
        </div>
    );
};