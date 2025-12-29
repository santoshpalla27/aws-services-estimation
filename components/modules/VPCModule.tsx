import React, { useEffect } from 'react';
import { Accordion, FormSection, AWSSlider, AWSInput, AWSSelect, AWSToggle } from '../ui/AWS';
import { ResourceConfig, NatGatewayStrategy } from '../../types';

interface VPCModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

// Logic hook to handle side effects like Strategy -> Count
const useVPCLogic = (config: ResourceConfig, onUpdate: (c: ResourceConfig) => void) => {
    const updateAttribute = (key: string, value: any) => {
        const newAttrs = { ...config.attributes, [key]: value };
        
        // --- Dependency Logic ---
        
        // 1. Calculate NAT Gateways based on Strategy & AZs
        if (key === 'natGatewayStrategy' || key === 'availabilityZones') {
            const az = key === 'availabilityZones' ? value : newAttrs.availabilityZones;
            const strat = key === 'natGatewayStrategy' ? value : newAttrs.natGatewayStrategy;
            
            if (strat === NatGatewayStrategy.NONE) newAttrs.natGateways = 0;
            else if (strat === NatGatewayStrategy.SINGLE) newAttrs.natGateways = 1;
            else if (strat === NatGatewayStrategy.ONE_PER_AZ) newAttrs.natGateways = az;
        }

        // 2. Estimate Public IPs (Simplified logic)
        // Base: 1 IGW + NATs + 1 Bastion (assumed) + 1 per Public Subnet (assumed ALB/Instance)
        if (key === 'availabilityZones' || key === 'publicSubnetsPerAZ' || key === 'natGateways') {
            const az = newAttrs.availabilityZones;
            const subnets = newAttrs.publicSubnetsPerAZ;
            const nats = newAttrs.natGateways;
            // Rough heuristic: 1 per public subnet + NATs
            newAttrs.publicIps = (az * subnets) + nats;
        }

        onUpdate({ ...config, attributes: newAttrs });
    };

    return { updateAttribute, attrs: config.attributes };
};

