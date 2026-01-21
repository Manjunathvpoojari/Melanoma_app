import React from 'react';
import { Card } from "@/components/ui/card";
import { motion } from 'framer-motion';

export default function StatsCard({ title, value, subtitle, icon: Icon, gradient, delay = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
        >
            <Card className="relative overflow-hidden p-6 border-0 shadow-lg">
                <div className={`absolute inset-0 ${gradient} opacity-5`} />
                <div className="relative flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500">{title}</p>
                        <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
                        {subtitle && (
                            <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
                        )}
                    </div>
                    <div className={`p-3 rounded-xl ${gradient}`}>
                        <Icon className="h-6 w-6 text-white" />
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}