import type { ArchitectureTemplate } from '../types';

export const architectureTemplates: ArchitectureTemplate[] = [
    {
        id: 'simple-web-app',
        name: 'Simple Web Application',
        description: '3-tier web app with compute, database, and storage',
        category: 'Web Applications',
        difficulty: 'beginner',
        estimatedCost: {
            min: 50,
            max: 150,
        },
        tags: ['web', 'beginner', 'ec2', 'rds', 's3'],
        services: [
            {
                serviceCode: 'AmazonEC2',
                serviceName: 'Amazon EC2',
                region: 'us-east-1' as any,
                name: 'Web Server',
                configuration: {
                    instanceType: 't3.small',
                    instanceCount: 2,
                    hoursPerMonth: 730,
                    storageSize: 30,
                },
            },
            {
                serviceCode: 'AmazonRDS',
                serviceName: 'Amazon RDS',
                region: 'us-east-1' as any,
                name: 'Database',
                configuration: {
                    instanceClass: 'db.t3.small',
                    engine: 'postgres',
                    storageSize: 100,
                    multiAZ: false,
                },
            },
            {
                serviceCode: 'AmazonS3',
                serviceName: 'Amazon S3',
                region: 'us-east-1' as any,
                name: 'Static Assets',
                configuration: {
                    storageSize: 50,
                    putRequests: 10000,
                    getRequests: 1000000,
                },
            },
        ],
    },
    {
        id: 'serverless-api',
        name: 'Serverless REST API',
        description: 'API using Lambda + DynamoDB',
        category: 'Serverless',
        difficulty: 'intermediate',
        estimatedCost: {
            min: 10,
            max: 50,
        },
        tags: ['serverless', 'lambda', 'dynamodb', 'api'],
        services: [
            {
                serviceCode: 'AWSLambda',
                serviceName: 'AWS Lambda',
                region: 'us-east-1' as any,
                name: 'API Functions',
                configuration: {
                    memorySize: '512',
                    requests: 5000000,
                    durationMs: 150,
                },
            },
            {
                serviceCode: 'AmazonDynamoDB',
                serviceName: 'Amazon DynamoDB',
                region: 'us-east-1' as any,
                name: 'Data Store',
                configuration: {
                    storageSize: 25,
                    writeCapacity: 10,
                    readCapacity: 20,
                },
            },
        ],
    },
    {
        id: 'data-analytics',
        name: 'Data Analytics Platform',
        description: 'S3 data lake with Lambda processing',
        category: 'Analytics',
        difficulty: 'intermediate',
        estimatedCost: {
            min: 100,
            max: 500,
        },
        tags: ['analytics', 's3', 'lambda', 'data'],
        services: [
            {
                serviceCode: 'AmazonS3',
                serviceName: 'Amazon S3',
                region: 'us-east-1' as any,
                name: 'Data Lake',
                configuration: {
                    storageSize: 1000,
                    putRequests: 100000,
                    getRequests: 500000,
                },
            },
            {
                serviceCode: 'AWSLambda',
                serviceName: 'AWS Lambda',
                region: 'us-east-1' as any,
                name: 'Data Processing',
                configuration: {
                    memorySize: '1024',
                    requests: 2000000,
                    durationMs: 500,
                },
            },
        ],
    },
    {
        id: 'production-web',
        name: 'Production Web App (HA)',
        description: 'High availability web app with Multi-AZ database',
        category: 'Web Applications',
        difficulty: 'advanced',
        estimatedCost: {
            min: 300,
            max: 800,
        },
        tags: ['web', 'production', 'ha', 'multi-az'],
        services: [
            {
                serviceCode: 'AmazonEC2',
                serviceName: 'Amazon EC2',
                region: 'us-east-1' as any,
                name: 'Application Servers',
                configuration: {
                    instanceType: 'm5.large',
                    instanceCount: 4,
                    hoursPerMonth: 730,
                    storageSize: 100,
                },
            },
            {
                serviceCode: 'AmazonRDS',
                serviceName: 'Amazon RDS',
                region: 'us-east-1' as any,
                name: 'Database (Multi-AZ)',
                configuration: {
                    instanceClass: 'db.m5.large',
                    engine: 'postgres',
                    storageSize: 500,
                    multiAZ: true,
                },
            },
            {
                serviceCode: 'AmazonS3',
                serviceName: 'Amazon S3',
                region: 'us-east-1' as any,
                name: 'Static Assets & Backups',
                configuration: {
                    storageSize: 200,
                    putRequests: 50000,
                    getRequests: 5000000,
                },
            },
        ],
    },
    {
        id: 'dev-environment',
        name: 'Development Environment',
        description: 'Cost-optimized setup for development and testing',
        category: 'Development',
        difficulty: 'beginner',
        estimatedCost: {
            min: 20,
            max: 60,
        },
        tags: ['dev', 'testing', 'cost-optimized'],
        services: [
            {
                serviceCode: 'AmazonEC2',
                serviceName: 'Amazon EC2',
                region: 'us-east-1' as any,
                name: 'Dev Server',
                configuration: {
                    instanceType: 't3.micro',
                    instanceCount: 1,
                    hoursPerMonth: 160, // 8 hours/day, 20 days/month
                    storageSize: 20,
                },
            },
            {
                serviceCode: 'AmazonRDS',
                serviceName: 'Amazon RDS',
                region: 'us-east-1' as any,
                name: 'Dev Database',
                configuration: {
                    instanceClass: 'db.t3.micro',
                    engine: 'mysql',
                    storageSize: 20,
                    multiAZ: false,
                },
            },
        ],
    },
];
