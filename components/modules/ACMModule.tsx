import React from 'react';
import { Accordion, FormSection, AWSSlider, AWSInput, AWSSelect } from '../ui/AWS';
import { ResourceConfig, AcmCertificateType } from '../../types';

interface ACMModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const ACMArchitectureConfig: React.FC<ACMModuleProps> = ({ config, onUpdate }) => {
  const attrs = config.attributes;

  const updateAttribute = (key: string, value: any) => {
    onUpdate({
        ...config,
        attributes: { ...attrs, [key]: value }
    });
  };

  return (
    <div className="space-y-6">
        {/* 1. Certificate Settings */}
        <Accordion title="Certificate Settings" defaultOpen={true}>
            <div className="space-y-6">
                <FormSection 
                    label="Configuration Name" 
                    info="Identifier for this ACM configuration"
                >
                     <AWSInput 
                        value={config.name} 
                        onChange={(e) => onUpdate({...config, name: e.target.value})} 
                        placeholder="My SSL Configuration"
                    />
                </FormSection>

                <FormSection 
                    label="Certificate Type" 
                    info="Choose between free public certificates or private CA."
                    tooltip="Public SSL/TLS certificates provisioned through ACM for use with AWS services (like ALB, CloudFront) are free. Private CAs incur a monthly fee."
                >
                     <AWSSelect 
                        value={attrs.acmCertificateType} 
                        onChange={(e) => updateAttribute('acmCertificateType', e.target.value)}
                    >
                        <option value={AcmCertificateType.PUBLIC}>Public (Free)</option>
                        <option value={AcmCertificateType.PRIVATE}>Private CA (Paid)</option>
                    </AWSSelect>
                </FormSection>

                {attrs.acmCertificateType === AcmCertificateType.PRIVATE && (
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-md animate-in fade-in">
                        <div className="flex items-start mb-4">
                            <svg className="w-5 h-5 text-aws-primary mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                            <div>
                                <h4 className="text-sm font-bold text-gray-900">Private Certificate Authority</h4>
                                <p className="text-xs text-gray-600 mt-1">AWS Private CA enables creation of private certificate hierarchies for internal resources.</p>
                            </div>
                        </div>
                        <FormSection 
                            label="Number of Private CAs" 
                            tooltip="Monthly cost is incurred for each active Private CA."
                        >
                            <AWSInput 
                                type="number" min={1}
                                value={attrs.acmPrivateCaCount}
                                onChange={(e) => updateAttribute('acmPrivateCaCount', Number(e.target.value))}
                                unit="CAs"
                            />
                        </FormSection>
                    </div>
                )}
            </div>
        </Accordion>
    </div>
  );
};

export const ACMUsageConfig: React.FC<ACMModuleProps> = ({ config, onUpdate }) => {
    const attrs = config.attributes;
    const updateAttribute = (key: string, value: any) => {
        onUpdate({
            ...config,
            attributes: { ...attrs, [key]: value }
        });
    };

    if (attrs.acmCertificateType === AcmCertificateType.PUBLIC) {
        return (
            <div className="bg-green-50 p-6 rounded-lg border border-green-200 text-center">
                <svg className="w-12 h-12 text-green-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <h3 className="text-lg font-bold text-green-900">No Usage Costs</h3>
                <p className="text-green-700 mt-2 text-sm">Public SSL/TLS certificates issued by ACM for AWS integrated services are free of charge.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                    <span className="w-2 h-8 bg-purple-600 rounded-full mr-3"></span>
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Certificate Issuance</h4>
                </div>
                
                <FormSection 
                    label="Private Certificates Issued" 
                    tooltip="Number of active private certificates managed by ACM. Cost is tiered (approx $0.75/cert for first 1000)."
                >
                    <AWSSlider 
                        min={0} max={2000} 
                        value={attrs.acmCertificateCount} 
                        onChange={(val) => updateAttribute('acmCertificateCount', val)}
                        unit="Certs"
                        labels={["0", "1000", "2000"]}
                    />
                </FormSection>
            </div>
        </div>
    );
};