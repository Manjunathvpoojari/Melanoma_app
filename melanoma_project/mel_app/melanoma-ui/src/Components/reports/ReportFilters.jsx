import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Filter } from 'lucide-react';

export default function ReportFilters({ 
    dateRange, 
    onDateRangeChange, 
    riskFilter, 
    onRiskFilterChange,
    classificationFilter,
    onClassificationFilterChange 
}) {
    return (
        <Card className="border-2 border-slate-200 shadow-lg">
            <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <Label className="text-slate-700 font-medium flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Start Date
                        </Label>
                        <Input
                            type="date"
                            value={dateRange.start}
                            onChange={(e) => onDateRangeChange({ ...dateRange, start: e.target.value })}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <Label className="text-slate-700 font-medium flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            End Date
                        </Label>
                        <Input
                            type="date"
                            value={dateRange.end}
                            onChange={(e) => onDateRangeChange({ ...dateRange, end: e.target.value })}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <Label className="text-slate-700 font-medium flex items-center gap-2">
                            <Filter className="h-4 w-4" />
                            Risk Level
                        </Label>
                        <Select value={riskFilter} onValueChange={onRiskFilterChange}>
                            <SelectTrigger className="mt-2">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Levels</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="moderate">Moderate</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="critical">Critical</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label className="text-slate-700 font-medium flex items-center gap-2">
                            <Filter className="h-4 w-4" />
                            Classification
                        </Label>
                        <Select value={classificationFilter} onValueChange={onClassificationFilterChange}>
                            <SelectTrigger className="mt-2">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="melanoma">Melanoma</SelectItem>
                                <SelectItem value="nevus">Nevus</SelectItem>
                                <SelectItem value="benign_keratosis">Benign Keratosis</SelectItem>
                                <SelectItem value="basal_cell_carcinoma">Basal Cell Carcinoma</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}