import React from 'react';
import { Ghost, Clock, ShieldOff, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const AboutScreen: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl h-full max-h-[80vh] flex flex-col"
        >
            <div className="bg-drop-surface p-6 md:p-8 rounded-[40px] shadow-neo-flat flex flex-col h-full overflow-hidden">

                <div className="overflow-y-auto no-scrollbar">
                    <div className="text-center mb-8 mt-4">
                        <div className="inline-flex p-4 rounded-full bg-drop-bg shadow-neo-pressed mb-6 text-blue-400">
                            <Ghost className="w-8 h-8" />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-drop-text tracking-wide mb-2">About Secure Drop</h1>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-8">
                        <FeatureCard icon={Clock} title="Ephemeral" desc="Files auto-delete after 24h." />
                        <FeatureCard icon={ShieldOff} title="Anonymous" desc="No logs. No tracking." />
                        <FeatureCard icon={Zap} title="Fast" desc="Direct P2P-style speed." />
                    </div>

                    <div className="bg-drop-bg p-6 rounded-2xl shadow-neo-pressed text-center mb-4">
                        <p className="text-drop-accent text-sm italic">
                            "Built for the moments when you need to move data without friction."
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const FeatureCard = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => (
    <div className="p-4 rounded-2xl border border-white/5 bg-drop-bg/50">
        <Icon className="w-5 h-5 text-blue-400 mb-2" />
        <h3 className="text-drop-text font-bold text-sm">{title}</h3>
        <p className="text-xs text-drop-accent">{desc}</p>
    </div>
);

export default AboutScreen;