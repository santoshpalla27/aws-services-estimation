import React from 'react';
import { Accordion, FormSection, AWSSlider, AWSInput, AWSSelect } from '../ui/AWS';
import { ResourceConfig, StepFunctionsType } from '../../types';

interface StepFunctionsModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const StepFunctionsArchitectureConfig: React.FC<StepFunctionsModuleProps> = ({ config, onUpdate }) => {
  const attrs = config.attributes;

  const updateAttribute = (key: string, value: any) => {
    onUpdate({
        ...config,
        attributes: { ...attrs, [key]: value }
    });
  };

  return (
    <div className="space-y-6">
        <Accordion title="State Machine Settings" defaultOpen={true}>
            <div className="space-y-6">
                <FormSection 
                    label="Resource Name" 
                    info="Identifier for this State Machine"
                >
                     <AWSInput 
                        value={config.name} 
                        onChange={(e) => onUpdate({...config, name: e.target.value})} 
                        placeholder="My Workflow"
                    />
                </FormSection>

                <FormSection 
                    label="Workflow Type" 
                    info="Standard or Express"
                    tooltip="Standard for long-running, durable workflows. Express for high-volume, short-duration event processing."
                >
                     <AWSSelect 
                        value={attrs.sfnType} 
                        onChange={(e) => updateAttribute('sfnType', e.target.value)}
                    >
                        <option value={StepFunctionsType.STANDARD}>Standard Workflow</option>
                        <option value={StepFunctionsType.EXPRESS}>Express Workflow</option>
                    </AWSSelect>
                </FormSection>
            </div>
        </Accordion>
    </div>
  );
};

export const StepFunctionsUsageConfig: React.FC<StepFunctionsModuleProps> = ({ config, onUpdate }) => {
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
                    <span className="w-2 h-8 bg-orange-500 rounded-full mr-3"></span>
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                        {attrs.sfnType === StepFunctionsType.STANDARD ? "State Transitions" : "Requests & Duration"}
                    </h4>
                </div>
                
                <div className="space-y-6">
                    {attrs.sfnType === StepFunctionsType.STANDARD ? (
                        <FormSection 
                            label="State Transitions" 
                            tooltip="Count of state transitions per month ($0.025 per 1,000)."
                        >
                            <AWSSlider 
                                min={0} max={50} 
                                value={attrs.sfnTransitions} 
                                onChange={(val) => updateAttribute('sfnTransitions', val)}
                                unit="Million"
                                labels={["0", "25M", "50M"]}
                            />
                        </FormSection>
                    ) : (
                        <>
                            <FormSection 
                                label="Monthly Requests" 
                                tooltip="Number of workflow executions ($1.00 per million)."
                            >
                                <AWSSlider 
                                    min={0} max={100} 
                                    value={attrs.sfnExpressRequests} 
                                    onChange={(val) => updateAttribute('sfnExpressRequests', val)}
                                    unit="Million"
                                    labels={["0", "50M", "100M"]}
                                />
                            </FormSection>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                                <FormSection label="Avg Duration (ms)">
                                    <AWSInput 
                                        type="number" min={100}
                                        value={attrs.sfnExpressDurationMs} 
                                        onChange={(e) => updateAttribute('sfnExpressDurationMs', Number(e.target.value))}
                                        unit="ms"
                                    />
                                </FormSection>
                                <FormSection label="Memory (MB)">
                                    <AWSInput 
                                        type="number" min={64}
                                        value={attrs.sfnExpressMemory} 
                                        onChange={(e) => updateAttribute('sfnExpressMemory', Number(e.target.value))}
                                        unit="MB"
                                    />
                                </FormSection>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};