import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from 'lucide-react';

export default function PatientForm({ patient, onSubmit, onCancel, isLoading }) {
    const [formData, setFormData] = useState({
        full_name: patient?.full_name || '',
        date_of_birth: patient?.date_of_birth || '',
        gender: patient?.gender || 'Male',
        medical_record_number: patient?.medical_record_number || '',
        phone: patient?.phone || '',
        email: patient?.email || '',
        notes: patient?.notes || ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label className="text-slate-700 font-medium">Full Name *</Label>
                    <Input
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        required
                        className="mt-2"
                        placeholder="John Doe"
                    />
                </div>

                <div>
                    <Label className="text-slate-700 font-medium">Medical Record Number</Label>
                    <Input
                        value={formData.medical_record_number}
                        onChange={(e) => setFormData({ ...formData, medical_record_number: e.target.value })}
                        className="mt-2"
                        placeholder="MRN-12345"
                    />
                </div>

                <div>
                    <Label className="text-slate-700 font-medium">Date of Birth *</Label>
                    <Input
                        type="date"
                        value={formData.date_of_birth}
                        onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                        required
                        className="mt-2"
                    />
                </div>

                <div>
                    <Label className="text-slate-700 font-medium">Gender *</Label>
                    <Select 
                        value={formData.gender} 
                        onValueChange={(value) => setFormData({ ...formData, gender: value })}
                    >
                        <SelectTrigger className="mt-2">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label className="text-slate-700 font-medium">Phone</Label>
                    <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="mt-2"
                        placeholder="+1 (555) 123-4567"
                    />
                </div>

                <div>
                    <Label className="text-slate-700 font-medium">Email</Label>
                    <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="mt-2"
                        placeholder="patient@email.com"
                    />
                </div>
            </div>

            <div>
                <Label className="text-slate-700 font-medium">Medical Notes</Label>
                <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="mt-2 resize-none"
                    rows={4}
                    placeholder="Any relevant medical history, allergies, or notes..."
                />
            </div>

            <div className="flex gap-3 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    className="flex-1"
                    disabled={isLoading}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        patient ? 'Update Patient' : 'Create Patient'
                    )}
                </Button>
            </div>
        </form>
    );
}