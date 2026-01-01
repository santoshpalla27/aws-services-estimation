#!/bin/bash

# AWS Pricing Data Pipeline - Complete Automation Script
# This script runs the full pipeline: ingest → transform → organize

set -e  # Exit on error

echo "🚀 AWS Pricing Data Pipeline"
echo "=============================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm not found${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Node.js and npm installed"

# Step 2: Check pricing-miner
if [ ! -d "pricing-miner" ]; then
    echo -e "${RED}❌ pricing-miner directory not found${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} pricing-miner found"

# Step 3: Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install
cd pricing-miner && npm install && cd ..
echo -e "${GREEN}✓${NC} Dependencies installed"

# Step 4: Initialize database (if needed)
echo ""
echo "🗄️  Initializing database..."
cd pricing-miner
npm run init-db || echo -e "${YELLOW}⚠${NC}  Database may already be initialized"
cd ..

# Step 5: Ingest pricing data
echo ""
echo "⬇️  Fetching pricing data from AWS..."
echo -e "${YELLOW}This may take 15-30 minutes...${NC}"
cd pricing-miner
npm run ingest -- --all
cd ..
echo -e "${GREEN}✓${NC} Pricing data ingested"

# Step 6: Generate frontend JSON files
echo ""
echo "🔄 Transforming data for frontend..."
npm run update:pricing
echo -e "${GREEN}✓${NC} Frontend data generated"

# Step 7: Verify output
echo ""
echo "🔍 Verifying output..."

if [ -d "public/data/regions" ]; then
    REGION_COUNT=$(ls -1 public/data/regions/*.json 2>/dev/null | wc -l)
    echo -e "${GREEN}✓${NC} Generated $REGION_COUNT region files"
else
    echo -e "${RED}❌ Region files not found${NC}"
    exit 1
fi

if [ -f "public/data/metadata/service-catalog.json" ]; then
    echo -e "${GREEN}✓${NC} Service catalog generated"
else
    echo -e "${YELLOW}⚠${NC}  Service catalog not found"
fi

# Step 8: Calculate total size
echo ""
echo "📊 Data Summary:"
TOTAL_SIZE=$(du -sh public/data 2>/dev/null | cut -f1)
echo "   Total size: $TOTAL_SIZE"
echo "   Regions: $REGION_COUNT files"

# Done!
echo ""
echo "=============================="
echo -e "${GREEN}✅ Pipeline complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Start dev server: npm run dev"
echo "  2. Open http://localhost:5173"
echo "  3. Test pricing calculation"
echo ""
echo "Pricing data location: public/data/"
echo ""
