import React from 'react';
import { Accordion, FormSection, AWSSlider, AWSInput, AWSSelect, AWSToggle, AWSButton } from '../ui/AWS';
import { ResourceConfig, ServiceType } from '../../types';
import { usePricing } from '../../contexts/PricingContext';

interface EKSModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const EKSArchitectureConfig: React.FC<EKSModuleProps> = ({ config, onUpdate }) => {
  const attrs = config.attributes;
  const { getServiceOptions } = usePricing();
  // EKS Node Groups use EC2 Instance Types
  const instanceTypes = getServiceOptions(ServiceType.EC2, 'instance');

  const updateAttribute = (key: string, value: any) => {
    onUpdate({
        ...config,
        attributes: { ...attrs, [key]: value }
    });
  };

  const addNodeGroup = () => {
      const newGroup = {
          id: `ng-${Date.now()}`,
          name: `pool-${(attrs.eksNodeGroups?.length || 0) + 1}`,
          instanceType: "t3.medium",
          count: 1,
          storage: 20
      };
      updateAttribute('eksNodeGroups', [...(attrs.eksNodeGroups || []), newGroup]);
  };

  const removeNodeGroup = (id: string) => {
      updateAttribute('eksNodeGroups', attrs.eksNodeGroups.filter(g => g.id !== id));
  };

  const updateNodeGroup = (id: string, field: string, value: any) => {
      const updatedGroups = attrs.eksNodeGroups.map(g => {
          if (g.id === id) return { ...g, [field]: value };
          return g;
      });
      updateAttribute('eksNodeGroups', updatedGroups);
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
                            label="Enable Managed Node Groups" 
                            checked={attrs.eksNodesEnabled}
                            onChange={(val) => updateAttribute('eksNodesEnabled', val)}
                            tooltip="Provision EC2 instances managed by EKS to run your workloads."
                        />
                    </div>

                    {attrs.eksNodesEnabled && (
                        <div className="space-y-4 animate-in fade-in pl-4 border-l-2 border-aws-link">
                            {attrs.eksNodeGroups && attrs.eksNodeGroups.map((group, index) => (
                                <div key={group.id} className="bg-white p-4 rounded border border-gray-200 shadow-sm relative group">
                                    <div className="absolute top-2 right-2">
                                        <button 
                                            onClick={() => removeNodeGroup(group.id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                    <h4 className="text-sm font-bold text-gray-700 mb-3">Node Group #{index + 1}</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <AWSInput 
                                            label="Name"
                                            value={group.name}
                                            onChange={(e) => updateNodeGroup(group.id, 'name', e.target.value)}
                                        />
                                        <AWSSelect 
                                            label="Instance Type"
                                            value={group.instanceType} 
                                            onChange={(e) => updateNodeGroup(group.id, 'instanceType', e.target.value)}
                                        >
                                            {instanceTypes.map(t => (
                                                <option key={t} value={t}>{t}</option>
                                            ))}
                                        </AWSSelect>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <AWSInput 
                                            label="Node Count"
                                            type="number" min={1}
                                            value={group.count}
                                            onChange={(e) => updateNodeGroup(group.id, 'count', Number(e.target.value))}
                                            unit="Nodes"
                                        />
                                        <AWSInput 
                                            label="Storage Per Node (GB)"
                                            type="number" min={10}
                                            value={group.storage}
                                            onChange={(e) => updateNodeGroup(group.id, 'storage', Number(e.target.value))}
                                            unit="GB"
                                        />
                                    </div>
                                </div>
                            ))}
                            
                            <button 
                                onClick={addNodeGroup}
                                className="w-full py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-500 hover:border-aws-primary hover:text-aws-primary transition-colors text-sm font-medium flex items-center justify-center"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                Add Node Group
                            </button>
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
    return (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center text-sm text-gray-500">
            <p>EKS costs are primarily driven by cluster uptime and compute resource allocation (Nodes/Fargate) configured in the Architecture tab.</p>
            <p className="mt-2">Data transfer costs for EKS are typically covered under the VPC or Load Balancer resources.</p>
        </div>
    );
};