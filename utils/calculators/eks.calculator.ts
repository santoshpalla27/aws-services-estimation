import { EKSClusterSchema, EKSNodeGroup, EKSFargateProfile } from '@/types/schemas/eks.schema';
import { Cost, CostComponent } from '@/services/registry/types';
import { ServiceType } from '@/types';
import { getPrice } from '@/services/pricingRepository';

const HOURS_PER_MONTH = 730;

/**
 * Calculate total cost for an EKS cluster
 * 
 * Formula:
 * Total Cost = Control Plane Cost + Σ(Node Group Costs) + Σ(Fargate Profile Costs)
 */
export function calculateEKSCost(
    cluster: EKSClusterSchema,
    region: string
): Cost {
    const components: CostComponent[] = [];

    // 1. Control Plane Cost
    const controlPlaneCost = calculateControlPlaneCost(cluster, region);
    components.push(controlPlaneCost);

    // 2. Node Group Costs
    cluster.nodeGroups.forEach(ng => {
        const ngCost = calculateNodeGroupCost(ng, region);
        components.push(ngCost);
    });

    // 3. Fargate Profile Costs
    cluster.fargateProfiles.forEach(fp => {
        const fpCost = calculateFargateProfileCost(fp, region);
        components.push(fpCost);
    });

    const totalHourly = components.reduce((sum, c) => sum + c.hourly, 0);
    const totalMonthly = components.reduce((sum, c) => sum + c.monthly, 0);

    return {
        hourly: totalHourly,
        monthly: totalMonthly,
        breakdown: components
    };
}

/**
 * Calculate EKS Control Plane cost
 * 
 * Pricing (us-east-1):
 * - Standard: $0.10/hour ($73/month)
 * - Extended Support: Additional $0.60/hour ($438/month)
 */
function calculateControlPlaneCost(
    cluster: EKSClusterSchema,
    region: string
): CostComponent {
    const hourlyRate = getPrice(region, ServiceType.EKS, 'control_plane_hourly').pricePerUnit;

    const extendedSupportRate = cluster.extendedSupport
        ? getPrice(region, ServiceType.EKS, 'extended_support_hourly').pricePerUnit
        : 0;

    const totalHourly = hourlyRate + extendedSupportRate;
    const totalMonthly = totalHourly * HOURS_PER_MONTH;

    return {
        name: cluster.extendedSupport ? 'EKS Control Plane (Extended Support)' : 'EKS Control Plane',
        category: 'compute',
        hourly: totalHourly,
        monthly: totalMonthly,
        unit: 'cluster-hour',
        quantity: HOURS_PER_MONTH,
        unitPrice: totalHourly,
        details: cluster.extendedSupport ? [
            {
                name: 'Standard Control Plane',
                monthly: hourlyRate * HOURS_PER_MONTH
            },
            {
                name: 'Extended Support',
                monthly: extendedSupportRate * HOURS_PER_MONTH
            }
        ] : undefined
    };
}

/**
 * Calculate Node Group cost
 * 
 * Formula:
 * Node Group Cost = 
 *   (Instance Hourly Rate × Desired Nodes × Hours/Month) +
 *   (EBS Volume Cost × Desired Nodes)
 * 
 * Where:
 * - Instance rate varies by type and capacity (On-Demand vs Spot)
 * - Spot typically 60-70% cheaper than On-Demand
 * - EBS cost = (Disk Size GB × $0.10/GB-month) for gp3
 */
function calculateNodeGroupCost(
    nodeGroup: EKSNodeGroup,
    region: string
): CostComponent {
    // 1. Compute Cost
    const instanceRate = getPrice(
        region,
        ServiceType.EC2,
        nodeGroup.instanceType
    ).pricePerUnit;

    // Spot instances are typically 65% cheaper
    const effectiveRate = nodeGroup.capacityType === 'SPOT'
        ? instanceRate * 0.35
        : instanceRate;

    const computeCost = effectiveRate * nodeGroup.desiredSize * HOURS_PER_MONTH;

    // 2. EBS Storage Cost
    const ebsKey = `ebs_${nodeGroup.diskType}_storage`;
    const ebsRate = getPrice(region, ServiceType.EC2, ebsKey).pricePerUnit;
    const storageCost = ebsRate * nodeGroup.diskSize * nodeGroup.desiredSize;

    const totalMonthly = computeCost + storageCost;

    const capacityLabel = nodeGroup.capacityType === 'SPOT' ? ' (Spot)' : '';

    return {
        name: `Node Group: ${nodeGroup.name}${capacityLabel}`,
        category: 'compute',
        hourly: totalMonthly / HOURS_PER_MONTH,
        monthly: totalMonthly,
        unit: 'node-month',
        quantity: nodeGroup.desiredSize,
        unitPrice: totalMonthly / nodeGroup.desiredSize,
        details: [
            {
                name: `Compute (${nodeGroup.instanceType} × ${nodeGroup.desiredSize})`,
                monthly: computeCost
            },
            {
                name: `EBS Storage (${nodeGroup.diskSize}GB ${nodeGroup.diskType} × ${nodeGroup.desiredSize})`,
                monthly: storageCost
            }
        ]
    };
}

/**
 * Calculate Fargate Profile cost
 * 
 * Formula:
 * Fargate Cost = 
 *   (vCPU-hour rate × vCPU × Pods × Hours) +
 *   (GB-hour rate × Memory GB × Pods × Hours)
 * 
 * Pricing (us-east-1):
 * - vCPU: $0.04048/hour
 * - Memory: $0.004445/GB-hour
 * 
 * Minimum charge: 1 minute
 * Billing: Per-second granularity
 */
function calculateFargateProfileCost(
    profile: EKSFargateProfile,
    region: string
): CostComponent {
    const cpuRate = getPrice(region, ServiceType.EKS, 'fargate_vcpu_hour').pricePerUnit;
    const memoryRate = getPrice(region, ServiceType.EKS, 'fargate_gb_hour').pricePerUnit;

    const cpuCost =
        cpuRate *
        profile.avgCpuPerPod *
        profile.estimatedPods *
        profile.avgRunningHours;

    const memoryCost =
        memoryRate *
        profile.avgMemoryPerPod *
        profile.estimatedPods *
        profile.avgRunningHours;

    const totalMonthly = cpuCost + memoryCost;

    return {
        name: `Fargate Profile: ${profile.name}`,
        category: 'compute',
        hourly: totalMonthly / HOURS_PER_MONTH,
        monthly: totalMonthly,
        unit: 'pod-hour',
        quantity: profile.estimatedPods * profile.avgRunningHours,
        unitPrice: totalMonthly / (profile.estimatedPods * profile.avgRunningHours),
        details: [
            {
                name: `vCPU (${profile.avgCpuPerPod} vCPU × ${profile.estimatedPods} pods × ${profile.avgRunningHours} hrs)`,
                monthly: cpuCost
            },
            {
                name: `Memory (${profile.avgMemoryPerPod}GB × ${profile.estimatedPods} pods × ${profile.avgRunningHours} hrs)`,
                monthly: memoryCost
            }
        ]
    };
}
