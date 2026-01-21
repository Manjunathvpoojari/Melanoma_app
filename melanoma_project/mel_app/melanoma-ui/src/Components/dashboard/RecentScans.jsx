import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const riskColors = {
    low: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    moderate: 'bg-amber-100 text-amber-700 border-amber-200',
    high: 'bg-orange-100 text-orange-700 border-orange-200',
    critical: 'bg-red-100 text-red-700 border-red-200'
};

const classificationLabels = {
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

export default function RecentScans({ scans }) {
    const recentScans = scans.slice(0, 5);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg">Recent Scans</CardTitle>
                    <Link to={createPageUrl('History')}>
                        <Button variant="ghost" size="sm" className="text-teal-600 hover:text-teal-700">
                            View All <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </Link>
                </CardHeader>
                <CardContent>
                    {recentScans.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">
                            <p>No scans yet</p>
                            <p className="text-sm mt-1">Start your first skin analysis</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentScans.map((scan, index) => (
                                <motion.div
                                    key={scan.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                                >
                                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-slate-200">
                                        <img 
                                            src={scan.image_url} 
                                            alt="Scan"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-slate-800 truncate">
                                                {classificationLabels[scan.classification] || scan.classification}
                                            </span>
                                            <Badge className={`${riskColors[scan.risk_level]} text-xs border`}>
                                                {scan.risk_level}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                                            <Clock className="h-3 w-3" />
                                            {moment(scan.created_date).fromNow()}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-sm font-semibold text-teal-600">
                                            {scan.confidence_score}%
                                        </span>
                                        <p className="text-xs text-slate-500">confidence</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}