import React from 'react';
import { Accordion, FormSection, AWSInput, AWSToggle } from '../ui/AWS';
import { ResourceConfig } from '../../types';

interface FMSModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const FMSArchitectureConfig: React.FC<FMSModuleProps> = ({ config, onUpdate }) => {
  const attrs = config.attributes;

  const updateAttribute = (key: string, value: any) => {
    onUpdate({
        ...config,
        attributes: { ...attrs, [key]: value }
    });
  };

  return (
    <div className="space-y-6">
        <Accordion title="Policy Management" defaultOpen={true}>
            <div className="space-y-6">
                <FormSection 
                    label="Resource Name" 
                    info="Identifier for this FMS configuration"
                >
                     <AWSInput 
                        value={config.name} 
                        onChange={(e) => onUpdate({...config, name: e.target.value})} 
                        placeholder="Central Firewall Policy"
                    />
                </FormSection>

                <FormSection 
                    label="FMS Protection Policies" 
                    info="Number of policies per region"
                    tooltip="A monthly fee is charged for each protection policy created per region ($100/policy/month)."
                >
                     <AWSInput 
                        type="number" min={0}
                        value={attrs.fmsPolicyCount} 
                        onChange={(e) => updateAttribute('fmsPolicyCount', Number(e.target.value))}
                        unit="Policies"
                    />
                </FormSection>

                <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                    <AWSToggle 
                        label="Shield Advanced Subscription Active" 
                        checked={attrs.fmsShieldAdvancedEnabled}
                        onChange={(val) => updateAttribute('fmsShieldAdvancedEnabled', val)}
                        tooltip="If you are subscribed to AWS Shield Advanced, FMS security policies are available at no additional cost."
                    />
                    {attrs.fmsShieldAdvancedEnabled && (
                        <p className="mt-2 text-xs text-green-600 font-semibold">
                            FMS Policy fees waived due to Shield Advanced subscription.
                        </p>
                    )}
                </div>
            </div>
        </Accordion>
    </div>
  );
};

export const FMSUsageConfig: React.FC<FMSModuleProps> = ({ config, onUpdate }) => {
    return (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center text-sm text-gray-500">
            <p>Firewall Manager costs are fixed per policy. Usage costs for the underlying resources (WAF WebACLs, Config Rules, etc.) are charged separately under those services.</p>
        </div>
    );
};