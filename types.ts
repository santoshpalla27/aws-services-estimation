// Enums for standardizing inputs
export enum Region {
  US_EAST_1 = "us-east-1",
  US_WEST_2 = "us-west-2",
  EU_CENTRAL_1 = "eu-central-1"
}

export enum ServiceType {
  // Compute
  EC2 = "AmazonEC2",
  ASG = "AmazonEC2AutoScaling", // Auto Scaling Group
  ECS = "AmazonECS",
  EKS = "AmazonEKS",
  LAMBDA = "AWSLambda",
  ELASTIC_BEANSTALK = "ElasticBeanstalk",

  // Storage
  S3 = "AmazonS3",
  EBS = "AmazonEBS",
  EFS = "AmazonEFS",
  FSX = "AmazonFSx",
  S3_GLACIER = "AmazonS3GlacierDeepArchive",
  BACKUP = "AWSBackup",
  ELASTIC_DR = "AWSElasticDisasterRecovery",

  // Database
  RDS = "AmazonRDS",
  DYNAMODB = "AmazonDynamoDB",
  ELASTICACHE = "AmazonElastiCache",
  NEPTUNE = "AmazonNeptune",
  REDSHIFT = "AmazonRedshift",

  // Networking
  VPC = "AmazonVPC",
  ROUTE53 = "AmazonRoute53",
  CLOUDFRONT = "AmazonCloudFront",
  API_GATEWAY = "AmazonApiGateway",
  ELB = "AWSELB",
  GLOBAL_ACCELERATOR = "AWSGlobalAccelerator",
  DATA_TRANSFER = "AWSDataTransfer",

  // Security
  IAM = "AWSIdentityAccessManagement",
  KMS = "awskms",
  WAF = "awswaf",
  SHIELD = "AWSShield",
  SECRETS_MANAGER = "AWSSecretsManager",
  ACM = "ACM", // Certificate Manager
  FMS = "AWSFMS", // Firewall Manager

  // Management & Gov
  CLOUDWATCH = "AmazonCloudWatch",
  CLOUDTRAIL = "AWSCloudTrail",
  CONFIG = "AWSConfig",
  SYSTEMS_MANAGER = "AWSSystemsManager",
  SERVICE_CATALOG = "AWSServiceCatalog",
  CLOUDFORMATION = "AWSCloudFormation",
  XRAY = "AWSXRay",

  // App Integration
  SNS = "AmazonSNS",
  SQS = "AWSQueueService",
  MQ = "AmazonMQ",
  STEP_FUNCTIONS = "AmazonStates",
  EVENTBRIDGE = "AWSEvents",
  MSK = "AmazonMSK",

  // Analytics
  KINESIS = "AmazonKinesis",
  OPENSEARCH = "AmazonOpenSearchService",

  // Developer Tools
  CODEBUILD = "CodeBuild",
  CODECOMMIT = "AWSCodeCommit",
  CODEDEPLOY = "AWSCodeDeploy",
  CODEPIPELINE = "AWSCodePipeline",
  CODEARTIFACT = "AWSCodeArtifact",

  // Containers
  ECR = "AmazonECR",
  ECR_PUBLIC = "AmazonECRPublic",

  // Customer Engagement
  SES = "AmazonSES",
  PINPOINT = "AmazonPinpoint",
}

export enum NatGatewayStrategy {
  NONE = "None",
  SINGLE = "Single",
  ONE_PER_AZ = "OnePerAZ"
}

// EC2 Specific Enums
export enum InstanceFamily {
  GENERAL_PURPOSE = "General Purpose",
  COMPUTE_OPTIMIZED = "Compute Optimized",
  MEMORY_OPTIMIZED = "Memory Optimized"
}

export enum InstanceType {
  T3_MICRO = "t3.micro",
  T3_MEDIUM = "t3.medium",
  M5_LARGE = "m5.large",
  C5_LARGE = "c5.large",
  R5_LARGE = "r5.large"
}

export enum Tenancy {
  SHARED = "Shared",
  DEDICATED_INSTANCE = "Dedicated Instance",
  DEDICATED_HOST = "Dedicated Host"
}

export enum EbsVolumeType {
  GP3 = "gp3",
  GP2 = "gp2",
  IO2 = "io2",
  IO1 = "io1",
  ST1 = "st1"
}

