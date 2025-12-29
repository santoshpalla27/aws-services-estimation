import { VPCSchema, NATGateway, VPCEndpoint, FlowLogsConfig } from '@/types/schemas/vpc.schema';
import { Cost, CostComponent } from '@/services/registry/types';
import { ServiceType } from '@/types';
import { getPrice } from '@/services/pricingRepository';

const HOURS_PER_MONTH = 730;

/**
 * Calculate total cost for a VPC
 * 
 * Formula:
 * Total VPC Cost = 
 *   Σ(NAT Gateway Costs) +
 *   Σ(Interface VPC Endpoint Costs) +
 *   Flow Logs Cost
 * 
 * Note: VPC itself, subnets, route tables, IGW, and Gateway endpoints are FREE
 */
export function calculateVPCCost(
    vpc: VPCSchema,
    region: string
): Cost {
    const components: CostComponent[] = [];

    // 1. NAT Gateway Costs
    vpc.natGateways.forEach(nat => {
        const natCost = calculateNATGatewayCost(nat, region);
        components.push(natCost);
    });

    // 2. Interface VPC Endpoint Costs (Gateway endpoints are free)
    vpc.vpcEndpoints
        .filter(ep => ep.type === 'Interface')
        .forEach(ep => {
            const epCost = calculateInterfaceEndpointCost(ep, region);
            components.push(epCost);
        });

    // 3. Flow Logs Cost
    if (vpc.flowLogs?.enabled) {
        const flowLogsCost = calculateFlowLogsCost(vpc.flowLogs, region);
        components.push(flowLogsCost);
    }

    const totalHourly = components.reduce((sum, c) => sum + c.hourly, 0);
    const totalMonthly = components.reduce((sum, c) => sum + c.monthly, 0);

    return {
        hourly: totalHourly,
        monthly: totalMonthly,
        breakdown: components
    };
}

/**
 * Calculate NAT Gateway cost
 * 
 * Formula:
 * NAT Gateway Cost = 
 *   (Hourly Rate × Hours/Month) +
 *   (Data Processing Rate × Data Processed GB)
 * 
 * Pricing (us-east-1):
 * - Hourly: $0.045/hour
 * - Data Processing: $0.045/GB
 */
function calculateNATGatewayCost(
    natGateway: NATGateway,
    region: string
): CostComponent {
    const hourlyRate = getPrice(region, ServiceType.VPC, 'nat_gateway_hourly').pricePerUnit;
    const dataRate = getPrice(region, ServiceType.VPC, 'nat_gateway_processed_bytes').pricePerUnit;

    const hourlyCost = hourlyRate * HOURS_PER_MONTH;
    const dataCost = natGateway.estimatedDataProcessedGB * dataRate;
    const totalMonthly = hourlyCost + dataCost;

    return {
        name: `NAT Gateway: ${natGateway.name}`,
        category: 'network',
        hourly: totalMonthly / HOURS_PER_MONTH,
        monthly: totalMonthly,
        unit: 'gateway-month',
        quantity: 1,
        unitPrice: totalMonthly,
        details: [
            {
                name: `Gateway Hours (${HOURS_PER_MONTH} hrs × $${hourlyRate}/hr)`,
                monthly: hourlyCost
            },
            {
                name: `Data Processing (${natGateway.estimatedDataProcessedGB} GB × $${dataRate}/GB)`,
                monthly: dataCost
            }
        ]
    };
}

/**
 * Calculate Interface VPC Endpoint cost
 * 
 * Formula:
 * Interface Endpoint Cost = 
 *   (Hourly Rate per AZ × Number of AZs × Hours/Month) +
 *   (Data Processing Rate × Data Processed GB)
 * 
 * Pricing (us-east-1):
 * - Hourly per AZ: $0.01/hour
 * - Data Processing: $0.01/GB
 * 
 * Note: Gateway endpoints (S3, DynamoDB) are FREE
 */
function calculateInterfaceEndpointCost(
    endpoint: VPCEndpoint,
    region: string
): CostComponent {
    const hourlyRatePerAZ = getPrice(region, ServiceType.VPC, 'vpc_endpoint_interface_hourly').pricePerUnit;
    const dataRate = 0.01; // $0.01/GB for data processing

    const numAZs = endpoint.subnetIds?.length || 1;
    const hourlyCost = hourlyRatePerAZ * numAZs * HOURS_PER_MONTH;
    const dataCost = (endpoint.estimatedDataProcessedGB || 0) * dataRate;
    const totalMonthly = hourlyCost + dataCost;

    // Extract service name from full service name
    const serviceName = endpoint.serviceName.split('.').pop() || endpoint.serviceName;

    return {
        name: `VPC Endpoint: ${serviceName} (${endpoint.name})`,
        category: 'network',
        hourly: totalMonthly / HOURS_PER_MONTH,
        monthly: totalMonthly,
        unit: 'endpoint-month',
        quantity: numAZs,
        unitPrice: totalMonthly / numAZs,
        details: [
            {
                name: `Endpoint Hours (${numAZs} AZs × ${HOURS_PER_MONTH} hrs × $${hourlyRatePerAZ}/hr)`,
                monthly: hourlyCost
            },
            {
                name: `Data Processing (${endpoint.estimatedDataProcessedGB || 0} GB × $${dataRate}/GB)`,
                monthly: dataCost
            }
        ]
    };
}

/**
 * Calculate VPC Flow Logs cost
 * 
 * Formula:
 * Flow Logs Cost = Data Ingested GB × CloudWatch Logs Ingestion Rate
 * 
 * Pricing (us-east-1):
 * - CloudWatch Logs Ingestion: $0.50/GB
 * - S3 Storage: Varies by storage class (typically $0.023/GB-month)
 * 
 * Note: This calculates CloudWatch destination cost.
 * S3 destination cost would be calculated separately in S3 service.
 */
function calculateFlowLogsCost(
    flowLogs: FlowLogsConfig,
    region: string
): CostComponent {
    if (flowLogs.destination === 'cloudwatch') {
        const ingestionRate = getPrice(region, ServiceType.VPC, 'flow_logs_ingestion').pricePerUnit;
        const totalMonthly = flowLogs.estimatedDataIngestedGB * ingestionRate;

        return {
            name: 'VPC Flow Logs (CloudWatch)',
            category: 'network',
            hourly: totalMonthly / HOURS_PER_MONTH,
            monthly: totalMonthly,
            unit: 'GB',
            quantity: flowLogs.estimatedDataIngestedGB,
            unitPrice: ingestionRate
        };
    } else {
        // S3 destination - cost is minimal (S3 storage cost calculated in S3 service)
        return {
            name: 'VPC Flow Logs (S3)',
            category: 'network',
            hourly: 0,
            monthly: 0,
            unit: 'GB',
            quantity: flowLogs.estimatedDataIngestedGB,
            unitPrice: 0,
            details: [
                {
                    name: 'S3 storage cost calculated in S3 service',
                    monthly: 0
                }
            ]
        };
    }
}
