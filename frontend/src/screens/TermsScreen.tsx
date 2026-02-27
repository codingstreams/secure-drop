import React from 'react';
import { FileWarning } from 'lucide-react';
import { motion } from 'framer-motion';

const TermsScreen: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl h-full max-h-[80vh] flex flex-col"
        >
            <div className="bg-drop-surface rounded-[40px] shadow-neo-flat flex flex-col h-full overflow-hidden">

                <div className="p-8 pb-4 flex-none border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <FileWarning className="w-8 h-8 text-drop-accent" />
                        <div>
                            <h1 className="text-2xl font-bold text-drop-text">Terms</h1>
                            <p className="text-xs text-drop-accent uppercase tracking-widest">MVP v1.0</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 pt-4 no-scrollbar">
                    <div className="space-y-6 text-drop-accent text-sm leading-relaxed">
                        <Section title="1. Service Description">
                            Secure Drop is provided "as is". We make no guarantees regarding uptime or security.
                        </Section>
                        <Section title="2. User Responsibility">
                            You agree not to upload illegal material. You retain full responsibility for content.
                        </Section>
                        <Section title="3. Data Retention">
                            Files are permanently deleted automatically. We are not responsible for data loss.
                        </Section>
                        <Section title="4. Privacy">
                            We do not collect personal data. Connection metadata is ephemeral.
                        </Section>
                        <Section title="5. Usage Limits">
                            Fair use applies. Excessive bandwidth usage may result in temporary IP bans.
                        </Section>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div>
        <h3 className="text-drop-text font-semibold mb-2">{title}</h3>
        <p className="opacity-80">{children}</p>
    </div>
);

export default TermsScreen;