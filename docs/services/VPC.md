# VPC (Virtual Private Cloud)

## 1. SERVICE OVERVIEW

### What It Does
Amazon VPC provides isolated virtual networks within AWS. It's the foundational networking layer that enables you to launch AWS resources in a logically isolated section of the AWS cloud.

### Top-Level Billable Unit
**VPC itself is FREE**. You are NOT charged for creating a VPC.

### What's Free vs Billable

**FREE:**
- VPC creation and existence
- Subnets
- Route tables
- Internet Gateways
- Security groups
- Network ACLs
- VPC peering connections (data transfer charges apply)

**BILLABLE:**
- NAT Gateways ($0.045/hour + $0.045/GB processed)
- VPC Endpoints - Interface type ($0.01/hour per AZ + $0.01/GB processed)
- VPC Endpoints - Gateway type (FREE for S3 and DynamoDB)
- Traffic Mirroring
- Reachability Analyzer queries

### What AWS Charges For
The VPC service itself has no direct charges. Costs come from:
1. **NAT Gateway**: Hourly charge + data processing charge
2. **Interface VPC Endpoints**: Hourly per endpoint per AZ + data processing
3. **Data Transfer**: Cross-AZ, cross-region, and internet egress

---

## 2. RESOURCE HIERARCHY

```
VPC
 ├── Subnets (REPEATABLE, MANDATORY - at least 1)
 │    ├── Public Subnets (REPEATABLE, OPTIONAL)
 │    └── Private Subnets (REPEATABLE, OPTIONAL)
 ├── Internet Gateway (SINGLE, OPTIONAL - required for public internet access)
 ├── NAT Gateways (REPEATABLE, OPTIONAL - one per AZ for HA)
 ├── Route Tables (REPEATABLE, MANDATORY - at least 1, auto-created)
 │    └── Routes (REPEATABLE, OPTIONAL)
 ├── VPC Endpoints (REPEATABLE, OPTIONAL)
 │    ├── Gateway Endpoints (S3, DynamoDB - FREE)
 │    └── Interface Endpoints (Most AWS services - BILLABLE)
 ├── Security Groups (REPEATABLE, OPTIONAL - default created)
 └── Network ACLs (REPEATABLE, OPTIONAL - default created)
```

**Key Relationships:**
- Subnets MUST belong to exactly one VPC
- NAT Gateway MUST be in a public subnet
- Internet Gateway attaches to exactly one VPC
- Route Tables can be associated with multiple subnets
- VPC Endpoints are VPC-scoped

---

## 3. UI MODEL

### Main VPC Card
```
┌─────────────────────────────────────────────────────┐
│ [🌐] VPC: production-vpc                    $XX.XX  │
│ ───────────────────────────────────────────────────  │
│ CIDR: 10.0.0.0/16                                   │
│ Region: us-east-1                                   │
│ Subnets: 6 (3 public, 3 private)                   │
│ NAT Gateways: 3                                     │
│ VPC Endpoints: 2                                    │
│                                                      │
│ [Edit] [Duplicate] [Delete]                         │
└─────────────────────────────────────────────────────┘
```

### Expandable Sections Within VPC

```
VPC Card
 ├── [Subnets Section]
 │    ├── Public Subnets List
 │    │    ├── Subnet Card (us-east-1a)
 │    │    ├── Subnet Card (us-east-1b)
 │    │    └── [+ Add Public Subnet]
 │    └── Private Subnets List
 │         ├── Subnet Card (us-east-1a)
 │         ├── Subnet Card (us-east-1b)
 │         └── [+ Add Private Subnet]
 │
 ├── [NAT Gateways Section]
 │    ├── NAT Gateway Card (us-east-1a)
 │    ├── NAT Gateway Card (us-east-1b)
 │    └── [+ Add NAT Gateway]
 │
 ├── [VPC Endpoints Section]
 │    ├── Endpoint Card (S3 - Gateway)
 │    ├── Endpoint Card (EC2 - Interface)
 │    └── [+ Add VPC Endpoint]
 │
 └── [Internet Gateway Section]
      └── [Attached] or [+ Attach Internet Gateway]
```

---

## 4. DATA SCHEMA

