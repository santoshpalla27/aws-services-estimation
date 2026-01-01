import type { AWSRegion, PricePoint } from '../types';

/**
 * Mock Pricing Data for Development
 */
export const mockPricingData: Record<AWSRegion, Record<string, Record<string, PricePoint>>> = {
    'us-east-1': {
        AmazonEC2: {
            't3.micro': { unit: 'Hrs', pricePerUnit: 0.0104, currency: 'USD' },
            't3.small': { unit: 'Hrs', pricePerUnit: 0.0208, currency: 'USD' },
            't3.medium': { unit: 'Hrs', pricePerUnit: 0.0416, currency: 'USD' },
            'm5.large': { unit: 'Hrs', pricePerUnit: 0.096, currency: 'USD' },
            'm5.xlarge': { unit: 'Hrs', pricePerUnit: 0.192, currency: 'USD' },
            'ebs-gp3-storage': { unit: 'GB-Mo', pricePerUnit: 0.08, currency: 'USD' },
        },
        AWSLambda: {
            'requests': { unit: '1M requests', pricePerUnit: 0.20, currency: 'USD' },
            'duration-128mb': { unit: 'GB-second', pricePerUnit: 0.0000166667, currency: 'USD' },
            'duration-256mb': { unit: 'GB-second', pricePerUnit: 0.0000333334, currency: 'USD' },
            'duration-512mb': { unit: 'GB-second', pricePerUnit: 0.0000666668, currency: 'USD' },
            'duration-1024mb': { unit: 'GB-second', pricePerUnit: 0.0001333336, currency: 'USD' },
            'duration-2048mb': { unit: 'GB-second', pricePerUnit: 0.0002666672, currency: 'USD' },
        },
        AmazonS3: {
            'standard-storage': { unit: 'GB', pricePerUnit: 0.023, currency: 'USD' },
            'put-requests': { unit: '1000 requests', pricePerUnit: 0.005, currency: 'USD' },
            'get-requests': { unit: '1000 requests', pricePerUnit: 0.0004, currency: 'USD' },
        },
        AmazonRDS: {
            'db.t3.micro': { unit: 'Hrs', pricePerUnit: 0.017, currency: 'USD' },
            'db.t3.small': { unit: 'Hrs', pricePerUnit: 0.034, currency: 'USD' },
            'db.m5.large': { unit: 'Hrs', pricePerUnit: 0.19, currency: 'USD' },
            'gp3-storage': { unit: 'GB-Mo', pricePerUnit: 0.115, currency: 'USD' },
        },
        AmazonDynamoDB: {
            'storage': { unit: 'GB', pricePerUnit: 0.25, currency: 'USD' },
            'write-capacity': { unit: 'WCU-Hrs', pricePerUnit: 0.00065, currency: 'USD' },
            'read-capacity': { unit: 'RCU-Hrs', pricePerUnit: 0.00013, currency: 'USD' },
        },
    },
    // Add more regions as needed
} as any;

/**
 * Pricing Service
 * Loads and manages pricing data
 */
class PricingService {
    private pricingData: Record<string, any> = {};

    /**
     * Load pricing for a region
     */
    async loadRegionPricing(region: AWSRegion): Promise<void> {
        if (this.pricingData[region]) {
            return; // Already loaded
        }

        try {
            // Try to load from public data
            const response = await fetch(`/data/regions/${region}.json`);
            if (response.ok) {
                this.pricingData[region] = await response.json();
                return;
            }
        } catch (error) {
            console.warn(`Could not load pricing for ${region}, using mock data`);
        }

        // Fallback to mock data
        this.pricingData[region] = mockPricingData[region] || mockPricingData['us-east-1'];
    }

    /**
     * Get price for a specific service and dimension
     */
    async getPrice(
        region: AWSRegion,
        serviceCode: string,
        priceKey: string
    ): Promise<PricePoint | null> {
        await this.loadRegionPricing(region);

        const regionData = this.pricingData[region];
        if (!regionData || !regionData[serviceCode]) {
            return null;
        }

        return regionData[serviceCode][priceKey] || null;
    }

    /**
     * Get all prices for a service
     */
    async getServicePricing(
        region: AWSRegion,
        serviceCode: string
    ): Promise<Record<string, PricePoint> | null> {
        await this.loadRegionPricing(region);

        const regionData = this.pricingData[region];
        return regionData?.[serviceCode] || null;
    }
}

export const pricingService = new PricingService();
