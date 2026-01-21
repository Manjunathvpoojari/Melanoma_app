import React from 'react';
import { motion } from 'framer-motion';

const riskConfig = {
    low: { angle: 30, color: '#10b981', label: 'LOW RISK' },
    moderate: { angle: 90, color: '#f59e0b', label: 'MODERATE RISK' },
    high: { angle: 150, color: '#f97316', label: 'HIGH RISK' },
    critical: { angle: 210, color: '#ef4444', label: 'CRITICAL RISK' }
};

export default function RiskGauge({ riskLevel, confidence }) {
    const config = riskConfig[riskLevel] || riskConfig.low;
    
    return (
        <div className="relative w-48 h-48 mx-auto">
            {/* Background Arc */}
            <svg className="w-full h-full" viewBox="0 0 200 200">
                <defs>
                    <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="33%" stopColor="#f59e0b" />
                        <stop offset="66%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>
                </defs>
                
                {/* Background track */}
                <path
                    d="M 30 170 A 80 80 0 1 1 170 170"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="12"
                    strokeLinecap="round"
                />
                
                {/* Colored arc */}
                <motion.path
                    d="M 30 170 A 80 80 0 1 1 170 170"
                    fill="none"
                    stroke="url(#gaugeGradient)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                />
                
                {/* Needle */}
                <motion.g
                    initial={{ rotate: 0 }}
                    animate={{ rotate: config.angle - 180 }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                    style={{ transformOrigin: '100px 100px' }}
                >
                    <line
                        x1="100"
                        y1="100"
                        x2="100"
                        y2="40"
                        stroke={config.color}
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                    <circle cx="100" cy="100" r="6" fill={config.color} />
                </motion.g>
            </svg>
            
            {/* Center Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1, type: "spring" }}
                    className="text-center -mt-4"
                >
                    <div className="text-3xl font-bold" style={{ color: config.color }}>
                        {confidence}%
                    </div>
                    <div className="text-xs font-semibold text-slate-500 mt-1">
                        {config.label}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}