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
import { AWSButton, AWSSelect } from './components/ui/AWS';

// --- Service Categorization ---
const SERVICE_GROUPS: Record<string, ServiceType[]> = {
  "Compute": [ServiceType.EC2, ServiceType.ASG, ServiceType.LAMBDA, ServiceType.ECS, ServiceType.EKS],
  "Storage": [ServiceType.S3, ServiceType.EFS, ServiceType.FSX, ServiceType.S3_GLACIER, ServiceType.ECR, ServiceType.ECR_PUBLIC, ServiceType.BACKUP, ServiceType.ELASTIC_DR],
  "Database": [ServiceType.RDS, ServiceType.DYNAMODB, ServiceType.ELASTICACHE],
  "Networking & Content Delivery": [ServiceType.VPC, ServiceType.ELB, ServiceType.ROUTE53, ServiceType.API_GATEWAY, ServiceType.CLOUDFRONT, ServiceType.GLOBAL_ACCELERATOR, ServiceType.DATA_TRANSFER],
  "Developer Tools": [ServiceType.CODECOMMIT, ServiceType.CODEBUILD, ServiceType.CODEDEPLOY, ServiceType.CODEPIPELINE, ServiceType.CODEARTIFACT, ServiceType.XRAY],
  "Application Integration": [ServiceType.SNS, ServiceType.SQS, ServiceType.MQ, ServiceType.STEP_FUNCTIONS, ServiceType.EVENTBRIDGE],
  "Security, Identity, & Compliance": [ServiceType.IAM, ServiceType.WAF, ServiceType.KMS, ServiceType.SECRETS_MANAGER, ServiceType.ACM, ServiceType.SHIELD, ServiceType.FMS],
  "Management & Governance": [ServiceType.CLOUDWATCH, ServiceType.CLOUDTRAIL, ServiceType.SYSTEMS_MANAGER, ServiceType.CLOUDFORMATION, ServiceType.CONFIG],
  "Analytics": [ServiceType.OPENSEARCH, ServiceType.MSK, ServiceType.KINESIS],
  "Customer Engagement": [ServiceType.SES, ServiceType.PINPOINT]
};

const getServiceDisplayName = (type: ServiceType): string => {
    switch (type) {
        case ServiceType.VPC: return 'Amazon VPC';
        case ServiceType.EC2: return 'Amazon EC2';
        case ServiceType.ASG: return 'Amazon EC2 Auto Scaling';
        case ServiceType.ELB: return 'Elastic Load Balancing';
        case ServiceType.S3: return 'Amazon S3';
        case ServiceType.CLOUDWATCH: return 'Amazon CloudWatch';
        case ServiceType.ROUTE53: return 'Amazon Route 53';
        case ServiceType.LAMBDA: return 'AWS Lambda';
        case ServiceType.RDS: return 'Amazon RDS';
        case ServiceType.API_GATEWAY: return 'Amazon API Gateway';
        case ServiceType.CLOUDFRONT: return 'Amazon CloudFront';
        case ServiceType.DYNAMODB: return 'Amazon DynamoDB';
        case ServiceType.ACM: return 'AWS Certificate Manager';
        case ServiceType.OPENSEARCH: return 'Amazon OpenSearch Service';
        case ServiceType.CLOUDTRAIL: return 'AWS CloudTrail';
        case ServiceType.ECR: return 'Amazon ECR';
        case ServiceType.ECR_PUBLIC: return 'Amazon ECR Public';
        case ServiceType.ECS: return 'Amazon ECS';
        case ServiceType.EFS: return 'Amazon EFS';
        case ServiceType.EKS: return 'Amazon EKS';
        case ServiceType.ELASTICACHE: return 'Amazon ElastiCache';
        case ServiceType.WAF: return 'AWS WAF';
        case ServiceType.SYSTEMS_MANAGER: return 'AWS Systems Manager';
        case ServiceType.SECRETS_MANAGER: return 'AWS Secrets Manager';
        case ServiceType.KMS: return 'AWS KMS';
        case ServiceType.CLOUDFORMATION: return 'AWS CloudFormation';
        case ServiceType.MSK: return 'Amazon MSK';
        case ServiceType.SNS: return 'Amazon SNS';
        case ServiceType.SQS: return 'Amazon SQS';
        case ServiceType.SES: return 'Amazon SES';
        case ServiceType.MQ: return 'Amazon MQ';
        case ServiceType.SHIELD: return 'AWS Shield';
        case ServiceType.CONFIG: return 'AWS Config';
        case ServiceType.IAM: return 'AWS IAM';
        case ServiceType.KINESIS: return 'Amazon Kinesis Data Streams';
        case ServiceType.EVENTBRIDGE: return 'Amazon EventBridge';
        case ServiceType.ELASTIC_DR: return 'AWS Elastic Disaster Recovery';
        case ServiceType.CODEARTIFACT: return 'AWS CodeArtifact';
        case ServiceType.CODEBUILD: return 'AWS CodeBuild';
        case ServiceType.CODECOMMIT: return 'AWS CodeCommit';
        case ServiceType.CODEDEPLOY: return 'AWS CodeDeploy';
        case ServiceType.CODEPIPELINE: return 'AWS CodePipeline';
        case ServiceType.DATA_TRANSFER: return 'AWS Data Transfer';
        case ServiceType.GLOBAL_ACCELERATOR: return 'AWS Global Accelerator';
        case ServiceType.FMS: return 'AWS Firewall Manager';
        case ServiceType.BACKUP: return 'AWS Backup';
        case ServiceType.FSX: return 'Amazon FSx';
        case ServiceType.S3_GLACIER: return 'Amazon S3 Glacier';
        case ServiceType.STEP_FUNCTIONS: return 'AWS Step Functions';
        case ServiceType.XRAY: return 'AWS X-Ray';
        case ServiceType.PINPOINT: return 'Amazon Pinpoint';
        default: return type;
    }
};

