import React from 'react';
import { Accordion, AWSInput, AWSSlider } from '../ui/AWS';
import { ResourceConfig } from '../../types';

interface SNSModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const SNSArchitectureConfig: React.FC<SNSModuleProps> = ({ config, onUpdate }) => {
  const attrs = config.attributes;

  const updateAttribute = (key: string, value: any) => {
    onUpdate({
        ...config,
        attributes: { ...attrs, [key]: value }
    });
  };

  const addTopic = () => {
      const newTopic = {
          id: `sns-${Date.now()}`,
          name: `topic-${(attrs.snsTopics?.length || 0) + 1}`,
          requests: 1,
          dataTransfer: 0
      };
      updateAttribute('snsTopics', [...(attrs.snsTopics || []), newTopic]);
  };

  const removeTopic = (id: string) => {
      updateAttribute('snsTopics', attrs.snsTopics.filter(t => t.id !== id));
  };

  const updateTopic = (id: string, field: string, value: any) => {
      const updated = attrs.snsTopics.map(t => {
          if (t.id === id) return { ...t, [field]: value };
          return t;
      });
      updateAttribute('snsTopics', updated);
  };

  return (
    <div className="space-y-6">
        <Accordion title="Topics" defaultOpen={true}>
            <div className="space-y-6">
                <div className="space-y-4">
                    {attrs.snsTopics && attrs.snsTopics.map((topic, index) => (
                        <div key={topic.id} className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm relative group animate-in fade-in">
                            <div className="absolute top-3 right-3">
                                <button 
                                    onClick={() => removeTopic(topic.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            
                            <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center">
                                <span className="w-6 h-6 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center mr-2 text-xs">{index + 1}</span>
                                {topic.name}
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <AWSInput 
                                    label="Topic Name" 
                                    value={topic.name}
                                    onChange={(e) => updateTopic(topic.id, 'name', e.target.value)}
                                />
                            </div>
                        </div>
                    ))}

                    <button 
                        onClick={addTopic}
                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-aws-primary hover:text-aws-primary transition-colors text-sm font-medium flex items-center justify-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Add Topic
                    </button>
                </div>
            </div>
        </Accordion>
    </div>
  );
};

export const SNSUsageConfig: React.FC<SNSModuleProps> = ({ config, onUpdate }) => {
    const attrs = config.attributes;
    const updateAttribute = (key: string, value: any) => {
        onUpdate({
            ...config,
            attributes: { ...attrs, [key]: value }
        });
    };

    const updateTopic = (id: string, field: string, value: any) => {
        const updated = attrs.snsTopics.map(t => {
            if (t.id === id) return { ...t, [field]: value };
            return t;
        });
        updateAttribute('snsTopics', updated);
    };

    return (
        <div className="space-y-4">
            <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                    <span className="w-2 h-8 bg-pink-500 rounded-full mr-3"></span>
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Usage & Transfer</h4>
                </div>
                
                <div className="space-y-6">
                    {attrs.snsTopics && attrs.snsTopics.map(topic => (
                        <div key={topic.id} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                            <h5 className="text-xs font-bold text-gray-500 uppercase mb-3">{topic.name}</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <AWSInput 
                                    label="Monthly Requests (Millions)" 
                                    type="number" min={0}
                                    value={topic.requests} 
                                    onChange={(e) => updateTopic(topic.id, 'requests', Number(e.target.value))}
                                    unit="M Reqs"
                                />
                                <AWSInput 
                                    label="Data Transfer Out (GB)" 
                                    type="number" min={0}
                                    value={topic.dataTransfer} 
                                    onChange={(e) => updateTopic(topic.id, 'dataTransfer', Number(e.target.value))}
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