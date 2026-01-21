import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import moment from 'moment';

export default function ExportButtons({ scans, patients, stats, dateRange }) {
    const exportToPDF = () => {
        const doc = new jsPDF();
        
        // Title
        doc.setFontSize(20);
        doc.setTextColor(30, 58, 138); // blue-900
        doc.text('Melanoma Detector - Clinical Report', 20, 20);
        
        // Date Range
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Report Period: ${moment(dateRange.start).format('MMM D, YYYY')} - ${moment(dateRange.end).format('MMM D, YYYY')}`, 20, 30);
        doc.text(`Generated: ${moment().format('MMM D, YYYY h:mm A')}`, 20, 35);
        
        // Summary Statistics
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text('Summary Statistics', 20, 50);
        
        doc.setFontSize(11);
        let yPos = 60;
        doc.text(`Total Scans: ${stats.totalScans}`, 25, yPos);
        doc.text(`Total Patients: ${stats.totalPatients}`, 25, yPos + 7);
        doc.text(`Average Confidence: ${stats.avgConfidence}%`, 25, yPos + 14);
        doc.text(`High Risk Detections: ${stats.highRiskCount}`, 25, yPos + 21);
        doc.text(`Low Risk Detections: ${stats.lowRiskCount}`, 25, yPos + 28);
        
        // Risk Distribution
        yPos += 45;
        doc.setFontSize(14);
        doc.text('Risk Distribution', 20, yPos);
        yPos += 10;
        doc.setFontSize(11);
        doc.text(`Low Risk: ${stats.riskDistribution.low} (${((stats.riskDistribution.low/stats.totalScans)*100).toFixed(1)}%)`, 25, yPos);
        doc.text(`Moderate Risk: ${stats.riskDistribution.moderate} (${((stats.riskDistribution.moderate/stats.totalScans)*100).toFixed(1)}%)`, 25, yPos + 7);
        doc.text(`High Risk: ${stats.riskDistribution.high} (${((stats.riskDistribution.high/stats.totalScans)*100).toFixed(1)}%)`, 25, yPos + 14);
        doc.text(`Critical Risk: ${stats.riskDistribution.critical} (${((stats.riskDistribution.critical/stats.totalScans)*100).toFixed(1)}%)`, 25, yPos + 21);
        
        // Footer
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text('This report is generated for medical analysis purposes only.', 20, 280);
        doc.text('Melanoma Detector © 2025', 20, 285);
        
        doc.save(`melanoma-report-${moment().format('YYYY-MM-DD')}.pdf`);
    };

    const exportToCSV = () => {
        const csvRows = [];
        
        // Headers
        csvRows.push([
            'Date',
            'Classification',
            'Risk Level',
            'Confidence Score',
            'Body Location',
            'Patient ID'
        ].join(','));
        
        // Data
        scans.forEach(scan => {
            csvRows.push([
                moment(scan.created_date).format('YYYY-MM-DD HH:mm'),
                scan.classification,
                scan.risk_level,
                scan.confidence_score,
                scan.body_location || 'N/A',
                scan.patient_id || 'N/A'
            ].join(','));
        });
        
        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `melanoma-data-${moment().format('YYYY-MM-DD')}.csv`;
        a.click();
    };

    return (
        <div className="flex gap-3">
            <Button
                onClick={exportToPDF}
                className="bg-red-600 hover:bg-red-700 rounded-xl shadow-lg"
            >
                <FileText className="h-4 w-4 mr-2" />
                Export PDF
            </Button>
            <Button
                onClick={exportToCSV}
                className="bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg"
            >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
            </Button>
        </div>
    );
}