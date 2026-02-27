import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import UploadScreen from './screens/UploadScreen';
import DownloadScreen from './screens/DownloadScreen';
import AboutScreen from './screens/AboutScreen';
import TermsScreen from './screens/TermsScreen';
import { Ghost, Upload, Download, Info } from 'lucide-react';

interface NavLinkProps {
  to: string;
  icon: any;
  label: string;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon: Icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  const baseStyles = 'flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 md:px-4 md:py-2 w-full md:w-auto rounded-xl transition-all duration-300';
  const activeStyles = 'text-blue-400 md:bg-drop-surface md:shadow-neo-pressed';
  const inactiveStyles = 'text-drop-accent hover:text-drop-text';
  const linkClassName = `${baseStyles} ${isActive ? activeStyles : inactiveStyles}`;

  const iconClassName = `w-6 h-6 md:w-4 md:h-4 ${isActive ? 'drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : ''}`;

  return (
    <Link to={to} className={linkClassName}>
      <Icon className={iconClassName} />
      <span className="text-[10px] md:text-sm font-medium tracking-wide">{label}</span>
    </Link>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col h-[100dvh] w-full overflow-hidden">

        <header className="flex-none h-16 z-50 backdrop-blur-md border-b border-white/5 bg-drop-bg/80">
          <div className="h-full px-6 flex items-center justify-between max-w-5xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-drop-surface rounded-lg shadow-neo-flat text-blue-400">
                <Ghost className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <h1 className="text-lg md:text-xl font-black tracking-[0.25em] text-drop-text text-glow">
                SECURE<span className="text-drop-accent font-light">DROP</span>
              </h1>
            </div>

            <nav className="hidden md:flex gap-4">
              <NavLink to="/" icon={Upload} label="SEND" />
              <NavLink to="/download" icon={Download} label="RECEIVE" />
            </nav>

            <Link to="/about" className="md:hidden text-drop-accent hover:text-white">
              <Info className="w-5 h-5" />
            </Link>
          </div>
        </header>

        <main className="flex-1 relative overflow-hidden w-full max-w-5xl mx-auto">

          <div className="h-full w-full flex items-center justify-center p-4">
            <Routes>
              <Route path="/" element={<UploadScreen />} />
              <Route path="/download" element={<DownloadScreen />} />
              <Route path="/about" element={<AboutScreen />} />
              <Route path="/terms" element={<TermsScreen />} />
            </Routes>
          </div>
        </main>

        <footer className="hidden md:flex flex-none justify-center items-center gap-6 py-4 text-drop-accent text-xs tracking-wider opacity-60 font-mono mb-2">
          <Link to="/about" className="hover:text-blue-400">ABOUT</Link>
          <span>//</span>
          <Link to="/terms" className="hover:text-blue-400">TERMS</Link>
          <span>//</span>
          <p>v1.0.0 MVP</p>
        </footer>

        <nav className="md:hidden flex-none h-20 bg-ghost-bg/90 backdrop-blur-lg border-t border-white/5 pb-safe px-6 flex justify-around items-center z-50">
          <NavLink to="/" icon={Upload} label="SEND" />
          <NavLink to="/download" icon={Download} label="RECEIVE" />
        </nav>

      </div>
    </Router>
  );
}

export default App;