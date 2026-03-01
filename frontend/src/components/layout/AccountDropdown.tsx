import { User, ChevronDown, Shield, FilesIcon, Settings, Moon, Sun, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { UserFileServiceImpl } from "../../api/services/user-file/UserFileServiceImpl";

const AccountDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [fileCount, setFileCount] = useState<number | null>(null);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { user, logout } = useAuth();

  const toggleTheme = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.classList.toggle('dark', newIsDark);
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
  };

  /**
   * Effect: Fetch total file count when dropdown opens
   * Uses the PageFileResponseDto structure (totalElements)
   */
  useEffect(() => {
    if (isOpen && user && fileCount === null) {
      UserFileServiceImpl.listAllFiles(0, 1)
        .then(page => setFileCount(Number(page.totalElements)))
        .catch(() => setFileCount(0));
    }
  }, [isOpen, fileCount, user]);

  /**
   * Effect: Handle clicks outside the menu to close it
   */
  useEffect(() => {
    const closeMenu = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', closeMenu);
    return () => document.removeEventListener('mousedown', closeMenu);
  }, []);

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300 border border-transparent ${isOpen
          ? 'shadow-neo-pressed bg-bg-main text-accent-blue'
          : 'shadow-neo-flat text-text-muted hover:text-text-main'
          }`}
      >
        <div className="p-1 rounded-md bg-accent-blue/10">
          <User className="w-3.5 h-3.5 text-accent-blue" />
        </div>
        {/* Show username or placeholder if not loaded */}
        <span className="hidden lg:block text-[10px] font-bold uppercase tracking-widest">
          {user?.username || 'Operator'}
        </span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 p-2 bg-bg-card rounded-2xl shadow-neo-flat border border-border-color z-[100] animate-in fade-in zoom-in-95 duration-200 origin-top-right">

          {/* Vault Status Header */}
          <div className="px-3 py-2.5 mb-2 bg-bg-main/50 rounded-xl border border-border-color flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[8px] font-mono text-text-muted uppercase tracking-wider">Auth_Identity</span>
              <span className="text-[10px] font-bold text-accent-blue truncate max-w-[140px]">
                {user?.email || 'ANONYMOUS_CLIENT'}
              </span>
            </div>
            <Shield className="w-4 h-4 text-emerald-500 opacity-80" />
          </div>

          <div className="space-y-0.5">
            {/* Link to Vault Files */}
            <Link
              to="/files"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-lg text-text-muted hover:text-accent-blue hover:bg-accent-blue/5 transition-all group"
            >
              <div className="flex items-center gap-3">
                <FilesIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold uppercase tracking-wider">Vault Files</span>
              </div>
              {fileCount !== null && (
                <span className="text-[10px] font-mono bg-bg-main px-1.5 py-0.5 rounded border border-border-color text-accent-blue">
                  {fileCount.toString().padStart(2, '0')}
                </span>
              )}
            </Link>

            <Link
              to="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-text-muted hover:text-accent-blue hover:bg-accent-blue/5 transition-all group"
            >
              <Settings className="w-4 h-4 group-hover:rotate-45 transition-transform" />
              <span className="text-xs font-bold uppercase tracking-wider">Protocol Settings</span>
            </Link>

            <div className="my-2 border-t border-border-color opacity-20" />

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-text-muted hover:text-accent-blue hover:bg-accent-blue/5 transition-all group"
            >
              <div className="flex items-center gap-3">
                {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                <span className="text-xs font-bold uppercase tracking-wider">
                  {isDark ? 'Dark Mode' : 'Light Mode'}
                </span>
              </div>

              <div className="w-8 h-4 bg-bg-main rounded-full border border-border-color shadow-neo-pressed relative">
                <div
                  className={`
                    absolute top-0.5 left-0.5 
                    w-2.5 h-2.5 rounded-full 
                    transition-all duration-300
                    ${isDark
                      ? 'translate-x-4 bg-accent-blue shadow-[0_0_8px_rgba(59,130,246,0.6)]'
                      : 'translate-x-0 bg-text-muted'
                    }
                  `}
                />
              </div>
            </button>

            {/* Terminate Session Action */}
            {user && (
              <>
                <div className="my-2 border-t border-border-color opacity-20" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-500/70 hover:text-red-500 hover:bg-red-500/10 transition-all group"
                >
                  <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                  <span className="text-xs font-bold uppercase tracking-wider">Terminate Session</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountDropdown;