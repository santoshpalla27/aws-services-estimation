export enum Region {
  US_EAST_1 = "us-east-1",
  US_WEST_2 = "us-west-2",
  EU_CENTRAL_1 = "eu-central-1"
}

// ... (keep all ServiceType, Enums, and Interfaces unchanged until PricingRepository) ...

export enum ServiceType {
  EC2 = "AmazonEC2",
  ASG = "AmazonEC2AutoScaling", 
  ECS = "AmazonECS",
  EKS = "AmazonEKS",
  LAMBDA = "AWSLambda",
  ELASTIC_BEANSTALK = "ElasticBeanstalk",
  S3 = "AmazonS3",
  EBS = "AmazonEBS",
  EFS = "AmazonEFS",
  FSX = "AmazonFSx",
  S3_GLACIER = "AmazonS3GlacierDeepArchive",
  BACKUP = "AWSBackup",
  ELASTIC_DR = "AWSElasticDisasterRecovery",
  RDS = "AmazonRDS",
  DYNAMODB = "AmazonDynamoDB",
  ELASTICACHE = "AmazonElastiCache",
  NEPTUNE = "AmazonNeptune",
  REDSHIFT = "AmazonRedshift",
  VPC = "AmazonVPC",
  ROUTE53 = "AmazonRoute53",
  CLOUDFRONT = "AmazonCloudFront",
  API_GATEWAY = "AmazonApiGateway",
  ELB = "AWSELB",
  GLOBAL_ACCELERATOR = "AWSGlobalAccelerator",
  DATA_TRANSFER = "AWSDataTransfer",
  IAM = "AWSIdentityAccessManagement",
  KMS = "awskms",
  WAF = "awswaf",
  SHIELD = "AWSShield",
  SECRETS_MANAGER = "AWSSecretsManager",
  ACM = "ACM", 
  FMS = "AWSFMS", 
  CLOUDWATCH = "AmazonCloudWatch",
  CLOUDTRAIL = "AWSCloudTrail",
  CONFIG = "AWSConfig",
  SYSTEMS_MANAGER = "AWSSystemsManager",
  SERVICE_CATALOG = "AWSServiceCatalog",
  CLOUDFORMATION = "AWSCloudFormation",
  XRAY = "AWSXRay",
  SNS = "AmazonSNS",
  SQS = "AWSQueueService",
  MQ = "AmazonMQ",
  STEP_FUNCTIONS = "AmazonStates",
  EVENTBRIDGE = "AWSEvents",
  MSK = "AmazonMSK",
  KINESIS = "AmazonKinesis",
  OPENSEARCH = "AmazonOpenSearchService",
  CODEBUILD = "CodeBuild",
  CODECOMMIT = "AWSCodeCommit",
  CODEDEPLOY = "AWSCodeDeploy",
  CODEPIPELINE = "AWSCodePipeline",
  CODEARTIFACT = "AWSCodeArtifact",
  ECR = "AmazonECR",
  ECR_PUBLIC = "AmazonECRPublic",
  SES = "AmazonSES",
  PINPOINT = "AmazonPinpoint",
}

export enum NatGatewayStrategy {
  NONE = "None",
  SINGLE = "Single",
  ONE_PER_AZ = "OnePerAZ"
}

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

export enum S3StorageClass {
  STANDARD = "Standard",
  INTELLIGENT_TIERING = "Intelligent-Tiering",
  STANDARD_IA = "Standard-IA",
  GLACIER_INSTANT = "Glacier Instant Retrieval",
  GLACIER_FLEXIBLE = "Glacier Flexible Retrieval",
  DEEP_ARCHIVE = "Glacier Deep Archive"
}

export enum LambdaArchitecture {
  X86_64 = "x86_64",
  ARM64 = "arm64"
}

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

