import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
    User, 
    Mail, 
    Phone, 
    Calendar,
    Activity,
    FileText,
    Edit,
    Save,
    Stethoscope
} from 'lucide-react';
import { motion } from 'framer-motion';
import moment from 'moment';

const riskConfig = {
    low: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    moderate: 'bg-amber-100 text-amber-700 border-amber-200',
    high: 'bg-orange-100 text-orange-700 border-orange-200',
    critical: 'bg-red-100 text-red-700 border-red-200'
};

export default function PatientPortalPage() {
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        full_name: '',
        phone: '',
        email: '',
        medical_history: ''
    });

    const queryClient = useQueryClient();

    const { data: user } = useQuery({
        queryKey: ['current-user'],
        queryFn: () => base44.auth.me()
    });

    const { data: scans = [], isLoading: scansLoading } = useQuery({
        queryKey: ['my-scans'],
        queryFn: async () => {
            const allScans = await base44.entities.SkinScan.list('-created_date', 200);
            return allScans.filter(scan => scan.created_by === user?.email);
        },
        enabled: !!user
    });

    const updateProfileMutation = useMutation({
        mutationFn: (data) => base44.auth.updateMe(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['current-user'] });
            setIsEditing(false);
        }
    });

    useEffect(() => {
        if (user) {
            setProfileData({
                full_name: user.full_name || '',
                phone: user.phone || '',
                email: user.email || '',
                medical_history: user.medical_history || ''
            });
        }
    }, [user]);

    const handleSubmit = (e) => {
        e.preventDefault();
        updateProfileMutation.mutate(profileData);
    };

    const highRiskScans = scans.filter(s => s.risk_level === 'high' || s.risk_level === 'critical');

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
            <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                        My Health Portal
                    </h1>
                    <p className="text-slate-600 mt-1 font-medium">
                        Manage your profile and view your medical records
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Profile */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Profile Card */}
                        <Card className="border-2 border-slate-200">
                            <CardHeader className="flex flex-row items-center justify-between pb-3">
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5 text-blue-600" />
                                    Personal Information
                                </CardTitle>
                                {!isEditing ? (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit
                                    </Button>
                                ) : null}
                            </CardHeader>
                            <CardContent>
                                {isEditing ? (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <Label>Full Name</Label>
                                            <Input
                                                value={profileData.full_name}
                                                onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                                                className="mt-2"
                                            />
                                        </div>
                                        <div>
                                            <Label>Phone Number</Label>
                                            <Input
                                                type="tel"
                                                value={profileData.phone}
                                                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                                className="mt-2"
                                            />
                                        </div>
                                        <div>
                                            <Label>Email</Label>
                                            <Input
                                                type="email"
                                                value={profileData.email}
                                                disabled
                                                className="mt-2 bg-slate-50"
                                            />
                                        </div>
                                        <div>
                                            <Label>Medical History</Label>
                                            <Textarea
                                                value={profileData.medical_history}
                                                onChange={(e) => setProfileData({ ...profileData, medical_history: e.target.value })}
                                                placeholder="Any relevant medical history, allergies, medications..."
                                                className="mt-2 resize-none"
                                                rows={4}
                                            />
                                        </div>
                                        <div className="flex gap-3">
                                            <Button
                                                type="submit"
                                                className="flex-1 bg-blue-600 hover:bg-blue-700"
                                                disabled={updateProfileMutation.isPending}
                                            >
                                                <Save className="h-4 w-4 mr-2" />
                                                Save Changes
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => setIsEditing(false)}
                                                className="flex-1"
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                            <User className="h-5 w-5 text-slate-400" />
                                            <div>
                                                <p className="text-xs text-slate-500">Name</p>
                                                <p className="font-medium text-slate-900">{user?.full_name || 'Not provided'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                            <Mail className="h-5 w-5 text-slate-400" />
                                            <div>
                                                <p className="text-xs text-slate-500">Email</p>
                                                <p className="font-medium text-slate-900">{user?.email}</p>
                                            </div>
                                        </div>
                                        {user?.phone && (
                                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                                <Phone className="h-5 w-5 text-slate-400" />
                                                <div>
                                                    <p className="text-xs text-slate-500">Phone</p>
                                                    <p className="font-medium text-slate-900">{user.phone}</p>
                                                </div>
                                            </div>
                                        )}
                                        {user?.medical_history && (
                                            <div className="p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
                                                <p className="text-xs text-slate-500 mb-2">Medical History</p>
                                                <p className="text-sm text-slate-700">{user.medical_history}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Scan History */}
                        <Card className="border-2 border-slate-200">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="h-5 w-5 text-blue-600" />
                                    My Scan History ({scans.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {scansLoading ? (
                                    <p className="text-center text-slate-500 py-4">Loading...</p>
                                ) : scans.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Activity className="h-12 w-12 mx-auto text-slate-300 mb-2" />
                                        <p className="text-sm text-slate-500">No scans recorded yet</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3 max-h-96 overflow-y-auto">
                                        {scans.map((scan) => (
                                            <div 
                                                key={scan.id}
                                                className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200"
                                            >
                                                <img 
                                                    src={scan.image_url} 
                                                    alt="Scan" 
                                                    className="w-16 h-16 rounded-lg object-cover"
                                                />
                                                <div className="flex-1">
                                                    <p className="font-semibold text-slate-900 text-sm">
                                                        {scan.classification}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Calendar className="h-3 w-3 text-slate-400" />
                                                        <span className="text-xs text-slate-500">
                                                            {moment(scan.created_date).format('MMM D, YYYY')}
                                                        </span>
                                                    </div>
                                                </div>
                                                <Badge className={`${riskConfig[scan.risk_level]} border`}>
                                                    {scan.risk_level}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Quick Stats */}
                    <div className="space-y-6">
                        <Card className="border-2 border-blue-200 bg-blue-50/50">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">Health Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="p-3 bg-white rounded-lg">
                                    <p className="text-xs text-slate-500">Total Scans</p>
                                    <p className="text-2xl font-bold text-blue-600">{scans.length}</p>
                                </div>
                                <div className="p-3 bg-white rounded-lg">
                                    <p className="text-xs text-slate-500">High Risk Findings</p>
                                    <p className="text-2xl font-bold text-red-600">{highRiskScans.length}</p>
                                </div>
                                {scans.length > 0 && (
                                    <div className="p-3 bg-white rounded-lg">
                                        <p className="text-xs text-slate-500">Latest Scan</p>
                                        <p className="text-sm font-medium text-slate-900">
                                            {moment(scans[0].created_date).fromNow()}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {highRiskScans.length > 0 && (
                            <Card className="border-2 border-red-200 bg-red-50/50">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base flex items-center gap-2 text-red-800">
                                        <Stethoscope className="h-5 w-5" />
                                        Action Required
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-red-700 mb-3">
                                        You have {highRiskScans.length} high-risk finding{highRiskScans.length > 1 ? 's' : ''}.
                                    </p>
                                    <Button className="w-full bg-red-600 hover:bg-red-700">
                                        <Stethoscope className="h-4 w-4 mr-2" />
                                        Consult Doctor
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        <Card className="border-2 border-slate-200">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button variant="outline" className="w-full justify-start">
                                    <FileText className="h-4 w-4 mr-2" />
                                    Download Medical Records
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Schedule Appointment
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}