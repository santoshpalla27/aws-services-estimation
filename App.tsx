// ... (Imports kept similar but add PricingProvider hook)
import React, { useState, useMemo } from 'react';
import { ResourceConfig, ServiceType, Region, NatGatewayStrategy, InstanceFamily, InstanceType, Tenancy, EbsVolumeType, LoadBalancerType, LambdaArchitecture, RDSEngine, RDSInstanceClass, RDSDeploymentOption, ApiGatewayType, ApiGatewayCacheSize, CloudFrontPriceClass, DynamoDBCapacityMode, DynamoDBTableClass, AcmCertificateType, OpenSearchInstanceType, ECSLaunchType, FargatePlatform, EFSThroughputMode, ElastiCacheEngine, ElastiCacheNodeType, WafScope, MSKBrokerNodeType, AmazonMQEngine, AmazonMQDeploymentMode, AmazonMQInstanceType, ShieldProtectionType, KinesisStreamMode, CodeBuildComputeType, CodeBuildOs, FSxType, FSxDeploymentType, StepFunctionsType } from './types';
import { VPCArchitectureConfig, VPCUsageConfig } from './components/modules/VPCModule';
import { EC2ArchitectureConfig, EC2UsageConfig } from './components/modules/EC2Module';
import { S3ArchitectureConfig, S3UsageConfig } from './components/modules/S3Module';
import { CloudWatchArchitectureConfig, CloudWatchUsageConfig } from './components/modules/CloudWatchModule';
import { Route53ArchitectureConfig, Route53UsageConfig } from './components/modules/Route53Module';
import { LambdaArchitectureConfig, LambdaUsageConfig } from './components/modules/LambdaModule';
import { RDSArchitectureConfig, RDSUsageConfig } from './components/modules/RDSModule';
import { ApiGatewayArchitectureConfig, ApiGatewayUsageConfig } from './components/modules/ApiGatewayModule';
import { CloudFrontArchitectureConfig, CloudFrontUsageConfig } from './components/modules/CloudFrontModule';
import { DynamoDBArchitectureConfig, DynamoDBUsageConfig } from './components/modules/DynamoDBModule';
import { ACMArchitectureConfig, ACMUsageConfig } from './components/modules/ACMModule';
import { OpenSearchArchitectureConfig, OpenSearchUsageConfig } from './components/modules/OpenSearchModule';
import { CloudTrailArchitectureConfig, CloudTrailUsageConfig } from './components/modules/CloudTrailModule';
import { ECRArchitectureConfig, ECRUsageConfig } from './components/modules/ECRModule';
import { ECSArchitectureConfig, ECSUsageConfig } from './components/modules/ECSModule';
import { EFSArchitectureConfig, EFSUsageConfig } from './components/modules/EFSModule';
import { EKSArchitectureConfig, EKSUsageConfig } from './components/modules/EKSModule';
import { ElastiCacheArchitectureConfig, ElastiCacheUsageConfig } from './components/modules/ElastiCacheModule';
import { WAFArchitectureConfig, WAFUsageConfig } from './components/modules/WAFModule';
import { SystemsManagerArchitectureConfig, SystemsManagerUsageConfig } from './components/modules/SystemsManagerModule';
import { SecretsManagerArchitectureConfig, SecretsManagerUsageConfig } from './components/modules/SecretsManagerModule';
import { KMSArchitectureConfig, KMSUsageConfig } from './components/modules/KMSModule';
import { ELBArchitectureConfig, ELBUsageConfig } from './components/modules/ELBModule';
import { ASGArchitectureConfig, ASGUsageConfig } from './components/modules/ASGModule';
import { CloudFormationArchitectureConfig, CloudFormationUsageConfig } from './components/modules/CloudFormationModule';
import { MSKArchitectureConfig, MSKUsageConfig } from './components/modules/MSKModule';
import { SNSArchitectureConfig, SNSUsageConfig } from './components/modules/SNSModule';
import { SQSArchitectureConfig, SQSUsageConfig } from './components/modules/SQSModule';
import { SESArchitectureConfig, SESUsageConfig } from './components/modules/SESModule';
import { AmazonMQArchitectureConfig, AmazonMQUsageConfig } from './components/modules/AmazonMQModule';
import { AWSShieldArchitectureConfig, AWSShieldUsageConfig } from './components/modules/AWSShieldModule';
import { AWSConfigArchitectureConfig, AWSConfigUsageConfig } from './components/modules/AWSConfigModule';
import { IAMArchitectureConfig, IAMUsageConfig } from './components/modules/IAMModule';
import { KinesisArchitectureConfig, KinesisUsageConfig } from './components/modules/KinesisModule';
import { EventBridgeArchitectureConfig, EventBridgeUsageConfig } from './components/modules/EventBridgeModule';
import { ElasticDRArchitectureConfig, ElasticDRUsageConfig } from './components/modules/ElasticDRModule';
import { CodeArtifactArchitectureConfig, CodeArtifactUsageConfig } from './components/modules/CodeArtifactModule';
import { CodeBuildArchitectureConfig, CodeBuildUsageConfig } from './components/modules/CodeBuildModule';
import { CodeCommitArchitectureConfig, CodeCommitUsageConfig } from './components/modules/CodeCommitModule';
import { CodeDeployArchitectureConfig, CodeDeployUsageConfig } from './components/modules/CodeDeployModule';
import { CodePipelineArchitectureConfig, CodePipelineUsageConfig } from './components/modules/CodePipelineModule';
import { DataTransferArchitectureConfig, DataTransferUsageConfig } from './components/modules/DataTransferModule';
import { GlobalAcceleratorArchitectureConfig, GlobalAcceleratorUsageConfig } from './components/modules/GlobalAcceleratorModule';
import { FMSArchitectureConfig, FMSUsageConfig } from './components/modules/FMSModule';
import { BackupArchitectureConfig, BackupUsageConfig } from './components/modules/BackupModule';
import { FSxArchitectureConfig, FSxUsageConfig } from './components/modules/FSxModule';
import { GlacierArchitectureConfig, GlacierUsageConfig } from './components/modules/GlacierModule';
import { StepFunctionsArchitectureConfig, StepFunctionsUsageConfig } from './components/modules/StepFunctionsModule';
import { XRayArchitectureConfig, XRayUsageConfig } from './components/modules/XRayModule';
import { PinpointArchitectureConfig, PinpointUsageConfig } from './components/modules/PinpointModule';
import { ProjectSummary } from './components/views/ProjectSummary';
import { calculateResourceCost } from './utils/calculator';
import { AWSButton } from './components/ui/AWS';
import { ServiceCatalogModal } from './components/views/ServiceCatalogModal';
import { usePricing } from './contexts/PricingContext';
import { getServiceDisplayName, getServiceDescription } from './utils/serviceMetadata';

