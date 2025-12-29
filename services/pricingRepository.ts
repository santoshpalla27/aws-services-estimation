import { PricingRepository, ServiceType } from "../types";

// The data is now fetched from public/data/pricing-manifest.json
// via the PricingContext. This file remains to export types 
// and helper functions for traversing the data structure.

export const getPrice = (repository: PricingRepository, region: string, service: ServiceType, key: string) => {
  // @ts-ignore - simplified lookup
  const regionData = repository[region];
  if (!regionData) return { pricePerUnit: 0, unit: 'N/A', currency: 'USD' };
  
  // @ts-ignore
  const serviceData = regionData[service];
  if (!serviceData) return { pricePerUnit: 0, unit: 'N/A', currency: 'USD' };

  return serviceData[key] || { pricePerUnit: 0, unit: 'N/A', currency: 'USD' };
};