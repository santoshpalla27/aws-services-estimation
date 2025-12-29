import React from 'react';
import { Accordion, FormSection, AWSSlider, AWSInput } from '../ui/AWS';
import { ResourceConfig } from '../../types';

interface PinpointModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const PinpointArchitectureConfig: React.FC<PinpointModuleProps> = ({ config, onUpdate }) => {
  return (
    <div className="space-y-6">
        <Accordion title="Project Settings" defaultOpen={true}>
            <div className="space-y-6">
                <FormSection 
                    label="Project Name" 
                    info="Identifier for this Pinpoint project"
                >
                     <AWSInput 
                        value={config.name} 
                        onChange={(e) => onUpdate({...config, name: e.target.value})} 
                        placeholder="Customer Engagement"
                    />
                </FormSection>

                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-800">
                    <h4 className="font-bold flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Targeted Audience
                    </h4>
                    <p className="mt-1">
                        Pinpoint charges for the number of unique endpoints (Monthly Targeted Audience) and events collected. The first 5,000 endpoints are free.
                    </p>
                </div>
            </div>
        </Accordion>
    </div>
  );
};

export const PinpointUsageConfig: React.FC<PinpointModuleProps> = ({ config, onUpdate }) => {
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
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Audience & Events</h4>
                </div>
                
                <div className="space-y-6">
                    <FormSection 
                        label="Monthly Targeted Audience (MTA)" 
                        tooltip="Total number of unique endpoints (devices, email addresses, etc.) targeted per month."
                    >
                        <AWSInput 
                            type="number" min={0}
                            value={attrs.pinpointMTA} 
                            onChange={(e) => updateAttribute('pinpointMTA', Number(e.target.value))}
                            unit="Endpoints"
                        />
                    </FormSection>

                    <FormSection 
                        label="Events Collected" 
                        tooltip="Number of analytics events collected from apps/devices."
                    >
                        <AWSSlider 
                            min={0} max={1000} 
                            value={attrs.pinpointEvents} 
                            onChange={(val) => updateAttribute('pinpointEvents', val)}
                            unit="Million"
                            labels={["0", "500M", "1B"]}
                        />
                    </FormSection>
                </div>
            </div>
        </div>
    );
};