```typescript
interface VPC {
  id: string;
  name: string;
  cidrBlock: string; // e.g., "10.0.0.0/16"
  region: string;
  enableDnsHostnames: boolean;
  enableDnsSupport: boolean;
  instanceTenancy: 'default' | 'dedicated';
  
  // Child resources
  subnets: Subnet[];
  internetGateway: InternetGateway | null;
  natGateways: NATGateway[];
  routeTables: RouteTable[];
  vpcEndpoints: VPCEndpoint[];
  
  // Metadata
  tags: Record<string, string>;
  createdAt: string;
}

interface Subnet {
  id: string;
  vpcId: string;
  name: string;
  cidrBlock: string; // Must be within VPC CIDR
  availabilityZone: string; // e.g., "us-east-1a"
  type: 'public' | 'private' | 'isolated';
  autoAssignPublicIp: boolean;
  tags: Record<string, string>;
}

interface InternetGateway {
  id: string;
  vpcId: string;
  name: string;
  tags: Record<string, string>;
}

interface NATGateway {
  id: string;
  vpcId: string;
  subnetId: string; // MUST be public subnet
  name: string;
  connectivityType: 'public' | 'private';
  tags: Record<string, string>;
}

interface RouteTable {
  id: string;
  vpcId: string;
  name: string;
  isMain: boolean;
  routes: Route[];
  subnetAssociations: string[]; // Subnet IDs
  tags: Record<string, string>;
}

interface Route {
  destinationCidr: string;
  target: RouteTarget;
}

type RouteTarget = 
  | { type: 'internet-gateway'; gatewayId: string }
  | { type: 'nat-gateway'; natGatewayId: string }
  | { type: 'vpc-peering'; peeringId: string }
  | { type: 'local' };

interface VPCEndpoint {
  id: string;
  vpcId: string;
  name: string;
  serviceName: string; // e.g., "com.amazonaws.us-east-1.s3"
  type: 'Gateway' | 'Interface';
  
  // For Interface endpoints
  subnetIds?: string[]; // One per AZ for HA
  securityGroupIds?: string[];
  privateDnsEnabled?: boolean;
  
  // For Gateway endpoints
  routeTableIds?: string[];
  
  tags: Record<string, string>;
}
```

---

## 5. CONFIGURATION OPTIONS

### VPC Configuration

#### **Basic Settings**
- **Name**: User-defined identifier
- **CIDR Block**: IPv4 CIDR (e.g., 10.0.0.0/16)
  - Valid range: /16 to /28
  - Cannot overlap with existing VPCs if peering
- **Region**: AWS region (affects pricing)
- **Instance Tenancy**: 
  - `default`: Shared hardware (standard)
  - `dedicated`: Dedicated hardware (additional cost, not covered here)

#### **DNS Settings**
- **Enable DNS Hostnames**: true/false
- **Enable DNS Support**: true/false (should always be true)

### Subnet Configuration

#### **Basic Settings**
- **Name**: User-defined identifier
- **Availability Zone**: Dropdown of AZs in region
- **CIDR Block**: Must be subset of VPC CIDR
- **Type**: 
  - `public`: Has route to Internet Gateway
  - `private`: Has route to NAT Gateway
  - `isolated`: No internet route

#### **IP Settings**
- **Auto-assign Public IPv4**: true/false (only for public subnets)

### Internet Gateway Configuration
- **Name**: User-defined identifier
- **Attachment**: One per VPC (auto-managed)

### NAT Gateway Configuration

#### **Basic Settings**
- **Name**: User-defined identifier
- **Subnet**: Dropdown (MUST be public subnet)
- **Connectivity Type**:
  - `public`: For private subnets to reach internet
  - `private`: For private subnet to private subnet communication

#### **High Availability Pattern**
- Recommendation: One NAT Gateway per AZ
- UI should suggest: "Add NAT Gateway for each AZ for HA"

### VPC Endpoint Configuration

#### **Basic Settings**
- **Name**: User-defined identifier
- **Service**: Dropdown of AWS services
  - S3 (Gateway - FREE)
  - DynamoDB (Gateway - FREE)
  - EC2, ECS, ECR, etc. (Interface - BILLABLE)
- **Type**: Auto-selected based on service