export enum LoadBalancerType {
  NONE = "None",
  ALB = "Application Load Balancer",
  NLB = "Network Load Balancer",
  GWLB = "Gateway Load Balancer"
}

// S3 Specific Enums
export enum S3StorageClass {
  STANDARD = "Standard",
  INTELLIGENT_TIERING = "Intelligent-Tiering",
  STANDARD_IA = "Standard-IA",
  GLACIER_INSTANT = "Glacier Instant Retrieval",
  GLACIER_FLEXIBLE = "Glacier Flexible Retrieval",
  DEEP_ARCHIVE = "Glacier Deep Archive"
}

// Lambda Specific Enums
export enum LambdaArchitecture {
  X86_64 = "x86_64",
  ARM64 = "arm64"
}

// RDS Specific Enums
export enum RDSEngine {
  MYSQL = "MySQL",
  POSTGRESQL = "PostgreSQL",
  MARIADB = "MariaDB"
}

export enum RDSInstanceClass {
  DB_T3_MICRO = "db.t3.micro",
  DB_T3_MEDIUM = "db.t3.medium",
  DB_M5_LARGE = "db.m5.large",
  DB_R5_LARGE = "db.r5.large"
}

export enum RDSDeploymentOption {
  SINGLE_AZ = "Single-AZ",
  MULTI_AZ = "Multi-AZ"
}

// API Gateway Specific Enums
export enum ApiGatewayType {
  REST = "REST API",
  HTTP = "HTTP API"
}

export enum ApiGatewayCacheSize {
  NONE = "None",
  GB_0_5 = "0.5 GB",
  GB_1_6 = "1.6 GB",
  GB_6_1 = "6.1 GB",
  GB_13_5 = "13.5 GB"
}

// CloudFront Specific Enums
export enum CloudFrontPriceClass {
  PRICE_CLASS_100 = "Price Class 100 (NA & Europe)",
  PRICE_CLASS_200 = "Price Class 200 (+ Asia, ME, Africa)",
  PRICE_CLASS_ALL = "Price Class All (Global)"
}

// DynamoDB Specific Enums
export enum DynamoDBCapacityMode {
  PROVISIONED = "Provisioned",
  ON_DEMAND = "On-Demand"
}

export enum DynamoDBTableClass {
  STANDARD = "Standard",
  STANDARD_IA = "Standard-IA"
}

// ACM Specific Enums
export enum AcmCertificateType {
  PUBLIC = "Public (Free)",
  PRIVATE = "Private CA"
}

// OpenSearch Specific Enums
export enum OpenSearchInstanceType {
  T3_SMALL_SEARCH = "t3.small.search",
  M6G_LARGE_SEARCH = "m6g.large.search",
  R6G_LARGE_SEARCH = "r6g.large.search",
  R6G_XLARGE_SEARCH = "r6g.xlarge.search"
}

// ECS Specific Enums
export enum ECSLaunchType {
  FARGATE = "Fargate",
  EC2 = "EC2"
}

export enum FargatePlatform {
  LINUX_X86 = "Linux X86",
  LINUX_ARM = "Linux ARM64",
  WINDOWS = "Windows Server"
}

// EFS Specific Enums
export enum EFSThroughputMode {
  BURSTING = "Bursting",
  PROVISIONED = "Provisioned",
  ELASTIC = "Elastic"
}

// ElastiCache Specific Enums
export enum ElastiCacheEngine {
  REDIS = "Redis",
  MEMCACHED = "Memcached"
}

export enum ElastiCacheNodeType {
  CACHE_T3_MICRO = "cache.t3.micro",
  CACHE_T3_MEDIUM = "cache.t3.medium",
  CACHE_M5_LARGE = "cache.m5.large",
  CACHE_M6G_LARGE = "cache.m6g.large",
  CACHE_R6G_LARGE = "cache.r6g.large"
}

// MSK Specific Enums
export enum MSKBrokerNodeType {
  KAFKA_T3_SMALL = "kafka.t3.small",
  KAFKA_M5_LARGE = "kafka.m5.large",
  KAFKA_M5_XLARGE = "kafka.m5.xlarge",
  KAFKA_M5_2XLARGE = "kafka.m5.2xlarge"
}

// Amazon MQ Enums
export enum AmazonMQEngine {
  ACTIVEMQ = "ActiveMQ",
  RABBITMQ = "RabbitMQ"
}

