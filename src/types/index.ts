/**
 * Core Types for AWS Cost Estimator
 */

// AWS Regions
export enum AWSRegion {
    US_EAST_1 = 'us-east-1',
    US_EAST_2 = 'us-east-2',
    US_WEST_1 = 'us-west-1',
    US_WEST_2 = 'us-west-2',
    CA_CENTRAL_1 = 'ca-central-1',
    EU_WEST_1 = 'eu-west-1',
    EU_WEST_2 = 'eu-west-2',
    EU_WEST_3 = 'eu-west-3',
    EU_CENTRAL_1 = 'eu-central-1',
    EU_NORTH_1 = 'eu-north-1',
    EU_SOUTH_1 = 'eu-south-1',
    AP_SOUTH_1 = 'ap-south-1',
    AP_NORTHEAST_1 = 'ap-northeast-1',
    AP_NORTHEAST_2 = 'ap-northeast-2',
    AP_NORTHEAST_3 = 'ap-northeast-3',
    AP_SOUTHEAST_1 = 'ap-southeast-1',
    AP_SOUTHEAST_2 = 'ap-southeast-2',
    AP_SOUTHEAST_3 = 'ap-southeast-3',
    AP_EAST_1 = 'ap-east-1',
    SA_EAST_1 = 'sa-east-1',
    ME_SOUTH_1 = 'me-south-1',
    ME_CENTRAL_1 = 'me-central-1',
    AF_SOUTH_1 = 'af-south-1',
}

// Service Categories
export type ServiceCategory =
    | 'compute'
    | 'storage'
    | 'database'
    | 'networking'
    | 'analytics'
    | 'ml'
    | 'security'
    | 'management'
    | 'devtools'
    | 'integration'
    | 'containers'
    | 'serverless'
    | 'iot'
    | 'media'
    | 'migration'
    | 'quantum'
    | 'blockchain'
    | 'gametech'
    | 'other';

// Service Metadata
export interface ServiceMetadata {
    serviceCode: string;
    serviceName: string;
    category: ServiceCategory;
    description: string;
    icon?: string;
    pricingDimensions: PricingDimension[];
    regionAvailability: AWSRegion[];
    complexity: 'simple' | 'moderate' | 'complex';
}

// Pricing Dimension (defines UI input field)
export interface PricingDimension {
    id: string;
    name: string;
    description: string;
    unit: string;
    type: 'number' | 'select' | 'boolean' | 'slider';
    defaultValue?: number | string | boolean;
    options?: DimensionOption[];
    min?: number;
    max?: number;
    step?: number;
    required: boolean;
    dependsOn?: string[];
}

export interface DimensionOption {
    value: string;
    label: string;
    description?: string;
}

// Pricing Data Structure
export interface PricingManifest {
    regions: Record<AWSRegion, RegionPricing>;
    metadata: {
        lastUpdated: string;
        version: string;
    };
}

export interface RegionPricing {
    [serviceCode: string]: ServicePricing;
}

export interface ServicePricing {
    [priceKey: string]: PricePoint;
}

export interface PricePoint {
    unit: string;
    pricePerUnit: number;
    currency: string;
}

// Service Configuration (user's input)
export interface ServiceConfiguration {
    serviceCode: string;
    serviceName: string;
    region: AWSRegion;
    name: string; // user-defined name
    configuration: Record<string, any>; // key-value pairs from pricing dimensions
}

// Cost Calculation Result
export interface CostBreakdown {
    serviceConfiguration: ServiceConfiguration;
    monthlyCost: number;
    breakdown: CostItem[];
}

export interface CostItem {
    description: string;
    quantity: number;
    unit: string;
    pricePerUnit: number;
    totalCost: number;
}

// Service Catalog
export interface ServiceCatalog {
    services: ServiceMetadata[];
    categories: Record<ServiceCategory, string[]>;
    lastUpdated: string;
    version: string;
}

// Template Types
export interface ArchitectureTemplate {
    id: string;
    name: string;
    description: string;
    category: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedCost: {
        min: number;
        max: number;
    };
    services: ServiceConfiguration[];
    diagram?: string;
    tags: string[];
}
