import { useState, useEffect } from 'react';
import {
    ThemeProvider,
    View,
    Heading,
    Grid,
    Loader,
    Alert,
    SelectField,
    Button,
    Flex,
    Badge,
    ButtonGroup,
} from '@aws-amplify/ui-react';
import { awsCostEstimatorTheme } from './theme';
import { serviceCatalogService } from './services/ServiceCatalogService';
import { costCalculatorService } from './services/CostCalculatorService';
import type {
    ServiceMetadata,
    ServiceConfiguration,
    CostBreakdown,
    AWSRegion,
    ArchitectureTemplate,
} from './types';
import ServiceCatalog from './components/ServiceCatalog';
import ServiceConfigurationEngine from './components/ServiceConfigurationEngine';
import CostDisplay from './components/CostDisplay';
import TotalCostDashboard from './components/TotalCostDashboard';
import ExportDialog from './components/ExportDialog';
import TemplateGallery from './components/TemplateGallery';

type TabView = 'builder' | 'total' | 'templates';

function App() {
    const [services, setServices] = useState<ServiceMetadata[]>([]);
    const [selectedService, setSelectedService] = useState<ServiceMetadata | null>(null);
    const [selectedRegion, setSelectedRegion] = useState<AWSRegion>('us-east-1' as AWSRegion);
    const [currentCost, setCurrentCost] = useState<CostBreakdown | null>(null);
    const [allCosts, setAllCosts] = useState<CostBreakdown[]>([]);
    const [activeTab, setActiveTab] = useState<TabView>('builder');
    const [loading, setLoading] = useState(true);
    const [calculating, setCalculating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadServices();
    }, []);

    const loadServices = async () => {
        try {
            setLoading(true);
            const allServices = await serviceCatalogService.getAllServices();
            setServices(allServices);
            setError(null);
        } catch (err) {
            setError('Failed to load services');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleServiceSelect = (service: ServiceMetadata) => {
        setSelectedService(service);
        setCurrentCost(null);
    };

    const handleCalculateCost = async (config: ServiceConfiguration) => {
        try {
            setCalculating(true);
            const breakdown = await costCalculatorService.calculateCost(config);
            setCurrentCost(breakdown);
        } catch (err) {
            console.error('Failed to calculate cost:', err);
            setError('Failed to calculate cost');
        } finally {
            setCalculating(false);
        }
    };

    const handleAddToEstimate = () => {
        if (currentCost) {
            setAllCosts((prev) => [...prev, currentCost]);
            setCurrentCost(null);
            setSelectedService(null);
            setActiveTab('total'); // Switch to total view
        }
    };

    const handleClearAll = () => {
        setAllCosts([]);
        setCurrentCost(null);
    };

    const handleApplyTemplate = async (template: ArchitectureTemplate) => {
        try {
            setLoading(true);
            const costs: CostBreakdown[] = [];

            for (const serviceConfig of template.services) {
                const breakdown = await costCalculatorService.calculateCost(serviceConfig);
                costs.push(breakdown);
            }

            setAllCosts(costs);
            setSelectedService(null);
            setCurrentCost(null);
            setError(null);
            setActiveTab('total'); // Switch to total view
        } catch (err) {
            console.error('Failed to apply template:', err);
            setError('Failed to apply template');
        } finally {
            setLoading(false);
        }
    };

    const totalMonthlyCost = allCosts.reduce((sum, cost) => sum + cost.monthlyCost, 0);

    return (
        <ThemeProvider theme={awsCostEstimatorTheme}>
            <View padding="2rem" backgroundColor="neutral.10" minHeight="100vh">
                <Flex justifyContent="space-between" alignItems="center" marginBottom="1rem">
                    <View>
                        <Heading level={1}>AWS Cost Estimator</Heading>
                        <Heading level={6} color="neutral.80">
                            Industry-Grade Calculator for 250+ Services
                        </Heading>
                    </View>
                    <Flex gap="1rem" alignItems="center">
                        <SelectField
                            label=""
                            value={selectedRegion}
                            onChange={(e) => setSelectedRegion(e.target.value as AWSRegion)}
                            width="250px"
                        >
                            <option value="us-east-1">🇺🇸 US East (N. Virginia)</option>
                            <option value="us-west-2">🇺🇸 US West (Oregon)</option>
                            <option value="eu-central-1">🇪🇺 EU (Frankfurt)</option>
                            <option value="ap-southeast-1">🌏 Asia Pacific (Singapore)</option>
                        </SelectField>
                        {allCosts.length > 0 && (
                            <Badge size="large" variation="success">
                                Total: ${totalMonthlyCost.toFixed(2)}/mo
                            </Badge>
                        )}
                    </Flex>
                </Flex>

                {/* Tab Navigation */}
                <ButtonGroup marginBottom="1.5rem">
                    <Button
                        variation={activeTab === 'builder' ? 'primary' : 'default'}
                        onClick={() => setActiveTab('builder')}
                    >
                        Estimate Builder
                    </Button>
                    <Button
                        variation={activeTab === 'total' ? 'primary' : 'default'}
                        onClick={() => setActiveTab('total')}
                    >
                        Total Cost {allCosts.length > 0 && `($${totalMonthlyCost.toFixed(2)})`}
                    </Button>
                    <Button
                        variation={activeTab === 'templates' ? 'primary' : 'default'}
                        onClick={() => setActiveTab('templates')}
                    >
                        Templates
                    </Button>
                </ButtonGroup>

                {loading && (
                    <View textAlign="center" padding="4rem">
                        <Loader size="large" />
                        <Heading level={4} marginTop="1rem">
                            Loading services...
                        </Heading>
                    </View>
                )}

                {error && (
                    <Alert
                        variation="error"
                        heading="Error"
                        marginBottom="2rem"
                        isDismissible
                        onDismiss={() => setError(null)}
                    >
                        {error}
                    </Alert>
                )}

                {!loading && !error && (
                    <>
                        {/* Builder Tab */}
                        {activeTab === 'builder' && (
                            <Grid
                                templateColumns={{ base: '1fr', large: '280px 1fr 350px' }}
                                gap="1.5rem"
                            >
                                <ServiceCatalog services={services} onServiceSelect={handleServiceSelect} />

                                <View>
                                    {selectedService ? (
                                        <View>
                                            <ServiceConfigurationEngine
                                                serviceMetadata={selectedService}
                                                region={selectedRegion}
                                                onCalculate={handleCalculateCost}
                                            />
                                            {currentCost && (
                                                <Button
                                                    variation="primary"
                                                    onClick={handleAddToEstimate}
                                                    marginTop="1rem"
                                                    width="100%"
                                                    size="large"
                                                >
                                                    Add to Total Estimate (${currentCost.monthlyCost.toFixed(2)}/mo)
                                                </Button>
                                            )}
                                        </View>
                                    ) : (
                                        <View textAlign="center" padding="4rem">
                                            <Heading level={3} color="neutral.60">
                                                👈 Select a service to configure
                                            </Heading>
                                            <Heading level={6} color="neutral.60" marginTop="0.5rem">
                                                Choose from the catalog or use a template
                                            </Heading>
                                        </View>
                                    )}
                                </View>

                                <View>
                                    <CostDisplay costBreakdown={currentCost} loading={calculating} />
                                </View>
                            </Grid>
                        )}

                        {/* Total Cost Tab */}
                        {activeTab === 'total' && (
                            <Grid
                                templateColumns={{ base: '1fr', large: '1fr 350px' }}
                                gap="1.5rem"
                            >
                                <TotalCostDashboard
                                    allCosts={allCosts}
                                    onClear={handleClearAll}
                                    onExport={() => { }}
                                />
                                <View>
                                    <ExportDialog allCosts={allCosts} totalMonthlyCost={totalMonthlyCost} />
                                </View>
                            </Grid>
                        )}

                        {/* Templates Tab */}
                        {activeTab === 'templates' && (
                            <View maxWidth="900px" marginInline="auto">
                                <TemplateGallery onApplyTemplate={handleApplyTemplate} />
                            </View>
                        )}
                    </>
                )}
            </View>
        </ThemeProvider>
    );
}

export default App;