export enum AmazonMQDeploymentMode {
  SINGLE_INSTANCE = "Single Instance",
  ACTIVE_STANDBY_MULTI_AZ = "Active/Standby (Multi-AZ)",
  CLUSTER_MULTI_AZ = "Cluster Deployment (Multi-AZ)"
}

export enum AmazonMQInstanceType {
  MQ_T3_MICRO = "mq.t3.micro",
  MQ_M5_LARGE = "mq.m5.large"
}

// Shield Enums
export enum ShieldProtectionType {
  STANDARD = "Standard (Free)",
  ADVANCED = "Advanced ($3,000/mo)"
}

// WAF Specific Enums
export enum WafScope {
  REGIONAL = "Regional (ALB, API Gateway, AppSync)",
  CLOUDFRONT = "CloudFront (Global)"
}

// Kinesis Specific Enums
export enum KinesisStreamMode {
  PROVISIONED = "Provisioned",
  ON_DEMAND = "On-Demand"
}

// CodeBuild Specific Enums
export enum CodeBuildComputeType {
  BUILD_GENERAL1_SMALL = "build.general1.small",
  BUILD_GENERAL1_MEDIUM = "build.general1.medium",
  BUILD_GENERAL1_LARGE = "build.general1.large"
}

export enum CodeBuildOs {
  LINUX = "Linux",
  WINDOWS = "Windows"
}

// FSx Specific Enums
export enum FSxType {
  WINDOWS = "Windows File Server",
  LUSTRE = "Lustre",
  ONTAP = "NetApp ONTAP",
  OPENZFS = "OpenZFS"
}

export enum FSxDeploymentType {
  SINGLE_AZ = "Single-AZ",
  MULTI_AZ = "Multi-AZ"
}

// Step Functions Enums
export enum StepFunctionsType {
  STANDARD = "Standard",
  EXPRESS = "Express"
}