export const VPCArchitectureConfig: React.FC<VPCModuleProps> = ({ config, onUpdate }) => {
  const { updateAttribute, attrs } = useVPCLogic(config, onUpdate);

  return (
    <div className="space-y-6">
      {/* 1. General Configuration */}
      <Accordion title="General Configuration" defaultOpen={true}>
        <div className="space-y-6">
            <FormSection 
                label="VPC Name" 
                info="Identifier for this VPC configuration"
                tooltip="A logical name to identify this resource. The VPC (Virtual Private Cloud) is the root virtual network in your AWS Region."
            >
                <AWSInput 
                    value={config.name} 
                    onChange={(e) => onUpdate({...config, name: e.target.value})} 
                    placeholder="e.g. production-vpc"
                />
            </FormSection>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormSection 
                    label="IPv4 CIDR Block" 
                    info="The IPv4 network range"
                    tooltip="VPCs are isolated, logically segmented networks defined by a CIDR IPv4 range. Key setting: IPv4/IPv6 CIDR blocks."
                >
                    <AWSInput value="10.0.0.0/16" disabled />
                </FormSection>

                <FormSection 
                    label="Availability Zones" 
                    info="Number of AZs for high availability"
                    tooltip="Subnets must reside entirely in one AZ. Deploying across multiple AZs increases fault tolerance but affects cross-AZ data transfer costs."
                >
                    <div className="flex gap-3">
                        {[1, 2, 3].map(num => (
                            <button
                                key={num}
                                onClick={() => updateAttribute('availabilityZones', num)}
                                className={`flex-1 h-10 border rounded-md text-sm font-semibold transition-all shadow-sm
                                ${attrs.availabilityZones === num 
                                    ? 'bg-aws-primary text-white border-aws-primary ring-2 ring-offset-1 ring-aws-primary' 
                                    : 'bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400'}`}
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                </FormSection>
            </div>
            
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                <AWSToggle 
                    label="Enable DNS Hostnames" 
                    checked={attrs.enableDnsHostnames}
                    onChange={(val) => updateAttribute('enableDnsHostnames', val)}
                    tooltip="Indicates whether instances with public IP addresses get corresponding public DNS hostnames."
                />
                <AWSToggle 
                    label="Enable DNS Resolution" 
                    checked={attrs.enableDnsSupport}
                    onChange={(val) => updateAttribute('enableDnsSupport', val)}
                    tooltip="Indicates whether the DNS server provided by Amazon is supported. Required for private hosted zones."
                />
             </div>
        </div>
      </Accordion>

      {/* 2. Subnets & Routing */}
      <Accordion title="Subnets & Routing">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormSection 
                label="Public Subnets per AZ" 
                info="Subnets with a route to an Internet Gateway"
                tooltip="Subnets can be 'public' (having a route to an internet gateway). Key settings: Auto-assign Public IP flag."
            >
                 <AWSSelect 
                    value={attrs.publicSubnetsPerAZ} 
                    onChange={(e) => updateAttribute('publicSubnetsPerAZ', Number(e.target.value))}
                 >
                     <option value={0}>0 Subnets</option>
                     <option value={1}>1 Subnet</option>
                     <option value={2}>2 Subnets</option>
                 </AWSSelect>
            </FormSection>
            <FormSection 
                label="Private Subnets per AZ" 
                info="Subnets with no direct internet route"
                tooltip="Subnets can be 'private' (no direct internet route). They use NAT Gateways for outbound access."
            >
                 <AWSSelect 
                    value={attrs.privateSubnetsPerAZ} 
                    onChange={(e) => updateAttribute('privateSubnetsPerAZ', Number(e.target.value))}
                 >
                     <option value={0}>0 Subnets</option>
                     <option value={1}>1 Subnet</option>
                     <option value={2}>2 Subnets</option>
                 </AWSSelect>
            </FormSection>
        </div>
      </Accordion>

      {/* 3. Internet Connectivity */}
      <Accordion title="Internet Connectivity" defaultOpen={true}>
        <div className="space-y-6">
            <FormSection 
                label="Internet Gateway (IGW)" 
                info="Bidirectional Internet connectivity for IPv4"
                tooltip="A horizontally-scaled, redundant VPC component that provides bidirectional Internet connectivity for IPv4 traffic. Attached to VPC."
            >
                <AWSToggle 
                    label="Attach Internet Gateway" 
                    checked={attrs.enableInternetGateway}
                    onChange={(val) => updateAttribute('enableInternetGateway', val)}
                    tooltip="Attach an IGW to a VPC to allow resources in public subnets to communicate with the Internet."
                />
            </FormSection>

            <FormSection 
                label="Egress-Only Internet Gateway" 
                info="IPv6-only gateway for outbound access"
                tooltip="An IPv6-only gateway for outbound Internet access from a VPC. Allows instances in IPv6 private subnets to initiate outbound traffic, preventing inbound initiation."
            >
                <AWSToggle 
                    label="Attach Egress-Only IGW" 
                    checked={attrs.enableEgressOnlyInternetGateway}
                    onChange={(val) => updateAttribute('enableEgressOnlyInternetGateway', val)}
                    tooltip="Used only for IPv6 ::/0 routing in route tables."
                />
            </FormSection>
            
            {attrs.enableInternetGateway && (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-md animate-in fade-in slide-in-from-top-2">
                    <FormSection 
                        label="NAT Gateway Configuration" 
                        info="Managed NAT for private subnets (IPv4)"
                        tooltip="A managed NAT service that allows instances in private subnets to initiate outbound IPv4 traffic to the Internet while preventing inbound connections. Charged hourly + data processing."
                    >
                        <AWSSelect 
                            value={attrs.natGatewayStrategy} 
                            onChange={(e) => updateAttribute('natGatewayStrategy', e.target.value)}
                        >
                            <option value={NatGatewayStrategy.NONE}>None</option>
                            <option value={NatGatewayStrategy.SINGLE}>Single NAT Gateway (Lowest Cost)</option>
                            <option value={NatGatewayStrategy.ONE_PER_AZ}>One per Availability Zone (High Availability)</option>
                        </AWSSelect>
                    </FormSection>
                </div>
            )}
        </div>
      </Accordion>

      {/* 4. VPN & Client Access */}
      <Accordion title="VPN & Client Access">
         <div className="space-y-6">
            <FormSection 
                label="Site-to-Site VPN Connections"
                info="Encrypted IPSec tunnels to on-premises"
                tooltip="Encrypted IPSec tunnels between your VPC and on-premises networks. A VPN connection links a VGW or TGW to a Customer Gateway. Charged per connection-hour."
            >
                <AWSInput 
                    type="number" min={0}
                    value={attrs.vpnConnections}
                    onChange={(e) => updateAttribute('vpnConnections', Number(e.target.value))}
                    unit="Connections"
                />
            </FormSection>

            <div className="pt-4 border-t border-gray-100">
                <FormSection 
                    label="AWS Client VPN" 
                    info="OpenVPN-based remote access for users"
                    tooltip="The AWS-managed server endpoint for AWS Client VPN. It terminates all client VPN sessions. You are charged for endpoint associations (hourly) and active client connections (hourly)."
                >
                    <div className="space-y-4">
                        <AWSToggle 
                            label="Enable Client VPN Endpoint" 
                            checked={attrs.clientVpnEnabled}
                            onChange={(val) => updateAttribute('clientVpnEnabled', val)}
                        />
                        
                        {attrs.clientVpnEnabled && (
                            <div className="pl-4 border-l-2 border-aws-link space-y-4">
                                <AWSInput 
                                    label="Target Network Associations"
                                    type="number" min={1}
                                    value={attrs.clientVpnAssociations}
                                    onChange={(e) => updateAttribute('clientVpnAssociations', Number(e.target.value))}
                                    unit="Subnets"
                                    tooltip="Number of subnets associated with the Client VPN endpoint."
                                />
                                <AWSInput 
                                    label="Avg. Active Client Connections"
                                    type="number" min={0}
                                    value={attrs.clientVpnActiveConnections}
                                    onChange={(e) => updateAttribute('clientVpnActiveConnections', Number(e.target.value))}
                                    unit="Connections"
                                    tooltip="The average number of concurrent client connections to the VPN endpoint."
                                />
                            </div>
                        )}
                    </div>
                </FormSection>
            </div>
         </div>
      </Accordion>

      {/* 5. Endpoints & Peering */}
      <Accordion title="Endpoints & Peering">
         <div className="space-y-6">
            <FormSection 
                label="VPC Interface Endpoints (PrivateLink)" 
                info="Private connectivity to AWS services"
                tooltip="Interface Endpoints (AWS PrivateLink) create elastic network interfaces in your subnets for private access to AWS services. Costs: Hourly rate per ENI + data processing."
            >
                <AWSInput 
                    type="number" min={0}
                    value={attrs.vpcEndpointsInterface}
                    onChange={(e) => updateAttribute('vpcEndpointsInterface', Number(e.target.value))}
                    unit="Endpoints"
                />
            </FormSection>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                <FormSection 
                    label="S3 Gateway Endpoint"
                    tooltip="Gateway Endpoints for S3 add routes using AWS-managed prefix lists directly to S3. Free of charge."
                >
                    <AWSToggle 
                        label="Enable S3 Endpoint" 
                        checked={attrs.enableS3GatewayEndpoint}
                        onChange={(val) => updateAttribute('enableS3GatewayEndpoint', val)}
                    />
                </FormSection>
                <FormSection 
                    label="DynamoDB Gateway Endpoint"
                    tooltip="Gateway Endpoints for DynamoDB add routes using AWS-managed prefix lists directly to DynamoDB. Free of charge."
                >
                    <AWSToggle 
                        label="Enable DynamoDB Endpoint" 
                        checked={attrs.enableDynamoDBGatewayEndpoint}
                        onChange={(val) => updateAttribute('enableDynamoDBGatewayEndpoint', val)}
                    />
                </FormSection>
            </div>

            <div className="pt-4 border-t border-gray-100">
                <FormSection 
                    label="VPC Peering Data Transfer" 
                    info="Direct network connection between VPCs"
                    tooltip="Data transfer over a VPC Peering connection between VPCs in the same Region. VPC Peering connections are free; you are charged for data transfer (approx. $0.01/GB)."
                >
                    <AWSToggle 
                        label="Enable VPC Peering Data Transfer" 
                        checked={attrs.enableVpcPeering}
                        onChange={(val) => updateAttribute('enableVpcPeering', val)}
                    />
                    
                    {attrs.enableVpcPeering && (
                        <div className="mt-4 pl-4 border-l-2 border-aws-link animate-in fade-in slide-in-from-top-1">
                             <AWSSlider 
                                min={0} max={5000} 
                                value={attrs.vpcPeeringDataTransfer} 
                                onChange={(val) => updateAttribute('vpcPeeringDataTransfer', val)}
                                unit="GB/mo"
                                labels={["0", "5 TB"]}
                            />
                        </div>
                    )}
                </FormSection>
            </div>
         </div>
      </Accordion>

      {/* 6. Advanced Network Services */}
      <Accordion title="Advanced Network Services">
          <div className="space-y-6">
            <FormSection 
                label="Transit Gateway Attachments"
                info="Connect VPCs and on-premises networks"
                tooltip="Transit Gateways act as a regional hub to which VPCs, VPNs, and DX gateways attach. Attachments enable connectivity across accounts and AZs. Charged hourly per attachment."
            >
                <AWSInput 
                    type="number" min={0}
                    value={attrs.transitGatewayAttachments}
                    onChange={(e) => updateAttribute('transitGatewayAttachments', Number(e.target.value))}
                    unit="Attachments"
                />
            </FormSection>
            
            {attrs.transitGatewayAttachments > 0 && (
                <div className="pl-4 border-l-2 border-aws-link animate-in fade-in slide-in-from-top-1">
                    <FormSection 
                        label="Transit Gateway Data Processing" 
                        info="Volume of traffic processed"
                        tooltip="Data processed by the Transit Gateway. You are charged for each GB of data processed."
                    >
                        <AWSSlider 
                            min={0} max={10000} 
                            value={attrs.transitGatewayDataProcessed} 
                            onChange={(val) => updateAttribute('transitGatewayDataProcessed', val)}
                            unit="GB/mo"
                            labels={["0", "10 TB"]}
                        />
                    </FormSection>
                </div>
            )}
          </div>
      </Accordion>

      {/* 7. Observability */}
      <Accordion title="Observability & Security">
         <div className="space-y-6">
             <FormSection 
                label="Traffic Mirroring"
                tooltip="Copies network traffic from an elastic network interface. Charged hourly per mirror session."
            >
                 <AWSInput 
                    type="number" min={0}
                    value={attrs.trafficMirrorSessions}
                    onChange={(e) => updateAttribute('trafficMirrorSessions', Number(e.target.value))}
                    unit="Sessions"
                 />
            </FormSection>

            <FormSection 
                label="VPC Flow Logs" 
                info="Capture information about IP traffic"
                tooltip="Logs of IP traffic going to/from network interfaces. Helps with monitoring and security analysis. Costs based on ingestion (GB)."
            >
                 <div className="mb-4">
                    <AWSToggle 
                        checked={attrs.flowLogsEnabled} 
                        onChange={(val) => updateAttribute('flowLogsEnabled', val)}
                        label="Enable Flow Logs"
                    />
                 </div>
                 {attrs.flowLogsEnabled && (
                    <div className="pl-4 border-l-2 border-gray-200">
                        <AWSSlider 
                            min={0} max={1000} 
                            value={attrs.flowLogsDataIngested} 
                            onChange={(val) => updateAttribute('flowLogsDataIngested', val)}
                            unit="GB/mo"
                            labels={["0", "1 TB"]}
                        />
                    </div>
                 )}
            </FormSection>
         </div>
      </Accordion>
    </div>
  );
};

export const VPCUsageConfig: React.FC<VPCModuleProps> = ({ config, onUpdate }) => {
  const { updateAttribute, attrs } = useVPCLogic(config, onUpdate);

  return (
    <div className="space-y-4">
        
        {attrs.natGateways > 0 && (
            <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                    <span className="w-2 h-8 bg-blue-500 rounded-full mr-3"></span>
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">NAT Gateway</h4>
                </div>
                <FormSection 
                    label="NAT Gateway Data Processed" 
                    info="Data processed through NAT Gateway per month"
                    tooltip="The volume of data transferred through your NAT Gateways. You are charged for each GB of data processed."
                >
                    <AWSSlider 
                        min={0} max={10000} 
                        value={attrs.natDataProcessed} 
                        onChange={(val) => updateAttribute('natDataProcessed', val)}
                        unit="GB/mo"
                        labels={["0", "10 TB"]}
                    />
                </FormSection>
            </div>
        )}

        <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
                <span className="w-2 h-8 bg-green-500 rounded-full mr-3"></span>
                <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Data Transfer</h4>
            </div>
            <FormSection 
                label="Data Transfer Out to Internet" 
                info="Data transferred out to internet per month"
                tooltip="The amount of data transferred from AWS to the public internet. Pricing is tiered, but this estimator uses a blended rate."
            >
                <AWSSlider 
                    min={0} max={10000} 
                    value={attrs.dataTransferOut} 
                    onChange={(val) => updateAttribute('dataTransferOut', val)}
                    unit="GB/mo"
                    labels={["0", "10 TB"]}
                />
            </FormSection>
            
            <div className="pt-4 mt-2 border-t border-gray-100">
                <FormSection 
                    label="Cross-AZ Data Transfer" 
                    info="Data transferred between availability zones"
                    tooltip="Data transferred between Availability Zones within the same region (in and out). Charged per GB."
                >
                    <AWSSlider 
                        min={0} max={5000} 
                        value={attrs.dataTransferIntraRegion} 
                        onChange={(val) => updateAttribute('dataTransferIntraRegion', val)}
                        unit="GB/mo"
                        labels={["0", "5 TB"]}
                    />
                </FormSection>
            </div>

            {attrs.enableVpcPeering && (
                <div className="pt-4 mt-2 border-t border-gray-100 animate-in fade-in slide-in-from-top-1">
                    <FormSection 
                        label="VPC Peering Data Transfer" 
                        info="Data transferred via peering connections"
                        tooltip="Data transfer between peered VPCs. Charged at standard intra-region data transfer rates."
                    >
                        <AWSSlider 
                            min={0} max={5000} 
                            value={attrs.vpcPeeringDataTransfer} 
                            onChange={(val) => updateAttribute('vpcPeeringDataTransfer', val)}
                            unit="GB/mo"
                            labels={["0", "5 TB"]}
                        />
                    </FormSection>
                </div>
            )}
        </div>
        
        {attrs.transitGatewayAttachments > 0 && (
             <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
                <h4 className="text-sm font-bold text-gray-500 uppercase mb-4">Transit Gateway</h4>
                <FormSection 
                    label="Transit Gateway Data Processed" 
                    info="Data processed through Transit Gateway"
                    tooltip="The volume of data processed by the Transit Gateway. Charged per GB."
                >
                    <AWSSlider 
                        min={0} max={5000} 
                        value={attrs.transitGatewayDataProcessed} 
                        onChange={(val) => updateAttribute('transitGatewayDataProcessed', val)}
                        unit="GB/mo"
                        labels={["0", "5 TB"]}
                    />
                </FormSection>
            </div>
        )}
    </div>
  );
};