import React from 'react';
import { Accordion, FormSection, AWSSlider, AWSInput, AWSToggle } from '../ui/AWS';
import { ResourceConfig } from '../../types';

interface SQSModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const SQSArchitectureConfig: React.FC<SQSModuleProps> = ({ config, onUpdate }) => {
  const attrs = config.attributes;

  const updateAttribute = (key: string, value: any) => {
    onUpdate({
        ...config,
        attributes: { ...attrs, [key]: value }
    });
  };

  return (
    <div className="space-y-6">
        <Accordion title="Queue Configuration" defaultOpen={true}>
            <div className="space-y-6">
                <FormSection 
                    label="Queue Name" 
                    info="Identifier for this SQS Queue"
                >
                     <AWSInput 
                        value={config.name} 
                        onChange={(e) => onUpdate({...config, name: e.target.value})} 
                        placeholder="My Queue"
                    />
                </FormSection>

                <FormSection 
                    label="Queue Type" 
                    info="Standard or FIFO"
                    tooltip="FIFO (First-In-First-Out) queues preserve message order and exactly-once processing but have higher costs and lower throughput limits."
                >
                     <AWSToggle 
                        label="FIFO Queue"
                        checked={attrs.sqsFifo}
                        onChange={(val) => updateAttribute('sqsFifo', val)}
                     />
                </FormSection>
            </div>
        </Accordion>
    </div>
  );
};

export const SQSUsageConfig: React.FC<SQSModuleProps> = ({ config, onUpdate }) => {
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
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Requests & Transfer</h4>
                </div>
                
                <div className="space-y-6">
                    <FormSection 
                        label="Monthly Requests" 
                        tooltip="Total number of API requests (SendMessage, ReceiveMessage, DeleteMessage, etc.) per month."
                    >
                        <AWSSlider 
                            min={0} max={500} 
                            value={attrs.sqsRequests} 
                            onChange={(val) => updateAttribute('sqsRequests', val)}
                            unit="Million Reqs"
                            labels={["0", "250M", "500M"]}
                        />
                    </FormSection>

                    <FormSection 
                        label="Data Transfer Out" 
                        tooltip="Amount of data transferred from SQS to the Internet."
                    >
                        <AWSSlider 
                            min={0} max={1000} 
                            value={attrs.sqsDataTransferOut} 
                            onChange={(val) => updateAttribute('sqsDataTransferOut', val)}
                            unit="GB/Mo"
                            labels={["0", "500 GB", "1 TB"]}
                        />
                    </FormSection>
                </div>
            </div>
        </div>
    );
};