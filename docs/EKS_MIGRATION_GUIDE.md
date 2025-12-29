# EKS Module V2 - Migration Guide

## Overview

The new EKSModuleV2 provides a card-based interface for managing EKS clusters with explicit node groups and Fargate profiles. This guide explains how to migrate from the legacy flat schema to the new nested schema.

---

## Key Changes

### Before (Legacy Flat Schema)
```typescript
{
  serviceType: ServiceType.EKS,
  attributes: {
    eksNodesEnabled: true,
    eksNodeCount: 3,
    eksNodeInstanceType: InstanceType.T3_MEDIUM,
    eksNodeStorageSize: 20,
    eksFargateEnabled: false,
    eksExtendedSupport: false
  }
}
```

### After (New Nested Schema)
```typescript
{
  serviceType: ServiceType.EKS,
  attributes: {
    eks: {
      id: 'cluster-123',
      name: 'My K8s Cluster',
      version: '1.28',
      region: 'us-east-1',
      nodeGroups: [{
        id: 'ng-1',
        name: 'Node Group 1',
        instanceType: InstanceType.T3_MEDIUM,
        capacityType: 'ON_DEMAND',
        minSize: 1,
        desiredSize: 3,
        maxSize: 10,
        diskSize: 20,
        diskType: EbsVolumeType.GP3,
        subnetIds: [],
        availabilityZones: [],
        labels: {},
        taints: []
      }],
      fargateProfiles: [],
      extendedSupport: false,
      tags: {},
      createdAt: '2025-12-29T...'
    }
  }
}
```

---

## Automatic Migration

The EKSModuleV2 component **automatically migrates** legacy configurations:

```typescript
function getEKSSchema(config: ResourceConfig): EKSClusterSchema {
  // If new schema exists, use it
  if (config.attributes.eks) {
    return config.attributes.eks;
  }
  
  // Auto-migrate from legacy flat schema
  return {
    id: config.id,
    name: config.name,
    version: '1.28',
    region: config.region,
    nodeGroups: config.attributes.eksNodesEnabled ? [{
      id: `ng-${Date.now()}`,
      name: 'Node Group 1',
      instanceType: config.attributes.eksNodeInstanceType,
      capacityType: 'ON_DEMAND',
      minSize: 1,
      desiredSize: config.attributes.eksNodeCount,
      maxSize: 10,
      diskSize: config.attributes.eksNodeStorageSize,
      diskType: EbsVolumeType.GP3,
      // ... other fields
    }] : [],
    fargateProfiles: config.attributes.eksFargateEnabled ? [{
      // ... migrated Fargate config
    }] : [],
    extendedSupport: config.attributes.eksExtendedSupport,
    // ... other fields
  };
}
```

**Result**: Existing projects load seamlessly without manual intervention.

---

## Benefits of New Schema

### 1. **Multiple Node Groups**
**Before**: Single node group with fixed configuration
**After**: Unlimited node groups, each with independent configuration

```typescript
nodeGroups: [
  {
    name: 'General Purpose',
    instanceType: InstanceType.T3_MEDIUM,
    desiredSize: 3,
    capacityType: 'ON_DEMAND'
  },
  {
    name: 'Compute Intensive',
    instanceType: InstanceType.C5_2XLARGE,
    desiredSize: 2,
    capacityType: 'SPOT' // 65% cheaper!
  }
]
```

### 2. **Spot Instance Support**
**Before**: Not available
**After**: Per-node-group capacity type selection

```typescript
{
  capacityType: 'SPOT', // or 'ON_DEMAND'
  // Spot instances are ~65% cheaper
}
```

### 3. **Explicit Scaling Configuration**
**Before**: Only node count
**After**: Min/Desired/Max with validation

```typescript
{
  minSize: 1,
  desiredSize: 3,
  maxSize: 10
}
```

### 4. **Multiple Fargate Profiles**
**Before**: Single Fargate configuration
**After**: Multiple profiles with namespace selectors

