import React from 'react';
import { Accordion, AWSInput, AWSToggle } from '../ui/AWS';
import { ResourceConfig } from '../../types';

interface SQSModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const SQSArchitectureConfig: React.FC<SQSModuleProps> = ({ config, onUpdate }) => {
  const attrs = config.attributes;

  const updateAttribute = (key: string, value: any) => {
    onUpdate({
        ...config,
        attributes: { ...attrs, [key]: value }
    });
  };

  const addQueue = () => {
      const newQueue = {
          id: `sqs-${Date.now()}`,
          name: `queue-${(attrs.sqsQueues?.length || 0) + 1}`,
          isFifo: false,
          requests: 1,
          dataTransfer: 0
      };
      updateAttribute('sqsQueues', [...(attrs.sqsQueues || []), newQueue]);
  };

  const removeQueue = (id: string) => {
      updateAttribute('sqsQueues', attrs.sqsQueues.filter(q => q.id !== id));
  };

  const updateQueue = (id: string, field: string, value: any) => {
      const updated = attrs.sqsQueues.map(q => {
          if (q.id === id) return { ...q, [field]: value };
          return q;
      });
      updateAttribute('sqsQueues', updated);
  };

  return (
    <div className="space-y-6">
        <Accordion title="Queues" defaultOpen={true}>
            <div className="space-y-6">
                <div className="space-y-4">
                    {attrs.sqsQueues && attrs.sqsQueues.map((queue, index) => (
                        <div key={queue.id} className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm relative group animate-in fade-in">
                            <div className="absolute top-3 right-3">
                                <button 
                                    onClick={() => removeQueue(queue.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            
                            <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center">
                                <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-2 text-xs">{index + 1}</span>
                                {queue.name}
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <AWSInput 
                                    label="Queue Name" 
                                    value={queue.name}
                                    onChange={(e) => updateQueue(queue.id, 'name', e.target.value)}
                                />
                                <AWSToggle 
                                    label="FIFO Queue"
                                    checked={queue.isFifo}
                                    onChange={(val) => updateQueue(queue.id, 'isFifo', val)}
                                />
                            </div>
                        </div>
                    ))}

                    <button 
                        onClick={addQueue}
                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-aws-primary hover:text-aws-primary transition-colors text-sm font-medium flex items-center justify-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Add Queue
                    </button>
                </div>
            </div>
        </Accordion>
    </div>
  );
};

export const SQSUsageConfig: React.FC<SQSModuleProps> = ({ config, onUpdate }) => {
    const attrs = config.attributes;
    const updateAttribute = (key: string, value: any) => {
        onUpdate({
            ...config,
            attributes: { ...attrs, [key]: value }
        });
    };

    const updateQueue = (id: string, field: string, value: any) => {
        const updated = attrs.sqsQueues.map(q => {
            if (q.id === id) return { ...q, [field]: value };
            return q;
        });
        updateAttribute('sqsQueues', updated);
    };

    return (
        <div className="space-y-4">
            <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                    <span className="w-2 h-8 bg-purple-500 rounded-full mr-3"></span>
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Requests & Transfer</h4>
                </div>
                
                <div className="space-y-6">
                    {attrs.sqsQueues && attrs.sqsQueues.map(queue => (
                        <div key={queue.id} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                            <h5 className="text-xs font-bold text-gray-500 uppercase mb-3">{queue.name}</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <AWSInput 
                                    label="Monthly Requests (Millions)" 
                                    type="number" min={0}
                                    value={queue.requests} 
                                    onChange={(e) => updateQueue(queue.id, 'requests', Number(e.target.value))}
                                    unit="M Reqs"
                                />
                                <AWSInput 
                                    label="Data Transfer Out (GB)" 
                                    type="number" min={0}
                                    value={queue.dataTransfer} 
                                    onChange={(e) => updateQueue(queue.id, 'dataTransfer', Number(e.target.value))}
                                    unit="GB"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};