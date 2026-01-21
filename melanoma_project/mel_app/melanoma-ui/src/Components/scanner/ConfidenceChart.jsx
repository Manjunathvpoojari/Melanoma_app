import React from 'react';
import { motion } from 'framer-motion';

export default function ConfidenceChart({ confidence, classification }) {
    const segments = [
        { range: '0-25%', label: 'Low', color: '#ef4444' },
        { range: '25-50%', label: 'Fair', color: '#f59e0b' },
        { range: '50-75%', label: 'Good', color: '#3b82f6' },
        { range: '75-100%', label: 'High', color: '#10b981' }
    ];

    const getActiveSegment = (conf) => {
        if (conf <= 25) return 0;
        if (conf <= 50) return 1;
        if (conf <= 75) return 2;
        return 3;
    };

    const activeIndex = getActiveSegment(confidence);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-600">Detection Confidence</span>
                <span className="text-2xl font-bold text-slate-800">{confidence}%</span>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
                {segments.map((segment, index) => (
                    <motion.div
                        key={index}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className="relative"
                        style={{ transformOrigin: 'bottom' }}
                    >
                        <div
                            className={`h-20 rounded-lg transition-all duration-300 ${
                                index <= activeIndex 
                                    ? 'opacity-100' 
                                    : 'opacity-20'
                            }`}
                            style={{ 
                                backgroundColor: segment.color,
                                height: `${60 + index * 15}px`
                            }}
                        />
                        <div className="text-center mt-2">
                            <p className="text-xs font-semibold text-slate-700">{segment.label}</p>
                            <p className="text-xs text-slate-500">{segment.range}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                <p className="text-sm text-blue-900">
                    <span className="font-semibold">Classification:</span> {classification}
                </p>
            </div>
        </div>
    );
}