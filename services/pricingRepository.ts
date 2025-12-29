import { PricingRepository, Region, ServiceType } from "../types";

export const PRICING_DATA: PricingRepository = {
  [Region.US_EAST_1]: {
    [ServiceType.VPC]: {
      // --- NAT Gateway ---
      "nat_gateway_hourly": { unit: "Hrs", pricePerUnit: 0.045, currency: "USD" },
      "nat_gateway_processed_bytes": { unit: "GB", pricePerUnit: 0.045, currency: "USD" },

      // --- Public IPv4 ---
      "public_ipv4_hourly": { unit: "Hrs", pricePerUnit: 0.005, currency: "USD" },

      // --- Site-to-Site VPN ---
      "vpn_connection_hourly": { unit: "Hrs", pricePerUnit: 0.05, currency: "USD" },

      // --- Client VPN ---
      "client_vpn_association_hourly": { unit: "Hrs", pricePerUnit: 0.10, currency: "USD" },
      "client_vpn_connection_hourly": { unit: "Hrs", pricePerUnit: 0.05, currency: "USD" },

      // --- Transit Gateway ---
      "transit_gateway_attachment_hourly": { unit: "Hrs", pricePerUnit: 0.05, currency: "USD" },
      "transit_gateway_processed_bytes": { unit: "GB", pricePerUnit: 0.02, currency: "USD" },

      // --- Traffic Mirroring ---
      "traffic_mirroring_hourly": { unit: "Hrs", pricePerUnit: 0.015, currency: "USD" },

      // --- VPC Flow Logs (Vended Logs to CloudWatch) ---
      "flow_logs_ingestion": { unit: "GB", pricePerUnit: 0.50, currency: "USD" }, 

      // --- Data Transfer ---
      "data_transfer_internet_out": { unit: "GB", pricePerUnit: 0.09, currency: "USD" },
      "data_transfer_intra_region": { unit: "GB", pricePerUnit: 0.01, currency: "USD" },
      "data_transfer_vpc_peering": { unit: "GB", pricePerUnit: 0.01, currency: "USD" },
      
      // --- Endpoints ---
      "vpc_endpoint_interface_hourly": { unit: "Hrs", pricePerUnit: 0.01, currency: "USD" },
      "vpc_endpoint_interface_bytes": { unit: "GB", pricePerUnit: 0.01, currency: "USD" },
      "vpc_endpoint_gateway": { unit: "Hrs", pricePerUnit: 0.00, currency: "USD" }, // Free
    },
    [ServiceType.EC2]: {
      // --- Instances (Linux On-Demand Proxy) ---
      "t3.micro": { unit: "Hrs", pricePerUnit: 0.0104, currency: "USD" },
      "t3.medium": { unit: "Hrs", pricePerUnit: 0.0416, currency: "USD" },
      "m5.large": { unit: "Hrs", pricePerUnit: 0.096, currency: "USD" },
      "c5.large": { unit: "Hrs", pricePerUnit: 0.085, currency: "USD" },
      "r5.large": { unit: "Hrs", pricePerUnit: 0.126, currency: "USD" },
      
      // --- Tenancy Surcharges ---
      "tenancy_dedicated_instance": { unit: "Hrs", pricePerUnit: 0.01, currency: "USD" }, // Roughly +10%
      "tenancy_dedicated_host": { unit: "Hrs", pricePerUnit: 1.0, currency: "USD" }, // Per host fee

      // --- EBS Storage ---
      "ebs_gp3_storage": { unit: "GB-Mo", pricePerUnit: 0.08, currency: "USD" },
      "ebs_gp2_storage": { unit: "GB-Mo", pricePerUnit: 0.10, currency: "USD" },
      "ebs_io2_storage": { unit: "GB-Mo", pricePerUnit: 0.125, currency: "USD" },
      "ebs_st1_storage": { unit: "GB-Mo", pricePerUnit: 0.045, currency: "USD" },
      
      // --- EBS IOPS/Throughput (Simplified) ---
      "ebs_iops": { unit: "IOPS-Mo", pricePerUnit: 0.005, currency: "USD" },
      
      // --- Snapshots ---
      "ebs_snapshot_storage": { unit: "GB-Mo", pricePerUnit: 0.05, currency: "USD" },

      // --- Load Balancing (Integrated EC2) ---
      "alb_hourly": { unit: "Hrs", pricePerUnit: 0.0225, currency: "USD" },
      "nlb_hourly": { unit: "Hrs", pricePerUnit: 0.0225, currency: "USD" },
      "lb_lcu_data": { unit: "GB", pricePerUnit: 0.008, currency: "USD" }, // Proxy for LCU

      // --- Elastic IPs ---
      "eip_idle_hourly": { unit: "Hrs", pricePerUnit: 0.005, currency: "USD" },
      
       // --- CloudWatch Detailed Monitoring ---
       "cw_detailed_monitoring": { unit: "Instance-Mo", pricePerUnit: 2.10, currency: "USD" },
    },
    [ServiceType.ASG]: {
        // Inherits EC2 pricing keys for instances. 
        // Specific ASG costs like CloudWatch:
        "cw_detailed_monitoring": { unit: "Instance-Mo", pricePerUnit: 2.10, currency: "USD" },
    },
    [ServiceType.ELB]: {
        // --- Application Load Balancer ---
        "alb_hourly": { unit: "Hrs", pricePerUnit: 0.0225, currency: "USD" },
        "alb_lcu_hour": { unit: "LCU-Hr", pricePerUnit: 0.008, currency: "USD" },
        
        // --- Network Load Balancer ---
        "nlb_hourly": { unit: "Hrs", pricePerUnit: 0.0225, currency: "USD" },
        "nlb_lcu_hour": { unit: "LCU-Hr", pricePerUnit: 0.006, currency: "USD" }, // NLCU

        // --- Gateway Load Balancer ---
        "gwlb_hourly": { unit: "Hrs", pricePerUnit: 0.0125, currency: "USD" },
        "gwlb_lcu_hour": { unit: "LCU-Hr", pricePerUnit: 0.004, currency: "USD" }, // GLBCU
    },
    [ServiceType.S3]: {
      // --- Storage Classes ---
      "s3_storage_standard": { unit: "GB-Mo", pricePerUnit: 0.023, currency: "USD" },
      "s3_storage_ia": { unit: "GB-Mo", pricePerUnit: 0.0125, currency: "USD" },
      "s3_storage_glacier": { unit: "GB-Mo", pricePerUnit: 0.004, currency: "USD" },
      "s3_storage_deep_archive": { unit: "GB-Mo", pricePerUnit: 0.00099, currency: "USD" },

      // --- Requests ---
      "s3_requests_put": { unit: "1k Reqs", pricePerUnit: 0.005, currency: "USD" },
      "s3_requests_get": { unit: "1k Reqs", pricePerUnit: 0.0004, currency: "USD" },
      "s3_lifecycle": { unit: "1k Reqs", pricePerUnit: 0.01, currency: "USD" }, // Transition requests

      // --- Data Transfer & Features ---
      "s3_data_transfer_out": { unit: "GB", pricePerUnit: 0.09, currency: "USD" },
      "s3_transfer_acceleration": { unit: "GB", pricePerUnit: 0.04, currency: "USD" }, // Add-on cost
      "s3_replication_crr": { unit: "GB", pricePerUnit: 0.02, currency: "USD" }, // Inter-region transfer for CRR

      // --- Management ---
      "s3_inventory": { unit: "Million Objs", pricePerUnit: 0.0025, currency: "USD" },
      "s3_analytics": { unit: "Million Objs/Mo", pricePerUnit: 0.10, currency: "USD" },
    },
    [ServiceType.CLOUDWATCH]: {
      // --- Metrics ---
      "cw_metric_custom": { unit: "Metric", pricePerUnit: 0.30, currency: "USD" }, // First 10k tier
      "cw_api_request": { unit: "1k Reqs", pricePerUnit: 0.01, currency: "USD" },

      // --- Dashboards ---
      "cw_dashboard": { unit: "Dashboard", pricePerUnit: 3.00, currency: "USD" },

      // --- Alarms ---
      "cw_alarm_standard": { unit: "Alarm", pricePerUnit: 0.10, currency: "USD" },
      "cw_alarm_high_res": { unit: "Alarm", pricePerUnit: 0.30, currency: "USD" },

      // --- Logs ---
      "cw_logs_ingestion": { unit: "GB", pricePerUnit: 0.50, currency: "USD" },
      "cw_logs_storage": { unit: "GB-Mo", pricePerUnit: 0.03, currency: "USD" },
      "cw_vended_logs": { unit: "GB", pricePerUnit: 0.50, currency: "USD" }, // e.g. VPC Flow logs

      // --- Synthetics & RUM ---
      "cw_synthetics_canary": { unit: "Run", pricePerUnit: 0.0012, currency: "USD" },
      "cw_rum_events": { unit: "100k Events", pricePerUnit: 1.00, currency: "USD" }, // $1 per 100k

      // --- Events (EventBridge) ---
      "cw_events_custom": { unit: "1M Events", pricePerUnit: 1.00, currency: "USD" },

      // --- Insights ---
      "cw_contributor_insights": { unit: "Rule-Mo", pricePerUnit: 0.30, currency: "USD" },
    },
    [ServiceType.ROUTE53]: {
      // --- Hosted Zones ---
      "r53_hosted_zone": { unit: "Zone", pricePerUnit: 0.50, currency: "USD" }, // First 25 zones

      // --- Queries ---
      "r53_query_standard": { unit: "1M Queries", pricePerUnit: 0.40, currency: "USD" },
      "r53_query_geo": { unit: "1M Queries", pricePerUnit: 0.60, currency: "USD" }, // Latency/Geo/Failover

      // --- Health Checks ---
      "r53_health_check_aws": { unit: "Check", pricePerUnit: 0.50, currency: "USD" },
      "r53_health_check_non_aws": { unit: "Check", pricePerUnit: 0.75, currency: "USD" },

      // --- Resolver ---
      "r53_resolver_eni": { unit: "Hrs", pricePerUnit: 0.125, currency: "USD" },
      "r53_resolver_query": { unit: "1M Queries", pricePerUnit: 0.40, currency: "USD" },
      "r53_dns_firewall": { unit: "1M Queries", pricePerUnit: 0.60, currency: "USD" },

      // --- Domain Registration (Amortized monthly) ---
      "r53_domain": { unit: "Domain/Mo", pricePerUnit: 1.00, currency: "USD" }, // ~$12/yr
    },
    [ServiceType.LAMBDA]: {
      // --- Requests ---
      "lambda_requests": { unit: "1M Reqs", pricePerUnit: 0.20, currency: "USD" },
      
      // --- Compute (Duration) ---
      // Price per GB-second
      "lambda_duration_x86": { unit: "GB-s", pricePerUnit: 0.0000166667, currency: "USD" },
      "lambda_duration_arm": { unit: "GB-s", pricePerUnit: 0.0000133334, currency: "USD" },

      // --- Provisioned Concurrency ---
      "lambda_provisioned_concurrency": { unit: "GB-s", pricePerUnit: 0.0000041667, currency: "USD" },
      "lambda_provisioned_requests": { unit: "1M Reqs", pricePerUnit: 0.00, currency: "USD" }, 

      // --- Ephemeral Storage ---
      "lambda_storage": { unit: "GB-s", pricePerUnit: 0.0000000309, currency: "USD" }, // For storage > 512MB
    },
    [ServiceType.RDS]: {
      // --- Instances (Single-AZ) ---
      "db.t3.micro": { unit: "Hrs", pricePerUnit: 0.017, currency: "USD" },
      "db.t3.medium": { unit: "Hrs", pricePerUnit: 0.068, currency: "USD" },
      "db.m5.large": { unit: "Hrs", pricePerUnit: 0.192, currency: "USD" },
      "db.r5.large": { unit: "Hrs", pricePerUnit: 0.252, currency: "USD" },

      // --- Storage ---
      "rds_gp3_storage": { unit: "GB-Mo", pricePerUnit: 0.115, currency: "USD" },
      "rds_gp2_storage": { unit: "GB-Mo", pricePerUnit: 0.115, currency: "USD" },
      "rds_io2_storage": { unit: "GB-Mo", pricePerUnit: 0.125, currency: "USD" },
      
      // --- Backup Storage ---
      "rds_backup_storage": { unit: "GB-Mo", pricePerUnit: 0.095, currency: "USD" },

      // --- IOPS (for io1) ---
      "rds_iops": { unit: "IOPS-Mo", pricePerUnit: 0.10, currency: "USD" },
    },
    [ServiceType.API_GATEWAY]: {
      // --- Requests ---
      "apigw_rest_requests": { unit: "1M Reqs", pricePerUnit: 3.50, currency: "USD" },
      "apigw_http_requests": { unit: "1M Reqs", pricePerUnit: 1.00, currency: "USD" },
      
      // --- Caching (Hourly) ---
      "apigw_cache_0_5": { unit: "Hrs", pricePerUnit: 0.02, currency: "USD" },
      "apigw_cache_1_6": { unit: "Hrs", pricePerUnit: 0.038, currency: "USD" },
      "apigw_cache_6_1": { unit: "Hrs", pricePerUnit: 0.20, currency: "USD" },
      "apigw_cache_13_5": { unit: "Hrs", pricePerUnit: 0.44, currency: "USD" },
    },
    [ServiceType.CLOUDFRONT]: {
      // --- Data Transfer Out (Simplified Blended) ---
      "cf_data_transfer_out": { unit: "GB", pricePerUnit: 0.085, currency: "USD" },
      
      // --- Requests ---
      "cf_requests_http": { unit: "10k Reqs", pricePerUnit: 0.0075, currency: "USD" },
      "cf_requests_https": { unit: "10k Reqs", pricePerUnit: 0.0100, currency: "USD" },

      // --- Origin Shield (Request + Transfer usually, simplified to request surcharge here) ---
      "cf_origin_shield_request": { unit: "10k Reqs", pricePerUnit: 0.0075, currency: "USD" },

      // --- Dedicated IP (SSL) ---
      "cf_dedicated_ip_custom_ssl": { unit: "Month", pricePerUnit: 600.00, currency: "USD" },
    },
    [ServiceType.DYNAMODB]: {
      // --- Storage ---
      "ddb_storage_std": { unit: "GB-Mo", pricePerUnit: 0.25, currency: "USD" },
      "ddb_storage_ia": { unit: "GB-Mo", pricePerUnit: 0.10, currency: "USD" },
      
      // --- Provisioned Capacity ---
      "ddb_wcu_hourly": { unit: "WCU-Hr", pricePerUnit: 0.00065, currency: "USD" },
      "ddb_rcu_hourly": { unit: "RCU-Hr", pricePerUnit: 0.00013, currency: "USD" },
      
      // --- On-Demand Capacity ---
      "ddb_wru_ondemand": { unit: "1M WRU", pricePerUnit: 1.25, currency: "USD" },
      "ddb_rru_ondemand": { unit: "1M RRU", pricePerUnit: 0.25, currency: "USD" },
      
      // --- Backups & Streams ---
      "ddb_backup_storage": { unit: "GB-Mo", pricePerUnit: 0.10, currency: "USD" },
      "ddb_pitr": { unit: "GB-Mo", pricePerUnit: 0.20, currency: "USD" },
      "ddb_stream_read": { unit: "1M Reqs", pricePerUnit: 0.20, currency: "USD" }, // ~0.02 per 100k
      
      // --- Global Tables (Replicated Write) ---
      "ddb_replicated_write": { unit: "1M WRU", pricePerUnit: 1.875, currency: "USD" }, // Global Tables v2019
    },
    [ServiceType.ACM]: {
        // --- Private CA ---
        "acm_private_ca": { unit: "CA-Mo", pricePerUnit: 400.00, currency: "USD" },
        // Simplified Tier 1 Pricing for Private Certs (First 1000)
        "acm_private_cert": { unit: "Cert", pricePerUnit: 0.75, currency: "USD" },
    },
    [ServiceType.OPENSEARCH]: {
        // --- Instances (Pricing proxies) ---
        "t3.small.search": { unit: "Hrs", pricePerUnit: 0.036, currency: "USD" },
        "m6g.large.search": { unit: "Hrs", pricePerUnit: 0.167, currency: "USD" },
        "r6g.large.search": { unit: "Hrs", pricePerUnit: 0.236, currency: "USD" },
        "r6g.xlarge.search": { unit: "Hrs", pricePerUnit: 0.472, currency: "USD" },
        
        // --- Storage ---
        "os_storage_gp3": { unit: "GB-Mo", pricePerUnit: 0.08, currency: "USD" },
        "os_storage_io1": { unit: "GB-Mo", pricePerUnit: 0.125, currency: "USD" },
    },
    [ServiceType.CLOUDTRAIL]: {
        "trail_mgmt_paid": { unit: "100k Events", pricePerUnit: 2.00, currency: "USD" },
        "trail_data_events": { unit: "100k Events", pricePerUnit: 0.10, currency: "USD" },
        "trail_insights": { unit: "100k Events", pricePerUnit: 0.35, currency: "USD" },
        "trail_lake_ingestion": { unit: "GB", pricePerUnit: 2.50, currency: "USD" },
        "trail_lake_storage": { unit: "GB-Mo", pricePerUnit: 0.20, currency: "USD" }, // Retention cost
        "trail_lake_query": { unit: "GB Scanned", pricePerUnit: 0.005, currency: "USD" },
    },
    [ServiceType.ECR]: {
        "ecr_storage": { unit: "GB-Mo", pricePerUnit: 0.10, currency: "USD" },
    },
    [ServiceType.ECR_PUBLIC]: {
        "ecr_public_storage": { unit: "GB-Mo", pricePerUnit: 0.10, currency: "USD" },
    },
    [ServiceType.ECS]: {
      "fargate_linux_vcpu": { unit: "vCPU-Hr", pricePerUnit: 0.04048, currency: "USD" },
      "fargate_linux_memory": { unit: "GB-Hr", pricePerUnit: 0.004445, currency: "USD" },
      "fargate_arm_vcpu": { unit: "vCPU-Hr", pricePerUnit: 0.03238, currency: "USD" },
      "fargate_arm_memory": { unit: "GB-Hr", pricePerUnit: 0.00356, currency: "USD" },
      "fargate_windows_vcpu": { unit: "vCPU-Hr", pricePerUnit: 0.09148, currency: "USD" }, // OS license included roughly
      "fargate_windows_memory": { unit: "GB-Hr", pricePerUnit: 0.01005, currency: "USD" },
      "fargate_storage": { unit: "GB-Mo", pricePerUnit: 0.10, currency: "USD" }, // >20GB
    },
    [ServiceType.EFS]: {
      "efs_storage_standard": { unit: "GB-Mo", pricePerUnit: 0.30, currency: "USD" },
      "efs_storage_one_zone": { unit: "GB-Mo", pricePerUnit: 0.16, currency: "USD" },
      "efs_storage_ia": { unit: "GB-Mo", pricePerUnit: 0.025, currency: "USD" },
      "efs_storage_one_zone_ia": { unit: "GB-Mo", pricePerUnit: 0.0133, currency: "USD" },
      "efs_storage_archive": { unit: "GB-Mo", pricePerUnit: 0.008, currency: "USD" },
      "efs_throughput_provisioned": { unit: "MB/s-Mo", pricePerUnit: 6.00, currency: "USD" },
      "efs_throughput_elastic_read": { unit: "GB", pricePerUnit: 0.03, currency: "USD" },
      "efs_throughput_elastic_write": { unit: "GB", pricePerUnit: 0.06, currency: "USD" },
      "efs_ia_access": { unit: "GB", pricePerUnit: 0.01, currency: "USD" },
      "efs_archive_access": { unit: "GB", pricePerUnit: 0.03, currency: "USD" },
    },
    [ServiceType.EKS]: {
      "eks_cluster_hourly": { unit: "Hrs", pricePerUnit: 0.10, currency: "USD" },
      "eks_extended_support_hourly": { unit: "Hrs", pricePerUnit: 0.60, currency: "USD" },
    },
    [ServiceType.ELASTICACHE]: {
      "cache.t3.micro": { unit: "Hrs", pricePerUnit: 0.017, currency: "USD" },
      "cache.t3.medium": { unit: "Hrs", pricePerUnit: 0.068, currency: "USD" },
      "cache.m5.large": { unit: "Hrs", pricePerUnit: 0.156, currency: "USD" },
      "cache.m6g.large": { unit: "Hrs", pricePerUnit: 0.129, currency: "USD" },
      "cache.r6g.large": { unit: "Hrs", pricePerUnit: 0.167, currency: "USD" },
      "elasticache_backup_storage": { unit: "GB-Mo", pricePerUnit: 0.085, currency: "USD" },
    },
    [ServiceType.WAF]: {
      "waf_web_acl": { unit: "Web ACL-Mo", pricePerUnit: 5.00, currency: "USD" },
      "waf_rule": { unit: "Rule-Mo", pricePerUnit: 1.00, currency: "USD" },
      "waf_request_million": { unit: "1M Reqs", pricePerUnit: 0.60, currency: "USD" },
      "waf_bot_control_subscription": { unit: "Month", pricePerUnit: 10.00, currency: "USD" },
      "waf_bot_control_request": { unit: "1M Reqs", pricePerUnit: 1.00, currency: "USD" },
      "waf_fraud_control_subscription": { unit: "Month", pricePerUnit: 10.00, currency: "USD" },
      "waf_fraud_control_request": { unit: "1M Reqs", pricePerUnit: 1.00, currency: "USD" },
    },
    [ServiceType.SYSTEMS_MANAGER]: {
      "ssm_param_store_advanced_storage": { unit: "Param-Mo", pricePerUnit: 0.05, currency: "USD" },
      "ssm_param_store_throughput": { unit: "10k Reqs", pricePerUnit: 0.05, currency: "USD" },
      "ssm_ops_items": { unit: "1k Items", pricePerUnit: 2.97, currency: "USD" },
      "ssm_automation_step": { unit: "Step", pricePerUnit: 0.002, currency: "USD" },
      "ssm_change_manager": { unit: "Request", pricePerUnit: 0.296, currency: "USD" },
      "ssm_advanced_instance": { unit: "Instance-Mo", pricePerUnit: 5.00, currency: "USD" },
    },
    [ServiceType.SECRETS_MANAGER]: {
        "sm_secret_month": { unit: "Secret-Mo", pricePerUnit: 0.40, currency: "USD" },
        "sm_api_requests": { unit: "10k Reqs", pricePerUnit: 0.05, currency: "USD" },
    },
    [ServiceType.KMS]: {
        "kms_key_monthly": { unit: "Key-Mo", pricePerUnit: 1.00, currency: "USD" },
        "kms_requests": { unit: "10k Reqs", pricePerUnit: 0.03, currency: "USD" },
    },
    [ServiceType.CLOUDFORMATION]: {
        "cfn_handler_operation": { unit: "Op", pricePerUnit: 0.0009, currency: "USD" },
        "cfn_handler_duration": { unit: "Sec", pricePerUnit: 0.00008, currency: "USD" },
    },
    [ServiceType.MSK]: {
        "kafka.t3.small": { unit: "Hrs", pricePerUnit: 0.0416, currency: "USD" },
        "kafka.m5.large": { unit: "Hrs", pricePerUnit: 0.21, currency: "USD" },
        "kafka.m5.xlarge": { unit: "Hrs", pricePerUnit: 0.42, currency: "USD" },
        "kafka.m5.2xlarge": { unit: "Hrs", pricePerUnit: 0.84, currency: "USD" },
        "msk_storage": { unit: "GB-Mo", pricePerUnit: 0.10, currency: "USD" },
    },
    [ServiceType.SNS]: {
        "sns_requests": { unit: "1M Reqs", pricePerUnit: 0.50, currency: "USD" },
    },
    [ServiceType.SQS]: {
        "sqs_requests_std": { unit: "1M Reqs", pricePerUnit: 0.40, currency: "USD" },
        "sqs_requests_fifo": { unit: "1M Reqs", pricePerUnit: 0.50, currency: "USD" },
    },
    [ServiceType.SES]: {
        "ses_email_1k": { unit: "1k Emails", pricePerUnit: 0.10, currency: "USD" },
        "ses_dedicated_ip": { unit: "Month", pricePerUnit: 24.95, currency: "USD" },
    },
    [ServiceType.MQ]: {
        "mq.t3.micro": { unit: "Hrs", pricePerUnit: 0.03, currency: "USD" }, // Proxy price
        "mq.m5.large": { unit: "Hrs", pricePerUnit: 0.30, currency: "USD" }, // Proxy price
        "mq_storage": { unit: "GB-Mo", pricePerUnit: 0.10, currency: "USD" },
    },
    [ServiceType.SHIELD]: {
        "shield_advanced_subscription": { unit: "Month", pricePerUnit: 3000.00, currency: "USD" },
    },
    [ServiceType.CONFIG]: {
        "config_ci_recording": { unit: "CI", pricePerUnit: 0.003, currency: "USD" },
        "config_rule_evaluation": { unit: "Eval", pricePerUnit: 0.001, currency: "USD" },
    },
    [ServiceType.IAM]: {
        "iam_user": { unit: "User", pricePerUnit: 0.00, currency: "USD" },
        "iam_role": { unit: "Role", pricePerUnit: 0.00, currency: "USD" },
        "iam_policy": { unit: "Policy", pricePerUnit: 0.00, currency: "USD" },
        "iam_api_request": { unit: "1M Reqs", pricePerUnit: 0.00, currency: "USD" },
    },
    [ServiceType.KINESIS]: {
        "kinesis_shard_hour": { unit: "Shard-Hr", pricePerUnit: 0.015, currency: "USD" },
        "kinesis_put_unit": { unit: "1M Units", pricePerUnit: 0.014, currency: "USD" },
        "kinesis_retention": { unit: "Shard-Hr", pricePerUnit: 0.02, currency: "USD" }, // Extended retention
        "kinesis_ondemand_stream_hour": { unit: "Stream-Hr", pricePerUnit: 0.045, currency: "USD" },
        "kinesis_ondemand_data_in": { unit: "GB", pricePerUnit: 0.08, currency: "USD" },
        "kinesis_ondemand_data_out": { unit: "GB", pricePerUnit: 0.04, currency: "USD" },
        "kinesis_efo_shard_hour": { unit: "Consumer-Shard-Hr", pricePerUnit: 0.015, currency: "USD" },
        "kinesis_efo_data": { unit: "GB", pricePerUnit: 0.013, currency: "USD" },
    },
    [ServiceType.EVENTBRIDGE]: {
        "eb_put_events": { unit: "1M Events", pricePerUnit: 1.00, currency: "USD" },
        "eb_cross_region": { unit: "1M Events", pricePerUnit: 1.00, currency: "USD" }, // Transfer cost implied + event cost
        "eb_archive_processing": { unit: "GB", pricePerUnit: 0.10, currency: "USD" },
        "eb_schema_registry": { unit: "Mo", pricePerUnit: 0.00, currency: "USD" }, // Free for now
    },
    [ServiceType.ELASTIC_DR]: {
        "drs_source_server_hour": { unit: "Server-Hr", pricePerUnit: 0.028, currency: "USD" }, // ~$20/month
    },
    [ServiceType.CODEARTIFACT]: {
        "ca_storage": { unit: "GB-Mo", pricePerUnit: 0.05, currency: "USD" },
        "ca_requests": { unit: "10k Reqs", pricePerUnit: 0.05, currency: "USD" },
    },
    [ServiceType.CODEBUILD]: {
        "build_general1_small_linux": { unit: "Min", pricePerUnit: 0.005, currency: "USD" },
        "build_general1_medium_linux": { unit: "Min", pricePerUnit: 0.01, currency: "USD" },
        "build_general1_large_linux": { unit: "Min", pricePerUnit: 0.02, currency: "USD" },
        "build_general1_small_windows": { unit: "Min", pricePerUnit: 0.009, currency: "USD" },
        "build_general1_medium_windows": { unit: "Min", pricePerUnit: 0.018, currency: "USD" },
        "build_general1_large_windows": { unit: "Min", pricePerUnit: 0.036, currency: "USD" },
    },
    [ServiceType.CODECOMMIT]: {
        "cc_user_month": { unit: "User-Mo", pricePerUnit: 1.00, currency: "USD" },
        "cc_storage": { unit: "GB-Mo", pricePerUnit: 0.06, currency: "USD" },
        "cc_requests": { unit: "Requests", pricePerUnit: 0.00, currency: "USD" }, // Generally free for Git
    },
    [ServiceType.CODEDEPLOY]: {
        "cd_onprem_update": { unit: "Update", pricePerUnit: 0.02, currency: "USD" },
    },
    [ServiceType.CODEPIPELINE]: {
        "cp_active_pipeline": { unit: "Pipeline-Mo", pricePerUnit: 1.00, currency: "USD" },
    },
    [ServiceType.DATA_TRANSFER]: {
        "dt_internet_out": { unit: "GB", pricePerUnit: 0.09, currency: "USD" },
        "dt_inter_region": { unit: "GB", pricePerUnit: 0.02, currency: "USD" },
        "dt_intra_region": { unit: "GB", pricePerUnit: 0.01, currency: "USD" },
    },
    [ServiceType.GLOBAL_ACCELERATOR]: {
        "ga_hourly": { unit: "Accelerator-Hr", pricePerUnit: 0.025, currency: "USD" }, // $0.025 per endpoint group? No, it's $0.025 per accelerator hour fixed fee. Wait, it's $0.025 per hour.
        "ga_dt_premium": { unit: "GB", pricePerUnit: 0.015, currency: "USD" }, // Simplified premium rate
    },
    [ServiceType.FMS]: {
        "fms_policy": { unit: "Policy/Mo", pricePerUnit: 100.00, currency: "USD" },
    },
    [ServiceType.BACKUP]: {
        "backup_storage_warm": { unit: "GB-Mo", pricePerUnit: 0.05, currency: "USD" },
        "backup_restore": { unit: "GB", pricePerUnit: 0.02, currency: "USD" },
    },
    [ServiceType.FSX]: {
        "fsx_windows_storage_multi_az": { unit: "GB-Mo", pricePerUnit: 0.13, currency: "USD" },
        "fsx_windows_storage_single_az": { unit: "GB-Mo", pricePerUnit: 0.113, currency: "USD" },
        "fsx_windows_throughput": { unit: "MB/s-Mo", pricePerUnit: 4.50, currency: "USD" },
        "fsx_lustre_storage": { unit: "GB-Mo", pricePerUnit: 0.14, currency: "USD" },
        "fsx_backup": { unit: "GB-Mo", pricePerUnit: 0.05, currency: "USD" },
    },
    [ServiceType.S3_GLACIER]: {
        "glacier_storage": { unit: "GB-Mo", pricePerUnit: 0.004, currency: "USD" }, // Standard Vault
        "glacier_requests": { unit: "1k Reqs", pricePerUnit: 0.05, currency: "USD" },
        "glacier_retrieval": { unit: "GB", pricePerUnit: 0.01, currency: "USD" }, // Standard retrieval
    },
    [ServiceType.STEP_FUNCTIONS]: {
        "sfn_standard_transition": { unit: "1k Transitions", pricePerUnit: 0.025, currency: "USD" },
        "sfn_express_request": { unit: "1M Reqs", pricePerUnit: 1.00, currency: "USD" },
        "sfn_express_gb_second": { unit: "GB-s", pricePerUnit: 0.00001667, currency: "USD" },
    },
    [ServiceType.XRAY]: {
        "xray_trace_recorded": { unit: "1M Traces", pricePerUnit: 5.00, currency: "USD" },
        "xray_trace_retrieved": { unit: "1M Traces", pricePerUnit: 0.50, currency: "USD" },
        "xray_data_scanned": { unit: "GB", pricePerUnit: 0.50, currency: "USD" },
    },
    [ServiceType.PINPOINT]: {
        "pinpoint_mta": { unit: "Endpoint", pricePerUnit: 0.0012, currency: "USD" }, // > 5000 endpoints
        "pinpoint_events": { unit: "1M Events", pricePerUnit: 1.00, currency: "USD" }, // roughly $1 per million after 100M? Actually free for first 100M then 1.00? Simplified.
        // Simplified event ingestion to $0.000001 per event
    },
  }
};

export const getPrice = (region: Region, service: ServiceType, key: string) => {
  // @ts-ignore - simplified lookup for demo
  const regionData = PRICING_DATA[region];
  if (!regionData) return { pricePerUnit: 0, unit: 'N/A', currency: 'USD' };
  
  // @ts-ignore
  const serviceData = regionData[service];
  if (!serviceData) return { pricePerUnit: 0, unit: 'N/A', currency: 'USD' };

  return serviceData[key] || { pricePerUnit: 0, unit: 'N/A', currency: 'USD' };
};