export enum CloudFrontPriceClass {
  PRICE_CLASS_100 = "Price Class 100 (NA & Europe)",
  PRICE_CLASS_200 = "Price Class 200 (+ Asia, ME, Africa)",
  PRICE_CLASS_ALL = "Price Class All (Global)"
}

export enum DynamoDBCapacityMode {
  PROVISIONED = "Provisioned",
  ON_DEMAND = "On-Demand"
}

export enum DynamoDBTableClass {
  STANDARD = "Standard",
  STANDARD_IA = "Standard-IA"
}

export enum AcmCertificateType {
  PUBLIC = "Public (Free)",
  PRIVATE = "Private CA"
}

export enum OpenSearchInstanceType {
  T3_SMALL_SEARCH = "t3.small.search",
  M6G_LARGE_SEARCH = "m6g.large.search",
  R6G_LARGE_SEARCH = "r6g.large.search",
  R6G_XLARGE_SEARCH = "r6g.xlarge.search"
}

export enum ECSLaunchType {
  FARGATE = "Fargate",
  EC2 = "EC2"
}

export enum FargatePlatform {
  LINUX_X86 = "Linux X86",
  LINUX_ARM = "Linux ARM64",
  WINDOWS = "Windows Server"
}

export enum EFSThroughputMode {
  BURSTING = "Bursting",
  PROVISIONED = "Provisioned",
  ELASTIC = "Elastic"
}

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

export enum MSKBrokerNodeType {
  KAFKA_T3_SMALL = "kafka.t3.small",
  KAFKA_M5_LARGE = "kafka.m5.large",
  KAFKA_M5_XLARGE = "kafka.m5.xlarge",
  KAFKA_M5_2XLARGE = "kafka.m5.2xlarge"
}

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

export enum ShieldProtectionType {
  STANDARD = "Standard (Free)",
  ADVANCED = "Advanced ($3,000/mo)"
}

export enum WafScope {
  REGIONAL = "Regional (ALB, API Gateway, AppSync)",
  CLOUDFRONT = "CloudFront (Global)"
}

export enum KinesisStreamMode {
  PROVISIONED = "Provisioned",
  ON_DEMAND = "On-Demand"
}

export enum CodeBuildComputeType {
  BUILD_GENERAL1_SMALL = "build.general1.small",
  BUILD_GENERAL1_MEDIUM = "build.general1.medium",
  BUILD_GENERAL1_LARGE = "build.general1.large"
}

export enum CodeBuildOs {
  LINUX = "Linux",
  WINDOWS = "Windows"
}

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

export enum StepFunctionsType {
  STANDARD = "Standard",
  EXPRESS = "Express"
}

export interface EKSNodeGroupConfig {
  id: string; 
  name: string;
  instanceType: string;
  count: number;
  storage: number;
}

export interface EC2VolumeConfig {
  id: string;
  type: EbsVolumeType;
  size: number;
  count: number;
}

export interface RDSInstanceConfig {
  id: string;
  name: string;
  engine: RDSEngine;
  instanceClass: string;
  deploymentOption: RDSDeploymentOption;
  storageType: EbsVolumeType;
  storageSize: number;
  storageIops: number;
  backupStorage: number;
}

export interface S3BucketConfig {
  id: string;
  name: string;
  standardStorage: number;
  iaStorage: number;
  glacierStorage: number;
  deepArchiveStorage: number;
  putRequests: number;
  getRequests: number;
  lifecycleTransitions: number;
  versioning: boolean;
  dataTransferOut: number;
}

export interface LambdaFunctionConfig {
  id: string;
  name: string;
  architecture: LambdaArchitecture;
  memory: number;
  ephemeralStorage: number;
  requests: number;
  durationMs: number;
  provisionedConcurrency: number;
  provisionedHours: number;
}

export interface DynamoDBTableConfig {
  id: string;
  name: string;
  tableClass: DynamoDBTableClass;
  capacityMode: DynamoDBCapacityMode;
  storage: number;
  wcu: number;
  rcu: number;
  writeRequests: number;
  readRequests: number;
  backupEnabled: boolean;
  backupSize: number;
  pitrEnabled: boolean;
  streamsEnabled: boolean;
  streamReads: number;
}

