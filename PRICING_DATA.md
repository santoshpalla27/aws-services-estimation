# AWS Pricing Data Pipeline

This document explains how pricing data flows from AWS to your frontend application.

## Overview

```
AWS Pricing API
    ↓
pricing-miner (ETL)
    ↓
PostgreSQL Database
    ↓
generate-pricing-data.ts (Transform)
    ↓
public/data/ (Static JSON)
    ↓
Frontend Application
```

## Directory Structure

```
public/data/
├── regions/
│   ├── us-east-1.json      # All service pricing for us-east-1
│   ├── us-west-2.json      # All service pricing for us-west-2
│   ├── eu-central-1.json   # All service pricing for eu-central-1
│   └── ... (23 total region files)
├── metadata/
│   ├── service-catalog.json  # List of all 250+ services with metadata
│   ├── instance-types.json   # EC2/RDS instance specifications
│   └── regions.json          # Region metadata (location, AZs, etc.)
└── pricing-manifest.json     # Legacy fallback (optional)
```

## Pricing Data Format

### Region Pricing File (`public/data/regions/{region}.json`)

```json
{
  "region": "us-east-1",
  "lastUpdated": "2024-01-01T00:00:00Z",
  "services": {
    "AmazonEC2": {
      "t3.micro": {
        "unit": "Hrs",
        "pricePerUnit": 0.0104,
        "currency": "USD"
      },
      "m5.large": {
        "unit": "Hrs",
        "pricePerUnit": 0.096,
        "currency": "USD"
      },
      "ebs-gp3-storage": {
        "unit": "GB-Mo",
        "pricePerUnit": 0.08,
        "currency": "USD"
      }
    },
    "AWSLambda": {
      "requests": {
        "unit": "1M requests",
        "pricePerUnit": 0.20,
        "currency": "USD"
      },
      "duration-512mb": {
        "unit": "GB-second",
        "pricePerUnit": 0.0000083334,
        "currency": "USD"
      }
    }
  }
}
```

### Service Catalog (`public/data/metadata/service-catalog.json`)

```json
{
  "version": "1.0.0",
  "lastUpdated": "2024-01-01T00:00:00Z",
  "services": [
    {
      "serviceCode": "AmazonEC2",
      "serviceName": "Amazon EC2",
      "category": "compute",
      "description": "Virtual servers in the cloud",
      "complexity": "complex",
      "regionAvailability": ["us-east-1", "us-west-2", ...],
      "pricingDimensions": [...]
    }
  ]
}
```

## Running the Pipeline

### Method 1: Automated (Recommended)

```bash
# Run the complete pipeline
npm run update:pricing

# This will:
# 1. Run pricing-miner to fetch data from AWS
# 2. Transform data into frontend format
# 3. Generate region-specific JSON files
# 4. Create service catalog metadata
```

### Method 2: Manual Steps

```bash
# Step 1: Fetch pricing data with pricing-miner
cd pricing-miner
npm run ingest -- --all

# Step 2: Transform and export data
cd ..
npm run generate-pricing-data

# Step 3: Verify data was created
ls public/data/regions/
```

## Pricing Data Sources

### pricing-miner Configuration

The `pricing-miner` fetches data from:
- **AWS Pricing Bulk API** - Complete pricing for all services
- **Offer Files** - Service-specific pricing details
- **Regional Indexes** - Region availability and features

### What Gets Downloaded

For each AWS service:
- On-Demand instance pricing
- Reserved instance pricing (optional)
- Storage costs
- Data transfer costs
- Request/API call costs
- Additional feature costs

## Update Frequency

**Recommended Schedule:**
- **Development**: Weekly or as needed
- **Production**: Daily or weekly
- **Critical Apps**: Real-time via AWS Price List API

**AWS updates pricing:**
- New services: As announced
- Price changes: Typically with 30-day notice
- Regional expansion: Varies by service

## Data Size Estimates

| Data Type | Size (Uncompressed) | Size (gzip) |
|-----------|---------------------|-------------|
| Single region file | 10-50 MB | 2-10 MB |
| All regions (23 files) | 200-500 MB | 50-150 MB |
| Service catalog | 500 KB - 2 MB | 100-400 KB |
| Instance types | 200-500 KB | 50-100 KB |
| **Total** | **~500 MB** | **~150 MB** |

## Frontend Data Loading

The frontend uses lazy loading:

```typescript
// Only loads pricing when user selects a region
const pricing = await fetch(`/data/regions/${region}.json`);

// Caches in memory to avoid re-fetching
// Subsequent service selections use cached data
```

## Customization

### Adding Custom Pricing

You can override or supplement AWS pricing:

```json
// public/data/custom-pricing.json
{
  "us-east-1": {
    "CustomService": {
      "custom-sku": {
        "unit": "requests",
        "pricePerUnit": 0.001,
        "currency": "USD"
      }
    }
  }
}
```

### Regional Overrides

For services with custom contracts or discounts:

```json
// public/data/overrides/us-east-1.json
{
  "AmazonEC2": {
    "m5.large": {
      "unit": "Hrs",
      "pricePerUnit": 0.080,  // Discounted from 0.096
      "currency": "USD",
      "note": "Volume discount applied"
    }
  }
}
```

## Troubleshooting

### Issue: Pricing data not loading

**Check:**
```bash
# Verify files exist
ls -lh public/data/regions/

# Check file format
cat public/data/regions/us-east-1.json | jq .

# Verify web server serves JSON
curl http://localhost:5173/data/regions/us-east-1.json
```

### Issue: Outdated pricing

**Solution:**
```bash
# Re-run the pipeline
npm run update:pricing

# Force refresh (clears cache)
npm run update:pricing -- --force
```

### Issue: Missing services

**Check:**
```bash
# List ingested services
cd pricing-miner
npm run list-services

# Ingest specific service
npm run ingest -- --service AmazonEC2
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Update Pricing Data

on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly on Sunday
  workflow_dispatch:  # Manual trigger

jobs:
  update-pricing:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run update:pricing
      - uses: actions/upload-artifact@v2
        with:
          name: pricing-data
          path: public/data/
```

## Performance Optimization

### Serving Compressed Files

Configure your web server to serve `.json.gz` files:

```bash
# Pre-compress JSON files
gzip -k public/data/regions/*.json

# Nginx example
location /data/ {
  gzip_static on;
}
```

### CDN Caching

Upload pricing data to CDN with long cache times:

```bash
# AWS S3 + CloudFront example
aws s3 sync public/data/ s3://your-bucket/pricing-data/ \
  --cache-control "max-age=86400"
```

## Security

**Public Data:**
- AWS pricing is publicly available
- No authentication required
- Safe to serve from CDN

**Private Extensions:**
- Custom pricing: Protect with authentication
- Contract discounts: Store server-side
- Usage data: Never expose in pricing files

## Next Steps

1. Run the pipeline: `npm run update:pricing`
2. Verify data: `ls public/data/regions/`
3. Test in browser: Open dev tools → Network → Check JSON loads
4. Schedule updates: Set up cron job or GitHub Actions

## Questions?

Check the logs:
```bash
# Pipeline logs
npm run update:pricing 2>&1 | tee pricing-update.log

# pricing-miner logs
cd pricing-miner && npm run ingest -- --all 2>&1 | tee ingest.log
```
