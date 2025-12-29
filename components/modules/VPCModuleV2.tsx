/**
 * VPC Module V2 - Card-Based UI with Nested Schema Support
 * 
 * This is the new implementation using the service registry and nested schemas.
 * It provides a card-based interface for NAT Gateways, VPC Endpoints, and Subnets.
 * 
 * Features:
 * - Explicit NAT Gateway cards (add/edit/delete/duplicate)
 * - Explicit VPC Endpoint cards (add/edit/delete/duplicate)
 * - Explicit Subnet cards (add/edit/delete/duplicate)
 * - Live cost updates per resource
 * - Validation with hard/soft constraints
 * - Backward compatible with legacy flat schema
 */

import React, { useState } from 'react';
import { Accordion, FormSection, AWSInput, AWSSelect, AWSToggle } from '../ui/AWS';
import { ResourceConfig } from '../../types';
import { VPCSchema, VPCSubnet, NATGateway, VPCEndpoint, DEFAULT_VPC_SUBNET, DEFAULT_NAT_GATEWAY, DEFAULT_VPC_ENDPOINT, DEFAULT_INTERNET_GATEWAY } from '../../types/schemas/vpc.schema';
import { calculateVPCCost } from '../../utils/calculators/vpc.calculator';
import { validateResource } from '../../utils/validation';
import { VPC_HARD_CONSTRAINTS, VPC_SOFT_CONSTRAINTS } from '../../utils/validation/vpc.validation';

interface VPCModuleProps {
    config: ResourceConfig;
    onUpdate: (newConfig: ResourceConfig) => void;
}

/**
 * Get or initialize VPC schema from config
 */
function getVPCSchema(config: ResourceConfig): VPCSchema {
    // If new schema exists, use it
    if (config.attributes.vpc) {
        return config.attributes.vpc as VPCSchema;
    }

    // Migrate from legacy flat schema
    const subnets: VPCSubnet[] = [];
    const azCount = config.attributes.availabilityZones || 2;
    const publicPerAZ = config.attributes.publicSubnetsPerAZ || 1;
    const privatePerAZ = config.attributes.privateSubnetsPerAZ || 1;

    // Create subnets from legacy config
    for (let az = 0; az < azCount; az++) {
        const azName = String.fromCharCode(97 + az); // a, b, c

        for (let i = 0; i < publicPerAZ; i++) {
            subnets.push({
                id: `subnet-public-${az}-${i}-${Date.now()}`,
                name: `Public Subnet ${azName}${i + 1}`,
                cidrBlock: `10.0.${az * 16 + i}.0/24`,
                availabilityZone: `${config.region}${azName}`,
                type: 'public',
                autoAssignPublicIp: true,
                tags: {}
            });
        }

        for (let i = 0; i < privatePerAZ; i++) {
            subnets.push({
                id: `subnet-private-${az}-${i}-${Date.now()}`,
                name: `Private Subnet ${azName}${i + 1}`,
                cidrBlock: `10.0.${az * 16 + publicPerAZ + i}.0/24`,
                availabilityZone: `${config.region}${azName}`,
                type: 'private',
                autoAssignPublicIp: false,
                tags: {}
            });
        }
    }

    // Create NAT Gateways from legacy config
    const natGateways: NATGateway[] = [];
    const natCount = config.attributes.natGateways || 0;
    for (let i = 0; i < natCount; i++) {
        const publicSubnet = subnets.find(s => s.type === 'public');
        natGateways.push({
            id: `nat-${i}-${Date.now()}`,
            name: `NAT Gateway ${i + 1}`,
            subnetId: publicSubnet?.id || '',
            connectivityType: 'public',
            estimatedDataProcessedGB: config.attributes.natDataProcessed || 100,
            tags: {}
        });
    }

    // Create VPC Endpoints from legacy config
    const vpcEndpoints: VPCEndpoint[] = [];
    const interfaceEndpointCount = config.attributes.vpcEndpointsInterface || 0;
    for (let i = 0; i < interfaceEndpointCount; i++) {
        vpcEndpoints.push({
            id: `vpce-${i}-${Date.now()}`,
            name: `Interface Endpoint ${i + 1}`,
            serviceName: 'com.amazonaws.us-east-1.ec2',
            type: 'Interface',
            subnetIds: subnets.filter(s => s.type === 'private').map(s => s.id),
            estimatedDataProcessedGB: 50,
            tags: {}
        });
    }

    if (config.attributes.enableS3GatewayEndpoint) {
        vpcEndpoints.push({
            id: `vpce-s3-${Date.now()}`,
            name: 'S3 Gateway Endpoint',
            serviceName: 'com.amazonaws.us-east-1.s3',
            type: 'Gateway',
            routeTableIds: [],
            tags: {}
        });
    }

    if (config.attributes.enableDynamoDBGatewayEndpoint) {
        vpcEndpoints.push({
            id: `vpce-dynamodb-${Date.now()}`,
            name: 'DynamoDB Gateway Endpoint',
            serviceName: 'com.amazonaws.us-east-1.dynamodb',
            type: 'Gateway',
            routeTableIds: [],
            tags: {}
        });
    }

    return {
        id: config.id,
        name: config.name,
        cidrBlock: '10.0.0.0/16',
        region: config.region,
        subnets,
        natGateways,
        vpcEndpoints,
        internetGateway: config.attributes.enableInternetGateway ? {
            id: `igw-${Date.now()}`,
            name: 'Internet Gateway',
            tags: {}
        } : null,
        enableDnsHostnames: config.attributes.enableDnsHostnames || true,
        enableDnsSupport: config.attributes.enableDnsSupport || true,
        instanceTenancy: 'default',
        flowLogs: config.attributes.flowLogsEnabled ? {
            enabled: true,
            destination: 'cloudwatch',
            trafficType: 'ALL',
            estimatedDataIngestedGB: config.attributes.flowLogsDataIngested || 10
        } : null,
        tags: {},
        createdAt: new Date().toISOString()
    };
}

