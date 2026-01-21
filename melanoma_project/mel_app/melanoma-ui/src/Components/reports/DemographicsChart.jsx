import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Users } from 'lucide-react';

export default function DemographicsChart({ patients }) {
    // Gender distribution
    const genderCounts = patients.reduce((acc, patient) => {
        acc[patient.gender] = (acc[patient.gender] || 0) + 1;
        return acc;
    }, {});

    const genderData = Object.entries(genderCounts).map(([gender, count]) => ({
        name: gender,
        count
    }));

    return (
        <Card className="border-2 border-slate-200">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    Patient Demographics
                </CardTitle>
            </CardHeader>
            <CardContent>
                {genderData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={genderData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#3b82f6" name="Patient Count" />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-300 flex items-center justify-center text-slate-500">
                        No patient data available
                    </div>
                )}
            </CardContent>
        </Card>
    );
}