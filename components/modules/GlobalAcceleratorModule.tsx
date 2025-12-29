import React from 'react';
import { Accordion, FormSection, AWSSlider, AWSInput } from '../ui/AWS';
import { ResourceConfig } from '../../types';

interface GAModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const GlobalAcceleratorArchitectureConfig: React.FC<GAModuleProps> = ({ config, onUpdate }) => {
  const attrs = config.attributes;

  const updateAttribute = (key: string, value: any) => {
    onUpdate({
        ...config,
        attributes: { ...attrs, [key]: value }
    });
  };

  return (
    <div className="space-y-6">
        <Accordion title="Accelerator Configuration" defaultOpen={true}>
            <div className="space-y-6">
                <FormSection 
                    label="Resource Name" 
                    info="Identifier for this Accelerator"
                >
                     <AWSInput 
                        value={config.name} 
                        onChange={(e) => onUpdate({...config, name: e.target.value})} 
                        placeholder="My App Accelerator"
                    />
                </FormSection>

                <FormSection 
                    label="Number of Accelerators" 
                    info="Standard accelerators"
                    tooltip="Fixed hourly fee applies for each accelerator created ($0.025/hour)."
                >
                     <AWSInput 
                        type="number" min={1}
                        value={attrs.gaAcceleratorCount} 
                        onChange={(e) => updateAttribute('gaAcceleratorCount', Number(e.target.value))}
                        unit="Accelerators"
                    />
                </FormSection>
            </div>
        </Accordion>
    </div>
  );
};

export const GlobalAcceleratorUsageConfig: React.FC<GAModuleProps> = ({ config, onUpdate }) => {
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
                    <span className="w-2 h-8 bg-blue-600 rounded-full mr-3"></span>
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Data Transfer Premium</h4>
                </div>
                
                <div className="space-y-6">
                    <p className="text-sm text-gray-600">
                        Global Accelerator charges a Data Transfer Premium fee in addition to standard data transfer rates. 
                        This fee is based on the source and destination regions.
                    </p>

                    <FormSection 
                        label="Dominant Direction Traffic" 
                        tooltip="Traffic flowing in the dominant direction (usually outbound to users). Premium varies by region, estimated at $0.015/GB here."
                    >
                        <AWSSlider 
                            min={0} max={10000} 
                            value={attrs.gaDataTransferDominant} 
                            onChange={(val) => updateAttribute('gaDataTransferDominant', val)}
                            unit="GB/Mo"
                            labels={["0", "5 TB", "10 TB"]}
                        />
                    </FormSection>
                </div>
            </div>
        </div>
    );
};