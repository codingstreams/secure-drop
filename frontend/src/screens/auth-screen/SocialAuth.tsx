import React from 'react';
import { Github, Chrome, Fingerprint } from 'lucide-react';

export const SocialAuth: React.FC = () => (
  <div className="mt-8 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-150">
    <div className="relative mb-6">
      <div className="relative flex justify-center text-[8px] font-mono uppercase tracking-widest">
        <span className="bg-bg-card px-3 text-text-muted">Alternative_Methods</span>
      </div>
    </div>

    <div className="grid grid-cols-3 gap-3">
      {[
        { Icon: Chrome, label: 'Google' },
        { Icon: Github, label: 'GitHub' },
        { Icon: Fingerprint, label: 'Passkey' }
      ].map(({ Icon, label }) => (
        <button
          key={label}
          title={label}
          className="p-3 bg-bg-main rounded-xl border border-border-color shadow-neo-flat hover:shadow-neo-pressed flex justify-center text-text-muted hover:text-accent-blue transition-all group"
        >
          <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>
      ))}
    </div>
  </div>
);