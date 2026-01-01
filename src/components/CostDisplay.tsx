import {
    View,
    Card,
    Heading,
    Text,
    Divider,
    Flex,
    Badge,
    Collection,
} from '@aws-amplify/ui-react';
import type { CostBreakdown } from '../types';

interface CostDisplayProps {
    costBreakdown: CostBreakdown | null;
    loading?: boolean;
}

export default function CostDisplay({ costBreakdown, loading }: CostDisplayProps) {
    if (loading) {
        return (
            <Card variation="outlined">
                <Text>Calculating cost...</Text>
            </Card>
        );
    }

    if (!costBreakdown) {
        return (
            <Card variation="outlined">
                <Heading level={5}>Cost Estimate</Heading>
                <Text color="neutral.80" marginTop="0.5rem">
                    Configure a service and click "Calculate Cost" to see the monthly estimate.
                </Text>
            </Card>
        );
    }

    return (
        <Card variation="outlined">
            <Flex direction="column" gap="1rem">
                <Heading level={5}>Cost Estimate</Heading>

                <Card variation="elevated" backgroundColor="orange.10" padding="1.5rem">
                    <Text fontSize="small" color="neutral.80">
                        Estimated Monthly Cost
                    </Text>
                    <Heading level={2} color="orange.100">
                        ${costBreakdown.monthlyCost.toFixed(2)}
                    </Heading>
                    <Text fontSize="small" color="neutral.80">
                        USD / month
                    </Text>
                </Card>

                <Divider />

                <View>
                    <Heading level={6} marginBottom="0.5rem">
                        Cost Breakdown
                    </Heading>
                    <Collection
                        items={costBreakdown.breakdown}
                        type="list"
                        gap="0.75rem"
                    >
                        {(item) => (
                            <Card key={item.description} variation="outlined" padding="0.75rem">
                                <Flex justifyContent="space-between" alignItems="center">
                                    <View>
                                        <Text fontWeight="bold">{item.description}</Text>
                                        <Text fontSize="small" color="neutral.80">
                                            {item.quantity.toLocaleString()} {item.unit} × $
                                            {item.pricePerUnit.toFixed(4)}
                                        </Text>
                                    </View>
                                    <Badge size="large" variation="info">
                                        ${item.totalCost.toFixed(2)}
                                    </Badge>
                                </Flex>
                            </Card>
                        )}
                    </Collection>
                </View>

                <Divider />

                <View>
                    <Heading level={6} marginBottom="0.5rem">
                        Configuration
                    </Heading>
                    <Text fontSize="small" color="neutral.80">
                        <strong>Service:</strong> {costBreakdown.serviceConfiguration.serviceName}
                    </Text>
                    <Text fontSize="small" color="neutral.80">
                        <strong>Region:</strong> {costBreakdown.serviceConfiguration.region}
                    </Text>
                </View>
            </Flex>
        </Card>
    );
}
