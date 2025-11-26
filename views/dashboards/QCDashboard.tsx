
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Role } from '../../types';

// Lazy load dashboard components
const QCDashboardOfficer = React.lazy(() => import('../qc/QCDashboardOfficer'));
const QCDashboardManager = React.lazy(() => import('../qc/QCDashboardManager'));
const QCDashboardHead = React.lazy(() => import('../qc/QCDashboardHead'));
const DefaultDashboard = React.lazy(() => import('./DefaultDashboard'));

const QCDashboard: React.FC<{ onNavigate: (view: string, id?: string) => void }> = ({ onNavigate }) => {
    const { user } = useAuth();

    if (!user) return null;

    switch (user.role) {
        case Role.QC_Head:
            return <QCDashboardHead onNavigate={onNavigate} />;
        case Role.QC_Manager:
            return <QCDashboardManager onNavigate={onNavigate} />;
        case Role.QC_Operator:
            return <QCDashboardOfficer onNavigate={onNavigate} />;
        default:
            return <DefaultDashboard />;
    }
};

export default QCDashboard;