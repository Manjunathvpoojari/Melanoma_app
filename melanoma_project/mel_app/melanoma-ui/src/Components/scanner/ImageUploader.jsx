import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon, X, Camera } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ImageUploader({ onImageSelect, onOpenCamera }) {
    const inputRef = useRef(null);
    const [preview, setPreview] = useState(null);
    const [dragOver, setDragOver] = useState(false);

    const handleFileSelect = (file) => {
        if (!file || !file.type.startsWith('image/')) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreview(e.target.result);
        };
        reader.readAsDataURL(file);
        onImageSelect(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        handleFileSelect(file);
    };

    const handleInputChange = (e) => {
        const file = e.target.files[0];
        handleFileSelect(file);
    };

    const clearPreview = () => {
        setPreview(null);
        onImageSelect(null);
        if (inputRef.current) inputRef.current.value = '';
    };

    return (
        <div className="space-y-4">
            {!preview ? (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`
                        border-2 border-dashed rounded-2xl p-8 md:p-12 text-center transition-all duration-300
                        ${dragOver 
                            ? 'border-teal-400 bg-teal-50/50' 
                            : 'border-slate-200 hover:border-teal-300 hover:bg-slate-50/50'
                        }
                    `}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleInputChange}
                        className="hidden"
                    />
                    
                    <div className="space-y-4">
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center">
                            <Upload className="h-8 w-8 text-teal-600" />
                        </div>
                        
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800">
                                Upload skin image
                            </h3>
                            <p className="text-slate-500 text-sm mt-1">
                                Drag & drop or click to browse
                            </p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                            <Button
                                onClick={() => inputRef.current?.click()}
                                className="bg-slate-800 hover:bg-slate-900 text-white rounded-xl px-6"
                            >
                                <ImageIcon className="h-4 w-4 mr-2" />
                                Browse Files
                            </Button>
                            <Button
                                variant="outline"
                                onClick={onOpenCamera}
                                className="rounded-xl px-6 border-teal-200 text-teal-700 hover:bg-teal-50"
                            >
                                <Camera className="h-4 w-4 mr-2" />
                                Live Camera
                            </Button>
                        </div>
                        
                        <p className="text-xs text-slate-400 pt-2">
                            Supported: JPG, PNG, WEBP • Max 10MB
                        </p>
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative rounded-2xl overflow-hidden bg-slate-100"
                >
                    <img 
                        src={preview} 
                        alt="Preview" 
                        className="w-full h-64 md:h-80 object-cover"
                    />
                    <Button
                        size="icon"
                        variant="secondary"
                        onClick={clearPreview}
                        className="absolute top-3 right-3 rounded-full bg-white/90 hover:bg-white shadow-lg"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                        <p className="text-white text-sm font-medium">Image ready for analysis</p>
                    </div>
                </motion.div>
            )}
        </div>
    );
}