const getServiceDescription = (type: ServiceType): string => {
    switch (type) {
        case ServiceType.ASG: return 'Scale your instance fleet capacity up or down automatically';
        case ServiceType.ELB: return 'Automatically distribute incoming application traffic across multiple targets';
        case ServiceType.CLOUDFORMATION: return 'Model and provision all your cloud infrastructure resources';
        case ServiceType.MSK: return 'Fully managed, highly available, and secure Apache Kafka service';
        case ServiceType.VPC: return 'Provision a logically isolated section of the AWS Cloud';
        case ServiceType.EC2: return 'Secure and resizable compute capacity in the cloud';
        case ServiceType.S3: return 'Object storage built to store and retrieve any amount of data';
        case ServiceType.RDS: return 'Set up, operate, and scale a relational database in the cloud';
        case ServiceType.LAMBDA: return 'Run code without thinking about servers or clusters';
        case ServiceType.SNS: return 'Fully managed pub/sub messaging for microservices and serverless';
        case ServiceType.SQS: return 'Fully managed message queues for microservices and serverless';
        case ServiceType.SES: return 'High-scale inbound and outbound cloud email service';
        case ServiceType.MQ: return 'Managed message broker service for ActiveMQ and RabbitMQ';
        case ServiceType.SHIELD: return 'Managed Distributed Denial of Service (DDoS) protection';
        case ServiceType.CONFIG: return 'Assess, audit, and evaluate configurations of your AWS resources';
        case ServiceType.IAM: return 'Securely manage access to services and resources';
        case ServiceType.KINESIS: return 'Easily collect, process, and analyze video and data streams in real time';
        case ServiceType.EVENTBRIDGE: return 'Serverless event bus that connects application data from your own apps, SaaS, and AWS services';
        case ServiceType.ELASTIC_DR: return 'Scalable, cost-effective application recovery to AWS';
        case ServiceType.CODEARTIFACT: return 'Secure, scalable, and cost-effective artifact management for software development';
        case ServiceType.CODEBUILD: return 'Fully managed build service that compiles source code, runs tests, and produces software packages';
        case ServiceType.CODECOMMIT: return 'Secure, highly scalable, managed source control service that hosts private Git repositories';
        case ServiceType.CODEDEPLOY: return 'Automates code deployments to any instance, including EC2 instances and on-premises servers';
        case ServiceType.CODEPIPELINE: return 'Fully managed continuous delivery service that helps you automate your release pipelines';
        case ServiceType.DATA_TRANSFER: return 'Estimate aggregate data transfer costs for Internet and Region-to-Region traffic';
        case ServiceType.GLOBAL_ACCELERATOR: return 'Optimize the path to your application using the AWS global network';
        case ServiceType.FMS: return 'Centrally configure and manage firewall rules across your accounts and applications';
        case ServiceType.BACKUP: return 'Centralized backup service to protect your data across AWS services';
        case ServiceType.FSX: return 'Fully managed third-party file systems (Windows, Lustre, etc.)';
        case ServiceType.S3_GLACIER: return 'Secure, durable, and extremely low-cost cloud storage for data archiving and long-term backup.';
        case ServiceType.STEP_FUNCTIONS: return 'Visual workflow service that helps you coordinate various AWS services for serverless applications.';
        case ServiceType.XRAY: return 'Analyze and debug production, distributed applications, such as those built using a microservices architecture.';
        case ServiceType.PINPOINT: return 'Engage your customers by sending them personalized, timely, and relevant communications.';
        default: return 'Configure and estimate resource costs.';
    }
};

