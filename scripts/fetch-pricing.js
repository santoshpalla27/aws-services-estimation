// This script fetches pricing data from the AWS Price List API.
// It is designed to be run in a Node.js environment.
// Usage: node scripts/fetch-pricing.js

const fs = require('fs');
const path = require('path');

console.log("Starting Pricing Data Pipeline...");

/*
 * --- DEPENDENCY CHECK ---
 * In a real environment, you must run:
 * npm install @aws-sdk/client-pricing
 */
let PricingClient, GetProductsCommand;
try {
  ({ PricingClient, GetProductsCommand } = require("@aws-sdk/client-pricing"));
} catch (e) {
  console.log("⚠️  AWS SDK not found. To run this pipeline against real AWS APIs, please install dependencies:");
  console.log("   npm install @aws-sdk/client-pricing");
  console.log("\nSkipping live fetch and generating extended mock data for demonstration...");
  // Fallthrough to mock generation
}

// Configuration
const REGION_CODE = 'us-east-1'; // API Pricing Region
const LOCATION_VAL = 'US East (N. Virginia)';
const OUTPUT_FILE = path.join(__dirname, '../public/data/pricing-manifest.json');

// Mock Data Extension (used if SDK is missing or for demo purposes)
const MOCK_EXTENDED = {
  "us-east-1": {
    "AmazonEC2": {
      // General Purpose
      "t3.nano": { "unit": "Hrs", "pricePerUnit": 0.0052, "currency": "USD" },
      "t3.micro": { "unit": "Hrs", "pricePerUnit": 0.0104, "currency": "USD" },
      "t3.small": { "unit": "Hrs", "pricePerUnit": 0.0208, "currency": "USD" },
      "t3.medium": { "unit": "Hrs", "pricePerUnit": 0.0416, "currency": "USD" },
      "t3.large": { "unit": "Hrs", "pricePerUnit": 0.0832, "currency": "USD" },
      "t3.xlarge": { "unit": "Hrs", "pricePerUnit": 0.1664, "currency": "USD" },
      "t3.2xlarge": { "unit": "Hrs", "pricePerUnit": 0.3328, "currency": "USD" },
      "m5.large": { "unit": "Hrs", "pricePerUnit": 0.096, "currency": "USD" },
      "m5.xlarge": { "unit": "Hrs", "pricePerUnit": 0.192, "currency": "USD" },
      // Compute Optimized
      "c5.large": { "unit": "Hrs", "pricePerUnit": 0.085, "currency": "USD" },
      "c5.xlarge": { "unit": "Hrs", "pricePerUnit": 0.17, "currency": "USD" },
      "c6g.large": { "unit": "Hrs", "pricePerUnit": 0.068, "currency": "USD" },
      // Memory Optimized
      "r5.large": { "unit": "Hrs", "pricePerUnit": 0.126, "currency": "USD" },
      "r6g.large": { "unit": "Hrs", "pricePerUnit": 0.1008, "currency": "USD" },
      
      // Features
      "tenancy_dedicated_instance": { "unit": "Hrs", "pricePerUnit": 0.01, "currency": "USD" },
      "tenancy_dedicated_host": { "unit": "Hrs", "pricePerUnit": 1.0, "currency": "USD" },
      "ebs_gp3_storage": { "unit": "GB-Mo", "pricePerUnit": 0.08, "currency": "USD" },
      "ebs_gp2_storage": { "unit": "GB-Mo", "pricePerUnit": 0.10, "currency": "USD" },
      "ebs_io2_storage": { "unit": "GB-Mo", "pricePerUnit": 0.125, "currency": "USD" },
      "ebs_st1_storage": { "unit": "GB-Mo", "pricePerUnit": 0.045, "currency": "USD" },
      "ebs_iops": { "unit": "IOPS-Mo", "pricePerUnit": 0.005, "currency": "USD" },
      "ebs_snapshot_storage": { "unit": "GB-Mo", "pricePerUnit": 0.05, "currency": "USD" },
      "alb_hourly": { "unit": "Hrs", "pricePerUnit": 0.0225, "currency": "USD" },
      "nlb_hourly": { "unit": "Hrs", "pricePerUnit": 0.0225, "currency": "USD" },
      "lb_lcu_data": { "unit": "GB", "pricePerUnit": 0.008, "currency": "USD" },
      "eip_idle_hourly": { "unit": "Hrs", "pricePerUnit": 0.005, "currency": "USD" },
      "cw_detailed_monitoring": { "unit": "Instance-Mo", "pricePerUnit": 2.10, "currency": "USD" }
    },
    "AmazonRDS": {
      "db.t3.micro": { "unit": "Hrs", "pricePerUnit": 0.017, "currency": "USD" },
      "db.t3.small": { "unit": "Hrs", "pricePerUnit": 0.034, "currency": "USD" },
      "db.t3.medium": { "unit": "Hrs", "pricePerUnit": 0.068, "currency": "USD" },
      "db.m5.large": { "unit": "Hrs", "pricePerUnit": 0.192, "currency": "USD" },
      "db.m5.xlarge": { "unit": "Hrs", "pricePerUnit": 0.384, "currency": "USD" },
      "db.r5.large": { "unit": "Hrs", "pricePerUnit": 0.252, "currency": "USD" },
      "rds_gp3_storage": { "unit": "GB-Mo", "pricePerUnit": 0.115, "currency": "USD" },
      "rds_gp2_storage": { "unit": "GB-Mo", "pricePerUnit": 0.115, "currency": "USD" },
      "rds_io2_storage": { "unit": "GB-Mo", "pricePerUnit": 0.125, "currency": "USD" },
      "rds_backup_storage": { "unit": "GB-Mo", "pricePerUnit": 0.095, "currency": "USD" },
      "rds_iops": { "unit": "IOPS-Mo", "pricePerUnit": 0.10, "currency": "USD" }
    },
    // ... Include other services from previous manifest or fetched live ...
    "AmazonS3": {
      "s3_storage_standard": { "unit": "GB-Mo", "pricePerUnit": 0.023, "currency": "USD" },
      "s3_storage_ia": { "unit": "GB-Mo", "pricePerUnit": 0.0125, "currency": "USD" },
      "s3_storage_glacier": { "unit": "GB-Mo", "pricePerUnit": 0.004, "currency": "USD" },
      "s3_storage_deep_archive": { "unit": "GB-Mo", "pricePerUnit": 0.00099, "currency": "USD" },
      "s3_requests_put": { "unit": "1k Reqs", "pricePerUnit": 0.005, "currency": "USD" },
      "s3_requests_get": { "unit": "1k Reqs", "pricePerUnit": 0.0004, "currency": "USD" },
      "s3_lifecycle": { "unit": "1k Reqs", "pricePerUnit": 0.01, "currency": "USD" },
      "s3_data_transfer_out": { "unit": "GB", "pricePerUnit": 0.09, "currency": "USD" },
      "s3_transfer_acceleration": { "unit": "GB", "pricePerUnit": 0.04, "currency": "USD" },
      "s3_replication_crr": { "unit": "GB", "pricePerUnit": 0.02, "currency": "USD" },
      "s3_inventory": { "unit": "Million Objs", "pricePerUnit": 0.0025, "currency": "USD" },
      "s3_analytics": { "unit": "Million Objs/Mo", "pricePerUnit": 0.10, "currency": "USD" }
    },
    "AmazonVPC": {
      "nat_gateway_hourly": { "unit": "Hrs", "pricePerUnit": 0.045, "currency": "USD" },
      "nat_gateway_processed_bytes": { "unit": "GB", "pricePerUnit": 0.045, "currency": "USD" },
      "public_ipv4_hourly": { "unit": "Hrs", "pricePerUnit": 0.005, "currency": "USD" },
      "vpn_connection_hourly": { "unit": "Hrs", "pricePerUnit": 0.05, "currency": "USD" },
      "client_vpn_association_hourly": { "unit": "Hrs", "pricePerUnit": 0.10, "currency": "USD" },
      "client_vpn_connection_hourly": { "unit": "Hrs", "pricePerUnit": 0.05, "currency": "USD" },
      "transit_gateway_attachment_hourly": { "unit": "Hrs", "pricePerUnit": 0.05, "currency": "USD" },
      "transit_gateway_processed_bytes": { "unit": "GB", "pricePerUnit": 0.02, "currency": "USD" },
      "traffic_mirroring_hourly": { "unit": "Hrs", "pricePerUnit": 0.015, "currency": "USD" },
      "flow_logs_ingestion": { "unit": "GB", "pricePerUnit": 0.50, "currency": "USD" }, 
      "data_transfer_internet_out": { "unit": "GB", "pricePerUnit": 0.09, "currency": "USD" },
      "data_transfer_intra_region": { "unit": "GB", "pricePerUnit": 0.01, "currency": "USD" },
      "data_transfer_vpc_peering": { "unit": "GB", "pricePerUnit": 0.01, "currency": "USD" },
      "vpc_endpoint_interface_hourly": { "unit": "Hrs", "pricePerUnit": 0.01, "currency": "USD" },
      "vpc_endpoint_interface_bytes": { "unit": "GB", "pricePerUnit": 0.01, "currency": "USD" },
      "vpc_endpoint_gateway": { "unit": "Hrs", "pricePerUnit": 0.00, "currency": "USD" }
    }
  }
};

