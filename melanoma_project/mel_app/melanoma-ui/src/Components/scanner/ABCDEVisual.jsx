import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

const criteriaInfo = {
    asymmetry: { letter: 'A', name: 'Asymmetry', color: '#3b82f6' },
    border: { letter: 'B', name: 'Border', color: '#8b5cf6' },
    color: { letter: 'C', name: 'Color', color: '#ec4899' },
    diameter: { letter: 'D', name: 'Diameter', color: '#f59e0b' },
    evolution: { letter: 'E', name: 'Evolution', color: '#ef4444' }
};

const getRiskIcon = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes('normal') || lower.includes('well-defined') || lower.includes('uniform') || lower.includes('symmetrical')) {
        return { Icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' };
    }
    if (lower.includes('concerning') || lower.includes('irregular') || lower.includes('significant')) {
        return { Icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' };
    }
    return { Icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' };
};

export default function ABCDEVisual({ analysisDetails }) {
    if (!analysisDetails) return null;

    return (
        <div className="space-y-3">
            {Object.entries(analysisDetails).map(([key, value], index) => {
                const info = criteriaInfo[key];
                const risk = getRiskIcon(value);
                const Icon = risk.Icon;
                
                return (
                    <motion.div
                        key={key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative"
                    >
                        <div className={`flex items-start gap-4 p-4 rounded-xl border-2 ${risk.bg} border-opacity-30`}>
                            <div 
                                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
                                style={{ background: `linear-gradient(135deg, ${info.color}, ${info.color}dd)` }}
                            >
                                {info.letter}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-slate-800">{info.name}</span>
                                    <Icon className={`h-4 w-4 ${risk.color}`} />
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed">{value}</p>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}