import React, { useState } from 'react';
import { Download, ShieldCheck } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { downloadFile } from '../services/api';

const DownloadScreen: React.FC = () => {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

    const handleDownload = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            toast.loading("Downloading...");

            await downloadFile(code);

            toast.dismiss();
            toast.success("Download started!");

        } catch (error) {
            toast.dismiss();
            console.error("Download failed", error);

            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 404) {
                    toast.error("File expired or does not exist.");
                } else if (error.response.status === 400) {
                    toast.error("Invalid access code.");
                } else {
                    toast.error("Server error.");
                }
            } else {
                toast.error("Connection failed.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md">
            <Toaster position="bottom-center" toastOptions={{
                style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' }
            }} />

            <div className="bg-drop-surface p-10 rounded-[40px] shadow-neo-flat text-center">

                <div className="w-16 h-16 bg-drop-bg rounded-2xl shadow-neo-pressed mx-auto mb-6 flex items-center justify-center text-blue-500">
                    <ShieldCheck className="w-8 h-8" />
                </div>

                <h2 className="text-2xl font-bold text-drop-text mb-2">Secure Retrieval</h2>
                <p className="text-drop-accent text-sm mb-8 font-mono">Enter the 6-character access code</p>

                <form onSubmit={handleDownload}>
                    <div className="relative mb-8 group">
                        <input
                            type="text"
                            maxLength={7}
                            value={code}
                            onChange={(e) => {
                                let val = e.target.value.toUpperCase();
                                if (val.length === 3 && code.length === 2) val += '-';
                                setCode(val);
                            }}
                            placeholder="XXX-000"
                            className="w-full bg-drop-bg text-center text-2xl md:text-3xl font-mono font-bold tracking-[0.3em] text-blue-400 py-6 rounded-2xl outline-none shadow-neo-pressed border border-transparent focus:border-blue-500/20 transition-all placeholder:text-drop-surface uppercase"
                        />
                        <div className="absolute inset-0 rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.1)] opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || code.length < 7}
                        className={`w-full py-4 rounded-xl font-bold tracking-widest flex items-center justify-center gap-2 transition-all duration-200
                        ${loading || code.length < 7
                                ? 'bg-drop-bg text-drop-accent shadow-neo-pressed cursor-not-allowed opacity-50'
                                : 'bg-drop-surface text-blue-400 shadow-neo-flat hover:shadow-none active:shadow-neo-pressed active:scale-[0.98]'
                            }`}
                    >
                        {loading ? 'DECRYPTING...' : 'INITIATE DOWNLOAD'}
                        {!loading && <Download className="w-4 h-4" />}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default DownloadScreen;