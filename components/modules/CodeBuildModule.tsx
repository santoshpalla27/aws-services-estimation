import React from 'react';
import { Accordion, FormSection, AWSSlider, AWSSelect, AWSInput } from '../ui/AWS';
import { ResourceConfig, CodeBuildComputeType, CodeBuildOs } from '../../types';

interface CodeBuildModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const CodeBuildArchitectureConfig: React.FC<CodeBuildModuleProps> = ({ config, onUpdate }) => {
  const attrs = config.attributes;

  const updateAttribute = (key: string, value: any) => {
    onUpdate({
        ...config,
        attributes: { ...attrs, [key]: value }
    });
  };

  return (
    <div className="space-y-6">
        <Accordion title="Build Environment" defaultOpen={true}>
            <div className="space-y-6">
                <FormSection 
                    label="Project Name" 
                    info="Identifier for this build project"
                >
                     <AWSInput 
                        value={config.name} 
                        onChange={(e) => onUpdate({...config, name: e.target.value})} 
                        placeholder="My Build Project"
                    />
                </FormSection>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <FormSection 
                        label="Operating System" 
                        info="Build environment OS"
                    >
                         <AWSSelect 
                            value={attrs.codeBuildOs} 
                            onChange={(e) => updateAttribute('codeBuildOs', e.target.value)}
                        >
                            <option value={CodeBuildOs.LINUX}>Linux</option>
                            <option value={CodeBuildOs.WINDOWS}>Windows Server</option>
                        </AWSSelect>
                    </FormSection>
                    
                    <FormSection 
                        label="Compute Type" 
                        info="vCPU and Memory allocation"
                        tooltip="Larger compute types build faster but cost more per minute."
                    >
                         <AWSSelect 
                            value={attrs.codeBuildInstanceType} 
                            onChange={(e) => updateAttribute('codeBuildInstanceType', e.target.value)}
                        >
                            <option value={CodeBuildComputeType.BUILD_GENERAL1_SMALL}>general1.small (2 vCPU, 3 GB)</option>
                            <option value={CodeBuildComputeType.BUILD_GENERAL1_MEDIUM}>general1.medium (4 vCPU, 7 GB)</option>
                            <option value={CodeBuildComputeType.BUILD_GENERAL1_LARGE}>general1.large (8 vCPU, 15 GB)</option>
                        </AWSSelect>
                    </FormSection>
                </div>
            </div>
        </Accordion>
    </div>
  );
};

export const CodeBuildUsageConfig: React.FC<CodeBuildModuleProps> = ({ config, onUpdate }) => {
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
                    <span className="w-2 h-8 bg-green-500 rounded-full mr-3"></span>
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Build Activity</h4>
                </div>
                
                <div className="space-y-6">
                    <FormSection 
                        label="Build Duration (Minutes/Month)" 
                        tooltip="Total minutes your builds run per month. First 100 mins of general1.small (Linux) are free."
                    >
                        <AWSSlider 
                            min={0} max={5000} 
                            value={attrs.codeBuildMinutes} 
                            onChange={(val) => updateAttribute('codeBuildMinutes', val)}
                            unit="Minutes"
                            labels={["0", "2500", "5000"]}
                        />
                    </FormSection>
                </div>
            </div>
        </div>
    );
};