```typescript
fargateProfiles: [
  {
    name: 'Production Workloads',
    namespaceSelectors: ['production'],
    estimatedPods: 10,
    avgCpuPerPod: 1,
    avgMemoryPerPod: 2
  },
  {
    name: 'Staging Workloads',
    namespaceSelectors: ['staging'],
    estimatedPods: 5,
    avgCpuPerPod: 0.5,
    avgMemoryPerPod: 1
  }
]
```

---

## UI Improvements

### Card-Based Interface
Each node group and Fargate profile is now a **card** with:
- Visual hierarchy
- Per-resource cost display
- Add/Edit/Delete/Duplicate actions
- Capacity type badges (On-Demand/Spot/Serverless)

### Live Validation
- **Hard constraints** block save (e.g., "At least one compute resource required")
- **Soft constraints** show warnings (e.g., "Consider multi-AZ deployment")

### Cost Transparency
- Control plane cost: $73/month (or $511/month with extended support)
- Per-node-group costs with compute + storage breakdown
- Per-Fargate-profile costs with vCPU + memory breakdown
- Total cluster cost

---

## Backward Compatibility Guarantee

✅ **Existing projects continue to work**
- Legacy flat schema is still supported
- Auto-migration happens transparently
- No manual intervention required

✅ **Calculators support both schemas**
```typescript
function calculateEKSCost(resource: ResourceConfig): Cost {
  // Prefer new schema
  if (resource.attributes.eks) {
    return calculateFromNewSchema(resource.attributes.eks);
  }
  
  // Fall back to legacy schema
  return calculateFromLegacyAttributes(resource.attributes);
}
```

✅ **No data loss**
- All legacy fields are preserved
- New schema is additive only

---

## Migration Checklist

### For Developers

- [ ] Update `App.tsx` to use `EKSArchitectureConfigV2` instead of `EKSArchitectureConfig`
- [ ] Test with existing projects to verify auto-migration
- [ ] Update service registry to use EKS registry entry
- [ ] Remove legacy `EKSModule.tsx` after verification

### For Users

- [ ] Open existing EKS configurations
- [ ] Verify costs match previous calculations
- [ ] Explore new features (multiple node groups, Spot instances)
- [ ] Save configurations (auto-migrates to new schema)

---

## Example: Adding Multiple Node Groups

```typescript
// Start with auto-migrated single node group
nodeGroups: [{
  name: 'Node Group 1',
  instanceType: InstanceType.T3_MEDIUM,
  desiredSize: 2
}]

// Click "+ Add Node Group"
// Configure second node group
nodeGroups: [
  {
    name: 'General Purpose',
    instanceType: InstanceType.T3_MEDIUM,
    capacityType: 'ON_DEMAND',
    desiredSize: 2
  },
  {
    name: 'Spot Workers',
    instanceType: InstanceType.T3_LARGE,
    capacityType: 'SPOT', // 65% cheaper!
    desiredSize: 5
  }
]

// Result: Significant cost savings with Spot instances
```

---

## Troubleshooting

### Q: My existing EKS configuration shows different costs
**A**: The new calculator is more precise. Verify:
- Node group instance types match
- Disk sizes are correct
- Spot vs On-Demand capacity type

### Q: Can I still use the old flat schema?
**A**: Yes! The old schema is fully supported. However, you won't have access to:
- Multiple node groups
- Spot instance support
- Multiple Fargate profiles
- Per-resource cost breakdown

### Q: How do I migrate manually?
**A**: Just open your EKS configuration in EKSModuleV2. It auto-migrates on load. Save to persist the new schema.

---

## Next Steps

1. Test EKSModuleV2 with your existing projects
2. Explore new features (multiple node groups, Spot instances)
3. Provide feedback on the new UI
4. Wait for VPC module refactoring (coming next)

---

## Support

For issues or questions:
1. Check validation errors/warnings in the UI
2. Review this migration guide
3. Check the implementation plan for technical details
