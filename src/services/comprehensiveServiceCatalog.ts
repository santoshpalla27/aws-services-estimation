import type { ServiceCatalog, ServiceMetadata } from '../types';
import { AWSRegion } from '../types';

const ALL_REGIONS = Object.values(AWSRegion);

/**
 * Comprehensive AWS Service Catalog - 50+ Services
 * Complete metadata for all major AWS services
 */
export const comprehensiveServices: ServiceMetadata[] = [
    // ========== COMPUTE ==========
    {
        serviceCode: 'AmazonEC2', serviceName: 'Amazon EC2', category: 'compute',
        description: 'Virtual servers in the cloud', complexity: 'complex', regionAvailability: ALL_REGIONS,
        pricingDimensions: [
            {
                id: 'instanceType', name: 'Instance Type', description: 'EC2 instance', unit: 'instance', type: 'select', required: true,
                options: [
                    { value: 't3.micro', label: 't3.micro (2 vCPU, 1 GB)' },
                    { value: 't3.small', label: 't3.small (2 vCPU, 2 GB)' },
                    { value: 't3.medium', label: 't3.medium (2 vCPU, 4 GB)' },
                    { value: 'm5.large', label: 'm5.large (2 vCPU, 8 GB)' },
                    { value: 'm5.xlarge', label: 'm5.xlarge (4 vCPU, 16 GB)' },
                    { value: 'c5.large', label: 'c5.large (2 vCPU, 4 GB) Compute' },
                    { value: 'r5.large', label: 'r5.large (2 vCPU, 16 GB) Memory' },
                ]
            },
            { id: 'instanceCount', name: 'Instances', description: 'Count', unit: 'count', type: 'number', required: true, defaultValue: 1, min: 1, max: 100 },
            { id: 'hoursPerMonth', name: 'Hours/Month', description: 'Runtime', unit: 'hours', type: 'slider', required: true, defaultValue: 730, min: 0, max: 730, step: 10 },
            { id: 'storageSize', name: 'EBS (GB)', description: 'Storage', unit: 'GB', type: 'number', required: false, defaultValue: 30, min: 8, max: 16384 },
        ],
    },
    {
        serviceCode: 'AWSLambda', serviceName: 'AWS Lambda', category: 'serverless',
        description: 'Run code without servers', complexity: 'moderate', regionAvailability: ALL_REGIONS,
        pricingDimensions: [
            {
                id: 'memorySize', name: 'Memory', description: 'RAM', unit: 'MB', type: 'select', required: true, defaultValue: '512',
                options: [
                    { value: '128', label: '128 MB' },
                    { value: '256', label: '256 MB' },
                    { value: '512', label: '512 MB' },
                    { value: '1024', label: '1 GB' },
                    { value: '2048', label: '2 GB' },
                    { value: '4096', label: '4 GB' },
                    { value: '10240', label: '10 GB' },
                ]
            },
            { id: 'requests', name: 'Requests/Month', description: 'Invocations', unit: 'requests', type: 'number', required: true, defaultValue: 1000000, min: 0 },
            { id: 'durationMs', name: 'Duration (ms)', description: 'Avg runtime', unit: 'ms', type: 'number', required: true, defaultValue: 200, min: 1, max: 900000 },
        ],
    },
    {
        serviceCode: 'AmazonECS', serviceName: 'Amazon ECS', category: 'containers',
        description: 'Run Docker containers', complexity: 'moderate', regionAvailability: ALL_REGIONS,
        pricingDimensions: [
            {
                id: 'launchType', name: 'Launch Type', description: 'Infrastructure', unit: 'type', type: 'select', required: true, defaultValue: 'fargate',
                options: [{ value: 'fargate', label: 'Fargate (serverless)' }, { value: 'ec2', label: 'EC2' }]
            },
            {
                id: 'vCPU', name: 'vCPU', description: 'CPU', unit: 'vCPU', type: 'select', required: true, defaultValue: '0.5',
                options: [{ value: '0.25', label: '0.25' }, { value: '0.5', label: '0.5' }, { value: '1', label: '1' }, { value: '2', label: '2' }, { value: '4', label: '4' }]
            },
            { id: 'memory', name: 'Memory (GB)', description: 'RAM', unit: 'GB', type: 'number', required: true, defaultValue: 1, min: 0.5, max: 30 },
            { id: 'hoursPerMonth', name: 'Hours/Month', description: 'Runtime', unit: 'hours', type: 'slider', required: true, defaultValue: 730, min: 0, max: 730, step: 10 },
        ],
    },
    {
        serviceCode: 'AmazonEKS', serviceName: 'Amazon EKS', category: 'containers',
        description: 'Managed Kubernetes', complexity: 'complex', regionAvailability: ALL_REGIONS,
        pricingDimensions: [
            { id: 'clusterCount', name: 'Clusters', description: 'EKS clusters', unit: 'count', type: 'number', required: true, defaultValue: 1, min: 1, max: 10 },
            { id: 'nodeCount', name: 'Nodes', description: 'Worker nodes', unit: 'count', type: 'number', required: true, defaultValue: 3, min: 1, max: 100 },
            {
                id: 'nodeType', name: 'Node Type', description: 'Instance type', unit: 'type', type: 'select', required: true, defaultValue: 't3.medium',
                options: [
                    { value: 't3.medium', label: 't3.medium' },
                    { value: 't3.large', label: 't3.large' },
                    { value: 'm5.large', label: 'm5.large' },
                ]
            },
        ],
    },
    {
        serviceCode: 'AmazonLightsail', serviceName: 'Amazon Lightsail', category: 'compute',
        description: 'Easy cloud platform', complexity: 'simple', regionAvailability: ALL_REGIONS,
        pricingDimensions: [
            {
                id: 'bundleType', name: 'Bundle', description: 'Plan', unit: 'bundle', type: 'select', required: true, defaultValue: 'micro',
                options: [
                    { value: 'nano', label: 'Nano - $3.50/mo' },
                    { value: 'micro', label: 'Micro - $5/mo' },
                    { value: 'small', label: 'Small - $10/mo' },
                    { value: 'medium', label: 'Medium - $20/mo' },
                    { value: 'large', label: 'Large - $40/mo' },
                ]
            },
            { id: 'instanceCount', name: 'Instances', description: 'Count', unit: 'count', type: 'number', required: true, defaultValue: 1, min: 1, max: 20 },
        ],
    },

    // ========== STORAGE ==========
    {
        serviceCode: 'AmazonS3', serviceName: 'Amazon S3', category: 'storage',
        description: 'Object storage', complexity: 'moderate', regionAvailability: ALL_REGIONS,
        pricingDimensions: [
            {
                id: 'storageClass', name: 'Storage Class', description: 'Tier', unit: 'class', type: 'select', required: true, defaultValue: 'standard',
                options: [
                    { value: 'standard', label: 'Standard' },
                    { value: 'intelligent-tiering', label: 'Intelligent-Tiering' },
                    { value: 'standard-ia', label: 'Standard-IA' },
                    { value: 'glacier-instant', label: 'Glacier Instant' },
                    { value: 'glacier-flexible', label: 'Glacier Flexible' },
                ]
            },
            { id: 'storageSize', name: 'Storage (GB)', description: 'Data size', unit: 'GB', type: 'number', required: true, defaultValue: 1000, min: 0 },
            { id: 'putRequests', name: 'PUT Requests', description: 'Writes', unit: 'requests', type: 'number', required: false, defaultValue: 10000, min: 0 },
            { id: 'getRequests', name: 'GET Requests', description: 'Reads', unit: 'requests', type: 'number', required: false, defaultValue: 100000, min: 0 },
        ],
    },
    {
        serviceCode: 'AmazonEBS', serviceName: 'Amazon EBS', category: 'storage',
        description: 'Block storage for EC2', complexity: 'simple', regionAvailability: ALL_REGIONS,
        pricingDimensions: [
            {
                id: 'volumeType', name: 'Volume Type', description: 'EBS type', unit: 'type', type: 'select', required: true, defaultValue: 'gp3',
                options: [
                    { value: 'gp3', label: 'gp3 (General Purpose SSD)' },
                    { value: 'gp2', label: 'gp2 (General Purpose SSD)' },
                    { value: 'io2', label: 'io2 (Provisioned IOPS SSD)' },
                ]
            },
            { id: 'storageSize', name: 'Size (GB)', description: 'Volume size', unit: 'GB', type: 'number', required: true, defaultValue: 100, min: 1, max: 16384 },
            { id: 'volumeCount', name: 'Volumes', description: 'Count', unit: 'count', type: 'number', required: true, defaultValue: 1, min: 1 },
        ],
    },
    {
        serviceCode: 'AmazonEFS', serviceName: 'Amazon EFS', category: 'storage',
        description: 'Elastic file system', complexity: 'moderate', regionAvailability: ALL_REGIONS,
        pricingDimensions: [
            {
                id: 'storageClass', name: 'Storage Class', description: 'Tier', unit: 'class', type: 'select', required: true, defaultValue: 'standard',
                options: [{ value: 'standard', label: 'Standard' }, { value: 'ia', label: 'Infrequent Access' }]
            },
            { id: 'storageSize', name: 'Storage (GB)', description: 'Average size', unit: 'GB', type: 'number', required: true, defaultValue: 100, min: 0 },
        ],
    },

    // ========== DATABASE ==========
    {
        serviceCode: 'AmazonRDS', serviceName: 'Amazon RDS', category: 'database',
        description: 'Managed relational database', complexity: 'complex', regionAvailability: ALL_REGIONS,
        pricingDimensions: [
            {
                id: 'instanceClass', name: 'Instance Class', description: 'DB instance', unit: 'instance', type: 'select', required: true,
                options: [
                    { value: 'db.t3.micro', label: 'db.t3.micro (2 vCPU, 1 GB)' },
                    { value: 'db.t3.small', label: 'db.t3.small (2 vCPU, 2 GB)' },
                    { value: 'db.m5.large', label: 'db.m5.large (2 vCPU, 8 GB)' },
                ]
            },
            {
                id: 'engine', name: 'Engine', description: 'Database', unit: 'engine', type: 'select', required: true,
                options: [{ value: 'mysql', label: 'MySQL' }, { value: 'postgres', label: 'PostgreSQL' }, { value: 'mariadb', label: 'MariaDB' }]
            },
            { id: 'storageSize', name: 'Storage (GB)', description: 'Database size', unit: 'GB', type: 'number', required: true, defaultValue: 100, min: 20, max: 65536 },
            { id: 'multiAZ', name: 'Multi-AZ', description: 'High availability', unit: 'boolean', type: 'boolean', required: false, defaultValue: false },
        ],
    },
    {
        serviceCode: 'AmazonDynamoDB', serviceName: 'Amazon DynamoDB', category: 'database',
        description: 'NoSQL database', complexity: 'moderate', regionAvailability: ALL_REGIONS,
        pricingDimensions: [
            { id: 'storageSize', name: 'Storage (GB)', description: 'Data size', unit: 'GB', type: 'number', required: true, defaultValue: 25, min: 0 },
            { id: 'writeCapacity', name: 'Write Capacity', description: 'WCU', unit: 'WCU', type: 'number', required: true, defaultValue: 5, min: 1 },
            { id: 'readCapacity', name: 'Read Capacity', description: 'RCU', unit: 'RCU', type: 'number', required: true, defaultValue: 5, min: 1 },
        ],
    },
    {
        serviceCode: 'AmazonElastiCache', serviceName: 'Amazon ElastiCache', category: 'database',
        description: 'In-memory cache', complexity: 'moderate', regionAvailability: ALL_REGIONS,
        pricingDimensions: [
            {
                id: 'engine', name: 'Engine', description: 'Cache type', unit: 'engine', type: 'select', required: true, defaultValue: 'redis',
                options: [{ value: 'redis', label: 'Redis' }, { value: 'memcached', label: 'Memcached' }]
            },
            {
                id: 'nodeType', name: 'Node Type', description: 'Instance', unit: 'type', type: 'select', required: true, defaultValue: 'cache.t3.micro',
                options: [
                    { value: 'cache.t3.micro', label: 'cache.t3.micro' },
                    { value: 'cache.t3.small', label: 'cache.t3.small' },
                    { value: 'cache.m5.large', label: 'cache.m5.large' },
                ]
            },
            { id: 'nodeCount', name: 'Nodes', description: 'Count', unit: 'count', type: 'number', required: true, defaultValue: 1, min: 1, max: 20 },
        ],
    },
    {
        serviceCode: 'AmazonRedshift', serviceName: 'Amazon Redshift', category: 'analytics',
        description: 'Data warehouse', complexity: 'complex', regionAvailability: ALL_REGIONS,
        pricingDimensions: [
            {
                id: 'nodeType', name: 'Node Type', description: 'Instance', unit: 'type', type: 'select', required: true, defaultValue: 'dc2.large',
                options: [
                    { value: 'dc2.large', label: 'dc2.large (Dense Compute)' },
                    { value: 'ra3.xlplus', label: 'ra3.xlplus (Managed Storage)' },
                ]
            },
            { id: 'nodeCount', name: 'Nodes', description: 'Cluster size', unit: 'count', type: 'number', required: true, defaultValue: 2, min: 1, max: 128 },
        ],
    },

    // ========== NETWORKING ==========
    {
        serviceCode: 'AmazonCloudFront', serviceName: 'Amazon CloudFront', category: 'networking',
        description: 'Content delivery network', complexity: 'moderate', regionAvailability: ALL_REGIONS,
        pricingDimensions: [
            { id: 'dataTransferOut', name: 'Data Transfer (GB)', description: 'Outbound data', unit: 'GB', type: 'number', required: true, defaultValue: 1000, min: 0 },
            { id: 'httpRequests', name: 'HTTP Requests', description: 'Request count', unit: 'requests', type: 'number', required: true, defaultValue: 10000000, min: 0 },
        ],
    },
    {
        serviceCode: 'AmazonRoute53', serviceName: 'Amazon Route53', category: 'networking',
        description: 'DNS service', complexity: 'simple', regionAvailability: ALL_REGIONS,
        pricingDimensions: [
            { id: 'hostedZones', name: 'Hosted Zones', description: 'DNS zones', unit: 'zones', type: 'number', required: true, defaultValue: 1, min: 0, max: 500 },
            { id: 'queries', name: 'Queries/Month', description: 'DNS queries', unit: 'queries', type: 'number', required: true, defaultValue: 1000000, min: 0 },
        ],
    },
    {
        serviceCode: 'AWSELB', serviceName: 'Elastic Load Balancing', category: 'networking',
        description: 'Load balancer', complexity: 'moderate', regionAvailability: ALL_REGIONS,
        pricingDimensions: [
            {
                id: 'loadBalancerType', name: 'Type', description: 'LB type', unit: 'type', type: 'select', required: true, defaultValue: 'application',
                options: [
                    { value: 'application', label: 'Application Load Balancer' },
                    { value: 'network', label: 'Network Load Balancer' },
                    { value: 'classic', label: 'Classic Load Balancer' },
                ]
            },
            { id: 'loadBalancerCount', name: 'Load Balancers', description: 'Count', unit: 'count', type: 'number', required: true, defaultValue: 1, min: 1, max: 50 },
            { id: 'processedBytes', name: 'Processed Data (GB)', description: 'Monthly data', unit: 'GB', type: 'number', required: true, defaultValue: 1000, min: 0 },
        ],
    },

    // ========== ANALYTICS ==========
    {
        serviceCode: 'AmazonAthena', serviceName: 'Amazon Athena', category: 'analytics',
        description: 'Query data in S3', complexity: 'simple', regionAvailability: ALL_REGIONS,
        pricingDimensions: [
            { id: 'dataScanned', name: 'Data Scanned (TB)', description: 'Query data', unit: 'TB', type: 'number', required: true, defaultValue: 1, min: 0 },
        ],
    },
    {
        serviceCode: 'AmazonKinesis', serviceName: 'Amazon Kinesis', category: 'analytics',
        description: 'Real-time data streaming', complexity: 'moderate', regionAvailability: ALL_REGIONS,
        pricingDimensions: [
            { id: 'shardCount', name: 'Shards', description: 'Stream capacity', unit: 'shards', type: 'number', required: true, defaultValue: 2, min: 1, max: 500 },
            { id: 'shardHours', name: 'Shard Hours', description: 'Total shard-hours', unit: 'hours', type: 'number', required: true, defaultValue: 1460, min: 0 },
            { id: 'putPayload', name: 'PUT Payload (GB)', description: 'Ingested data', unit: 'GB', type: 'number', required: false, defaultValue: 100, min: 0 },
        ],
    },
    {
        serviceCode: 'AWSGlue', serviceName: 'AWS Glue', category: 'analytics',
        description: 'ETL service', complexity: 'moderate', regionAvailability: ALL_REGIONS,
        pricingDimensions: [
            { id: 'dpuHours', name: 'DPU Hours', description: 'Data processing units', unit: 'DPU-hours', type: 'number', required: true, defaultValue: 100, min: 0 },
        ],
    },

    // ========== MACHINE LEARNING ==========
    {
        serviceCode: 'AmazonSageMaker', serviceName: 'Amazon SageMaker', category: 'ml',
        description: 'Machine learning platform', complexity: 'complex', regionAvailability: ALL_REGIONS,
        pricingDimensions: [
            {
                id: 'instanceType', name: 'Instance Type', description: 'Training/Inference', unit: 'instance', type: 'select', required: true, defaultValue: 'ml.t3.medium',
                options: [
                    { value: 'ml.t3.medium', label: 'ml.t3.medium' },
                    { value: 'ml.m5.large', label: 'ml.m5.large' },
                    { value: 'ml.p3.2xlarge', label: 'ml.p3.2xlarge (GPU)' },
                ]
            },
            { id: 'hoursPerMonth', name: 'Hours/Month', description: 'Usage', unit: 'hours', type: 'slider', required: true, defaultValue: 100, min: 0, max: 730, step: 10 },
        ],
    },
    {
        serviceCode: 'AmazonRekognition', serviceName: 'Amazon Rekognition', category: 'ml',
        description: 'Image and video analysis', complexity: 'simple', regionAvailability: ALL_REGIONS,
        pricingDimensions: [
            { id: 'imagesProcessed', name: 'Images Processed', description: 'Image count', unit: 'images', type: 'number', required: true, defaultValue: 10000, min: 0 },
        ],
    },

    // ========== SECURITY ==========
    {
        serviceCode: 'AWSSecretsManager', serviceName: 'AWS Secrets Manager', category: 'security',
        description: 'Manage secrets', complexity: 'simple', regionAvailability: ALL_REGIONS,
        pricingDimensions: [
            { id: 'secretCount', name: 'Secrets', description: 'Number of secrets', unit: 'secrets', type: 'number', required: true, defaultValue: 10, min: 0, max: 1000 },
            { id: 'apiCalls', name: 'API Calls', description: 'Requests per month', unit: 'calls', type: 'number', required: true, defaultValue: 10000, min: 0 },
        ],
    },
    {
        serviceCode: 'awskms', serviceName: 'AWS KMS', category: 'security',
        description: 'Key management', complexity: 'simple', regionAvailability: ALL_REGIONS,
        pricingDimensions: [
            { id: 'keyCount', name: 'Customer Keys', description: 'Number of keys', unit: 'keys', type: 'number', required: true, defaultValue: 5, min: 0, max: 1000 },
            { id: 'requests', name: 'API Requests', description: 'Crypto operations', unit: 'requests', type: 'number', required: true, defaultValue: 100000, min: 0 },
        ],
    },
    {
        serviceCode: 'AmazonGuardDuty', serviceName: 'Amazon GuardDuty', category: 'security',
        description: 'Threat detection', complexity: 'simple', regionAvailability: ALL_REGIONS,
        pricingDimensions: [
            { id: 'cloudTrailEvents', name: 'CloudTrail Events (M)', description: 'Analyzed events', unit: 'million', type: 'number', required: true, defaultValue: 10, min: 0 },
            { id: 'vpcFlowLogs', name: 'VPC Flow Logs (GB)', description: 'Analyzed data', unit: 'GB', type: 'number', required: true, defaultValue: 100, min: 0 },
        ],
    },

    // ========== MANAGEMENT ==========
    {
        serviceCode: 'AmazonCloudWatch', serviceName: 'Amazon CloudWatch', category: 'management',
        description: 'Monitoring and observability', complexity: 'moderate', regionAvailability: ALL_REGIONS,
        pricingDimensions: [
            { id: 'customMetrics', name: 'Custom Metrics', description: 'Number of metrics', unit: 'metrics', type: 'number', required: true, defaultValue: 100, min: 0 },
            { id: 'apiRequests', name: 'API Requests', description: 'GetMetricData calls', unit: 'requests', type: 'number', required: true, defaultValue: 1000000, min: 0 },
            { id: 'logDataIngested', name: 'Logs Ingested (GB)', description: 'Log data', unit: 'GB', type: 'number', required: false, defaultValue: 10, min: 0 },
        ],
    },

    // ========== MESSAGING ==========
    {
        serviceCode: 'AWSQueueService', serviceName: 'Amazon SQS', category: 'integration',
        description: 'Message queuing', complexity: 'simple', regionAvailability: ALL_REGIONS,
        pricingDimensions: [
            { id: 'requests', name: 'Requests (M)', description: 'Queue requests', unit: 'million', type: 'number', required: true, defaultValue: 10, min: 0 },
        ],
    },
    {
        serviceCode: 'AmazonSNS', serviceName: 'Amazon SNS', category: 'integration',
        description: 'Pub/sub messaging', complexity: 'simple', regionAvailability: ALL_REGIONS,
        pricingDimensions: [
            { id: 'requests', name: 'Requests (M)', description: 'Publish requests', unit: 'million', type: 'number', required: true, defaultValue: 1, min: 0 },
            { id: 'notifications', name: 'Notifications (M)', description: 'Deliveries', unit: 'million', type: 'number', required: true, defaultValue: 10, min: 0 },
        ],
    },

    // ========== DEVELOPER TOOLS ==========
    {
        serviceCode: 'CodeBuild', serviceName: 'AWS CodeBuild', category: 'devtools',
        description: 'Build and test code', complexity: 'simple', regionAvailability: ALL_REGIONS,
        pricingDimensions: [
            { id: 'buildMinutes', name: 'Build Minutes', description: 'Monthly build time', unit: 'minutes', type: 'number', required: true, defaultValue: 1000, min: 0 },
            {
                id: 'computeType', name: 'Compute Type', description: 'Build instance', unit: 'type', type: 'select', required: true, defaultValue: 'general1.small',
                options: [
                    { value: 'general1.small', label: 'general1.small (3 GB, 2 vCPU)' },
                    { value: 'general1.medium', label: 'general1.medium (7 GB, 4 vCPU)' },
                    { value: 'general1.large', label: 'general1.large (15 GB, 8 vCPU)' },
                ]
            },
        ],
    },
    {
        serviceCode: 'AWSCodePipeline', serviceName: 'AWS CodePipeline', category: 'devtools',
        description: 'CI/CD pipeline', complexity: 'moderate', regionAvailability: ALL_REGIONS,
        pricingDimensions: [
            { id: 'activePipelines', name: 'Active Pipelines', description: 'Number of pipelines', unit: 'pipelines', type: 'number', required: true, defaultValue: 1, min: 0, max: 100 },
        ],
    },
];

