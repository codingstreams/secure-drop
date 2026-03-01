import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'react-qr-code';
import { UploadCloud, Copy, Loader2, LockIcon, ShieldCheckIcon, GlobeIcon } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { PublicFileServiceImpl } from '../api/services/public-file/PublicFileServiceImpl';
import { UserFileServiceImpl } from '../api/services/user-file/UserFileServiceImpl';
import { useAuth } from '../context/AuthContext';

// Types
interface UploadResult {
    downloadLink: string;
    accessCode: string;
}

const UploadScreen: React.FC = () => {
    const { isAuthenticated } = useAuth();

    // State management
    const [isPrivate, setIsPrivate] = useState(isAuthenticated);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [result, setResult] = useState<UploadResult | null>(null);

    // Sync mode with auth state on mount
    useEffect(() => {
        setIsPrivate(isAuthenticated);
    }, [isAuthenticated]);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setUploading(true);
        setProgress(0);

        try {
            let data;

            if (isPrivate && isAuthenticated) {
                // Mode: Private Vault (Requires Auth)
                // Defaulting to 10 downloads / 24 hours for the UI
                data = await UserFileServiceImpl.uploadToVault(file, 10, 24);
                toast.success("Locked in your private vault.");
            } else {
                // Mode: Public Pool (Anonymous)
                data = await PublicFileServiceImpl.uploadAnonymous(file, 24, (percent) => {
                    setProgress(percent);
                });
                toast.success("Secured in the public pool.");
            }

            setResult({
                downloadLink: data.shareUrl,
                accessCode: data.accessCode
            });
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.status === 401
                ? "Session expired. Please login again."
                : "Upload failed. Verify connection.";
            toast.error(msg);
        } finally {
            setUploading(false);
        }
    }, [isPrivate, isAuthenticated]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxFiles: 1,
        disabled: uploading || !!result,
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
        >
            <Toaster position="bottom-center" toastOptions={{
                style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' }
            }} />

            {/* Mode Selector Toggle (Only show if authenticated) */}
            {isAuthenticated && !result && (
                <div className="flex p-1 bg-drop-bg rounded-2xl mb-4 shadow-neo-pressed border border-white/5">
                    <button
                        onClick={() => setIsPrivate(false)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${!isPrivate ? 'bg-drop-surface text-blue-400 shadow-neo-flat' : 'text-drop-accent'
                            }`}
                    >
                        <GlobeIcon className="w-3 h-3" /> Public_Pool
                    </button>
                    <button
                        onClick={() => setIsPrivate(true)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${isPrivate ? 'bg-drop-surface text-emerald-400 shadow-neo-flat' : 'text-drop-accent'
                            }`}
                    >
                        <LockIcon className="w-3 h-3" /> Private_Vault
                    </button>
                </div>
            )}

            <div className="bg-drop-surface p-8 rounded-[40px] shadow-neo-flat relative overflow-hidden border border-white/5">

                {/* Visual Indicator of Mode */}
                <div className={`absolute top-0 left-0 w-full h-1 ${isPrivate ? 'bg-emerald-500' : 'bg-blue-500'} opacity-20`} />

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-drop-text tracking-wide flex items-center justify-center gap-2">
                        {result ? "Transfer Complete" : isPrivate ? "Vault Upload" : "Public Upload"}
                        {isPrivate && !result && <ShieldCheckIcon className="w-5 h-5 text-emerald-500" />}
                    </h2>
                    <p className="text-drop-accent text-sm mt-1 font-mono">
                        {result ? "Scan or share the code below" : isPrivate ? "Encrypted & Restricted" : "Temporary Ghost Link"}
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {!result ? (
                        <motion.div key="upload" exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}>
                            <div
                                {...getRootProps()}
                                className={`relative group aspect-square rounded-[30px] flex flex-col items-center justify-center cursor-pointer transition-all duration-300
                  ${isDragActive ? 'shadow-neo-pressed border-blue-500/30' : 'shadow-neo-flat active:scale-95'} 
                  ${isPrivate ? 'hover:border-emerald-500/20' : 'hover:border-blue-500/20'}
                  touch-manipulation`}
                            >
                                <input {...getInputProps()} />

                                {uploading ? (
                                    <div className="w-full px-8 text-center">
                                        <Loader2 className={`w-12 h-12 ${isPrivate ? 'text-emerald-400' : 'text-blue-400'} animate-spin mx-auto mb-4`} />
                                        <div className="h-2 w-full bg-drop-bg rounded-full overflow-hidden shadow-neo-pressed">
                                            <motion.div
                                                className={`h-full ${isPrivate ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-blue-500 shadow-[0_0_10px_#3b82f6]'}`}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress}%` }}
                                            />
                                        </div>
                                        <p className={`mt-4 text-xs font-mono ${isPrivate ? 'text-emerald-400' : 'text-blue-400'}`}>
                                            {progress}% {isPrivate ? 'VAULT_ENCRYPTING' : 'UPLOADING'}
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <div className={`p-4 rounded-full mb-4 transition-all duration-300 ${isDragActive
                                            ? 'bg-drop-bg text-blue-400 shadow-neo-pressed'
                                            : isPrivate ? 'text-emerald-500/50 group-hover:text-emerald-400' : 'text-drop-accent group-hover:text-blue-400'
                                            }`}>
                                            <UploadCloud className="w-8 h-8" />
                                        </div>
                                        <p className="text-drop-accent font-medium group-hover:text-drop-text transition-colors text-center px-4">
                                            {isDragActive ? 'Drop to Secure' : 'Drag file or Tap to Browse'}
                                        </p>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        // Result View (QR + Access Code) remains same but colors can be dynamic
                        <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center">
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
                                        <span className={`text-3xl font-mono font-bold ${isPrivate ? 'text-emerald-400' : 'text-blue-400'} tracking-[0.15em] group-hover:brightness-110 transition-all`}>
                                            {result.accessCode}
                                        </span>
                                    </div>
                                    <Copy className="w-5 h-5 text-drop-accent group-hover:text-drop-text transition-colors" />
                                </div>
                            </div>

                            <button onClick={() => setResult(null)} className="text-sm text-drop-accent hover:text-drop-text transition-colors uppercase tracking-widest font-mono text-[10px]">
                                Reset_Terminal
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default UploadScreen;