#### **Interface Endpoint Settings**
- **Subnets**: Multi-select (one per AZ for HA)
- **Security Groups**: Multi-select
- **Private DNS**: true/false

#### **Gateway Endpoint Settings**
- **Route Tables**: Multi-select (which route tables get the endpoint route)

---

## 6. CONSTRAINTS & VALIDATION RULES

### Hard Constraints (Block Save)

```typescript
const VPC_CONSTRAINTS: HardConstraint<VPC>[] = [
  {
    name: 'at-least-one-subnet',
    validate: (vpc) => vpc.subnets.length >= 1,
    errorMessage: 'VPC must have at least one subnet'
  },
  {
    name: 'valid-cidr',
    validate: (vpc) => isValidCIDR(vpc.cidrBlock) && 
                        getCIDRSize(vpc.cidrBlock) >= 16 && 
                        getCIDRSize(vpc.cidrBlock) <= 28,
    errorMessage: 'VPC CIDR must be between /16 and /28'
  },
  {
    name: 'subnet-within-vpc-cidr',
    validate: (vpc) => vpc.subnets.every(s => 
      isSubnetOf(s.cidrBlock, vpc.cidrBlock)
    ),
    errorMessage: 'All subnet CIDRs must be within VPC CIDR range'
  },
  {
    name: 'no-overlapping-subnets',
    validate: (vpc) => {
      const cidrs = vpc.subnets.map(s => s.cidrBlock);
      return !hasOverlappingCIDRs(cidrs);
    },
    errorMessage: 'Subnet CIDRs cannot overlap'
  },
  {
    name: 'nat-in-public-subnet',
    validate: (vpc) => vpc.natGateways.every(nat => {
      const subnet = vpc.subnets.find(s => s.id === nat.subnetId);
      return subnet?.type === 'public';
    }),
    errorMessage: 'NAT Gateway must be placed in a public subnet'
  },
  {
    name: 'public-subnet-needs-igw',
    validate: (vpc) => {
      const hasPublicSubnet = vpc.subnets.some(s => s.type === 'public');
      return !hasPublicSubnet || vpc.internetGateway !== null;
    },
    errorMessage: 'Public subnets require an Internet Gateway'
  }
];
```

### Soft Constraints (Warnings)

```typescript
const VPC_WARNINGS: SoftConstraint<VPC>[] = [
  {
    name: 'multi-az-recommendation',
    validate: (vpc) => {
      const azs = new Set(vpc.subnets.map(s => s.availabilityZone));
      return azs.size >= 2;
    },
    warningMessage: 'Consider using at least 2 AZs for high availability'
  },
  {
    name: 'nat-gateway-ha',
    validate: (vpc) => {
      const publicSubnetAZs = new Set(
        vpc.subnets
          .filter(s => s.type === 'public')
          .map(s => s.availabilityZone)
      );
      const natGatewayAZs = new Set(
        vpc.natGateways.map(nat => {
          const subnet = vpc.subnets.find(s => s.id === nat.subnetId);
          return subnet?.availabilityZone;
        })
      );
      return publicSubnetAZs.size === natGatewayAZs.size;
    },
    warningMessage: 'For HA, deploy one NAT Gateway per availability zone'
  },
  {
    name: 'dns-hostnames-enabled',
    validate: (vpc) => vpc.enableDnsHostnames,
    warningMessage: 'DNS hostnames should be enabled for most use cases'
  }
];
```

---

## 7. DEPENDENCIES

### Required Upstream Services
**NONE** - VPC is a foundational service

### Optional Integrations
- **Route 53**: Private hosted zones
- **Direct Connect**: Hybrid connectivity
- **VPN**: Site-to-site connectivity

### Cost-Impacting Dependencies

**Downstream Services That Require VPC:**
- EC2 instances
- RDS databases
- EKS clusters
- ECS tasks
- Lambda (VPC-attached)
- ElastiCache
- Redshift
- All compute services

**Services That Add VPC Costs:**
- NAT Gateway (direct cost)
- Interface VPC Endpoints (direct cost)
- Cross-AZ data transfer (indirect cost)

---

## 8. COST MODEL

### VPC Cost Formula

