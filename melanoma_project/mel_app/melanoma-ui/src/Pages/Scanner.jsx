import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Scan, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

import CameraCapture from '@/components/scanner/CameraCapture';
import ImageUploader from '@/components/scanner/ImageUploader';
import AnalysisResult from '@/components/scanner/AnalysisResult';

const bodyLocations = [
    'Head/Face', 'Neck', 'Chest', 'Back', 'Abdomen', 
    'Upper Arm', 'Lower Arm', 'Hand', 'Upper Leg', 'Lower Leg', 'Foot', 'Other'
];

export default function ScannerPage() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [showCamera, setShowCamera] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [bodyLocation, setBodyLocation] = useState('');
    const [notes, setNotes] = useState('');
    const [selectedPatient, setSelectedPatient] = useState('');

    const { data: patients = [] } = useQuery({
        queryKey: ['patients'],
        queryFn: () => base44.entities.Patient.list('-created_date', 200)
    });

    const handleCameraCapture = (file) => {
        setSelectedFile(file);
        setShowCamera(false);
    };

    const handleAnalyze = async () => {
        if (!selectedFile) return;
        
        setIsAnalyzing(true);
        
        try {
            // Upload image
            const { file_url } = await base44.integrations.Core.UploadFile({ file: selectedFile });
            setImageUrl(file_url);

            // Analyze with AI
            const analysisResult = await base44.integrations.Core.InvokeLLM({
                prompt: `You are an expert dermatologist AI assistant. Analyze this skin lesion image for potential skin cancer detection.

Perform a thorough analysis and provide:
1. Classification: Identify the most likely type (melanoma, nevus, benign_keratosis, basal_cell_carcinoma, actinic_keratosis, dermatofibroma, vascular_lesion, squamous_cell_carcinoma, or unknown)
2. Confidence Score: Your confidence percentage (0-100)
3. Risk Level: Assess as low, moderate, high, or critical
4. ABCDE Analysis:
   - Asymmetry: Is the lesion asymmetrical?
   - Border: Are the borders irregular, ragged, or blurred?
   - Color: Is the color uneven or varied?
   - Diameter: Estimated size assessment
   - Evolution: Any concerning features suggesting changes
5. Recommendations: Provide actionable medical recommendations

${bodyLocation ? `Body Location: ${bodyLocation}` : ''}
${notes ? `Additional Notes from patient: ${notes}` : ''}

Be thorough but remember this is for educational purposes. Always recommend professional consultation for concerning findings.`,
                file_urls: [file_url],
                response_json_schema: {
                    type: "object",
                    properties: {
                        classification: {
                            type: "string",
                            enum: ["melanoma", "nevus", "benign_keratosis", "basal_cell_carcinoma", "actinic_keratosis", "dermatofibroma", "vascular_lesion", "squamous_cell_carcinoma", "unknown"]
                        },
                        confidence_score: { type: "number" },
                        risk_level: {
                            type: "string",
                            enum: ["low", "moderate", "high", "critical"]
                        },
                        analysis_details: {
                            type: "object",
                            properties: {
                                asymmetry: { type: "string" },
                                border: { type: "string" },
                                color: { type: "string" },
                                diameter: { type: "string" },
                                evolution: { type: "string" }
                            }
                        },
                        recommendations: {
                            type: "array",
                            items: { type: "string" }
                        }
                    }
                }
            });

            // Save to database
            const scanData = {
                patient_id: selectedPatient || undefined,
                image_url: file_url,
                classification: analysisResult.classification,
                confidence_score: analysisResult.confidence_score,
                risk_level: analysisResult.risk_level,
                analysis_details: analysisResult.analysis_details,
                recommendations: analysisResult.recommendations,
                body_location: bodyLocation,
                notes: notes
            };

            await base44.entities.SkinScan.create(scanData);
            setResult(analysisResult);

        } catch (error) {
            console.error('Analysis error:', error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const resetScan = () => {
        setSelectedFile(null);
        setResult(null);
        setImageUrl(null);
        setBodyLocation('');
        setNotes('');
        setSelectedPatient('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-cyan-50/20">
            <AnimatePresence>
                {showCamera && (
                    <CameraCapture 
                        onCapture={handleCameraCapture}
                        onClose={() => setShowCamera(false)}
                    />
                )}
            </AnimatePresence>

            <div className="max-w-2xl mx-auto px-4 py-6 md:py-12">
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
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                            <Scan className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
                                Clinical Skin Analysis
                            </h1>
                            <p className="text-slate-600 text-sm">
                                AI-Powered Dermatological Screening System
                            </p>
                        </div>
                    </div>
                    <p className="text-slate-600 text-sm mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <strong className="text-blue-900">Medical-Grade AI:</strong> Upload high-resolution dermoscopic or clinical images for comprehensive skin lesion assessment
                    </p>
                </motion.div>

                {/* Main Content */}
                {!result ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Image Upload */}
                        <ImageUploader 
                            onImageSelect={setSelectedFile}
                            onOpenCamera={() => setShowCamera(true)}
                        />

                        {/* Additional Info */}
                        {selectedFile && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                            >
                                <Card className="border-0 shadow-lg">
                                    <CardContent className="p-6 space-y-4">
                                        <div>
                                            <Label className="text-slate-700 font-medium">
                                                Patient (Optional)
                                            </Label>
                                            <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                                                <SelectTrigger className="mt-2">
                                                    <SelectValue placeholder="Select patient or skip" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value={null}>No patient selected</SelectItem>
                                                    {patients.map(patient => (
                                                        <SelectItem key={patient.id} value={patient.id}>
                                                            {patient.full_name} {patient.medical_record_number ? `(${patient.medical_record_number})` : ''}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label className="text-slate-700 font-medium">
                                                Body Location (Optional)
                                            </Label>
                                            <Select value={bodyLocation} onValueChange={setBodyLocation}>
                                                <SelectTrigger className="mt-2">
                                                    <SelectValue placeholder="Select location" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {bodyLocations.map(loc => (
                                                        <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label className="text-slate-700 font-medium">
                                                Additional Notes (Optional)
                                            </Label>
                                            <Textarea 
                                                value={notes}
                                                onChange={(e) => setNotes(e.target.value)}
                                                placeholder="Any symptoms, history, or observations..."
                                                className="mt-2 resize-none"
                                                rows={3}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}

                        {/* Analyze Button */}
                        <Button
                            onClick={handleAnalyze}
                            disabled={!selectedFile || isAnalyzing}
                            className="w-full h-16 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 rounded-xl shadow-lg shadow-blue-500/30 disabled:opacity-50"
                        >
                            {isAnalyzing ? (
                                <>
                                    <Loader2 className="h-6 w-6 mr-3 animate-spin" />
                                    Processing Clinical Analysis...
                                </>
                            ) : (
                                <>
                                    <Scan className="h-6 w-6 mr-3" />
                                    Begin Clinical Analysis
                                </>
                            )}
                        </Button>

                        {/* AI Loading State */}
                        {isAnalyzing && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-8"
                            >
                                <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-200">
                                    <div className="flex justify-center mb-4">
                                        <div className="flex gap-1">
                                            <span className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <span className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                    <h3 className="font-semibold text-slate-800 mb-2">Processing Clinical Data</h3>
                                    <p className="text-sm text-slate-600">AI system is performing comprehensive dermatological analysis using advanced pattern recognition algorithms...</p>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                ) : (
                    <AnalysisResult 
                        result={result}
                        imageUrl={imageUrl}
                        onNewScan={resetScan}
                    />
                )}
            </div>
        </div>
    );
}