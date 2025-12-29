import React, { createContext, useContext, useEffect, useState } from 'react';
import { PricingRepository, ServiceType, Region, InstanceType, RDSInstanceClass, ElastiCacheNodeType, OpenSearchInstanceType } from '../types';

interface PricingContextType {
  pricingData: PricingRepository | null;
  loading: boolean;
  error: string | null;
  getServiceOptions: (service: ServiceType, category: string) => string[];
}

const PricingContext = createContext<PricingContextType>({ 
    pricingData: null, 
    loading: true, 
    error: null,
    getServiceOptions: () => [] 
});

export const PricingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pricingData, setPricingData] = useState<PricingRepository | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/data/pricing-manifest.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load pricing data. Ensure scripts/fetch-pricing.js has been run.');
        return res.json();
      })
      .then(data => {
        setPricingData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const getServiceOptions = (service: ServiceType, category: string): string[] => {
      // Fallback defaults if data is not loaded
      if (!pricingData || !pricingData[Region.US_EAST_1] || !pricingData[Region.US_EAST_1][service]) {
          switch(service) {
              case ServiceType.EC2: return Object.values(InstanceType);
              case ServiceType.RDS: return Object.values(RDSInstanceClass);
              case ServiceType.ELASTICACHE: return Object.values(ElastiCacheNodeType);
              case ServiceType.OPENSEARCH: return Object.values(OpenSearchInstanceType);
              default: return [];
          }
      }

      const serviceData = pricingData[Region.US_EAST_1][service];
      const keys = Object.keys(serviceData);

      // --- Metadata Extractor Logic ---

      // 1. Instance/Node Types (General)
      if (category === 'instance' || category === 'node' || category === 'broker') {
          if (service === ServiceType.EC2) {
              return keys.filter(k => k.includes('.') && !k.includes('_') && !k.includes('tenancy'));
          }
          if (service === ServiceType.RDS) {
              return keys.filter(k => k.startsWith('db.'));
          }
          if (service === ServiceType.ELASTICACHE) {
              return keys.filter(k => k.startsWith('cache.'));
          }
          if (service === ServiceType.OPENSEARCH) {
              return keys.filter(k => k.includes('.search'));
          }
          if (service === ServiceType.MSK) {
              return keys.filter(k => k.startsWith('kafka.'));
          }
          if (service === ServiceType.MQ) {
              return keys.filter(k => k.startsWith('mq.'));
          }
      }

      // 2. Storage/Volume Types
      if (category === 'volume') {
          // OpenSearch logic: keys are 'os_storage_gp3'
          if (service === ServiceType.OPENSEARCH) {
              return keys
                .filter(k => k.startsWith('os_storage_'))
                .map(k => k.replace('os_storage_', ''));
          }

          // EC2/RDS logic: keys are 'ebs_gp3_storage' or 'rds_gp3_storage'
          const prefix = service === ServiceType.EC2 ? 'ebs_' : 'rds_';
          const suffix = '_storage';
          return keys
            .filter(k => k.startsWith(prefix) && k.endsWith(suffix) && !k.includes('snapshot'))
            .map(k => k.replace(prefix, '').replace(suffix, ''));
      }

      // 3. CodeBuild Compute Types
      if (service === ServiceType.CODEBUILD && category === 'compute') {
          // Keys: build_general1_small_linux
          const computeTypes = new Set<string>();
          keys.forEach(k => {
              if (k.startsWith('build_')) {
                  const withoutPrefix = k.substring(6);
                  const clean = withoutPrefix.replace(/_linux$/, '').replace(/_windows$/, '');
                  computeTypes.add(clean);
              }
          });
          return Array.from(computeTypes);
      }

      // 4. ApiGateway Cache Sizes
      if (service === ServiceType.API_GATEWAY && category === 'cache') {
          // Keys: apigw_cache_0_5
          return keys
            .filter(k => k.startsWith('apigw_cache_'))
            .map(k => k.replace('apigw_cache_', '').replace('_', '.'));
      }

      return [];
  };

  return (
    <PricingContext.Provider value={{ pricingData, loading, error, getServiceOptions }}>
      {children}
    </PricingContext.Provider>
  );
};

export const usePricing = () => useContext(PricingContext);