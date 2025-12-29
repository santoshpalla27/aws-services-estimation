import React from 'react';
import { ServiceType } from '@/types';

/**
 * Cost calculation result
 */
export interface Cost {
  hourly: number;
  monthly: number;
  breakdown: CostComponent[];
}

/**
 * Individual cost component with detailed breakdown
 */
export interface CostComponent {
  name: string;
  category: 'compute' | 'storage' | 'network' | 'requests' | 'other';
  hourly: number;
  monthly: number;
  unit: string;
  quantity: number;
  unitPrice: number;
  details?: CostDetail[];
}

/**
 * Detailed cost breakdown for a component
 */
export interface CostDetail {
  name: string;
  monthly: number;
}

/**
 * Validation result from constraint checking
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Context for validation
 */
export interface ValidationContext {
  region: string;
  existingResources: any[];
  availableServices: string[];
}

/**
 * Hard constraint that blocks save if violated
 */
export interface HardConstraint<T> {
  name: string;
  validate: (resource: T, context: ValidationContext) => boolean;
  errorMessage: string;
}

/**
 * Soft constraint that shows warning but allows save
 */
export interface SoftConstraint<T> {
  name: string;
  validate: (resource: T, context: ValidationContext) => boolean;
  warningMessage: string;
}

/**
 * Cost calculator function signature
 */
export type CostCalculator<TArch, TUsage> = (
  architecture: TArch,
  usage: TUsage,
  region: string
) => Cost;

/**
 * Props for architecture configuration component
 */
export interface ArchitectureProps<T> {
  value: T;
  onChange: (value: T) => void;
  region: string;
}

/**
 * Props for usage configuration component
 */
export interface UsageProps<T> {
  value: T;
  onChange: (value: T) => void;
  region: string;
}

/**
 * Service registry entry - metadata and components for a single AWS service
 */
export interface ServiceRegistryEntry<TArch, TUsage> {
  // Service identification
  serviceType: ServiceType;
  displayName: string;
  description: string;
  category: string;
  
  // UI Components
  architectureComponent: React.FC<ArchitectureProps<TArch>>;
  usageComponent: React.FC<UsageProps<TUsage>>;
  
  // Cost Calculator
  calculator: CostCalculator<TArch, TUsage>;
  
  // Validation
  validators: {
    hard: HardConstraint<TArch>[];
    soft: SoftConstraint<TArch>[];
  };
  
  // Default Values
  defaultArchitecture: TArch;
  defaultUsage: TUsage;
  
  // Schema key in ResourceConfig.attributes
  schemaKey: string;
  
  // Pricing key (maps to pricing JSON)
  pricingKey: string;
}

/**
 * Service registry map
 */
export type ServiceRegistry = {
  [K in ServiceType]?: ServiceRegistryEntry<any, any>;
};