export interface LoadBalancerConfig {
  id: string;
  name: string;
  type: LoadBalancerType;
  newConnections: number;
  activeConnections: number;
  processedBytes: number;
  ruleEvaluations: number;
}

export interface CacheClusterConfig {
  id: string;
  name: string;
  engine: ElastiCacheEngine;
  nodeType: string;
  nodeCount: number;
  snapshotStorage: number;
}

export interface EFSFileSystemConfig {
  id: string;
  name: string;
  storageStandard: number;
  storageIA: number;
  storageArchive: number;
  isOneZone: boolean;
  throughputMode: EFSThroughputMode;
  provisionedThroughput: number;
  elasticRead: number;
  elasticWrite: number;
  iaRetrieval: number;
  archiveRetrieval: number;
}

export interface ApiConfig {
  id: string;
  name: string;
  type: ApiGatewayType;
  requests: number;
  dataTransfer: number;
  cacheEnabled: boolean;
  cacheSize: ApiGatewayCacheSize;
}

export interface DistributionConfig {
  id: string;
  name: string;
  priceClass: CloudFrontPriceClass;
  dataTransfer: number;
  httpRequests: number;
  httpsRequests: number;
  shieldEnabled: boolean;
  shieldRequests: number;
  dedicatedIp: boolean;
}

export interface OpenSearchDomainConfig {
  id: string;
  name: string;
  instanceType: string;
  instanceCount: number;
  masterEnabled: boolean;
  masterType: string;
  masterCount: number;
  storageType: EbsVolumeType;
  storageSizePerNode: number;
  multiAZ: boolean;
  dataTransferOut: number;
}

export interface KinesisStreamConfig {
  id: string;
  name: string;
  mode: KinesisStreamMode;
  shardCount: number;
  dataProcessed: number;
  retentionHours: number;
  enhancedFanOut: boolean;
  consumerCount: number;
}

export interface MSKClusterConfig {
  id: string;
  name: string;
  brokerNodeType: string;
  brokerNodes: number;
  storagePerBroker: number;
}

export interface SNSTopicConfig {
  id: string;
  name: string;
  requests: number;
  dataTransfer: number;
}

export interface SQSQueueConfig {
  id: string;
  name: string;
  isFifo: boolean;
  requests: number;
  dataTransfer: number;
}

export interface MQBrokerConfig {
  id: string;
  name: string;
  engine: AmazonMQEngine;
  deploymentMode: AmazonMQDeploymentMode;
  instanceType: string;
  brokerCount: number;
  storage: number;
}

export interface FSxFileSystemConfig {
  id: string;
  name: string;
  type: FSxType;
  deploymentType: FSxDeploymentType;
  storageCapacity: number;
  throughputCapacity: number;
  backupStorage: number;
}

export interface WAFWebACLConfig {
  id: string;
  name: string;
  scope: WafScope;
  ruleCount: number;
  requests: number;
  botControl: boolean;
  fraudControl: boolean;
  botRequests: number;
  fraudRequests: number;
}

export interface CodeBuildProjectConfig {
  id: string;
  name: string;
  os: CodeBuildOs;
  computeType: CodeBuildComputeType;
  buildMinutes: number;
}

export interface StepFunctionConfig {
  id: string;
  name: string;
  type: StepFunctionsType;
  transitions: number;
  requests: number;
  durationMs: number;
  memoryMb: number;
}

export interface HostedZoneConfig {
  id: string;
  name: string;
  queryCount: number;
  queryType: 'Standard' | 'Latency/Geo';
  healthChecksAws: number;
  healthChecksNonAws: number;
}

export interface AcmCertificateConfig {
  id: string;
  name: string;
  type: AcmCertificateType;
}

