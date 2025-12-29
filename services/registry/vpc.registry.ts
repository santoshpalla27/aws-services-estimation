/**
 * VPC Service Registry Entry
 * 
 * This file contains all metadata, components, calculators, and validation
 * rules for the Amazon VPC service.
 */

import { ServiceRegistryEntry } from './types';
import { ServiceType } from '@/types';
import { VPCSchema, DEFAULT_VPC_SCHEMA } from '@/types/schemas/vpc.schema';
import { VPCArchitectureConfig, VPCUsageConfig } from '@/components/modules/VPCModule';
import { calculateVPCCost } from '@/utils/calculators/vpc.calculator';
import { VPC_HARD_CONSTRAINTS, VPC_SOFT_CONSTRAINTS } from '@/utils/validation/vpc.validation';

/**
 * VPC Usage Configuration
 * Separated from architecture for clarity
 */
export interface VPCUsageSchema {
    // Data transfer estimates
    dataTransferOutGB: number; // Internet egress per month
    dataTransferIntraRegionGB: number; // Cross-AZ transfer per month
}

/**
 * Default VPC usage configuration
 */
export const DEFAULT_VPC_USAGE: VPCUsageSchema = {
    dataTransferOutGB: 100,
    dataTransferIntraRegionGB: 50
};

/**
 * VPC Service Registry Entry
 */
export const VPCRegistry: ServiceRegistryEntry<VPCSchema, VPCUsageSchema> = {
    // Service identification
    serviceType: ServiceType.VPC,
    displayName: 'Amazon VPC',
    description: 'Isolated virtual network for launching AWS resources',
    category: 'Networking & Content Delivery',

    // UI Components
    architectureComponent: VPCArchitectureConfig,
    usageComponent: VPCUsageConfig,

    // Cost Calculator
    calculator: (architecture, usage, region) => {
        return calculateVPCCost(architecture, region);
    },

    // Validation
    validators: {
        hard: VPC_HARD_CONSTRAINTS,
        soft: VPC_SOFT_CONSTRAINTS
    },

    // Default Values
    defaultArchitecture: DEFAULT_VPC_SCHEMA,
    defaultUsage: DEFAULT_VPC_USAGE,

    // Schema key in ResourceConfig.attributes
    schemaKey: 'vpc',

    // Pricing key (maps to pricing JSON)
    pricingKey: 'AmazonVPC'
};
