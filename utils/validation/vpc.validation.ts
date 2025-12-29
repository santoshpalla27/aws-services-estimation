import { VPCSchema } from '@/types/schemas/vpc.schema';
import { HardConstraint, SoftConstraint, isValidCIDR, isSubnetOf, hasOverlappingCIDRs, getCIDRSize } from './index';

/**
 * VPC Hard Constraints - Block save if violated
 */
export const VPC_HARD_CONSTRAINTS: HardConstraint<VPCSchema>[] = [
    {
        name: 'at-least-one-subnet',
        validate: (vpc) => vpc.subnets.length >= 1,
        errorMessage: 'VPC must have at least one subnet'
    },
    {
        name: 'valid-vpc-cidr',
        validate: (vpc) =>
            isValidCIDR(vpc.cidrBlock) &&
            getCIDRSize(vpc.cidrBlock) >= 16 &&
            getCIDRSize(vpc.cidrBlock) <= 28,
        errorMessage: 'VPC CIDR must be valid and between /16 and /28'
    },
    {
        name: 'subnet-within-vpc-cidr',
        validate: (vpc) =>
            vpc.subnets.every(s => isSubnetOf(s.cidrBlock, vpc.cidrBlock)),
        errorMessage: 'All subnet CIDRs must be within VPC CIDR range'
    },
    {
        name: 'no-overlapping-subnets',
        validate: (vpc) => {
            const cidrs = vpc.subnets.map(s => s.cidrBlock);
            return !hasOverlappingCIDRs(cidrs);
        },
        errorMessage: 'Subnet CIDRs cannot overlap'
    },
    {
        name: 'nat-in-public-subnet',
        validate: (vpc) =>
            vpc.natGateways.every(nat => {
                const subnet = vpc.subnets.find(s => s.id === nat.subnetId);
                return subnet?.type === 'public';
            }),
        errorMessage: 'NAT Gateway must be placed in a public subnet'
    },
    {
        name: 'public-subnet-needs-igw',
        validate: (vpc) => {
            const hasPublicSubnet = vpc.subnets.some(s => s.type === 'public');
            return !hasPublicSubnet || vpc.internetGateway !== null;
        },
        errorMessage: 'Public subnets require an Internet Gateway'
    },
    {
        name: 'valid-subnet-cidrs',
        validate: (vpc) =>
            vpc.subnets.every(s => isValidCIDR(s.cidrBlock)),
        errorMessage: 'All subnet CIDRs must be valid'
    },
    {
        name: 'interface-endpoint-has-subnets',
        validate: (vpc) =>
            vpc.vpcEndpoints
                .filter(ep => ep.type === 'Interface')
                .every(ep => ep.subnetIds && ep.subnetIds.length > 0),
        errorMessage: 'Interface VPC Endpoints must have at least one subnet'
    }
];

/**
 * VPC Soft Constraints - Show warnings but allow save
 */
export const VPC_SOFT_CONSTRAINTS: SoftConstraint<VPCSchema>[] = [
    {
        name: 'multi-az-recommendation',
        validate: (vpc) => {
            const azs = new Set(vpc.subnets.map(s => s.availabilityZone));
            return azs.size >= 2;
        },
        warningMessage: 'Consider using at least 2 AZs for high availability'
    },
    {
        name: 'nat-gateway-ha',
        validate: (vpc) => {
            const publicSubnetAZs = new Set(
                vpc.subnets
                    .filter(s => s.type === 'public')
                    .map(s => s.availabilityZone)
            );
            const natGatewayAZs = new Set(
                vpc.natGateways.map(nat => {
                    const subnet = vpc.subnets.find(s => s.id === nat.subnetId);
                    return subnet?.availabilityZone;
                })
            );

            return publicSubnetAZs.size === 0 || publicSubnetAZs.size === natGatewayAZs.size;
        },
        warningMessage: 'For HA, deploy one NAT Gateway per availability zone with public subnets'
    },
    {
        name: 'dns-hostnames-enabled',
        validate: (vpc) => vpc.enableDnsHostnames,
        warningMessage: 'DNS hostnames should be enabled for most use cases (required for private hosted zones)'
    },
    {
        name: 'flow-logs-recommendation',
        validate: (vpc) => vpc.flowLogs?.enabled === true,
        warningMessage: 'VPC Flow Logs are recommended for security monitoring and troubleshooting'
    },
    {
        name: 'interface-endpoint-multi-az',
        validate: (vpc) => {
            const interfaceEndpoints = vpc.vpcEndpoints.filter(ep => ep.type === 'Interface');
            return interfaceEndpoints.every(ep =>
                ep.subnetIds && ep.subnetIds.length >= 2
            );
        },
        warningMessage: 'Interface VPC Endpoints should span multiple AZs for high availability'
    },
    {
        name: 'private-subnet-nat-warning',
        validate: (vpc) => {
            const hasPrivateSubnet = vpc.subnets.some(s => s.type === 'private');
            return !hasPrivateSubnet || vpc.natGateways.length > 0;
        },
        warningMessage: 'Private subnets require NAT Gateway for outbound internet access'
    },
    {
        name: 'cidr-size-recommendation',
        validate: (vpc) => getCIDRSize(vpc.cidrBlock) <= 20,
        warningMessage: 'VPC CIDR larger than /20 may limit the number of available IP addresses for growth'
    }
];
