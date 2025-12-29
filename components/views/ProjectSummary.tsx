import React, { useMemo } from 'react';
import { ResourceConfig, ServiceType } from '../../types';
import { calculateResourceCost } from '../../utils/calculator';
import { AWSButton } from '../ui/AWS';

interface ProjectSummaryProps {
  resources: ResourceConfig[];
  onRemove: (id: string) => void;
  onEdit: (resource: ResourceConfig) => void;
}

export const ProjectSummary: React.FC<ProjectSummaryProps> = ({ resources, onRemove, onEdit }) => {
  const { totalMonthly, totalAnnual, resourceCosts } = useMemo(() => {
    let monthly = 0;
    const itemCosts = resources.map(res => {
      const cost = calculateResourceCost(res);
      monthly += cost.monthlyTotal;
      return { resource: res, cost };
    });
    return { 
        totalMonthly: monthly, 
        totalAnnual: monthly * 12, 
        resourceCosts: itemCosts 
    };
  }, [resources]);

  const formatMoney = (amount: number) => {
    return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };

  if (resources.length === 0) {
      return (
          <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900">No resources in estimate</h3>
              <p className="text-gray-500 mt-1">Configure services in the Editor and click "Add to Estimate" to build your project.</p>
          </div>
      );
  }

  return (
    <div className="space-y-8">
        {/* Summary Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-[#232f3e] px-8 py-6 flex flex-col md:flex-row justify-between items-center text-white">
                <div>
                    <h2 className="text-2xl font-bold">Project Estimate Total</h2>
                    <p className="text-gray-400 text-sm mt-1">{resources.length} Resource{resources.length !== 1 ? 's' : ''} Configured</p>
                </div>
                <div className="mt-4 md:mt-0 text-right">
                    <div className="text-4xl font-extrabold tracking-tight">{formatMoney(totalMonthly)}<span className="text-lg font-medium text-gray-400">/mo</span></div>
                    <div className="text-sm text-gray-400 font-medium">{formatMoney(totalAnnual)} / year</div>
                </div>
            </div>
            
             <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
                 <AWSButton variant="secondary" onClick={() => alert("Exporting CSV...")}>Export CSV</AWSButton>
                 <AWSButton onClick={() => window.print()}>Print Report</AWSButton>
             </div>
        </div>

        {/* Resource List */}
        <div className="grid gap-6">
            {resourceCosts.map(({ resource, cost }) => {
                const linkedResourceName = resource.attributes.linkedVpcId 
                    ? resources.find(r => r.id === resource.attributes.linkedVpcId)?.name 
                    : null;

                return (
                <div key={resource.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col md:flex-row overflow-hidden relative group">
                    {/* Color Bar */}
                    <div className={`w-2 md:w-2 h-2 md:h-auto ${resource.serviceType === ServiceType.EC2 ? 'bg-aws-primary' : 'bg-blue-600'}`}></div>
                    
                    <div className="p-6 flex-1">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="flex items-center space-x-3 mb-1">
                                    <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wide ${resource.serviceType === ServiceType.EC2 ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}`}>
                                        {resource.serviceType}
                                    </span>
                                    <span className="text-sm text-gray-500 flex items-center">
                                        <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        {resource.region}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">{resource.name}</h3>
                                {linkedResourceName && (
                                    <div className="flex items-center mt-2 text-sm text-gray-500 bg-gray-50 w-fit px-2 py-1 rounded border border-gray-100">
                                        <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                                        Linked to: <span className="font-semibold ml-1">{linkedResourceName}</span>
                                    </div>
                                )}
                            </div>
                            <div className="text-right">
                                <span className="block text-2xl font-bold text-gray-900">{formatMoney(cost.monthlyTotal)}</span>
                                <span className="text-xs text-gray-500 uppercase font-semibold">Per Month</span>
                            </div>
                        </div>

                        {/* Breakdown */}
                        <div className="border-t border-gray-100 pt-4 mt-2">
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                                {cost.breakdown.slice(0, 4).map((item, idx) => (
                                    <div key={idx} className="flex justify-between">
                                        <span className="text-gray-600 truncate mr-2">{item.label}</span>
                                        <span className="font-medium">{formatMoney(item.total)}</span>
                                    </div>
                                ))}
                                {cost.breakdown.length > 4 && (
                                    <div className="text-xs text-gray-400 mt-1 italic">...and {cost.breakdown.length - 4} more items</div>
                                )}
                             </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-gray-50 px-4 py-4 md:py-0 md:w-32 flex md:flex-col items-center justify-center space-x-4 md:space-x-0 md:space-y-3 border-t md:border-t-0 md:border-l border-gray-200">
                        <button 
                            onClick={() => onEdit(resource)}
                            className="text-gray-500 hover:text-aws-link font-medium text-sm flex items-center transition-colors"
                        >
                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            Edit
                        </button>
                        <button 
                            onClick={() => onRemove(resource.id)}
                            className="text-gray-500 hover:text-red-600 font-medium text-sm flex items-center transition-colors"
                        >
                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            Remove
                        </button>
                    </div>
                </div>
                );
            })}
        </div>
    </div>
  );
};