import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, Calendar } from 'lucide-react';
import moment from 'moment';

const riskConfig = {
    low: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    moderate: 'bg-amber-100 text-amber-700 border-amber-200',
    high: 'bg-orange-100 text-orange-700 border-orange-200',
    critical: 'bg-red-100 text-red-700 border-red-200'
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

export default function PatientScans({ patientId }) {
    const { data: scans = [], isLoading } = useQuery({
        queryKey: ['patient-scans', patientId],
        queryFn: async () => {
            const allScans = await base44.entities.SkinScan.list('-created_date', 200);
            return allScans.filter(scan => scan.patient_id === patientId);
        }
    });

    if (isLoading) {
        return (
            <div className="space-y-3">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-600" />
                    Scan History
                </h3>
                {[1,2,3].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                Scan History ({scans.length})
            </h3>
            
            {scans.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                    <Activity className="h-10 w-10 mx-auto text-slate-300 mb-2" />
                    <p className="text-sm text-slate-500">No scans recorded yet</p>
                </div>
            ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {scans.map((scan) => (
                        <div 
                            key={scan.id} 
                            className="flex items-center gap-4 p-4 bg-white rounded-xl border-2 border-slate-200 hover:border-blue-300 transition-colors"
                        >
                            <img 
                                src={scan.image_url} 
                                alt="Scan" 
                                className="w-20 h-20 rounded-lg object-cover border-2 border-slate-200"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-slate-900">
                                    {classificationLabels[scan.classification]}
                                </p>
                                <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                                    <Calendar className="h-3 w-3" />
                                    {moment(scan.created_date).format('MMM D, YYYY')}
                                </div>
                                {scan.body_location && (
                                    <p className="text-xs text-slate-500 mt-1">{scan.body_location}</p>
                                )}
                            </div>
                            <div className="text-right">
                                <Badge className={`${riskConfig[scan.risk_level]} border mb-2`}>
                                    {scan.risk_level}
                                </Badge>
                                <p className="text-xs font-medium text-blue-600">
                                    {scan.confidence_score}%
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}