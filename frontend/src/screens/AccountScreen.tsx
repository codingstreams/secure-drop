import React from 'react';
import { User, Shield, Key, LogOut } from 'lucide-react';

const AccountScreen: React.FC = () => {
  return (
    <div className="w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-black tracking-tighter text-glow uppercase">
          Identity<span className="text-ghost-primary">_Vault</span>
        </h2>
        <p className="text-ghost-accent text-xs font-mono uppercase tracking-widest">Security Level: Alpha</p>
      </div>

      <div className="grid gap-6">
        {/* Profile Card */}
        <div className="p-6 bg-ghost-surface rounded-2xl shadow-neo-flat border border-white/5 flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-ghost-bg border-2 border-ghost-primary/30 flex items-center justify-center shadow-neo-pressed">
            <User className="w-10 h-10 text-ghost-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-ghost-text">User_7742</h3>
            <p className="text-sm text-ghost-accent font-mono">Status: <span className="text-emerald-500">Encrypted & Active</span></p>
          </div>
        </div>

        {/* Settings Groups */}
        <div className="grid md:grid-cols-2 gap-4">
          <button className="p-4 bg-ghost-surface rounded-xl shadow-neo-flat hover:shadow-neo-pressed border border-white/5 flex items-center gap-4 transition-all group">
            <Shield className="w-5 h-5 text-ghost-primary group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <p className="text-sm font-bold uppercase tracking-tight">Security</p>
              <p className="text-[10px] text-ghost-accent uppercase">2FA & Encryption</p>
            </div>
          </button>

          <button className="p-4 bg-ghost-surface rounded-xl shadow-neo-flat hover:shadow-neo-pressed border border-white/5 flex items-center gap-4 transition-all group">
            <Key className="w-5 h-5 text-ghost-primary group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <p className="text-sm font-bold uppercase tracking-tight">API Keys</p>
              <p className="text-[10px] text-ghost-accent uppercase">Manage Tokens</p>
            </div>
          </button>
        </div>

        {/* Logout */}
        <button className="mt-4 p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 font-bold uppercase tracking-widest text-xs hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2 shadow-neo-flat">
          <LogOut className="w-4 h-4" />
          Terminate Session
        </button>
      </div>
    </div>
  );
};

export default AccountScreen;