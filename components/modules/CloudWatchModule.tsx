import React from 'react';
import { Accordion, FormSection, AWSSlider, AWSInput } from '../ui/AWS';
import { ResourceConfig } from '../../types';

interface CloudWatchModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const CloudWatchArchitectureConfig: React.FC<CloudWatchModuleProps> = ({ config, onUpdate }) => {
  const attrs = config.attributes;

  const updateAttribute = (key: string, value: any) => {
    onUpdate({
        ...config,
        attributes: { ...attrs, [key]: value }
    });
  };

  return (
    <div className="space-y-6">
        {/* 1. Metrics & Dashboards */}
        <Accordion title="Metrics & Dashboards" defaultOpen={true}>
            <div className="space-y-6">
                <FormSection 
                    label="Resource Name" 
                    info="Identifier for this CloudWatch configuration"
                >
                     <AWSInput 
                        value={config.name} 
                        onChange={(e) => onUpdate({...config, name: e.target.value})} 
                        placeholder="Project Monitoring"
                    />
                </FormSection>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <FormSection 
                        label="Custom Metrics" 
                        info="Number of custom metrics"
                        tooltip="Metrics published by your applications or custom scripts. Standard AWS metrics (e.g., EC2 CPU) are free."
                    >
                         <AWSInput 
                            type="number" min={0}
                            value={attrs.cwCustomMetrics}
                            onChange={(e) => updateAttribute('cwCustomMetrics', Number(e.target.value))}
                            unit="Metrics"
                        />
                    </FormSection>
                    
                    <FormSection 
                        label="Dashboards" 
                        info="Custom visual consoles"
                        tooltip="Custom dashboards to visualize metrics and logs ($3.00/dashboard/month)."
                    >
                         <AWSInput 
                            type="number" min={0}
                            value={attrs.cwDashboards}
                            onChange={(e) => updateAttribute('cwDashboards', Number(e.target.value))}
                            unit="Dashboards"
                        />
                    </FormSection>
                </div>
            </div>
        </Accordion>

        {/* 2. Alarms */}
        <Accordion title="Alarms">
             <div className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <FormSection 
                        label="Standard Alarms" 
                        info="Evaluated every 60s or more"
                        tooltip="Alarms that check metrics at a frequency of 60 seconds or longer ($0.10/alarm)."
                     >
                         <AWSInput 
                            type="number" min={0}
                            value={attrs.cwAlarmsStandard}
                            onChange={(e) => updateAttribute('cwAlarmsStandard', Number(e.target.value))}
                            unit="Alarms"
                        />
                     </FormSection>
                     
                     <FormSection 
                        label="High-Resolution Alarms" 
                        info="Evaluated every 10s or 30s"
                        tooltip="Alarms that check metrics at a frequency of 10 seconds or 30 seconds ($0.30/alarm)."
                     >
                         <AWSInput 
                            type="number" min={0}
                            value={attrs.cwAlarmsHighRes}
                            onChange={(e) => updateAttribute('cwAlarmsHighRes', Number(e.target.value))}
                            unit="Alarms"
                        />
                     </FormSection>
                 </div>
                 
                 <FormSection 
                    label="Contributor Insights Rules" 
                    tooltip="Rules to identify top contributors to log data (e.g. top talkers). Charged per rule/month."
                 >
                     <AWSInput 
                        type="number" min={0}
                        value={attrs.cwContributorInsightsRules}
                        onChange={(e) => updateAttribute('cwContributorInsightsRules', Number(e.target.value))}
                        unit="Rules"
                    />
                 </FormSection>
             </div>
        </Accordion>

        {/* 3. Synthetics & RUM */}
        <Accordion title="Synthetics & RUM">
            <div className="space-y-6">
                <FormSection 
                    label="Synthetics Canaries (Total Runs/Mo)" 
                    info="Automated scripts checking endpoints"
                    tooltip="Configurable scripts (canaries) that run on a schedule. Cost is per canary run."
                >
                    <div className="flex flex-col gap-2">
                        <AWSInput 
                            type="number" min={0}
                            value={attrs.cwSyntheticsCanaryRuns}
                            onChange={(e) => updateAttribute('cwSyntheticsCanaryRuns', Number(e.target.value))}
                            unit="Runs/Mo"
                        />
                        <p className="text-xs text-gray-400 italic">Example: 1 canary running every 5 min = ~8,640 runs/mo</p>
                    </div>
                </FormSection>

                <div className="pt-4 border-t border-gray-100">
                    <FormSection 
                        label="Real User Monitoring (RUM)" 
                        tooltip="Collects data from actual user sessions on web/mobile apps."
                    >
                        <AWSSlider 
                            min={0} max={1000} 
                            value={attrs.cwRumEvents} 
                            onChange={(val) => updateAttribute('cwRumEvents', val)}
                            unit="x 100k Events"
                            labels={["0", "50M Events", "100M Events"]}
                        />
                    </FormSection>
                </div>
            </div>
        </Accordion>
    </div>
  );
};

export const CloudWatchUsageConfig: React.FC<CloudWatchModuleProps> = ({ config, onUpdate }) => {
    const attrs = config.attributes;
    const updateAttribute = (key: string, value: any) => {
        onUpdate({
            ...config,
            attributes: { ...attrs, [key]: value }
        });
    };

    return (
        <div className="space-y-4">
            {/* Logs */}
            <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                    <span className="w-2 h-8 bg-purple-500 rounded-full mr-3"></span>
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Logs</h4>
                </div>
                
                <div className="space-y-6">
                    <FormSection 
                        label="Logs Ingestion" 
                        tooltip="Data pushed to CloudWatch Logs (e.g. from EC2, Lambda, or SDK)."
                    >
                        <AWSSlider 
                            min={0} max={5000} 
                            value={attrs.cwLogsIngested} 
                            onChange={(val) => updateAttribute('cwLogsIngested', val)}
                            unit="GB/mo"
                            labels={["0", "2.5 TB", "5 TB"]}
                        />
                    </FormSection>

                    <FormSection 
                        label="Logs Storage" 
                        tooltip="Archived log data retained in CloudWatch."
                    >
                        <AWSSlider 
                            min={0} max={10000} 
                            value={attrs.cwLogsStored} 
                            onChange={(val) => updateAttribute('cwLogsStored', val)}
                            unit="GB"
                            labels={["0", "5 TB", "10 TB"]}
                        />
                    </FormSection>
                </div>
            </div>

            {/* Events */}
            <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                    <span className="w-2 h-8 bg-pink-500 rounded-full mr-3"></span>
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">EventBridge</h4>
                </div>
                <FormSection 
                    label="Custom Events" 
                    tooltip="Custom events published to EventBridge event buses."
                >
                    <AWSSlider 
                        min={0} max={100} 
                        value={attrs.cwEventsCustom} 
                        onChange={(val) => updateAttribute('cwEventsCustom', val)}
                        unit="Million Events"
                        labels={["0", "50M", "100M"]}
                    />
                </FormSection>
            </div>
        </div>
    );
};