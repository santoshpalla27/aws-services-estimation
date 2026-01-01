import { View, Card, Heading, Text, Flex, Badge, Button, Divider } from '@aws-amplify/ui-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { CostBreakdown } from '../types';

interface TotalCostDashboardProps {
    allCosts: CostBreakdown[];
    onExport?: () => void;
    onClear?: () => void;
}

const COLORS = ['#FF6B35', '#F7931E', '#FDC830', '#37B24D', '#4ECDC4', '#3B5998', '#8E44AD'];

export default function TotalCostDashboard({ allCosts, onExport, onClear }: TotalCostDashboardProps) {
    if (allCosts.length === 0) {
        return (
            <Card variation="outlined">
                <Heading level={5}>Total Cost Summary</Heading>
                <Text color="neutral.80" marginTop="0.5rem">
                    Add services and calculate costs to see your total monthly estimate.
                </Text>
            </Card>
        );
    }

    const totalMonthlyCost = allCosts.reduce((sum, cost) => sum + cost.monthlyCost, 0);
    const totalAnnualCost = totalMonthlyCost * 12;

    // Prepare data for pie chart
    const pieData = allCosts.map((cost, index) => ({
        name: cost.serviceConfiguration.serviceName,
        value: cost.monthlyCost,
        color: COLORS[index % COLORS.length],
    }));

    // Prepare data for bar chart (top cost drivers)
    const barData = allCosts
        .flatMap((cost) =>
            cost.breakdown.map((item) => ({
                name: `${cost.serviceConfiguration.serviceName}: ${item.description}`,
                cost: item.totalCost,
            }))
        )
        .sort((a, b) => b.cost - a.cost)
        .slice(0, 5);

    return (
        <View>
            <Card variation="outlined" marginBottom="1.5rem">
                <Flex direction="column" gap="1rem">
                    <Flex justifyContent="space-between" alignItems="center">
                        <Heading level={4}>Total Cost Summary</Heading>
                        <Flex gap="0.5rem">
                            <Button size="small" onClick={onClear}>
                                Clear All
                            </Button>
                            <Button size="small" variation="primary" onClick={onExport}>
                                Export
                            </Button>
                        </Flex>
                    </Flex>

                    <Card variation="elevated" backgroundColor="orange.10" padding="1.5rem">
                        <Flex justifyContent="space-between">
                            <View>
                                <Text fontSize="small" color="neutral.80">
                                    Monthly Cost
                                </Text>
                                <Heading level={1} color="orange.100">
                                    ${totalMonthlyCost.toFixed(2)}
                                </Heading>
                            </View>
                            <View textAlign="right">
                                <Text fontSize="small" color="neutral.80">
                                    Annual Cost
                                </Text>
                                <Heading level={2} color="orange.80">
                                    ${totalAnnualCost.toFixed(2)}
                                </Heading>
                            </View>
                        </Flex>
                    </Card>

                    <Divider />

                    <View>
                        <Heading level={6} marginBottom="0.5rem">
                            Services ({allCosts.length})
                        </Heading>
                        {allCosts.map((cost, index) => (
                            <Flex
                                key={index}
                                justifyContent="space-between"
                                alignItems="center"
                                padding="0.5rem"
                                backgroundColor={index % 2 === 0 ? 'neutral.10' : 'transparent'}
                            >
                                <Text>{cost.serviceConfiguration.serviceName}</Text>
                                <Badge size="large" variation="info">
                                    ${cost.monthlyCost.toFixed(2)}/mo
                                </Badge>
                            </Flex>
                        ))}
                    </View>
                </Flex>
            </Card>

            <Card variation="outlined" marginBottom="1.5rem">
                <Heading level={6} marginBottom="1rem">
                    Cost Distribution
                </Heading>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={(entry) => `${entry.name}: $${entry.value.toFixed(0)}`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                    </PieChart>
                </ResponsiveContainer>
            </Card>

            <Card variation="outlined">
                <Heading level={6} marginBottom="1rem">
                    Top 5 Cost Drivers
                </Heading>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={barData} layout="horizontal">
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={150} fontSize={12} />
                        <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                        <Bar dataKey="cost" fill="#FF6B35" />
                    </BarChart>
                </ResponsiveContainer>
            </Card>
        </View>
    );
}
