import React from 'react';
import { Accordion, FormSection, AWSSlider, AWSInput } from '../ui/AWS';
import { ResourceConfig } from '../../types';

interface DataTransferModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const DataTransferArchitectureConfig: React.FC<DataTransferModuleProps> = ({ config, onUpdate }) => {
  return (
    <div className="space-y-6">
        <Accordion title="General Configuration" defaultOpen={true}>
            <div className="space-y-6">
                <FormSection 
                    label="Resource Name" 
                    info="Identifier for this Data Transfer estimate"
                >
                     <AWSInput 
                        value={config.name} 
                        onChange={(e) => onUpdate({...config, name: e.target.value})} 
                        placeholder="Aggregate Data Transfer"
                    />
                </FormSection>

                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-800">
                    <h4 className="font-bold flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Aggregate Calculator
                    </h4>
                    <p className="mt-1">
                        Use this module to estimate costs for data transfer that isn't already covered by specific service modules (like EC2 or S3), or to model miscellaneous transfer costs.
                    </p>
                </div>
            </div>
        </Accordion>
    </div>
  );
};

export const DataTransferUsageConfig: React.FC<DataTransferModuleProps> = ({ config, onUpdate }) => {
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
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Bandwidth Usage</h4>
                </div>
                
                <div className="space-y-6">
                    <FormSection 
                        label="Data Transfer Out (Internet)" 
                        tooltip="Traffic sent from AWS to the public internet ($0.09/GB)."
                    >
                        <AWSSlider 
                            min={0} max={10000} 
                            value={attrs.dtOutboundInternet} 
                            onChange={(val) => updateAttribute('dtOutboundInternet', val)}
                            unit="GB/Mo"
                            labels={["0", "5 TB", "10 TB"]}
                        />
                    </FormSection>

                    <FormSection 
                        label="Inter-Region Transfer" 
                        tooltip="Traffic sent between different AWS Regions ($0.02/GB)."
                    >
                        <AWSSlider 
                            min={0} max={10000} 
                            value={attrs.dtInterRegion} 
                            onChange={(val) => updateAttribute('dtInterRegion', val)}
                            unit="GB/Mo"
                            labels={["0", "5 TB", "10 TB"]}
                        />
                    </FormSection>

                    <FormSection 
                        label="Intra-Region Transfer" 
                        tooltip="Traffic between Availability Zones within the same Region ($0.01/GB)."
                    >
                        <AWSSlider 
                            min={0} max={10000} 
                            value={attrs.dtIntraRegion} 
                            onChange={(val) => updateAttribute('dtIntraRegion', val)}
                            unit="GB/Mo"
                            labels={["0", "5 TB", "10 TB"]}
                        />
                    </FormSection>
                </div>
            </div>
        </div>
    );
};