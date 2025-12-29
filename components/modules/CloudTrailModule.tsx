import React from 'react';
import { Accordion, FormSection, AWSSlider, AWSInput, AWSToggle } from '../ui/AWS';
import { ResourceConfig } from '../../types';

interface CloudTrailModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const CloudTrailArchitectureConfig: React.FC<CloudTrailModuleProps> = ({ config, onUpdate }) => {
  const attrs = config.attributes;

  const updateAttribute = (key: string, value: any) => {
    onUpdate({
        ...config,
        attributes: { ...attrs, [key]: value }
    });
  };

  return (
    <div className="space-y-6">
        {/* 1. Trails Configuration */}
        <Accordion title="Trails Configuration" defaultOpen={true}>
            <div className="space-y-6">
                <FormSection 
                    label="Configuration Name" 
                    info="Identifier for this Trail setup"
                >
                     <AWSInput 
                        value={config.name} 
                        onChange={(e) => onUpdate({...config, name: e.target.value})} 
                        placeholder="Organization Trail"
                    />
                </FormSection>

                <FormSection 
                    label="Additional Management Events" 
                    info="Copies beyond the first free trail"
                    tooltip="The first copy of management events is free. You pay for additional copies (e.g., if you have multiple trails logging the same management events)."
                >
                    <AWSSlider 
                        min={0} max={100} 
                        value={attrs.trailPaidManagementEvents} 
                        onChange={(val) => updateAttribute('trailPaidManagementEvents', val)}
                        unit="Million Events"
                        labels={["0", "50M", "100M"]}
                    />
                </FormSection>

                <FormSection 
                    label="Data Events" 
                    info="S3 object-level and Lambda execution activity"
                    tooltip="Data events provide visibility into the resource operations performed on or within a resource. Charged per 100,000 events."
                >
                    <AWSSlider 
                        min={0} max={500} 
                        value={attrs.trailDataEvents} 
                        onChange={(val) => updateAttribute('trailDataEvents', val)}
                        unit="Million Events"
                        labels={["0", "250M", "500M"]}
                    />
                </FormSection>
            </div>
        </Accordion>

        {/* 2. Insights */}
        <Accordion title="CloudTrail Insights">
             <div className="space-y-6">
                 <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                     <div className="mb-4">
                        <AWSToggle 
                            label="Enable CloudTrail Insights" 
                            checked={attrs.trailInsightsEnabled}
                            onChange={(val) => updateAttribute('trailInsightsEnabled', val)}
                            tooltip="Insights events identify unusual activity in your account. You are charged based on the number of write management events analyzed."
                        />
                     </div>

                     {attrs.trailInsightsEnabled && (
                        <div className="animate-in fade-in pl-4 border-l-2 border-aws-link">
                             <FormSection 
                                label="Analyzed Write Events" 
                                tooltip="The volume of write management events analyzed to detect anomalies."
                            >
                                <AWSSlider 
                                    min={0} max={50} 
                                    value={attrs.trailInsightsAnalyzedEvents} 
                                    onChange={(val) => updateAttribute('trailInsightsAnalyzedEvents', val)}
                                    unit="Million Events"
                                    labels={["0", "25M", "50M"]}
                                />
                            </FormSection>
                        </div>
                     )}
                 </div>
             </div>
        </Accordion>

        {/* 3. CloudTrail Lake */}
        <Accordion title="CloudTrail Lake">
            <div className="space-y-6">
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                     <div className="mb-4">
                        <AWSToggle 
                            label="Enable CloudTrail Lake" 
                            checked={attrs.trailLakeEnabled}
                            onChange={(val) => updateAttribute('trailLakeEnabled', val)}
                            tooltip="A managed data lake for capturing, storing, accessing, and analyzing user and API activity on AWS."
                        />
                     </div>

                     {attrs.trailLakeEnabled && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in pl-4 border-l-2 border-aws-link">
                             <FormSection 
                                label="Ingestion" 
                                tooltip="Amount of data ingested into the Lake."
                            >
                                <AWSInput 
                                    type="number" min={0}
                                    value={attrs.trailLakeIngestion}
                                    onChange={(e) => updateAttribute('trailLakeIngestion', Number(e.target.value))}
                                    unit="GB"
                                />
                            </FormSection>
                            <FormSection 
                                label="Storage (Retention)" 
                                tooltip="Amount of compressed data stored."
                            >
                                <AWSInput 
                                    type="number" min={0}
                                    value={attrs.trailLakeStorage}
                                    onChange={(e) => updateAttribute('trailLakeStorage', Number(e.target.value))}
                                    unit="GB"
                                />
                            </FormSection>
                        </div>
                     )}
                 </div>
            </div>
        </Accordion>
    </div>
  );
};

export const CloudTrailUsageConfig: React.FC<CloudTrailModuleProps> = ({ config, onUpdate }) => {
    const attrs = config.attributes;
    const updateAttribute = (key: string, value: any) => {
        onUpdate({
            ...config,
            attributes: { ...attrs, [key]: value }
        });
    };

    if (!attrs.trailLakeEnabled) {
        return (
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center text-sm text-gray-500">
                Enable CloudTrail Lake to configure query usage.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                    <span className="w-2 h-8 bg-blue-600 rounded-full mr-3"></span>
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Lake Queries</h4>
                </div>
                
                <FormSection 
                    label="Data Scanned" 
                    tooltip="Amount of data scanned by queries in CloudTrail Lake."
                >
                    <AWSSlider 
                        min={0} max={5000} 
                        value={attrs.trailLakeScanned} 
                        onChange={(val) => updateAttribute('trailLakeScanned', val)}
                        unit="GB"
                        labels={["0", "2.5 TB", "5 TB"]}
                    />
                </FormSection>
            </div>
        </div>
    );
};