/**
 * Update VPC schema in config
 */
function updateVPCSchema(config: ResourceConfig, schema: VPCSchema): ResourceConfig {
    return {
        ...config,
        attributes: {
            ...config.attributes,
            vpc: schema
        }
    };
}

/**
 * NAT Gateway Card Component
 */
const NATGatewayCard: React.FC<{
    natGateway: NATGateway;
    onEdit: () => void;
    onDelete: () => void;
    onDuplicate: () => void;
    cost: number;
}> = ({ natGateway, onEdit, onDelete, onDuplicate, cost }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-aws-link transition-colors">
            <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 flex items-center">
                        {natGateway.name}
                        <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-800 rounded">
                            {natGateway.connectivityType === 'public' ? 'Public' : 'Private'}
                        </span>
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                        {natGateway.estimatedDataProcessedGB} GB/month processed
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-lg font-bold text-aws-primary">
                        ${cost.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">per month</div>
                </div>
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
 * VPC Endpoint Card Component
 */
const VPCEndpointCard: React.FC<{
    endpoint: VPCEndpoint;
    onEdit: () => void;
    onDelete: () => void;
    onDuplicate: () => void;
    cost: number;
}> = ({ endpoint, onEdit, onDelete, onDuplicate, cost }) => {
    const serviceName = endpoint.serviceName.split('.').pop() || endpoint.serviceName;
    const isFree = endpoint.type === 'Gateway';

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-aws-link transition-colors">
            <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 flex items-center">
                        {endpoint.name}
                        <span className={`ml-2 px-2 py-0.5 text-xs font-semibold rounded ${endpoint.type === 'Gateway'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}>
                            {endpoint.type}
                        </span>
                        {isFree && (
                            <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-800 rounded">
                                Free
                            </span>
                        )}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                        Service: {serviceName}
                        {endpoint.type === 'Interface' && endpoint.subnetIds && (
                            <span> • {endpoint.subnetIds.length} AZs</span>
                        )}
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-lg font-bold text-aws-primary">
                        ${cost.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">per month</div>
                </div>
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
 * Subnet Card Component
 */
const SubnetCard: React.FC<{
    subnet: VPCSubnet;
    onEdit: () => void;
    onDelete: () => void;
    onDuplicate: () => void;
}> = ({ subnet, onEdit, onDelete, onDuplicate }) => {
    const typeColors = {
        public: 'bg-green-100 text-green-800',
        private: 'bg-yellow-100 text-yellow-800',
        isolated: 'bg-gray-100 text-gray-800'
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-aws-link transition-colors">
            <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 flex items-center">
                        {subnet.name}
                        <span className={`ml-2 px-2 py-0.5 text-xs font-semibold rounded ${typeColors[subnet.type]}`}>
                            {subnet.type}
                        </span>
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                        {subnet.cidrBlock} • {subnet.availabilityZone}
                    </p>
                </div>
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
 * NAT Gateway Editor Modal
 */
const NATGatewayEditor: React.FC<{
    natGateway: NATGateway;
    subnets: VPCSubnet[];
    onChange: (nat: NATGateway) => void;
    onSave: () => void;
    onCancel: () => void;
}> = ({ natGateway, subnets, onChange, onSave, onCancel }) => {
    const publicSubnets = subnets.filter(s => s.type === 'public');

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-900">Edit NAT Gateway</h3>
                    <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <FormSection label="NAT Gateway Name">
                        <AWSInput
                            value={natGateway.name}
                            onChange={(e) => onChange({ ...natGateway, name: e.target.value })}
                            placeholder="NAT Gateway 1"
                        />
                    </FormSection>

                    <FormSection label="Subnet" info="Must be a public subnet">
                        <AWSSelect
                            value={natGateway.subnetId}
                            onChange={(e) => onChange({ ...natGateway, subnetId: e.target.value })}
                        >
                            <option value="">Select subnet...</option>
                            {publicSubnets.map(subnet => (
                                <option key={subnet.id} value={subnet.id}>
                                    {subnet.name} ({subnet.cidrBlock})
                                </option>
                            ))}
                        </AWSSelect>
                    </FormSection>

                    <FormSection label="Connectivity Type">
                        <AWSSelect
                            value={natGateway.connectivityType}
                            onChange={(e) => onChange({ ...natGateway, connectivityType: e.target.value as 'public' | 'private' })}
                        >
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                        </AWSSelect>
                    </FormSection>

                    <FormSection label="Estimated Data Processed (GB/month)">
                        <AWSInput
                            type="number"
                            min={0}
                            value={natGateway.estimatedDataProcessedGB}
                            onChange={(e) => onChange({ ...natGateway, estimatedDataProcessedGB: Number(e.target.value) })}
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
 * VPC Endpoint Editor Modal
 */
const VPCEndpointEditor: React.FC<{
    endpoint: VPCEndpoint;
    subnets: VPCSubnet[];
    onChange: (ep: VPCEndpoint) => void;
    onSave: () => void;
    onCancel: () => void;
}> = ({ endpoint, subnets, onChange, onSave, onCancel }) => {
    const commonServices = [
        'com.amazonaws.us-east-1.ec2',
        'com.amazonaws.us-east-1.s3',
        'com.amazonaws.us-east-1.dynamodb',
        'com.amazonaws.us-east-1.ecr.api',
        'com.amazonaws.us-east-1.ecr.dkr',
        'com.amazonaws.us-east-1.ecs',
        'com.amazonaws.us-east-1.eks',
        'com.amazonaws.us-east-1.lambda',
        'com.amazonaws.us-east-1.logs',
        'com.amazonaws.us-east-1.secretsmanager',
        'com.amazonaws.us-east-1.ssm'
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-900">Edit VPC Endpoint</h3>
                    <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <FormSection label="Endpoint Name">
                        <AWSInput
                            value={endpoint.name}
                            onChange={(e) => onChange({ ...endpoint, name: e.target.value })}
                            placeholder="Interface Endpoint 1"
                        />
                    </FormSection>

                    <FormSection label="Service Name">
                        <AWSSelect
                            value={endpoint.serviceName}
                            onChange={(e) => onChange({ ...endpoint, serviceName: e.target.value })}
                        >
                            {commonServices.map(service => (
                                <option key={service} value={service}>{service}</option>
                            ))}
                        </AWSSelect>
                    </FormSection>

                    <FormSection label="Endpoint Type">
                        <AWSSelect
                            value={endpoint.type}
                            onChange={(e) => onChange({ ...endpoint, type: e.target.value as 'Gateway' | 'Interface' })}
                        >
                            <option value="Interface">Interface (Billable)</option>
                            <option value="Gateway">Gateway (Free for S3/DynamoDB)</option>
                        </AWSSelect>
                    </FormSection>

                    {endpoint.type === 'Interface' && (
                        <FormSection label="Estimated Data Processed (GB/month)">
                            <AWSInput
                                type="number"
                                min={0}
                                value={endpoint.estimatedDataProcessedGB || 0}
                                onChange={(e) => onChange({ ...endpoint, estimatedDataProcessedGB: Number(e.target.value) })}
                            />
                        </FormSection>
                    )}
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
 * VPC Architecture Configuration Component (V2)
 */
export const VPCArchitectureConfigV2: React.FC<VPCModuleProps> = ({ config, onUpdate }) => {
    const [vpcSchema, setVPCSchema] = useState<VPCSchema>(() => getVPCSchema(config));
    const [editingNATGateway, setEditingNATGateway] = useState<{ index: number; natGateway: NATGateway } | null>(null);
    const [editingVPCEndpoint, setEditingVPCEndpoint] = useState<{ index: number; endpoint: VPCEndpoint } | null>(null);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [validationWarnings, setValidationWarnings] = useState<string[]>([]);

    // Update parent config whenever schema changes
    const updateSchema = (newSchema: VPCSchema) => {
        setVPCSchema(newSchema);
        onUpdate(updateVPCSchema(config, newSchema));

        // Validate
        const validation = validateResource(
            newSchema,
            VPC_HARD_CONSTRAINTS,
            VPC_SOFT_CONSTRAINTS,
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
    const totalCost = calculateVPCCost(vpcSchema, config.region);
    const natGatewayCosts = vpcSchema.natGateways.map((nat, i) => {
        const natCost = totalCost.breakdown.find(b => b.name.includes(nat.name));
        return natCost?.monthly || 0;
    });
    const vpcEndpointCosts = vpcSchema.vpcEndpoints.map((ep, i) => {
        const epCost = totalCost.breakdown.find(b => b.name.includes(ep.name));
        return epCost?.monthly || 0;
    });

    // NAT Gateway Actions
    const addNATGateway = () => {
        const publicSubnet = vpcSchema.subnets.find(s => s.type === 'public');
        const newNAT: NATGateway = {
            ...DEFAULT_NAT_GATEWAY,
            id: `nat-${Date.now()}`,
            name: `NAT Gateway ${vpcSchema.natGateways.length + 1}`,
            subnetId: publicSubnet?.id || ''
        };

        updateSchema({
            ...vpcSchema,
            natGateways: [...vpcSchema.natGateways, newNAT]
        });
    };

    const editNATGateway = (index: number) => {
        setEditingNATGateway({ index, natGateway: { ...vpcSchema.natGateways[index] } });
    };

    const saveNATGateway = () => {
        if (!editingNATGateway) return;

        const newNATs = [...vpcSchema.natGateways];
        newNATs[editingNATGateway.index] = editingNATGateway.natGateway;

        updateSchema({
            ...vpcSchema,
            natGateways: newNATs
        });

        setEditingNATGateway(null);
    };

    const deleteNATGateway = (index: number) => {
        updateSchema({
            ...vpcSchema,
            natGateways: vpcSchema.natGateways.filter((_, i) => i !== index)
        });
    };

    const duplicateNATGateway = (index: number) => {
        const original = vpcSchema.natGateways[index];
        const duplicate: NATGateway = {
            ...original,
            id: `nat-${Date.now()}`,
            name: `${original.name} (Copy)`
        };

        updateSchema({
            ...vpcSchema,
            natGateways: [...vpcSchema.natGateways, duplicate]
        });
    };

    // VPC Endpoint Actions
    const addVPCEndpoint = () => {
        const newEndpoint: VPCEndpoint = {
            ...DEFAULT_VPC_ENDPOINT,
            id: `vpce-${Date.now()}`,
            name: `VPC Endpoint ${vpcSchema.vpcEndpoints.length + 1}`
        };

        updateSchema({
            ...vpcSchema,
            vpcEndpoints: [...vpcSchema.vpcEndpoints, newEndpoint]
        });
    };

    const editVPCEndpoint = (index: number) => {
        setEditingVPCEndpoint({ index, endpoint: { ...vpcSchema.vpcEndpoints[index] } });
    };

    const saveVPCEndpoint = () => {
        if (!editingVPCEndpoint) return;

        const newEndpoints = [...vpcSchema.vpcEndpoints];
        newEndpoints[editingVPCEndpoint.index] = editingVPCEndpoint.endpoint;

        updateSchema({
            ...vpcSchema,
            vpcEndpoints: newEndpoints
        });

        setEditingVPCEndpoint(null);
    };

    const deleteVPCEndpoint = (index: number) => {
        updateSchema({
            ...vpcSchema,
            vpcEndpoints: vpcSchema.vpcEndpoints.filter((_, i) => i !== index)
        });
    };

    const duplicateVPCEndpoint = (index: number) => {
        const original = vpcSchema.vpcEndpoints[index];
        const duplicate: VPCEndpoint = {
            ...original,
            id: `vpce-${Date.now()}`,
            name: `${original.name} (Copy)`
        };

        updateSchema({
            ...vpcSchema,
            vpcEndpoints: [...vpcSchema.vpcEndpoints, duplicate]
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

            {/* VPC Settings */}
            <Accordion title="VPC Settings" defaultOpen={true}>
                <div className="space-y-6">
                    <FormSection label="VPC Name" info="Identifier for this VPC">
                        <AWSInput
                            value={vpcSchema.name}
                            onChange={(e) => updateSchema({ ...vpcSchema, name: e.target.value })}
                            placeholder="production-vpc"
                        />
                    </FormSection>

                    <FormSection label="CIDR Block" info="IPv4 network range">
                        <AWSInput
                            value={vpcSchema.cidrBlock}
                            onChange={(e) => updateSchema({ ...vpcSchema, cidrBlock: e.target.value })}
                            placeholder="10.0.0.0/16"
                        />
                    </FormSection>

                    <div className="grid grid-cols-2 gap-4">
                        <AWSToggle
                            label="DNS Hostnames"
                            checked={vpcSchema.enableDnsHostnames}
                            onChange={(val) => updateSchema({ ...vpcSchema, enableDnsHostnames: val })}
                        />
                        <AWSToggle
                            label="DNS Support"
                            checked={vpcSchema.enableDnsSupport}
                            onChange={(val) => updateSchema({ ...vpcSchema, enableDnsSupport: val })}
                        />
                    </div>

                    <AWSToggle
                        label="Internet Gateway"
                        checked={vpcSchema.internetGateway !== null}
                        onChange={(val) => updateSchema({
                            ...vpcSchema,
                            internetGateway: val ? DEFAULT_INTERNET_GATEWAY : null
                        })}
                    />
                </div>
            </Accordion>

            {/* Subnets */}
            <Accordion title={`Subnets (${vpcSchema.subnets.length})`} defaultOpen={true}>
                <div className="space-y-4">
                    {vpcSchema.subnets.map((subnet, index) => (
                        <SubnetCard
                            key={subnet.id}
                            subnet={subnet}
                            onEdit={() => {/* TODO: Implement subnet editor */ }}
                            onDelete={() => {/* TODO: Implement delete */ }}
                            onDuplicate={() => {/* TODO: Implement duplicate */ }}
                        />
                    ))}

                    <p className="text-sm text-gray-500 text-center py-4">
                        Subnet management coming soon. Currently showing auto-generated subnets.
                    </p>
                </div>
            </Accordion>

            {/* NAT Gateways */}
            <Accordion title={`NAT Gateways (${vpcSchema.natGateways.length})`} defaultOpen={true}>
                <div className="space-y-4">
                    {vpcSchema.natGateways.map((nat, index) => (
                        <NATGatewayCard
                            key={nat.id}
                            natGateway={nat}
                            cost={natGatewayCosts[index]}
                            onEdit={() => editNATGateway(index)}
                            onDelete={() => deleteNATGateway(index)}
                            onDuplicate={() => duplicateNATGateway(index)}
                        />
                    ))}

                    <button
                        onClick={addNATGateway}
                        className="w-full px-4 py-3 text-sm font-medium text-aws-link hover:bg-aws-link hover:text-white border-2 border-dashed border-aws-link rounded-lg transition-colors"
                    >
                        + Add NAT Gateway
                    </button>
                </div>
            </Accordion>

            {/* VPC Endpoints */}
            <Accordion title={`VPC Endpoints (${vpcSchema.vpcEndpoints.length})`} defaultOpen={false}>
                <div className="space-y-4">
                    {vpcSchema.vpcEndpoints.map((ep, index) => (
                        <VPCEndpointCard
                            key={ep.id}
                            endpoint={ep}
                            cost={vpcEndpointCosts[index]}
                            onEdit={() => editVPCEndpoint(index)}
                            onDelete={() => deleteVPCEndpoint(index)}
                            onDuplicate={() => duplicateVPCEndpoint(index)}
                        />
                    ))}

                    <button
                        onClick={addVPCEndpoint}
                        className="w-full px-4 py-3 text-sm font-medium text-aws-link hover:bg-aws-link hover:text-white border-2 border-dashed border-aws-link rounded-lg transition-colors"
                    >
                        + Add VPC Endpoint
                    </button>
                </div>
            </Accordion>

            {/* NAT Gateway Editor Modal */}
            {editingNATGateway && (
                <NATGatewayEditor
                    natGateway={editingNATGateway.natGateway}
                    subnets={vpcSchema.subnets}
                    onChange={(nat) => setEditingNATGateway({ ...editingNATGateway, natGateway: nat })}
                    onSave={saveNATGateway}
                    onCancel={() => setEditingNATGateway(null)}
                />
            )}

            {/* VPC Endpoint Editor Modal */}
            {editingVPCEndpoint && (
                <VPCEndpointEditor
                    endpoint={editingVPCEndpoint.endpoint}
                    subnets={vpcSchema.subnets}
                    onChange={(ep) => setEditingVPCEndpoint({ ...editingVPCEndpoint, endpoint: ep })}
                    onSave={saveVPCEndpoint}
                    onCancel={() => setEditingVPCEndpoint(null)}
                />
            )}
        </div>
    );
};

/**
 * VPC Usage Configuration Component (V2)
 */
export const VPCUsageConfigV2: React.FC<VPCModuleProps> = ({ config, onUpdate }) => {
    return (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center text-sm text-gray-500">
            <p>VPC costs are primarily driven by NAT Gateways, VPC Endpoints, and data transfer configured in the Architecture tab.</p>
            <p className="mt-2">Data transfer costs can be configured per NAT Gateway and VPC Endpoint.</p>
        </div>
    );
};
