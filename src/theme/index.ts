import { Theme } from '@aws-amplify/ui-react';

export const awsCostEstimatorTheme: Theme = {
    name: 'aws-cost-estimator',
    tokens: {
        colors: {
            brand: {
                primary: {
                    10: '{colors.orange.10}',
                    20: '{colors.orange.20}',
                    40: '{colors.orange.40}',
                    60: '{colors.orange.60}',
                    80: '{colors.orange.80}',
                    90: '{colors.orange.90}',
                    100: '{colors.orange.100}',
                },
            },
        },
        components: {
            card: {
                backgroundColor: '{colors.white}',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            },
            heading: {
                color: '{colors.brand.primary.100}',
            },
        },
    },
};
