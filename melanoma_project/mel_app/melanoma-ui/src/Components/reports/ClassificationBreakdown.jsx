import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Activity } from 'lucide-react';

const COLORS = {
    melanoma: '#ef4444',
    nevus: '#3b82f6',
    benign_keratosis: '#10b981',
    basal_cell_carcinoma: '#f59e0b',
    actinic_keratosis: '#8b5cf6',
    dermatofibroma: '#ec4899',
    vascular_lesion: '#06b6d4',
    squamous_cell_carcinoma: '#f97316'
};

export default function ClassificationBreakdown({ scans }) {
    const classificationCounts = scans.reduce((acc, scan) => {
        acc[scan.classification] = (acc[scan.classification] || 0) + 1;
        return acc;
    }, {});

    const data = Object.entries(classificationCounts).map(([name, value]) => ({
        name: name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        value,
        color: COLORS[name] || '#94a3b8'
    }));

    return (
        <Card className="border-2 border-slate-200">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-600" />
                    Classification Distribution
                </CardTitle>
            </CardHeader>
            <CardContent>
                {data.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-300 flex items-center justify-center text-slate-500">
                        No data available
                    </div>
                )}
            </CardContent>
        </Card>
    );
}