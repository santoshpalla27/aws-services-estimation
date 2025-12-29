import React from 'react';
import { Accordion, AWSInput, AWSSelect } from '../ui/AWS';
import { ResourceConfig, StepFunctionsType } from '../../types';

interface StepFunctionsModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const StepFunctionsArchitectureConfig: React.FC<StepFunctionsModuleProps> = ({ config, onUpdate }) => {
  const attrs = config.attributes;

  const updateAttribute = (key: string, value: any) => {
    onUpdate({
        ...config,
        attributes: { ...attrs, [key]: value }
    });
  };

  const addWorkflow = () => {
      const newSM = {
          id: `sfn-${Date.now()}`,
          name: `workflow-${(attrs.stepFunctionsStateMachines?.length || 0) + 1}`,
          type: StepFunctionsType.STANDARD,
          transitions: 1,
          requests: 0,
          durationMs: 100,
          memoryMb: 64
      };
      updateAttribute('stepFunctionsStateMachines', [...(attrs.stepFunctionsStateMachines || []), newSM]);
  };

  const removeWorkflow = (id: string) => {
      updateAttribute('stepFunctionsStateMachines', attrs.stepFunctionsStateMachines.filter(s => s.id !== id));
  };

  const updateWorkflow = (id: string, field: string, value: any) => {
      const updated = attrs.stepFunctionsStateMachines.map(s => {
          if (s.id === id) return { ...s, [field]: value };
          return s;
      });
      updateAttribute('stepFunctionsStateMachines', updated);
  };

  return (
    <div className="space-y-6">
        <Accordion title="State Machines" defaultOpen={true}>
            <div className="space-y-6">
                <div className="space-y-4">
                    {attrs.stepFunctionsStateMachines && attrs.stepFunctionsStateMachines.map((sm, index) => (
                        <div key={sm.id} className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm relative group animate-in fade-in">
                            <div className="absolute top-3 right-3">
                                <button 
                                    onClick={() => removeWorkflow(sm.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            
                            <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center">
                                <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mr-2 text-xs">{index + 1}</span>
                                {sm.name}
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <AWSInput 
                                    label="Name" 
                                    value={sm.name}
                                    onChange={(e) => updateWorkflow(sm.id, 'name', e.target.value)}
                                />
                                <AWSSelect 
                                    label="Type" 
                                    value={sm.type} 
                                    onChange={(e) => updateWorkflow(sm.id, 'type', e.target.value)}
                                >
                                    <option value={StepFunctionsType.STANDARD}>Standard</option>
                                    <option value={StepFunctionsType.EXPRESS}>Express</option>
                                </AWSSelect>
                            </div>

                            {sm.type === StepFunctionsType.STANDARD ? (
                                <div className="mt-4">
                                    <AWSInput 
                                        label="Transitions (Millions)" 
                                        type="number" min={0}
                                        value={sm.transitions} 
                                        onChange={(e) => updateWorkflow(sm.id, 'transitions', Number(e.target.value))}
                                        unit="M Trans"
                                    />
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                    <AWSInput 
                                        label="Requests (M)" 
                                        type="number" min={0}
                                        value={sm.requests} 
                                        onChange={(e) => updateWorkflow(sm.id, 'requests', Number(e.target.value))}
                                        unit="M Reqs"
                                    />
                                    <AWSInput 
                                        label="Duration (ms)" 
                                        type="number" min={100}
                                        value={sm.durationMs} 
                                        onChange={(e) => updateWorkflow(sm.id, 'durationMs', Number(e.target.value))}
                                        unit="ms"
                                    />
                                    <AWSInput 
                                        label="Memory (MB)" 
                                        type="number" min={64}
                                        value={sm.memoryMb} 
                                        onChange={(e) => updateWorkflow(sm.id, 'memoryMb', Number(e.target.value))}
                                        unit="MB"
                                    />
                                </div>
                            )}
                        </div>
                    ))}

                    <button 
                        onClick={addWorkflow}
                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-aws-primary hover:text-aws-primary transition-colors text-sm font-medium flex items-center justify-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Add State Machine
                    </button>
                </div>
            </div>
        </Accordion>
    </div>
  );
};

export const StepFunctionsUsageConfig: React.FC<StepFunctionsModuleProps> = ({ config, onUpdate }) => {
    return (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center text-sm text-gray-500">
            <p>Step Functions costs are based on transitions (Standard) or requests/duration (Express) configured in the Architecture tab.</p>
        </div>
    );
};