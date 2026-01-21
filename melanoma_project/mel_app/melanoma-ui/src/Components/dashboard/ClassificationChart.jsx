import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

const COLORS = {
    melanoma: '#ef4444',
    nevus: '#22c55e',
    benign_keratosis: '#3b82f6',
    basal_cell_carcinoma: '#f97316',
    actinic_keratosis: '#eab308',
    dermatofibroma: '#8b5cf6',
    vascular_lesion: '#ec4899',
    squamous_cell_carcinoma: '#dc2626',
    unknown: '#94a3b8'
};

const LABELS = {
    melanoma: 'Melanoma',
    nevus: 'Nevus',
    benign_keratosis: 'Benign Keratosis',
    basal_cell_carcinoma: 'Basal Cell',
    actinic_keratosis: 'Actinic Keratosis',
    dermatofibroma: 'Dermatofibroma',
    vascular_lesion: 'Vascular Lesion',
    squamous_cell_carcinoma: 'Squamous Cell',
    unknown: 'Unknown'
};

export default function ClassificationChart({ scans }) {
    const classificationCounts = scans.reduce((acc, scan) => {
        const key = scan.classification || 'unknown';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});

    const data = Object.entries(classificationCounts).map(([name, value]) => ({
        name: LABELS[name] || name,
        value,
        color: COLORS[name] || '#94a3b8'
    }));

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-200">
                    <p className="font-semibold text-slate-800">{payload[0].name}</p>
                    <p className="text-sm text-slate-600">{payload[0].value} scans</p>
                </div>
            );
        }
        return null;
    };

    if (data.length === 0) {
        return (
            <Card className="h-full">
                <CardHeader>
                    <CardTitle className="text-lg">Classification Distribution</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-64 text-slate-500">
                    No scan data available
                </CardContent>
            </Card>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            <Card className="h-full">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Classification Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={2}
                                    dataKey="value"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend 
                                    layout="horizontal" 
                                    verticalAlign="bottom"
                                    wrapperStyle={{ paddingTop: '20px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}