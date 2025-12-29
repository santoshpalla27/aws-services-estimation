import React from 'react';
import { Accordion, AWSInput, AWSSelect } from '../ui/AWS';
import { ResourceConfig, CodeBuildComputeType, CodeBuildOs, ServiceType } from '../../types';
import { usePricing } from '../../contexts/PricingContext';

interface CodeBuildModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const CodeBuildArchitectureConfig: React.FC<CodeBuildModuleProps> = ({ config, onUpdate }) => {
  const attrs = config.attributes;
  const { getServiceOptions } = usePricing();
  const computeTypes = getServiceOptions(ServiceType.CODEBUILD, 'compute');

  const updateAttribute = (key: string, value: any) => {
    onUpdate({
        ...config,
        attributes: { ...attrs, [key]: value }
    });
  };

  const addProject = () => {
      const newProj = {
          id: `build-${Date.now()}`,
          name: `project-${(attrs.codeBuildProjects?.length || 0) + 1}`,
          os: CodeBuildOs.LINUX,
          computeType: CodeBuildComputeType.BUILD_GENERAL1_SMALL,
          buildMinutes: 100
      };
      updateAttribute('codeBuildProjects', [...(attrs.codeBuildProjects || []), newProj]);
  };

  const removeProject = (id: string) => {
      updateAttribute('codeBuildProjects', attrs.codeBuildProjects.filter(p => p.id !== id));
  };

  const updateProject = (id: string, field: string, value: any) => {
      const updated = attrs.codeBuildProjects.map(p => {
          if (p.id === id) return { ...p, [field]: value };
          return p;
      });
      updateAttribute('codeBuildProjects', updated);
  };

  return (
    <div className="space-y-6">
        <Accordion title="Build Projects" defaultOpen={true}>
            <div className="space-y-6">
                <div className="space-y-4">
                    {attrs.codeBuildProjects && attrs.codeBuildProjects.map((proj, index) => (
                        <div key={proj.id} className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm relative group animate-in fade-in">
                            <div className="absolute top-3 right-3">
                                <button 
                                    onClick={() => removeProject(proj.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            
                            <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center">
                                <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-2 text-xs">{index + 1}</span>
                                {proj.name}
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <AWSInput 
                                    label="Project Name" 
                                    value={proj.name}
                                    onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                                />
                                <AWSSelect 
                                    label="OS" 
                                    value={proj.os} 
                                    onChange={(e) => updateProject(proj.id, 'os', e.target.value)}
                                >
                                    <option value={CodeBuildOs.LINUX}>Linux</option>
                                    <option value={CodeBuildOs.WINDOWS}>Windows</option>
                                </AWSSelect>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <AWSSelect 
                                    label="Compute Type" 
                                    value={proj.computeType} 
                                    onChange={(e) => updateProject(proj.id, 'computeType', e.target.value)}
                                >
                                    {computeTypes.length > 0 ? (
                                        computeTypes.map(t => <option key={t} value={t}>{t}</option>)
                                    ) : (
                                        Object.values(CodeBuildComputeType).map(t => <option key={t} value={t}>{t}</option>)
                                    )}
                                </AWSSelect>
                                <AWSInput 
                                    label="Build Minutes" 
                                    type="number" min={0}
                                    value={proj.buildMinutes} 
                                    onChange={(e) => updateProject(proj.id, 'buildMinutes', Number(e.target.value))}
                                    unit="Mins"
                                />
                            </div>
                        </div>
                    ))}

                    <button 
                        onClick={addProject}
                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-aws-primary hover:text-aws-primary transition-colors text-sm font-medium flex items-center justify-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Add Build Project
                    </button>
                </div>
            </div>
        </Accordion>
    </div>
  );
};

export const CodeBuildUsageConfig: React.FC<CodeBuildModuleProps> = ({ config, onUpdate }) => {
    return (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center text-sm text-gray-500">
            <p>CodeBuild costs are calculated based on the compute type and build minutes configured in the Architecture tab.</p>
        </div>
    );
};