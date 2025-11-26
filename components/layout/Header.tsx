import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

interface HeaderProps {
    toggleSidebar: () => void;
    isCollapsed: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, isCollapsed }) => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isProfileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const SunIcon = () => <svg className="w-5 h-5 mr-3 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
  const MoonIcon = () => <svg className="w-5 h-5 mr-3 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>;

  return (
    <header className="sticky top-0 z-10 flex-shrink-0 flex items-center justify-between h-16 px-4 md:px-6 bg-ui-card/80 dark:bg-ui-card/60 backdrop-blur-sm border-b border-ui-border">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="text-text-secondary focus:outline-none md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        </button>
        <div className={`relative ${isCollapsed ? 'ml-0' : 'ml-4'} lg:ml-0`}>
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="w-5 h-5 text-text-muted" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </span>
          <input
            className="w-32 sm:w-64 pl-10 pr-4 py-2 rounded-md bg-ui-background text-text-primary border border-ui-border focus:bg-ui-card focus:border-primary-500 focus:ring-1 focus:ring-primary-500 placeholder-text-muted transition-colors"
            type="text"
            placeholder="Search..."
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button className="relative text-text-secondary hover:text-primary-500 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute -top-1 -right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-ui-card"></span>
        </button>
        
        <div className="relative" ref={profileRef}>
            <button onClick={() => setProfileOpen(!isProfileOpen)} className="flex items-center space-x-3 focus:outline-none">
                <div className="w-9 h-9 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-base">
                    {user?.name.charAt(0)}
                </div>
                <div className="text-left hidden sm:block">
                    <p className="font-semibold text-text-primary text-sm">{user?.name}</p>
                    <p className="text-xs text-text-secondary">{user?.role}</p>
                </div>
            </button>
            {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-ui-card rounded-lg shadow-xl border border-ui-border z-50">
                    <div className="p-3 border-b border-ui-border">
                        <p className="font-semibold text-text-primary text-sm">{user?.name}</p>
                        <p className="text-xs text-text-secondary">{user?.email}</p>
                    </div>
                    <div className="py-1">
                        <button 
                            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                            className="w-full text-left flex items-center px-3 py-2 text-sm text-text-secondary hover:bg-ui-background"
                        >
                            {theme === 'light' ? <MoonIcon/> : <SunIcon />}
                            Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
                        </button>
                    </div>
                    <div className="py-1 border-t border-ui-border">
                        <button onClick={logout} className="w-full text-left flex items-center px-3 py-2 text-sm text-text-secondary hover:bg-red-500/10 hover:text-red-500">
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </header>
  );
};

export default Header;