import React from 'react';
import { Accordion, FormSection, AWSSlider, AWSInput, AWSToggle } from '../ui/AWS';
import { ResourceConfig } from '../../types';

interface EventBridgeModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const EventBridgeArchitectureConfig: React.FC<EventBridgeModuleProps> = ({ config, onUpdate }) => {
  const attrs = config.attributes;

  const updateAttribute = (key: string, value: any) => {
    onUpdate({
        ...config,
        attributes: { ...attrs, [key]: value }
    });
  };

  return (
    <div className="space-y-6">
        {/* 1. Event Bus */}
        <Accordion title="Event Bus Configuration" defaultOpen={true}>
            <div className="space-y-6">
                <FormSection 
                    label="Resource Name" 
                    info="Identifier for this Event Bus"
                >
                     <AWSInput 
                        value={config.name} 
                        onChange={(e) => onUpdate({...config, name: e.target.value})} 
                        placeholder="My Event Bus"
                    />
                </FormSection>

                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-800">
                    <h4 className="font-bold flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Serverless Event Bus
                    </h4>
                    <p className="mt-1">
                        Amazon EventBridge is a serverless event bus service. Standard AWS service events are free. You pay for custom events, cross-region events, and optional features like archiving.
                    </p>
                </div>
            </div>
        </Accordion>

        {/* 2. Additional Features */}
        <Accordion title="Additional Features">
            <div className="space-y-6">
                <FormSection 
                    label="Schema Registry" 
                    tooltip="Discover, create, and manage OpenAPI schemas for events."
                >
                    <AWSToggle 
                        label="Enable Schema Registry"
                        checked={attrs.eventBridgeSchemaRegistry}
                        onChange={(val) => updateAttribute('eventBridgeSchemaRegistry', val)}
                    />
                </FormSection>
            </div>
        </Accordion>
    </div>
  );
};

export const EventBridgeUsageConfig: React.FC<EventBridgeModuleProps> = ({ config, onUpdate }) => {
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
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Events & Processing</h4>
                </div>
                
                <div className="space-y-6">
                    <FormSection 
                        label="Custom Events Published" 
                        tooltip="Events published to your custom event bus ($1.00/million)."
                    >
                        <AWSSlider 
                            min={0} max={100} 
                            value={attrs.eventBridgeCustomEvents} 
                            onChange={(val) => updateAttribute('eventBridgeCustomEvents', val)}
                            unit="Million Events"
                            labels={["0", "50M", "100M"]}
                        />
                    </FormSection>

                    <FormSection 
                        label="Cross-Region Events" 
                        tooltip="Events sent to another region ($1.00/million + data transfer)."
                    >
                        <AWSSlider 
                            min={0} max={50} 
                            value={attrs.eventBridgeCrossRegionEvents} 
                            onChange={(val) => updateAttribute('eventBridgeCrossRegionEvents', val)}
                            unit="Million Events"
                            labels={["0", "25M", "50M"]}
                        />
                    </FormSection>

                    <div className="pt-4 border-t border-gray-100">
                        <FormSection 
                            label="Archive Processing" 
                            tooltip="Data volume for archived events and replay."
                        >
                            <AWSSlider 
                                min={0} max={1000} 
                                value={attrs.eventBridgeArchiveProcessing} 
                                onChange={(val) => updateAttribute('eventBridgeArchiveProcessing', val)}
                                unit="GB"
                                labels={["0", "500 GB", "1 TB"]}
                            />
                        </FormSection>
                    </div>
                </div>
            </div>
        </div>
    );
};