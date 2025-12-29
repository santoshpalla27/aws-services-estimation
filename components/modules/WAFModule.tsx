import React from 'react';
import { Accordion, FormSection, AWSSlider, AWSInput, AWSSelect, AWSToggle } from '../ui/AWS';
import { ResourceConfig, WafScope } from '../../types';

interface WAFModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const WAFArchitectureConfig: React.FC<WAFModuleProps> = ({ config, onUpdate }) => {
  const attrs = config.attributes;

  const updateAttribute = (key: string, value: any) => {
    onUpdate({
        ...config,
        attributes: { ...attrs, [key]: value }
    });
  };

  return (
    <div className="space-y-6">
        {/* 1. Web ACL Configuration */}
        <Accordion title="Web ACL Configuration" defaultOpen={true}>
            <div className="space-y-6">
                <FormSection 
                    label="Resource Name" 
                    info="Identifier for this WAF configuration"
                >
                     <AWSInput 
                        value={config.name} 
                        onChange={(e) => onUpdate({...config, name: e.target.value})} 
                        placeholder="My Web ACL"
                    />
                </FormSection>

                <FormSection 
                    label="Scope" 
                    info="Region or Global (CloudFront)"
                    tooltip="Regional WAF protects ALBs, API Gateways, and AppSync. CloudFront WAF protects global distributions."
                >
                     <AWSSelect 
                        value={attrs.wafScope} 
                        onChange={(e) => updateAttribute('wafScope', e.target.value)}
                    >
                        <option value={WafScope.REGIONAL}>Regional (ALB, API Gateway)</option>
                        <option value={WafScope.CLOUDFRONT}>CloudFront (Global)</option>
                    </AWSSelect>
                </FormSection>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormSection 
                        label="Number of Web ACLs" 
                        tooltip="Total number of Web Access Control Lists you plan to create ($5.00/ACL/month)."
                    >
                        <AWSInput 
                            type="number" min={1}
                            value={attrs.wafWebACLCount} 
                            onChange={(e) => updateAttribute('wafWebACLCount', Number(e.target.value))}
                            unit="ACLs"
                        />
                    </FormSection>

                    <FormSection 
                        label="Rules per Web ACL" 
                        tooltip="Average number of rules added to each Web ACL ($1.00/rule/month)."
                    >
                        <AWSSlider 
                            min={0} max={100} 
                            value={attrs.wafRuleCountPerACL} 
                            onChange={(val) => updateAttribute('wafRuleCountPerACL', val)}
                            unit="Rules"
                            labels={["0", "50", "100"]}
                        />
                    </FormSection>
                </div>
            </div>
        </Accordion>

        {/* 2. Managed Rules (Add-ons) */}
        <Accordion title="Managed Rule Groups (Add-ons)">
            <div className="space-y-6">
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                    <div className="mb-4">
                        <AWSToggle 
                            label="Enable Bot Control" 
                            checked={attrs.wafBotControlEnabled}
                            onChange={(val) => updateAttribute('wafBotControlEnabled', val)}
                            tooltip="Managed rule group for detecting and mitigating bot traffic. $10/mo subscription + request fees."
                        />
                    </div>
                    {attrs.wafBotControlEnabled && (
                        <div className="pl-4 border-l-2 border-aws-link animate-in fade-in">
                            <p className="text-xs text-gray-500 mb-3">
                                Bot Control adds a $10.00/month subscription fee per Web ACL.
                            </p>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                    <div className="mb-4">
                        <AWSToggle 
                            label="Enable Fraud Control" 
                            checked={attrs.wafFraudControlEnabled}
                            onChange={(val) => updateAttribute('wafFraudControlEnabled', val)}
                            tooltip="Managed rule group for Account Takeover Prevention (ATP) and Account Creation Fraud Prevention (ACFP). $10/mo subscription + request fees."
                        />
                    </div>
                    {attrs.wafFraudControlEnabled && (
                        <div className="pl-4 border-l-2 border-aws-link animate-in fade-in">
                            <p className="text-xs text-gray-500 mb-3">
                                Fraud Control adds a $10.00/month subscription fee per Web ACL.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </Accordion>
    </div>
  );
};

export const WAFUsageConfig: React.FC<WAFModuleProps> = ({ config, onUpdate }) => {
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
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Traffic Volume</h4>
                </div>
                
                <FormSection 
                    label="Requests Processed" 
                    tooltip="Total number of requests inspected by WAF per month ($0.60 per million)."
                >
                    <AWSSlider 
                        min={0} max={1000} 
                        value={attrs.wafRequests} 
                        onChange={(val) => updateAttribute('wafRequests', val)}
                        unit="Million Reqs"
                        labels={["0", "500M", "1B"]}
                    />
                </FormSection>
            </div>

            {(attrs.wafBotControlEnabled || attrs.wafFraudControlEnabled) && (
                <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm animate-in fade-in">
                    <div className="flex items-center mb-4">
                        <span className="w-2 h-8 bg-purple-600 rounded-full mr-3"></span>
                        <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Managed Rule Traffic</h4>
                    </div>

                    {attrs.wafBotControlEnabled && (
                        <div className="mb-6">
                            <FormSection 
                                label="Bot Control Analysis" 
                                tooltip="Requests analyzed by Bot Control rules ($1.00 per million)."
                            >
                                <AWSSlider 
                                    min={0} max={500} 
                                    value={attrs.wafBotControlRequests} 
                                    onChange={(val) => updateAttribute('wafBotControlRequests', val)}
                                    unit="Million Reqs"
                                    labels={["0", "250M", "500M"]}
                                />
                            </FormSection>
                        </div>
                    )}

                    {attrs.wafFraudControlEnabled && (
                        <div className="pt-4 border-t border-gray-100">
                            <FormSection 
                                label="Fraud Control Analysis" 
                                tooltip="Requests analyzed by Fraud Control rules (Login/Signup pages) ($1.00 per million)."
                            >
                                <AWSSlider 
                                    min={0} max={100} 
                                    value={attrs.wafFraudControlRequests} 
                                    onChange={(val) => updateAttribute('wafFraudControlRequests', val)}
                                    unit="Million Reqs"
                                    labels={["0", "50M", "100M"]}
                                />
                            </FormSection>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};