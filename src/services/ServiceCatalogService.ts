import type { ServiceCatalog, ServiceMetadata, ServiceCategory } from '../types';
import { mockServiceCatalog } from './mockData';

/**
 * Service Catalog Service
 * Loads and manages the service catalog
 */
class ServiceCatalogService {
    private catalog: ServiceCatalog | null = null;

    /**
     * Load service catalog
     * In production: fetch from /data/metadata/service-catalog.json
     * In development: use mock data
     */
    async loadCatalog(): Promise<ServiceCatalog> {
        if (this.catalog) {
            return this.catalog;
        }

        try {
            // Try to load from public data
            const response = await fetch('/data/metadata/service-catalog.json');
            if (response.ok) {
                this.catalog = await response.json();
                return this.catalog;
            }
        } catch (error) {
            console.warn('Could not load service catalog from file, using mock data');
        }

        // Fallback to mock data
        this.catalog = mockServiceCatalog;
        return this.catalog;
    }

    /**
     * Get all services
     */
    async getAllServices(): Promise<ServiceMetadata[]> {
        const catalog = await this.loadCatalog();
        return catalog.services;
    }

    /**
     * Get services by category
     */
    async getServicesByCategory(category: ServiceCategory): Promise<ServiceMetadata[]> {
        const catalog = await this.loadCatalog();
        return catalog.services.filter(s => s.category === category);
    }

    /**
     * Get service by code
     */
    async getService(serviceCode: string): Promise<ServiceMetadata | undefined> {
        const catalog = await this.loadCatalog();
        return catalog.services.find(s => s.serviceCode === serviceCode);
    }

    /**
     * Search services
     */
    async searchServices(query: string): Promise<ServiceMetadata[]> {
        const catalog = await this.loadCatalog();
        const lowerQuery = query.toLowerCase();
        return catalog.services.filter(
            s =>
                s.serviceName.toLowerCase().includes(lowerQuery) ||
                s.serviceCode.toLowerCase().includes(lowerQuery) ||
                s.description.toLowerCase().includes(lowerQuery)
        );
    }

    /**
     * Get all categories with service counts
     */
    async getCategoriesWithCounts(): Promise<Record<ServiceCategory, number>> {
        const catalog = await this.loadCatalog();
        const counts: Partial<Record<ServiceCategory, number>> = {};

        catalog.services.forEach(service => {
            counts[service.category] = (counts[service.category] || 0) + 1;
        });

        return counts as Record<ServiceCategory, number>;
    }
}

export const serviceCatalogService = new ServiceCatalogService();
