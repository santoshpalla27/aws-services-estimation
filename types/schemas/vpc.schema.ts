import { EbsVolumeType } from '@/types';

/**
 * VPC Schema - Complete hierarchical structure
 */
export interface VPCSchema {
    id: string;
    name: string;
    cidrBlock: string;
    region: string;

    // Repeatable resources
    subnets: VPCSubnet[];
    natGateways: NATGateway[];
    vpcEndpoints: VPCEndpoint[];

    // Single resources
    internetGateway: InternetGateway | null;

    // Configuration
    enableDnsHostnames: boolean;
    enableDnsSupport: boolean;
    instanceTenancy: 'default' | 'dedicated';

    // Flow Logs
    flowLogs: FlowLogsConfig | null;

    // Metadata
    tags: Record<string, string>;
    createdAt: string;
}

/**
 * VPC Subnet - Isolated network segment within VPC
 */
export interface VPCSubnet {
    id: string;
    name: string;
    cidrBlock: string; // Must be within VPC CIDR
    availabilityZone: string;
    type: 'public' | 'private' | 'isolated';
    autoAssignPublicIp: boolean;
    tags: Record<string, string>;
}

/**
 * NAT Gateway - Enables outbound internet for private subnets
 */
export interface NATGateway {
    id: string;
    name: string;
    subnetId: string; // Must be public subnet
    connectivityType: 'public' | 'private';

    // Usage estimation (for cost calculation)
    estimatedDataProcessedGB: number; // per month

    tags: Record<string, string>;
}

/**
 * VPC Endpoint - Private connection to AWS services
 */
export interface VPCEndpoint {
    id: string;
    name: string;
    serviceName: string; // e.g., "com.amazonaws.us-east-1.s3"
    type: 'Gateway' | 'Interface';

    // For Interface endpoints (billable)
    subnetIds?: string[]; // One per AZ for HA
    securityGroupIds?: string[];
    privateDnsEnabled?: boolean;
    estimatedDataProcessedGB?: number; // per month

    // For Gateway endpoints (free for S3/DynamoDB)
    routeTableIds?: string[];

    tags: Record<string, string>;
}

/**
 * Internet Gateway - Enables internet access for public subnets
 */
export interface InternetGateway {
    id: string;
    name: string;
    tags: Record<string, string>;
}

/**
 * VPC Flow Logs Configuration
 */
export interface FlowLogsConfig {
    enabled: boolean;
    destination: 'cloudwatch' | 's3';
    trafficType: 'ACCEPT' | 'REJECT' | 'ALL';
    estimatedDataIngestedGB: number; // per month
}

/**
 * Default VPC configuration
 */
export const DEFAULT_VPC_SCHEMA: VPCSchema = {
    id: '',
    name: 'Primary VPC',
    cidrBlock: '10.0.0.0/16',
    region: 'us-east-1',
    subnets: [],
    natGateways: [],
    vpcEndpoints: [],
    internetGateway: null,
    enableDnsHostnames: true,
    enableDnsSupport: true,
    instanceTenancy: 'default',
    flowLogs: null,
    tags: {},
    createdAt: new Date().toISOString()
};

/**
 * Default subnet configuration
 */
export const DEFAULT_VPC_SUBNET: Omit<VPCSubnet, 'id'> = {
    name: 'Subnet 1',
    cidrBlock: '10.0.1.0/24',
    availabilityZone: 'us-east-1a',
    type: 'public',
    autoAssignPublicIp: true,
    tags: {}
};

/**
 * Default NAT Gateway configuration
 */
export const DEFAULT_NAT_GATEWAY: Omit<NATGateway, 'id'> = {
    name: 'NAT Gateway 1',
    subnetId: '',
    connectivityType: 'public',
    estimatedDataProcessedGB: 100,
    tags: {}
};

/**
 * Default VPC Endpoint configuration
 */
export const DEFAULT_VPC_ENDPOINT: Omit<VPCEndpoint, 'id'> = {
    name: 'VPC Endpoint 1',
    serviceName: 'com.amazonaws.us-east-1.s3',
    type: 'Gateway',
    routeTableIds: [],
    tags: {}
};

/**
 * Default Internet Gateway configuration
 */
export const DEFAULT_INTERNET_GATEWAY: Omit<InternetGateway, 'id'> = {
    name: 'Internet Gateway',
    tags: {}
};

/**
 * Default Flow Logs configuration
 */
export const DEFAULT_FLOW_LOGS: FlowLogsConfig = {
    enabled: true,
    destination: 'cloudwatch',
    trafficType: 'ALL',
    estimatedDataIngestedGB: 10
};
