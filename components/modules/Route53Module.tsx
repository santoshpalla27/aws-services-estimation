import React from 'react';
import { Accordion, FormSection, AWSSlider, AWSInput } from '../ui/AWS';
import { ResourceConfig } from '../../types';

interface Route53ModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const Route53ArchitectureConfig: React.FC<Route53ModuleProps> = ({ config, onUpdate }) => {
  const attrs = config.attributes;

  const updateAttribute = (key: string, value: any) => {
    onUpdate({
        ...config,
        attributes: { ...attrs, [key]: value }
    });
  };

  return (
    <div className="space-y-6">
        {/* 1. General Config */}
        <Accordion title="Hosted Zones & Domains" defaultOpen={true}>
            <div className="space-y-6">
                <FormSection 
                    label="Resource Name" 
                    info="Identifier for this Route 53 configuration"
                >
                     <AWSInput 
                        value={config.name} 
                        onChange={(e) => onUpdate({...config, name: e.target.value})} 
                        placeholder="My DNS Configuration"
                    />
                </FormSection>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <FormSection 
                        label="Hosted Zones" 
                        info="Number of zones"
                        tooltip="A container for DNS records. Public zones route internet traffic; Private zones route VPC traffic."
                    >
                         <AWSInput 
                            type="number" min={0}
                            value={attrs.r53HostedZones}
                            onChange={(e) => updateAttribute('r53HostedZones', Number(e.target.value))}
                            unit="Zones"
                        />
                    </FormSection>
                    
                    <FormSection 
                        label="Domain Registrations" 
                        info="Domains managed by Route 53"
                        tooltip="Domains registered or transferred to Route 53. Cost varies by TLD (est. $12/yr amortized)."
                    >
                         <AWSInput 
                            type="number" min={0}
                            value={attrs.r53Domains}
                            onChange={(e) => updateAttribute('r53Domains', Number(e.target.value))}
                            unit="Domains"
                        />
                    </FormSection>
                </div>
            </div>
        </Accordion>

        {/* 2. Health Checks */}
        <Accordion title="Health Checks">
             <div className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <FormSection 
                        label="AWS Endpoints" 
                        info="Checks on AWS resources"
                        tooltip="Health checks monitoring resources within AWS (e.g. EC2 instances, ELBs). Lower cost."
                     >
                         <AWSInput 
                            type="number" min={0}
                            value={attrs.r53HealthChecksAws}
                            onChange={(e) => updateAttribute('r53HealthChecksAws', Number(e.target.value))}
                            unit="Checks"
                        />
                     </FormSection>
                     
                     <FormSection 
                        label="Non-AWS Endpoints" 
                        info="Checks on external resources"
                        tooltip="Health checks monitoring endpoints outside of AWS or using advanced features (latency measurement, string matching)."
                     >
                         <AWSInput 
                            type="number" min={0}
                            value={attrs.r53HealthChecksNonAws}
                            onChange={(e) => updateAttribute('r53HealthChecksNonAws', Number(e.target.value))}
                            unit="Checks"
                        />
                     </FormSection>
                 </div>
             </div>
        </Accordion>

        {/* 3. Resolver */}
        <Accordion title="Resolver & Firewall">
            <div className="space-y-6">
                <FormSection 
                    label="Resolver Endpoints (ENIs)" 
                    info="Inbound/Outbound endpoints"
                    tooltip="Elastic Network Interfaces used for hybrid DNS query forwarding between VPCs and on-premises networks. Charged hourly per ENI."
                >
                    <AWSInput 
                        type="number" min={0}
                        value={attrs.r53ResolverEndpoints}
                        onChange={(e) => updateAttribute('r53ResolverEndpoints', Number(e.target.value))}
                        unit="ENIs"
                    />
                </FormSection>
            </div>
        </Accordion>
    </div>
  );
};

export const Route53UsageConfig: React.FC<Route53ModuleProps> = ({ config, onUpdate }) => {
    const attrs = config.attributes;
    const updateAttribute = (key: string, value: any) => {
        onUpdate({
            ...config,
            attributes: { ...attrs, [key]: value }
        });
    };

    return (
        <div className="space-y-4">
            {/* Queries */}
            <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                    <span className="w-2 h-8 bg-blue-500 rounded-full mr-3"></span>
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">DNS Queries</h4>
                </div>
                
                <div className="space-y-6">
                    <FormSection 
                        label="Standard Queries" 
                        tooltip="Standard DNS queries (Simple, Weighted, Multivalue policies)."
                    >
                        <AWSSlider 
                            min={0} max={1000} 
                            value={attrs.r53StandardQueries} 
                            onChange={(val) => updateAttribute('r53StandardQueries', val)}
                            unit="Million Queries"
                            labels={["0", "500M", "1B"]}
                        />
                    </FormSection>

                    <FormSection 
                        label="Latency/Geo/Failover Queries" 
                        tooltip="Queries using Latency-based, Geolocation, Geoproximity, or Failover routing policies. Higher cost."
                    >
                        <AWSSlider 
                            min={0} max={1000} 
                            value={attrs.r53GeoLatencyQueries} 
                            onChange={(val) => updateAttribute('r53GeoLatencyQueries', val)}
                            unit="Million Queries"
                            labels={["0", "500M", "1B"]}
                        />
                    </FormSection>
                </div>
            </div>

             {/* Resolver Traffic */}
             {attrs.r53ResolverEndpoints > 0 && (
                <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
                    <div className="flex items-center mb-4">
                        <span className="w-2 h-8 bg-purple-500 rounded-full mr-3"></span>
                        <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Resolver Traffic</h4>
                    </div>
                    
                    <FormSection 
                        label="Resolver Queries" 
                        tooltip="DNS queries that originate in your VPCs and are forwarded to your network (outbound) or vice versa (inbound)."
                    >
                        <AWSSlider 
                            min={0} max={100} 
                            value={attrs.r53ResolverQueries} 
                            onChange={(val) => updateAttribute('r53ResolverQueries', val)}
                            unit="Million Queries"
                            labels={["0", "50M", "100M"]}
                        />
                    </FormSection>

                    <div className="pt-4 border-t border-gray-100">
                         <FormSection 
                            label="DNS Firewall Queries" 
                            tooltip="DNS queries inspected by Route 53 Resolver DNS Firewall."
                        >
                            <AWSSlider 
                                min={0} max={100} 
                                value={attrs.r53DnsFirewallQueries} 
                                onChange={(val) => updateAttribute('r53DnsFirewallQueries', val)}
                                unit="Million Queries"
                                labels={["0", "50M", "100M"]}
                            />
                        </FormSection>
                    </div>
                </div>
             )}
        </div>
    );
};