import { ServiceType } from '../types';

export const SERVICE_GROUPS: Record<string, ServiceType[]> = {
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

export const getServiceDisplayName = (type: ServiceType): string => {
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

export const getServiceDescription = (type: ServiceType): string => {
    switch (type) {
        case ServiceType.EC2: return "Virtual servers in the cloud";
        case ServiceType.S3: return "Scalable storage in the cloud";
        case ServiceType.RDS: return "Managed relational database service";
        case ServiceType.LAMBDA: return "Run code without thinking about servers";
        case ServiceType.VPC: return "Isolated cloud resources";
        case ServiceType.DYNAMODB: return "Managed NoSQL database";
        case ServiceType.CLOUDFRONT: return "Global content delivery network";
        case ServiceType.EKS: return "Managed Kubernetes service";
        case ServiceType.ECS: return "Highly secure, reliable, and scalable container orchestration";
        case ServiceType.ELB: return "Distribute traffic across targets";
        case ServiceType.ROUTE53: return "Scalable DNS and Domain Name Registration";
        case ServiceType.SNS: return "Pub/sub messaging service";
        case ServiceType.SQS: return "Managed message queues";
        case ServiceType.API_GATEWAY: return "Build, deploy, and manage APIs";
        case ServiceType.OPENSEARCH: return "Search, visualize, and analyze data";
        default: return "Configure and estimate resource costs.";
    }
};