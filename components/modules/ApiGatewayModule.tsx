import React from 'react';
import { Accordion, FormSection, AWSSlider, AWSInput, AWSSelect, AWSToggle } from '../ui/AWS';
import { ResourceConfig, ApiGatewayType, ApiGatewayCacheSize } from '../../types';

interface ApiGatewayModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const ApiGatewayArchitectureConfig: React.FC<ApiGatewayModuleProps> = ({ config, onUpdate }) => {
  const attrs = config.attributes;

  const updateAttribute = (key: string, value: any) => {
    onUpdate({
        ...config,
        attributes: { ...attrs, [key]: value }
    });
  };

  return (
    <div className="space-y-6">
        {/* 1. API Settings */}
        <Accordion title="API Settings" defaultOpen={true}>
            <div className="space-y-6">
                <FormSection 
                    label="API Name" 
                    info="Identifier for this API"
                >
                     <AWSInput 
                        value={config.name} 
                        onChange={(e) => onUpdate({...config, name: e.target.value})} 
                        placeholder="My Public API"
                    />
                </FormSection>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <FormSection 
                        label="API Type" 
                        info="Protocol type"
                        tooltip="REST APIs are feature-rich. HTTP APIs are low-latency and lower cost."
                    >
                         <AWSSelect 
                            value={attrs.apiGwType} 
                            onChange={(e) => updateAttribute('apiGwType', e.target.value)}
                        >
                            <option value={ApiGatewayType.REST}>REST API</option>
                            <option value={ApiGatewayType.HTTP}>HTTP API</option>
                        </AWSSelect>
                    </FormSection>
                </div>
            </div>
        </Accordion>

        {/* 2. Caching (REST Only) */}
        {attrs.apiGwType === ApiGatewayType.REST && (
            <Accordion title="Performance & Caching">
                 <div className="space-y-6">
                     <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                         <div className="flex justify-between items-center mb-4">
                            <AWSToggle 
                                label="Enable API Caching" 
                                checked={attrs.apiGwCacheEnabled}
                                onChange={(val) => updateAttribute('apiGwCacheEnabled', val)}
                                tooltip="Provision a dedicated cache cluster to improve latency and reduce backend load."
                            />
                         </div>

                         {attrs.apiGwCacheEnabled && (
                            <div className="animate-in fade-in slide-in-from-top-2">
                                <FormSection label="Cache Capacity">
                                     <AWSSelect 
                                        value={attrs.apiGwCacheSize} 
                                        onChange={(e) => updateAttribute('apiGwCacheSize', e.target.value)}
                                    >
                                        {Object.values(ApiGatewayCacheSize).map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </AWSSelect>
                                </FormSection>
                            </div>
                         )}
                     </div>
                 </div>
            </Accordion>
        )}
    </div>
  );
};

export const ApiGatewayUsageConfig: React.FC<ApiGatewayModuleProps> = ({ config, onUpdate }) => {
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
                    <span className="w-2 h-8 bg-purple-600 rounded-full mr-3"></span>
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Traffic & Transfer</h4>
                </div>
                
                <div className="space-y-6">
                    <FormSection 
                        label="Monthly Requests" 
                        tooltip="Total number of API calls per month."
                    >
                        <AWSSlider 
                            min={0} max={100} 
                            value={attrs.apiGwRequests} 
                            onChange={(val) => updateAttribute('apiGwRequests', val)}
                            unit="Million Reqs"
                            labels={["0", "50M", "100M"]}
                        />
                    </FormSection>

                    <FormSection 
                        label="Data Transfer Out" 
                        tooltip="Amount of data transferred from API Gateway to the Internet."
                    >
                        <AWSSlider 
                            min={0} max={5000} 
                            value={attrs.apiGwDataTransferOut} 
                            onChange={(val) => updateAttribute('apiGwDataTransferOut', val)}
                            unit="GB/Mo"
                            labels={["0", "2.5 TB", "5 TB"]}
                        />
                    </FormSection>
                </div>
            </div>
        </div>
    );
};