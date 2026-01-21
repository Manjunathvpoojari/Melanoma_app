import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
    Activity, 
    Scan, 
    AlertTriangle, 
    CheckCircle2, 
    TrendingUp,
    Plus
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

import StatsCard from '@/components/dashboard/StatsCard';
import ClassificationChart from '@/components/dashboard/ClassificationChart';
import RiskTrendChart from '@/components/dashboard/RiskTrendChart';
import RecentScans from '@/components/dashboard/RecentScans';
import ConfidenceBarChart from '@/components/dashboard/ConfidenceBarChart';

export default function DashboardPage() {
    const { data: scans = [], isLoading } = useQuery({
        queryKey: ['scans'],
        queryFn: () => base44.entities.SkinScan.list('-created_date', 100)
    });

    // Calculate statistics
    const totalScans = scans.length;
    const highRiskScans = scans.filter(s => s.risk_level === 'high' || s.risk_level === 'critical').length;
    const lowRiskScans = scans.filter(s => s.risk_level === 'low').length;
    const avgConfidence = scans.length > 0 
        ? Math.round(scans.reduce((acc, s) => acc + (s.confidence_score || 0), 0) / scans.length)
        : 0;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-cyan-50/20 p-4 md:p-8">
                <div className="max-w-7xl mx-auto space-y-6">
                    <Skeleton className="h-10 w-64" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Skeleton className="h-96 rounded-xl" />
                        <Skeleton className="h-96 rounded-xl" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-cyan-50/20">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
                >
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                            Clinical Dashboard
                        </h1>
                        <p className="text-slate-600 mt-1 font-medium">
                            Melanoma Detection & Analysis Records
                        </p>
                    </div>
                    <Link to={createPageUrl('Scanner')}>
                        <Button className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 rounded-xl h-12 px-6 shadow-lg shadow-blue-500/30 font-semibold">
                            <Plus className="h-5 w-5 mr-2" />
                            New Clinical Scan
                        </Button>
                    </Link>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatsCard
                        title="Total Scans"
                        value={totalScans}
                        icon={Scan}
                        gradient="bg-gradient-to-br from-blue-600 to-blue-800"
                        delay={0}
                    />
                    <StatsCard
                        title="High Risk"
                        value={highRiskScans}
                        subtitle="Require attention"
                        icon={AlertTriangle}
                        gradient="bg-gradient-to-br from-red-500 to-orange-500"
                        delay={0.1}
                    />
                    <StatsCard
                        title="Low Risk"
                        value={lowRiskScans}
                        subtitle="Healthy scans"
                        icon={CheckCircle2}
                        gradient="bg-gradient-to-br from-emerald-500 to-green-500"
                        delay={0.2}
                    />
                    <StatsCard
                        title="Avg Confidence"
                        value={`${avgConfidence}%`}
                        subtitle="AI accuracy"
                        icon={TrendingUp}
                        gradient="bg-gradient-to-br from-violet-500 to-purple-500"
                        delay={0.3}
                    />
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <ClassificationChart scans={scans} />
                    <RiskTrendChart scans={scans} />
                </div>

                {/* Second Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ConfidenceBarChart scans={scans} />
                    <RecentScans scans={scans} />
                </div>

                {/* Empty State */}
                {totalScans === 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-16 mt-8 bg-white rounded-2xl shadow-lg"
                    >
                        <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mb-6 shadow-lg">
                            <Scan className="h-10 w-10 text-blue-700" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">
                            No Clinical Records
                        </h2>
                        <p className="text-slate-600 mb-6 max-w-md mx-auto font-medium">
                            Begin melanoma screening by uploading high-resolution dermoscopic images for AI-powered analysis
                        </p>
                        <Link to={createPageUrl('Scanner')}>
                            <Button className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 rounded-xl h-12 px-8 font-semibold shadow-lg">
                                <Plus className="h-5 w-5 mr-2" />
                                Begin Clinical Scan
                            </Button>
                        </Link>
                    </motion.div>
                )}
            </div>
        </div>
    );
}