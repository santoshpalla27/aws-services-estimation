import React from 'react';
import { Accordion, FormSection, AWSInput, AWSSelect } from '../ui/AWS';
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

  const addZone = () => {
      const newZone = {
          id: `zone-${Date.now()}`,
          name: `zone-${(attrs.route53Zones?.length || 0) + 1}.com`,
          queryCount: 1,
          queryType: 'Standard' as const,
          healthChecksAws: 0,
          healthChecksNonAws: 0
      };
      updateAttribute('route53Zones', [...(attrs.route53Zones || []), newZone]);
  };

  const removeZone = (id: string) => {
      updateAttribute('route53Zones', attrs.route53Zones.filter(z => z.id !== id));
  };

  const updateZone = (id: string, field: string, value: any) => {
      const updated = attrs.route53Zones.map(z => {
          if (z.id === id) return { ...z, [field]: value };
          return z;
      });
      updateAttribute('route53Zones', updated);
  };

  return (
    <div className="space-y-6">
        <Accordion title="Hosted Zones" defaultOpen={true}>
            <div className="space-y-6">
                <div className="space-y-4">
                    {attrs.route53Zones && attrs.route53Zones.map((zone, index) => (
                        <div key={zone.id} className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm relative group animate-in fade-in">
                            <div className="absolute top-3 right-3">
                                <button 
                                    onClick={() => removeZone(zone.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            
                            <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center">
                                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 text-xs">{index + 1}</span>
                                {zone.name}
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <AWSInput 
                                    label="Zone Name" 
                                    value={zone.name}
                                    onChange={(e) => updateZone(zone.id, 'name', e.target.value)}
                                />
                                <AWSSelect 
                                    label="Routing Policy" 
                                    value={zone.queryType} 
                                    onChange={(e) => updateZone(zone.id, 'queryType', e.target.value)}
                                >
                                    <option value="Standard">Standard (Simple/Weighted)</option>
                                    <option value="Latency/Geo">Latency / Geo / Failover</option>
                                </AWSSelect>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <AWSInput 
                                    label="Queries (M)" 
                                    type="number" min={0}
                                    value={zone.queryCount} 
                                    onChange={(e) => updateZone(zone.id, 'queryCount', Number(e.target.value))}
                                    unit="M Reqs"
                                />
                                <AWSInput 
                                    label="Health Checks (AWS)" 
                                    type="number" min={0}
                                    value={zone.healthChecksAws} 
                                    onChange={(e) => updateZone(zone.id, 'healthChecksAws', Number(e.target.value))}
                                    unit="Checks"
                                />
                                <AWSInput 
                                    label="Health Checks (Ext)" 
                                    type="number" min={0}
                                    value={zone.healthChecksNonAws} 
                                    onChange={(e) => updateZone(zone.id, 'healthChecksNonAws', Number(e.target.value))}
                                    unit="Checks"
                                />
                            </div>
                        </div>
                    ))}

                    <button 
                        onClick={addZone}
                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-aws-primary hover:text-aws-primary transition-colors text-sm font-medium flex items-center justify-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Add Hosted Zone
                    </button>
                </div>
            </div>
        </Accordion>

        <Accordion title="Resolver & Domains">
            <div className="space-y-6">
                <FormSection 
                    label="Resolver Endpoints (ENIs)" 
                    tooltip="Inbound/Outbound endpoints for hybrid DNS."
                >
                    <AWSInput 
                        type="number" min={0}
                        value={attrs.r53ResolverEndpoints}
                        onChange={(e) => updateAttribute('r53ResolverEndpoints', Number(e.target.value))}
                        unit="ENIs"
                    />
                </FormSection>
                <FormSection 
                    label="Domain Registrations" 
                    tooltip="Number of domains registered via Route 53."
                >
                    <AWSInput 
                        type="number" min={0}
                        value={attrs.r53Domains}
                        onChange={(e) => updateAttribute('r53Domains', Number(e.target.value))}
                        unit="Domains"
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

    if (attrs.r53ResolverEndpoints > 0) {
        return (
            <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                    <span className="w-2 h-8 bg-purple-500 rounded-full mr-3"></span>
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Resolver Traffic</h4>
                </div>
                
                <FormSection 
                    label="Resolver Queries" 
                    tooltip="DNS queries processed by Resolver endpoints."
                >
                    <AWSInput 
                        type="number" min={0}
                        value={attrs.r53ResolverQueries} 
                        onChange={(e) => updateAttribute('r53ResolverQueries', Number(e.target.value))}
                        unit="Million Reqs"
                    />
                </FormSection>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center text-sm text-gray-500">
            <p>Hosted Zone query volumes and Health Checks are configured directly in the Architecture tab per zone.</p>
        </div>
    );
};