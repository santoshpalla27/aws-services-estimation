import React from 'react';
import { Accordion, FormSection, AWSSlider, AWSInput, AWSSelect, AWSToggle } from '../ui/AWS';
import { ResourceConfig, LambdaArchitecture } from '../../types';

interface LambdaModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const LambdaArchitectureConfig: React.FC<LambdaModuleProps> = ({ config, onUpdate }) => {
  const attrs = config.attributes;

  const updateAttribute = (key: string, value: any) => {
    onUpdate({
        ...config,
        attributes: { ...attrs, [key]: value }
    });
  };

  return (
    <div className="space-y-6">
        {/* 1. Function Settings */}
        <Accordion title="Function Settings" defaultOpen={true}>
            <div className="space-y-6">
                <FormSection 
                    label="Function Name" 
                    info="Identifier for this function"
                >
                     <AWSInput 
                        value={config.name} 
                        onChange={(e) => onUpdate({...config, name: e.target.value})} 
                        placeholder="My Lambda Function"
                    />
                </FormSection>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <FormSection 
                        label="Architecture" 
                        info="Instruction set architecture"
                        tooltip="x86_64 is standard. Arm64 (Graviton) offers better price-performance."
                    >
                         <AWSSelect 
                            value={attrs.lambdaArchitecture} 
                            onChange={(e) => updateAttribute('lambdaArchitecture', e.target.value)}
                        >
                            <option value={LambdaArchitecture.X86_64}>x86_64</option>
                            <option value={LambdaArchitecture.ARM64}>arm64 (Graviton)</option>
                        </AWSSelect>
                    </FormSection>
                    
                    <FormSection 
                        label="Memory (MB)" 
                        info="Allocated memory size"
                        tooltip="Amount of memory available to the function at runtime. CPU power scales linearly with memory."
                    >
                         <AWSSlider 
                            min={128} max={10240} 
                            value={attrs.lambdaMemory} 
                            onChange={(val) => updateAttribute('lambdaMemory', val)}
                            unit="MB"
                            labels={["128", "5120", "10240"]}
                        />
                    </FormSection>
                </div>

                <div className="pt-4 border-t border-gray-100">
                    <FormSection 
                        label="Ephemeral Storage (MB)" 
                        info="Temporary storage (/tmp)"
                        tooltip="Amount of ephemeral storage available to the function. First 512MB is free."
                    >
                         <AWSSlider 
                            min={512} max={10240} 
                            value={attrs.lambdaEphemeralStorage} 
                            onChange={(val) => updateAttribute('lambdaEphemeralStorage', val)}
                            unit="MB"
                            labels={["512", "5120", "10240"]}
                        />
                    </FormSection>
                </div>
            </div>
        </Accordion>

        {/* 2. Provisioned Concurrency */}
        <Accordion title="Provisioned Concurrency">
             <div className="space-y-6">
                 <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                     <p className="text-sm text-gray-600 mb-4">
                         Provisioned Concurrency keeps functions initialized and ready to respond in double-digit milliseconds.
                     </p>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <FormSection 
                            label="Concurrency Amount" 
                            tooltip="Number of instances to keep warm."
                         >
                             <AWSInput 
                                type="number" min={0}
                                value={attrs.lambdaProvisionedConcurrency}
                                onChange={(e) => updateAttribute('lambdaProvisionedConcurrency', Number(e.target.value))}
                                unit="Instances"
                            />
                         </FormSection>
                         
                         {attrs.lambdaProvisionedConcurrency > 0 && (
                            <FormSection 
                                label="Hours per Month" 
                                tooltip="How many hours per month this concurrency is enabled."
                            >
                                <AWSInput 
                                    type="number" min={0} max={730}
                                    value={attrs.lambdaProvisionedHours}
                                    onChange={(e) => updateAttribute('lambdaProvisionedHours', Number(e.target.value))}
                                    unit="Hours"
                                />
                            </FormSection>
                         )}
                     </div>
                 </div>
             </div>
        </Accordion>
    </div>
  );
};

export const LambdaUsageConfig: React.FC<LambdaModuleProps> = ({ config, onUpdate }) => {
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
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Invocation Traffic</h4>
                </div>
                
                <div className="space-y-6">
                    <FormSection 
                        label="Monthly Requests" 
                        tooltip="Total number of times your function code is executed."
                    >
                        <AWSSlider 
                            min={0} max={100} 
                            value={attrs.lambdaRequests} 
                            onChange={(val) => updateAttribute('lambdaRequests', val)}
                            unit="Million Reqs"
                            labels={["0", "50M", "100M"]}
                        />
                    </FormSection>

                    <FormSection 
                        label="Average Duration (ms)" 
                        tooltip="Average time it takes for your function code to execute."
                    >
                         <AWSInput 
                            type="number" min={1}
                            value={attrs.lambdaDurationMs}
                            onChange={(e) => updateAttribute('lambdaDurationMs', Number(e.target.value))}
                            unit="ms"
                        />
                    </FormSection>
                </div>
            </div>
        </div>
    );
};