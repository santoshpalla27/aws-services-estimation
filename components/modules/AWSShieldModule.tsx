import React from 'react';
import { Accordion, FormSection, AWSSelect } from '../ui/AWS';
import { ResourceConfig, ShieldProtectionType } from '../../types';

interface ShieldModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const AWSShieldArchitectureConfig: React.FC<ShieldModuleProps> = ({ config, onUpdate }) => {
  const attrs = config.attributes;

  const updateAttribute = (key: string, value: any) => {
    onUpdate({
        ...config,
        attributes: { ...attrs, [key]: value }
    });
  };

  return (
    <div className="space-y-6">
        <Accordion title="Protection Plan" defaultOpen={true}>
            <div className="space-y-6">
                <FormSection 
                    label="Shield Plan" 
                    info="DDoS protection level"
                    tooltip="Standard is included free. Advanced provides enhanced detection, mitigation, and 24x7 DRT access."
                >
                     <AWSSelect 
                        value={attrs.shieldProtectionType} 
                        onChange={(e) => updateAttribute('shieldProtectionType', e.target.value)}
                    >
                        <option value={ShieldProtectionType.STANDARD}>Shield Standard (Free)</option>
                        <option value={ShieldProtectionType.ADVANCED}>Shield Advanced (Paid)</option>
                    </AWSSelect>
                </FormSection>

                {attrs.shieldProtectionType === ShieldProtectionType.ADVANCED && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-md text-sm text-red-800 flex items-start animate-in fade-in">
                        <svg className="w-6 h-6 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        <div>
                            <strong className="block text-base mb-1">Cost Warning</strong>
                            AWS Shield Advanced requires a 1-year commitment and has a monthly fee of <strong>$3,000</strong> plus data transfer usage fees. This subscription covers all accounts in an AWS Organization.
                        </div>
                    </div>
                )}
            </div>
        </Accordion>
    </div>
  );
};

export const AWSShieldUsageConfig: React.FC<ShieldModuleProps> = ({ config, onUpdate }) => {
    const attrs = config.attributes;
    
    if (attrs.shieldProtectionType === ShieldProtectionType.STANDARD) {
        return (
            <div className="bg-green-50 p-6 rounded-lg border border-green-200 text-center text-sm text-green-800">
                <h4 className="font-bold mb-1">No Additional Cost</h4>
                <p>Shield Standard provides protection against common network and transport layer DDoS attacks automatically.</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center text-sm text-gray-500">
            <p>Shield Advanced data transfer usage fees vary by resource type (CloudFront, ALB, etc.).</p>
            <p className="mt-2">For this estimate, only the base subscription fee is calculated.</p>
        </div>
    );
};