// --- AWS Fetch Logic ---

const getPriceFromPriceList = (priceList) => {
  // Helper to extract the first 'OnDemand' price found in the nested JSON
  try {
    const terms = priceList.terms.OnDemand;
    const termKey = Object.keys(terms)[0];
    const priceDimensions = terms[termKey].priceDimensions;
    const priceDimKey = Object.keys(priceDimensions)[0];
    const pricePerUnit = priceDimensions[priceDimKey].pricePerUnit.USD;
    const unit = priceDimensions[priceDimKey].unit;
    return { pricePerUnit: parseFloat(pricePerUnit), unit, currency: 'USD' };
  } catch (e) {
    return null;
  }
};

async function fetchEC2Prices(client) {
  console.log("Fetching EC2...");
  const instanceTypes = ["t3.micro", "t3.medium", "m5.large", "c5.large", "r5.large", "t4g.nano", "t4g.micro", "t4g.small"]; // Add more to scan
  const results = {};

  for (const type of instanceTypes) {
    const cmd = new GetProductsCommand({
      ServiceCode: "AmazonEC2",
      Filters: [
        { Type: "TERM_MATCH", Field: "location", Value: LOCATION_VAL },
        { Type: "TERM_MATCH", Field: "instanceType", Value: type },
        { Type: "TERM_MATCH", Field: "operatingSystem", Value: "Linux" },
        { Type: "TERM_MATCH", Field: "preInstalledSw", Value: "NA" },
        { Type: "TERM_MATCH", Field: "tenancy", Value: "Shared" },
        { Type: "TERM_MATCH", Field: "capacitystatus", Value: "Used" } 
      ]
    });
    try {
      const data = await client.send(cmd);
      if (data.PriceList && data.PriceList.length > 0) {
        const item = JSON.parse(data.PriceList[0]);
        const price = getPriceFromPriceList(item);
        if (price) results[type] = price;
      }
    } catch (e) {
      console.error(`Failed to fetch ${type}`, e);
    }
  }
  return results;
}

// --- Main Execution ---

async function main() {
  let finalData = MOCK_EXTENDED;

  if (PricingClient) {
    // If SDK is available, perform real fetch and merge
    const client = new PricingClient({ region: 'us-east-1' });
    try {
      const ec2Prices = await fetchEC2Prices(client);
      // Merge fetched EC2 prices into the structure
      finalData["us-east-1"]["AmazonEC2"] = {
        ...finalData["us-east-1"]["AmazonEC2"],
        ...ec2Prices
      };
      console.log(`✅ Successfully fetched ${Object.keys(ec2Prices).length} EC2 instance prices.`);
    } catch (e) {
      console.error("❌ Failed to fetch live data", e);
    }
  }

  // Write to disk
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(finalData, null, 2));
  console.log(`\nArtifact written to: ${OUTPUT_FILE}`);
  console.log("The frontend will now dynamically load options from this file.");
}

main();