// Default attributes configuration
const DEFAULT_VPC_ATTRIBUTES = {
    // ... (Keep existing default attributes) ...
    availabilityZones: 2,
    publicSubnetsPerAZ: 1,
    privateSubnetsPerAZ: 1,
    natGatewayStrategy: NatGatewayStrategy.SINGLE,
    enableInternetGateway: true,
    enableEgressOnlyInternetGateway: false,
    enableDnsHostnames: true,
    enableDnsSupport: true,
    natGateways: 1, 
    publicIps: 3, 
    vpnConnections: 0,
    clientVpnEnabled: false,
    clientVpnAssociations: 1,
    clientVpnActiveConnections: 0,
    vpcEndpointsInterface: 0,
    enableS3GatewayEndpoint: false,
    enableDynamoDBGatewayEndpoint: false,
    transitGatewayAttachments: 0,
    trafficMirrorSessions: 0,
    natDataProcessed: 100,
    dataTransferOut: 100,
    dataTransferIntraRegion: 50,
    enableVpcPeering: false,
    vpcPeeringDataTransfer: 50,
    flowLogsEnabled: true,
    flowLogsDataIngested: 10,
    transitGatewayDataProcessed: 0,
    instanceCount: 0,
    instanceFamily: InstanceFamily.GENERAL_PURPOSE,
    instanceType: InstanceType.T3_MICRO,
    tenancy: Tenancy.SHARED,
    monitoringEnabled: false,
    ebsOptimized: false,
    rootVolumeType: EbsVolumeType.GP3,
    rootVolumeSize: 8,
    rootVolumeIops: 3000,
    dataVolumeCount: 0,
    dataVolumeType: EbsVolumeType.GP3,
    dataVolumeSize: 100,
    ec2DataVolumes: [], 
    snapshotFrequency: 0,
    snapshotDataChange: 0,
    elasticIps: 0,
    loadBalancerType: LoadBalancerType.NONE,
    loadBalancerCount: 0,
    loadBalancerDataProcessed: 0,
    utilizationHours: 730,
    enableSpotInstances: false,
    spotDiscountPercentage: 0,
    s3StandardStorage: 0,
    s3InfrequentAccessStorage: 0,
    s3GlacierStorage: 0,
    s3DeepArchiveStorage: 0,
    s3PutRequests: 0,
    s3GetRequests: 0,
    s3LifecycleTransitions: 0,
    s3DataTransferOut: 0,
    s3DataTransferAcceleration: 0,
    s3ReplicationData: 0,
    s3VersioningEnabled: false,
    s3InventoryObjects: 0,
    s3AnalyticsEnabled: false,
    s3ObjectLockEnabled: false,
    s3Buckets: [{
        id: 'default', name: 'my-bucket', standardStorage: 100, iaStorage: 0, glacierStorage: 0, deepArchiveStorage: 0,
        putRequests: 1000, getRequests: 10000, lifecycleTransitions: 0, versioning: false, dataTransferOut: 10
    }],
    cwCustomMetrics: 0,
    cwDashboards: 0,
    cwAlarmsStandard: 0,
    cwAlarmsHighRes: 0,
    cwLogsIngested: 0,
    cwLogsStored: 0,
    cwLogsVended: 0,
    cwSyntheticsCanaryRuns: 0,
    cwRumEvents: 0,
    cwEventsCustom: 0,
    cwContributorInsightsRules: 0,
    r53HostedZones: 0,
    r53StandardQueries: 0,
    r53GeoLatencyQueries: 0,
    r53HealthChecksAws: 0,
    r53HealthChecksNonAws: 0,
    r53ResolverEndpoints: 0,
    r53ResolverQueries: 0,
    r53DnsFirewallQueries: 0,
    r53Domains: 0,
    route53Zones: [{ id: 'default', name: 'example.com', queryCount: 5, queryType: 'Standard' as const, healthChecksAws: 0, healthChecksNonAws: 0 }],
    lambdaArchitecture: LambdaArchitecture.X86_64,
    lambdaMemory: 128,
    lambdaEphemeralStorage: 512,
    lambdaRequests: 0,
    lambdaDurationMs: 0,
    lambdaProvisionedConcurrency: 0,
    lambdaProvisionedHours: 0,
    lambdaFunctions: [{
        id: 'default', name: 'my-function', architecture: LambdaArchitecture.X86_64, memory: 128, ephemeralStorage: 512,
        requests: 1, durationMs: 100, provisionedConcurrency: 0, provisionedHours: 0
    }],
    rdsEngine: RDSEngine.MYSQL,
    rdsInstanceClass: RDSInstanceClass.DB_T3_MICRO,
    rdsDeploymentOption: RDSDeploymentOption.SINGLE_AZ,
    rdsStorageType: EbsVolumeType.GP3,
    rdsStorageSize: 20,
    rdsStorageIops: 0,
    rdsBackupStorage: 0,
    rdsDataTransferOut: 0,
    rdsInstances: [{
        id: 'default', name: 'primary-db', engine: RDSEngine.MYSQL, instanceClass: RDSInstanceClass.DB_T3_MICRO,
        deploymentOption: RDSDeploymentOption.SINGLE_AZ, storageType: EbsVolumeType.GP3, storageSize: 20, storageIops: 0, backupStorage: 0
    }],
    apiGwType: ApiGatewayType.REST,
    apiGwRequests: 0,
    apiGwDataTransferOut: 0,
    apiGwCacheEnabled: false,
    apiGwCacheSize: ApiGatewayCacheSize.GB_0_5,
    apiGateways: [{ id: 'default', name: 'public-api', type: ApiGatewayType.REST, requests: 1, dataTransfer: 10, cacheEnabled: false, cacheSize: ApiGatewayCacheSize.GB_0_5 }],
    cfPriceClass: CloudFrontPriceClass.PRICE_CLASS_100,
    cfDataTransferOut: 0,
    cfHttpRequests: 0,
    cfHttpsRequests: 0,
    cfOriginShieldEnabled: false,
    cfDedicatedIp: false,
    cfOriginShieldRequests: 0,
    cloudFrontDistributions: [{ id: 'default', name: 'web-cdn', priceClass: CloudFrontPriceClass.PRICE_CLASS_100, dataTransfer: 50, httpRequests: 1, httpsRequests: 1, shieldEnabled: false, shieldRequests: 0, dedicatedIp: false }],
    ddbCapacityMode: DynamoDBCapacityMode.PROVISIONED,
    ddbTableClass: DynamoDBTableClass.STANDARD,
    ddbStorageSize: 0,
    ddbWCU: 5,
    ddbRCU: 5,
    ddbWriteRequestUnits: 0,
    ddbReadRequestUnits: 0,
    ddbBackupEnabled: false,
    ddbBackupSize: 0,
    ddbPitRecoveryEnabled: false,
    ddbStreamsEnabled: false,
    ddbStreamReads: 0,
    ddbGlobalTablesEnabled: false,
    ddbGlobalTableRegions: 0,
    ddbDataTransferOut: 0,
    dynamoDBTables: [{
        id: 'default', name: 'my-table', tableClass: DynamoDBTableClass.STANDARD, capacityMode: DynamoDBCapacityMode.PROVISIONED,
        storage: 10, wcu: 5, rcu: 5, writeRequests: 0, readRequests: 0, backupEnabled: false, backupSize: 0, pitrEnabled: false, streamsEnabled: false, streamReads: 0
    }],
    acmCertificateType: AcmCertificateType.PUBLIC,
    acmPrivateCaCount: 1,
    acmCertificateCount: 0,
    acmCertificates: [{ id: 'default', name: '*.example.com', type: AcmCertificateType.PUBLIC }],
    osInstanceType: OpenSearchInstanceType.T3_SMALL_SEARCH,
    osInstanceCount: 1,
    osDedicatedMasterEnabled: false,
    osDedicatedMasterType: OpenSearchInstanceType.T3_SMALL_SEARCH,
    osDedicatedMasterCount: 3,
    osStorageType: EbsVolumeType.GP3,
    osStorageSizePerNode: 10,
    osMultiAZ: false,
    osDataTransferOut: 0,
    openSearchDomains: [{ id: 'default', name: 'search-domain', instanceType: OpenSearchInstanceType.T3_SMALL_SEARCH, instanceCount: 1, masterEnabled: false, masterType: OpenSearchInstanceType.T3_SMALL_SEARCH, masterCount: 3, storageType: EbsVolumeType.GP3, storageSizePerNode: 10, multiAZ: false, dataTransferOut: 0 }],
    trailPaidManagementEvents: 0,
    trailDataEvents: 0,
    trailInsightsEnabled: false,
    trailInsightsAnalyzedEvents: 0,
    trailLakeEnabled: false,
    trailLakeIngestion: 0,
    trailLakeStorage: 0,
    trailLakeScanned: 0,
    cloudTrails: [{ id: 'default', name: 'management-events', managementEvents: true, dataEvents: false }],
    ecrStorage: 0,
    ecrDataTransferOut: 0,
    ecrRepositories: [{ id: 'default', name: 'app-repo', storage: 1, dataTransferOut: 0 }],
    ecrPublicStorage: 0,
    ecrPublicDataTransferOut: 0,
    ecsLaunchType: ECSLaunchType.FARGATE,
    ecsTaskCount: 1,
    ecsCpu: 0.25,
    ecsMemory: 0.5,
    ecsStorage: 20,
    ecsPlatform: FargatePlatform.LINUX_X86,
    ecsRunningHours: 730,
    ecsFargateSpot: false,
    efsStorageStandard: 0,
    efsStorageIA: 0,
    efsStorageArchive: 0,
    efsIsOneZone: false,
    efsThroughputMode: EFSThroughputMode.BURSTING,
    efsProvisionedThroughput: 0,
    efsElasticReadData: 0,
    efsElasticWriteData: 0,
    efsIaRetrieval: 0,
    efsArchiveRetrieval: 0,
    efsFileSystems: [{ id: 'default', name: 'shared-fs', storageStandard: 10, storageIA: 0, storageArchive: 0, isOneZone: false, throughputMode: EFSThroughputMode.BURSTING, provisionedThroughput: 0, elasticRead: 0, elasticWrite: 0, iaRetrieval: 0, archiveRetrieval: 0 }],
    eksClusterHours: 730,
    eksExtendedSupport: false,
    eksFargateEnabled: false,
    eksFargateTasks: 2,
    eksFargateCpu: 0.5,
    eksFargateMemory: 1,
    eksNodesEnabled: true,
    eksNodeCount: 2,
    eksNodeInstanceType: InstanceType.T3_MEDIUM,
    eksNodeStorageSize: 20,
    eksNodeGroups: [{ id: 'default', name: 'default-pool', instanceType: InstanceType.T3_MEDIUM, count: 2, storage: 20 }], 
    elastiCacheEngine: ElastiCacheEngine.REDIS,
    elastiCacheNodeType: ElastiCacheNodeType.CACHE_T3_MICRO,
    elastiCacheNodeCount: 1,
    elastiCacheSnapshotStorage: 0,
    elastiCacheClusters: [{ id: 'default', name: 'cache-cluster', engine: ElastiCacheEngine.REDIS, nodeType: ElastiCacheNodeType.CACHE_T3_MICRO, nodeCount: 1, snapshotStorage: 0 }],
    wafScope: WafScope.REGIONAL,
    wafWebACLCount: 1,
    wafRuleCountPerACL: 5,
    wafRequests: 10,
    wafBotControlEnabled: false,
    wafBotControlRequests: 0,
    wafFraudControlEnabled: false,
    wafFraudControlRequests: 0,
    wafWebACLs: [{ id: 'default', name: 'web-acl', scope: WafScope.REGIONAL, ruleCount: 5, requests: 10, botControl: false, fraudControl: false, botRequests: 0, fraudRequests: 0 }],
    ssmParameterStoreAdvancedCount: 0,
    ssmParameterStoreAPIGets: 0,
    ssmOpsItems: 0,
    ssmAutomationSteps: 0,
    ssmChangeManagerRequests: 0,
    ssmAdvancedInstances: 0,
    smSecretCount: 0,
    smApiRequests: 0,
    smSecrets: [{ id: 'default', name: 'db-creds', count: 1 }],
    kmsKeyCount: 0,
    kmsRequests: 0,
    kmsKeys: [{ id: 'default', name: 'app-key', requests: 0 }],
    elbType: LoadBalancerType.ALB,
    elbCount: 0,
    elbNewConnections: 0,
    elbActiveConnections: 0,
    elbProcessedBytes: 0,
    elbRuleEvaluations: 0,
    loadBalancers: [{ id: 'default', name: 'web-lb', type: LoadBalancerType.ALB, newConnections: 0, activeConnections: 0, processedBytes: 10, ruleEvaluations: 0 }],
    asgInstanceType: InstanceType.T3_MICRO,
    asgDesiredCapacity: 0,
    asgDetailedMonitoring: false,
    asgPurchaseOption: 'On-Demand' as 'On-Demand' | 'Spot',
    asgSpotPercentage: 0,
    cfnHandlerOperations: 0,
    cfnHandlerDurationSeconds: 0,
    mskBrokerNodeType: MSKBrokerNodeType.KAFKA_M5_LARGE,
    mskBrokerNodes: 2,
    mskStoragePerBroker: 1000,
    mskClusters: [{ id: 'default', name: 'kafka-cluster', brokerNodeType: MSKBrokerNodeType.KAFKA_M5_LARGE, brokerNodes: 2, storagePerBroker: 1000 }],
    snsRequests: 0,
    snsDataTransferOut: 0,
    snsTopics: [{ id: 'default', name: 'topic-1', requests: 1, dataTransfer: 0 }],
    sqsFifo: false,
    sqsRequests: 0,
    sqsDataTransferOut: 0,
    sqsQueues: [{ id: 'default', name: 'queue-1', isFifo: false, requests: 1, dataTransfer: 0 }],
    sesEmailMessages: 0,
    sesDedicatedIpEnabled: false,
    sesDataTransferOut: 0,
    mqEngine: AmazonMQEngine.ACTIVEMQ,
    mqDeploymentMode: AmazonMQDeploymentMode.SINGLE_INSTANCE,
    mqInstanceType: AmazonMQInstanceType.MQ_T3_MICRO,
    mqBrokerCount: 1,
    mqStorage: 10,
    mqBrokers: [{ id: 'default', name: 'broker-1', engine: AmazonMQEngine.ACTIVEMQ, deploymentMode: AmazonMQDeploymentMode.SINGLE_INSTANCE, instanceType: AmazonMQInstanceType.MQ_T3_MICRO, brokerCount: 1, storage: 10 }],
    shieldProtectionType: ShieldProtectionType.STANDARD,
    shieldProtectedResources: 0,
    configConfigurationItems: 0,
    configRuleEvaluations: 0,
    iamUserCount: 5,
    iamRoleCount: 2,
    iamPolicyCount: 2,
    iamGroupCount: 1,
    iamApiRequests: 0,
    kinesisStreamMode: KinesisStreamMode.PROVISIONED,
    kinesisShardCount: 1,
    kinesisDataProcessed: 0,
    kinesisDataRetentionHours: 24,
    kinesisEnhancedFanOut: false,
    kinesisConsumerCount: 1,
    kinesisStreams: [{ id: 'default', name: 'data-stream', mode: KinesisStreamMode.PROVISIONED, shardCount: 1, dataProcessed: 0, retentionHours: 24, enhancedFanOut: false, consumerCount: 0 }],
    eventBridgeCustomEvents: 0,
    eventBridgeCrossRegionEvents: 0,
    eventBridgeSchemaRegistry: false,
    eventBridgeArchiveProcessing: 0,
    drsSourceServerCount: 1,
    drsAvgChangeRate: 10,
    drsReplicationServerType: InstanceType.T3_MEDIUM,
    drsPointInTimeRetention: 7,
    codeArtifactStorage: 0,
    codeArtifactRequests: 0,
    codeBuildInstanceType: CodeBuildComputeType.BUILD_GENERAL1_SMALL,
    codeBuildOs: CodeBuildOs.LINUX,
    codeBuildMinutes: 0,
    codeBuildProjects: [{ id: 'default', name: 'build-project', os: CodeBuildOs.LINUX, computeType: CodeBuildComputeType.BUILD_GENERAL1_SMALL, buildMinutes: 100 }],
    codeCommitUsers: 5,
    codeCommitStorage: 0,
    codeCommitRequests: 0,
    codeDeployOnPremInstances: 0,
    codeDeployUpdates: 0,
    codePipelineActivePipelines: 1,
    dtOutboundInternet: 0,
    dtInterRegion: 0,
    dtIntraRegion: 0,
    gaAcceleratorCount: 1,
    gaDataTransferDominant: 0,
    gaAccelerators: [{ id: 'default', name: 'app-accelerator', fixedFee: true, dataTransfer: 0 }],
    fmsPolicyCount: 1,
    fmsShieldAdvancedEnabled: false,
    backupStorageSize: 50,
    backupRestoreData: 0,
    backupVaults: [{ id: 'default', name: 'daily-vault', storageWarm: 50, restoreData: 0 }],
    fsxType: FSxType.WINDOWS,
    fsxDeploymentType: FSxDeploymentType.MULTI_AZ,
    fsxStorageCapacity: 32,
    fsxThroughputCapacity: 8,
    fsxBackupStorage: 0,
    fsxFileSystems: [{ id: 'default', name: 'win-share', type: FSxType.WINDOWS, deploymentType: FSxDeploymentType.MULTI_AZ, storageCapacity: 32, throughputCapacity: 8, backupStorage: 0 }],
    glacierStorage: 0,
    glacierRetrieval: 0,
    glacierRequests: 0,
    glacierVaults: [{ id: 'default', name: 'long-term-vault', storage: 0, retrieval: 0, requests: 0 }],
    sfnType: StepFunctionsType.STANDARD,
    sfnTransitions: 0,
    sfnExpressRequests: 0,
    sfnExpressDurationMs: 100,
    sfnExpressMemory: 64,
    stepFunctionsStateMachines: [{ id: 'default', name: 'workflow', type: StepFunctionsType.STANDARD, transitions: 1, requests: 0, durationMs: 100, memoryMb: 64 }],
    xrayTracesStored: 0,
    xrayTracesRetrieved: 0,
    xrayDataScanned: 0,
    pinpointMTA: 0,
    pinpointEvents: 0,
    pinpointPushNotifs: 0,
    pinpointEmails: 0,
};

