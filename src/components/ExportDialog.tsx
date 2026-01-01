import { useState } from 'react';
import {
    View,
    Button,
    Heading,
    Text,
    SelectField,
    Flex,
    useTheme,
} from '@aws-amplify/ui-react';
import jsPDF from 'jspdf';
import Papa from 'papaparse';
import type { CostBreakdown } from '../types';

interface ExportDialogProps {
    allCosts: CostBreakdown[];
    totalMonthlyCost: number;
}

export default function ExportDialog({ allCosts, totalMonthlyCost }: ExportDialogProps) {
    const [exportFormat, setExportFormat] = useState<'pdf' | 'csv' | 'json'>('pdf');
    const { tokens } = useTheme();

    const exportToPDF = () => {
        const doc = new jsPDF();

        // Title
        doc.setFontSize(20);
        doc.text('AWS Cost Estimate', 20, 20);

        // Total cost
        doc.setFontSize(16);
        doc.text(`Total Monthly Cost: $${totalMonthlyCost.toFixed(2)}`, 20, 35);
        doc.text(`Annual Cost: $${(totalMonthlyCost * 12).toFixed(2)}`, 20, 45);

        // Services
        doc.setFontSize(12);
        let yPos = 60;

        allCosts.forEach((cost, index) => {
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }

            doc.setFontSize(14);
            doc.text(`${index + 1}. ${cost.serviceConfiguration.serviceName}`, 20, yPos);
            yPos += 7;

            doc.setFontSize(10);
            doc.text(`Region: ${cost.serviceConfiguration.region}`, 25, yPos);
            yPos += 5;
            doc.text(`Monthly Cost: $${cost.monthlyCost.toFixed(2)}`, 25, yPos);
            yPos += 8;

            // Breakdown
            cost.breakdown.forEach((item) => {
                if (yPos > 270) {
                    doc.addPage();
                    yPos = 20;
                }
                doc.text(`  • ${item.description}: $${item.totalCost.toFixed(2)}`, 25, yPos);
                yPos += 5;
            });

            yPos += 5;
        });

        doc.save('aws-cost-estimate.pdf');
    };

    const exportToCSV = () => {
        const rows: any[] = [];

        // Header
        rows.push(['Service', 'Region', 'Component', 'Quantity', 'Unit', 'Price Per Unit', 'Total Cost']);

        // Data
        allCosts.forEach((cost) => {
            cost.breakdown.forEach((item) => {
                rows.push([
                    cost.serviceConfiguration.serviceName,
                    cost.serviceConfiguration.region,
                    item.description,
                    item.quantity,
                    item.unit,
                    item.pricePerUnit,
                    item.totalCost,
                ]);
            });
        });

        // Total row
        rows.push(['', '', '', '', '', 'TOTAL', totalMonthlyCost]);

        const csv = Papa.unparse(rows);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'aws-cost-estimate.csv';
        a.click();
    };

    const exportToJSON = () => {
        const data = {
            timestamp: new Date().toISOString(),
            totalMonthlyCost,
            totalAnnualCost: totalMonthlyCost * 12,
            services: allCosts.map((cost) => ({
                service: cost.serviceConfiguration.serviceName,
                serviceCode: cost.serviceConfiguration.serviceCode,
                region: cost.serviceConfiguration.region,
                configuration: cost.serviceConfiguration.configuration,
                monthlyCost: cost.monthlyCost,
                breakdown: cost.breakdown,
            })),
        };

        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'aws-cost-estimate.json';
        a.click();
    };

    const handleExport = () => {
        switch (exportFormat) {
            case 'pdf':
                exportToPDF();
                break;
            case 'csv':
                exportToCSV();
                break;
            case 'json':
                exportToJSON();
                break;
        }
    };

    return (
        <View>
            <Heading level={6} marginBottom="1rem">
                Export Cost Estimate
            </Heading>

            <SelectField
                label="Format"
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value as any)}
                marginBottom="1rem"
            >
                <option value="pdf">PDF Document</option>
                <option value="csv">CSV Spreadsheet</option>
                <option value="json">JSON Data</option>
            </SelectField>

            <Text fontSize="small" color="neutral.80" marginBottom="1rem">
                {exportFormat === 'pdf' && 'Export a formatted PDF document with cost breakdown'}
                {exportFormat === 'csv' && 'Export raw data as CSV for Excel/Sheets'}
                {exportFormat === 'json' && 'Export structured data for automated processing'}
            </Text>

            <Button variation="primary" onClick={handleExport} width="100%">
                Download {exportFormat.toUpperCase()}
            </Button>
        </View>
    );
}
