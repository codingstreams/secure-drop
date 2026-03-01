import React from 'react';
import { Link, useLocation } from 'react-router-dom';

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
  const linkClassName = `${baseStyles} ${isActive ? activeStyles :
    inactiveStyles}`;

  const iconClassName = `w-6 h-6 md:w-4 md:h-4 ${isActive ?
    'drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : ''}`;

  return (
    <Link to={to} className={linkClassName}>
      <Icon className={iconClassName} />
      <span className="text-[10px] md:text-sm font-medium 
tracking-wide">{label}</span>
    </Link>
  );
};

export default NavLink;