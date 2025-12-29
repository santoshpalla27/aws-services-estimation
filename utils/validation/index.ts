/**
 * Validation Framework
 * 
 * Provides hard and soft constraint validation for AWS resources.
 * Hard constraints block save, soft constraints show warnings.
 */

export interface ValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
}

export interface ValidationContext {
    region: string;
    existingResources: any[];
    availableServices: string[];
}

export interface HardConstraint<T> {
    name: string;
    validate: (resource: T, context: ValidationContext) => boolean;
    errorMessage: string;
}

export interface SoftConstraint<T> {
    name: string;
    validate: (resource: T, context: ValidationContext) => boolean;
    warningMessage: string;
}

/**
 * Validate a resource against hard and soft constraints
 */
export function validateResource<T>(
    resource: T,
    hardConstraints: HardConstraint<T>[],
    softConstraints: SoftConstraint<T>[],
    context: ValidationContext
): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check hard constraints
    for (const constraint of hardConstraints) {
        try {
            if (!constraint.validate(resource, context)) {
                errors.push(constraint.errorMessage);
            }
        } catch (error) {
            console.error(`Hard constraint "${constraint.name}" threw error:`, error);
            errors.push(`Validation error: ${constraint.name}`);
        }
    }

    // Check soft constraints
    for (const constraint of softConstraints) {
        try {
            if (!constraint.validate(resource, context)) {
                warnings.push(constraint.warningMessage);
            }
        } catch (error) {
            console.error(`Soft constraint "${constraint.name}" threw error:`, error);
        }
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings
    };
}

/**
 * Helper: Check if a value is within a range
 */
export function isInRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
}

/**
 * Helper: Check if CIDR is valid
 */
export function isValidCIDR(cidr: string): boolean {
    const cidrRegex = /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/;
    if (!cidrRegex.test(cidr)) return false;

    const [ip, prefix] = cidr.split('/');
    const prefixNum = parseInt(prefix, 10);

    // Check prefix is valid
    if (prefixNum < 0 || prefixNum > 32) return false;

    // Check IP octets are valid
    const octets = ip.split('.').map(Number);
    return octets.every(octet => octet >= 0 && octet <= 255);
}

/**
 * Helper: Check if subnet CIDR is within VPC CIDR
 */
export function isSubnetOf(subnetCidr: string, vpcCidr: string): boolean {
    // Simplified check - in production, use proper CIDR library
    const [subnetIp, subnetPrefix] = subnetCidr.split('/');
    const [vpcIp, vpcPrefix] = vpcCidr.split('/');

    const subnetPrefixNum = parseInt(subnetPrefix, 10);
    const vpcPrefixNum = parseInt(vpcPrefix, 10);

    // Subnet prefix must be >= VPC prefix (more specific)
    if (subnetPrefixNum < vpcPrefixNum) return false;

    // Check if subnet IP starts with VPC IP prefix
    const vpcOctets = vpcIp.split('.').map(Number);
    const subnetOctets = subnetIp.split('.').map(Number);

    // Calculate how many octets to compare based on VPC prefix
    const octetsToCompare = Math.floor(vpcPrefixNum / 8);

    for (let i = 0; i < octetsToCompare; i++) {
        if (vpcOctets[i] !== subnetOctets[i]) return false;
    }

    return true;
}

/**
 * Helper: Check if CIDRs overlap
 */
export function hasOverlappingCIDRs(cidrs: string[]): boolean {
    // Simplified check - in production, use proper CIDR library
    for (let i = 0; i < cidrs.length; i++) {
        for (let j = i + 1; j < cidrs.length; j++) {
            if (cidrs[i] === cidrs[j]) return true;
        }
    }
    return false;
}

/**
 * Helper: Get CIDR prefix size
 */
export function getCIDRSize(cidr: string): number {
    const [, prefix] = cidr.split('/');
    return parseInt(prefix, 10);
}
