/**
 * Service Registry - Central registry for all AWS services
 * 
 * This registry eliminates hard-coded service switching logic and provides
 * a single source of truth for service metadata, components, calculators,
 * and validation rules.
 * 
 * Usage:
 * ```typescript
 * const registry = SERVICE_REGISTRY[ServiceType.EKS];
 * const cost = registry.calculator(architecture, usage, region);
 * const validation = validateResource(architecture, registry.validators.hard, registry.validators.soft, context);
 * ```
 */

import { ServiceRegistry } from './types';
import { ServiceType } from '@/types';

// Import registry entries as they're created
// import { EKSRegistry } from './eks.registry';
// import { VPCRegistry } from './vpc.registry';

/**
 * Global service registry
 * 
 * Add new services here as they're implemented.
 * Each service should have its own registry file in this directory.
 */
export const SERVICE_REGISTRY: ServiceRegistry = {
    // Services will be added here as they're implemented
    // [ServiceType.EKS]: EKSRegistry,
    // [ServiceType.VPC]: VPCRegistry,
};

/**
 * Get registry entry for a service
 * 
 * @param serviceType - The service type to look up
 * @returns The registry entry, or undefined if not found
 */
export function getServiceRegistry(serviceType: ServiceType) {
    return SERVICE_REGISTRY[serviceType];
}

/**
 * Check if a service has a registry entry
 * 
 * @param serviceType - The service type to check
 * @returns True if the service has a registry entry
 */
export function hasServiceRegistry(serviceType: ServiceType): boolean {
    return serviceType in SERVICE_REGISTRY;
}

/**
 * Get all registered service types
 * 
 * @returns Array of service types that have registry entries
 */
export function getRegisteredServices(): ServiceType[] {
    return Object.keys(SERVICE_REGISTRY) as ServiceType[];
}

// Re-export types for convenience
export * from './types';
