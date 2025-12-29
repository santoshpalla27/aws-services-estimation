/**
 * EKS Module V2 - Card-Based UI with Nested Schema Support
 * 
 * This is the new implementation using the service registry and nested schemas.
 * It provides a card-based interface for node groups and Fargate profiles.
 * 
 * Features:
 * - Explicit node group cards (add/edit/delete/duplicate)
 * - Explicit Fargate profile cards (add/edit/delete/duplicate)
 * - Live cost updates per resource
 * - Validation with hard/soft constraints
 * - Backward compatible with legacy flat schema
 */

import React, { useState } from 'react';
import { Accordion, FormSection, AWSSlider, AWSInput, AWSSelect, AWSToggle, AWSButton } from '../ui/AWS';
import { ResourceConfig, InstanceType, EbsVolumeType } from '../../types';
import { EKSClusterSchema, EKSNodeGroup, EKSFargateProfile, DEFAULT_EKS_NODE_GROUP, DEFAULT_EKS_FARGATE_PROFILE } from '../../types/schemas/eks.schema';
import { calculateEKSCost } from '../../utils/calculators/eks.calculator';
import { validateResource } from '../../utils/validation';
import { EKS_HARD_CONSTRAINTS, EKS_SOFT_CONSTRAINTS } from '../../utils/validation/eks.validation';

interface EKSModuleProps {
    config: ResourceConfig;
    onUpdate: (newConfig: ResourceConfig) => void;
}

/**
 * Get or initialize EKS schema from config
 */
function getEKSSchema(config: ResourceConfig): EKSClusterSchema {
    // If new schema exists, use it
    if (config.attributes.eks) {
        return config.attributes.eks as EKSClusterSchema;
    }

    // Migrate from legacy flat schema
    return {
        id: config.id,
        name: config.name,
        version: '1.28',
        region: config.region,
        nodeGroups: config.attributes.eksNodesEnabled ? [{
            id: `ng-${Date.now()}`,
            name: 'Node Group 1',
            instanceType: config.attributes.eksNodeInstanceType || InstanceType.T3_MEDIUM,
            capacityType: 'ON_DEMAND',
            minSize: 1,
            desiredSize: config.attributes.eksNodeCount || 2,
            maxSize: 10,
            diskSize: config.attributes.eksNodeStorageSize || 20,
            diskType: EbsVolumeType.GP3,
            subnetIds: [],
            availabilityZones: [],
            labels: {},
            taints: []
        }] : [],
        fargateProfiles: config.attributes.eksFargateEnabled ? [{
            id: `fp-${Date.now()}`,
            name: 'Fargate Profile 1',
            namespaceSelectors: ['default'],
            labelSelectors: [],
            subnetIds: [],
            estimatedPods: config.attributes.eksFargateTasks || 2,
            avgCpuPerPod: config.attributes.eksFargateCpu || 0.5,
            avgMemoryPerPod: config.attributes.eksFargateMemory || 1,
            avgRunningHours: 730
        }] : [],
        extendedSupport: config.attributes.eksExtendedSupport || false,
        tags: {},
        createdAt: new Date().toISOString()
    };
}

/**
 * Update EKS schema in config
 */
function updateEKSSchema(config: ResourceConfig, schema: EKSClusterSchema): ResourceConfig {
    return {
        ...config,
        attributes: {
            ...config.attributes,
            eks: schema
        }
    };
}

/**
 * Node Group Card Component
 */
