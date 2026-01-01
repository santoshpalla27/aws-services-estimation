import { useState } from 'react';
import {
    View,
    Card,
    Heading,
    TextField,
    SelectField,
    SwitchField,
    SliderField,
    Button,
    Flex,
    Text,
    Divider,
    Badge,
} from '@aws-amplify/ui-react';
import type { ServiceMetadata, PricingDimension, ServiceConfiguration, AWSRegion } from '../types';

interface ServiceConfigurationEngineProps {
    serviceMetadata: ServiceMetadata;
    region?: AWSRegion;
    onCalculate?: (config: ServiceConfiguration) => void;
}

export default function ServiceConfigurationEngine({
    serviceMetadata,
    region = 'us-east-1' as AWSRegion,
    onCalculate,
}: ServiceConfigurationEngineProps) {
    const [configuration, setConfiguration] = useState<Record<string, any>>(() => {
        // Initialize with default values
        const defaults: Record<string, any> = {};
        serviceMetadata.pricingDimensions.forEach((dim) => {
            if (dim.defaultValue !== undefined) {
                defaults[dim.id] = dim.defaultValue;
            }
        });
        return defaults;
    });

    const handleChange = (dimensionId: string, value: any) => {
        setConfiguration((prev) => ({
            ...prev,
            [dimensionId]: value,
        }));
    };

    const handleCalculate = () => {
        const config: ServiceConfiguration = {
            serviceCode: serviceMetadata.serviceCode,
            serviceName: serviceMetadata.serviceName,
            region,
            name: `${serviceMetadata.serviceName} Instance`,
            configuration,
        };
        onCalculate?.(config);
    };

    const renderDimension = (dimension: PricingDimension) => {
        const value = configuration[dimension.id];

        switch (dimension.type) {
            case 'select':
                return (
                    <SelectField
                        key={dimension.id}
                        label={dimension.name}
                        descriptiveText={dimension.description}
                        value={value || ''}
                        onChange={(e) => handleChange(dimension.id, e.target.value)}
                    >
                        <option value="">Select {dimension.name}</option>
                        {dimension.options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </SelectField>
                );

            case 'number':
                return (
                    <TextField
                        key={dimension.id}
                        label={dimension.name}
                        descriptiveText={`${dimension.description} (${dimension.unit})`}
                        type="number"
                        value={value || ''}
                        onChange={(e) => handleChange(dimension.id, parseFloat(e.target.value) || 0)}
                        min={dimension.min}
                        max={dimension.max}
                    />
                );

            case 'slider':
                return (
                    <View key={dimension.id} marginBottom="1.5rem">
                        <Text fontWeight="bold" marginBottom="0.5rem">
                            {dimension.name}
                        </Text>
                        <Text fontSize="small" color="neutral.80" marginBottom="0.5rem">
                            {dimension.description}
                        </Text>
                        <SliderField
                            label=""
                            value={value || dimension.defaultValue || 0}
                            onChange={(newValue) => handleChange(dimension.id, newValue)}
                            min={dimension.min || 0}
                            max={dimension.max || 100}
                            step={dimension.step || 1}
                        />
                        <Text fontSize="small" marginTop="0.25rem">
                            {value || dimension.defaultValue || 0} {dimension.unit}
                        </Text>
                    </View>
                );

            case 'boolean':
                return (
                    <SwitchField
                        key={dimension.id}
                        label={dimension.name}
                        labelPosition="end"
                        isChecked={value || false}
                        onChange={(e) => handleChange(dimension.id, e.target.checked)}
                    >
                        {dimension.description}
                    </SwitchField>
                );

            default:
                return null;
        }
    };

    return (
        <Card variation="outlined">
            <Flex direction="column" gap="1rem">
                <Flex justifyContent="space-between" alignItems="center">
                    <View>
                        <Heading level={4}>{serviceMetadata.serviceName}</Heading>
                        <Text fontSize="small" color="neutral.80">
                            {serviceMetadata.description}
                        </Text>
                    </View>
                    <Badge
                        variation={
                            serviceMetadata.complexity === 'simple'
                                ? 'success'
                                : serviceMetadata.complexity === 'moderate'
                                    ? 'info'
                                    : 'warning'
                        }
                    >
                        {serviceMetadata.complexity}
                    </Badge>
                </Flex>

                <Divider />

                <Heading level={6}>Configuration</Heading>

                {serviceMetadata.pricingDimensions.map((dimension) => renderDimension(dimension))}

                <Divider />

                <Flex justifyContent="flex-end" gap="1rem">
                    <Button
                        variation="primary"
                        onClick={handleCalculate}
                        isDisabled={!serviceMetadata.pricingDimensions.every(
                            (dim) => !dim.required || configuration[dim.id] !== undefined
                        )}
                    >
                        Calculate Cost
                    </Button>
                </Flex>
            </Flex>
        </Card>
    );
}
