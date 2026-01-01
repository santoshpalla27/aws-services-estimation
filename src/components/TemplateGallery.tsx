import { View, Card, Heading, Text, Button, Flex, Badge, Collection, Divider } from '@aws-amplify/ui-react';
import { architectureTemplates } from '../data/architectureTemplates';
import type { ArchitectureTemplate } from '../types';

interface TemplateGalleryProps {
    onApplyTemplate?: (template: ArchitectureTemplate) => void;
}

const DIFFICULTY_COLORS = {
    beginner: 'success',
    intermediate: 'info',
    advanced: 'warning',
} as const;

export default function TemplateGallery({ onApplyTemplate }: TemplateGalleryProps) {
    return (
        <Card variation="outlined">
            <Heading level={5} marginBottom="0.5rem">
                Architecture Templates
            </Heading>
            <Text fontSize="small" color="neutral.80" marginBottom="1.5rem">
                Pre-configured templates for common AWS architectures. Click to apply.
            </Text>

            <Collection items={architectureTemplates} type="list" gap="1rem">
                {(template) => (
                    <Card key={template.id} variation="outlined" padding="1rem">
                        <Flex direction="column" gap="0.75rem">
                            <Flex justifyContent="space-between" alignItems="flex-start">
                                <View>
                                    <Heading level={6}>{template.name}</Heading>
                                    <Text fontSize="small" color="neutral.80">
                                        {template.description}
                                    </Text>
                                </View>
                                <Badge variation={DIFFICULTY_COLORS[template.difficulty]} size="small">
                                    {template.difficulty}
                                </Badge>
                            </Flex>

                            <Flex gap="0.5rem" wrap="wrap">
                                {template.tags.map((tag) => (
                                    <Badge key={tag} size="small" variation="info">
                                        {tag}
                                    </Badge>
                                ))}
                            </Flex>

                            <Divider />

                            <Flex justifyContent="space-between" alignItems="center">
                                <View>
                                    <Text fontSize="small" fontWeight="bold">
                                        Estimated Cost
                                    </Text>
                                    <Text fontSize="small" color="orange.100">
                                        ${template.estimatedCost.min} - ${template.estimatedCost.max}/mo
                                    </Text>
                                </View>
                                <View>
                                    <Text fontSize="small" color="neutral.80">
                                        {template.services.length} services
                                    </Text>
                                </View>
                            </Flex>

                            <Button size="small" variation="primary" onClick={() => onApplyTemplate?.(template)}>
                                Apply Template
                            </Button>
                        </Flex>
                    </Card>
                )}
            </Collection>
        </Card>
    );
}
