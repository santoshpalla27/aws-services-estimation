import { InstanceType, EbsVolumeType } from '@/types';

/**
 * EKS Cluster Schema - Complete hierarchical structure
 */
export interface EKSClusterSchema {
    id: string;
    name: string;
    version: string;
    region: string;

    // Repeatable resources (EXPLICIT ARRAYS)
    nodeGroups: EKSNodeGroup[];
    fargateProfiles: EKSFargateProfile[];

    // Configuration
    extendedSupport: boolean;

    // Metadata
    tags: Record<string, string>;
    createdAt: string;
}

/**
 * EKS Node Group - Managed EC2 instances for Kubernetes
 */
export interface EKSNodeGroup {
    id: string;
    name: string;

    // Compute
    instanceType: InstanceType;
    capacityType: 'ON_DEMAND' | 'SPOT';

    // Scaling
    minSize: number;
    desiredSize: number;
    maxSize: number;

    // Storage
    diskSize: number; // GB
    diskType: EbsVolumeType;

    // Networking
    subnetIds: string[]; // References to VPC subnets
    availabilityZones: string[];

    // Metadata (cost-neutral, for organization only)
    labels: Record<string, string>;
    taints: NodeTaint[];
}

/**
 * EKS Fargate Profile - Serverless compute for Kubernetes
 */
export interface EKSFargateProfile {
    id: string;
    name: string;

    // Selectors (determine which pods run on Fargate)
    namespaceSelectors: string[];
    labelSelectors: Record<string, string>[];

    // Networking
    subnetIds: string[];

    // Estimated usage (for cost calculation)
    estimatedPods: number;
    avgCpuPerPod: number; // vCPU
    avgMemoryPerPod: number; // GB
    avgRunningHours: number; // per month
}

/**
 * Kubernetes Node Taint (cost-neutral metadata)
 */
export interface NodeTaint {
    key: string;
    value: string;
    effect: 'NoSchedule' | 'PreferNoSchedule' | 'NoExecute';
}

/**
 * Default EKS cluster configuration
 */
export const DEFAULT_EKS_CLUSTER: EKSClusterSchema = {
    id: '',
    name: 'My K8s Cluster',
    version: '1.28',
    region: 'us-east-1',
    nodeGroups: [],
    fargateProfiles: [],
    extendedSupport: false,
    tags: {},
    createdAt: new Date().toISOString()
};

/**
 * Default EKS node group configuration
 */
export const DEFAULT_EKS_NODE_GROUP: Omit<EKSNodeGroup, 'id'> = {
    name: 'Node Group 1',
    instanceType: InstanceType.T3_MEDIUM,
    capacityType: 'ON_DEMAND',
    minSize: 1,
    desiredSize: 2,
    maxSize: 10,
    diskSize: 20,
    diskType: EbsVolumeType.GP3,
    subnetIds: [],
    availabilityZones: [],
    labels: {},
    taints: []
};

/**
 * Default EKS Fargate profile configuration
 */
export const DEFAULT_EKS_FARGATE_PROFILE: Omit<EKSFargateProfile, 'id'> = {
    name: 'Fargate Profile 1',
    namespaceSelectors: ['default'],
    labelSelectors: [],
    subnetIds: [],
    estimatedPods: 2,
    avgCpuPerPod: 0.5,
    avgMemoryPerPod: 1,
    avgRunningHours: 730
};
