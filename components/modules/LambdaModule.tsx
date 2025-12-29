import React from 'react';
import { Accordion, FormSection, AWSSlider, AWSInput, AWSSelect } from '../ui/AWS';
import { ResourceConfig, LambdaArchitecture } from '../../types';

interface LambdaModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const LambdaArchitectureConfig: React.FC<LambdaModuleProps> = ({ config, onUpdate }) => {
  const attrs = config.attributes;

  const updateAttribute = (key: string, value: any) => {
    onUpdate({
        ...config,
        attributes: { ...attrs, [key]: value }
    });
  };

  const addFunction = () => {
      const newFn = {
          id: `fn-${Date.now()}`,
          name: `function-${(attrs.lambdaFunctions?.length || 0) + 1}`,
          architecture: LambdaArchitecture.X86_64,
          memory: 128,
          ephemeralStorage: 512,
          requests: 0,
          durationMs: 100,
          provisionedConcurrency: 0,
          provisionedHours: 0
      };
      updateAttribute('lambdaFunctions', [...(attrs.lambdaFunctions || []), newFn]);
  };

  const removeFunction = (id: string) => {
      updateAttribute('lambdaFunctions', attrs.lambdaFunctions.filter(f => f.id !== id));
  };

  const updateFunction = (id: string, field: string, value: any) => {
      const updated = attrs.lambdaFunctions.map(f => {
          if (f.id === id) return { ...f, [field]: value };
          return f;
      });
      updateAttribute('lambdaFunctions', updated);
  };

  return (
    <div className="space-y-6">
        <Accordion title="Functions" defaultOpen={true}>
            <div className="space-y-6">
                <div className="space-y-4">
                    {attrs.lambdaFunctions && attrs.lambdaFunctions.map((fn, index) => (
                        <div key={fn.id} className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm relative group animate-in fade-in">
                            <div className="absolute top-3 right-3">
                                <button 
                                    onClick={() => removeFunction(fn.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            
                            <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center">
                                <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mr-2 text-xs">{index + 1}</span>
                                {fn.name}
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <AWSInput 
                                    label="Name" 
                                    value={fn.name}
                                    onChange={(e) => updateFunction(fn.id, 'name', e.target.value)}
                                />
                                <AWSSelect 
                                    label="Architecture" 
                                    value={fn.architecture} 
                                    onChange={(e) => updateFunction(fn.id, 'architecture', e.target.value)}
                                >
                                    <option value={LambdaArchitecture.X86_64}>x86_64</option>
                                    <option value={LambdaArchitecture.ARM64}>arm64 (Graviton)</option>
                                </AWSSelect>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <AWSInput 
                                    label="Memory (MB)" 
                                    type="number" min={128} max={10240}
                                    value={fn.memory}
                                    onChange={(e) => updateFunction(fn.id, 'memory', Number(e.target.value))}
                                    unit="MB"
                                />
                                <AWSInput 
                                    label="Ephemeral Storage (MB)" 
                                    type="number" min={512} max={10240}
                                    value={fn.ephemeralStorage}
                                    onChange={(e) => updateFunction(fn.id, 'ephemeralStorage', Number(e.target.value))}
                                    unit="MB"
                                />
                            </div>

                            <div className="p-3 bg-gray-50 rounded border border-gray-100">
                                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Provisioned Concurrency</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <AWSInput 
                                        label="Instances"
                                        type="number" min={0}
                                        value={fn.provisionedConcurrency}
                                        onChange={(e) => updateFunction(fn.id, 'provisionedConcurrency', Number(e.target.value))}
                                    />
                                    <AWSInput 
                                        label="Hours/Mo"
                                        type="number" min={0} max={730}
                                        value={fn.provisionedHours}
                                        onChange={(e) => updateFunction(fn.id, 'provisionedHours', Number(e.target.value))}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    <button 
                        onClick={addFunction}
                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-aws-primary hover:text-aws-primary transition-colors text-sm font-medium flex items-center justify-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Add Function
                    </button>
                </div>
            </div>
        </Accordion>
    </div>
  );
};

export const LambdaUsageConfig: React.FC<LambdaModuleProps> = ({ config, onUpdate }) => {
    const attrs = config.attributes;
    const updateAttribute = (key: string, value: any) => {
        onUpdate({
            ...config,
            attributes: { ...attrs, [key]: value }
        });
    };

    const updateFunction = (id: string, field: string, value: any) => {
        const updated = attrs.lambdaFunctions.map(f => {
            if (f.id === id) return { ...f, [field]: value };
            return f;
        });
        updateAttribute('lambdaFunctions', updated);
    };

    return (
        <div className="space-y-4">
            <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                    <span className="w-2 h-8 bg-orange-500 rounded-full mr-3"></span>
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Invocation Traffic</h4>
                </div>
                
                <div className="space-y-6">
                    {attrs.lambdaFunctions && attrs.lambdaFunctions.map(fn => (
                        <div key={fn.id} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                            <h5 className="text-xs font-bold text-gray-500 uppercase mb-3">{fn.name}</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <AWSInput 
                                    label="Monthly Requests (Millions)" 
                                    type="number" min={0} step={0.1}
                                    value={fn.requests}
                                    onChange={(e) => updateFunction(fn.id, 'requests', Number(e.target.value))}
                                    unit="M Reqs"
                                />
                                <AWSInput 
                                    label="Avg Duration (ms)" 
                                    type="number" min={1}
                                    value={fn.durationMs}
                                    onChange={(e) => updateFunction(fn.id, 'durationMs', Number(e.target.value))}
                                    unit="ms"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};