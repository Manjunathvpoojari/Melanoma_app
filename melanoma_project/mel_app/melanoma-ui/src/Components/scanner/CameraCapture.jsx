import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Camera, RefreshCw, X, Aperture } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CameraCapture({ onCapture, onClose }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [facingMode, setFacingMode] = useState('environment');
    const [error, setError] = useState(null);

    const startCamera = useCallback(async () => {
        try {
            setError(null);
            
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { 
                    facingMode: facingMode,
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });
            
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                setStream(mediaStream);
                setIsCameraReady(true);
            }
        } catch (err) {
            console.error('Camera error:', err);
            setError('Unable to access camera. Please check permissions.');
        }
    }, [facingMode]);

    useEffect(() => {
        startCamera();
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [startCamera]);

    const switchCamera = async () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        setIsCameraReady(false);
        setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
    };

    const captureImage = () => {
        if (!videoRef.current || !canvasRef.current) return;
        
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);
        
        canvas.toBlob((blob) => {
            if (blob) {
                const file = new File([blob], 'skin-capture.jpg', { type: 'image/jpeg' });
                onCapture(file);
            }
        }, 'image/jpeg', 0.95);
    };

    const handleClose = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        onClose();
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex flex-col"
        >
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleClose}
                    className="text-white hover:bg-white/20"
                >
                    <X className="h-6 w-6" />
                </Button>
                <span className="text-white font-medium">Skin Scanner</span>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={switchCamera}
                    className="text-white hover:bg-white/20"
                >
                    <RefreshCw className="h-5 w-5" />
                </Button>
            </div>

            {/* Camera View */}
            <div className="flex-1 relative flex items-center justify-center overflow-hidden">
                {error ? (
                    <div className="text-white text-center p-8">
                        <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p>{error}</p>
                        <Button onClick={startCamera} className="mt-4">
                            Retry
                        </Button>
                    </div>
                ) : (
                    <>
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                        />
                        
                        {/* Scanning Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <motion.div 
                                className="w-64 h-64 md:w-80 md:h-80 border-2 border-teal-400 rounded-3xl"
                                animate={{ 
                                    boxShadow: ['0 0 0 0 rgba(45, 212, 191, 0.4)', '0 0 0 20px rgba(45, 212, 191, 0)', '0 0 0 0 rgba(45, 212, 191, 0.4)']
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            <motion.div 
                                className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent"
                                animate={{ y: [-120, 120] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            />
                        </div>
                        
                        <p className="absolute top-24 left-0 right-0 text-center text-white/80 text-sm">
                            Position the skin lesion within the frame
                        </p>
                    </>
                )}
            </div>

            {/* Capture Button */}
            <div className="absolute bottom-0 left-0 right-0 p-8 flex justify-center bg-gradient-to-t from-black/60 to-transparent">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={captureImage}
                    disabled={!isCameraReady}
                    className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg disabled:opacity-50"
                >
                    <Aperture className="h-10 w-10 text-teal-600" />
                </motion.button>
            </div>

            <canvas ref={canvasRef} className="hidden" />
        </motion.div>
    );
}