import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { 
    Search, 
    Filter, 
    Trash2, 
    Eye,
    ArrowLeft,
    Calendar,
    MapPin,
    AlertTriangle,
    CheckCircle2,
    AlertCircle,
    XCircle,
    Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import moment from 'moment';

const riskConfig = {
    low: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
    moderate: { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: AlertCircle },
    high: { color: 'bg-orange-100 text-orange-700 border-orange-200', icon: AlertTriangle },
    critical: { color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle }
};

const classificationLabels = {
    melanoma: 'Melanoma',
    nevus: 'Nevus (Mole)',
    benign_keratosis: 'Benign Keratosis',
    basal_cell_carcinoma: 'Basal Cell Carcinoma',
    actinic_keratosis: 'Actinic Keratosis',
    dermatofibroma: 'Dermatofibroma',
    vascular_lesion: 'Vascular Lesion',
    squamous_cell_carcinoma: 'Squamous Cell Carcinoma',
    unknown: 'Unknown'
};

export default function HistoryPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [riskFilter, setRiskFilter] = useState('all');
    const [classificationFilter, setClassificationFilter] = useState('all');
    const [selectedScan, setSelectedScan] = useState(null);
    
    const queryClient = useQueryClient();
    
    const { data: scans = [], isLoading } = useQuery({
        queryKey: ['scans-history'],
        queryFn: () => base44.entities.SkinScan.list('-created_date', 200)
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => base44.entities.SkinScan.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['scans-history'] });
            setSelectedScan(null);
        }
    });

    const filteredScans = scans.filter(scan => {
        const matchesSearch = 
            searchQuery === '' ||
            (scan.classification && classificationLabels[scan.classification]?.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (scan.body_location && scan.body_location.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (scan.notes && scan.notes.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const matchesRisk = riskFilter === 'all' || scan.risk_level === riskFilter;
        const matchesClassification = classificationFilter === 'all' || scan.classification === classificationFilter;
        
        return matchesSearch && matchesRisk && matchesClassification;
    });

    const uniqueClassifications = [...new Set(scans.map(s => s.classification).filter(Boolean))];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-cyan-50/20">
            <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <Link 
                        to={createPageUrl('Dashboard')}
                        className="inline-flex items-center text-slate-600 hover:text-slate-800 mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                        Clinical Records
                    </h1>
                    <p className="text-slate-600 mt-1 font-medium">
                        Complete history of melanoma screening analyses
                    </p>
                </motion.div>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-lg p-4 mb-6"
                >
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search by classification, location, or notes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex gap-3">
                            <Select value={riskFilter} onValueChange={setRiskFilter}>
                                <SelectTrigger className="w-36">
                                    <Filter className="h-4 w-4 mr-2" />
                                    <SelectValue placeholder="Risk Level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Risks</SelectItem>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="moderate">Moderate</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="critical">Critical</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={classificationFilter} onValueChange={setClassificationFilter}>
                                <SelectTrigger className="w-44">
                                    <SelectValue placeholder="Classification" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    {uniqueClassifications.map(c => (
                                        <SelectItem key={c} value={c}>
                                            {classificationLabels[c] || c}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </motion.div>

                {/* Results Count */}
                <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-slate-600">
                        Showing {filteredScans.length} of {scans.length} scans
                    </p>
                </div>

                {/* Scans Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1,2,3,4,5,6].map(i => (
                            <Skeleton key={i} className="h-64 rounded-2xl" />
                        ))}
                    </div>
                ) : filteredScans.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-16 bg-white rounded-2xl shadow-lg"
                    >
                        <Activity className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">
                            No scans found
                        </h3>
                        <p className="text-slate-500">
                            {scans.length === 0 
                                ? "You haven't done any scans yet"
                                : "Try adjusting your filters"
                            }
                        </p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <AnimatePresence>
                            {filteredScans.map((scan, index) => {
                                const risk = riskConfig[scan.risk_level] || riskConfig.low;
                                const RiskIcon = risk.icon;
                                
                                return (
                                    <motion.div
                                        key={scan.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ delay: index * 0.03 }}
                                    >
                                        <Card 
                                            className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                                            onClick={() => setSelectedScan(scan)}
                                        >
                                            <div className="relative h-40 bg-slate-100">
                                                <img 
                                                    src={scan.image_url} 
                                                    alt="Scan"
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                                <div className="absolute top-3 right-3">
                                                    <Badge className={`${risk.color} border`}>
                                                        <RiskIcon className="h-3 w-3 mr-1" />
                                                        {scan.risk_level}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <CardContent className="p-4">
                                                <h3 className="font-semibold text-slate-800 mb-1">
                                                    {classificationLabels[scan.classification] || scan.classification}
                                                </h3>
                                                <div className="flex items-center gap-4 text-xs text-slate-500">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {moment(scan.created_date).format('MMM D, YYYY')}
                                                    </span>
                                                    {scan.body_location && (
                                                        <span className="flex items-center gap-1">
                                                            <MapPin className="h-3 w-3" />
                                                            {scan.body_location}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="mt-3 flex items-center justify-between">
                                                    <span className="text-sm font-medium text-teal-600">
                                                        {scan.confidence_score}% confidence
                                                    </span>
                                                    <Button variant="ghost" size="sm" className="text-slate-500">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Detail Dialog */}
            <Dialog open={!!selectedScan} onOpenChange={() => setSelectedScan(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    {selectedScan && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="text-xl">
                                    Scan Details
                                </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6 mt-4">
                                <div className="rounded-xl overflow-hidden">
                                    <img 
                                        src={selectedScan.image_url}
                                        alt="Scan"
                                        className="w-full h-64 object-cover"
                                    />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-50 rounded-xl">
                                        <p className="text-sm text-slate-500">Classification</p>
                                        <p className="font-semibold text-slate-800">
                                            {classificationLabels[selectedScan.classification]}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-xl">
                                        <p className="text-sm text-slate-500">Risk Level</p>
                                        <Badge className={`${riskConfig[selectedScan.risk_level]?.color} border mt-1`}>
                                            {selectedScan.risk_level}
                                        </Badge>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-xl">
                                        <p className="text-sm text-slate-500">Confidence</p>
                                        <p className="font-semibold text-teal-600">
                                            {selectedScan.confidence_score}%
                                        </p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-xl">
                                        <p className="text-sm text-slate-500">Date</p>
                                        <p className="font-semibold text-slate-800">
                                            {moment(selectedScan.created_date).format('MMM D, YYYY h:mm A')}
                                        </p>
                                    </div>
                                </div>

                                {selectedScan.analysis_details && (
                                    <div>
                                        <h4 className="font-semibold mb-3">ABCDE Analysis</h4>
                                        <div className="space-y-2">
                                            {Object.entries(selectedScan.analysis_details).map(([key, value]) => (
                                                <div key={key} className="p-3 bg-slate-50 rounded-lg">
                                                    <span className="text-xs font-semibold uppercase text-slate-500">
                                                        {key}
                                                    </span>
                                                    <p className="text-sm text-slate-700">{value}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedScan.recommendations && selectedScan.recommendations.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold mb-3">Recommendations</h4>
                                        <ul className="space-y-2">
                                            {selectedScan.recommendations.map((rec, i) => (
                                                <li key={i} className="flex items-start gap-2 p-3 bg-teal-50 rounded-lg">
                                                    <span className="w-5 h-5 rounded-full bg-teal-600 text-white text-xs flex items-center justify-center flex-shrink-0">
                                                        {i + 1}
                                                    </span>
                                                    <span className="text-sm text-teal-800">{rec}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className="flex gap-3 pt-4 border-t">
                                    <Button
                                        variant="destructive"
                                        onClick={() => deleteMutation.mutate(selectedScan.id)}
                                        disabled={deleteMutation.isPending}
                                        className="flex-1"
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete Scan
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}