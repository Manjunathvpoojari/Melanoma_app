import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
    FileText, 
    Download,
    BarChart3,
    TrendingUp,
    Users,
    Activity
} from 'lucide-react';
import { motion } from 'framer-motion';
import moment from 'moment';

import ReportFilters from '@/components/reports/ReportFilters';
import StatsSummary from '@/components/reports/StatsSummary';
import ExportButtons from '@/components/reports/ExportButtons';
import DemographicsChart from '@/components/reports/DemographicsChart';
import ClassificationBreakdown from '@/components/reports/ClassificationBreakdown';

export default function ReportsPage() {
    const [dateRange, setDateRange] = useState({
        start: moment().subtract(30, 'days').format('YYYY-MM-DD'),
        end: moment().format('YYYY-MM-DD')
    });
    const [riskFilter, setRiskFilter] = useState('all');
    const [classificationFilter, setClassificationFilter] = useState('all');

    const { data: scans = [], isLoading: scansLoading } = useQuery({
        queryKey: ['scans-reports'],
        queryFn: () => base44.entities.SkinScan.list('-created_date', 500)
    });

    const { data: patients = [], isLoading: patientsLoading } = useQuery({
        queryKey: ['patients-reports'],
        queryFn: () => base44.entities.Patient.list('-created_date', 500)
    });

    const isLoading = scansLoading || patientsLoading;

    // Filter data based on criteria
    const filteredScans = scans.filter(scan => {
        const scanDate = moment(scan.created_date);
        const inDateRange = scanDate.isBetween(dateRange.start, dateRange.end, 'day', '[]');
        const matchesRisk = riskFilter === 'all' || scan.risk_level === riskFilter;
        const matchesClass = classificationFilter === 'all' || scan.classification === classificationFilter;
        
        return inDateRange && matchesRisk && matchesClass;
    });

    // Calculate statistics
    const stats = {
        totalScans: filteredScans.length,
        totalPatients: patients.length,
        avgConfidence: filteredScans.length > 0 
            ? Math.round(filteredScans.reduce((acc, s) => acc + (s.confidence_score || 0), 0) / filteredScans.length)
            : 0,
        highRiskCount: filteredScans.filter(s => s.risk_level === 'high' || s.risk_level === 'critical').length,
        lowRiskCount: filteredScans.filter(s => s.risk_level === 'low').length,
        moderateRiskCount: filteredScans.filter(s => s.risk_level === 'moderate').length,
        criticalRiskCount: filteredScans.filter(s => s.risk_level === 'critical').length,
        riskDistribution: {
            low: filteredScans.filter(s => s.risk_level === 'low').length,
            moderate: filteredScans.filter(s => s.risk_level === 'moderate').length,
            high: filteredScans.filter(s => s.risk_level === 'high').length,
            critical: filteredScans.filter(s => s.risk_level === 'critical').length
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-4 md:p-8">
                <div className="max-w-7xl mx-auto space-y-6">
                    <Skeleton className="h-16 w-full" />
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[1,2,3,4].map(i => <Skeleton key={i} className="h-32" />)}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
                >
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                            Clinical Reports
                        </h1>
                        <p className="text-slate-600 mt-1 font-medium">
                            Statistical analysis and data insights
                        </p>
                    </div>
                    <ExportButtons 
                        scans={filteredScans} 
                        patients={patients}
                        stats={stats}
                        dateRange={dateRange}
                    />
                </motion.div>

                {/* Filters */}
                <ReportFilters
                    dateRange={dateRange}
                    onDateRangeChange={setDateRange}
                    riskFilter={riskFilter}
                    onRiskFilterChange={setRiskFilter}
                    classificationFilter={classificationFilter}
                    onClassificationFilterChange={setClassificationFilter}
                />

                {/* Stats Summary */}
                <StatsSummary stats={stats} />

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    <ClassificationBreakdown scans={filteredScans} />
                    <DemographicsChart patients={patients} scans={filteredScans} />
                </div>

                {/* Additional Analytics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <Card className="border-2 border-slate-200">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Detection Rate</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-blue-600">
                                {stats.totalScans > 0 ? 
                                    Math.round((stats.highRiskCount / stats.totalScans) * 100) : 0}%
                            </div>
                            <p className="text-sm text-slate-600 mt-1">High-risk detections</p>
                        </CardContent>
                    </Card>

                    <Card className="border-2 border-slate-200">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Average Scans per Patient</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-emerald-600">
                                {stats.totalPatients > 0 ? 
                                    (stats.totalScans / stats.totalPatients).toFixed(1) : 0}
                            </div>
                            <p className="text-sm text-slate-600 mt-1">Screening frequency</p>
                        </CardContent>
                    </Card>

                    <Card className="border-2 border-slate-200">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Data Quality</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-purple-600">
                                {stats.avgConfidence}%
                            </div>
                            <p className="text-sm text-slate-600 mt-1">Average AI confidence</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}