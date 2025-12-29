import React from 'react';
import { Accordion, AWSInput, AWSSelect, AWSToggle } from '../ui/AWS';
import { ResourceConfig, WafScope } from '../../types';

interface WAFModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const WAFArchitectureConfig: React.FC<WAFModuleProps> = ({ config, onUpdate }) => {
  const attrs = config.attributes;

  const updateAttribute = (key: string, value: any) => {
    onUpdate({
        ...config,
        attributes: { ...attrs, [key]: value }
    });
  };

  const addACL = () => {
      const newACL = {
          id: `waf-${Date.now()}`,
          name: `acl-${(attrs.wafWebACLs?.length || 0) + 1}`,
          scope: WafScope.REGIONAL,
          ruleCount: 5,
          requests: 1,
          botControl: false,
          fraudControl: false,
          botRequests: 0,
          fraudRequests: 0
      };
      updateAttribute('wafWebACLs', [...(attrs.wafWebACLs || []), newACL]);
  };

  const removeACL = (id: string) => {
      updateAttribute('wafWebACLs', attrs.wafWebACLs.filter(a => a.id !== id));
  };

  const updateACL = (id: string, field: string, value: any) => {
      const updated = attrs.wafWebACLs.map(a => {
          if (a.id === id) return { ...a, [field]: value };
          return a;
      });
      updateAttribute('wafWebACLs', updated);
  };

  return (
    <div className="space-y-6">
        <Accordion title="Web ACLs" defaultOpen={true}>
            <div className="space-y-6">
                <div className="space-y-4">
                    {attrs.wafWebACLs && attrs.wafWebACLs.map((acl, index) => (
                        <div key={acl.id} className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm relative group animate-in fade-in">
                            <div className="absolute top-3 right-3">
                                <button 
                                    onClick={() => removeACL(acl.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            
                            <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center">
                                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 text-xs">{index + 1}</span>
                                {acl.name}
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <AWSInput 
                                    label="Name" 
                                    value={acl.name}
                                    onChange={(e) => updateACL(acl.id, 'name', e.target.value)}
                                />
                                <AWSSelect 
                                    label="Scope" 
                                    value={acl.scope} 
                                    onChange={(e) => updateACL(acl.id, 'scope', e.target.value)}
                                >
                                    <option value={WafScope.REGIONAL}>Regional</option>
                                    <option value={WafScope.CLOUDFRONT}>CloudFront</option>
                                </AWSSelect>
                            </div>

                            <div className="mb-4">
                                <AWSInput 
                                    label="Number of Rules" 
                                    type="number" min={0}
                                    value={acl.ruleCount}
                                    onChange={(e) => updateACL(acl.id, 'ruleCount', Number(e.target.value))}
                                    unit="Rules"
                                />
                            </div>

                            <div className="p-3 bg-gray-50 rounded border border-gray-100">
                                <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">Managed Rules</label>
                                <div className="flex gap-4">
                                    <AWSToggle 
                                        label="Bot Control" 
                                        checked={acl.botControl}
                                        onChange={(val) => updateACL(acl.id, 'botControl', val)}
                                    />
                                    <AWSToggle 
                                        label="Fraud Control" 
                                        checked={acl.fraudControl}
                                        onChange={(val) => updateACL(acl.id, 'fraudControl', val)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    <button 
                        onClick={addACL}
                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-aws-primary hover:text-aws-primary transition-colors text-sm font-medium flex items-center justify-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Add Web ACL
                    </button>
                </div>
            </div>
        </Accordion>
    </div>
  );
};

export const WAFUsageConfig: React.FC<WAFModuleProps> = ({ config, onUpdate }) => {
    const attrs = config.attributes;
    const updateAttribute = (key: string, value: any) => {
        onUpdate({
            ...config,
            attributes: { ...attrs, [key]: value }
        });
    };

    const updateACL = (id: string, field: string, value: any) => {
        const updated = attrs.wafWebACLs.map(a => {
            if (a.id === id) return { ...a, [field]: value };
            return a;
        });
        updateAttribute('wafWebACLs', updated);
    };

    return (
        <div className="space-y-4">
            <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                    <span className="w-2 h-8 bg-blue-600 rounded-full mr-3"></span>
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Traffic Volume</h4>
                </div>
                
                <div className="space-y-6">
                    {attrs.wafWebACLs && attrs.wafWebACLs.map(acl => (
                        <div key={acl.id} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                            <h5 className="text-xs font-bold text-gray-500 uppercase mb-3">{acl.name}</h5>
                            <AWSInput 
                                label="Total Requests (Millions)" 
                                type="number" min={0}
                                value={acl.requests} 
                                onChange={(e) => updateACL(acl.id, 'requests', Number(e.target.value))}
                                unit="M Reqs"
                            />
                            
                            {(acl.botControl || acl.fraudControl) && (
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    {acl.botControl && (
                                        <AWSInput 
                                            label="Bot Analysis (M)" 
                                            type="number" min={0}
                                            value={acl.botRequests} 
                                            onChange={(e) => updateACL(acl.id, 'botRequests', Number(e.target.value))}
                                            unit="M Reqs"
                                        />
                                    )}
                                    {acl.fraudControl && (
                                        <AWSInput 
                                            label="Fraud Analysis (M)" 
                                            type="number" min={0}
                                            value={acl.fraudRequests} 
                                            onChange={(e) => updateACL(acl.id, 'fraudRequests', Number(e.target.value))}
                                            unit="M Reqs"
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};