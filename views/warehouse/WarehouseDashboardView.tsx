
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { GRNS, INVENTORY_ITEMS, MATERIAL_REQUESTS } from '../../services/mockData';
import { DashboardCard } from '../dashboards/shared/CommonComponents';
import { WarehouseIcon, SafetyIcon, StabilityIcon, IndentIcon } from '../../constants';

// FIX: Added props interface to accept onNavigate
interface WarehouseDashboardViewProps {
    onNavigate?: (view: string, id?: string) => void;
}

const WarehouseDashboardView: React.FC<WarehouseDashboardViewProps> = ({ onNavigate }) => {
    const { user } = useAuth();
    if (!user) return null;

    const pendingGrns = GRNS.filter(g => g.status === 'Pending QC').length;
    const lowStock = INVENTORY_ITEMS.filter(i => i.quantity > 0 && i.quantity < 1000).length;
    const expiring = INVENTORY_ITEMS.filter(i => new Date(i.expiryDate) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)).length;
    const pendingIssues = MATERIAL_REQUESTS.filter(mr => mr.status === 'Ready for Issuance').length;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Warehouse Manager Dashboard</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <DashboardCard title="Pending GRNs" value={pendingGrns} description="Awaiting QC release" color="blue" icon={<WarehouseIcon />} onClick={() => onNavigate?.('inbound')} />
                <DashboardCard title="Critical Low Stock" value={lowStock} description="Items needing reorder" color="red" icon={<SafetyIcon />} onClick={() => onNavigate?.('inventoryMgmt')} />
                <DashboardCard title="Expiring Items" value={expiring} description="In next 90 days" color="yellow" icon={<StabilityIcon />} onClick={() => onNavigate?.('inventoryMgmt')} />
                <DashboardCard title="Pending Issues" value={pendingIssues} description="To Production/QC" color="purple" icon={<IndentIcon />} onClick={() => onNavigate?.('materialIssuance')} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-semibold mb-4">Inbound Overview</h3>
                    <p>Deliveries scheduled today: 3</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-semibold mb-4">Dispatch Panel</h3>
                    <p>Orders to pick today: 5</p>
                </div>
            </div>
        </div>
    );
};

export default WarehouseDashboardView;