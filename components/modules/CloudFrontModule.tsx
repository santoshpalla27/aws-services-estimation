import React from 'react';
import { Accordion, FormSection, AWSSlider, AWSInput, AWSSelect, AWSToggle } from '../ui/AWS';
import { ResourceConfig, CloudFrontPriceClass } from '../../types';

interface CloudFrontModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const CloudFrontArchitectureConfig: React.FC<CloudFrontModuleProps> = ({ config, onUpdate }) => {
  const attrs = config.attributes;

  const updateAttribute = (key: string, value: any) => {
    onUpdate({
        ...config,
        attributes: { ...attrs, [key]: value }
    });
  };

  return (
    <div className="space-y-6">
        {/* 1. Distribution Settings */}
        <Accordion title="Distribution Settings" defaultOpen={true}>
            <div className="space-y-6">
                <FormSection 
                    label="Distribution Name" 
                    info="Identifier for this distribution"
                >
                     <AWSInput 
                        value={config.name} 
                        onChange={(e) => onUpdate({...config, name: e.target.value})} 
                        placeholder="My Content Delivery"
                    />
                </FormSection>

                <FormSection 
                    label="Price Class" 
                    info="Determine edge locations included"
                    tooltip="Select the price class that corresponds to the regions where you want your content to be delivered. Price Class 100 is cheapest."
                >
                        <AWSSelect 
                        value={attrs.cfPriceClass} 
                        onChange={(e) => updateAttribute('cfPriceClass', e.target.value)}
                    >
                        {Object.values(CloudFrontPriceClass).map(pc => (
                            <option key={pc} value={pc}>{pc}</option>
                        ))}
                    </AWSSelect>
                </FormSection>
            </div>
        </Accordion>

        {/* 2. Security & Optimization */}
        <Accordion title="Security & Optimization">
                <div className="space-y-6">
                    <FormSection 
                        label="Custom SSL Certificate" 
                        tooltip="SNI Custom SSL is free. Dedicated IP Custom SSL costs $600/month."
                    >
                        <div className="flex flex-col gap-3">
                            <label className="flex items-center space-x-3 p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                                <input 
                                    type="radio" 
                                    name="sslType"
                                    checked={!attrs.cfDedicatedIp}
                                    onChange={() => updateAttribute('cfDedicatedIp', false)}
                                    className="h-4 w-4 text-aws-primary focus:ring-aws-primary border-gray-300"
                                />
                                <div>
                                    <span className="block text-sm font-medium text-gray-900">SNI Custom SSL (Free)</span>
                                    <span className="block text-xs text-gray-500">Serve traffic using Server Name Indication.</span>
                                </div>
                            </label>
                            
                            <label className="flex items-center space-x-3 p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                                <input 
                                    type="radio" 
                                    name="sslType"
                                    checked={attrs.cfDedicatedIp}
                                    onChange={() => updateAttribute('cfDedicatedIp', true)}
                                    className="h-4 w-4 text-aws-primary focus:ring-aws-primary border-gray-300"
                                />
                                <div>
                                    <span className="block text-sm font-medium text-gray-900">Dedicated IP Custom SSL ($600/mo)</span>
                                    <span className="block text-xs text-gray-500">Serve traffic using dedicated IP addresses for legacy client support.</span>
                                </div>
                            </label>
                        </div>
                    </FormSection>

                    <div className="pt-4 border-t border-gray-100">
                        <AWSToggle 
                            label="Enable Origin Shield" 
                            checked={attrs.cfOriginShieldEnabled}
                            onChange={(val) => updateAttribute('cfOriginShieldEnabled', val)}
                            tooltip="Centralized caching layer to reduce load on your origin. Incurs additional request fees."
                        />
                    </div>
                </div>
        </Accordion>
    </div>
  );
};

export const CloudFrontUsageConfig: React.FC<CloudFrontModuleProps> = ({ config, onUpdate }) => {
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
                    <span className="w-2 h-8 bg-blue-500 rounded-full mr-3"></span>
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Data Transfer</h4>
                </div>
                
                <FormSection 
                    label="Data Transfer Out (Internet)" 
                    tooltip="Volume of data transferred from CloudFront edge locations to the internet."
                >
                    <AWSSlider 
                        min={0} max={50000} 
                        value={attrs.cfDataTransferOut} 
                        onChange={(val) => updateAttribute('cfDataTransferOut', val)}
                        unit="GB/Mo"
                        labels={["0", "25 TB", "50 TB"]}
                    />
                </FormSection>
            </div>

            <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                    <span className="w-2 h-8 bg-purple-500 rounded-full mr-3"></span>
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Requests</h4>
                </div>

                <div className="space-y-6">
                    <FormSection 
                        label="HTTPS Requests" 
                        tooltip="Secure requests over SSL/TLS. Slightly more expensive."
                    >
                        <AWSSlider 
                            min={0} max={500} 
                            value={attrs.cfHttpsRequests} 
                            onChange={(val) => updateAttribute('cfHttpsRequests', val)}
                            unit="Million Reqs"
                            labels={["0", "250M", "500M"]}
                        />
                    </FormSection>

                    <FormSection 
                        label="HTTP Requests" 
                        tooltip="Standard non-secure requests."
                    >
                        <AWSSlider 
                            min={0} max={500} 
                            value={attrs.cfHttpRequests} 
                            onChange={(val) => updateAttribute('cfHttpRequests', val)}
                            unit="Million Reqs"
                            labels={["0", "250M", "500M"]}
                        />
                    </FormSection>

                    {attrs.cfOriginShieldEnabled && (
                        <div className="pt-4 border-t border-gray-100 animate-in fade-in">
                            <FormSection 
                                label="Origin Shield Requests" 
                                tooltip="Requests that hit the Origin Shield layer."
                            >
                                <AWSSlider 
                                    min={0} max={500} 
                                    value={attrs.cfOriginShieldRequests} 
                                    onChange={(val) => updateAttribute('cfOriginShieldRequests', val)}
                                    unit="Million Reqs"
                                    labels={["0", "250M", "500M"]}
                                />
                            </FormSection>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};