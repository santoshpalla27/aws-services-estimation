import React from 'react';
import { Accordion, FormSection, AWSSlider, AWSInput, AWSSelect, AWSButton } from '../ui/AWS';
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

  const addLoadBalancer = () => {
      const newLB = {
          id: `lb-${Date.now()}`,
          name: `lb-${(attrs.loadBalancers?.length || 0) + 1}`,
          type: LoadBalancerType.ALB,
          newConnections: 0,
          activeConnections: 0,
          processedBytes: 0,
          ruleEvaluations: 0
      };
      updateAttribute('loadBalancers', [...(attrs.loadBalancers || []), newLB]);
  };

  const removeLoadBalancer = (id: string) => {
      updateAttribute('loadBalancers', attrs.loadBalancers.filter(l => l.id !== id));
  };

  const updateLoadBalancer = (id: string, field: string, value: any) => {
      const updated = attrs.loadBalancers.map(l => {
          if (l.id === id) return { ...l, [field]: value };
          return l;
      });
      updateAttribute('loadBalancers', updated);
  };

  return (
    <div className="space-y-6">
        <Accordion title="Load Balancers" defaultOpen={true}>
            <div className="space-y-6">
                <div className="space-y-4">
                    {attrs.loadBalancers && attrs.loadBalancers.map((lb, index) => (
                        <div key={lb.id} className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm relative group animate-in fade-in">
                            <div className="absolute top-3 right-3">
                                <button 
                                    onClick={() => removeLoadBalancer(lb.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            
                            <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center">
                                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 text-xs">{index + 1}</span>
                                {lb.name}
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <AWSInput 
                                    label="Name" 
                                    value={lb.name}
                                    onChange={(e) => updateLoadBalancer(lb.id, 'name', e.target.value)}
                                />
                                <AWSSelect 
                                    label="Type" 
                                    value={lb.type} 
                                    onChange={(e) => updateLoadBalancer(lb.id, 'type', e.target.value)}
                                >
                                    <option value={LoadBalancerType.ALB}>Application Load Balancer</option>
                                    <option value={LoadBalancerType.NLB}>Network Load Balancer</option>
                                    <option value={LoadBalancerType.GWLB}>Gateway Load Balancer</option>
                                </AWSSelect>
                            </div>
                        </div>
                    ))}

                    <button 
                        onClick={addLoadBalancer}
                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-aws-primary hover:text-aws-primary transition-colors text-sm font-medium flex items-center justify-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Add Load Balancer
                    </button>
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

    const updateLoadBalancer = (id: string, field: string, value: any) => {
        const updated = attrs.loadBalancers.map(l => {
            if (l.id === id) return { ...l, [field]: value };
            return l;
        });
        updateAttribute('loadBalancers', updated);
    };

    return (
        <div className="space-y-4">
            <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                    <span className="w-2 h-8 bg-blue-600 rounded-full mr-3"></span>
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Capacity Units (LCUs)</h4>
                </div>
                
                <div className="space-y-6">
                    {attrs.loadBalancers && attrs.loadBalancers.map(lb => (
                        <div key={lb.id} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                            <h5 className="text-xs font-bold text-gray-500 uppercase mb-3">{lb.name} ({lb.type})</h5>
                            
                            <FormSection 
                                label="Data Processed" 
                                tooltip="Total bytes processed by this load balancer per month (GB/hour internally)."
                            >
                                <AWSSlider 
                                    min={0} max={1000} 
                                    value={lb.processedBytes} 
                                    onChange={(val) => updateLoadBalancer(lb.id, 'processedBytes', val)}
                                    unit="GB/Hour"
                                    labels={["0", "500 GB/h", "1 TB/h"]}
                                />
                            </FormSection>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                <AWSInput 
                                    label="New Connections" 
                                    type="number" min={0}
                                    value={lb.newConnections} 
                                    onChange={(e) => updateLoadBalancer(lb.id, 'newConnections', Number(e.target.value))}
                                    unit="Conn/Sec"
                                />
                                <AWSInput 
                                    label="Active Connections" 
                                    type="number" min={0}
                                    value={lb.activeConnections} 
                                    onChange={(e) => updateLoadBalancer(lb.id, 'activeConnections', Number(e.target.value))}
                                    unit="Conn"
                                />
                            </div>

                            {lb.type === LoadBalancerType.ALB && (
                                <div className="pt-4">
                                    <AWSInput 
                                        label="Rule Evaluations" 
                                        type="number" min={0}
                                        value={lb.ruleEvaluations} 
                                        onChange={(e) => updateLoadBalancer(lb.id, 'ruleEvaluations', Number(e.target.value))}
                                        unit="Rules/Sec"
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};