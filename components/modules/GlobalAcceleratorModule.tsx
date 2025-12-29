import React from 'react';
import { Accordion, FormSection, AWSSlider, AWSInput, AWSButton } from '../ui/AWS';
import { ResourceConfig } from '../../types';

interface GAModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const GlobalAcceleratorArchitectureConfig: React.FC<GAModuleProps> = ({ config, onUpdate }) => {
  const attrs = config.attributes;

  const updateAttribute = (key: string, value: any) => {
    onUpdate({
        ...config,
        attributes: { ...attrs, [key]: value }
    });
  };

  const addAccelerator = () => {
      const newAcc = {
          id: `ga-${Date.now()}`,
          name: `accelerator-${(attrs.gaAccelerators?.length || 0) + 1}`,
          fixedFee: true,
          dataTransfer: 0
      };
      updateAttribute('gaAccelerators', [...(attrs.gaAccelerators || []), newAcc]);
  };

  const removeAccelerator = (id: string) => {
      updateAttribute('gaAccelerators', attrs.gaAccelerators.filter(a => a.id !== id));
  };

  const updateAccelerator = (id: string, field: string, value: any) => {
      const updated = attrs.gaAccelerators.map(a => {
          if (a.id === id) return { ...a, [field]: value };
          return a;
      });
      updateAttribute('gaAccelerators', updated);
  };

  return (
    <div className="space-y-6">
        <Accordion title="Accelerators" defaultOpen={true}>
            <div className="space-y-6">
                <div className="space-y-4">
                    {attrs.gaAccelerators && attrs.gaAccelerators.map((acc, index) => (
                        <div key={acc.id} className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm relative group animate-in fade-in">
                            <div className="absolute top-3 right-3">
                                <button 
                                    onClick={() => removeAccelerator(acc.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            
                            <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center">
                                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 text-xs">{index + 1}</span>
                                {acc.name}
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <AWSInput 
                                    label="Name" 
                                    value={acc.name}
                                    onChange={(e) => updateAccelerator(acc.id, 'name', e.target.value)}
                                />
                            </div>
                        </div>
                    ))}

                    <button 
                        onClick={addAccelerator}
                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-aws-primary hover:text-aws-primary transition-colors text-sm font-medium flex items-center justify-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Add Accelerator
                    </button>
                </div>
            </div>
        </Accordion>
    </div>
  );
};

export const GlobalAcceleratorUsageConfig: React.FC<GAModuleProps> = ({ config, onUpdate }) => {
    const attrs = config.attributes;
    const updateAttribute = (key: string, value: any) => {
        onUpdate({
            ...config,
            attributes: { ...attrs, [key]: value }
        });
    };

    const updateAccelerator = (id: string, field: string, value: any) => {
        const updated = attrs.gaAccelerators.map(a => {
            if (a.id === id) return { ...a, [field]: value };
            return a;
        });
        updateAttribute('gaAccelerators', updated);
    };

    return (
        <div className="space-y-4">
            <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                    <span className="w-2 h-8 bg-blue-600 rounded-full mr-3"></span>
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Data Transfer Premium</h4>
                </div>
                
                <div className="space-y-6">
                    <p className="text-sm text-gray-600">
                        Global Accelerator charges a Data Transfer Premium fee in addition to standard data transfer rates. 
                        This fee is based on the source and destination regions.
                    </p>

                    {attrs.gaAccelerators && attrs.gaAccelerators.map(acc => (
                        <div key={acc.id} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                            <h5 className="text-xs font-bold text-gray-500 uppercase mb-3">{acc.name}</h5>
                            <FormSection 
                                label="Dominant Direction Traffic" 
                                tooltip="Traffic flowing in the dominant direction (usually outbound to users). Premium varies by region."
                            >
                                <AWSSlider 
                                    min={0} max={10000} 
                                    value={acc.dataTransfer} 
                                    onChange={(val) => updateAccelerator(acc.id, 'dataTransfer', val)}
                                    unit="GB/Mo"
                                    labels={["0", "5 TB", "10 TB"]}
                                />
                            </FormSection>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};