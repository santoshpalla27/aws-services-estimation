import type { ServiceConfiguration, CostBreakdown, CostItem, AWSRegion } from '../types';
import { pricingService } from './PricingService';

/**
 * Cost Calculator Service
 * Calculates costs for service configurations
 */
class CostCalculatorService {
    /**
     * Calculate cost for a service configuration
     */
    async calculateCost(config: ServiceConfiguration): Promise<CostBreakdown> {
        const breakdown: CostItem[] = [];
        let totalCost = 0;

        // Get pricing for the service
        const servicePricing = await pricingService.getServicePricing(
            config.region,
            config.serviceCode
        );

        if (!servicePricing) {
            return {
                serviceConfiguration: config,
                monthlyCost: 0,
                breakdown: [],
            };
        }

        // Calculate based on service type
        switch (config.serviceCode) {
            case 'AmazonEC2':
                totalCost = this.calculateEC2Cost(config, servicePricing, breakdown);
                break;

            case 'AWSLambda':
                totalCost = this.calculateLambdaCost(config, servicePricing, breakdown);
                break;

            case 'AmazonS3':
                totalCost = this.calculateS3Cost(config, servicePricing, breakdown);
                break;

            case 'AmazonRDS':
                totalCost = this.calculateRDSCost(config, servicePricing, breakdown);
                break;

            case 'AmazonDynamoDB':
                totalCost = this.calculateDynamoDBCost(config, servicePricing, breakdown);
                break;
        }

        return {
            serviceConfiguration: config,
            monthlyCost: totalCost,
            breakdown,
        };
    }

    private calculateEC2Cost(
        config: ServiceConfiguration,
        pricing: Record<string, any>,
        breakdown: CostItem[]
    ): number {
        let total = 0;

        // Instance cost
        const instancePrice = pricing[config.configuration.instanceType];
        if (instancePrice) {
            const instanceCost =
                instancePrice.pricePerUnit *
                (config.configuration.hoursPerMonth || 730) *
                (config.configuration.instanceCount || 1);

            breakdown.push({
                description: `${config.configuration.instanceType} instances`,
                quantity: config.configuration.instanceCount || 1,
                unit: instancePrice.unit,
                pricePerUnit: instancePrice.pricePerUnit,
                totalCost: instanceCost,
            });

            total += instanceCost;
        }

        // EBS storage cost
        if (config.configuration.storageSize) {
            const storagePrice = pricing['ebs-gp3-storage'];
            if (storagePrice) {
                const storageCost =
                    storagePrice.pricePerUnit *
                    config.configuration.storageSize *
                    (config.configuration.instanceCount || 1);

                breakdown.push({
                    description: 'EBS GP3 Storage',
                    quantity: config.configuration.storageSize,
                    unit: storagePrice.unit,
                    pricePerUnit: storagePrice.pricePerUnit,
                    totalCost: storageCost,
                });

                total += storageCost;
            }
        }

        return total;
    }

    private calculateLambdaCost(
        config: ServiceConfiguration,
        pricing: Record<string, any>,
        breakdown: CostItem[]
    ): number {
        let total = 0;

        // Request cost
        const requestPrice = pricing['requests'];
        if (requestPrice) {
            const requests = config.configuration.requests || 0;
            const requestCost = (requests / 1000000) * requestPrice.pricePerUnit;

            breakdown.push({
                description: 'Lambda Requests',
                quantity: requests,
                unit: 'requests',
                pricePerUnit: requestPrice.pricePerUnit / 1000000,
                totalCost: requestCost,
            });

            total += requestCost;
        }

        // Duration cost
        const memoryMB = parseInt(config.configuration.memorySize || '128');
        const durationKey = `duration-${memoryMB}mb`;
        const durationPrice = pricing[durationKey];

        if (durationPrice) {
            const durationMs = config.configuration.durationMs || 0;
            const requests = config.configuration.requests || 0;

            // Convert to GB-seconds
            const gbSeconds = (memoryMB / 1024) * (durationMs / 1000) * requests;
            const durationCost = gbSeconds * durationPrice.pricePerUnit;

            breakdown.push({
                description: `Lambda Duration (${memoryMB} MB)`,
                quantity: gbSeconds,
                unit: 'GB-seconds',
                pricePerUnit: durationPrice.pricePerUnit,
                totalCost: durationCost,
            });

            total += durationCost;
        }

        return total;
    }

