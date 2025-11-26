import React, { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { USERS } from '../services/mockData';
import { Department } from '../types';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

const UserIcon = () => (
    <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
);

const LogoIcon = () => (
    <svg className="w-10 h-10 text-primary-600 dark:text-primary-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w.org/2000/svg">
        <path d="M9 3L5 9.33333V21H19V9.33333L15 3H9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5 12H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 16C13.1046 16 14 15.1046 14 14C14 12.8954 13.1046 12 12 12C10.8954 12 10 12.8954 10 14C10 15.1046 10.8954 16 12 16Z" fill="currentColor" />
    </svg>
);


const Login: React.FC = () => {
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState<'Prod' | 'QA' | 'QC' | 'SCM' | 'Admin' | 'Corporate'>('Prod');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    const userToLogin = USERS.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (userToLogin && password === 'demo123') {
      login(userToLogin.id);
    } else {
      setError('Invalid email or password.');
    }
  };

  const handleQuickAccessClick = (userEmail: string) => {
    setEmail(userEmail);
    setPassword('demo123');
    setError('');
  };

  const filteredUsers = useMemo(() => {
    switch (activeTab) {
      case 'Prod':
        return USERS.filter(u => u.department === Department.Production);
      case 'QA':
        return USERS.filter(u => u.department === Department.QA);
      case 'QC':
        return USERS.filter(u => u.department === Department.QC);
      case 'SCM':
        return USERS.filter(u => u.department === Department.SCM);
      case 'Admin':
        return USERS.filter(u => u.department === Department.Admin);
      case 'Corporate':
        return USERS.filter(u => u.department === Department.Corporate);
      default:
        return [];
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-ui-background flex flex-col items-center justify-center p-4">
      <header className="text-center mb-10 flex items-center justify-center space-x-4">
        <LogoIcon />
        <div>
            <h1 className="text-4xl font-bold text-text-primary tracking-tight">Achieve Pharma ERP</h1>
            <p className="text-lg text-text-secondary mt-1">Pharmaceutical Manufacturing ERP System</p>
        </div>
      </header>

      <main className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-8">
          <h2 className="text-2xl font-bold text-text-primary">Login</h2>
          <p className="text-text-secondary mt-2 mb-6">Enter your credentials to access the system</p>
          
          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">Email Address</label>
              <Input 
                type="email" 
                id="email" 
                placeholder="your.email@pharma.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password"className="block text-sm font-medium text-text-secondary mb-1">Password</label>
              <Input 
                type="password" 
                id="password" 
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-sm font-medium text-red-500">{error}</p>}
            <Button type="submit" className="w-full">Login</Button>
            <p className="text-center text-xs text-text-muted pt-2">
              Demo password: <span className="font-mono bg-primary-100 dark:bg-primary-800/50 text-primary-800 dark:text-primary-300 px-2 py-0.5 rounded-md">demo123</span>
            </p>
          </form>
        </Card>

        <Card className="p-8">
          <h2 className="text-2xl font-bold text-text-primary">Quick Access</h2>
          <p className="text-text-secondary mt-2 mb-6">Select a role for instant credential fill</p>

          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg mb-6">
            {(['Prod', 'QA', 'QC', 'SCM', 'Admin', 'Corporate'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full py-2 text-sm font-semibold rounded-md transition-all duration-300 ${
                  activeTab === tab 
                  ? 'bg-ui-card text-primary-600 dark:text-primary-400 shadow-sm' 
                  : 'text-text-secondary hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="space-y-3 max-h-[21rem] overflow-y-auto pr-2 -mr-2">
            {filteredUsers.map(user => (
              <button 
                key={user.id}
                onClick={() => handleQuickAccessClick(user.email)}
                className="w-full flex items-center p-3 text-left bg-ui-background dark:bg-slate-800/50 border border-ui-border rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-primary-300 dark:hover:border-primary-700 transition-all"
              >
                <div className="p-2 bg-primary-100 dark:bg-primary-800/50 rounded-full">
                    <UserIcon />
                </div>
                <div className="ml-3">
                    <p className="text-text-primary font-semibold">{user.name}</p>
                    <p className="text-sm text-text-secondary">{user.role}</p>
                </div>
              </button>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Login;