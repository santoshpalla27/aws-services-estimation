import React from 'react';
import { Accordion, FormSection, AWSSlider, AWSInput } from '../ui/AWS';
import { ResourceConfig } from '../../types';

interface SNSModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const SNSArchitectureConfig: React.FC<SNSModuleProps> = ({ config, onUpdate }) => {
  const attrs = config.attributes;

  const updateAttribute = (key: string, value: any) => {
    onUpdate({
        ...config,
        attributes: { ...attrs, [key]: value }
    });
  };

  return (
    <div className="space-y-6">
        <Accordion title="Topic Configuration" defaultOpen={true}>
            <div className="space-y-6">
                <FormSection 
                    label="Topic Name" 
                    info="Identifier for this SNS Topic"
                >
                     <AWSInput 
                        value={config.name} 
                        onChange={(e) => onUpdate({...config, name: e.target.value})} 
                        placeholder="My Notification Topic"
                    />
                </FormSection>
                
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-800">
                    <h4 className="font-bold flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Simple Notification Service
                    </h4>
                    <p className="mt-1">
                        SNS costs are primarily based on the number of API requests (publishes, delivers) and the data transferred out.
                    </p>
                </div>
            </div>
        </Accordion>
    </div>
  );
};

export const SNSUsageConfig: React.FC<SNSModuleProps> = ({ config, onUpdate }) => {
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
                    <span className="w-2 h-8 bg-pink-500 rounded-full mr-3"></span>
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Usage & Transfer</h4>
                </div>
                
                <div className="space-y-6">
                    <FormSection 
                        label="Monthly Requests" 
                        tooltip="Total number of API requests (Publish, Subscribe, etc.) and deliveries per month."
                    >
                        <AWSSlider 
                            min={0} max={100} 
                            value={attrs.snsRequests} 
                            onChange={(val) => updateAttribute('snsRequests', val)}
                            unit="Million Reqs"
                            labels={["0", "50M", "100M"]}
                        />
                    </FormSection>

                    <FormSection 
                        label="Data Transfer Out" 
                        tooltip="Amount of data transferred from SNS to the Internet."
                    >
                        <AWSSlider 
                            min={0} max={1000} 
                            value={attrs.snsDataTransferOut} 
                            onChange={(val) => updateAttribute('snsDataTransferOut', val)}
                            unit="GB/Mo"
                            labels={["0", "500 GB", "1 TB"]}
                        />
                    </FormSection>
                </div>
            </div>
        </div>
    );
};