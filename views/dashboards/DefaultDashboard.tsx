import React from 'react';
import { PRODUCTION_BATCHES, INVENTORY_ITEMS, DEVIATIONS } from '../../services/mockData';
import { DashboardCard } from './shared/CommonComponents';
import { ProductionIcon, WarehouseIcon, QAIcon } from '../../constants';


const DefaultDashboard: React.FC = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
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
        </div>
    );
};

export default DefaultDashboard;