const DEFAULT_MSK_ATTRIBUTES = {
    ...DEFAULT_VPC_ATTRIBUTES,
    mskBrokerNodeType: MSKBrokerNodeType.KAFKA_M5_LARGE,
    mskBrokerNodes: 3,
    mskStoragePerBroker: 1000,
};

const INITIAL_CONFIG: ResourceConfig = {
  id: 'temp-1',
  serviceType: ServiceType.VPC,
  name: 'Primary VPC',
  region: Region.US_EAST_1,
  attributes: { ...DEFAULT_VPC_ATTRIBUTES }
};

const App: React.FC = () => {
  const { pricingData, loading, error } = usePricing();
  const [view, setView] = useState<'editor' | 'project'>('editor');
  const [projectResources, setProjectResources] = useState<ResourceConfig[]>([]);
  const [activeResource, setActiveResource] = useState<ResourceConfig>(INITIAL_CONFIG);
  const [isAnnual, setIsAnnual] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  // Derive available VPCs for linking (EC2 Dependency)
  const availableVpcs = useMemo(() => 
    projectResources
        .filter(r => r.serviceType === ServiceType.VPC)
        .map(r => ({ id: r.id, name: r.name })),
    [projectResources]
  );

  // Derive Available Regions from Pricing Data
  const availableRegions = useMemo(() => {
      if (!pricingData) return [Region.US_EAST_1, Region.US_WEST_2, Region.EU_CENTRAL_1];
      return Object.keys(pricingData);
  }, [pricingData]);

  const handleServiceChange = (service: ServiceType) => {
      if (service === activeResource.serviceType) return;
      
      let defaults = DEFAULT_VPC_ATTRIBUTES;
      let name = 'Primary VPC';
      
      if (service === ServiceType.EC2) { name = 'My Web Fleet'; }
      else if (service === ServiceType.ASG) { name = 'My Auto Scaling Group'; }
      // ... (Keep existing name logic)
      else if (service === ServiceType.MSK) {
          defaults = DEFAULT_MSK_ATTRIBUTES;
          name = 'My Kafka Cluster';
      } else {
          name = getServiceDisplayName(service);
      }

      setActiveResource({
          ...activeResource,
          id: `temp-${Date.now()}`,
          serviceType: service,
          name: name,
          attributes: { ...defaults }
      });
  };

  const addToProject = () => {
    const newResource = {
        ...activeResource,
        id: `res-${Date.now()}` 
    };
    setProjectResources([...projectResources, newResource]);
    setView('project');
    
    setActiveResource({
        ...activeResource,
        id: `temp-${Date.now() + 1}`,
        name: 'New Resource'
    });
  };

  const removeResource = (id: string) => {
      setProjectResources(projectResources.filter(r => r.id !== id));
  };

  const editResource = (resource: ResourceConfig) => {
      setActiveResource({ ...resource }); 
      setProjectResources(projectResources.filter(r => r.id !== resource.id));
      setView('editor');
  };

  // Pass pricingData to calculator
  const estimation = useMemo(() => {
      if (!pricingData) return { monthlyTotal: 0, breakdown: [] };
      return calculateResourceCost(activeResource, pricingData);
  }, [activeResource, pricingData]);

  const totalCost = isAnnual ? estimation.monthlyTotal * 12 : estimation.monthlyTotal;

  const formatMoney = (amount: number) => {
    return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };

  if (loading) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col">
              <div className="w-12 h-12 border-4 border-aws-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <h2 className="text-gray-700 font-semibold text-lg">Initializing Price Engine...</h2>
              <p className="text-gray-500 text-sm">Fetching latest pricing data from build pipeline</p>
          </div>
      );
  }

  if (error) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
              <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg border-l-4 border-red-500">
                  <h2 className="text-red-600 font-bold text-xl mb-2">Configuration Error</h2>
                  <p className="text-gray-700 mb-4">{error}</p>
                  <p className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
                      Ensure <code>public/data/pricing-manifest.json</code> exists.
                  </p>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen font-sans text-gray-900 bg-gray-50 flex flex-col">
      <header className="bg-aws-nav text-white shadow-lg z-50 sticky top-0">
          <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-6">
                <div 
                    onClick={() => setView('editor')}
                    className="flex items-center font-bold text-xl tracking-tight text-white hover:text-aws-primary transition-colors cursor-pointer"
                >
                    <svg className="w-8 h-8 mr-3 text-aws-primary" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/>
                    </svg>
                    <span>AWS Cost Estimator</span>
                </div>
                
                <div className="hidden md:flex bg-[#16191f] rounded-lg p-1 space-x-1 ml-8">
                     <button 
                        onClick={() => setView('editor')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${view === 'editor' ? 'bg-aws-primary text-white shadow' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
                    >
                        Service Editor
                    </button>
                    <button 
                        onClick={() => setView('project')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center ${view === 'project' ? 'bg-aws-primary text-white shadow' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
                    >
                        My Estimate
                        {projectResources.length > 0 && (
                            <span className="ml-2 bg-white text-aws-nav text-[10px] font-bold px-1.5 rounded-full h-4 flex items-center justify-center">
                                {projectResources.length}
                            </span>
                        )}
                    </button>
                </div>
            </div>
            
            <div className="flex items-center space-x-4">
               {view === 'editor' && (
                <div className="hidden md:flex items-center bg-[#16191f] rounded-md px-3 py-1.5 border border-gray-600 hover:border-gray-500 transition-colors">
                   <span className="text-gray-400 text-xs mr-2 uppercase font-bold tracking-wider">Region</span>
                   <select 
                      className="bg-transparent text-sm font-semibold text-white focus:outline-none cursor-pointer"
                      value={activeResource.region}
                      onChange={(e) => setActiveResource({...activeResource, region: e.target.value})}
                   >
                       {availableRegions.map(r => (
                           <option key={r} value={r}>{r}</option>
                       ))}
                   </select>
               </div>
               )}
            </div>
          </div>
      </header>

      {/* --- Main Content --- */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto p-6 md:p-10">
          
          {view === 'project' ? (
              // --- PROJECT VIEW ---
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="mb-8 flex justify-between items-end">
                      <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Project Estimate</h1>
                        <p className="text-gray-600 mt-2">Aggregate costs for all configured resources in your environment.</p>
                      </div>
                      <AWSButton variant="secondary" onClick={() => setView('editor')}>
                          + Add New Resource
                      </AWSButton>
                  </div>
                  {/* Pass props to Summary */}
                  <ProjectSummary 
                    resources={projectResources} 
                    onRemove={removeResource}
                    onEdit={editResource}
                    pricingData={pricingData}
                  />
              </div>
          ) : (
              // --- EDITOR VIEW ---
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
                            {getServiceDisplayName(activeResource.serviceType)}
                        </h1>
                        <p className="text-lg text-gray-600">
                            {getServiceDescription(activeResource.serviceType)}
                        </p>
                    </div>
                    {/* Service Switcher in Editor */}
                    <div className="mt-4 md:mt-0 w-full md:w-72">
                        <div className="relative">
                            <button 
                                onClick={() => setIsCatalogOpen(true)}
                                className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:border-aws-primary hover:shadow-md focus:outline-none focus:ring-2 focus:ring-aws-primary transition-all text-left group"
                            >
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-0.5">Selected Service</span>
                                    <span className="font-bold text-gray-900 truncate group-hover:text-aws-primary transition-colors">
                                        {getServiceDisplayName(activeResource.serviceType)}
                                    </span>
                                </div>
                                <div className="bg-gray-100 p-1.5 rounded-md group-hover:bg-aws-primary group-hover:text-white transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </button>
                            <p className="text-[10px] text-gray-400 mt-2 text-center uppercase font-semibold tracking-wider">Click to switch service</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                    
                    {/* Configuration Panel (7/12) */}
                    <div className="xl:col-span-7 space-y-8">
                        {activeResource.serviceType === ServiceType.VPC && <VPCArchitectureConfig config={activeResource} onUpdate={setActiveResource} />}
                        {activeResource.serviceType === ServiceType.EC2 && <EC2ArchitectureConfig config={activeResource} onUpdate={setActiveResource} availableVpcs={availableVpcs} />}
                        {activeResource.serviceType === ServiceType.ASG && <ASGArchitectureConfig config={activeResource} onUpdate={setActiveResource} />}
                        {activeResource.serviceType === ServiceType.ELB && <ELBArchitectureConfig config={activeResource} onUpdate={setActiveResource} />}
                        {activeResource.serviceType === ServiceType.S3 && <S3ArchitectureConfig config={activeResource} onUpdate={setActiveResource} />}
                        {activeResource.serviceType === ServiceType.CLOUDWATCH && <CloudWatchArchitectureConfig config={activeResource} onUpdate={setActiveResource} />}
                        {activeResource.serviceType === ServiceType.ROUTE53 && <Route53ArchitectureConfig config={activeResource} onUpdate={setActiveResource} />}
                        {activeResource.serviceType === ServiceType.LAMBDA && <LambdaArchitectureConfig config={activeResource} onUpdate={setActiveResource} />}
                        {activeResource.serviceType === ServiceType.RDS && <RDSArchitectureConfig config={activeResource} onUpdate={setActiveResource} />}
                        {activeResource.serviceType === ServiceType.API_GATEWAY && <ApiGatewayArchitectureConfig config={activeResource} onUpdate={setActiveResource} />}
                        {activeResource.serviceType === ServiceType.CLOUDFRONT && <CloudFrontArchitectureConfig config={activeResource} onUpdate={setActiveResource} />}
                        {activeResource.serviceType === ServiceType.DYNAMODB && <DynamoDBArchitectureConfig config={activeResource} onUpdate={setActiveResource} />}
                        {activeResource.serviceType === ServiceType.ACM && <ACMArchitectureConfig config={activeResource} onUpdate={setActiveResource} />}
                        {activeResource.serviceType === ServiceType.OPENSEARCH && <OpenSearchArchitectureConfig config={activeResource} onUpdate={setActiveResource} />}
                        {activeResource.serviceType === ServiceType.CLOUDTRAIL && <CloudTrailArchitectureConfig config={activeResource} onUpdate={setActiveResource} />}
                        {(activeResource.serviceType === ServiceType.ECR || activeResource.serviceType === ServiceType.ECR_PUBLIC) && <ECRArchitectureConfig config={activeResource} onUpdate={setActiveResource} />}
                        {activeResource.serviceType === ServiceType.ECS && <ECSArchitectureConfig config={activeResource} onUpdate={setActiveResource} />}
                        {activeResource.serviceType === ServiceType.EFS && <EFSArchitectureConfig config={activeResource} onUpdate={setActiveResource} />}
                        {activeResource.serviceType === ServiceType.EKS && <EKSArchitectureConfig config={activeResource} onUpdate={setActiveResource} />}
                        {activeResource.serviceType === ServiceType.ELASTICACHE && <ElastiCacheArchitectureConfig config={activeResource} onUpdate={setActiveResource} />}
                        {activeResource.serviceType === ServiceType.WAF && <WAFArchitectureConfig config={activeResource} onUpdate={setActiveResource} />}
                        {activeResource.serviceType === ServiceType.SYSTEMS_MANAGER && <SystemsManagerArchitectureConfig config={activeResource} onUpdate={setActiveResource} />}
                        {activeResource.serviceType === ServiceType.SECRETS_MANAGER && <SecretsManagerArchitectureConfig config={activeResource} onUpdate={setActiveResource} />}
                        {activeResource.serviceType === ServiceType.KMS && <KMSArchitectureConfig config={activeResource} onUpdate={setActiveResource} />}
                        {activeResource.serviceType === ServiceType.CLOUDFORMATION && <CloudFormationArchitectureConfig config={activeResource} onUpdate={setActiveResource} />}
                        {activeResource.serviceType === ServiceType.MSK && <MSKArchitectureConfig config={activeResource} onUpdate={setActiveResource} />}
                        {activeResource.serviceType === ServiceType.SNS && <SNSArchitectureConfig config={activeResource} onUpdate={setActiveResource} />}
                        {activeResource.serviceType === ServiceType.SQS && <SQSArchitectureConfig config={activeResource} onUpdate={setActiveResource} />}
                        {activeResource.serviceType === ServiceType.SES && <SESArchitectureConfig config={activeResource} onUpdate={setActiveResource} />}
                        {activeResource.serviceType === ServiceType.MQ && <AmazonMQArchitectureConfig config={activeResource} onUpdate={setActiveResource} />}
                        {activeResource.serviceType === ServiceType.SHIELD && <AWSShieldArchitectureConfig config={activeResource} onUpdate={setActiveResource} />}
                        {activeResource.serviceType === ServiceType.CONFIG && <AWSConfigArchitectureConfig config={activeResource} onUpdate={setActiveResource} />}
                        {activeResource.serviceType === ServiceType.IAM && <IAMArchitectureConfig config={activeResource} onUpdate={setActiveResource} />}
                        {activeResource.serviceType === ServiceType.KINESIS && <KinesisArchitectureConfig config={activeResource} onUpdate={setActiveResource} />}
                        {activeResource.serviceType === ServiceType.EVENTBRIDGE && <EventBridgeArchitectureConfig config={activeResource} onUpdate={setActiveResource} />}
                        {activeResource.serviceType === ServiceType.ELASTIC_DR && <ElasticDRArchitectureConfig config={activeResource} onUpdate={setActiveResource} />}
                        {activeResource.serviceType === ServiceType.CODEARTIFACT && <CodeArtifactArchitectureConfig config={activeResource} onUpdate={setActiveResource} />}
                        {activeResource.serviceType === ServiceType.CODEBUILD && <CodeBuildArchitectureConfig config={activeResource} onUpdate={setActiveResource} />}
                        {activeResource.serviceType === ServiceType.CODECOMMIT && <CodeCommitArchitectureConfig config={activeResource} onUpdate={setActiveResource} />}
                        {activeResource.serviceType === ServiceType.CODEDEPLOY && <CodeDeployArchitectureConfig config={activeResource} onUpdate={setActiveResource} />}
                        {activeResource.serviceType === ServiceType.CODEPIPELINE && <CodePipelineArchitectureConfig config={activeResource} onUpdate={setActiveResource} />}
                        {activeResource.serviceType === ServiceType.DATA_TRANSFER && <DataTransferArchitectureConfig config={activeResource} onUpdate={setActiveResource} />}
                        {activeResource.serviceType === ServiceType.GLOBAL_ACCELERATOR && <GlobalAcceleratorArchitectureConfig config={activeResource} onUpdate={setActiveResource} />}
                        {activeResource.serviceType === ServiceType.FMS && <FMSArchitectureConfig config={activeResource} onUpdate={setActiveResource} />}
                        {activeResource.serviceType === ServiceType.BACKUP && <BackupArchitectureConfig config={activeResource} onUpdate={setActiveResource} />}
                        {activeResource.serviceType === ServiceType.FSX && <FSxArchitectureConfig config={activeResource} onUpdate={setActiveResource} />}
                        {activeResource.serviceType === ServiceType.S3_GLACIER && <GlacierArchitectureConfig config={activeResource} onUpdate={setActiveResource} />}
                        {activeResource.serviceType === ServiceType.STEP_FUNCTIONS && <StepFunctionsArchitectureConfig config={activeResource} onUpdate={setActiveResource} />}
                        {activeResource.serviceType === ServiceType.XRAY && <XRayArchitectureConfig config={activeResource} onUpdate={setActiveResource} />}
                        {activeResource.serviceType === ServiceType.PINPOINT && <PinpointArchitectureConfig config={activeResource} onUpdate={setActiveResource} />}
                    </div>

                    {/* Estimates Panel (5/12) */}
                    <div className="xl:col-span-5 sticky top-24 space-y-8">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mr-3 text-sm font-extrabold">2</span>
                                Usage Profile
                            </h2>
                            <div className="space-y-4">
                                {activeResource.serviceType === ServiceType.VPC && <VPCUsageConfig config={activeResource} onUpdate={setActiveResource} />}
                                {activeResource.serviceType === ServiceType.EC2 && <EC2UsageConfig config={activeResource} onUpdate={setActiveResource} />}
                                {activeResource.serviceType === ServiceType.ASG && <ASGUsageConfig config={activeResource} onUpdate={setActiveResource} />}
                                {activeResource.serviceType === ServiceType.ELB && <ELBUsageConfig config={activeResource} onUpdate={setActiveResource} />}
                                {activeResource.serviceType === ServiceType.S3 && <S3UsageConfig config={activeResource} onUpdate={setActiveResource} />}
                                {activeResource.serviceType === ServiceType.CLOUDWATCH && <CloudWatchUsageConfig config={activeResource} onUpdate={setActiveResource} />}
                                {activeResource.serviceType === ServiceType.ROUTE53 && <Route53UsageConfig config={activeResource} onUpdate={setActiveResource} />}
                                {activeResource.serviceType === ServiceType.LAMBDA && <LambdaUsageConfig config={activeResource} onUpdate={setActiveResource} />}
                                {activeResource.serviceType === ServiceType.RDS && <RDSUsageConfig config={activeResource} onUpdate={setActiveResource} />}
                                {activeResource.serviceType === ServiceType.API_GATEWAY && <ApiGatewayUsageConfig config={activeResource} onUpdate={setActiveResource} />}
                                {activeResource.serviceType === ServiceType.CLOUDFRONT && <CloudFrontUsageConfig config={activeResource} onUpdate={setActiveResource} />}
                                {activeResource.serviceType === ServiceType.DYNAMODB && <DynamoDBUsageConfig config={activeResource} onUpdate={setActiveResource} />}
                                {activeResource.serviceType === ServiceType.ACM && <ACMUsageConfig config={activeResource} onUpdate={setActiveResource} />}
                                {activeResource.serviceType === ServiceType.OPENSEARCH && <OpenSearchUsageConfig config={activeResource} onUpdate={setActiveResource} />}
                                {activeResource.serviceType === ServiceType.CLOUDTRAIL && <CloudTrailUsageConfig config={activeResource} onUpdate={setActiveResource} />}
                                {(activeResource.serviceType === ServiceType.ECR || activeResource.serviceType === ServiceType.ECR_PUBLIC) && <ECRUsageConfig config={activeResource} onUpdate={setActiveResource} />}
                                {activeResource.serviceType === ServiceType.ECS && <ECSUsageConfig config={activeResource} onUpdate={setActiveResource} />}
                                {activeResource.serviceType === ServiceType.EFS && <EFSUsageConfig config={activeResource} onUpdate={setActiveResource} />}
                                {activeResource.serviceType === ServiceType.EKS && <EKSUsageConfig config={activeResource} onUpdate={setActiveResource} />}
                                {activeResource.serviceType === ServiceType.ELASTICACHE && <ElastiCacheUsageConfig config={activeResource} onUpdate={setActiveResource} />}
                                {activeResource.serviceType === ServiceType.WAF && <WAFUsageConfig config={activeResource} onUpdate={setActiveResource} />}
                                {activeResource.serviceType === ServiceType.SYSTEMS_MANAGER && <SystemsManagerUsageConfig config={activeResource} onUpdate={setActiveResource} />}
                                {activeResource.serviceType === ServiceType.SECRETS_MANAGER && <SecretsManagerUsageConfig config={activeResource} onUpdate={setActiveResource} />}
                                {activeResource.serviceType === ServiceType.KMS && <KMSUsageConfig config={activeResource} onUpdate={setActiveResource} />}
                                {activeResource.serviceType === ServiceType.CLOUDFORMATION && <CloudFormationUsageConfig config={activeResource} onUpdate={setActiveResource} />}
                                {activeResource.serviceType === ServiceType.MSK && <MSKUsageConfig config={activeResource} onUpdate={setActiveResource} />}
                                {activeResource.serviceType === ServiceType.SNS && <SNSUsageConfig config={activeResource} onUpdate={setActiveResource} />}
                                {activeResource.serviceType === ServiceType.SQS && <SQSUsageConfig config={activeResource} onUpdate={setActiveResource} />}
                                {activeResource.serviceType === ServiceType.SES && <SESUsageConfig config={activeResource} onUpdate={setActiveResource} />}
                                {activeResource.serviceType === ServiceType.MQ && <AmazonMQUsageConfig config={activeResource} onUpdate={setActiveResource} />}
                                {activeResource.serviceType === ServiceType.SHIELD && <AWSShieldUsageConfig config={activeResource} onUpdate={setActiveResource} />}
                                {activeResource.serviceType === ServiceType.CONFIG && <AWSConfigUsageConfig config={activeResource} onUpdate={setActiveResource} />}
                                {activeResource.serviceType === ServiceType.IAM && <IAMUsageConfig config={activeResource} onUpdate={setActiveResource} />}
                                {activeResource.serviceType === ServiceType.KINESIS && <KinesisUsageConfig config={activeResource} onUpdate={setActiveResource} />}
                                {activeResource.serviceType === ServiceType.EVENTBRIDGE && <EventBridgeUsageConfig config={activeResource} onUpdate={setActiveResource} />}
                                {activeResource.serviceType === ServiceType.ELASTIC_DR && <ElasticDRUsageConfig config={activeResource} onUpdate={setActiveResource} />}
                                {activeResource.serviceType === ServiceType.CODEARTIFACT && <CodeArtifactUsageConfig config={activeResource} onUpdate={setActiveResource} />}
                                {activeResource.serviceType === ServiceType.CODEBUILD && <CodeBuildUsageConfig config={activeResource} onUpdate={setActiveResource} />}
                                {activeResource.serviceType === ServiceType.CODECOMMIT && <CodeCommitUsageConfig config={activeResource} onUpdate={setActiveResource} />}
                                {activeResource.serviceType === ServiceType.CODEDEPLOY && <CodeDeployUsageConfig config={activeResource} onUpdate={setActiveResource} />}
                                {activeResource.serviceType === ServiceType.CODEPIPELINE && <CodePipelineUsageConfig config={activeResource} onUpdate={setActiveResource} />}
                                {activeResource.serviceType === ServiceType.DATA_TRANSFER && <DataTransferUsageConfig config={activeResource} onUpdate={setActiveResource} />}
                                {activeResource.serviceType === ServiceType.GLOBAL_ACCELERATOR && <GlobalAcceleratorUsageConfig config={activeResource} onUpdate={setActiveResource} />}
                                {activeResource.serviceType === ServiceType.FMS && <FMSUsageConfig config={activeResource} onUpdate={setActiveResource} />}
                                {activeResource.serviceType === ServiceType.BACKUP && <BackupUsageConfig config={activeResource} onUpdate={setActiveResource} />}
                                {activeResource.serviceType === ServiceType.FSX && <FSxUsageConfig config={activeResource} onUpdate={setActiveResource} />}
                                {activeResource.serviceType === ServiceType.S3_GLACIER && <GlacierUsageConfig config={activeResource} onUpdate={setActiveResource} />}
                                {activeResource.serviceType === ServiceType.STEP_FUNCTIONS && <StepFunctionsUsageConfig config={activeResource} onUpdate={setActiveResource} />}
                                {activeResource.serviceType === ServiceType.XRAY && <XRayUsageConfig config={activeResource} onUpdate={setActiveResource} />}
                                {activeResource.serviceType === ServiceType.PINPOINT && <PinpointUsageConfig config={activeResource} onUpdate={setActiveResource} />}
                            </div>
                        </div>

                        {/* Cost Card */}
                        <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden ring-1 ring-black/5">
                            <div className="bg-gradient-to-r from-[#232f3e] to-[#2c3e50] p-6 text-white">
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="text-lg font-bold">Estimated Cost</h3>
                                    <div className="bg-white/10 p-1 rounded-lg flex text-xs font-bold backdrop-blur-sm">
                                        <button 
                                            className={`px-3 py-1.5 rounded-md transition-all ${!isAnnual ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-300 hover:text-white'}`}
                                            onClick={() => setIsAnnual(false)}
                                        >Monthly</button>
                                        <button 
                                            className={`px-3 py-1.5 rounded-md transition-all ${isAnnual ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-300 hover:text-white'}`}
                                            onClick={() => setIsAnnual(true)}
                                        >Annual</button>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 md:p-8">
                                <div className="flex items-baseline justify-center mb-6">
                                    <span className="text-5xl font-extrabold text-gray-900 tracking-tight">
                                        {formatMoney(totalCost)}
                                    </span>
                                    <span className="text-gray-500 font-medium ml-2">
                                        / {isAnnual ? 'year' : 'month'}
                                    </span>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-100">
                                    <div className="space-y-2">
                                        {estimation.breakdown.slice(0, 3).map((item, i) => (
                                            <div key={i} className="flex justify-between text-sm">
                                                <span className="text-gray-600">{item.label}</span>
                                                <span className="font-semibold text-gray-900">{formatMoney(isAnnual ? item.total * 12 : item.total)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="space-y-3">
                                    <AWSButton fullWidth onClick={addToProject}>
                                        Add to Estimate Report
                                    </AWSButton>
                                    <p className="text-xs text-center text-gray-500 pt-2">
                                        Adds this configuration to your project summary.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
              </div>
          )}
          
          <ServiceCatalogModal 
                isOpen={isCatalogOpen} 
                onClose={() => setIsCatalogOpen(false)} 
                onSelect={handleServiceChange} 
          />
      </div>
      
      {/* Footer */}
      <footer className="mt-auto py-8 bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-6 text-center">
             <p className="text-sm text-gray-500 font-medium mb-2">AWS Cost Estimator &copy; 2025</p>
          </div>
      </footer>
    </div>
  );
};

export default App;