import React from 'react';
import { Upload, Download, Info } from 'lucide-react';
import NavLink from './NavLinks';
import { Link } from 'react-router-dom';
import AccountDropdown from './AccountDropdown';
import { Logo } from '../shared/Logo';

const AppHeader: React.FC = () => {
  return (
    <header className="flex-none h-16 z-50 backdrop-blur-md border-b border-white/5 bg-drop-bg/80">
      <div className="h-full px-6 flex items-center justify-between max-w-5xl mx-auto">

        <Logo />

        <div className="flex items-center gap-2">
          <nav className="hidden md:flex gap-4 mr-2">
            <NavLink to="/" icon={Upload} label="SEND" />
            <NavLink to="/download" icon={Download} label="RECEIVE" />
          </nav>

          <div className="hidden md:block pl-4 border-l border-white/10">
            <AccountDropdown />
          </div>

          <Link to="/about" className="md:hidden text-drop-accent hover:text-white">
            <Info className="w-5 h-5" />
          </Link>
        </div>

      </div>
    </header>
  );
};

export default AppHeader;