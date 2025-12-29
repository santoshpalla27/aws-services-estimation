import React from 'react';
import { Accordion, FormSection, AWSSlider, AWSInput } from '../ui/AWS';
import { ResourceConfig, ServiceType } from '../../types';

interface ECRModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const ECRArchitectureConfig: React.FC<ECRModuleProps> = ({ config, onUpdate }) => {
  const isPublic = config.serviceType === ServiceType.ECR_PUBLIC;

  return (
    <div className="space-y-6">
        {/* 1. Repository Settings */}
        <Accordion title="Repository Configuration" defaultOpen={true}>
            <div className="space-y-6">
                <FormSection 
                    label="Repository Name" 
                    info="Identifier for this container repository"
                >
                     <AWSInput 
                        value={config.name} 
                        onChange={(e) => onUpdate({...config, name: e.target.value})} 
                        placeholder={isPublic ? "public-app-repo" : "private-app-repo"}
                    />
                </FormSection>

                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-800">
                    <h4 className="font-bold flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {isPublic ? "Amazon ECR Public" : "Amazon ECR Private"}
                    </h4>
                    <p className="mt-1">
                        {isPublic 
                            ? "Share container software publicly. Includes free storage (50GB) and generous data transfer tiers." 
                            : "Secure, scalable, and reliable registry for your Docker containers and artifacts."}
                    </p>
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

    return (
        <div className="space-y-4">
            <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                    <span className="w-2 h-8 bg-orange-500 rounded-full mr-3"></span>
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Storage & Transfer</h4>
                </div>
                
                <FormSection 
                    label="Storage" 
                    tooltip={isPublic ? "First 50 GB/month is free." : "Total size of images stored."}
                >
                    <AWSSlider 
                        min={0} max={1000} 
                        value={isPublic ? attrs.ecrPublicStorage : attrs.ecrStorage} 
                        onChange={(val) => updateAttribute(isPublic ? 'ecrPublicStorage' : 'ecrStorage', val)}
                        unit="GB"
                        labels={["0", "500 GB", "1 TB"]}
                    />
                </FormSection>

                <div className="pt-4 border-t border-gray-100">
                    <FormSection 
                        label="Data Transfer Out" 
                        tooltip={isPublic 
                            ? "Data pulled from the repository to the internet. Anonymous pulls get 500GB/mo free." 
                            : "Data transferred from ECR to the internet (e.g. pulling images from local machine)."}
                    >
                        <AWSSlider 
                            min={0} max={5000} 
                            value={isPublic ? attrs.ecrPublicDataTransferOut : attrs.ecrDataTransferOut} 
                            onChange={(val) => updateAttribute(isPublic ? 'ecrPublicDataTransferOut' : 'ecrDataTransferOut', val)}
                            unit="GB/Mo"
                            labels={["0", "2.5 TB", "5 TB"]}
                        />
                    </FormSection>
                </div>
            </div>
        </div>
    );
};