
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Role } from '../../types';

// Lazy load dashboards
const WarehouseDashboardView = React.lazy(() => import('../warehouse/WarehouseDashboardView'));
const ProcOfficerDashboard = React.lazy(() => import('../scm/ProcOfficerDashboard'));
const DefaultDashboard = React.lazy(() => import('./DefaultDashboard'));

interface SCMDashboardProps {
    onNavigate?: (view: string, id?: string) => void;
}

const SCMDashboard: React.FC<SCMDashboardProps> = ({ onNavigate }) => {
    const { user } = useAuth();
    if (!user) return null;

    const renderDashboard = () => {
        switch (user.role) {
            case Role.Warehouse_Manager:
                return <WarehouseDashboardView onNavigate={onNavigate} />;
            case Role.Procurement_Officer:
                return <ProcOfficerDashboard onNavigate={onNavigate} />;
            default:
                return <DefaultDashboard />;
        }
    }

    return (
        <React.Suspense fallback={<div>Loading SCM Dashboard...</div>}>
            {renderDashboard()}
        </React.Suspense>
    );
};

export default SCMDashboard;