// The generic configuration schema for any resource
export interface ResourceConfig {
  id: string;
  serviceType: ServiceType;
  name: string;
  region: Region;
  attributes: {
    // --- New Nested Schemas (V2) ---
    // These are optional and coexist with flat attributes for backward compatibility
    eks?: import('./types/schemas/eks.schema').EKSClusterSchema;
    vpc?: import('./types/schemas/vpc.schema').VPCSchema;
    // --- VPC Attributes ---
    availabilityZones: number;
    publicSubnetsPerAZ: number;
    privateSubnetsPerAZ: number;
    natGatewayStrategy: NatGatewayStrategy;
    enableInternetGateway: boolean;
    enableEgressOnlyInternetGateway: boolean; // IPv6
    enableDnsHostnames: boolean;
    enableDnsSupport: boolean;
    vpnConnections: number;
    clientVpnEnabled: boolean;
    clientVpnAssociations: number;
    clientVpnActiveConnections: number;
    natGateways: number;
    publicIps: number;
    vpcEndpointsInterface: number;
    enableS3GatewayEndpoint: boolean;
    enableDynamoDBGatewayEndpoint: boolean;
    transitGatewayAttachments: number;
    trafficMirrorSessions: number;
    natDataProcessed: number;
    dataTransferOut: number;
    dataTransferIntraRegion: number;
    enableVpcPeering: boolean;
    vpcPeeringDataTransfer: number;
    flowLogsEnabled: boolean;
    flowLogsDataIngested: number;
    transitGatewayDataProcessed: number;

    // --- EC2 Attributes ---
    instanceCount: number;
    instanceFamily: InstanceFamily;
    instanceType: InstanceType;
    tenancy: Tenancy;
    monitoringEnabled: boolean; // CloudWatch detailed monitoring
    linkedVpcId?: string; // Dependency: Link to a Project VPC
    ebsOptimized: boolean;
    rootVolumeType: EbsVolumeType;
    rootVolumeSize: number; // GB
    rootVolumeIops: number; // For io2/gp3
    dataVolumeCount: number; // Additional volumes per instance
    dataVolumeType: EbsVolumeType;
    dataVolumeSize: number;
    snapshotFrequency: number; // Snapshots per month
    snapshotDataChange: number; // GB changed per snapshot
    elasticIps: number; // Unattached or remapped
    loadBalancerType: LoadBalancerType;
    loadBalancerCount: number;
    loadBalancerDataProcessed: number; // GB/mo
    utilizationHours: number; // Hours per month (max 730)
    enableSpotInstances: boolean;
    spotDiscountPercentage: number; // Estimated %

    // --- S3 Attributes ---
    s3StandardStorage: number; // GB
    s3InfrequentAccessStorage: number; // GB
    s3GlacierStorage: number; // GB
    s3DeepArchiveStorage: number; // GB
    s3PutRequests: number; // Count
    s3GetRequests: number; // Count
    s3LifecycleTransitions: number; // Count per million
    s3DataTransferOut: number; // GB
    s3DataTransferAcceleration: number; // GB
    s3ReplicationData: number; // GB (CRR)
    s3VersioningEnabled: boolean; // Increases storage logic
    s3InventoryObjects: number; // Millions of objects
    s3AnalyticsEnabled: boolean;
    s3ObjectLockEnabled: boolean;

    // --- CloudWatch Attributes ---
    cwCustomMetrics: number;
    cwDashboards: number;
    cwAlarmsStandard: number;
    cwAlarmsHighRes: number;
    cwLogsIngested: number; // GB
    cwLogsStored: number; // GB
    cwLogsVended: number; // GB (e.g. VPC Flow logs are often treated differently, but generalized here)
    cwSyntheticsCanaryRuns: number; // Total runs per month
    cwRumEvents: number; // Thousands of events (100k units)
    cwEventsCustom: number; // Millions of events
    cwContributorInsightsRules: number; // Number of rules

    // --- Route 53 Attributes ---
    r53HostedZones: number; // Count
    r53StandardQueries: number; // Millions
    r53GeoLatencyQueries: number; // Millions
    r53HealthChecksAws: number; // Count
    r53HealthChecksNonAws: number; // Count
    r53ResolverEndpoints: number; // Count (ENIs)
    r53ResolverQueries: number; // Millions
    r53DnsFirewallQueries: number; // Millions
    r53Domains: number; // Count

    // --- Lambda Attributes ---
    lambdaArchitecture: LambdaArchitecture;
    lambdaMemory: number; // MB
    lambdaEphemeralStorage: number; // MB
    lambdaRequests: number; // Millions
    lambdaDurationMs: number; // ms
    lambdaProvisionedConcurrency: number; // Count
    lambdaProvisionedHours: number; // Hours/mo

    // --- RDS Attributes ---
    rdsEngine: RDSEngine;
    rdsInstanceClass: RDSInstanceClass;
    rdsDeploymentOption: RDSDeploymentOption;
    rdsStorageType: EbsVolumeType; // Using EBS types for simplicity
    rdsStorageSize: number; // GB
    rdsStorageIops: number; // Provisioned IOPS
    rdsBackupStorage: number; // Additional GB
    rdsDataTransferOut: number; // GB

    // --- ApiGateway Attributes ---
    apiGwType: ApiGatewayType;
    apiGwRequests: number; // Millions
    apiGwDataTransferOut: number; // GB
    apiGwCacheEnabled: boolean;
    apiGwCacheSize: ApiGatewayCacheSize;

    // --- CloudFront Attributes ---
    cfPriceClass: CloudFrontPriceClass;
    cfDataTransferOut: number; // GB
    cfHttpRequests: number; // Millions
    cfHttpsRequests: number; // Millions
    cfOriginShieldEnabled: boolean;
    cfOriginShieldRequests: number; // Millions
    cfDedicatedIp: boolean; // Custom SSL with dedicated IP ($600/mo)

    // --- DynamoDB Attributes ---
    ddbCapacityMode: DynamoDBCapacityMode;
    ddbTableClass: DynamoDBTableClass;
    ddbStorageSize: number; // GB
    // Provisioned
    ddbWCU: number;
    ddbRCU: number;
    // On-Demand
    ddbWriteRequestUnits: number; // Millions
    ddbReadRequestUnits: number; // Millions
    // Features
    ddbBackupEnabled: boolean;
    ddbBackupSize: number; // GB
    ddbPitRecoveryEnabled: boolean;
    ddbStreamsEnabled: boolean;
    ddbStreamReads: number; // Millions
    ddbGlobalTablesEnabled: boolean;
    ddbGlobalTableRegions: number; // Count of *additional* regions
    ddbDataTransferOut: number; // GB

    // --- ACM Attributes ---
    acmCertificateType: AcmCertificateType;
    acmPrivateCaCount: number;
    acmCertificateCount: number;

    // --- OpenSearch Attributes ---
    osInstanceType: OpenSearchInstanceType;
    osInstanceCount: number;
    osDedicatedMasterEnabled: boolean;
    osDedicatedMasterType: OpenSearchInstanceType;
    osDedicatedMasterCount: number;
    osStorageType: EbsVolumeType;
    osStorageSizePerNode: number; // GB
    osMultiAZ: boolean;
    osDataTransferOut: number; // GB

    // --- CloudTrail Attributes ---
    trailPaidManagementEvents: number; // Millions (Additional copies)
    trailDataEvents: number; // Millions
    trailInsightsEnabled: boolean;
    trailInsightsAnalyzedEvents: number; // Millions
    trailLakeEnabled: boolean;
    trailLakeIngestion: number; // GB
    trailLakeStorage: number; // GB
    trailLakeScanned: number; // GB

    // --- ECR Attributes ---
    ecrStorage: number; // GB
    ecrDataTransferOut: number; // GB

    // --- ECR Public Attributes ---
    ecrPublicStorage: number; // GB
    ecrPublicDataTransferOut: number; // GB

    // --- ECS Attributes ---
    ecsLaunchType: ECSLaunchType;
    ecsTaskCount: number;
    ecsCpu: number; // vCPU
    ecsMemory: number; // GB
    ecsStorage: number; // GB (Ephemeral)
    ecsPlatform: FargatePlatform;
    ecsRunningHours: number;
    ecsFargateSpot: boolean;

    // --- EFS Attributes ---
    efsStorageStandard: number; // GB
    efsStorageIA: number; // GB
    efsStorageArchive: number; // GB
    efsIsOneZone: boolean;
    efsThroughputMode: EFSThroughputMode;
    efsProvisionedThroughput: number; // MB/s
    efsElasticReadData: number; // GB
    efsElasticWriteData: number; // GB
    efsIaRetrieval: number; // GB
    efsArchiveRetrieval: number; // GB

    // --- EKS Attributes ---
    eksClusterHours: number;
    eksExtendedSupport: boolean;
    eksFargateEnabled: boolean;
    eksFargateTasks: number;
    eksFargateCpu: number;
    eksFargateMemory: number;
    eksNodesEnabled: boolean;
    eksNodeCount: number;
    eksNodeInstanceType: InstanceType;
    eksNodeStorageSize: number; // GB EBS

    // --- ElastiCache Attributes ---
    elastiCacheEngine: ElastiCacheEngine;
    elastiCacheNodeType: ElastiCacheNodeType;
    elastiCacheNodeCount: number;
    elastiCacheSnapshotStorage: number; // GB

    // --- WAF Attributes ---
    wafScope: WafScope;
    wafWebACLCount: number;
    wafRuleCountPerACL: number;
    wafRequests: number; // Millions
    wafBotControlEnabled: boolean;
    wafBotControlRequests: number; // Millions
    wafFraudControlEnabled: boolean;
    wafFraudControlRequests: number; // Millions

    // --- Systems Manager Attributes ---
    ssmParameterStoreAdvancedCount: number; // Count
    ssmParameterStoreAPIGets: number; // Millions
    ssmOpsItems: number; // Count
    ssmAutomationSteps: number; // Thousands
    ssmChangeManagerRequests: number; // Count
    ssmAdvancedInstances: number; // Count (On-prem)

    // --- Secrets Manager Attributes ---
    smSecretCount: number;
    smApiRequests: number; // Millions

    // --- KMS Attributes ---
    kmsKeyCount: number; // Customer Managed Keys (CMKs)
    kmsRequests: number; // Millions of requests

    // --- ELB (Standalone) Attributes ---
    elbType: LoadBalancerType;
    elbCount: number;
    elbNewConnections: number; // Per second
    elbActiveConnections: number; // Average concurrent
    elbProcessedBytes: number; // GB per hour
    elbRuleEvaluations: number; // Per second (ALB only)

    // --- Auto Scaling Group Attributes ---
    asgInstanceType: InstanceType;
    asgDesiredCapacity: number;
    asgDetailedMonitoring: boolean;
    asgPurchaseOption: 'On-Demand' | 'Spot';
    asgSpotPercentage: number;

    // --- CloudFormation Attributes ---
    cfnHandlerOperations: number; // Count per month
    cfnHandlerDurationSeconds: number; // Average duration

    // --- Amazon MSK Attributes ---
    mskBrokerNodeType: MSKBrokerNodeType;
    mskBrokerNodes: number;
    mskStoragePerBroker: number; // GB

    // --- Amazon SNS Attributes ---
    snsRequests: number; // Millions
    snsDataTransferOut: number; // GB

    // --- Amazon SQS Attributes ---
    sqsFifo: boolean;
    sqsRequests: number; // Millions
    sqsDataTransferOut: number; // GB

    // --- Amazon SES Attributes ---
    sesEmailMessages: number; // Thousands
    sesDedicatedIpEnabled: boolean;
    sesDataTransferOut: number; // GB

    // --- Amazon MQ Attributes ---
    mqEngine: AmazonMQEngine;
    mqDeploymentMode: AmazonMQDeploymentMode;
    mqInstanceType: AmazonMQInstanceType;
    mqBrokerCount: number;
    mqStorage: number; // GB

    // --- AWS Shield Attributes ---
    shieldProtectionType: ShieldProtectionType;
    shieldProtectedResources: number;

    // --- AWS Config Attributes ---
    configConfigurationItems: number; // Count
    configRuleEvaluations: number; // Count

    // --- AWS IAM Attributes ---
    iamUserCount: number;
    iamRoleCount: number;
    iamPolicyCount: number;
    iamGroupCount: number;
    iamApiRequests: number; // Millions

    // --- Amazon Kinesis Attributes ---
    kinesisStreamMode: KinesisStreamMode;
    kinesisShardCount: number;
    kinesisDataProcessed: number; // GB
    kinesisDataRetentionHours: number;
    kinesisEnhancedFanOut: boolean;
    kinesisConsumerCount: number;

    // --- Amazon EventBridge Attributes ---
    eventBridgeCustomEvents: number; // Millions
    eventBridgeCrossRegionEvents: number; // Millions
    eventBridgeSchemaRegistry: boolean;
    eventBridgeArchiveProcessing: number; // GB

    // --- AWS Elastic Disaster Recovery Attributes ---
    drsSourceServerCount: number;
    drsAvgChangeRate: number; // % daily
    drsReplicationServerType: InstanceType; // EC2 proxy
    drsPointInTimeRetention: number; // Days

    // --- AWS CodeArtifact Attributes ---
    codeArtifactStorage: number; // GB
    codeArtifactRequests: number; // Thousands

    // --- AWS CodeBuild Attributes ---
    codeBuildInstanceType: CodeBuildComputeType;
    codeBuildOs: CodeBuildOs;
    codeBuildMinutes: number; // Minutes per month

    // --- AWS CodeCommit Attributes ---
    codeCommitUsers: number;
    codeCommitStorage: number; // GB
    codeCommitRequests: number; // Millions

    // --- AWS CodeDeploy Attributes ---
    codeDeployOnPremInstances: number;
    codeDeployUpdates: number;

    // --- AWS CodePipeline Attributes ---
    codePipelineActivePipelines: number;

    // --- AWS Data Transfer Attributes ---
    dtOutboundInternet: number; // GB
    dtInterRegion: number; // GB
    dtIntraRegion: number; // GB

    // --- AWS Global Accelerator Attributes ---
    gaAcceleratorCount: number;
    gaDataTransferDominant: number; // GB (Premium DT)

    // --- AWS Firewall Manager Attributes ---
    fmsPolicyCount: number;
    fmsShieldAdvancedEnabled: boolean;

    // --- AWS Backup Attributes ---
    backupStorageSize: number; // GB
    backupRestoreData: number; // GB

    // --- Amazon FSx Attributes ---
    fsxType: FSxType;
    fsxDeploymentType: FSxDeploymentType;
    fsxStorageCapacity: number; // GB
    fsxThroughputCapacity: number; // MB/s
    fsxBackupStorage: number; // GB

    // --- Amazon S3 Glacier (Vault) Attributes ---
    glacierStorage: number; // GB
    glacierRetrieval: number; // GB
    glacierRequests: number; // Thousands

    // --- Amazon States (Step Functions) Attributes ---
    sfnType: StepFunctionsType;
    sfnTransitions: number; // Millions (Standard)
    sfnExpressRequests: number; // Millions (Express)
    sfnExpressDurationMs: number; // Duration (Express)
    sfnExpressMemory: number; // MB (Express)

    // --- AWS X-Ray Attributes ---
    xrayTracesStored: number; // Millions
    xrayTracesRetrieved: number; // Millions
    xrayDataScanned: number; // GB (Insights)

    // --- Amazon Pinpoint Attributes ---
    pinpointMTA: number; // Monthly Targeted Audience count
    pinpointEvents: number; // Millions
    pinpointPushNotifs: number; // Millions
    pinpointEmails: number; // Thousands
  };
}

