import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

/**
 * AWS Pricing Data Generator
 * 
 * This script:
 * 1. Connects to pricing-miner PostgreSQL database
 * 2. Extracts pricing data for all services and regions
 * 3. Transforms data into frontend-compatible JSON format
 * 4. Outputs to public/data/ directory
 */

interface PricePoint {
    unit: string;
    pricePerUnit: number;
    currency: string;
}

interface RegionPricing {
    region: string;
    lastUpdated: string;
    services: Record<string, Record<string, PricePoint>>;
}

// Database configuration (using pricing-miner's database)
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'aws_pricing',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
});

// AWS Regions to export
const AWS_REGIONS = [
    'us-east-1',
    'us-east-2',
    'us-west-1',
    'us-west-2',
    'ca-central-1',
    'eu-central-1',
    'eu-west-1',
    'eu-west-2',
    'eu-west-3',
    'eu-north-1',
    'ap-south-1',
    'ap-northeast-1',
    'ap-northeast-2',
    'ap-northeast-3',
    'ap-southeast-1',
    'ap-southeast-2',
    'sa-east-1',
];

// Priority services to export first
const PRIORITY_SERVICES = [
    'AmazonEC2',
    'AWSLambda',
    'AmazonS3',
    'AmazonRDS',
    'AmazonDynamoDB',
    'AmazonElastiCache',
    'AmazonECS',
    'AmazonEKS',
    'AmazonCloudFront',
    'AmazonRoute53',
];

// Output directories
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'data');
const REGIONS_DIR = path.join(OUTPUT_DIR, 'regions');
const METADATA_DIR = path.join(OUTPUT_DIR, 'metadata');

async function ensureDirectories() {
    const dirs = [OUTPUT_DIR, REGIONS_DIR, METADATA_DIR];
    for (const dir of dirs) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`✓ Created directory: ${dir}`);
        }
    }
}

async function fetchPricingForRegion(region: string): Promise<RegionPricing> {
    console.log(`Fetching pricing for ${region}...`);

    const result: RegionPricing = {
        region,
        lastUpdated: new Date().toISOString(),
        services: {},
    };

    try {
        // Query pricing data from database
        // This is a simplified query - adjust based on your pricing-miner schema
        const query = `
      SELECT 
        service_code,
        sku,
        product_family,
        attributes,
        price_per_unit,
        unit,
        currency
      FROM pricing_data
      WHERE region = $1
      AND price_per_unit > 0
      ORDER BY service_code, sku
    `;

        const res = await pool.query(query, [region]);

        for (const row of res.rows) {
            const serviceCode = row.service_code;
            const sku = row.sku;

            if (!result.services[serviceCode]) {
                result.services[serviceCode] = {};
            }

            result.services[serviceCode][sku] = {
                unit: row.unit || 'unit',
                pricePerUnit: parseFloat(row.price_per_unit),
                currency: row.currency || 'USD',
            };
        }

        console.log(`✓ Fetched ${res.rows.length} pricing entries for ${region}`);
    } catch (error) {
        console.error(`✗ Error fetching pricing for ${region}:`, error);
        // Return empty result on error
    }

    return result;
}

async function generateRegionFiles() {
    console.log('\n📦 Generating region pricing files...\n');

    for (const region of AWS_REGIONS) {
        try {
            const pricing = await fetchPricingForRegion(region);
            const filename = path.join(REGIONS_DIR, `${region}.json`);

            fs.writeFileSync(filename, JSON.stringify(pricing, null, 2));

            const fileSize = (fs.statSync(filename).size / 1024 / 1024).toFixed(2);
            console.log(`✓ Generated ${region}.json (${fileSize} MB)`);
        } catch (error) {
            console.error(`✗ Failed to generate ${region}:`, error);
        }
    }
}

async function generateServiceCatalog() {
    console.log('\n📋 Generating service catalog...\n');

    try {
        // Query available services from database
        const query = `
      SELECT DISTINCT service_code, COUNT(*) as sku_count
      FROM pricing_data
      GROUP BY service_code
      ORDER BY service_code
    `;

        const res = await pool.query(query);

        const catalog = {
            version: '1.0.0',
            lastUpdated: new Date().toISOString(),
            totalServices: res.rows.length,
            services: res.rows.map((row: any) => ({
                serviceCode: row.service_code,
                skuCount: parseInt(row.sku_count),
            })),
        };

        const filename = path.join(METADATA_DIR, 'service-catalog.json');
        fs.writeFileSync(filename, JSON.stringify(catalog, null, 2));

        console.log(`✓ Generated service catalog (${res.rows.length} services)`);
    } catch (error) {
        console.error('✗ Failed to generate service catalog:', error);
    }
}

