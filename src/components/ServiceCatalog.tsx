import { useState, useMemo } from 'react';
import {
    View,
    Card,
    Heading,
    SearchField,
    Collection,
    Badge,
    Text,
    SelectField,
    Flex,
} from '@aws-amplify/ui-react';
import type { ServiceMetadata, ServiceCategory } from '../types';

interface ServiceCatalogProps {
    services: ServiceMetadata[];
    onServiceSelect?: (service: ServiceMetadata) => void;
}

const CATEGORY_LABELS: Record<ServiceCategory, string> = {
    compute: 'Compute',
    storage: 'Storage',
    database: 'Database',
    networking: 'Networking & Content Delivery',
    analytics: 'Analytics',
    ml: 'Machine Learning',
    security: 'Security & Identity',
    management: 'Management & Governance',
    devtools: 'Developer Tools',
    integration: 'Application Integration',
    containers: 'Containers',
    serverless: 'Serverless',
    iot: 'IoT',
    media: 'Media Services',
    migration: 'Migration & Transfer',
    quantum: 'Quantum Technologies',
    blockchain: 'Blockchain',
    gametech: 'Game Tech',
    other: 'Other',
};

export default function ServiceCatalog({ services, onServiceSelect }: ServiceCatalogProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    // Filter services based on search and category
    const filteredServices = useMemo(() => {
        let filtered = services;

        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(s => s.category === selectedCategory);
        }

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                s =>
                    s.serviceName.toLowerCase().includes(query) ||
                    s.description.toLowerCase().includes(query) ||
                    s.serviceCode.toLowerCase().includes(query)
            );
        }

        return filtered;
    }, [services, searchQuery, selectedCategory]);

    // Get unique categories
    const categories = useMemo(() => {
        const cats = new Set(services.map(s => s.category));
        return Array.from(cats).sort();
    }, [services]);

    return (
        <View>
            <Card variation="outlined">
                <Heading level={4} marginBottom="1rem">
                    Service Catalog
                </Heading>

                <SearchField
                    label="Search services"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onClear={() => setSearchQuery('')}
                    marginBottom="1rem"
                />

                <SelectField
                    label="Category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="all">All Categories ({services.length})</option>
                    {categories.map(cat => {
                        const count = services.filter(s => s.category === cat).length;
                        return (
                            <option key={cat} value={cat}>
                                {CATEGORY_LABELS[cat]} ({count})
                            </option>
                        );
                    })}
                </SelectField>

                <Text fontSize="small" color="neutral.80" marginTop="1rem" marginBottom="0.5rem">
                    {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} found
                </Text>

                <Collection
                    items={filteredServices}
                    type="list"
                    gap="0.5rem"
                >
                    {(service) => (
                        <Card
                            key={service.serviceCode}
                            variation="outlined"
                            padding="0.75rem"
                            style={{ cursor: 'pointer' }}
                            onClick={() => onServiceSelect?.(service)}
                        >
                            <Flex direction="column" gap="0.25rem">
                                <Flex justifyContent="space-between" alignItems="center">
                                    <Heading level={6}>{service.serviceName}</Heading>
                                    <Badge
                                        variation={
                                            service.complexity === 'simple'
                                                ? 'success'
                                                : service.complexity === 'moderate'
                                                    ? 'info'
                                                    : 'warning'
                                        }
                                        size="small"
                                    >
                                        {service.complexity}
                                    </Badge>
                                </Flex>
                                <Text fontSize="small" color="neutral.80">
                                    {service.description}
                                </Text>
                                <Text fontSize="xsmall" color="neutral.60">
                                    {service.serviceCode}
                                </Text>
                            </Flex>
                        </Card>
                    )}
                </Collection>
            </Card>
        </View>
    );
}