const NodeGroupCard: React.FC<{
    nodeGroup: EKSNodeGroup;
    onEdit: () => void;
    onDelete: () => void;
    onDuplicate: () => void;
    cost: number;
}> = ({ nodeGroup, onEdit, onDelete, onDuplicate, cost }) => {
    const capacityBadge = nodeGroup.capacityType === 'SPOT' ? (
        <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded">
            Spot
        </span>
    ) : (
        <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 rounded">
            On-Demand
        </span>
    );

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-aws-link transition-colors">
            <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 flex items-center">
                        {nodeGroup.name}
                        {capacityBadge}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                        {nodeGroup.instanceType} • {nodeGroup.desiredSize} nodes • {nodeGroup.diskSize}GB {nodeGroup.diskType}
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-lg font-bold text-aws-primary">
                        ${cost.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">per month</div>
                </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                <span>Min: {nodeGroup.minSize}</span>
                <span>•</span>
                <span>Desired: {nodeGroup.desiredSize}</span>
                <span>•</span>
                <span>Max: {nodeGroup.maxSize}</span>
            </div>

            <div className="flex gap-2">
                <button
                    onClick={onEdit}
                    className="flex-1 px-3 py-1.5 text-sm font-medium text-aws-link hover:bg-aws-link hover:text-white border border-aws-link rounded transition-colors"
                >
                    Edit
                </button>
                <button
                    onClick={onDuplicate}
                    className="flex-1 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 border border-gray-300 rounded transition-colors"
                >
                    Duplicate
                </button>
                <button
                    onClick={onDelete}
                    className="flex-1 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 border border-red-300 rounded transition-colors"
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

/**
 * Fargate Profile Card Component
 */
const FargateProfileCard: React.FC<{
    profile: EKSFargateProfile;
    onEdit: () => void;
    onDelete: () => void;
    onDuplicate: () => void;
    cost: number;
}> = ({ profile, onEdit, onDelete, onDuplicate, cost }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-aws-link transition-colors">
            <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 flex items-center">
                        {profile.name}
                        <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-purple-100 text-purple-800 rounded">
                            Serverless
                        </span>
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                        {profile.estimatedPods} pods • {profile.avgCpuPerPod} vCPU • {profile.avgMemoryPerPod}GB memory
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-lg font-bold text-aws-primary">
                        ${cost.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">per month</div>
                </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                <span>Namespaces: {profile.namespaceSelectors.join(', ')}</span>
                <span>•</span>
                <span>{profile.avgRunningHours} hrs/month</span>
            </div>

            <div className="flex gap-2">
                <button
                    onClick={onEdit}
                    className="flex-1 px-3 py-1.5 text-sm font-medium text-aws-link hover:bg-aws-link hover:text-white border border-aws-link rounded transition-colors"
                >
                    Edit
                </button>
                <button
                    onClick={onDuplicate}
                    className="flex-1 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 border border-gray-300 rounded transition-colors"
                >
                    Duplicate
                </button>
                <button
                    onClick={onDelete}
                    className="flex-1 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 border border-red-300 rounded transition-colors"
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

/**
 * Node Group Editor Modal (simplified inline version)
 */
const NodeGroupEditor: React.FC<{
    nodeGroup: EKSNodeGroup;
    onChange: (ng: EKSNodeGroup) => void;
    onSave: () => void;
    onCancel: () => void;
}> = ({ nodeGroup, onChange, onSave, onCancel }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-900">Edit Node Group</h3>
                    <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <FormSection label="Node Group Name">
                        <AWSInput
                            value={nodeGroup.name}
                            onChange={(e) => onChange({ ...nodeGroup, name: e.target.value })}
                            placeholder="Node Group 1"
                        />
                    </FormSection>

                    <div className="grid grid-cols-2 gap-4">
                        <FormSection label="Instance Type">
                            <AWSSelect
                                value={nodeGroup.instanceType}
                                onChange={(e) => onChange({ ...nodeGroup, instanceType: e.target.value as InstanceType })}
                            >
                                {Object.values(InstanceType).map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </AWSSelect>
                        </FormSection>

                        <FormSection label="Capacity Type">
                            <AWSSelect
                                value={nodeGroup.capacityType}
                                onChange={(e) => onChange({ ...nodeGroup, capacityType: e.target.value as 'ON_DEMAND' | 'SPOT' })}
                            >
                                <option value="ON_DEMAND">On-Demand</option>
                                <option value="SPOT">Spot (~65% cheaper)</option>
                            </AWSSelect>
                        </FormSection>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <FormSection label="Min Size">
                            <AWSInput
                                type="number"
                                min={0}
                                value={nodeGroup.minSize}
                                onChange={(e) => onChange({ ...nodeGroup, minSize: Number(e.target.value) })}
                            />
                        </FormSection>

                        <FormSection label="Desired Size">
                            <AWSInput
                                type="number"
                                min={0}
                                value={nodeGroup.desiredSize}
                                onChange={(e) => onChange({ ...nodeGroup, desiredSize: Number(e.target.value) })}
                            />
                        </FormSection>

                        <FormSection label="Max Size">
                            <AWSInput
                                type="number"
                                min={1}
                                value={nodeGroup.maxSize}
                                onChange={(e) => onChange({ ...nodeGroup, maxSize: Number(e.target.value) })}
                            />
                        </FormSection>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FormSection label="Disk Size (GB)">
                            <AWSInput
                                type="number"
                                min={1}
                                max={16384}
                                value={nodeGroup.diskSize}
                                onChange={(e) => onChange({ ...nodeGroup, diskSize: Number(e.target.value) })}
                            />
                        </FormSection>

                        <FormSection label="Disk Type">
                            <AWSSelect
                                value={nodeGroup.diskType}
                                onChange={(e) => onChange({ ...nodeGroup, diskType: e.target.value as EbsVolumeType })}
                            >
                                {Object.values(EbsVolumeType).map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </AWSSelect>
                        </FormSection>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 border border-gray-300 rounded transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSave}
                        className="px-4 py-2 text-sm font-medium text-white bg-aws-link hover:bg-aws-link-hover rounded transition-colors"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

/**
 * Fargate Profile Editor Modal
 */
const FargateProfileEditor: React.FC<{
    profile: EKSFargateProfile;
    onChange: (fp: EKSFargateProfile) => void;
    onSave: () => void;
    onCancel: () => void;
}> = ({ profile, onChange, onSave, onCancel }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-900">Edit Fargate Profile</h3>
                    <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <FormSection label="Profile Name">
                        <AWSInput
                            value={profile.name}
                            onChange={(e) => onChange({ ...profile, name: e.target.value })}
                            placeholder="Fargate Profile 1"
                        />
                    </FormSection>

                    <FormSection label="Namespace Selectors" info="Comma-separated list of namespaces">
                        <AWSInput
                            value={profile.namespaceSelectors.join(', ')}
                            onChange={(e) => onChange({
                                ...profile,
                                namespaceSelectors: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                            })}
                            placeholder="default, production, staging"
                        />
                    </FormSection>

                    <FormSection label="Estimated Pods" info="Average number of pods running simultaneously">
                        <AWSInput
                            type="number"
                            min={1}
                            value={profile.estimatedPods}
                            onChange={(e) => onChange({ ...profile, estimatedPods: Number(e.target.value) })}
                        />
                    </FormSection>

                    <div className="grid grid-cols-2 gap-4">
                        <FormSection label="vCPU per Pod">
                            <AWSInput
                                type="number"
                                min={0.25}
                                step={0.25}
                                value={profile.avgCpuPerPod}
                                onChange={(e) => onChange({ ...profile, avgCpuPerPod: Number(e.target.value) })}
                            />
                        </FormSection>

                        <FormSection label="Memory per Pod (GB)">
                            <AWSInput
                                type="number"
                                min={0.5}
                                step={0.5}
                                value={profile.avgMemoryPerPod}
                                onChange={(e) => onChange({ ...profile, avgMemoryPerPod: Number(e.target.value) })}
                            />
                        </FormSection>
                    </div>

                    <FormSection label="Running Hours per Month" info="Average hours pods run per month">
                        <AWSInput
                            type="number"
                            min={1}
                            max={730}
                            value={profile.avgRunningHours}
                            onChange={(e) => onChange({ ...profile, avgRunningHours: Number(e.target.value) })}
                        />
                    </FormSection>
                </div>

                <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 border border-gray-300 rounded transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSave}
                        className="px-4 py-2 text-sm font-medium text-white bg-aws-link hover:bg-aws-link-hover rounded transition-colors"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};


/**
 * EKS Architecture Configuration Component (V2)
 */
export const EKSArchitectureConfigV2: React.FC<EKSModuleProps> = ({ config, onUpdate }) => {
    const [eksSchema, setEKSSchema] = useState<EKSClusterSchema>(() => getEKSSchema(config));
    const [editingNodeGroup, setEditingNodeGroup] = useState<{ index: number; nodeGroup: EKSNodeGroup } | null>(null);
    const [editingFargateProfile, setEditingFargateProfile] = useState<{ index: number; profile: EKSFargateProfile } | null>(null);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [validationWarnings, setValidationWarnings] = useState<string[]>([]);

    // Update parent config whenever schema changes
    const updateSchema = (newSchema: EKSClusterSchema) => {
        setEKSSchema(newSchema);
        onUpdate(updateEKSSchema(config, newSchema));

        // Validate
        const validation = validateResource(
            newSchema,
            EKS_HARD_CONSTRAINTS,
            EKS_SOFT_CONSTRAINTS,
            {
                region: config.region,
                existingResources: [],
                availableServices: []
            }
        );

        setValidationErrors(validation.errors);
        setValidationWarnings(validation.warnings);
    };

    // Calculate costs
    const totalCost = calculateEKSCost(eksSchema, config.region);
    const nodeGroupCosts = eksSchema.nodeGroups.map((ng, i) => {
        const ngCost = totalCost.breakdown.find(b => b.name.includes(ng.name));
        return ngCost?.monthly || 0;
    });
    const fargateProfileCosts = eksSchema.fargateProfiles.map((fp, i) => {
        const fpCost = totalCost.breakdown.find(b => b.name.includes(fp.name));
        return fpCost?.monthly || 0;
    });

    // Node Group Actions
    const addNodeGroup = () => {
        const newNodeGroup: EKSNodeGroup = {
            ...DEFAULT_EKS_NODE_GROUP,
            id: `ng-${Date.now()}`,
            name: `Node Group ${eksSchema.nodeGroups.length + 1}`
        };

        updateSchema({
            ...eksSchema,
            nodeGroups: [...eksSchema.nodeGroups, newNodeGroup]
        });
    };

    const editNodeGroup = (index: number) => {
        setEditingNodeGroup({ index, nodeGroup: { ...eksSchema.nodeGroups[index] } });
    };

    const saveNodeGroup = () => {
        if (!editingNodeGroup) return;

        const newNodeGroups = [...eksSchema.nodeGroups];
        newNodeGroups[editingNodeGroup.index] = editingNodeGroup.nodeGroup;

        updateSchema({
            ...eksSchema,
            nodeGroups: newNodeGroups
        });

        setEditingNodeGroup(null);
    };

    const deleteNodeGroup = (index: number) => {
        updateSchema({
            ...eksSchema,
            nodeGroups: eksSchema.nodeGroups.filter((_, i) => i !== index)
        });
    };

    const duplicateNodeGroup = (index: number) => {
        const original = eksSchema.nodeGroups[index];
        const duplicate: EKSNodeGroup = {
            ...original,
            id: `ng-${Date.now()}`,
            name: `${original.name} (Copy)`
        };

        updateSchema({
            ...eksSchema,
            nodeGroups: [...eksSchema.nodeGroups, duplicate]
        });
    };

    // Fargate Profile Actions
    const addFargateProfile = () => {
        const newProfile: EKSFargateProfile = {
            ...DEFAULT_EKS_FARGATE_PROFILE,
            id: `fp-${Date.now()}`,
            name: `Fargate Profile ${eksSchema.fargateProfiles.length + 1}`
        };

        updateSchema({
            ...eksSchema,
            fargateProfiles: [...eksSchema.fargateProfiles, newProfile]
        });
    };

    const editFargateProfile = (index: number) => {
        setEditingFargateProfile({ index, profile: { ...eksSchema.fargateProfiles[index] } });
    };

    const saveFargateProfile = () => {
        if (!editingFargateProfile) return;

        const newProfiles = [...eksSchema.fargateProfiles];
        newProfiles[editingFargateProfile.index] = editingFargateProfile.profile;

        updateSchema({
            ...eksSchema,
            fargateProfiles: newProfiles
        });

        setEditingFargateProfile(null);
    };

    const deleteFargateProfile = (index: number) => {
        updateSchema({
            ...eksSchema,
            fargateProfiles: eksSchema.fargateProfiles.filter((_, i) => i !== index)
        });
    };

    const duplicateFargateProfile = (index: number) => {
        const original = eksSchema.fargateProfiles[index];
        const duplicate: EKSFargateProfile = {
            ...original,
            id: `fp-${Date.now()}`,
            name: `${original.name} (Copy)`
        };

        updateSchema({
            ...eksSchema,
            fargateProfiles: [...eksSchema.fargateProfiles, duplicate]
        });
    };

    return (
        <div className="space-y-6">
            {/* Validation Errors */}
            {validationErrors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-900 mb-2">⚠ Configuration Errors</h4>
                    <ul className="list-disc list-inside space-y-1">
                        {validationErrors.map((error, i) => (
                            <li key={i} className="text-sm text-red-700">{error}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Validation Warnings */}
            {validationWarnings.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-900 mb-2">⚡ Warnings</h4>
                    <ul className="list-disc list-inside space-y-1">
                        {validationWarnings.map((warning, i) => (
                            <li key={i} className="text-sm text-yellow-700">{warning}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Cluster Settings */}
            <Accordion title="Cluster Settings" defaultOpen={true}>
                <div className="space-y-6">
                    <FormSection label="Cluster Name" info="Identifier for this Kubernetes cluster">
                        <AWSInput
                            value={eksSchema.name}
                            onChange={(e) => updateSchema({ ...eksSchema, name: e.target.value })}
                            placeholder="production-k8s"
                        />
                    </FormSection>

                    <FormSection
                        label="Extended Support"
                        info="For Kubernetes versions older than 14 months"
                        tooltip="Adds $438/month per cluster for extended support"
                    >
                        <AWSToggle
                            label="Enable Extended Support"
                            checked={eksSchema.extendedSupport}
                            onChange={(val) => updateSchema({ ...eksSchema, extendedSupport: val })}
                        />
                    </FormSection>
                </div>
            </Accordion>

            {/* Node Groups */}
            <Accordion title={`Node Groups (${eksSchema.nodeGroups.length})`} defaultOpen={true}>
                <div className="space-y-4">
                    {eksSchema.nodeGroups.map((ng, index) => (
                        <NodeGroupCard
                            key={ng.id}
                            nodeGroup={ng}
                            cost={nodeGroupCosts[index]}
                            onEdit={() => editNodeGroup(index)}
                            onDelete={() => deleteNodeGroup(index)}
                            onDuplicate={() => duplicateNodeGroup(index)}
                        />
                    ))}

                    <button
                        onClick={addNodeGroup}
                        className="w-full px-4 py-3 text-sm font-medium text-aws-link hover:bg-aws-link hover:text-white border-2 border-dashed border-aws-link rounded-lg transition-colors"
                    >
                        + Add Node Group
                    </button>
                </div>
            </Accordion>

            {/* Fargate Profiles */}
            <Accordion title={`Fargate Profiles (${eksSchema.fargateProfiles.length})`} defaultOpen={false}>
                <div className="space-y-4">
                    {eksSchema.fargateProfiles.map((fp, index) => (
                        <FargateProfileCard
                            key={fp.id}
                            profile={fp}
                            cost={fargateProfileCosts[index]}
                            onEdit={() => editFargateProfile(index)}
                            onDelete={() => deleteFargateProfile(index)}
                            onDuplicate={() => duplicateFargateProfile(index)}
                        />
                    ))}

                    <button
                        onClick={addFargateProfile}
                        className="w-full px-4 py-3 text-sm font-medium text-aws-link hover:bg-aws-link hover:text-white border-2 border-dashed border-aws-link rounded-lg transition-colors"
                    >
                        + Add Fargate Profile
                    </button>
                </div>
            </Accordion>

            {/* Node Group Editor Modal */}
            {editingNodeGroup && (
                <NodeGroupEditor
                    nodeGroup={editingNodeGroup.nodeGroup}
                    onChange={(ng) => setEditingNodeGroup({ ...editingNodeGroup, nodeGroup: ng })}
                    onSave={saveNodeGroup}
                    onCancel={() => setEditingNodeGroup(null)}
                />
            )}

            {/* Fargate Profile Editor Modal */}
            {editingFargateProfile && (
                <FargateProfileEditor
                    profile={editingFargateProfile.profile}
                    onChange={(fp) => setEditingFargateProfile({ ...editingFargateProfile, profile: fp })}
                    onSave={saveFargateProfile}
                    onCancel={() => setEditingFargateProfile(null)}
                />
            )}
        </div>
    );
};

/**
 * EKS Usage Configuration Component (V2)
 */
export const EKSUsageConfigV2: React.FC<EKSModuleProps> = ({ config, onUpdate }) => {
    return (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center text-sm text-gray-500">
            <p>EKS costs are primarily driven by cluster uptime and compute resource allocation (Node Groups/Fargate) configured in the Architecture tab.</p>
            <p className="mt-2">Data transfer costs for EKS are typically covered under the VPC or Load Balancer resources.</p>
        </div>
    );
};
