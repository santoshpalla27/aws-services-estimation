# Pricing Data Pipeline - Quick Start

## 🚀 Quick Commands

```bash
# Full pipeline (recommended for first time)
npm run pricing:full

# Or run steps individually:

# Step 1: Fetch pricing from AWS (15-30 minutes)
npm run pricing:ingest

# Step 2: Generate frontend JSON files
npm run update:pricing
```

## 📁 What Gets Created

After running the pipeline, you'll have:

```
public/data/
├── regions/
│   ├── us-east-1.json      (~10-50 MB each)
│   ├── us-west-2.json
│   └── ... (17 total)
├── metadata/
│   ├── service-catalog.json
│   └── regions.json
└── pricing-manifest.json
```

## ⚙️ Configuration

### Database Connection

Set these environment variables if your PostgreSQL is not on localhost:

```bash
# .env file
DB_HOST=localhost
DB_PORT=5432
DB_NAME=aws_pricing
DB_USER=postgres
DB_PASSWORD=postgres
```

### Customizing Regions

Edit `scripts/generate-pricing-data.ts`:

```typescript
const AWS_REGIONS = [
  'us-east-1',    // Keep your needed regions
  'eu-central-1',
  // Remove others to save space
];
```

## 🔄 Update Schedule

**Development:**
```bash
# Run weekly or when needed
npm run pricing:full
```

**Production:**
```bash
# Set up a cron job (Linux/Mac)
0 0 * * 0 cd /path/to/project && npm run pricing:full

# Or GitHub Actions (see PRICING_DATA.md)
```

## 📊 Data Size

- **Single region**: 10-50 MB
- **All 17 regions**: ~200-500 MB
- **Compressed (gzip)**: ~50-150 MB

## ✅ Verification

```bash
# Check files were created
ls -lh public/data/regions/

# Test in browser
npm run dev
# Open http://localhost:5173
# Select EC2 → Configure → Calculate
# If you see a price, it's working!
```

## 🐛 Troubleshooting

**Issue: Database connection failed**
```bash
# Check pricing-miner is set up
cd pricing-miner
npm install
npm run init-db
```

**Issue: No pricing data**
```bash
# Run ingestion first
cd pricing-miner
npm run ingest -- --service AmazonEC2
```

**Issue: Files not loading in frontend**
```bash
# Verify Vite is serving static files
curl http://localhost:5173/data/regions/us-east-1.json
```

## 📖 Full Documentation

See [PRICING_DATA.md](./PRICING_DATA.md) for complete documentation.

## 🎯 Next Steps

1. ✅ Run `npm run pricing:full`
2. ✅ Wait for completion (15-30 min)
3. ✅ Verify files in `public/data/`
4. ✅ Restart dev server
5. ✅ Test in browser

That's it! Your app now has real AWS pricing data. 🎉
