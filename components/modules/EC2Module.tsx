import React, { useState } from 'react';
import { Accordion, FormSection, AWSSlider, AWSInput, AWSSelect, AWSToggle } from '../ui/AWS';
import { ResourceConfig, InstanceFamily, Tenancy, EbsVolumeType, LoadBalancerType, ServiceType } from '../../types';
import { usePricing } from '../../contexts/PricingContext';

interface EC2ModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
  availableVpcs?: { id: string; name: string }[];
}

export const EC2ArchitectureConfig: React.FC<EC2ModuleProps> = ({ config, onUpdate, availableVpcs = [] }) => {
  const attrs = config.attributes;
  const [isFleet, setIsFleet] = useState(attrs.instanceCount > 1);
  const { getServiceOptions } = usePricing();
  
  const instanceTypes = getServiceOptions(ServiceType.EC2, 'instance');
  const volumeTypes = getServiceOptions(ServiceType.EC2, 'volume');

  const updateAttribute = (key: string, value: any) => {
    onUpdate({
        ...config,
        attributes: { ...attrs, [key]: value }
    });
  };

  const handleModeSwitch = (fleetMode: boolean) => {
      setIsFleet(fleetMode);
      if (!fleetMode) {
          updateAttribute('instanceCount', 1);
      } else {
          if (attrs.instanceCount === 1) {
              updateAttribute('instanceCount', 2);
          }
      }
  };

  const addVolume = () => {
      const newVol = {
          id: `vol-${Date.now()}`,
          type: EbsVolumeType.GP3,
          size: 100,
          count: 1
      };
      updateAttribute('ec2DataVolumes', [...(attrs.ec2DataVolumes || []), newVol]);
  };

  const removeVolume = (id: string) => {
      updateAttribute('ec2DataVolumes', attrs.ec2DataVolumes.filter(v => v.id !== id));
  };

  const updateVolume = (id: string, field: string, value: any) => {
      const updatedVols = attrs.ec2DataVolumes.map(v => {
          if (v.id === id) return { ...v, [field]: value };
          return v;
      });
      updateAttribute('ec2DataVolumes', updatedVols);
  };

  return (
    <div className="space-y-6">
        {/* 1. Instance Details */}
        <Accordion title="Instance Configuration" defaultOpen={true}>
            <div className="space-y-6">
                
                {/* Deployment Mode Selector */}
                <div className="flex space-x-4 mb-2 pb-6 border-b border-gray-100">
                    <button
                        onClick={() => handleModeSwitch(false)}
                        className={`flex-1 p-4 border rounded-lg flex flex-col items-center justify-center transition-all duration-200 group
                        ${!isFleet 
                            ? 'bg-orange-50 border-aws-primary ring-1 ring-aws-primary text-aws-primary' 
                            : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-600'}`}
                    >
                         <svg className={`w-8 h-8 mb-2 ${!isFleet ? 'text-aws-primary' : 'text-gray-400 group-hover:text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M12 5l7 7-7 7" />
                            <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="font-bold text-sm">Single Instance</span>
                        <span className="text-xs mt-1 opacity-80 text-center">Run a standalone virtual server</span>
                    </button>
                    
                    <button
                        onClick={() => handleModeSwitch(true)}
                        className={`flex-1 p-4 border rounded-lg flex flex-col items-center justify-center transition-all duration-200 group
                        ${isFleet 
                            ? 'bg-orange-50 border-aws-primary ring-1 ring-aws-primary text-aws-primary' 
                            : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-600'}`}
                    >
                        <div className="flex -space-x-2 mb-2">
                             <div className={`w-6 h-6 rounded border bg-white flex items-center justify-center ${isFleet ? 'border-aws-primary text-aws-primary' : 'border-gray-300 text-gray-400'}`}>
                                <span className="text-[10px] font-bold">1</span>
                             </div>
                             <div className={`w-6 h-6 rounded border bg-white flex items-center justify-center relative z-10 ${isFleet ? 'border-aws-primary text-aws-primary' : 'border-gray-300 text-gray-400'}`}>
                                <span className="text-[10px] font-bold">2</span>
                             </div>
                             <div className={`w-6 h-6 rounded border bg-white flex items-center justify-center ${isFleet ? 'border-aws-primary text-aws-primary' : 'border-gray-300 text-gray-400'}`}>
                                <span className="text-[10px] font-bold">3</span>
                             </div>
                        </div>
                        <span className="font-bold text-sm">Instance Fleet</span>
                        <span className="text-xs mt-1 opacity-80 text-center">Auto Scaling Group or Cluster</span>
                    </button>
                </div>

                <FormSection label="Instance Details" info={isFleet ? "Define the size and name of your instance fleet" : "Define the identity of your single instance"}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AWSInput 
                            value={config.name} 
                            onChange={(e) => onUpdate({...config, name: e.target.value})} 
                            placeholder={isFleet ? "My Web Fleet" : "My Web Server"}
                            label="Name"
                        />
                        
                        {isFleet ? (
                             <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                                 <AWSInput 
                                    type="number" min={1}
                                    value={attrs.instanceCount}
                                    onChange={(e) => updateAttribute('instanceCount', Number(e.target.value))}
                                    unit="Instances"
                                    label="Count"
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-700 mb-1.5">Count</span>
                                <div className="h-10 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-500 flex items-center justify-between cursor-not-allowed">
                                    <span>1 Instance</span>
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                            </div>
                        )}
                    </div>
                </FormSection>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormSection 
                        label="Instance Family" 
                        tooltip="Instance families are optimized for different use cases (Compute, Memory, General Purpose)."
                    >
                        <AWSSelect 
                            value={attrs.instanceFamily} 
                            onChange={(e) => updateAttribute('instanceFamily', e.target.value)}
                        >
                            {Object.values(InstanceFamily).map(f => (
                                <option key={f} value={f}>{f}</option>
                            ))}
                        </AWSSelect>
                    </FormSection>

                    <FormSection 
                        label="Instance Type"
                        tooltip="Specific hardware combination of vCPU, Memory, and Networking. Fetched dynamically."
                    >
                        <AWSSelect 
                            value={attrs.instanceType} 
                            onChange={(e) => updateAttribute('instanceType', e.target.value)}
                        >
                            {instanceTypes.map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </AWSSelect>
                    </FormSection>
                </div>

                <div className="pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormSection 
                        label="Tenancy" 
                        tooltip="Tenancy defines how EC2 instances are distributed across physical hardware. Dedicated instances/hosts incur extra costs."
                    >
                        <AWSSelect 
                            value={attrs.tenancy} 
                            onChange={(e) => updateAttribute('tenancy', e.target.value)}
                        >
                            {Object.values(Tenancy).map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </AWSSelect>
                    </FormSection>
                    
                    <FormSection 
                        label="Monitoring" 
                        tooltip="Enable CloudWatch Detailed Monitoring (1-minute metrics)."
                    >
                        <AWSToggle 
                            label="Detailed Monitoring"
                            checked={attrs.monitoringEnabled}
                            onChange={(val) => updateAttribute('monitoringEnabled', val)}
                        />
                    </FormSection>
                </div>
            </div>
        </Accordion>

        {/* 2. Network Settings (Dependency) */}
        <Accordion title="Network Settings">
             <div className="space-y-6">
                <FormSection 
                    label="Virtual Private Cloud (VPC)" 
                    info="Select the VPC where these instances will be deployed."
                    tooltip="EC2 instances must be launched into a VPC. You can link this instance to a VPC you've already configured in the Project Estimate."
                >
                    <AWSSelect 
                        value={attrs.linkedVpcId || ""} 
                        onChange={(e) => updateAttribute('linkedVpcId', e.target.value)}
                    >
                        <option value="">(Default) No specific dependency</option>
                        {availableVpcs.length > 0 && (
                            <optgroup label="Your Project Resources">
                                {availableVpcs.map(vpc => (
                                    <option key={vpc.id} value={vpc.id}>Link to: {vpc.name}</option>
                                ))}
                            </optgroup>
                        )}
                    </AWSSelect>
                    {attrs.linkedVpcId && (
                        <div className="mt-2 flex items-center text-sm text-green-600 bg-green-50 p-2 rounded border border-green-200 animate-in fade-in">
                             <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                             Dependent on <strong>&nbsp;{availableVpcs.find(v => v.id === attrs.linkedVpcId)?.name || 'VPC'}</strong>
                        </div>
                    )}
                </FormSection>
             </div>
        </Accordion>

        {/* 3. Storage (EBS) */}
        <Accordion title="Storage (EBS)">
            <div className="space-y-6">
                <FormSection 
                    label="Root Volume" 
                    info="The boot volume for the operating system"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <AWSSelect 
                            label="Type"
                            value={attrs.rootVolumeType}
                            onChange={(e) => updateAttribute('rootVolumeType', e.target.value)}
                        >
                            {volumeTypes.length > 0 ? (
                                volumeTypes.map(t => <option key={t} value={t}>{t}</option>)
                            ) : (
                                Object.values(EbsVolumeType).map(t => <option key={t} value={t}>{t}</option>)
                            )}
                        </AWSSelect>
                        <AWSInput 
                            label="Size"
                            type="number" min={8}
                            value={attrs.rootVolumeSize}
                            onChange={(e) => updateAttribute('rootVolumeSize', Number(e.target.value))}
                            unit="GB"
                        />
                         <AWSInput 
                            label="IOPS"
                            type="number" min={3000}
                            disabled={!attrs.rootVolumeType.includes('io') && !attrs.rootVolumeType.includes('gp3')}
                            value={attrs.rootVolumeIops}
                            onChange={(e) => updateAttribute('rootVolumeIops', Number(e.target.value))}
                            unit="IOPS"
                        />
                    </div>
                </FormSection>

                <div className="pt-4 border-t border-gray-100">
                    <FormSection 
                        label="Additional Data Volumes" 
                        info="Attached block storage for application data"
                    >
                         <div className="space-y-4">
                            {attrs.ec2DataVolumes && attrs.ec2DataVolumes.map((vol, index) => (
                                <div key={vol.id} className="bg-gray-50 p-4 rounded border border-gray-200 relative group">
                                    <div className="absolute top-2 right-2">
                                        <button 
                                            onClick={() => removeVolume(vol.id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Volume #{index + 1}</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <AWSSelect 
                                            label="Type"
                                            value={vol.type}
                                            onChange={(e) => updateVolume(vol.id, 'type', e.target.value)}
                                        >
                                            {volumeTypes.length > 0 ? (
                                                volumeTypes.map(t => <option key={t} value={t}>{t}</option>)
                                            ) : (
                                                Object.values(EbsVolumeType).map(t => <option key={t} value={t}>{t}</option>)
                                            )}
                                        </AWSSelect>
                                        <AWSInput 
                                            label="Size (GB)"
                                            type="number" min={1}
                                            value={vol.size}
                                            onChange={(e) => updateVolume(vol.id, 'size', Number(e.target.value))}
                                            unit="GB"
                                        />
                                        <AWSInput 
                                            label="Count"
                                            type="number" min={1}
                                            value={vol.count}
                                            onChange={(e) => updateVolume(vol.id, 'count', Number(e.target.value))}
                                            unit="Vols"
                                        />
                                    </div>
                                </div>
                            ))}

                            <button 
                                onClick={addVolume}
                                className="w-full py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-500 hover:border-aws-primary hover:text-aws-primary transition-colors text-sm font-medium flex items-center justify-center"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                Add Volume
                            </button>
                         </div>
                    </FormSection>
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                     <FormSection 
                        label="EBS Snapshots" 
                        tooltip="Incremental backups of EBS volumes stored in S3."
                    >
                        <AWSSlider 
                            min={0} max={5000} 
                            value={attrs.snapshotDataChange} 
                            onChange={(val) => updateAttribute('snapshotDataChange', val)}
                            unit="GB Stored/Mo"
                            labels={["0", "5 TB"]}
                        />
                    </FormSection>
                </div>
            </div>
        </Accordion>

        {/* 4. Networking */}
        <Accordion title="Networking & Load Balancing">
             <div className="space-y-6">
                <FormSection 
                    label="Load Balancer" 
                    tooltip="Distribute incoming application traffic across multiple targets."
                >
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AWSSelect 
                            value={attrs.loadBalancerType} 
                            onChange={(e) => updateAttribute('loadBalancerType', e.target.value)}
                        >
                            {Object.values(LoadBalancerType).map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </AWSSelect>
                        {attrs.loadBalancerType !== LoadBalancerType.NONE && (
                            <AWSInput 
                                type="number" min={1}
                                value={attrs.loadBalancerCount}
                                onChange={(e) => updateAttribute('loadBalancerCount', Number(e.target.value))}
                                unit="LBs"
                            />
                        )}
                     </div>
                </FormSection>

                <FormSection 
                    label="Elastic IPs" 
                    info="Static public IPv4 addresses"
                    tooltip="You are charged for EIPs that are not associated with a running instance or if you have multiple EIPs attached to an instance."
                >
                     <AWSInput 
                        label="Idle/Remapped IPs"
                        type="number" min={0}
                        value={attrs.elasticIps}
                        onChange={(e) => updateAttribute('elasticIps', Number(e.target.value))}
                        unit="IPs"
                    />
                </FormSection>
             </div>
        </Accordion>
    </div>
  );
};

export const EC2UsageConfig: React.FC<EC2ModuleProps> = ({ config, onUpdate }) => {
    const attrs = config.attributes;
    const updateAttribute = (key: string, value: any) => {
        onUpdate({
            ...config,
            attributes: { ...attrs, [key]: value }
        });
    };

    return (
        <div className="space-y-4">
             {/* Utilization */}
             <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                    <span className="w-2 h-8 bg-purple-500 rounded-full mr-3"></span>
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Compute Utilization</h4>
                </div>
                
                <FormSection label="Running Hours (Per Month)" info="Standard month is ~730 hours">
                    <AWSSlider 
                        min={0} max={730} 
                        value={attrs.utilizationHours} 
                        onChange={(val) => updateAttribute('utilizationHours', val)}
                        unit="Hrs/Mo"
                        labels={["0", "365", "730"]}
                    />
                </FormSection>

                <div className="pt-4 border-t border-gray-100">
                    <AWSToggle 
                        label="Use Spot Instances"
                        checked={attrs.enableSpotInstances}
                        onChange={(val) => updateAttribute('enableSpotInstances', val)}
                        tooltip="Spot Instances let you take advantage of unused EC2 capacity in the AWS cloud at deep discounts."
                    />
                    
                    {attrs.enableSpotInstances && (
                         <div className="mt-4 pl-4 border-l-2 border-purple-200 animate-in fade-in">
                            <FormSection label="Estimated Discount %">
                                <AWSSlider 
                                    min={0} max={90} 
                                    value={attrs.spotDiscountPercentage} 
                                    onChange={(val) => updateAttribute('spotDiscountPercentage', val)}
                                    unit="%"
                                    labels={["0%", "90%"]}
                                />
                            </FormSection>
                         </div>
                    )}
                </div>
             </div>

             {/* Data Transfer */}
            <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                    <span className="w-2 h-8 bg-green-500 rounded-full mr-3"></span>
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Data Transfer</h4>
                </div>
                <FormSection 
                    label="Outbound Data Transfer" 
                    tooltip="Data transferred from EC2 to the Internet."
                >
                    <AWSSlider 
                        min={0} max={10000} 
                        value={attrs.dataTransferOut} 
                        onChange={(val) => updateAttribute('dataTransferOut', val)}
                        unit="GB/mo"
                        labels={["0", "10 TB"]}
                    />
                </FormSection>

                {attrs.loadBalancerType !== LoadBalancerType.NONE && (
                     <div className="pt-4 mt-2 border-t border-gray-100">
                        <FormSection 
                            label="Load Balancer Data Processing"
                            tooltip="Data processed by the Load Balancer (in bytes)."
                        >
                            <AWSSlider 
                                min={0} max={10000} 
                                value={attrs.loadBalancerDataProcessed} 
                                onChange={(val) => updateAttribute('loadBalancerDataProcessed', val)}
                                unit="GB/mo"
                                labels={["0", "10 TB"]}
                            />
                        </FormSection>
                     </div>
                )}
            </div>
        </div>
    );
};