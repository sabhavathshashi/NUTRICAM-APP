import { useRef, useState, useEffect } from 'react';
import './Camera.css';

interface CameraProps {
    onCapture: (imageFile: File) => void;
    isProcessing?: boolean;
}

const Camera = ({ onCapture, isProcessing = false }: CameraProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [error, setError] = useState<string>('');
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

    const startCamera = async () => {
        try {
            setError('');
            // Try with ideal constraints first
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: facingMode,
                        width: { ideal: 1920 },
                        height: { ideal: 1080 },
                    },
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                    setStream(mediaStream);
                    setIsCameraActive(true);
                }
            } catch (err) {
                console.warn('High-res camera failed, trying basic config...', err);
                // Fallback to basic constraints
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                    setStream(mediaStream);
                    setIsCameraActive(true);
                }
            }
        } catch (err: any) {
            console.error('Error accessing camera:', err);
            let errorMessage = 'Unable to access camera.';

            if (err.name === 'NotAllowedError') {
                errorMessage = 'Camera permission denied. Please allow access in your browser settings.';
            } else if (err.name === 'NotFoundError') {
                errorMessage = 'No camera found on this device.';
            } else if (err.name === 'NotReadableError') {
                errorMessage = 'Camera is in use by another application.';
            }

            setError(errorMessage);
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
            setIsCameraActive(false);
        }
    };

    const captureImage = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!context) return;

        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas to blob
        canvas.toBlob((blob) => {
            if (blob) {
                const file = new File([blob], `food-${Date.now()}.jpg`, {
                    type: 'image/jpeg',
                });
                onCapture(file);
            }
        }, 'image/jpeg', 0.95);
    };

    const switchCamera = () => {
        stopCamera();
        setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    };

    useEffect(() => {
        if (facingMode && !isCameraActive) {
            startCamera();
        }
    }, [facingMode]);

    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);

    return (
        <div className="camera-container">
            <div className="camera-wrapper glass-card">
                {error && (
                    <div className="camera-error">
                        <p>{error}</p>
                        <button className="btn btn-primary btn-sm" onClick={startCamera}>
                            Retry
                        </button>
                    </div>
                )}

                <div className="video-container">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="camera-video"
                    />
                    <canvas ref={canvasRef} style={{ display: 'none' }} />

                    {!isCameraActive && !error && (
                        <div className="camera-placeholder">
                            <div className="camera-icon">📷</div>
                            <p>Camera is loading...</p>
                        </div>
                    )}
                </div>

                <div className="camera-controls">
                    <button
                        className="btn btn-secondary"
                        onClick={switchCamera}
                        disabled={!isCameraActive || isProcessing}
                        title="Switch Camera"
                    >
                        🔄
                    </button>

                    <button
                        className="btn btn-primary btn-lg capture-btn"
                        onClick={captureImage}
                        disabled={!isCameraActive || isProcessing}
                    >
                        {isProcessing ? (
                            <>
                                <span className="spinner"></span>
                                Processing...
                            </>
                        ) : (
                            <>
                                📸 Capture & Analyze
                            </>
                        )}
                    </button>

                    <button
                        className="btn btn-secondary"
                        onClick={isCameraActive ? stopCamera : startCamera}
                        disabled={isProcessing}
                        title={isCameraActive ? 'Stop Camera' : 'Start Camera'}
                    >
                        {isCameraActive ? '⏸️' : '▶️'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Camera;