```typescript
function calculateVPCCost(vpc: VPC, context: CostContext): Cost {
  const natGatewayCosts = vpc.natGateways.map(nat => 
    calculateNATGatewayCost(nat, context)
  );
  
  const interfaceEndpointCosts = vpc.vpcEndpoints
    .filter(ep => ep.type === 'Interface')
    .map(ep => calculateInterfaceEndpointCost(ep, context));
  
  const totalHourly = 
    sum(natGatewayCosts.map(c => c.hourly)) +
    sum(interfaceEndpointCosts.map(c => c.hourly));
  
  const totalMonthly = 
    sum(natGatewayCosts.map(c => c.monthly)) +
    sum(interfaceEndpointCosts.map(c => c.monthly));
  
  return {
    hourly: totalHourly,
    monthly: totalMonthly,
    breakdown: [
      {
        name: 'NAT Gateways',
        category: 'network',
        hourly: sum(natGatewayCosts.map(c => c.hourly)),
        monthly: sum(natGatewayCosts.map(c => c.monthly)),
        unit: 'gateway-hour',
        quantity: vpc.natGateways.length,
        unitPrice: 0.045 // us-east-1
      },
      {
        name: 'Interface VPC Endpoints',
        category: 'network',
        hourly: sum(interfaceEndpointCosts.map(c => c.hourly)),
        monthly: sum(interfaceEndpointCosts.map(c => c.monthly)),
        unit: 'endpoint-hour',
        quantity: sum(vpc.vpcEndpoints
          .filter(ep => ep.type === 'Interface')
          .map(ep => ep.subnetIds?.length || 0)
        ),
        unitPrice: 0.01 // per AZ per hour
      }
    ]
  };
}
```

### NAT Gateway Cost Formula

```typescript
function calculateNATGatewayCost(
  natGateway: NATGateway,
  context: CostContext
): Cost {
  // Pricing (us-east-1):
  // - Hourly: $0.045/hour
  // - Data Processing: $0.045/GB
  
  const hourlyRate = context.pricingData.getNATGatewayHourlyRate(context.region);
  const dataProcessingRate = context.pricingData.getNATGatewayDataRate(context.region);
  
  // For estimation, assume data processing
  // User should input expected GB/month or we provide default
  const estimatedDataGB = 100; // Default assumption
  
  const hourlyCost = hourlyRate;
  const monthlyCost = (hourlyRate * context.hoursPerMonth) + 
                      (estimatedDataGB * dataProcessingRate);
  
  return {
    hourly: hourlyCost,
    monthly: monthlyCost,
    breakdown: [
      {
        name: 'NAT Gateway Hours',
        category: 'network',
        hourly: hourlyRate,
        monthly: hourlyRate * context.hoursPerMonth,
        unit: 'hour',
        quantity: context.hoursPerMonth,
        unitPrice: hourlyRate
      },
      {
        name: 'NAT Gateway Data Processing',
        category: 'network',
        hourly: 0,
        monthly: estimatedDataGB * dataProcessingRate,
        unit: 'GB',
        quantity: estimatedDataGB,
        unitPrice: dataProcessingRate
      }
    ]
  };
}
```

### Interface VPC Endpoint Cost Formula

```typescript
function calculateInterfaceEndpointCost(
  endpoint: VPCEndpoint,
  context: CostContext
): Cost {
  // Pricing (us-east-1):
  // - Hourly per AZ: $0.01/hour
  // - Data Processing: $0.01/GB
  
  const hourlyRatePerAZ = 0.01;
  const dataProcessingRate = 0.01;
  
  const numAZs = endpoint.subnetIds?.length || 1;
  const estimatedDataGB = 50; // Default assumption
  
  const hourlyCost = hourlyRatePerAZ * numAZs;
  const monthlyCost = (hourlyCost * context.hoursPerMonth) + 
                      (estimatedDataGB * dataProcessingRate);
  
  return {
    hourly: hourlyCost,
    monthly: monthlyCost,
    breakdown: [
      {
        name: `${endpoint.serviceName} Endpoint Hours`,
        category: 'network',
        hourly: hourlyCost,
        monthly: hourlyCost * context.hoursPerMonth,
        unit: 'endpoint-hour',
        quantity: numAZs * context.hoursPerMonth,
        unitPrice: hourlyRatePerAZ
      },
      {
        name: `${endpoint.serviceName} Data Processing`,
        category: 'network',
        hourly: 0,
        monthly: estimatedDataGB * dataProcessingRate,
        unit: 'GB',
        quantity: estimatedDataGB,
        unitPrice: dataProcessingRate
      }
    ]
  };
}
```