// Pricing Data Structure
export interface PricingRate {
  unit: string;
  pricePerUnit: number;
  currency: string;
}

export interface ServicePricing {
  [key: string]: PricingRate;
}

export interface PricingRepository {
  [Region.US_EAST_1]: {
    [ServiceType.VPC]: ServicePricing;
    [ServiceType.EC2]?: ServicePricing;
    [ServiceType.ASG]?: ServicePricing;
    [ServiceType.S3]?: ServicePricing;
    [ServiceType.CLOUDWATCH]?: ServicePricing;
    [ServiceType.ROUTE53]?: ServicePricing;
    [ServiceType.LAMBDA]?: ServicePricing;
    [ServiceType.RDS]?: ServicePricing;
    [ServiceType.API_GATEWAY]?: ServicePricing;
    [ServiceType.CLOUDFRONT]?: ServicePricing;
    [ServiceType.DYNAMODB]?: ServicePricing;
    [ServiceType.ACM]?: ServicePricing;
    [ServiceType.OPENSEARCH]?: ServicePricing;
    [ServiceType.CLOUDTRAIL]?: ServicePricing;
    [ServiceType.ECR]?: ServicePricing;
    [ServiceType.ECR_PUBLIC]?: ServicePricing;
    [ServiceType.ECS]?: ServicePricing;
    [ServiceType.EFS]?: ServicePricing;
    [ServiceType.EKS]?: ServicePricing;
    [ServiceType.ELASTICACHE]?: ServicePricing;
    [ServiceType.WAF]?: ServicePricing;
    [ServiceType.SYSTEMS_MANAGER]?: ServicePricing;
    [ServiceType.SECRETS_MANAGER]?: ServicePricing;
    [ServiceType.KMS]?: ServicePricing;
    [ServiceType.ELB]?: ServicePricing;
    [ServiceType.CLOUDFORMATION]?: ServicePricing;
    [ServiceType.MSK]?: ServicePricing;
    [ServiceType.SNS]?: ServicePricing;
    [ServiceType.SQS]?: ServicePricing;
    [ServiceType.SES]?: ServicePricing;
    [ServiceType.MQ]?: ServicePricing;
    [ServiceType.SHIELD]?: ServicePricing;
    [ServiceType.CONFIG]?: ServicePricing;
    [ServiceType.IAM]?: ServicePricing;
    [ServiceType.KINESIS]?: ServicePricing;
    [ServiceType.EVENTBRIDGE]?: ServicePricing;
    [ServiceType.ELASTIC_DR]?: ServicePricing;
    [ServiceType.CODEARTIFACT]?: ServicePricing;
    [ServiceType.CODEBUILD]?: ServicePricing;
    [ServiceType.CODECOMMIT]?: ServicePricing;
    [ServiceType.CODEDEPLOY]?: ServicePricing;
    [ServiceType.CODEPIPELINE]?: ServicePricing;
    [ServiceType.DATA_TRANSFER]?: ServicePricing;
    [ServiceType.GLOBAL_ACCELERATOR]?: ServicePricing;
    [ServiceType.FMS]?: ServicePricing;
    [ServiceType.BACKUP]?: ServicePricing;
    [ServiceType.FSX]?: ServicePricing;
    [ServiceType.S3_GLACIER]?: ServicePricing;
    [ServiceType.STEP_FUNCTIONS]?: ServicePricing;
    [ServiceType.XRAY]?: ServicePricing;
    [ServiceType.PINPOINT]?: ServicePricing;
  };
}

export interface CostBreakdownItem {
  label: string;
  unitCost: number;
  quantity: number;
  unit: string;
  total: number;
}

export interface CostEstimation {
  monthlyTotal: number;
  breakdown: CostBreakdownItem[];
}