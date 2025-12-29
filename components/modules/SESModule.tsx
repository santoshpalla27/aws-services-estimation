import React from 'react';
import { Accordion, FormSection, AWSSlider, AWSInput, AWSToggle } from '../ui/AWS';
import { ResourceConfig } from '../../types';

interface SESModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const SESArchitectureConfig: React.FC<SESModuleProps> = ({ config, onUpdate }) => {
  const attrs = config.attributes;

  const updateAttribute = (key: string, value: any) => {
    onUpdate({
        ...config,
        attributes: { ...attrs, [key]: value }
    });
  };

  return (
    <div className="space-y-6">
        <Accordion title="Email Configuration" defaultOpen={true}>
            <div className="space-y-6">
                <FormSection 
                    label="Identity Name" 
                    info="Domain or Email Address"
                >
                     <AWSInput 
                        value={config.name} 
                        onChange={(e) => onUpdate({...config, name: e.target.value})} 
                        placeholder="mailer.example.com"
                    />
                </FormSection>

                <FormSection 
                    label="Dedicated IP" 
                    info="Use a dedicated IP address for sending"
                    tooltip="Dedicated IPs (~$24.95/mo) isolate your sender reputation."
                >
                     <AWSToggle 
                        label="Enable Dedicated IP"
                        checked={attrs.sesDedicatedIpEnabled}
                        onChange={(val) => updateAttribute('sesDedicatedIpEnabled', val)}
                     />
                </FormSection>
            </div>
        </Accordion>
    </div>
  );
};

export const SESUsageConfig: React.FC<SESModuleProps> = ({ config, onUpdate }) => {
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
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Email Traffic</h4>
                </div>
                
                <div className="space-y-6">
                    <FormSection 
                        label="Monthly Emails" 
                        tooltip="Total number of emails sent per month."
                    >
                        <AWSSlider 
                            min={0} max={1000} 
                            value={attrs.sesEmailMessages} 
                            onChange={(val) => updateAttribute('sesEmailMessages', val)}
                            unit="x 1000 Emails"
                            labels={["0", "500k", "1M"]}
                        />
                    </FormSection>

                    <FormSection 
                        label="Data Transfer Out" 
                        tooltip="Amount of data transferred (attachments, message body) to the Internet."
                    >
                        <AWSSlider 
                            min={0} max={100} 
                            value={attrs.sesDataTransferOut} 
                            onChange={(val) => updateAttribute('sesDataTransferOut', val)}
                            unit="GB/Mo"
                            labels={["0", "50 GB", "100 GB"]}
                        />
                    </FormSection>
                </div>
            </div>
        </div>
    );
};