### Total VPC Cost Aggregation

```
Total VPC Cost = 
  Σ(NAT Gateway Costs) +
  Σ(Interface VPC Endpoint Costs)

Where:
  NAT Gateway Cost = (Hourly Rate × Hours) + (Data GB × Data Rate)
  Interface Endpoint Cost = (Hourly Rate × AZs × Hours) + (Data GB × Data Rate)
```

---

## 9. UI COST PRESENTATION

### Per-Resource Cost Display

```
┌─────────────────────────────────────────┐
│ NAT Gateway (us-east-1a)   $32.85/month │
│ ─────────────────────────────────────── │
│ • Gateway Hours:     $32.85             │
│ • Data Processing:   $4.50 (100 GB)     │
│ • Total:             $37.35/month       │
└─────────────────────────────────────────┘
```

### Service-Level Cost Summary

```
┌─────────────────────────────────────────┐
│ VPC: production-vpc        $150.45/month│
│ ─────────────────────────────────────── │
│ Cost Breakdown:                         │
│ • NAT Gateways (3):       $112.05       │
│ • VPC Endpoints (2):      $38.40        │
│ • Subnets:                FREE          │
│ • Internet Gateway:       FREE          │
│                                         │
│ [View Detailed Breakdown]               │
└─────────────────────────────────────────┘
```

### Live Updates
- **Trigger**: Any change to NAT Gateway count, VPC Endpoint configuration
- **Debounce**: 300ms
- **Update**: Cost recalculates and displays immediately

---

## 10. EXTENSIBILITY NOTES

### How This Service Fits Global Architecture

```typescript
// VPC is a foundational service
// Other services reference VPC resources

interface EC2Instance {
  // ...
  vpcId: string;
  subnetId: string; // References VPC subnet
}

interface EKSCluster {
  // ...
  vpcId: string;
  subnetIds: string[]; // References VPC subnets
}
```

### How to Add New Sub-Resources

**Example: Adding VPC Flow Logs (billable)**

1. **Add to schema**:
```typescript
interface VPC {
  // ... existing fields
  flowLogs: FlowLog[];
}

interface FlowLog {
  id: string;
  vpcId: string;
  destination: 'cloudwatch' | 's3';
  logFormat: string;
  trafficType: 'ACCEPT' | 'REJECT' | 'ALL';
}
```

2. **Add to UI**:
```
VPC Card
 └── [Flow Logs Section]
      ├── Flow Log Card
      └── [+ Add Flow Log]
```

3. **Add cost calculator**:
```typescript
function calculateFlowLogCost(flowLog: FlowLog): Cost {
  // CloudWatch Logs pricing
  // $0.50 per GB ingested
}
```

4. **Update VPC cost aggregation**:
```typescript
const flowLogCosts = vpc.flowLogs.map(fl => calculateFlowLogCost(fl));
totalCost += sum(flowLogCosts);
```

### What NOT to Do

❌ **DON'T** add VPC fields to EC2 schema
```typescript
// WRONG
interface EC2Instance {
  vpcCidr: string; // This belongs to VPC
  natGatewayCount: number; // This belongs to VPC
}
```

✅ **DO** reference VPC by ID
```typescript
// CORRECT
interface EC2Instance {
  vpcId: string; // Reference only
  subnetId: string; // Reference only
}
```

❌ **DON'T** create shared defaults
```typescript
// WRONG
const DEFAULT_NETWORK_CONFIG = {
  vpcCidr: '10.0.0.0/16',
  ec2InstanceType: 't3.medium' // Mixing concerns
};
```

✅ **DO** keep defaults service-specific
```typescript
// CORRECT
const DEFAULT_VPC_CONFIG = {
  cidrBlock: '10.0.0.0/16',
  enableDnsHostnames: true,
  enableDnsSupport: true
};
```

---

