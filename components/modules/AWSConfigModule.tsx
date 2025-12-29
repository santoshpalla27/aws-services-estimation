import React from 'react';
import { Accordion, FormSection, AWSSlider, AWSInput } from '../ui/AWS';
import { ResourceConfig } from '../../types';

interface ConfigModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const AWSConfigArchitectureConfig: React.FC<ConfigModuleProps> = ({ config, onUpdate }) => {
  return (
    <div className="space-y-6">
        <Accordion title="Recorder Configuration" defaultOpen={true}>
            <div className="space-y-6">
                <FormSection 
                    label="Resource Name" 
                    info="Identifier for this Config setup"
                >
                     <AWSInput 
                        value={config.name} 
                        onChange={(e) => onUpdate({...config, name: e.target.value})} 
                        placeholder="My Config Recorder"
                    />
                </FormSection>
                
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-800">
                    <h4 className="font-bold flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Resource Tracking
                    </h4>
                    <p className="mt-1">
                        AWS Config records configuration changes to your AWS resources. Costs are based on the number of configuration items (CIs) recorded and rule evaluations.
                    </p>
                </div>
            </div>
        </Accordion>
    </div>
  );
};

export const AWSConfigUsageConfig: React.FC<ConfigModuleProps> = ({ config, onUpdate }) => {
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
                    <span className="w-2 h-8 bg-purple-500 rounded-full mr-3"></span>
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Recording & Rules</h4>
                </div>
                
                <div className="space-y-6">
                    <FormSection 
                        label="Configuration Items (CIs)" 
                        tooltip="Number of changes recorded per month ($0.003 per CI)."
                    >
                        <AWSSlider 
                            min={0} max={100000} 
                            value={attrs.configConfigurationItems} 
                            onChange={(val) => updateAttribute('configConfigurationItems', val)}
                            unit="CIs"
                            labels={["0", "50k", "100k"]}
                        />
                    </FormSection>

                    <FormSection 
                        label="Rule Evaluations" 
                        tooltip="Number of Config rule evaluations per month ($0.001 per eval)."
                    >
                        <AWSSlider 
                            min={0} max={100000} 
                            value={attrs.configRuleEvaluations} 
                            onChange={(val) => updateAttribute('configRuleEvaluations', val)}
                            unit="Evals"
                            labels={["0", "50k", "100k"]}
                        />
                    </FormSection>
                </div>
            </div>
        </div>
    );
};