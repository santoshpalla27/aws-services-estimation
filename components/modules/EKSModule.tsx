import React from 'react';
import { Accordion, FormSection, AWSSlider, AWSInput, AWSSelect, AWSToggle } from '../ui/AWS';
import { ResourceConfig, InstanceType } from '../../types';

interface EKSModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const EKSArchitectureConfig: React.FC<EKSModuleProps> = ({ config, onUpdate }) => {
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
        <Accordion title="Cluster Settings" defaultOpen={true}>
            <div className="space-y-6">
                <FormSection 
                    label="Cluster Name" 
                    info="Identifier for this Kubernetes cluster"
                >
                     <AWSInput 
                        value={config.name} 
                        onChange={(e) => onUpdate({...config, name: e.target.value})} 
                        placeholder="production-k8s"
                    />
                </FormSection>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormSection 
                        label="Uptime (Hours/Month)" 
                        info="Hours the control plane is active"
                        tooltip="EKS charges $0.10 per hour for each cluster you create."
                    >
                        <AWSSlider 
                            min={0} max={730} 
                            value={attrs.eksClusterHours} 
                            onChange={(val) => updateAttribute('eksClusterHours', val)}
                            unit="Hrs"
                            labels={["0", "365", "730"]}
                        />
                    </FormSection>

                    <FormSection 
                        label="Extended Support" 
                        info="For older K8s versions"
                        tooltip="If you are running a Kubernetes version that is in the extended support window, AWS charges an additional $0.60 per cluster hour."
                    >
                        <AWSToggle 
                            label="Enable Extended Support" 
                            checked={attrs.eksExtendedSupport}
                            onChange={(val) => updateAttribute('eksExtendedSupport', val)}
                        />
                    </FormSection>
                </div>
            </div>
        </Accordion>

        {/* 2. Managed Node Groups */}
        <Accordion title="Managed Node Groups (EC2)">
            <div className="space-y-6">
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                    <div className="mb-4 flex justify-between items-center">
                        <AWSToggle 
                            label="Enable Managed Node Group" 
                            checked={attrs.eksNodesEnabled}
                            onChange={(val) => updateAttribute('eksNodesEnabled', val)}
                            tooltip="Provision EC2 instances managed by EKS to run your workloads."
                        />
                    </div>

                    {attrs.eksNodesEnabled && (
                        <div className="space-y-6 animate-in fade-in pl-4 border-l-2 border-aws-link">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormSection label="Instance Type">
                                    <AWSSelect 
                                        value={attrs.eksNodeInstanceType} 
                                        onChange={(e) => updateAttribute('eksNodeInstanceType', e.target.value)}
                                    >
                                        {Object.values(InstanceType).map(t => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </AWSSelect>
                                </FormSection>
                                <FormSection label="Node Count">
                                    <AWSInput 
                                        type="number" min={1}
                                        value={attrs.eksNodeCount}
                                        onChange={(e) => updateAttribute('eksNodeCount', Number(e.target.value))}
                                        unit="Nodes"
                                    />
                                </FormSection>
                            </div>
                            
                            <FormSection label="Storage Per Node (gp3)">
                                <AWSSlider 
                                    min={20} max={1000} 
                                    value={attrs.eksNodeStorageSize} 
                                    onChange={(val) => updateAttribute('eksNodeStorageSize', val)}
                                    unit="GB"
                                    labels={["20", "500", "1 TB"]}
                                />
                            </FormSection>
                        </div>
                    )}
                </div>
            </div>
        </Accordion>

        {/* 3. Fargate Profiles */}
        <Accordion title="Fargate Profiles (Serverless)">
            <div className="space-y-6">
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                    <div className="mb-4 flex justify-between items-center">
                        <AWSToggle 
                            label="Enable Fargate Profile" 
                            checked={attrs.eksFargateEnabled}
                            onChange={(val) => updateAttribute('eksFargateEnabled', val)}
                            tooltip="Run Kubernetes pods without managing servers. Pay for vCPU and Memory resources used."
                        />
                    </div>

                    {attrs.eksFargateEnabled && (
                        <div className="space-y-6 animate-in fade-in pl-4 border-l-2 border-aws-link">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormSection 
                                    label="Average Pods/Tasks" 
                                    tooltip="Average number of pods running simultaneously."
                                >
                                    <AWSInput 
                                        type="number" min={1}
                                        value={attrs.eksFargateTasks}
                                        onChange={(e) => updateAttribute('eksFargateTasks', Number(e.target.value))}
                                        unit="Pods"
                                    />
                                </FormSection>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormSection 
                                    label="vCPU per Pod"
                                    tooltip="Average vCPU requested per pod."
                                >
                                    <AWSInput 
                                        type="number" min={0.25} step={0.25}
                                        value={attrs.eksFargateCpu}
                                        onChange={(e) => updateAttribute('eksFargateCpu', Number(e.target.value))}
                                        unit="vCPU"
                                    />
                                </FormSection>
                                <FormSection 
                                    label="Memory per Pod"
                                    tooltip="Average memory requested per pod."
                                >
                                    <AWSInput 
                                        type="number" min={0.5} step={0.5}
                                        value={attrs.eksFargateMemory}
                                        onChange={(e) => updateAttribute('eksFargateMemory', Number(e.target.value))}
                                        unit="GB"
                                    />
                                </FormSection>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Accordion>
    </div>
  );
};

export const EKSUsageConfig: React.FC<EKSModuleProps> = ({ config, onUpdate }) => {
    // EKS usage is primarily driven by the uptime sliders in the architecture config.
    // This component is kept simple or could be used for specific data transfer if needed.
    return (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center text-sm text-gray-500">
            <p>EKS costs are primarily driven by cluster uptime and compute resource allocation (Nodes/Fargate) configured in the Architecture tab.</p>
            <p className="mt-2">Data transfer costs for EKS are typically covered under the VPC or Load Balancer resources.</p>
        </div>
    );
};