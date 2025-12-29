import { CostEstimation, Region, ResourceConfig, ServiceType, LoadBalancerType, Tenancy, LambdaArchitecture, RDSDeploymentOption, EbsVolumeType, ApiGatewayType, ApiGatewayCacheSize, DynamoDBCapacityMode, DynamoDBTableClass, AcmCertificateType, ECSLaunchType, FargatePlatform, EFSThroughputMode, ElastiCacheEngine, AmazonMQDeploymentMode, ShieldProtectionType, KinesisStreamMode, CodeBuildOs, CodeBuildComputeType, FSxType, FSxDeploymentType, StepFunctionsType } from "../types";
import { getPrice } from "../services/pricingRepository";

const HOURS_IN_MONTH = 730;

export const calculateResourceCost = (resource: ResourceConfig): CostEstimation => {
  const breakdown = [];
  let monthlyTotal = 0;

  const addCost = (service: ServiceType, key: string, label: string, qty: number, type: 'hourly' | 'usage' | 'flat', multiplier: number = 1) => {
      if (qty <= 0) return;
      const rate = getPrice(resource.region, service, key);
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

  if (resource.serviceType === ServiceType.VPC) {
    // ... existing VPC logic ...
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
  else if (resource.serviceType === ServiceType.EC2) {
    // ... existing EC2 logic ...
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
        snapshotDataChange,
        elasticIps,
        loadBalancerType,
        loadBalancerCount,
        loadBalancerDataProcessed,
        utilizationHours,
        enableSpotInstances,
        spotDiscountPercentage,
        dataTransferOut
    } = resource.attributes;

    let computeRateKey = instanceType;
    let computeCost = 0;
    const rate = getPrice(resource.region, ServiceType.EC2, instanceType);
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
    if (dataVolumeCount > 0) {
        const dataVolKey = `ebs_${dataVolumeType}_storage`;
        addCost(ServiceType.EC2, dataVolKey, `EBS Data Volume (${dataVolumeType})`, instanceCount * dataVolumeCount * dataVolumeSize, 'usage');
    }
    addCost(ServiceType.EC2, "ebs_snapshot_storage", "EBS Snapshots", snapshotDataChange, 'usage');
    if (loadBalancerType !== LoadBalancerType.NONE && loadBalancerCount > 0) {
        const lbKey = loadBalancerType === LoadBalancerType.ALB ? "alb_hourly" : "nlb_hourly";
        addCost(ServiceType.EC2, lbKey, `${loadBalancerType} (Hourly)`, loadBalancerCount, 'hourly');
        addCost(ServiceType.EC2, "lb_lcu_data", "Load Balancer Processing (LCU/Data)", loadBalancerDataProcessed, 'usage');
    }
    addCost(ServiceType.EC2, "eip_idle_hourly", "Elastic IP (Idle/Remapped)", elasticIps, 'hourly');
    addCost(ServiceType.VPC, "data_transfer_internet_out", "Data Transfer (Internet Out)", dataTransferOut, 'usage');
  }
  else if (resource.serviceType === ServiceType.ASG) {
      const { asgInstanceType, asgDesiredCapacity, asgDetailedMonitoring, asgPurchaseOption, asgSpotPercentage } = resource.attributes;
      
      // Calculate Compute Costs using EC2 Pricing
      const rate = getPrice(resource.region, ServiceType.EC2, asgInstanceType);
      const hours = 730; // Assuming 24/7 for desired capacity
      
      let unitPrice = rate.pricePerUnit;
      let label = `ASG Instances (${asgInstanceType})`;
      
      if (asgPurchaseOption === 'Spot') {
          const discountFactor = (100 - asgSpotPercentage) / 100;
          unitPrice = unitPrice * discountFactor;
          label = `ASG Instances (${asgInstanceType} - Spot ${asgSpotPercentage}%)`;
      }

      const totalCompute = asgDesiredCapacity * hours * unitPrice;
      
      if (asgDesiredCapacity > 0) {
          breakdown.push({
              label,
              unitCost: unitPrice,
              quantity: asgDesiredCapacity * hours,
              unit: "Hrs",
              total: totalCompute
          });
          monthlyTotal += totalCompute;
      }

      // Detailed Monitoring
      if (asgDetailedMonitoring && asgDesiredCapacity > 0) {
          addCost(ServiceType.ASG, "cw_detailed_monitoring", "Detailed Monitoring", asgDesiredCapacity, 'flat');
      }
  }
  else if (resource.serviceType === ServiceType.ELB) {
      const { elbType, elbCount, elbProcessedBytes, elbNewConnections, elbActiveConnections, elbRuleEvaluations } = resource.attributes;
      
      const hourlyKey = elbType === LoadBalancerType.NLB ? "nlb_hourly" : elbType === LoadBalancerType.GWLB ? "gwlb_hourly" : "alb_hourly";
      const lcuKey = elbType === LoadBalancerType.NLB ? "nlb_lcu_hour" : elbType === LoadBalancerType.GWLB ? "gwlb_lcu_hour" : "alb_lcu_hour";
      
      // 1. Hourly Charge
      addCost(ServiceType.ELB, hourlyKey, `${elbType} (Hourly)`, elbCount, 'hourly');

      // 2. LCU Calculation (Simplified Max Heuristic)
      if (elbCount > 0) {
          // New Connections per second -> New Connections per hour
          const newConnLCU = elbNewConnections; // ALB: 25 new/sec = 1 LCU (Simplified: user inputs raw, we assume typical ratios)
          
          let estimatedLCUs = 0;
          
          if (elbType === LoadBalancerType.ALB) {
              const lcuNew = elbNewConnections / 25;
              const lcuActive = elbActiveConnections / 3000;
              const lcuBandwidth = elbProcessedBytes / 1; // 1 GB/hr
              const lcuRules = elbRuleEvaluations / 1000;
              
              // LCU is the MAX of these dimensions
              estimatedLCUs = Math.max(lcuNew, lcuActive, lcuBandwidth, lcuRules);
          } else if (elbType === LoadBalancerType.NLB) {
              // NLB: 800 new/sec = 1 NLCU
              // NLB: 100k active = 1 NLCU
              // NLB: 1 GB/hr = 1 NLCU
              const lcuNew = elbNewConnections / 800;
              const lcuActive = elbActiveConnections / 100000;
              const lcuBandwidth = elbProcessedBytes / 1; 
              
              estimatedLCUs = Math.max(lcuNew, lcuActive, lcuBandwidth);
          } else {
              // GWLB: 600 new/sec = 1 GLBCU
              // GWLB: 6000 active = 1 GLBCU
              // GWLB: 1 GB/hr = 1 GLBCU
              const lcuNew = elbNewConnections / 600;
              const lcuActive = elbActiveConnections / 6000;
              const lcuBandwidth = elbProcessedBytes / 1;
              
              estimatedLCUs = Math.max(lcuNew, lcuActive, lcuBandwidth);
          }

          // Total LCU-hours
          const totalLcuHours = estimatedLCUs * HOURS_IN_MONTH * elbCount;
          
          if (totalLcuHours > 0) {
             breakdown.push({
                label: "Load Balancer Capacity Units (LCU)",
                unitCost: getPrice(resource.region, ServiceType.ELB, lcuKey).pricePerUnit,
                quantity: parseFloat(totalLcuHours.toFixed(1)),
                unit: "LCU-Hrs",
                total: totalLcuHours * getPrice(resource.region, ServiceType.ELB, lcuKey).pricePerUnit
             });
             monthlyTotal += totalLcuHours * getPrice(resource.region, ServiceType.ELB, lcuKey).pricePerUnit;
          }
      }
  }
  else if (resource.serviceType === ServiceType.S3) {
      // ... existing S3 logic ...
      const { s3StandardStorage, s3InfrequentAccessStorage, s3GlacierStorage, s3DeepArchiveStorage, s3PutRequests, s3GetRequests, s3LifecycleTransitions, s3DataTransferOut, s3DataTransferAcceleration, s3ReplicationData, s3InventoryObjects, s3AnalyticsEnabled } = resource.attributes;
      addCost(ServiceType.S3, "s3_storage_standard", "S3 Standard Storage", s3StandardStorage, 'usage');
      addCost(ServiceType.S3, "s3_storage_ia", "S3 Standard-IA Storage", s3InfrequentAccessStorage, 'usage');
      addCost(ServiceType.S3, "s3_storage_glacier", "S3 Glacier Flexible Storage", s3GlacierStorage, 'usage');
      addCost(ServiceType.S3, "s3_storage_deep_archive", "S3 Glacier Deep Archive", s3DeepArchiveStorage, 'usage');
      addCost(ServiceType.S3, "s3_requests_put", "PUT/COPY/POST/LIST Requests", s3PutRequests / 1000, 'usage');
      addCost(ServiceType.S3, "s3_requests_get", "GET/SELECT Requests", s3GetRequests / 1000, 'usage');
      addCost(ServiceType.S3, "s3_lifecycle", "Lifecycle Transition Requests", s3LifecycleTransitions / 1000, 'usage');
      addCost(ServiceType.S3, "s3_data_transfer_out", "Data Transfer Out (Internet)", s3DataTransferOut, 'usage');
      addCost(ServiceType.S3, "s3_transfer_acceleration", "Transfer Acceleration", s3DataTransferAcceleration, 'usage');
      addCost(ServiceType.S3, "s3_replication_crr", "Cross-Region Replication (Data)", s3ReplicationData, 'usage');
      addCost(ServiceType.S3, "s3_inventory", "S3 Inventory", s3InventoryObjects, 'usage');
      if (s3AnalyticsEnabled) {
          addCost(ServiceType.S3, "s3_analytics", "Storage Class Analysis", s3InventoryObjects, 'usage');
      }
  }
  // ... other existing services ...
  else if (resource.serviceType === ServiceType.BACKUP) {
      const { backupStorageSize, backupRestoreData } = resource.attributes;
      addCost(ServiceType.BACKUP, "backup_storage_warm", "Backup Storage (Warm)", backupStorageSize, 'usage');
      addCost(ServiceType.BACKUP, "backup_restore", "Restore Data", backupRestoreData, 'usage');
  }
  else if (resource.serviceType === ServiceType.FSX) {
      const { fsxType, fsxStorageCapacity, fsxThroughputCapacity, fsxBackupStorage, fsxDeploymentType } = resource.attributes;
      
      if (fsxType === FSxType.WINDOWS) {
          const storageKey = fsxDeploymentType === FSxDeploymentType.MULTI_AZ ? "fsx_windows_storage_multi_az" : "fsx_windows_storage_single_az";
          addCost(ServiceType.FSX, storageKey, `Storage (${fsxDeploymentType})`, fsxStorageCapacity, 'usage');
          addCost(ServiceType.FSX, "fsx_windows_throughput", "Throughput Capacity", fsxThroughputCapacity, 'usage'); // Actually per MBps-mo
      } else if (fsxType === FSxType.LUSTRE) {
          addCost(ServiceType.FSX, "fsx_lustre_storage", "Lustre Storage", fsxStorageCapacity, 'usage');
      }
      
      if (fsxBackupStorage > 0) {
          addCost(ServiceType.FSX, "fsx_backup", "Backup Storage", fsxBackupStorage, 'usage');
      }
  }
  else if (resource.serviceType === ServiceType.S3_GLACIER) {
      const { glacierStorage, glacierRequests, glacierRetrieval } = resource.attributes;
      addCost(ServiceType.S3_GLACIER, "glacier_storage", "Vault Storage", glacierStorage, 'usage');
      addCost(ServiceType.S3_GLACIER, "glacier_requests", "Upload Requests", glacierRequests, 'usage');
      addCost(ServiceType.S3_GLACIER, "glacier_retrieval", "Data Retrieval", glacierRetrieval, 'usage');
  }
  else if (resource.serviceType === ServiceType.STEP_FUNCTIONS) {
      const { sfnType, sfnTransitions, sfnExpressRequests, sfnExpressDurationMs, sfnExpressMemory } = resource.attributes;
      if (sfnType === StepFunctionsType.STANDARD) {
          addCost(ServiceType.STEP_FUNCTIONS, "sfn_standard_transition", "State Transitions", sfnTransitions, 'usage');
      } else {
          addCost(ServiceType.STEP_FUNCTIONS, "sfn_express_request", "Express Workflow Requests", sfnExpressRequests, 'usage');
          const gbSeconds = sfnExpressRequests * 1000000 * (sfnExpressDurationMs / 1000) * (sfnExpressMemory / 1024);
          addCost(ServiceType.STEP_FUNCTIONS, "sfn_express_gb_second", "Express Workflow Duration", gbSeconds, 'usage');
      }
  }
  else if (resource.serviceType === ServiceType.XRAY) {
      const { xrayTracesStored, xrayTracesRetrieved, xrayDataScanned } = resource.attributes;
      addCost(ServiceType.XRAY, "xray_trace_recorded", "Traces Recorded", xrayTracesStored, 'usage');
      addCost(ServiceType.XRAY, "xray_trace_retrieved", "Traces Retrieved", xrayTracesRetrieved, 'usage');
      addCost(ServiceType.XRAY, "xray_data_scanned", "Insights/Encryption Scan", xrayDataScanned, 'usage');
  }
  else if (resource.serviceType === ServiceType.PINPOINT) {
      const { pinpointMTA, pinpointEvents } = resource.attributes;
      const billableMTA = Math.max(0, pinpointMTA - 5000);
      addCost(ServiceType.PINPOINT, "pinpoint_mta", "Monthly Targeted Audience (>5k Free)", billableMTA, 'flat');
      addCost(ServiceType.PINPOINT, "pinpoint_events", "Events Collected", pinpointEvents, 'usage');
  }

  return {
    monthlyTotal,
    breakdown
  };
};