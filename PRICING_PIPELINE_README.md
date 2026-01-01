# AWS Cost Estimator - Real Pricing Data Pipeline

Complete automation script to download and organize real AWS pricing data for 250+ services.

## What This Does

This pipeline:
1. ✅ Connects to AWS Pricing API via `pricing-miner`
2. ✅ Downloads pricing for **ALL** AWS services and regions
3. ✅ Transforms data into frontend-compatible JSON
4. ✅ Organizes into `public/data/` directory
5. ✅ Ready to use in your React app

## One-Command Setup

```bash
# Run the complete pipeline
npm run pricing:full
```

**That's it!** The script will:
- Install dependencies
- Initialize database
- Fetch pricing from AWS (15-30 min)
- Generate JSON files
- Verify everything worked

## What You Get

After completion:

```
public/data/
├── regions/
│   ├── us-east-1.json      # 10-50 MB per file
│   ├── us-west-2.json
│   ├── eu-central-1.json
│   └── ... (17 total)
├── metadata/
│   ├── service-catalog.json  # Service list
│   └── regions.json          # Region info
└── pricing-manifest.json     # Index file
```

## Individual Steps

If you need more control:

```bash
# Step 1: Fetch from AWS
npm run pricing:ingest

# Step 2: Generate frontend files  
npm run update:pricing
```

## Configuration

### Database (Optional)

Default: PostgreSQL on localhost

Custom database:
```bash
# Create .env file
DB_HOST=your-host
DB_PORT=5432
DB_NAME=aws_pricing
DB_USER=postgres
DB_PASSWORD=your-password
```

### Regions

Edit `scripts/generate-pricing-data.ts` to customize:

```typescript
const AWS_REGIONS = [
  'us-east-1',      // Keep what you need
  'eu-central-1',   // Remove others to save space
];
```

## Update Schedule

**Development:**
```bash
# Weekly or as needed
npm run pricing:full
```

**Production:**

Set up automated updates:

```bash
# Linux/Mac: Add to crontab
0 0 * * 0 cd /path/to/project && npm run pricing:full

# Windows: Use Task Scheduler
```

Or use GitHub Actions (see `PRICING_DATA.md`)

## File Sizes

| Type | Uncompressed | Compressed |
|------|--------------|------------|
| Single region | 10-50 MB | 2-10 MB |
| All regions (17) | 200-500 MB | 50-150 MB |
| Metadata | 2-5 MB | 500 KB |

## Using the Data

The frontend automatically loads pricing:

```typescript
// When user selects us-east-1
const pricing = await fetch('/data/regions/us-east-1.json');

// Cached in memory
// No re-fetching needed
```

## Verification

```bash
# Check files exist
ls public/data/regions/

# Check file format
cat public/data/regions/us-east-1.json | head

# Test in browser
npm run dev
# Open http://localhost:5173
# Select EC2, configure, calculate
# See real pricing!
```

## Troubleshooting

### Database Connection Failed

```bash
cd pricing-miner
npm install
npm run init-db
```

### No Pricing Data

```bash
# Test with single service
cd pricing-miner
npm run ingest -- --service AmazonEC2
```

### Files Not Loading

```bash
# Check Vite config serves static files
curl http://localhost:5173/data/regions/us-east-1.json
```

### Slow Downloads

```bash
# Use specific services only
cd pricing-miner
npm run ingest -- --service AmazonEC2,AmazonS3,AWSLambda
```

## Architecture

```
AWS Pricing API
    ↓
pricing-miner (Node.js ETL)
    ↓
PostgreSQL Database
    ↓
generate-pricing-data.ts
    ↓
public/data/ (Static JSON)
    ↓
React Frontend (Vite)
    ↓
User Browser
```

## Data Format

### Region File

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
      }
    }
  }
}
```

## CI/CD Integration

### GitHub Actions

Create `.github/workflows/update-pricing.yml`:

```yaml
name: Update Pricing Data

on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly
  workflow_dispatch:

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run pricing:full
      - uses: actions/upload-artifact@v3
        with:
          name: pricing-data
          path: public/data/
```

## Performance

### Compression

```bash
# Pre-compress for production
gzip -k public/data/regions/*.json

# Nginx example
location /data/ {
  gzip_static on;
}
```

### CDN

```bash
# Upload to S3/CloudFront
aws s3 sync public/data/ s3://your-bucket/data/ \
  --cache-control "max-age=86400"
```

## Next Steps

1. ✅ Run `npm run pricing:full`
2. ✅ Wait 15-30 minutes
3. ✅ Verify `public/data/` has files
4. ✅ Test in browser
5. ✅ Schedule weekly updates

## Documentation

- **Quick Start**: `PRICING_QUICKSTART.md`
- **Full Guide**: `PRICING_DATA.md`
- **Architecture**: `ARCHITECTURE.md`

## Support

Check logs:
```bash
npm run pricing:full 2>&1 | tee pricing.log
```

View last run:
```bash
cat pricing.log
```

---

**You're all set!** Run `npm run pricing:full` and you'll have real AWS pricing data in ~30 minutes. 🚀
