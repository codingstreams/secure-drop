import { Ghost } from 'lucide-react';

export const Logo = () => (
  <a href='/'>
    <div className="flex items-center gap-3">
      <div className="p-2 bg-drop-surface rounded-lg shadow-neo-flat text-blue-400">
        <Ghost className="w-5 h-5 md:w-6 md:h-6" />
      </div>
      <h1 className="text-lg md:text-xl font-black tracking-[0.25em] text-drop-text text-glow">
        SECURE<span className="text-drop-accent font-light">DROP</span>
      </h1>
    </div>
  </a>
);