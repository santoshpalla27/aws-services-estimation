import React from 'react';
import { Accordion, FormSection, AWSSlider, AWSInput } from '../ui/AWS';
import { ResourceConfig } from '../../types';

interface XRayModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const XRayArchitectureConfig: React.FC<XRayModuleProps> = ({ config, onUpdate }) => {
  return (
    <div className="space-y-6">
        <Accordion title="Tracing Configuration" defaultOpen={true}>
            <div className="space-y-6">
                <FormSection 
                    label="Resource Name" 
                    info="Identifier for this X-Ray group"
                >
                     <AWSInput 
                        value={config.name} 
                        onChange={(e) => onUpdate({...config, name: e.target.value})} 
                        placeholder="App Tracing"
                    />
                </FormSection>

                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-800">
                    <h4 className="font-bold flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Distributed Tracing
                    </h4>
                    <p className="mt-1">
                        AWS X-Ray helps developers analyze and debug production, distributed applications. Costs are based on the number of traces recorded, retrieved, and data scanned.
                    </p>
                </div>
            </div>
        </Accordion>
    </div>
  );
};

export const XRayUsageConfig: React.FC<XRayModuleProps> = ({ config, onUpdate }) => {
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
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Traces & Scans</h4>
                </div>
                
                <div className="space-y-6">
                    <FormSection 
                        label="Traces Recorded" 
                        tooltip="Number of traces stored ($5.00 per million)."
                    >
                        <AWSSlider 
                            min={0} max={100} 
                            value={attrs.xrayTracesStored} 
                            onChange={(val) => updateAttribute('xrayTracesStored', val)}
                            unit="Million"
                            labels={["0", "50M", "100M"]}
                        />
                    </FormSection>

                    <FormSection 
                        label="Traces Retrieved" 
                        tooltip="Number of traces retrieved via API/Console ($0.50 per million)."
                    >
                        <AWSSlider 
                            min={0} max={50} 
                            value={attrs.xrayTracesRetrieved} 
                            onChange={(val) => updateAttribute('xrayTracesRetrieved', val)}
                            unit="Million"
                            labels={["0", "25M", "50M"]}
                        />
                    </FormSection>

                    <FormSection 
                        label="Data Scanned (Insights)" 
                        tooltip="Data scanned for X-Ray Insights or Encryption ($0.50 per GB)."
                    >
                        <AWSSlider 
                            min={0} max={1000} 
                            value={attrs.xrayDataScanned} 
                            onChange={(val) => updateAttribute('xrayDataScanned', val)}
                            unit="GB"
                            labels={["0", "500 GB", "1 TB"]}
                        />
                    </FormSection>
                </div>
            </div>
        </div>
    );
};