/**
 * EKS Service Registry Entry
 * 
 * This file contains all metadata, components, calculators, and validation
 * rules for the Amazon EKS service.
 */

import { ServiceRegistryEntry } from './types';
import { ServiceType } from '@/types';
import { EKSClusterSchema, DEFAULT_EKS_CLUSTER } from '@/types/schemas/eks.schema';
import { EKSArchitectureConfig, EKSUsageConfig } from '@/components/modules/EKSModule';
import { calculateEKSCost } from '@/utils/calculators/eks.calculator';
import { EKS_HARD_CONSTRAINTS, EKS_SOFT_CONSTRAINTS } from '@/utils/validation/eks.validation';

/**
 * EKS Usage Configuration
 * Separated from architecture for clarity
 */
export interface EKSUsageSchema {
    clusterHours: number; // Hours per month (default: 730)
}

/**
 * Default EKS usage configuration
 */
export const DEFAULT_EKS_USAGE: EKSUsageSchema = {
    clusterHours: 730
};

/**
 * EKS Service Registry Entry
 */
export const EKSRegistry: ServiceRegistryEntry<EKSClusterSchema, EKSUsageSchema> = {
    // Service identification
    serviceType: ServiceType.EKS,
    displayName: 'Amazon EKS',
    description: 'Managed Kubernetes service for running containerized applications',
    category: 'Containers',

    // UI Components
    architectureComponent: EKSArchitectureConfig,
    usageComponent: EKSUsageConfig,

    // Cost Calculator
    calculator: (architecture, usage, region) => {
        return calculateEKSCost(architecture, region);
    },

    // Validation
    validators: {
        hard: EKS_HARD_CONSTRAINTS,
        soft: EKS_SOFT_CONSTRAINTS
    },

    // Default Values
    defaultArchitecture: DEFAULT_EKS_CLUSTER,
    defaultUsage: DEFAULT_EKS_USAGE,

    // Schema key in ResourceConfig.attributes
    schemaKey: 'eks',

    // Pricing key (maps to pricing JSON)
    pricingKey: 'AmazonEKS'
};