async function generateRegionMetadata() {
    console.log('\n🌍 Generating region metadata...\n');

    const regionMetadata = AWS_REGIONS.map((region) => ({
        code: region,
        name: getRegionName(region),
        location: getRegionLocation(region),
    }));

    const filename = path.join(METADATA_DIR, 'regions.json');
    fs.writeFileSync(filename, JSON.stringify(regionMetadata, null, 2));

    console.log(`✓ Generated region metadata (${AWS_REGIONS.length} regions)`);
}

function getRegionName(code: string): string {
    const names: Record<string, string> = {
        'us-east-1': 'US East (N. Virginia)',
        'us-east-2': 'US East (Ohio)',
        'us-west-1': 'US West (N. California)',
        'us-west-2': 'US West (Oregon)',
        'ca-central-1': 'Canada (Central)',
        'eu-central-1': 'Europe (Frankfurt)',
        'eu-west-1': 'Europe (Ireland)',
        'eu-west-2': 'Europe (London)',
        'eu-west-3': 'Europe (Paris)',
        'eu-north-1': 'Europe (Stockholm)',
        'ap-south-1': 'Asia Pacific (Mumbai)',
        'ap-northeast-1': 'Asia Pacific (Tokyo)',
        'ap-northeast-2': 'Asia Pacific (Seoul)',
        'ap-northeast-3': 'Asia Pacific (Osaka)',
        'ap-southeast-1': 'Asia Pacific (Singapore)',
        'ap-southeast-2': 'Asia Pacific (Sydney)',
        'sa-east-1': 'South America (São Paulo)',
    };
    return names[code] || code;
}

function getRegionLocation(code: string): string {
    const locations: Record<string, string> = {
        'us-east-1': 'Virginia, USA',
        'us-east-2': 'Ohio, USA',
        'us-west-1': 'California, USA',
        'us-west-2': 'Oregon, USA',
        'ca-central-1': 'Montreal, Canada',
        'eu-central-1': 'Frankfurt, Germany',
        'eu-west-1': 'Dublin, Ireland',
        'eu-west-2': 'London, UK',
        'eu-west-3': 'Paris, France',
        'eu-north-1': 'Stockholm, Sweden',
        'ap-south-1': 'Mumbai, India',
        'ap-northeast-1': 'Tokyo, Japan',
        'ap-northeast-2': 'Seoul, South Korea',
        'ap-northeast-3': 'Osaka, Japan',
        'ap-southeast-1': 'Singapore',
        'ap-southeast-2': 'Sydney, Australia',
        'sa-east-1': 'São Paulo, Brazil',
    };
    return locations[code] || code;
}

async function generatePricingManifest() {
    console.log('\n📄 Generating pricing manifest...\n');

    const manifest = {
        version: '1.0.0',
        lastUpdated: new Date().toISOString(),
        regions: AWS_REGIONS,
        services: PRIORITY_SERVICES,
        dataDirectory: '/data',
    };

    const filename = path.join(OUTPUT_DIR, 'pricing-manifest.json');
    fs.writeFileSync(filename, JSON.stringify(manifest, null, 2));

    console.log('✓ Generated pricing manifest');
}

async function main() {
    console.log('🚀 AWS Pricing Data Generator\n');
    console.log('='.repeat(50));

    try {
        // Test database connection
        await pool.query('SELECT 1');
        console.log('✓ Connected to pricing database\n');

        // Ensure output directories exist
        await ensureDirectories();

        // Generate all data files
        await generateRegionFiles();
        await generateServiceCatalog();
        await generateRegionMetadata();
        await generatePricingManifest();

        console.log('\n' + '='.repeat(50));
        console.log('✅ Pricing data generation complete!\n');
        console.log('Generated files:');
        console.log(`  - ${REGIONS_DIR}/*.json (${AWS_REGIONS.length} files)`);
        console.log(`  - ${METADATA_DIR}/service-catalog.json`);
        console.log(`  - ${METADATA_DIR}/regions.json`);
        console.log(`  - ${OUTPUT_DIR}/pricing-manifest.json\n`);
    } catch (error) {
        console.error('\n❌ Error:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}

export { main as generatePricingData };
