import { CostEstimation, Region, ResourceConfig, ServiceType, LoadBalancerType, Tenancy, LambdaArchitecture, RDSDeploymentOption, EbsVolumeType, ApiGatewayType, ApiGatewayCacheSize, DynamoDBCapacityMode, DynamoDBTableClass, AcmCertificateType, ECSLaunchType, FargatePlatform, EFSThroughputMode, ElastiCacheEngine, AmazonMQDeploymentMode, ShieldProtectionType, KinesisStreamMode, CodeBuildOs, CodeBuildComputeType, FSxType, FSxDeploymentType, StepFunctionsType, InstanceType, PricingRepository } from "../types";
import { getPrice } from "../services/pricingRepository";

const HOURS_IN_MONTH = 730;

export const calculateResourceCost = (resource: ResourceConfig, pricingData: PricingRepository): CostEstimation => {
  const breakdown = [];
  let monthlyTotal = 0;

  if (!pricingData) {
      return { monthlyTotal: 0, breakdown: [] };
  }

  const addCost = (service: ServiceType, key: string, label: string, qty: number, type: 'hourly' | 'usage' | 'flat', multiplier: number = 1) => {
      if (qty <= 0) return;
      
      const rate = getPrice(pricingData, resource.region, service, key);
      let total = 0;
      let unitLabel = rate.unit;
      let quantityDisplay = qty;

      if (type === 'hourly') {
          // If a custom utilization multiplier (e.g. not 730 hours) is passed, use that
          const hours = multiplier === 1 ? HOURS_IN_MONTH : multiplier;
          total = qty * hours * rate.pricePerUnit;
          quantityDisplay = qty * hours;
          unitLabel = "Hrs";
      } else if (type === 'usage') {
          total = qty * rate.pricePerUnit;
      } else if (type === 'flat') {
          total = qty * rate.pricePerUnit; // e.g. per instance-month
      }

      breakdown.push({
        label,
        unitCost: rate.pricePerUnit,
        quantity: quantityDisplay,
        unit: unitLabel,
        total
      });
      monthlyTotal += total;
  };

  // --- VPC ---
  if (resource.serviceType === ServiceType.VPC) {
    const { 
      natGateways, 
      natDataProcessed, 
      publicIps, 
      vpnConnections, 
      clientVpnEnabled, 
      clientVpnAssociations, 
      clientVpnActiveConnections, 
      vpcEndpointsInterface, 
      transitGatewayAttachments, 
      transitGatewayDataProcessed, 
      trafficMirrorSessions, 
      flowLogsEnabled, 
      flowLogsDataIngested, 
      dataTransferOut, 
      dataTransferIntraRegion, 
      enableVpcPeering, 
      vpcPeeringDataTransfer 
    } = resource.attributes;

    addCost(ServiceType.VPC, "nat_gateway_hourly", "NAT Gateway (Hourly)", natGateways, 'hourly');
    addCost(ServiceType.VPC, "nat_gateway_processed_bytes", "NAT Gateway (Data)", natDataProcessed, 'usage');
    addCost(ServiceType.VPC, "public_ipv4_hourly", "Public IPv4 Addresses", publicIps, 'hourly');
    addCost(ServiceType.VPC, "vpn_connection_hourly", "Site-to-Site VPN Connection", vpnConnections, 'hourly');
    if (clientVpnEnabled) {
      addCost(ServiceType.VPC, "client_vpn_association_hourly", "Client VPN Endpoints (Assoc.)", clientVpnAssociations, 'hourly');
      addCost(ServiceType.VPC, "client_vpn_connection_hourly", "Client VPN Connections (Active)", clientVpnActiveConnections, 'hourly');
    }
    addCost(ServiceType.VPC, "vpc_endpoint_interface_hourly", "Interface Endpoints", vpcEndpointsInterface, 'hourly');
    addCost(ServiceType.VPC, "transit_gateway_attachment_hourly", "Transit Gateway Attachments", transitGatewayAttachments, 'hourly');
    addCost(ServiceType.VPC, "transit_gateway_processed_bytes", "Transit Gateway (Data)", transitGatewayDataProcessed, 'usage');
    addCost(ServiceType.VPC, "traffic_mirroring_hourly", "Traffic Mirroring Sessions", trafficMirrorSessions, 'hourly');
    if (flowLogsEnabled) {
      addCost(ServiceType.VPC, "flow_logs_ingestion", "VPC Flow Logs (Ingestion)", flowLogsDataIngested, 'usage');
    }
    addCost(ServiceType.VPC, "data_transfer_internet_out", "Data Transfer (Internet Out)", dataTransferOut, 'usage');
    addCost(ServiceType.VPC, "data_transfer_intra_region", "Cross-AZ Data Transfer", dataTransferIntraRegion, 'usage');
    if (enableVpcPeering) {
      addCost(ServiceType.VPC, "data_transfer_vpc_peering", "VPC Peering Data Transfer", vpcPeeringDataTransfer, 'usage');
    }
  } 
  // --- EC2 ---
  else if (resource.serviceType === ServiceType.EC2) {
    const {
        instanceCount,
        instanceType,
        tenancy,
        monitoringEnabled,
        rootVolumeType,
        rootVolumeSize,
        rootVolumeIops,
        dataVolumeCount,
        dataVolumeType,
        dataVolumeSize,
        ec2DataVolumes,
        snapshotDataChange,
        elasticIps,
        utilizationHours,
        enableSpotInstances,
        spotDiscountPercentage,
        dataTransferOut,
        loadBalancerType, 
        loadBalancerCount, 
        loadBalancerDataProcessed 
    } = resource.attributes;

    const rate = getPrice(pricingData, resource.region, ServiceType.EC2, instanceType);
    const rawComputeCost = instanceCount * utilizationHours * rate.pricePerUnit;
    if (enableSpotInstances) {
        const discountFactor = (100 - spotDiscountPercentage) / 100;
        const discountedTotal = rawComputeCost * discountFactor;
        breakdown.push({
            label: `EC2 Instances (${instanceType} - Spot ${spotDiscountPercentage}%)`,
            unitCost: rate.pricePerUnit * discountFactor,
            quantity: instanceCount * utilizationHours,
            unit: "Hrs",
            total: discountedTotal
        });
        monthlyTotal += discountedTotal;
    } else {
        addCost(ServiceType.EC2, instanceType, `EC2 Instances (${instanceType})`, instanceCount, 'hourly', utilizationHours);
    }
    if (tenancy === Tenancy.DEDICATED_INSTANCE) {
        addCost(ServiceType.EC2, "tenancy_dedicated_instance", "Dedicated Instance Surcharge", instanceCount, 'hourly', utilizationHours);
    } else if (tenancy === Tenancy.DEDICATED_HOST) {
        addCost(ServiceType.EC2, "tenancy_dedicated_host", "Dedicated Host Reservation", instanceCount, 'hourly', utilizationHours);
    }
    if (monitoringEnabled) {
        addCost(ServiceType.EC2, "cw_detailed_monitoring", "Detailed Monitoring", instanceCount, 'flat');
    }
    const rootVolKey = `ebs_${rootVolumeType}_storage`;
    addCost(ServiceType.EC2, rootVolKey, `EBS Root Volume (${rootVolumeType})`, instanceCount * rootVolumeSize, 'usage');
    if (rootVolumeIops > 3000) { 
        addCost(ServiceType.EC2, "ebs_iops", "EBS Provisioned IOPS (Root)", instanceCount * (rootVolumeIops - 3000), 'usage');
    }
    
    if (ec2DataVolumes && ec2DataVolumes.length > 0) {
        ec2DataVolumes.forEach((vol, idx) => {
            const volKey = `ebs_${vol.type}_storage`;
            addCost(ServiceType.EC2, volKey, `EBS Data Volume #${idx + 1} (${vol.type})`, instanceCount * vol.count * vol.size, 'usage');
        });
    } else if (dataVolumeCount > 0) {
        const dataVolKey = `ebs_${dataVolumeType}_storage`;
        addCost(ServiceType.EC2, dataVolKey, `EBS Data Volume (${dataVolumeType})`, instanceCount * dataVolumeCount * dataVolumeSize, 'usage');
    }

    addCost(ServiceType.EC2, "ebs_snapshot_storage", "EBS Snapshots", snapshotDataChange, 'usage');
    addCost(ServiceType.EC2, "eip_idle_hourly", "Elastic IP (Idle/Remapped)", elasticIps, 'hourly');
    addCost(ServiceType.VPC, "data_transfer_internet_out", "Data Transfer (Internet Out)", dataTransferOut, 'usage');
    
    if (loadBalancerType && loadBalancerType !== LoadBalancerType.NONE && loadBalancerCount > 0) {
        const lbKey = loadBalancerType === LoadBalancerType.ALB ? "alb_hourly" : "nlb_hourly";
        addCost(ServiceType.ELB, lbKey, `${loadBalancerType} (Associated)`, loadBalancerCount, 'hourly');
        addCost(ServiceType.ELB, "lb_lcu_data", "Load Balancer Processing", loadBalancerDataProcessed, 'usage');
    }
  }
  // --- ELB ---
  else if (resource.serviceType === ServiceType.ELB) {
      const { loadBalancers } = resource.attributes;
      if (loadBalancers && loadBalancers.length > 0) {
          loadBalancers.forEach(lb => {
              const lbKey = lb.type === LoadBalancerType.ALB ? "alb_hourly" : lb.type === LoadBalancerType.NLB ? "nlb_hourly" : "gwlb_hourly";
              addCost(ServiceType.ELB, lbKey, `${lb.name} Hourly`, 1, 'hourly');
              const lcuKey = lb.type === LoadBalancerType.ALB ? "alb_lcu_hour" : lb.type === LoadBalancerType.NLB ? "nlb_lcu_hour" : "gwlb_lcu_hour";
              addCost(ServiceType.ELB, lcuKey, `${lb.name} Capacity/Data`, lb.processedBytes, 'usage'); 
          });
      }
  }
  // --- ElastiCache ---
  else if (resource.serviceType === ServiceType.ELASTICACHE) {
      const { elastiCacheClusters } = resource.attributes;
      if (elastiCacheClusters && elastiCacheClusters.length > 0) {
          elastiCacheClusters.forEach(cluster => {
              addCost(ServiceType.ELASTICACHE, cluster.nodeType, `${cluster.name} Nodes`, cluster.nodeCount, 'hourly');
              if (cluster.engine === ElastiCacheEngine.REDIS) {
                  addCost(ServiceType.ELASTICACHE, "elasticache_backup_storage", `${cluster.name} Backup`, cluster.snapshotStorage, 'usage');
              }
          });
      }
  }
  // --- EFS ---
  else if (resource.serviceType === ServiceType.EFS) {
      const { efsFileSystems } = resource.attributes;
      if (efsFileSystems && efsFileSystems.length > 0) {
          efsFileSystems.forEach(fs => {
              const stdKey = fs.isOneZone ? "efs_storage_one_zone" : "efs_storage_standard";
              addCost(ServiceType.EFS, stdKey, `${fs.name} Storage`, fs.storageStandard, 'usage');
              
              const iaKey = fs.isOneZone ? "efs_storage_one_zone_ia" : "efs_storage_ia";
              addCost(ServiceType.EFS, iaKey, `${fs.name} IA Storage`, fs.storageIA, 'usage');
              
              if (!fs.isOneZone) {
                  addCost(ServiceType.EFS, "efs_storage_archive", `${fs.name} Archive`, fs.storageArchive, 'usage');
              }

              if (fs.throughputMode === EFSThroughputMode.PROVISIONED) {
                  addCost(ServiceType.EFS, "efs_throughput_provisioned", `${fs.name} Throughput`, fs.provisionedThroughput, 'usage');
              } else if (fs.throughputMode === EFSThroughputMode.ELASTIC) {
                  addCost(ServiceType.EFS, "efs_throughput_elastic_read", `${fs.name} Read`, fs.elasticRead, 'usage');
                  addCost(ServiceType.EFS, "efs_throughput_elastic_write", `${fs.name} Write`, fs.elasticWrite, 'usage');
              }
          });
      }
  }
  // --- Kinesis ---
  else if (resource.serviceType === ServiceType.KINESIS) {
      const { kinesisStreams } = resource.attributes;
      if (kinesisStreams && kinesisStreams.length > 0) {
          kinesisStreams.forEach(stream => {
              if (stream.mode === KinesisStreamMode.PROVISIONED) {
                  addCost(ServiceType.KINESIS, "kinesis_shard_hour", `${stream.name} Shards`, stream.shardCount, 'hourly');
              } else {
                  addCost(ServiceType.KINESIS, "kinesis_ondemand_stream_hour", `${stream.name} Stream`, 1, 'hourly');
                  addCost(ServiceType.KINESIS, "kinesis_ondemand_data_in", `${stream.name} Ingest`, stream.dataProcessed, 'usage');
              }
              addCost(ServiceType.KINESIS, "kinesis_put_unit", `${stream.name} PUT Payload`, stream.dataProcessed * 1000, 'usage'); 
              
              if (stream.retentionHours > 24) {
                  addCost(ServiceType.KINESIS, "kinesis_retention", `${stream.name} Ext Retention`, stream.shardCount * (stream.retentionHours - 24), 'usage');
              }
              if (stream.enhancedFanOut) {
                  addCost(ServiceType.KINESIS, "kinesis_efo_shard_hour", `${stream.name} EFO`, stream.consumerCount * stream.shardCount, 'hourly');
                  addCost(ServiceType.KINESIS, "kinesis_efo_data", `${stream.name} EFO Data`, stream.dataProcessed, 'usage');
              }
          });
      }
  }
  // --- OpenSearch ---
  else if (resource.serviceType === ServiceType.OPENSEARCH) {
      const { openSearchDomains } = resource.attributes;
      if (openSearchDomains && openSearchDomains.length > 0) {
          openSearchDomains.forEach(domain => {
              addCost(ServiceType.OPENSEARCH, domain.instanceType, `${domain.name} Nodes`, domain.instanceCount, 'hourly');
              if (domain.masterEnabled) {
                  addCost(ServiceType.OPENSEARCH, domain.masterType, `${domain.name} Masters`, domain.masterCount, 'hourly');
              }
              const storageKey = domain.storageType === EbsVolumeType.IO1 ? "os_storage_io1" : "os_storage_gp3";
              addCost(ServiceType.OPENSEARCH, storageKey, `${domain.name} Storage`, domain.instanceCount * domain.storageSizePerNode, 'usage');
              addCost(ServiceType.VPC, "data_transfer_internet_out", `${domain.name} Data Transfer`, domain.dataTransferOut, 'usage');
          });
      }
  }
  // --- API Gateway ---
  else if (resource.serviceType === ServiceType.API_GATEWAY) {
      const { apiGateways } = resource.attributes;
      if (apiGateways && apiGateways.length > 0) {
          apiGateways.forEach(api => {
              const reqKey = api.type === ApiGatewayType.REST ? "apigw_rest_requests" : "apigw_http_requests";
              addCost(ServiceType.API_GATEWAY, reqKey, `${api.name} Requests`, api.requests, 'usage');
              
              if (api.cacheEnabled && api.type === ApiGatewayType.REST) {
                  const cacheKey = `apigw_cache_${api.cacheSize.replace('.', '_').replace(' GB', '')}`;
                  addCost(ServiceType.API_GATEWAY, cacheKey, `${api.name} Cache`, 1, 'hourly');
              }
              addCost(ServiceType.VPC, "data_transfer_internet_out", `${api.name} Transfer`, api.dataTransfer, 'usage');
          });
      }
  }
  // --- CloudFront ---
  else if (resource.serviceType === ServiceType.CLOUDFRONT) {
      const { cloudFrontDistributions } = resource.attributes;
      if (cloudFrontDistributions && cloudFrontDistributions.length > 0) {
          cloudFrontDistributions.forEach(dist => {
              addCost(ServiceType.CLOUDFRONT, "cf_data_transfer_out", `${dist.name} Transfer`, dist.dataTransfer, 'usage');
              addCost(ServiceType.CLOUDFRONT, "cf_requests_http", `${dist.name} HTTP`, dist.httpRequests * 100, 'usage'); 
              addCost(ServiceType.CLOUDFRONT, "cf_requests_https", `${dist.name} HTTPS`, dist.httpsRequests * 100, 'usage');
              
              if (dist.dedicatedIp) {
                  addCost(ServiceType.CLOUDFRONT, "cf_dedicated_ip_custom_ssl", `${dist.name} Dedicated IP`, 1, 'usage');
              }
              if (dist.shieldEnabled) {
                  addCost(ServiceType.CLOUDFRONT, "cf_origin_shield_request", `${dist.name} Shield`, dist.shieldRequests * 100, 'usage');
              }
          });
      }
  }
  // --- EKS ---
  else if (resource.serviceType === ServiceType.EKS) {
      const { eksClusterHours, eksExtendedSupport, eksFargateEnabled, eksFargateTasks, eksFargateCpu, eksFargateMemory, eksNodesEnabled, eksNodeGroups } = resource.attributes;
      addCost(ServiceType.EKS, "eks_cluster_hourly", "EKS Cluster (Control Plane)", 1, 'hourly', eksClusterHours);
      if (eksExtendedSupport) addCost(ServiceType.EKS, "eks_extended_support_hourly", "Extended Support Surcharge", 1, 'hourly', eksClusterHours);
      if (eksFargateEnabled && eksFargateTasks > 0) {
          const totalVcpu = eksFargateTasks * eksFargateCpu;
          const totalMem = eksFargateTasks * eksFargateMemory;
          addCost(ServiceType.ECS, "fargate_linux_vcpu", "Fargate vCPU", totalVcpu, 'hourly', eksClusterHours);
          addCost(ServiceType.ECS, "fargate_linux_memory", "Fargate Memory", totalMem, 'hourly', eksClusterHours);
      }
      if (eksNodesEnabled) {
          if (eksNodeGroups && eksNodeGroups.length > 0) {
              eksNodeGroups.forEach((group, idx) => {
                  addCost(ServiceType.EC2, group.instanceType, `Node Group ${group.name} (${group.instanceType})`, group.count, 'hourly', eksClusterHours);
                  addCost(ServiceType.EC2, "ebs_gp3_storage", `Node Storage ${group.name} (gp3)`, group.count * group.storage, 'usage');
              });
          }
      }
  }
  // --- RDS ---
  else if (resource.serviceType === ServiceType.RDS) {
      const { rdsInstances, rdsDataTransferOut } = resource.attributes;
      if (rdsInstances && rdsInstances.length > 0) {
          rdsInstances.forEach((inst, idx) => {
              const isMultiAZ = inst.deploymentOption === RDSDeploymentOption.MULTI_AZ;
              const multiplier = isMultiAZ ? 2 : 1;
              addCost(ServiceType.RDS, inst.instanceClass, `${inst.name} (${inst.instanceClass})`, 1, 'hourly', HOURS_IN_MONTH * multiplier);
              const storageKey = `rds_${inst.storageType}_storage`;
              addCost(ServiceType.RDS, storageKey, `${inst.name} Storage`, inst.storageSize * multiplier, 'usage');
              if (inst.storageType === EbsVolumeType.IO2 && inst.storageIops > 0) {
                  addCost(ServiceType.RDS, "rds_iops", `${inst.name} IOPS`, inst.storageIops * multiplier, 'usage');
              }
              addCost(ServiceType.RDS, "rds_backup_storage", `${inst.name} Backup`, inst.backupStorage, 'usage');
          });
      }
      addCost(ServiceType.VPC, "data_transfer_internet_out", "Data Transfer Out", rdsDataTransferOut, 'usage');
  }
  // --- S3 ---
  else if (resource.serviceType === ServiceType.S3) {
      const { s3Buckets, s3InventoryObjects, s3AnalyticsEnabled } = resource.attributes;
      if (s3Buckets && s3Buckets.length > 0) {
          s3Buckets.forEach((bucket, idx) => {
              addCost(ServiceType.S3, "s3_storage_standard", `${bucket.name} Standard`, bucket.standardStorage, 'usage');
              addCost(ServiceType.S3, "s3_storage_ia", `${bucket.name} Standard-IA`, bucket.iaStorage, 'usage');
              addCost(ServiceType.S3, "s3_storage_glacier", `${bucket.name} Glacier`, bucket.glacierStorage, 'usage');
              addCost(ServiceType.S3, "s3_storage_deep_archive", `${bucket.name} Deep Archive`, bucket.deepArchiveStorage, 'usage');
              addCost(ServiceType.S3, "s3_requests_put", `${bucket.name} PUT/COPY/POST`, bucket.putRequests / 1000, 'usage');
              addCost(ServiceType.S3, "s3_requests_get", `${bucket.name} GET/SELECT`, bucket.getRequests / 1000, 'usage');
              addCost(ServiceType.S3, "s3_lifecycle", `${bucket.name} Transitions`, bucket.lifecycleTransitions / 1000, 'usage');
              addCost(ServiceType.S3, "s3_data_transfer_out", `${bucket.name} Data Transfer`, bucket.dataTransferOut, 'usage');
          });
      }
      addCost(ServiceType.S3, "s3_inventory", "S3 Inventory", s3InventoryObjects, 'usage');
      if (s3AnalyticsEnabled) {
          addCost(ServiceType.S3, "s3_analytics", "Storage Class Analysis", s3InventoryObjects, 'usage');
      }
  }
  // --- Lambda ---
  else if (resource.serviceType === ServiceType.LAMBDA) {
      const { lambdaFunctions } = resource.attributes;
      if (lambdaFunctions && lambdaFunctions.length > 0) {
          lambdaFunctions.forEach(fn => {
              addCost(ServiceType.LAMBDA, "lambda_requests", `${fn.name} Requests`, fn.requests, 'usage');
              const gbSeconds = (fn.requests * 1000000) * (fn.durationMs / 1000) * (fn.memory / 1024);
              const durationKey = fn.architecture === LambdaArchitecture.ARM64 ? "lambda_duration_arm" : "lambda_duration_x86";
              addCost(ServiceType.LAMBDA, durationKey, `${fn.name} Duration`, gbSeconds, 'usage');
              if (fn.provisionedConcurrency > 0) {
                  const provGbSeconds = fn.provisionedConcurrency * (fn.memory / 1024) * (fn.provisionedHours * 3600);
                  addCost(ServiceType.LAMBDA, "lambda_provisioned_concurrency", `${fn.name} Provisioned Duration`, provGbSeconds, 'usage');
              }
              if (fn.ephemeralStorage > 512) {
                  const storageGbSeconds = (fn.requests * 1000000) * (fn.durationMs / 1000) * ((fn.ephemeralStorage - 512) / 1024);
                  addCost(ServiceType.LAMBDA, "lambda_storage", `${fn.name} Ephemeral Storage`, storageGbSeconds, 'usage');
              }
          });
      }
  }
  // --- DynamoDB ---
  else if (resource.serviceType === ServiceType.DYNAMODB) {
      const { dynamoDBTables, ddbDataTransferOut } = resource.attributes;
      if (dynamoDBTables && dynamoDBTables.length > 0) {
          dynamoDBTables.forEach(table => {
              const storageKey = table.tableClass === DynamoDBTableClass.STANDARD_IA ? "ddb_storage_ia" : "ddb_storage_std";
              addCost(ServiceType.DYNAMODB, storageKey, `${table.name} Storage`, table.storage, 'usage');
              if (table.capacityMode === DynamoDBCapacityMode.PROVISIONED) {
                  addCost(ServiceType.DYNAMODB, "ddb_wcu_hourly", `${table.name} WCU`, table.wcu, 'hourly');
                  addCost(ServiceType.DYNAMODB, "ddb_rcu_hourly", `${table.name} RCU`, table.rcu, 'hourly');
              } else {
                  addCost(ServiceType.DYNAMODB, "ddb_wru_ondemand", `${table.name} Writes`, table.writeRequests, 'usage');
                  addCost(ServiceType.DYNAMODB, "ddb_rru_ondemand", `${table.name} Reads`, table.readRequests, 'usage');
              }
              if (table.backupEnabled) {
                  addCost(ServiceType.DYNAMODB, "ddb_backup_storage", `${table.name} Backup`, table.backupSize, 'usage');
              }
              if (table.pitrEnabled) {
                  addCost(ServiceType.DYNAMODB, "ddb_pitr", `${table.name} PITR`, table.storage, 'usage');
              }
              if (table.streamsEnabled) {
                  addCost(ServiceType.DYNAMODB, "ddb_stream_read", `${table.name} Stream Reads`, table.streamReads, 'usage');
              }
          });
      }
      addCost(ServiceType.DYNAMODB, "ddb_data_transfer_out", "Data Transfer Out", ddbDataTransferOut, 'usage');
  }
  // --- MSK ---
  else if (resource.serviceType === ServiceType.MSK) {
      const { mskClusters } = resource.attributes;
      if (mskClusters && mskClusters.length > 0) {
          mskClusters.forEach(cluster => {
              addCost(ServiceType.MSK, cluster.brokerNodeType, `${cluster.name} Brokers`, cluster.brokerNodes, 'hourly');
              addCost(ServiceType.MSK, "msk_storage", `${cluster.name} Storage`, cluster.brokerNodes * cluster.storagePerBroker, 'usage');
          });
      }
  }
  // --- SNS ---
  else if (resource.serviceType === ServiceType.SNS) {
      const { snsTopics } = resource.attributes;
      if (snsTopics && snsTopics.length > 0) {
          snsTopics.forEach(topic => {
              addCost(ServiceType.SNS, "sns_requests", `${topic.name} Requests`, topic.requests, 'usage');
              addCost(ServiceType.VPC, "data_transfer_internet_out", `${topic.name} Data Out`, topic.dataTransfer, 'usage');
          });
      }
  }
  // --- SQS ---
  else if (resource.serviceType === ServiceType.SQS) {
      const { sqsQueues } = resource.attributes;
      if (sqsQueues && sqsQueues.length > 0) {
          sqsQueues.forEach(q => {
              const reqKey = q.isFifo ? "sqs_requests_fifo" : "sqs_requests_std";
              addCost(ServiceType.SQS, reqKey, `${q.name} Requests`, q.requests, 'usage');
              addCost(ServiceType.VPC, "data_transfer_internet_out", `${q.name} Data Out`, q.dataTransfer, 'usage');
          });
      }
  }
  // --- Amazon MQ ---
  else if (resource.serviceType === ServiceType.MQ) {
      const { mqBrokers } = resource.attributes;
      if (mqBrokers && mqBrokers.length > 0) {
          mqBrokers.forEach(broker => {
              let instanceCount = 1;
              if (broker.deploymentMode === AmazonMQDeploymentMode.ACTIVE_STANDBY_MULTI_AZ) instanceCount = 2;
              if (broker.deploymentMode === AmazonMQDeploymentMode.CLUSTER_MULTI_AZ) instanceCount = broker.brokerCount;
              addCost(ServiceType.MQ, broker.instanceType, `${broker.name} Instances`, instanceCount, 'hourly');
              addCost(ServiceType.MQ, "mq_storage", `${broker.name} Storage`, broker.storage, 'usage');
          });
      }
  }
  // --- FSx ---
  else if (resource.serviceType === ServiceType.FSX) {
      const { fsxFileSystems } = resource.attributes;
      if (fsxFileSystems && fsxFileSystems.length > 0) {
          fsxFileSystems.forEach(fs => {
              if (fs.type === FSxType.WINDOWS) {
                  const storageKey = fs.deploymentType === FSxDeploymentType.MULTI_AZ ? "fsx_windows_storage_multi_az" : "fsx_windows_storage_single_az";
                  addCost(ServiceType.FSX, storageKey, `${fs.name} Storage`, fs.storageCapacity, 'usage');
                  addCost(ServiceType.FSX, "fsx_windows_throughput", `${fs.name} Throughput`, fs.throughputCapacity, 'usage');
              } else if (fs.type === FSxType.LUSTRE) {
                  addCost(ServiceType.FSX, "fsx_lustre_storage", `${fs.name} Storage`, fs.storageCapacity, 'usage');
              }
              addCost(ServiceType.FSX, "fsx_backup", `${fs.name} Backup`, fs.backupStorage, 'usage');
          });
      }
  }
  // --- WAF ---
  else if (resource.serviceType === ServiceType.WAF) {
      const { wafWebACLs } = resource.attributes;
      if (wafWebACLs && wafWebACLs.length > 0) {
          wafWebACLs.forEach(acl => {
              addCost(ServiceType.WAF, "waf_web_acl", `${acl.name} ACL`, 1, 'usage');
              addCost(ServiceType.WAF, "waf_rule", `${acl.name} Rules`, acl.ruleCount, 'usage');
              addCost(ServiceType.WAF, "waf_request_million", `${acl.name} Requests`, acl.requests, 'usage');
              if (acl.botControl) {
                  addCost(ServiceType.WAF, "waf_bot_control_subscription", `${acl.name} Bot Subscription`, 1, 'usage');
                  addCost(ServiceType.WAF, "waf_bot_control_request", `${acl.name} Bot Requests`, acl.botRequests, 'usage');
              }
              if (acl.fraudControl) {
                  addCost(ServiceType.WAF, "waf_fraud_control_subscription", `${acl.name} Fraud Subscription`, 1, 'usage');
                  addCost(ServiceType.WAF, "waf_fraud_control_request", `${acl.name} Fraud Requests`, acl.fraudRequests, 'usage');
              }
          });
      }
  }
  // --- CodeBuild ---
  else if (resource.serviceType === ServiceType.CODEBUILD) {
      const { codeBuildProjects } = resource.attributes;
      if (codeBuildProjects && codeBuildProjects.length > 0) {
          codeBuildProjects.forEach(proj => {
              const key = `build_${proj.computeType.replace(/\./g, '_')}_${proj.os === CodeBuildOs.LINUX ? 'linux' : 'windows'}`;
              addCost(ServiceType.CODEBUILD, key, `${proj.name} Build Mins`, proj.buildMinutes, 'usage');
          });
      }
  }
  // --- Step Functions ---
  else if (resource.serviceType === ServiceType.STEP_FUNCTIONS) {
      const { stepFunctionsStateMachines } = resource.attributes;
      if (stepFunctionsStateMachines && stepFunctionsStateMachines.length > 0) {
          stepFunctionsStateMachines.forEach(sm => {
              if (sm.type === StepFunctionsType.STANDARD) {
                  addCost(ServiceType.STEP_FUNCTIONS, "sfn_standard_transition", `${sm.name} Transitions`, sm.transitions / 1000, 'usage');
              } else {
                  addCost(ServiceType.STEP_FUNCTIONS, "sfn_express_request", `${sm.name} Requests`, sm.requests, 'usage');
                  const gbSeconds = sm.requests * 1000000 * (sm.durationMs / 1000) * (sm.memoryMb / 1024);
                  addCost(ServiceType.STEP_FUNCTIONS, "sfn_express_gb_second", `${sm.name} Duration`, gbSeconds, 'usage');
              }
          });
      }
  }
  // --- Route 53 ---
  else if (resource.serviceType === ServiceType.ROUTE53) {
      const { route53Zones, r53Domains, r53ResolverEndpoints, r53ResolverQueries } = resource.attributes;
      if (route53Zones && route53Zones.length > 0) {
          route53Zones.forEach(zone => {
              addCost(ServiceType.ROUTE53, "r53_hosted_zone", `${zone.name} Zone`, 1, 'usage');
              const qKey = zone.queryType === 'Standard' ? "r53_query_standard" : "r53_query_geo";
              addCost(ServiceType.ROUTE53, qKey, `${zone.name} Queries`, zone.queryCount, 'usage');
              if (zone.healthChecksAws > 0) addCost(ServiceType.ROUTE53, "r53_health_check_aws", `${zone.name} AWS Checks`, zone.healthChecksAws, 'usage');
              if (zone.healthChecksNonAws > 0) addCost(ServiceType.ROUTE53, "r53_health_check_non_aws", `${zone.name} External Checks`, zone.healthChecksNonAws, 'usage');
          });
      }
      addCost(ServiceType.ROUTE53, "r53_domain", "Domain Registrations", r53Domains, 'usage');
      if (r53ResolverEndpoints > 0) {
          addCost(ServiceType.ROUTE53, "r53_resolver_eni", "Resolver ENIs", r53ResolverEndpoints, 'hourly');
          addCost(ServiceType.ROUTE53, "r53_resolver_query", "Resolver Queries", r53ResolverQueries, 'usage');
      }
  }
  // --- ACM ---
  else if (resource.serviceType === ServiceType.ACM) {
      const { acmCertificates, acmPrivateCaCount } = resource.attributes;
      if (acmCertificates && acmCertificates.length > 0) {
          acmCertificates.forEach(cert => {
              if (cert.type === AcmCertificateType.PRIVATE) {
                  addCost(ServiceType.ACM, "acm_private_cert", `${cert.name} Cert`, 1, 'usage');
              }
          });
      }
      if (acmPrivateCaCount > 0) {
          addCost(ServiceType.ACM, "acm_private_ca", "Private CA", acmPrivateCaCount, 'usage');
      }
  }
  // --- CloudTrail ---
  else if (resource.serviceType === ServiceType.CLOUDTRAIL) {
      const { trailPaidManagementEvents, trailDataEvents, trailInsightsEnabled, trailInsightsAnalyzedEvents, trailLakeEnabled, trailLakeIngestion, trailLakeStorage, trailLakeScanned } = resource.attributes;
      addCost(ServiceType.CLOUDTRAIL, "trail_mgmt_paid", "Add'l Mgmt Events", trailPaidManagementEvents, 'usage');
      addCost(ServiceType.CLOUDTRAIL, "trail_data_events", "Data Events", trailDataEvents, 'usage');
      if (trailInsightsEnabled) {
          addCost(ServiceType.CLOUDTRAIL, "trail_insights", "Insights Events", trailInsightsAnalyzedEvents, 'usage');
      }
      if (trailLakeEnabled) {
          addCost(ServiceType.CLOUDTRAIL, "trail_lake_ingestion", "Lake Ingestion", trailLakeIngestion, 'usage');
          addCost(ServiceType.CLOUDTRAIL, "trail_lake_storage", "Lake Storage", trailLakeStorage, 'usage');
          addCost(ServiceType.CLOUDTRAIL, "trail_lake_query", "Lake Scanned", trailLakeScanned, 'usage');
      }
  }
  // --- ECR ---
  else if (resource.serviceType === ServiceType.ECR) {
      const { ecrRepositories } = resource.attributes;
      if (ecrRepositories && ecrRepositories.length > 0) {
          ecrRepositories.forEach(repo => {
              addCost(ServiceType.ECR, "ecr_storage", `${repo.name} Storage`, repo.storage, 'usage');
              addCost(ServiceType.VPC, "data_transfer_internet_out", `${repo.name} Data Out`, repo.dataTransferOut, 'usage');
          });
      }
  }
  // --- Secrets Manager ---
  else if (resource.serviceType === ServiceType.SECRETS_MANAGER) {
      const { smSecrets, smApiRequests } = resource.attributes;
      if (smSecrets && smSecrets.length > 0) {
          smSecrets.forEach(group => {
              addCost(ServiceType.SECRETS_MANAGER, "sm_secret_month", `${group.name} Secrets`, group.count, 'usage');
          });
      }
      addCost(ServiceType.SECRETS_MANAGER, "sm_api_requests", "API Requests", smApiRequests, 'usage');
  }
  // --- KMS ---
  else if (resource.serviceType === ServiceType.KMS) {
      const { kmsKeys, kmsRequests } = resource.attributes;
      if (kmsKeys && kmsKeys.length > 0) {
          addCost(ServiceType.KMS, "kms_key_monthly", "Customer Managed Keys", kmsKeys.length, 'usage');
      }
      addCost(ServiceType.KMS, "kms_requests", "Key Requests", kmsRequests, 'usage');
  }
  // --- Global Accelerator ---
  else if (resource.serviceType === ServiceType.GLOBAL_ACCELERATOR) {
      const { gaAccelerators } = resource.attributes;
      if (gaAccelerators && gaAccelerators.length > 0) {
          addCost(ServiceType.GLOBAL_ACCELERATOR, "ga_hourly", "Accelerators", gaAccelerators.length, 'hourly');
          gaAccelerators.forEach(acc => {
              addCost(ServiceType.GLOBAL_ACCELERATOR, "ga_dt_premium", `${acc.name} Premium DT`, acc.dataTransfer, 'usage');
          });
      }
  }
  // --- Backup ---
  else if (resource.serviceType === ServiceType.BACKUP) {
      const { backupVaults } = resource.attributes;
      if (backupVaults && backupVaults.length > 0) {
          backupVaults.forEach(vault => {
              addCost(ServiceType.BACKUP, "backup_storage_warm", `${vault.name} Storage`, vault.storageWarm, 'usage');
              addCost(ServiceType.BACKUP, "backup_restore", `${vault.name} Restore`, vault.restoreData, 'usage');
          });
      }
  }
  // --- Glacier ---
  else if (resource.serviceType === ServiceType.S3_GLACIER) {
      const { glacierVaults } = resource.attributes;
      if (glacierVaults && glacierVaults.length > 0) {
          glacierVaults.forEach(vault => {
              addCost(ServiceType.S3_GLACIER, "glacier_storage", `${vault.name} Storage`, vault.storage, 'usage');
              addCost(ServiceType.S3_GLACIER, "glacier_retrieval", `${vault.name} Retrieval`, vault.retrieval, 'usage');
              addCost(ServiceType.S3_GLACIER, "glacier_requests", `${vault.name} Requests`, vault.requests, 'usage');
          });
      }
  }
  // Fallback for others
  else if (resource.serviceType === ServiceType.ASG) {
      const { asgInstanceType, asgDesiredCapacity, asgDetailedMonitoring, asgPurchaseOption, asgSpotPercentage } = resource.attributes;
      const rate = getPrice(pricingData, resource.region, ServiceType.EC2, asgInstanceType);
      const hours = 730; 
      let unitPrice = rate.pricePerUnit;
      let label = `ASG Instances (${asgInstanceType})`;
      if (asgPurchaseOption === 'Spot') {
          const discountFactor = (100 - asgSpotPercentage) / 100;
          unitPrice = unitPrice * discountFactor;
          label = `ASG Instances (${asgInstanceType} - Spot ${asgSpotPercentage}%)`;
      }
      const totalCompute = asgDesiredCapacity * hours * unitPrice;
      if (asgDesiredCapacity > 0) {
          breakdown.push({ label, unitCost: unitPrice, quantity: asgDesiredCapacity * hours, unit: "Hrs", total: totalCompute });
          monthlyTotal += totalCompute;
      }
      if (asgDetailedMonitoring && asgDesiredCapacity > 0) {
          addCost(ServiceType.ASG, "cw_detailed_monitoring", "Detailed Monitoring", asgDesiredCapacity, 'flat');
      }
  }

  return {
    monthlyTotal,
    breakdown
  };
};