// --- Default Configurations ---
const DEFAULT_VPC_ATTRIBUTES = {
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
    // Placeholder EC2
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
    snapshotFrequency: 0,
    snapshotDataChange: 0,
    elasticIps: 0,
    loadBalancerType: LoadBalancerType.NONE,
    loadBalancerCount: 0,
    loadBalancerDataProcessed: 0,
    utilizationHours: 730,
    enableSpotInstances: false,
    spotDiscountPercentage: 0,
    // Placeholder S3
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
    // Placeholder CloudWatch
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
    // Placeholder Route53
    r53HostedZones: 0,
    r53StandardQueries: 0,
    r53GeoLatencyQueries: 0,
    r53HealthChecksAws: 0,
    r53HealthChecksNonAws: 0,
    r53ResolverEndpoints: 0,
    r53ResolverQueries: 0,
    r53DnsFirewallQueries: 0,
    r53Domains: 0,
    // Placeholder Lambda
    lambdaArchitecture: LambdaArchitecture.X86_64,
    lambdaMemory: 128,
    lambdaEphemeralStorage: 512,
    lambdaRequests: 0,
    lambdaDurationMs: 0,
    lambdaProvisionedConcurrency: 0,
    lambdaProvisionedHours: 0,
    // Placeholder RDS
    rdsEngine: RDSEngine.MYSQL,
    rdsInstanceClass: RDSInstanceClass.DB_T3_MICRO,
    rdsDeploymentOption: RDSDeploymentOption.SINGLE_AZ,
    rdsStorageType: EbsVolumeType.GP3,
    rdsStorageSize: 20,
    rdsStorageIops: 0,
    rdsBackupStorage: 0,
    rdsDataTransferOut: 0,
    // Placeholder API Gateway
    apiGwType: ApiGatewayType.REST,
    apiGwRequests: 0,
    apiGwDataTransferOut: 0,
    apiGwCacheEnabled: false,
    apiGwCacheSize: ApiGatewayCacheSize.GB_0_5,
    // Placeholder CloudFront
    cfPriceClass: CloudFrontPriceClass.PRICE_CLASS_100,
    cfDataTransferOut: 0,
    cfHttpRequests: 0,
    cfHttpsRequests: 0,
    cfOriginShieldEnabled: false,
    cfDedicatedIp: false,
    cfOriginShieldRequests: 0,
    // Placeholder DynamoDB
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
    // Placeholder ACM
    acmCertificateType: AcmCertificateType.PUBLIC,
    acmPrivateCaCount: 1,
    acmCertificateCount: 0,
    // Placeholder OpenSearch
    osInstanceType: OpenSearchInstanceType.T3_SMALL_SEARCH,
    osInstanceCount: 1,
    osDedicatedMasterEnabled: false,
    osDedicatedMasterType: OpenSearchInstanceType.T3_SMALL_SEARCH,
    osDedicatedMasterCount: 3,
    osStorageType: EbsVolumeType.GP3,
    osStorageSizePerNode: 10,
    osMultiAZ: false,
    osDataTransferOut: 0,
    // Placeholder CloudTrail
    trailPaidManagementEvents: 0,
    trailDataEvents: 0,
    trailInsightsEnabled: false,
    trailInsightsAnalyzedEvents: 0,
    trailLakeEnabled: false,
    trailLakeIngestion: 0,
    trailLakeStorage: 0,
    trailLakeScanned: 0,
    // Placeholder ECR
    ecrStorage: 0,
    ecrDataTransferOut: 0,
    ecrPublicStorage: 0,
    ecrPublicDataTransferOut: 0,
    // Placeholder ECS
    ecsLaunchType: ECSLaunchType.FARGATE,
    ecsTaskCount: 1,
    ecsCpu: 0.25,
    ecsMemory: 0.5,
    ecsStorage: 20,
    ecsPlatform: FargatePlatform.LINUX_X86,
    ecsRunningHours: 730,
    ecsFargateSpot: false,
    // Placeholder EFS
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
    // Placeholder EKS
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
    // Placeholder ElastiCache
    elastiCacheEngine: ElastiCacheEngine.REDIS,
    elastiCacheNodeType: ElastiCacheNodeType.CACHE_T3_MICRO,
    elastiCacheNodeCount: 1,
    elastiCacheSnapshotStorage: 0,
    // Placeholder WAF
    wafScope: WafScope.REGIONAL,
    wafWebACLCount: 1,
    wafRuleCountPerACL: 5,
    wafRequests: 10,
    wafBotControlEnabled: false,
    wafBotControlRequests: 0,
    wafFraudControlEnabled: false,
    wafFraudControlRequests: 0,
    // Placeholder Systems Manager
    ssmParameterStoreAdvancedCount: 0,
    ssmParameterStoreAPIGets: 0,
    ssmOpsItems: 0,
    ssmAutomationSteps: 0,
    ssmChangeManagerRequests: 0,
    ssmAdvancedInstances: 0,
    // Placeholder Secrets Manager
    smSecretCount: 0,
    smApiRequests: 0,
    // Placeholder KMS
    kmsKeyCount: 0,
    kmsRequests: 0,
    // Placeholder ELB
    elbType: LoadBalancerType.ALB,
    elbCount: 0,
    elbNewConnections: 0,
    elbActiveConnections: 0,
    elbProcessedBytes: 0,
    elbRuleEvaluations: 0,
    // Placeholder ASG
    asgInstanceType: InstanceType.T3_MICRO,
    asgDesiredCapacity: 0,
    asgDetailedMonitoring: false,
    asgPurchaseOption: 'On-Demand' as 'On-Demand' | 'Spot',
    asgSpotPercentage: 0,
    // Placeholder CloudFormation
    cfnHandlerOperations: 0,
    cfnHandlerDurationSeconds: 0,
    // Placeholder MSK
    mskBrokerNodeType: MSKBrokerNodeType.KAFKA_M5_LARGE,
    mskBrokerNodes: 2,
    mskStoragePerBroker: 1000,
    // Placeholder SNS
    snsRequests: 0,
    snsDataTransferOut: 0,
    // Placeholder SQS
    sqsFifo: false,
    sqsRequests: 0,
    sqsDataTransferOut: 0,
    // Placeholder SES
    sesEmailMessages: 0,
    sesDedicatedIpEnabled: false,
    sesDataTransferOut: 0,
    // Placeholder MQ
    mqEngine: AmazonMQEngine.ACTIVEMQ,
    mqDeploymentMode: AmazonMQDeploymentMode.SINGLE_INSTANCE,
    mqInstanceType: AmazonMQInstanceType.MQ_T3_MICRO,
    mqBrokerCount: 1,
    mqStorage: 10,
    // Placeholder Shield
    shieldProtectionType: ShieldProtectionType.STANDARD,
    shieldProtectedResources: 0,
    // Placeholder Config
    configConfigurationItems: 0,
    configRuleEvaluations: 0,
    // Placeholder IAM
    iamUserCount: 5,
    iamRoleCount: 2,
    iamPolicyCount: 2,
    iamGroupCount: 1,
    iamApiRequests: 0,
    // Placeholder Kinesis
    kinesisStreamMode: KinesisStreamMode.PROVISIONED,
    kinesisShardCount: 1,
    kinesisDataProcessed: 0,
    kinesisDataRetentionHours: 24,
    kinesisEnhancedFanOut: false,
    kinesisConsumerCount: 1,
    // Placeholder EventBridge
    eventBridgeCustomEvents: 0,
    eventBridgeCrossRegionEvents: 0,
    eventBridgeSchemaRegistry: false,
    eventBridgeArchiveProcessing: 0,
    // Placeholder ElasticDR
    drsSourceServerCount: 1,
    drsAvgChangeRate: 10,
    drsReplicationServerType: InstanceType.T3_MEDIUM,
    drsPointInTimeRetention: 7,
    // Placeholder CodeArtifact
    codeArtifactStorage: 0,
    codeArtifactRequests: 0,
    // Placeholder CodeBuild
    codeBuildInstanceType: CodeBuildComputeType.BUILD_GENERAL1_SMALL,
    codeBuildOs: CodeBuildOs.LINUX,
    codeBuildMinutes: 0,
    // Placeholder CodeCommit
    codeCommitUsers: 5,
    codeCommitStorage: 0,
    codeCommitRequests: 0,
    // Placeholder CodeDeploy
    codeDeployOnPremInstances: 0,
    codeDeployUpdates: 0,
    // Placeholder CodePipeline
    codePipelineActivePipelines: 1,
    // Placeholder Data Transfer
    dtOutboundInternet: 0,
    dtInterRegion: 0,
    dtIntraRegion: 0,
    // Placeholder Global Accelerator
    gaAcceleratorCount: 1,
    gaDataTransferDominant: 0,
    // Placeholder FMS
    fmsPolicyCount: 1,
    fmsShieldAdvancedEnabled: false,
    // Placeholder Backup
    backupStorageSize: 50,
    backupRestoreData: 0,
    // Placeholder FSx
    fsxType: FSxType.WINDOWS,
    fsxDeploymentType: FSxDeploymentType.MULTI_AZ,
    fsxStorageCapacity: 32,
    fsxThroughputCapacity: 8,
    fsxBackupStorage: 0,
    // Placeholder Glacier
    glacierStorage: 0,
    glacierRetrieval: 0,
    glacierRequests: 0,
    // Placeholder Step Functions
    sfnType: StepFunctionsType.STANDARD,
    sfnTransitions: 0,
    sfnExpressRequests: 0,
    sfnExpressDurationMs: 100,
    sfnExpressMemory: 64,
    // Placeholder X-Ray
    xrayTracesStored: 0,
    xrayTracesRetrieved: 0,
    xrayDataScanned: 0,
    // Placeholder Pinpoint
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
  const [view, setView] = useState<'editor' | 'project'>('editor');
  const [projectResources, setProjectResources] = useState<ResourceConfig[]>([]);
  const [activeResource, setActiveResource] = useState<ResourceConfig>(INITIAL_CONFIG);
  const [isAnnual, setIsAnnual] = useState(false);

  // Derive available VPCs for linking (EC2 Dependency)
  const availableVpcs = useMemo(() => 
    projectResources
        .filter(r => r.serviceType === ServiceType.VPC)
        .map(r => ({ id: r.id, name: r.name })),
    [projectResources]
  );

  const handleServiceChange = (service: ServiceType) => {
      if (service === activeResource.serviceType) return;
      
      let defaults = DEFAULT_VPC_ATTRIBUTES;
      let name = 'Primary VPC';
      
      if (service === ServiceType.EC2) {
          name = 'My Web Fleet';
      } else if (service === ServiceType.ASG) {
          name = 'Auto Scaling Group';
      } else if (service === ServiceType.ELB) {
          name = 'Load Balancer';
      } else if (service === ServiceType.S3) {
          name = 'Data Bucket';
      } else if (service === ServiceType.CLOUDWATCH) {
          name = 'Project Monitoring';
      } else if (service === ServiceType.ROUTE53) {
          name = 'My DNS Config';
      } else if (service === ServiceType.LAMBDA) {
          name = 'My Function';
      } else if (service === ServiceType.RDS) {
          name = 'Primary DB';
      } else if (service === ServiceType.API_GATEWAY) {
          name = 'My API';
      } else if (service === ServiceType.CLOUDFRONT) {
          name = 'My Distribution';
      } else if (service === ServiceType.DYNAMODB) {
          name = 'My Table';
      } else if (service === ServiceType.ACM) {
          name = 'My Certificate';
      } else if (service === ServiceType.OPENSEARCH) {
          name = 'My Search Domain';
      } else if (service === ServiceType.CLOUDTRAIL) {
          name = 'Trail Configuration';
      } else if (service === ServiceType.ECR) {
          name = 'Private Registry';
      } else if (service === ServiceType.ECR_PUBLIC) {
          name = 'Public Registry';
      } else if (service === ServiceType.ECS) {
          name = 'My Cluster';
      } else if (service === ServiceType.EFS) {
          name = 'My File System';
      } else if (service === ServiceType.EKS) {
          name = 'My K8s Cluster';
      } else if (service === ServiceType.ELASTICACHE) {
          name = 'My Cache';
      } else if (service === ServiceType.WAF) {
          name = 'My Web ACL';
      } else if (service === ServiceType.SYSTEMS_MANAGER) {
          name = 'My Systems Manager';
      } else if (service === ServiceType.SECRETS_MANAGER) {
          name = 'My Secrets';
      } else if (service === ServiceType.KMS) {
          name = 'My Keys';
      } else if (service === ServiceType.CLOUDFORMATION) {
          name = 'My Stack';
      } else if (service === ServiceType.MSK) {
          defaults = DEFAULT_MSK_ATTRIBUTES;
          name = 'My Kafka Cluster';
      } else if (service === ServiceType.SNS) {
          name = 'My Topic';
      } else if (service === ServiceType.SQS) {
          name = 'My Queue';
      } else if (service === ServiceType.SES) {
          name = 'My Email Identity';
      } else if (service === ServiceType.MQ) {
          name = 'My Broker';
      } else if (service === ServiceType.SHIELD) {
          name = 'Shield Protection';
      } else if (service === ServiceType.CONFIG) {
          name = 'Config Recorder';
      } else if (service === ServiceType.IAM) {
          name = 'Identity Management';
      } else if (service === ServiceType.KINESIS) {
          name = 'My Data Stream';
      } else if (service === ServiceType.EVENTBRIDGE) {
          name = 'My Event Bus';
      } else if (service === ServiceType.ELASTIC_DR) {
          name = 'My DR Project';
      } else if (service === ServiceType.CODEARTIFACT) {
          name = 'My Artifact Repo';
      } else if (service === ServiceType.CODEBUILD) {
          name = 'My Build Project';
      } else if (service === ServiceType.CODECOMMIT) {
          name = 'My Git Repo';
      } else if (service === ServiceType.CODEDEPLOY) {
          name = 'My Deploy App';
      } else if (service === ServiceType.CODEPIPELINE) {
          name = 'My Pipeline';
      } else if (service === ServiceType.DATA_TRANSFER) {
          name = 'Aggregate Data Transfer';
      } else if (service === ServiceType.GLOBAL_ACCELERATOR) {
          name = 'My Accelerator';
      } else if (service === ServiceType.FMS) {
          name = 'My Firewall Manager';
      } else if (service === ServiceType.BACKUP) {
          name = 'My Backup Vault';
      } else if (service === ServiceType.FSX) {
          name = 'My File System';
      } else if (service === ServiceType.S3_GLACIER) {
          name = 'My Glacier Vault';
      } else if (service === ServiceType.STEP_FUNCTIONS) {
          name = 'My Workflow';
      } else if (service === ServiceType.XRAY) {
          name = 'App Tracing';
      } else if (service === ServiceType.PINPOINT) {
          name = 'Engagement Project';
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
        id: `res-${Date.now()}` // Generate permanent ID
    };
    setProjectResources([...projectResources, newResource]);
    setView('project');
    
    let nextName = 'New Resource';
    // Simplified name resetting
    setActiveResource({
        ...activeResource,
        id: `temp-${Date.now() + 1}`,
        name: nextName
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

  const estimation = useMemo(() => calculateResourceCost(activeResource), [activeResource]);
  const totalCost = isAnnual ? estimation.monthlyTotal * 12 : estimation.monthlyTotal;

  const formatMoney = (amount: number) => {
    return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };

  return (
    <div className="min-h-screen font-sans text-gray-900 bg-gray-50 flex flex-col">
      
      {/* --- Header --- */}
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
                
                {/* Navigation Tabs */}
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
                      onChange={(e) => setActiveResource({...activeResource, region: e.target.value as Region})}
                   >
                       <option value={Region.US_EAST_1}>US East (N. Virginia)</option>
                       <option value={Region.US_WEST_2}>US West (Oregon)</option>
                       <option value={Region.EU_CENTRAL_1}>EU (Frankfurt)</option>
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
                  <ProjectSummary 
                    resources={projectResources} 
                    onRemove={removeResource}
                    onEdit={editResource}
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
                            <AWSSelect
                                value={activeResource.serviceType}
                                onChange={(e) => handleServiceChange(e.target.value as ServiceType)}
                                className="font-medium"
                            >
                                {Object.entries(SERVICE_GROUPS).map(([category, services]) => (
                                    <optgroup key={category} label={category}>
                                        {services.map(s => (
                                            <option key={s} value={s}>{getServiceDisplayName(s)}</option>
                                        ))}
                                    </optgroup>
                                ))}
                            </AWSSelect>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1 text-right uppercase font-semibold tracking-wider">Select a service to configure</p>
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
                        {activeResource.serviceType === ServiceType.ECR && <ECRArchitectureConfig config={activeResource} onUpdate={setActiveResource} />}
                        {activeResource.serviceType === ServiceType.ECR_PUBLIC && <ECRArchitectureConfig config={activeResource} onUpdate={setActiveResource} />}
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