export interface CloudTrailConfig {
  id: string;
  name: string;
  managementEvents: boolean;
  dataEvents: boolean;
}

export interface EcrRepositoryConfig {
  id: string;
  name: string;
  storage: number;
  dataTransferOut: number;
}

export interface SecretConfig {
  id: string;
  name: string;
  count: number;
}

export interface KmsKeyConfig {
  id: string;
  name: string;
  requests: number;
}

export interface AcceleratorConfig {
  id: string;
  name: string;
  fixedFee: boolean;
  dataTransfer: number;
}

export interface BackupVaultConfig {
  id: string;
  name: string;
  storageWarm: number;
  restoreData: number;
}

export interface GlacierVaultConfig {
  id: string;
  name: string;
  storage: number;
  retrieval: number;
  requests: number;
}

// The generic configuration schema for any resource
export interface ResourceConfig {
  id: string;
  serviceType: ServiceType;
  name: string;
  region: Region | string; // Support dynamic region strings
  attributes: {
    // --- VPC Attributes ---
    availabilityZones: number;
    publicSubnetsPerAZ: number;
    privateSubnetsPerAZ: number;
    natGatewayStrategy: NatGatewayStrategy;
    enableInternetGateway: boolean;
    enableEgressOnlyInternetGateway: boolean;
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
    instanceType: string;
    tenancy: Tenancy;
    monitoringEnabled: boolean; 
    linkedVpcId?: string; 
    ebsOptimized: boolean;
    rootVolumeType: EbsVolumeType;
    rootVolumeSize: number; 
    rootVolumeIops: number; 
    dataVolumeCount: number; 
    dataVolumeType: EbsVolumeType;
    dataVolumeSize: number;
    ec2DataVolumes: EC2VolumeConfig[];
    
    snapshotFrequency: number; 
    snapshotDataChange: number; 
    elasticIps: number; 
    loadBalancerType: LoadBalancerType;
    loadBalancerCount: number;
    loadBalancerDataProcessed: number;
    utilizationHours: number; 
    enableSpotInstances: boolean;
    spotDiscountPercentage: number; 
    
    // --- S3 Attributes ---
    s3StandardStorage: number; 
    s3InfrequentAccessStorage: number; 
    s3GlacierStorage: number; 
    s3DeepArchiveStorage: number; 
    s3PutRequests: number; 
    s3GetRequests: number; 
    s3LifecycleTransitions: number; 
    s3DataTransferOut: number; 
    s3DataTransferAcceleration: number; 
    s3ReplicationData: number; 
    s3VersioningEnabled: boolean; 
    s3InventoryObjects: number; 
    s3AnalyticsEnabled: boolean;
    s3ObjectLockEnabled: boolean;
    s3Buckets: S3BucketConfig[];

    // --- CloudWatch Attributes ---
    cwCustomMetrics: number;
    cwDashboards: number;
    cwAlarmsStandard: number;
    cwAlarmsHighRes: number;
    cwLogsIngested: number; 
    cwLogsStored: number; 
    cwLogsVended: number; 
    cwSyntheticsCanaryRuns: number; 
    cwRumEvents: number; 
    cwEventsCustom: number; 
    cwContributorInsightsRules: number; 

    // --- Route 53 Attributes ---
    r53HostedZones: number;
    r53StandardQueries: number;
    r53GeoLatencyQueries: number;
    r53HealthChecksAws: number; 
    r53HealthChecksNonAws: number; 
    r53ResolverEndpoints: number; 
    r53ResolverQueries: number; 
    r53DnsFirewallQueries: number; 
    r53Domains: number; 
    route53Zones: HostedZoneConfig[];

    // --- Lambda Attributes ---
    lambdaArchitecture: LambdaArchitecture;
    lambdaMemory: number; 
    lambdaEphemeralStorage: number; 
    lambdaRequests: number; 
    lambdaDurationMs: number; 
    lambdaProvisionedConcurrency: number; 
    lambdaProvisionedHours: number; 
    lambdaFunctions: LambdaFunctionConfig[];

    // --- RDS Attributes ---
    rdsEngine: RDSEngine;
    rdsInstanceClass: string;
    rdsDeploymentOption: RDSDeploymentOption;
    rdsStorageType: EbsVolumeType; 
    rdsStorageSize: number; 
    rdsStorageIops: number; 
    rdsBackupStorage: number; 
    rdsDataTransferOut: number; 
    rdsInstances: RDSInstanceConfig[];

    // --- ApiGateway Attributes ---
    apiGwType: ApiGatewayType;
    apiGwRequests: number;
    apiGwDataTransferOut: number;
    apiGwCacheEnabled: boolean;
    apiGwCacheSize: ApiGatewayCacheSize;
    apiGateways: ApiConfig[];

    // --- CloudFront Attributes ---
    cfPriceClass: CloudFrontPriceClass;
    cfDataTransferOut: number;
    cfHttpRequests: number;
    cfHttpsRequests: number;
    cfOriginShieldEnabled: boolean;
    cfOriginShieldRequests: number;
    cfDedicatedIp: boolean;
    cloudFrontDistributions: DistributionConfig[];

    // --- DynamoDB Attributes ---
    ddbCapacityMode: DynamoDBCapacityMode;
    ddbTableClass: DynamoDBTableClass;
    ddbStorageSize: number; 
    ddbWCU: number;
    ddbRCU: number;
    ddbWriteRequestUnits: number; 
    ddbReadRequestUnits: number; 
    ddbBackupEnabled: boolean;
    ddbBackupSize: number; 
    ddbPitRecoveryEnabled: boolean;
    ddbStreamsEnabled: boolean;
    ddbStreamReads: number; 
    ddbGlobalTablesEnabled: boolean;
    ddbGlobalTableRegions: number; 
    ddbDataTransferOut: number; 
    dynamoDBTables: DynamoDBTableConfig[];

    // --- ACM Attributes ---
    acmCertificateType: AcmCertificateType;
    acmPrivateCaCount: number;
    acmCertificateCount: number;
    acmCertificates: AcmCertificateConfig[];

    // --- OpenSearch Attributes ---
    osInstanceType: string;
    osInstanceCount: number;
    osDedicatedMasterEnabled: boolean;
    osDedicatedMasterType: string;
    osDedicatedMasterCount: number;
    osStorageType: EbsVolumeType;
    osStorageSizePerNode: number;
    osMultiAZ: boolean;
    osDataTransferOut: number;
    openSearchDomains: OpenSearchDomainConfig[];

    // --- CloudTrail Attributes ---
    trailPaidManagementEvents: number;
    trailDataEvents: number;
    trailInsightsEnabled: boolean;
    trailInsightsAnalyzedEvents: number; 
    trailLakeEnabled: boolean;
    trailLakeIngestion: number; 
    trailLakeStorage: number; 
    trailLakeScanned: number; 
    cloudTrails: CloudTrailConfig[];

    // --- ECR Attributes ---
    ecrStorage: number;
    ecrDataTransferOut: number;
    ecrRepositories: EcrRepositoryConfig[];

    // --- ECR Public Attributes ---
    ecrPublicStorage: number; 
    ecrPublicDataTransferOut: number; 

    // --- ECS Attributes ---
    ecsLaunchType: ECSLaunchType;
    ecsTaskCount: number;
    ecsCpu: number; 
    ecsMemory: number; 
    ecsStorage: number; 
    ecsPlatform: FargatePlatform;
    ecsRunningHours: number;
    ecsFargateSpot: boolean;

    // --- EFS Attributes ---
    efsStorageStandard: number;
    efsStorageIA: number;
    efsStorageArchive: number;
    efsIsOneZone: boolean;
    efsThroughputMode: EFSThroughputMode;
    efsProvisionedThroughput: number;
    efsElasticReadData: number;
    efsElasticWriteData: number;
    efsIaRetrieval: number;
    efsArchiveRetrieval: number;
    efsFileSystems: EFSFileSystemConfig[];

    // --- EKS Attributes ---
    eksClusterHours: number;
    eksExtendedSupport: boolean;
    eksFargateEnabled: boolean;
    eksFargateTasks: number;
    eksFargateCpu: number;
    eksFargateMemory: number;
    eksNodesEnabled: boolean;
    eksNodeCount: number;
    eksNodeInstanceType: string;
    eksNodeStorageSize: number; 
    eksNodeGroups: EKSNodeGroupConfig[];

    // --- ElastiCache Attributes ---
    elastiCacheEngine: ElastiCacheEngine;
    elastiCacheNodeType: string;
    elastiCacheNodeCount: number;
    elastiCacheSnapshotStorage: number;
    elastiCacheClusters: CacheClusterConfig[];

    // --- WAF Attributes ---
    wafScope: WafScope;
    wafWebACLCount: number;
    wafRuleCountPerACL: number;
    wafRequests: number;
    wafBotControlEnabled: boolean;
    wafBotControlRequests: number;
    wafFraudControlEnabled: boolean;
    wafFraudControlRequests: number;
    wafWebACLs: WAFWebACLConfig[];

    // --- Systems Manager Attributes ---
    ssmParameterStoreAdvancedCount: number; 
    ssmParameterStoreAPIGets: number; 
    ssmOpsItems: number; 
    ssmAutomationSteps: number; 
    ssmChangeManagerRequests: number; 
    ssmAdvancedInstances: number; 

    // --- Secrets Manager Attributes ---
    smSecretCount: number;
    smApiRequests: number; 
    smSecrets: SecretConfig[];

    // --- KMS Attributes ---
    kmsKeyCount: number;
    kmsRequests: number; 
    kmsKeys: KmsKeyConfig[];

    // --- ELB (Standalone) Attributes ---
    elbType: LoadBalancerType;
    elbCount: number;
    elbNewConnections: number;
    elbActiveConnections: number;
    elbProcessedBytes: number;
    elbRuleEvaluations: number;
    loadBalancers: LoadBalancerConfig[];

    // --- Auto Scaling Group Attributes ---
    asgInstanceType: string;
    asgDesiredCapacity: number;
    asgDetailedMonitoring: boolean;
    asgPurchaseOption: 'On-Demand' | 'Spot';
    asgSpotPercentage: number;

    // --- CloudFormation Attributes ---
    cfnHandlerOperations: number; 
    cfnHandlerDurationSeconds: number; 

    // --- Amazon MSK Attributes ---
    mskBrokerNodeType: string;
    mskBrokerNodes: number;
    mskStoragePerBroker: number;
    mskClusters: MSKClusterConfig[];

    // --- Amazon SNS Attributes ---
    snsRequests: number;
    snsDataTransferOut: number;
    snsTopics: SNSTopicConfig[];

    // --- Amazon SQS Attributes ---
    sqsFifo: boolean;
    sqsRequests: number;
    sqsDataTransferOut: number;
    sqsQueues: SQSQueueConfig[];

    // --- Amazon SES Attributes ---
    sesEmailMessages: number; 
    sesDedicatedIpEnabled: boolean;
    sesDataTransferOut: number; 

    // --- Amazon MQ Attributes ---
    mqEngine: AmazonMQEngine;
    mqDeploymentMode: AmazonMQDeploymentMode;
    mqInstanceType: string;
    mqBrokerCount: number;
    mqStorage: number;
    mqBrokers: MQBrokerConfig[];

    // --- AWS Shield Attributes ---
    shieldProtectionType: ShieldProtectionType;
    shieldProtectedResources: number;

    // --- AWS Config Attributes ---
    configConfigurationItems: number; 
    configRuleEvaluations: number; 

    // --- AWS IAM Attributes ---
    iamUserCount: number;
    iamRoleCount: number;
    iamPolicyCount: number;
    iamGroupCount: number;
    iamApiRequests: number; 

    // --- Amazon Kinesis Attributes ---
    kinesisStreamMode: KinesisStreamMode;
    kinesisShardCount: number;
    kinesisDataProcessed: number;
    kinesisDataRetentionHours: number;
    kinesisEnhancedFanOut: boolean;
    kinesisConsumerCount: number;
    kinesisStreams: KinesisStreamConfig[];

    // --- Amazon EventBridge Attributes ---
    eventBridgeCustomEvents: number; 
    eventBridgeCrossRegionEvents: number; 
    eventBridgeSchemaRegistry: boolean;
    eventBridgeArchiveProcessing: number; 

    // --- AWS Elastic Disaster Recovery Attributes ---
    drsSourceServerCount: number;
    drsAvgChangeRate: number; 
    drsReplicationServerType: string;
    drsPointInTimeRetention: number; 

    // --- AWS CodeArtifact Attributes ---
    codeArtifactStorage: number; 
    codeArtifactRequests: number; 

    // --- AWS CodeBuild Attributes ---
    codeBuildInstanceType: CodeBuildComputeType;
    codeBuildOs: CodeBuildOs;
    codeBuildMinutes: number;
    codeBuildProjects: CodeBuildProjectConfig[];

    // --- AWS CodeCommit Attributes ---
    codeCommitUsers: number;
    codeCommitStorage: number; 
    codeCommitRequests: number; 

    // --- AWS CodeDeploy Attributes ---
    codeDeployOnPremInstances: number;
    codeDeployUpdates: number;

    // --- AWS CodePipeline Attributes ---
    codePipelineActivePipelines: number;

    // --- AWS Data Transfer Attributes ---
    dtOutboundInternet: number; 
    dtInterRegion: number; 
    dtIntraRegion: number; 

    // --- AWS Global Accelerator Attributes ---
    gaAcceleratorCount: number;
    gaDataTransferDominant: number;
    gaAccelerators: AcceleratorConfig[];

    // --- AWS Firewall Manager Attributes ---
    fmsPolicyCount: number;
    fmsShieldAdvancedEnabled: boolean;

    // --- AWS Backup Attributes ---
    backupStorageSize: number;
    backupRestoreData: number;
    backupVaults: BackupVaultConfig[];

    // --- Amazon FSx Attributes ---
    fsxType: FSxType;
    fsxDeploymentType: FSxDeploymentType;
    fsxStorageCapacity: number;
    fsxThroughputCapacity: number;
    fsxBackupStorage: number;
    fsxFileSystems: FSxFileSystemConfig[];

    // --- Amazon S3 Glacier (Vault) Attributes ---
    glacierStorage: number;
    glacierRetrieval: number;
    glacierRequests: number;
    glacierVaults: GlacierVaultConfig[];

    // --- Amazon States (Step Functions) Attributes ---
    sfnType: StepFunctionsType;
    sfnTransitions: number;
    sfnExpressRequests: number;
    sfnExpressDurationMs: number;
    sfnExpressMemory: number;
    stepFunctionsStateMachines: StepFunctionConfig[];

    // --- AWS X-Ray Attributes ---
    xrayTracesStored: number; 
    xrayTracesRetrieved: number; 
    xrayDataScanned: number; 

    // --- Amazon Pinpoint Attributes ---
    pinpointMTA: number; 
    pinpointEvents: number; 
    pinpointPushNotifs: number; 
    pinpointEmails: number; 
  }; 
}

export interface PricingRate {
  unit: string;
  pricePerUnit: number;
  currency: string;
}

export interface ServicePricing {
  [key: string]: PricingRate;
}

export interface PricingRepository {
  [region: string]: {
    [service: string]: ServicePricing;
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