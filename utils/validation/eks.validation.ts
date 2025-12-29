import { EKSClusterSchema } from '@/types/schemas/eks.schema';
import { HardConstraint, SoftConstraint } from '../index';

/**
 * EKS Hard Constraints - Block save if violated
 */
export const EKS_HARD_CONSTRAINTS: HardConstraint<EKSClusterSchema>[] = [
    {
        name: 'at-least-one-compute',
        validate: (cluster) =>
            cluster.nodeGroups.length > 0 || cluster.fargateProfiles.length > 0,
        errorMessage: 'EKS cluster must have at least one node group or Fargate profile'
    },
    {
        name: 'desired-within-range',
        validate: (cluster) =>
            cluster.nodeGroups.every(ng =>
                ng.desiredSize >= ng.minSize && ng.desiredSize <= ng.maxSize
            ),
        errorMessage: 'Desired capacity must be between min and max for all node groups'
    },
    {
        name: 'min-less-than-max',
        validate: (cluster) =>
            cluster.nodeGroups.every(ng => ng.minSize <= ng.maxSize),
        errorMessage: 'Min size must be less than or equal to max size for all node groups'
    },
    {
        name: 'positive-sizes',
        validate: (cluster) =>
            cluster.nodeGroups.every(ng =>
                ng.minSize >= 0 && ng.desiredSize >= 0 && ng.maxSize >= 1
            ),
        errorMessage: 'Node group sizes must be non-negative (max must be at least 1)'
    },
    {
        name: 'valid-disk-size',
        validate: (cluster) =>
            cluster.nodeGroups.every(ng => ng.diskSize >= 1 && ng.diskSize <= 16384),
        errorMessage: 'Node group disk size must be between 1 GB and 16,384 GB'
    },
    {
        name: 'fargate-positive-resources',
        validate: (cluster) =>
            cluster.fargateProfiles.every(fp =>
                fp.estimatedPods > 0 &&
                fp.avgCpuPerPod > 0 &&
                fp.avgMemoryPerPod > 0 &&
                fp.avgRunningHours > 0
            ),
        errorMessage: 'Fargate profile resources must be positive values'
    }
];

/**
 * EKS Soft Constraints - Show warnings but allow save
 */
export const EKS_SOFT_CONSTRAINTS: SoftConstraint<EKSClusterSchema>[] = [
    {
        name: 'multi-az-recommendation',
        validate: (cluster) => {
            if (cluster.nodeGroups.length === 0) return true;

            const azs = new Set(
                cluster.nodeGroups.flatMap(ng => ng.availabilityZones)
            );
            return azs.size >= 2;
        },
        warningMessage: 'Consider deploying node groups across multiple AZs for high availability'
    },
    {
        name: 'spot-interruption-warning',
        validate: (cluster) =>
            !cluster.nodeGroups.some(ng => ng.capacityType === 'SPOT'),
        warningMessage: 'Spot instances can be interrupted with 2-minute notice. Ensure your workloads can handle interruptions.'
    },
    {
        name: 'under-provisioned-warning',
        validate: (cluster) =>
            cluster.nodeGroups.every(ng => ng.desiredSize >= 2),
        warningMessage: 'Node groups with desired capacity < 2 may not provide adequate availability'
    },
    {
        name: 'extended-support-cost-warning',
        validate: (cluster) => !cluster.extendedSupport,
        warningMessage: 'Extended support adds $438/month per cluster. Only enable if using Kubernetes versions older than 14 months.'
    },
    {
        name: 'fargate-cost-awareness',
        validate: (cluster) => cluster.fargateProfiles.length === 0,
        warningMessage: 'Fargate pricing is per-second with minimum 1-minute charge. Ensure your workload patterns justify serverless compute.'
    },
    {
        name: 'large-disk-warning',
        validate: (cluster) =>
            cluster.nodeGroups.every(ng => ng.diskSize <= 100),
        warningMessage: 'Node groups with disk size > 100 GB may indicate inefficient storage usage. Consider using EBS volumes or EFS for persistent data.'
    }
];
