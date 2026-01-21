import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
    AlertTriangle, 
    CheckCircle2, 
    AlertCircle, 
    XCircle,
    Stethoscope,
    Activity,
    FileText,
    Download,
    Share2,
    ShieldCheck
} from 'lucide-react';
import { motion } from 'framer-motion';
import RiskGauge from './RiskGauge';
import ABCDEVisual from './ABCDEVisual';
import ConfidenceChart from './ConfidenceChart';

const riskConfig = {
    low: { 
        color: 'bg-emerald-500', 
        bgLight: 'bg-emerald-50', 
        textColor: 'text-emerald-700',
        borderColor: 'border-emerald-200',
        icon: CheckCircle2,
        label: 'Low Risk'
    },
    moderate: { 
        color: 'bg-amber-500', 
        bgLight: 'bg-amber-50', 
        textColor: 'text-amber-700',
        borderColor: 'border-amber-200',
        icon: AlertCircle,
        label: 'Moderate Risk'
    },
    high: { 
        color: 'bg-orange-500', 
        bgLight: 'bg-orange-50', 
        textColor: 'text-orange-700',
        borderColor: 'border-orange-200',
        icon: AlertTriangle,
        label: 'High Risk'
    },
    critical: { 
        color: 'bg-red-500', 
        bgLight: 'bg-red-50', 
        textColor: 'text-red-700',
        borderColor: 'border-red-200',
        icon: XCircle,
        label: 'Critical Risk'
    }
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

export default function AnalysisResult({ result, imageUrl, onNewScan }) {
    const risk = riskConfig[result.risk_level] || riskConfig.low;
    const RiskIcon = risk.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Medical Header Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center gap-3 mb-2">
                    <ShieldCheck className="h-8 w-8" />
                    <div>
                        <h1 className="text-2xl font-bold">Clinical Analysis Report</h1>
                        <p className="text-blue-100 text-sm">AI-Assisted Dermatological Assessment</p>
                    </div>
                </div>
            </div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Risk Assessment */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="border-2 border-slate-200">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg text-slate-700">Risk Assessment</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <RiskGauge riskLevel={result.risk_level} confidence={result.confidence_score} />
                            <div className={`mt-4 p-4 rounded-xl ${risk.bgLight} border-2 ${risk.borderColor}`}>
                                <div className="flex items-center gap-2 mb-2">
                                    <RiskIcon className={`h-5 w-5 ${risk.textColor}`} />
                                    <span className={`font-bold ${risk.textColor}`}>{risk.label}</span>
                                </div>
                                <p className="text-sm text-slate-600 font-medium">
                                    {classificationLabels[result.classification] || result.classification}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-2 border-slate-200">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg text-slate-700">Confidence Metrics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ConfidenceChart 
                                confidence={result.confidence_score}
                                classification={classificationLabels[result.classification] || result.classification}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Detailed Analysis */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Image Preview */}
                    {imageUrl && (
                        <Card className="border-2 border-slate-200">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg text-slate-700">Lesion Imaging</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-xl overflow-hidden border-2 border-slate-300 bg-slate-900">
                                    <img 
                                        src={imageUrl} 
                                        alt="Analyzed skin lesion" 
                                        className="w-full h-64 md:h-96 object-contain"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* ABCDE Clinical Analysis */}
                    {result.analysis_details && (
                        <Card className="border-2 border-slate-200">
                            <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-slate-50">
                                <CardTitle className="text-lg text-slate-700 flex items-center gap-2">
                                    <Activity className="h-5 w-5 text-blue-600" />
                                    ABCDE Dermatoscopy Criteria
                                </CardTitle>
                                <p className="text-xs text-slate-500 mt-1">
                                    Clinical assessment based on standard melanoma detection protocol
                                </p>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <ABCDEVisual analysisDetails={result.analysis_details} />
                            </CardContent>
                        </Card>
                    )}

                    {/* Clinical Recommendations */}
                    {result.recommendations && result.recommendations.length > 0 && (
                        <Card className="border-2 border-blue-200 bg-blue-50/30">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg text-slate-700 flex items-center gap-2">
                                    <Stethoscope className="h-5 w-5 text-blue-600" />
                                    Clinical Recommendations
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {result.recommendations.map((rec, i) => (
                                        <li key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white border-2 border-blue-200">
                                            <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                                                {i + 1}
                                            </span>
                                            <span className="text-sm text-slate-700 font-medium leading-relaxed">{rec}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                    onClick={onNewScan}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-xl h-12 text-white shadow-lg"
                >
                    <Activity className="h-4 w-4 mr-2" />
                    New Analysis
                </Button>
                <Button 
                    variant="outline" 
                    className="flex-1 rounded-xl h-12 border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                    <FileText className="h-4 w-4 mr-2" />
                    Medical Records
                </Button>
            </div>

            {/* Medical Disclaimer */}
            <div className="p-5 rounded-xl bg-amber-50 border-2 border-amber-200">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-semibold text-amber-900 mb-1">
                            Medical Disclaimer
                        </p>
                        <p className="text-xs text-amber-800 leading-relaxed">
                            This AI-assisted analysis is designed to support, not replace, the relationship between patient and clinician. 
                            All findings should be evaluated by a qualified dermatologist. Immediate medical consultation is recommended 
                            for high-risk findings.
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}