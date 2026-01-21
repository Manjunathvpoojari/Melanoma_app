import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Scan, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StatsSummary({ stats }) {
    const cards = [
        {
            title: 'Total Scans',
            value: stats.totalScans,
            icon: Scan,
            gradient: 'from-blue-600 to-blue-800',
            delay: 0
        },
        {
            title: 'Total Patients',
            value: stats.totalPatients,
            icon: Users,
            gradient: 'from-purple-600 to-purple-800',
            delay: 0.1
        },
        {
            title: 'High Risk Detections',
            value: stats.highRiskCount,
            icon: AlertTriangle,
            gradient: 'from-red-600 to-red-800',
            delay: 0.2
        },
        {
            title: 'Average Confidence',
            value: `${stats.avgConfidence}%`,
            icon: TrendingUp,
            gradient: 'from-emerald-600 to-emerald-800',
            delay: 0.3
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {cards.map((card, index) => {
                const Icon = card.icon;
                return (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: card.delay }}
                    >
                        <Card className="border-2 border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
                            <CardContent className="p-0">
                                <div className={`bg-gradient-to-br ${card.gradient} p-4 text-white`}>
                                    <Icon className="h-8 w-8 mb-2 opacity-80" />
                                    <div className="text-3xl font-bold mb-1">{card.value}</div>
                                    <div className="text-sm opacity-90">{card.title}</div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                );
            })}
        </div>
    );
}