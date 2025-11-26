import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Role } from '../types';
import { PRODUCTION_BATCHES, INVENTORY_ITEMS, DEVIATIONS } from '../services/mockData';
import { DashboardCard } from './dashboards/shared/CommonComponents';
import { ProductionIcon, WarehouseIcon, QAIcon } from '../constants';

const Dashboard: React.FC<{ onNavigate: (view: string, id?: string) => void }> = ({ onNavigate }) => {
    const { user } = useAuth();
    
    if (!user) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Please log in to see your dashboard</p>
            </div>
        );
    }

    // Default dashboard layout for all users
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
            <p className="text-slate-600">Welcome, {user.name}! ({user.role})</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DashboardCard 
                    title="Total Batches" 
                    value={PRODUCTION_BATCHES.length} 
                    description="Across all products" 
                    color="indigo" 
                    icon={<ProductionIcon />} 
                />
                <DashboardCard 
                    title="Inventory Items" 
                    value={INVENTORY_ITEMS.length} 
                    description="Raw materials & finished goods" 
                    color="purple" 
                    icon={<WarehouseIcon />} 
                />
                <DashboardCard 
                    title="Open Deviations" 
                    value={DEVIATIONS.filter(d => d.status !== 'Closed').length} 
                    description="Quality assurance events" 
                    color="red" 
                    icon={<QAIcon />} 
                />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-slate-800 mb-4">Overview</h2>
                <p className="text-slate-600 mb-4">User Role: <span className="font-semibold">{user.role}</span></p>
                <p className="text-slate-600 mb-4">Plant: <span className="font-semibold">{user.plantId || 'N/A'}</span></p>
                <p className="text-slate-600">Department: <span className="font-semibold">{user.department}</span></p>
            </div>
        </div>
    );
};

export default Dashboard;