import React from 'react';
import { Accordion, FormSection, AWSSlider, AWSInput, AWSSelect, AWSToggle } from '../ui/AWS';
import { ResourceConfig, ECSLaunchType, FargatePlatform } from '../../types';

interface ECSModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const ECSArchitectureConfig: React.FC<ECSModuleProps> = ({ config, onUpdate }) => {
  const attrs = config.attributes;

  const updateAttribute = (key: string, value: any) => {
    onUpdate({
        ...config,
        attributes: { ...attrs, [key]: value }
    });
  };

  return (
    <div className="space-y-6">
        {/* 1. Cluster Settings */}
        <Accordion title="Cluster Configuration" defaultOpen={true}>
            <div className="space-y-6">
                <FormSection 
                    label="Cluster Name" 
                    info="Identifier for this container cluster"
                >
                     <AWSInput 
                        value={config.name} 
                        onChange={(e) => onUpdate({...config, name: e.target.value})} 
                        placeholder="production-cluster"
                    />
                </FormSection>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <FormSection 
                        label="Launch Type" 
                        info="Infrastructure model"
                        tooltip="Fargate is serverless (pay per task). EC2 requires managing instances (pay for instances)."
                    >
                         <AWSSelect 
                            value={attrs.ecsLaunchType} 
                            onChange={(e) => updateAttribute('ecsLaunchType', e.target.value)}
                        >
                            <option value={ECSLaunchType.FARGATE}>Fargate (Serverless)</option>
                            <option value={ECSLaunchType.EC2}>EC2 (Self-Managed)</option>
                        </AWSSelect>
                    </FormSection>
                </div>

                {attrs.ecsLaunchType === ECSLaunchType.EC2 && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800 flex items-start">
                        <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <div>
                            <strong>EC2 Launch Type:</strong> There is no additional charge for ECS clusters using the EC2 launch type. You are responsible for the costs of the EC2 instances and EBS volumes you register to the cluster. Please ensure you have added an <strong>Amazon EC2</strong> resource to your estimate to cover compute costs.
                        </div>
                    </div>
                )}
            </div>
        </Accordion>

        {/* 2. Task Definition (Fargate Only) */}
        {attrs.ecsLaunchType === ECSLaunchType.FARGATE && (
            <Accordion title="Task Definitions (Fargate)">
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormSection 
                            label="Operating System / Architecture" 
                            tooltip="Linux ARM64 provides better price/performance. Windows incurs licensing costs."
                        >
                            <AWSSelect 
                                value={attrs.ecsPlatform} 
                                onChange={(e) => updateAttribute('ecsPlatform', e.target.value)}
                            >
                                <option value={FargatePlatform.LINUX_X86}>Linux x86</option>
                                <option value={FargatePlatform.LINUX_ARM}>Linux ARM64</option>
                                <option value={FargatePlatform.WINDOWS}>Windows Server</option>
                            </AWSSelect>
                        </FormSection>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                        <FormSection 
                            label="vCPU per Task" 
                            tooltip="Number of virtual CPUs reserved for the task."
                        >
                            <AWSSelect 
                                value={attrs.ecsCpu} 
                                onChange={(e) => updateAttribute('ecsCpu', Number(e.target.value))}
                            >
                                <option value={0.25}>0.25 vCPU</option>
                                <option value={0.5}>0.5 vCPU</option>
                                <option value={1}>1 vCPU</option>
                                <option value={2}>2 vCPU</option>
                                <option value={4}>4 vCPU</option>
                                <option value={8}>8 vCPU</option>
                                <option value={16}>16 vCPU</option>
                            </AWSSelect>
                        </FormSection>

                        <FormSection 
                            label="Memory per Task (GB)" 
                            tooltip="Amount of memory reserved for the task."
                        >
                            <AWSInput 
                                type="number" step={0.5} min={0.5} max={120}
                                value={attrs.ecsMemory} 
                                onChange={(e) => updateAttribute('ecsMemory', Number(e.target.value))}
                                unit="GB"
                            />
                        </FormSection>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                        <FormSection 
                            label="Ephemeral Storage" 
                            tooltip="First 20 GB is free. Additional storage is charged per GB-month."
                        >
                            <AWSSlider 
                                min={20} max={200} 
                                value={attrs.ecsStorage} 
                                onChange={(val) => updateAttribute('ecsStorage', val)}
                                unit="GB"
                                labels={["20 GB", "100 GB", "200 GB"]}
                            />
                        </FormSection>
                    </div>
                </div>
            </Accordion>
        )}
    </div>
  );
};

export const ECSUsageConfig: React.FC<ECSModuleProps> = ({ config, onUpdate }) => {
    const attrs = config.attributes;
    const updateAttribute = (key: string, value: any) => {
        onUpdate({
            ...config,
            attributes: { ...attrs, [key]: value }
        });
    };

    if (attrs.ecsLaunchType === ECSLaunchType.EC2) {
        return (
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center text-sm text-gray-500">
                Usage costs for EC2 Launch Type are driven by the underlying EC2 instances. Please configure your instances in the EC2 module.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                    <span className="w-2 h-8 bg-orange-500 rounded-full mr-3"></span>
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Fargate Usage</h4>
                </div>
                
                <div className="space-y-6">
                    <FormSection 
                        label="Number of Tasks" 
                        tooltip="Average number of tasks running simultaneously."
                    >
                        <AWSInput 
                            type="number" min={1}
                            value={attrs.ecsTaskCount} 
                            onChange={(e) => updateAttribute('ecsTaskCount', Number(e.target.value))}
                            unit="Tasks"
                        />
                    </FormSection>

                    <FormSection 
                        label="Running Duration (Hours/Month)" 
                        tooltip="How long the tasks run per month (730 = 24/7)."
                    >
                        <AWSSlider 
                            min={0} max={730} 
                            value={attrs.ecsRunningHours} 
                            onChange={(val) => updateAttribute('ecsRunningHours', val)}
                            unit="Hrs/Mo"
                            labels={["0", "365", "730"]}
                        />
                    </FormSection>

                    <div className="pt-4 border-t border-gray-100">
                        <AWSToggle 
                            label="Use Fargate Spot" 
                            checked={attrs.ecsFargateSpot}
                            onChange={(val) => updateAttribute('ecsFargateSpot', val)}
                            tooltip="Run fault-tolerant workloads for up to 70% off. AWS can interrupt these tasks."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};