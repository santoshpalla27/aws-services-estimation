import React from 'react';
import { Accordion, FormSection, AWSInput } from '../ui/AWS';
import { ResourceConfig } from '../../types';

interface CodePipelineModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const CodePipelineArchitectureConfig: React.FC<CodePipelineModuleProps> = ({ config, onUpdate }) => {
  const attrs = config.attributes;

  const updateAttribute = (key: string, value: any) => {
    onUpdate({
        ...config,
        attributes: { ...attrs, [key]: value }
    });
  };

  return (
    <div className="space-y-6">
        <Accordion title="Pipeline Settings" defaultOpen={true}>
            <div className="space-y-6">
                <FormSection 
                    label="Pipeline Name" 
                    info="Identifier for this pipeline configuration"
                >
                     <AWSInput 
                        value={config.name} 
                        onChange={(e) => onUpdate({...config, name: e.target.value})} 
                        placeholder="My CI/CD Pipeline"
                    />
                </FormSection>

                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-800">
                    <h4 className="font-bold flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Continuous Delivery
                    </h4>
                    <p className="mt-1">
                        $1.00 per active pipeline per month. An active pipeline is one that has run at least once in the month. 
                        The first active pipeline in your account each month is free.
                    </p>
                </div>

                <FormSection 
                    label="Active Pipelines" 
                    tooltip="Number of pipelines you expect to run this month."
                >
                     <AWSInput 
                        type="number" min={1}
                        value={attrs.codePipelineActivePipelines}
                        onChange={(e) => updateAttribute('codePipelineActivePipelines', Number(e.target.value))}
                        unit="Pipelines"
                    />
                </FormSection>
            </div>
        </Accordion>
    </div>
  );
};

export const CodePipelineUsageConfig: React.FC<CodePipelineModuleProps> = ({ config, onUpdate }) => {
    return (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center text-sm text-gray-500">
            <p>CodePipeline costs are flat-rate based on the number of active pipelines configured in the Architecture tab.</p>
            <p className="mt-2">Storage for artifacts (S3) is calculated separately under S3.</p>
        </div>
    );
};