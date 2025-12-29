import React from 'react';
import { Accordion, FormSection, AWSSlider, AWSInput, AWSSelect } from '../ui/AWS';
import { ResourceConfig, LoadBalancerType } from '../../types';

interface ELBModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const ELBArchitectureConfig: React.FC<ELBModuleProps> = ({ config, onUpdate }) => {
  const attrs = config.attributes;

  const updateAttribute = (key: string, value: any) => {
    onUpdate({
        ...config,
        attributes: { ...attrs, [key]: value }
    });
  };

  return (
    <div className="space-y-6">
        {/* 1. Load Balancer Settings */}
        <Accordion title="Load Balancer Settings" defaultOpen={true}>
            <div className="space-y-6">
                <FormSection 
                    label="Resource Name" 
                    info="Identifier for this Load Balancer"
                >
                     <AWSInput 
                        value={config.name} 
                        onChange={(e) => onUpdate({...config, name: e.target.value})} 
                        placeholder="My Load Balancer"
                    />
                </FormSection>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <FormSection 
                        label="Type" 
                        info="Load Balancer Type"
                        tooltip="ALB for HTTP/HTTPS. NLB for TCP/UDP (high performance). GWLB for appliance fleets."
                    >
                         <AWSSelect 
                            value={attrs.elbType} 
                            onChange={(e) => updateAttribute('elbType', e.target.value)}
                        >
                            <option value={LoadBalancerType.ALB}>Application Load Balancer</option>
                            <option value={LoadBalancerType.NLB}>Network Load Balancer</option>
                            <option value={LoadBalancerType.GWLB}>Gateway Load Balancer</option>
                        </AWSSelect>
                    </FormSection>
                    
                    <FormSection 
                        label="Count" 
                        info="Number of Load Balancers"
                    >
                         <AWSInput 
                            type="number" min={1}
                            value={attrs.elbCount} 
                            onChange={(e) => updateAttribute('elbCount', Number(e.target.value))}
                            unit="LBs"
                        />
                    </FormSection>
                </div>
            </div>
        </Accordion>
    </div>
  );
};

export const ELBUsageConfig: React.FC<ELBModuleProps> = ({ config, onUpdate }) => {
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
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Capacity Units (LCUs)</h4>
                </div>
                
                <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-100 rounded p-3 text-xs text-blue-800 mb-4">
                        LCU cost is determined by the maximum usage among New Connections, Active Connections, and Data Processed (plus Rule Evaluations for ALB).
                    </div>

                    <FormSection 
                        label="Data Processed" 
                        tooltip="Total bytes processed by the load balancer per month (GB/hour internally)."
                    >
                        <AWSSlider 
                            min={0} max={1000} 
                            value={attrs.elbProcessedBytes} 
                            onChange={(val) => updateAttribute('elbProcessedBytes', val)}
                            unit="GB/Hour"
                            labels={["0", "500 GB/h", "1 TB/h"]}
                        />
                    </FormSection>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                        <FormSection 
                            label="New Connections" 
                            tooltip="Number of new connections established per second."
                        >
                            <AWSInput 
                                type="number" min={0}
                                value={attrs.elbNewConnections} 
                                onChange={(e) => updateAttribute('elbNewConnections', Number(e.target.value))}
                                unit="Conn/Sec"
                            />
                        </FormSection>
                        <FormSection 
                            label="Active Connections" 
                            tooltip="Average number of concurrent connections (duration based)."
                        >
                            <AWSInput 
                                type="number" min={0}
                                value={attrs.elbActiveConnections} 
                                onChange={(e) => updateAttribute('elbActiveConnections', Number(e.target.value))}
                                unit="Conn"
                            />
                        </FormSection>
                    </div>

                    {attrs.elbType === LoadBalancerType.ALB && (
                        <div className="pt-4 border-t border-gray-100">
                            <FormSection 
                                label="Rule Evaluations" 
                                tooltip="Number of rule evaluations per second (ALB only)."
                            >
                                <AWSInput 
                                    type="number" min={0}
                                    value={attrs.elbRuleEvaluations} 
                                    onChange={(e) => updateAttribute('elbRuleEvaluations', Number(e.target.value))}
                                    unit="Rules/Sec"
                                />
                            </FormSection>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};