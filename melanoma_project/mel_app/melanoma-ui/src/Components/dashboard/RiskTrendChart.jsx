import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import moment from 'moment';

export default function RiskTrendChart({ scans }) {
    // Group scans by date and calculate average risk score
    const riskValues = { low: 1, moderate: 2, high: 3, critical: 4 };
    
    const groupedData = scans.reduce((acc, scan) => {
        const date = moment(scan.created_date).format('MMM DD');
        if (!acc[date]) {
            acc[date] = { date, total: 0, count: 0 };
        }
        acc[date].total += riskValues[scan.risk_level] || 1;
        acc[date].count += 1;
        return acc;
    }, {});

    const data = Object.values(groupedData)
        .map(item => ({
            date: item.date,
            risk: Math.round((item.total / item.count) * 25), // Convert to percentage
            scans: item.count
        }))
        .slice(-14); // Last 14 data points

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-200">
                    <p className="font-semibold text-slate-800">{label}</p>
                    <p className="text-sm text-teal-600">Avg Risk: {payload[0].value}%</p>
                    <p className="text-sm text-slate-500">{payload[0].payload.scans} scans</p>
                </div>
            );
        }
        return null;
    };

    if (data.length === 0) {
        return (
            <Card className="h-full">
                <CardHeader>
                    <CardTitle className="text-lg">Risk Trend Over Time</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-64 text-slate-500">
                    No trend data available
                </CardContent>
            </Card>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
        >
            <Card className="h-full">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Risk Trend Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis 
                                    dataKey="date" 
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12 }}
                                />
                                <YAxis 
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12 }}
                                    domain={[0, 100]}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="risk"
                                    stroke="#14b8a6"
                                    strokeWidth={2}
                                    fill="url(#riskGradient)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}