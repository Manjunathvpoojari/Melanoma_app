import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { 
    Plus, 
    Search, 
    User, 
    Calendar,
    Phone,
    Mail,
    FileText,
    Edit,
    Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import moment from 'moment';
import PatientForm from '@/components/patients/PatientForm';
import PatientScans from '@/components/patients/PatientScans';

export default function PatientsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingPatient, setEditingPatient] = useState(null);
    const [viewingPatient, setViewingPatient] = useState(null);
    
    const queryClient = useQueryClient();
    
    const { data: patients = [], isLoading } = useQuery({
        queryKey: ['patients'],
        queryFn: () => base44.entities.Patient.list('-created_date', 200)
    });

    const createMutation = useMutation({
        mutationFn: (data) => base44.entities.Patient.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['patients'] });
            setShowForm(false);
            setEditingPatient(null);
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => base44.entities.Patient.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['patients'] });
            setShowForm(false);
            setEditingPatient(null);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => base44.entities.Patient.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['patients'] });
            setViewingPatient(null);
        }
    });

    const handleSubmit = (data) => {
        if (editingPatient) {
            updateMutation.mutate({ id: editingPatient.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    const filteredPatients = patients.filter(patient => 
        searchQuery === '' ||
        patient.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.medical_record_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const calculateAge = (dob) => {
        return moment().diff(moment(dob), 'years');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
                >
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                            Patient Management
                        </h1>
                        <p className="text-slate-600 mt-1 font-medium">
                            Manage patient records and medical history
                        </p>
                    </div>
                    <Button
                        onClick={() => {
                            setEditingPatient(null);
                            setShowForm(true);
                        }}
                        className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 rounded-xl h-12 px-6 shadow-lg shadow-blue-500/30 font-semibold"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        New Patient
                    </Button>
                </motion.div>

                {/* Search */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-lg p-4 mb-6"
                >
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <Input
                            placeholder="Search by name, MRN, or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-12"
                        />
                    </div>
                </motion.div>

                {/* Results Count */}
                <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-slate-600 font-medium">
                        {filteredPatients.length} patient{filteredPatients.length !== 1 ? 's' : ''} found
                    </p>
                </div>

                {/* Patient Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence>
                        {filteredPatients.map((patient, index) => (
                            <motion.div
                                key={patient.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.03 }}
                            >
                                <Card 
                                    className="hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-slate-200 hover:border-blue-300"
                                    onClick={() => setViewingPatient(patient)}
                                >
                                    <CardContent className="p-5">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                                {patient.full_name?.charAt(0).toUpperCase()}
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditingPatient(patient);
                                                    setShowForm(true);
                                                }}
                                                className="h-8 w-8"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        
                                        <h3 className="font-bold text-slate-900 text-lg mb-1">
                                            {patient.full_name}
                                        </h3>
                                        
                                        <div className="space-y-2 text-sm text-slate-600">
                                            {patient.medical_record_number && (
                                                <div className="flex items-center gap-2">
                                                    <FileText className="h-4 w-4 text-blue-600" />
                                                    <span className="font-medium">MRN: {patient.medical_record_number}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-slate-400" />
                                                <span>{patient.gender} • {calculateAge(patient.date_of_birth)} years</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-slate-400" />
                                                <span>DOB: {moment(patient.date_of_birth).format('MMM D, YYYY')}</span>
                                            </div>
                                            {patient.phone && (
                                                <div className="flex items-center gap-2">
                                                    <Phone className="h-4 w-4 text-slate-400" />
                                                    <span>{patient.phone}</span>
                                                </div>
                                            )}
                                            {patient.email && (
                                                <div className="flex items-center gap-2">
                                                    <Mail className="h-4 w-4 text-slate-400" />
                                                    <span className="truncate">{patient.email}</span>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredPatients.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16 bg-white rounded-2xl shadow-lg"
                    >
                        <User className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">
                            {searchQuery ? 'No patients found' : 'No patients yet'}
                        </h3>
                        <p className="text-slate-500">
                            {searchQuery ? 'Try adjusting your search' : 'Add your first patient to get started'}
                        </p>
                    </motion.div>
                )}
            </div>

            {/* Patient Form Dialog */}
            <Dialog open={showForm} onOpenChange={setShowForm}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            {editingPatient ? 'Edit Patient' : 'New Patient'}
                        </DialogTitle>
                    </DialogHeader>
                    <PatientForm
                        patient={editingPatient}
                        onSubmit={handleSubmit}
                        onCancel={() => {
                            setShowForm(false);
                            setEditingPatient(null);
                        }}
                        isLoading={createMutation.isPending || updateMutation.isPending}
                    />
                </DialogContent>
            </Dialog>

            {/* Patient Details Dialog */}
            <Dialog open={!!viewingPatient} onOpenChange={() => setViewingPatient(null)}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    {viewingPatient && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="text-2xl">Patient Record</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6 mt-4">
                                {/* Patient Info */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-50 rounded-xl">
                                        <p className="text-sm text-slate-500 mb-1">Full Name</p>
                                        <p className="font-semibold text-slate-900">{viewingPatient.full_name}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-xl">
                                        <p className="text-sm text-slate-500 mb-1">MRN</p>
                                        <p className="font-semibold text-slate-900">{viewingPatient.medical_record_number || 'N/A'}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-xl">
                                        <p className="text-sm text-slate-500 mb-1">Date of Birth</p>
                                        <p className="font-semibold text-slate-900">
                                            {moment(viewingPatient.date_of_birth).format('MMM D, YYYY')} ({calculateAge(viewingPatient.date_of_birth)} years)
                                        </p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-xl">
                                        <p className="text-sm text-slate-500 mb-1">Gender</p>
                                        <p className="font-semibold text-slate-900">{viewingPatient.gender}</p>
                                    </div>
                                    {viewingPatient.phone && (
                                        <div className="p-4 bg-slate-50 rounded-xl">
                                            <p className="text-sm text-slate-500 mb-1">Phone</p>
                                            <p className="font-semibold text-slate-900">{viewingPatient.phone}</p>
                                        </div>
                                    )}
                                    {viewingPatient.email && (
                                        <div className="p-4 bg-slate-50 rounded-xl">
                                            <p className="text-sm text-slate-500 mb-1">Email</p>
                                            <p className="font-semibold text-slate-900">{viewingPatient.email}</p>
                                        </div>
                                    )}
                                </div>

                                {viewingPatient.notes && (
                                    <div className="p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                                        <p className="text-sm text-slate-500 mb-2">Medical Notes</p>
                                        <p className="text-sm text-slate-700">{viewingPatient.notes}</p>
                                    </div>
                                )}

                                {/* Scan History */}
                                <PatientScans patientId={viewingPatient.id} />

                                {/* Actions */}
                                <div className="flex gap-3 pt-4 border-t">
                                    <Button
                                        onClick={() => {
                                            setEditingPatient(viewingPatient);
                                            setViewingPatient(null);
                                            setShowForm(true);
                                        }}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                                    >
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit Patient
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() => deleteMutation.mutate(viewingPatient.id)}
                                        disabled={deleteMutation.isPending}
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete
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