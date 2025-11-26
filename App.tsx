
import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Login from './components/Login';
import DashboardLayout from './components/layout/DashboardLayout';

const AppContent: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return <DashboardLayout />;
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;