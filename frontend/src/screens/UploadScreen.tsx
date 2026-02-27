import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'react-qr-code';
import { UploadCloud, Copy, FileText, Loader2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { uploadFile } from '../services/api';

// Types
interface UploadResult {
    downloadLink: string;
    accessCode: string;
}

const UploadScreen: React.FC = () => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0); // For progress bar
    const [result, setResult] = useState<UploadResult | null>(null);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setUploading(true);
        setProgress(0);

        try {
            const data = await uploadFile(file, (percent) => {
                setProgress(percent);
            });

            setResult({
                downloadLink: data.downloadUrl,
                accessCode: data.accessCode
            });
            toast.success("Secured in the vault.");

        } catch (error) {
            console.error(error);
            toast.error("Upload failed. Is backend running?");
        } finally {
            setUploading(false);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
        onDrop, maxFiles: 1, disabled: uploading || !!result
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
        >
            <Toaster position="bottom-center" toastOptions={{
                style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' }
            }} />

            <div className="bg-drop-surface p-8 rounded-[40px] shadow-neo-flat relative overflow-hidden">

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-drop-text tracking-wide">
                        {result ? "Transfer Complete" : "Upload File"}
                    </h2>
                    <p className="text-drop-accent text-sm mt-1 font-mono">
                        {result ? "Scan or share the code below" : "Max file size: 50MB"}
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {!result ? (
                        <motion.div key="upload" exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}>

                            <div
                                {...getRootProps()}
                                className={`relative group aspect-square rounded-[30px] flex flex-col items-center justify-center cursor-pointer transition-all duration-300
    ${isDragActive ? 'shadow-neo-pressed border-blue-500/30' : 'shadow-neo-flat active:scale-95'} 
    touch-manipulation`}
                            >
                                <input {...getInputProps()} />

                                <div className="absolute inset-0 bg-blue-500/5 rounded-[30px] opacity-0 group-hover:opacity-100 transition-opacity" />

                                {uploading ? (
                                    <div className="w-full px-8 text-center">
                                        <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
                                        <div className="h-2 w-full bg-drop-bg rounded-full overflow-hidden shadow-neo-pressed">
                                            <motion.div
                                                className="h-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress}%` }}
                                            />
                                        </div>
                                        <p className="mt-4 text-xs font-mono text-blue-400">{progress}% ENCRYPTING</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className={`p-4 rounded-full mb-4 transition-all duration-300 ${isDragActive ? 'bg-drop-bg text-blue-400 shadow-neo-pressed' : 'text-drop-accent'}`}>
                                            <UploadCloud className="w-8 h-8" />
                                        </div>
                                        {acceptedFiles.length > 0 ? (
                                            <div className="flex items-center gap-2 text-blue-300 bg-drop-bg px-4 py-2 rounded-lg shadow-neo-pressed">
                                                <FileText className="w-4 h-4" />
                                                <span className="text-sm truncate max-w-[120px]">{acceptedFiles[0].name}</span>
                                            </div>
                                        ) : (
                                            <p className="text-drop-accent font-medium group-hover:text-drop-text transition-colors text-center px-4">
                                                <span className="hidden md:inline">Drop file here</span>
                                                <span className="md:hidden">Tap to select file</span>
                                            </p>
                                        )}
                                    </>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center"
                        >
                            <div className="p-3 bg-white rounded-2xl shadow-neo-flat mb-8 rotate-1 hover:rotate-0 transition-transform duration-300">
                                <QRCode value={result.downloadLink} size={150} />
                            </div>

                            <div className="w-full bg-drop-bg p-1 rounded-2xl shadow-neo-pressed mb-6">
                                <div
                                    onClick={() => { navigator.clipboard.writeText(result.accessCode); toast.success("Copied!"); }}
                                    className="flex items-center justify-between p-4 cursor-pointer group"
                                >
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-drop-accent tracking-widest uppercase mb-1">Access Code</span>
                                        <span className="text-3xl font-mono font-bold text-blue-400 tracking-[0.15em] group-hover:text-blue-300 transition-colors">
                                            {result.accessCode}
                                        </span>
                                    </div>
                                    <Copy className="w-5 h-5 text-drop-accent group-hover:text-blue-400 transition-colors" />
                                </div>
                            </div>

                            <button
                                onClick={() => setResult(null)}
                                className="text-sm text-drop-accent hover:text-drop-text transition-colors"
                            >
                                Start New Upload
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default UploadScreen;