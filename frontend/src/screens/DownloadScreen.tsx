import React, { useState, useEffect } from 'react';
import { ShieldCheck, Download, Loader2, Globe, Lock } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import axios from 'axios';
import { PublicFileServiceImpl } from '../api/services/public-file/PublicFileServiceImpl';
import { useAuth } from '../context/AuthContext';

const DownloadScreen: React.FC = () => {
    const { isAuthenticated } = useAuth();

    // Logic: Default to private if logged in, otherwise public
    const [isPrivate, setIsPrivate] = useState(false);
    const [accessCode, setAccessCode] = useState('');
    const [loading, setLoading] = useState(false);

    // Sync mode with auth state
    useEffect(() => {
        setIsPrivate(isAuthenticated);
    }, [isAuthenticated]);

    const handleDownload = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            toast.loading("Initiating decryption...");

            // 1. Fetch the file blob using the service
            const blob = await PublicFileServiceImpl.downloadFile(accessCode);

            // 2. Trigger browser download
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;

            // We use the access code as a fallback name if headers don't provide one
            link.setAttribute('download', `SECURE-FILE-${accessCode}.bin`);
            document.body.appendChild(link);
            link.click();

            // 3. Cleanup
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.dismiss();
            toast.success("Download started!");
        } catch (error) {
            toast.dismiss();
            console.error("Download failed", error);

            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 404) {
                    toast.error("File expired or does not exist.");
                } else if (error.response.status === 401) {
                    toast.error("Unauthorized: This file requires a vault session.");
                } else if (error.response.status === 400) {
                    toast.error("Invalid access code.");
                } else {
                    toast.error("Server protocol error.");
                }
            } else {
                toast.error("Connection failed.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md animate-in fade-in y-translate-4 duration-500">
            <Toaster position="bottom-center" toastOptions={{
                style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' }
            }} />

            {/* Mode Selector Toggle (Only show if authenticated) */}
            {isAuthenticated && (
                <div className="flex p-1 bg-drop-bg rounded-2xl mb-4 shadow-neo-pressed border border-white/5">
                    <button
                        onClick={() => setIsPrivate(false)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${!isPrivate ? 'bg-drop-surface text-blue-400 shadow-neo-flat' : 'text-drop-accent'
                            }`}
                    >
                        <Globe className="w-3 h-3" /> Public_Pool
                    </button>
                    <button
                        onClick={() => setIsPrivate(true)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${isPrivate ? 'bg-drop-surface text-emerald-400 shadow-neo-flat' : 'text-drop-accent'
                            }`}
                    >
                        <Lock className="w-3 h-3" /> Private_Vault
                    </button>
                </div>
            )}

            <div className="bg-drop-surface p-10 rounded-[40px] shadow-neo-flat text-center border border-white/5 relative overflow-hidden">

                {/* Visual Identity Strip */}
                <div className={`absolute top-0 left-0 w-full h-1 ${isPrivate ? 'bg-emerald-500' : 'bg-blue-500'} opacity-20`} />

                <div className={`w-16 h-16 bg-drop-bg rounded-2xl shadow-neo-pressed mx-auto mb-6 flex items-center justify-center transition-colors duration-500 ${isPrivate ? 'text-emerald-500' : 'text-blue-500'
                    }`}>
                    {isPrivate ? <Lock className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />}
                </div>

                <h2 className="text-2xl font-bold text-drop-text mb-2">Secure Retrieval</h2>
                <p className="text-drop-accent text-sm mb-8 font-mono">Enter the 6-character access code</p>

                <form onSubmit={handleDownload}>
                    <div className="relative mb-8 group">
                        <input
                            type="text"
                            maxLength={7}
                            value={accessCode}
                            onChange={(e) => {
                                let val = e.target.value.toUpperCase();
                                // Auto-format XXX-000
                                if (val.length === 3 && accessCode.length === 2) val += '-';
                                setAccessCode(val);
                            }}
                            placeholder="XXX-000"
                            className={`w-full bg-drop-bg text-center text-2xl md:text-3xl font-mono font-bold tracking-[0.3em] py-6 rounded-2xl outline-none shadow-neo-pressed border border-transparent transition-all placeholder:text-drop-surface uppercase ${isPrivate ? 'text-emerald-400 focus:border-emerald-500/20' : 'text-blue-400 focus:border-blue-500/20'
                                }`}
                        />
                        <div className={`absolute inset-0 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none shadow-[0_0_30px_rgba(59,130,246,0.1)] ${isPrivate ? 'shadow-emerald-500/10' : 'shadow-blue-500/10'
                            }`} />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || accessCode.length < 7}
                        className={`w-full py-4 rounded-xl font-bold tracking-widest flex items-center justify-center gap-2 transition-all duration-200
            ${loading || accessCode.length < 7
                                ? 'bg-drop-bg text-drop-accent shadow-neo-pressed cursor-not-allowed opacity-50'
                                : isPrivate
                                    ? 'bg-drop-surface text-emerald-400 shadow-neo-flat hover:text-emerald-300 active:shadow-neo-pressed active:scale-[0.98]'
                                    : 'bg-drop-surface text-blue-400 shadow-neo-flat hover:text-blue-300 active:shadow-neo-pressed active:scale-[0.98]'
                            }`}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                DECRYPTING...
                            </>
                        ) : (
                            <>
                                INITIATE DOWNLOAD
                                <Download className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* Footer System Status */}
            <div className="mt-6 text-center">
                <p className="text-[10px] font-mono text-drop-accent uppercase tracking-[0.2em] opacity-50">
                    Mode: {isPrivate ? 'AUTH_ENCRYPTED_SESSION' : 'ANONYMOUS_GATEWAY'}
                </p>
            </div>
        </div>
    );
};

export default DownloadScreen;