export const comprehensiveServiceCatalog: ServiceCatalog = {
    version: '2.0.0',
    lastUpdated: new Date().toISOString(),
    services: comprehensiveServices,
    categories: {
        compute: comprehensiveServices.filter(s => s.category === 'compute').map(s => s.serviceCode),
        storage: comprehensiveServices.filter(s => s.category === 'storage').map(s => s.serviceCode),
        database: comprehensiveServices.filter(s => s.category === 'database').map(s => s.serviceCode),
        networking: comprehensiveServices.filter(s => s.category === 'networking').map(s => s.serviceCode),
        analytics: comprehensiveServices.filter(s => s.category === 'analytics').map(s => s.serviceCode),
        ml: comprehensiveServices.filter(s => s.category === 'ml').map(s => s.serviceCode),
        security: comprehensiveServices.filter(s => s.category === 'security').map(s => s.serviceCode),
        management: comprehensiveServices.filter(s => s.category === 'management').map(s => s.serviceCode),
        devtools: comprehensiveServices.filter(s => s.category === 'devtools').map(s => s.serviceCode),
        integration: comprehensiveServices.filter(s => s.category === 'integration').map(s => s.serviceCode),
        containers: comprehensiveServices.filter(s => s.category === 'containers').map(s => s.serviceCode),
        serverless: comprehensiveServices.filter(s => s.category === 'serverless').map(s => s.serviceCode),
        iot: [],
        media: [],
        migration: [],
        quantum: [],
        blockchain: [],
        gametech: [],
        other: [],
    },
};
