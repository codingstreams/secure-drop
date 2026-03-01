import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: LucideIcon;
}

export const AuthInput: React.FC<AuthInputProps> = ({ label, icon: Icon, ...props }) => (
  <div className="w-full">
    <label className="block text-[9px] font-mono text-text-muted uppercase tracking-widest mb-1.5 ml-1">
      {label}
    </label>
    <div className="relative group">
      <input
        {...props}
        className="w-full bg-bg-main border border-border-color rounded-xl py-3 pl-11 pr-4 text-sm text-text-main focus:outline-none focus:ring-1 focus:ring-accent-blue/40 shadow-neo-pressed transition-all"
      />
      <Icon className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent-blue transition-colors" />
    </div>
  </div>
);