    private calculateS3Cost(
        config: ServiceConfiguration,
        pricing: Record<string, any>,
        breakdown: CostItem[]
    ): number {
        let total = 0;

        // Storage cost
        const storagePrice = pricing['standard-storage'];
        if (storagePrice && config.configuration.storageSize) {
            const storageCost = config.configuration.storageSize * storagePrice.pricePerUnit;

            breakdown.push({
                description: 'S3 Standard Storage',
                quantity: config.configuration.storageSize,
                unit: storagePrice.unit,
                pricePerUnit: storagePrice.pricePerUnit,
                totalCost: storageCost,
            });

            total += storageCost;
        }

        // PUT requests
        if (config.configuration.putRequests) {
            const putPrice = pricing['put-requests'];
            if (putPrice) {
                const putCost = (config.configuration.putRequests / 1000) * putPrice.pricePerUnit;

                breakdown.push({
                    description: 'S3 PUT Requests',
                    quantity: config.configuration.putRequests,
                    unit: 'requests',
                    pricePerUnit: putPrice.pricePerUnit / 1000,
                    totalCost: putCost,
                });

                total += putCost;
            }
        }

        // GET requests
        if (config.configuration.getRequests) {
            const getPrice = pricing['get-requests'];
            if (getPrice) {
                const getCost = (config.configuration.getRequests / 1000) * getPrice.pricePerUnit;

                breakdown.push({
                    description: 'S3 GET Requests',
                    quantity: config.configuration.getRequests,
                    unit: 'requests',
                    pricePerUnit: getPrice.pricePerUnit / 1000,
                    totalCost: getCost,
                });

                total += getCost;
            }
        }

        return total;
    }

    private calculateRDSCost(
        config: ServiceConfiguration,
        pricing: Record<string, any>,
        breakdown: CostItem[]
    ): number {
        let total = 0;

        // Instance cost
        const instancePrice = pricing[config.configuration.instanceClass];
        if (instancePrice) {
            let instanceCost = instancePrice.pricePerUnit * 730; // hours per month

            // Multi-AZ doubles the cost
            if (config.configuration.multiAZ) {
                instanceCost *= 2;
            }

            breakdown.push({
                description: `RDS ${config.configuration.instanceClass} (${config.configuration.multiAZ ? 'Multi-AZ' : 'Single-AZ'
                    })`,
                quantity: config.configuration.multiAZ ? 2 : 1,
                unit: instancePrice.unit,
                pricePerUnit: instancePrice.pricePerUnit,
                totalCost: instanceCost,
            });

            total += instanceCost;
        }

        // Storage cost
        if (config.configuration.storageSize) {
            const storagePrice = pricing['gp3-storage'];
            if (storagePrice) {
                let storageCost = config.configuration.storageSize * storagePrice.pricePerUnit;

                // Multi-AZ replicates storage
                if (config.configuration.multiAZ) {
                    storageCost *= 2;
                }

                breakdown.push({
                    description: 'RDS GP3 Storage',
                    quantity: config.configuration.storageSize,
                    unit: storagePrice.unit,
                    pricePerUnit: storagePrice.pricePerUnit,
                    totalCost: storageCost,
                });

                total += storageCost;
            }
        }

        return total;
    }

    private calculateDynamoDBCost(
        config: ServiceConfiguration,
        pricing: Record<string, any>,
        breakdown: CostItem[]
    ): number {
        let total = 0;

        // Storage cost
        if (config.configuration.storageSize) {
            const storagePrice = pricing['storage'];
            if (storagePrice) {
                const storageCost = config.configuration.storageSize * storagePrice.pricePerUnit;

                breakdown.push({
                    description: 'DynamoDB Storage',
                    quantity: config.configuration.storageSize,
                    unit: storagePrice.unit,
                    pricePerUnit: storagePrice.pricePerUnit,
                    totalCost: storageCost,
                });

                total += storageCost;
            }
        }

        // Write capacity cost
        if (config.configuration.writeCapacity) {
            const writePrice = pricing['write-capacity'];
            if (writePrice) {
                const writeCost = config.configuration.writeCapacity * 730 * writePrice.pricePerUnit;

                breakdown.push({
                    description: 'Write Capacity Units',
                    quantity: config.configuration.writeCapacity,
                    unit: 'WCU',
                    pricePerUnit: writePrice.pricePerUnit,
                    totalCost: writeCost,
                });

                total += writeCost;
            }
        }

        // Read capacity cost
        if (config.configuration.readCapacity) {
            const readPrice = pricing['read-capacity'];
            if (readPrice) {
                const readCost = config.configuration.readCapacity * 730 * readPrice.pricePerUnit;

                breakdown.push({
                    description: 'Read Capacity Units',
                    quantity: config.configuration.readCapacity,
                    unit: 'RCU',
                    pricePerUnit: readPrice.pricePerUnit,
                    totalCost: readCost,
                });

                total += readCost;
            }
        }

        return total;
    }
}

export const costCalculatorService = new CostCalculatorService();
