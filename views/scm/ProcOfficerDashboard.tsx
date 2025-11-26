
import React from 'react';
import { PURCHASE_REQUISITIONS, PURCHASE_ORDERS } from '../../services/mockData';
import { PRStatus } from '../../types';
import { DashboardCard } from '../dashboards/shared/CommonComponents';
import { IndentIcon, POIcon, VendorIcon, TaskIcon } from '../../constants';

// FIX: Added props interface to accept onNavigate
interface ProcOfficerDashboardProps {
    onNavigate?: (view: string, id?: string) => void;
}

const ProcOfficerDashboard: React.FC<ProcOfficerDashboardProps> = ({ onNavigate }) => {
    const pendingPRs = PURCHASE_REQUISITIONS.filter(pr => pr.status === PRStatus.Pending).length;
    const pendingPOs = PURCHASE_ORDERS.filter(po => po.status.startsWith('Pending')).length;

    const alerts = [
        { id: 1, text: 'PO-2024-012 from Pack Solutions Inc is overdue.', type: 'danger' },
        { id: 2, text: 'Material from PO-2024-001 is on QC Hold.', type: 'warning' },
        { id: 3, text: 'Rate contract for ChemPro Inc. is expiring in 30 days.', type: 'info' },
    ];

    const getAlertColor = (type: string) => {
        if (type === 'danger') return 'bg-red-50 border-red-400 text-red-800';
        if (type === 'warning') return 'bg-yellow-50 border-yellow-400 text-yellow-800';
        return 'bg-blue-50 border-blue-400 text-blue-800';
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Procurement Officer Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardCard title="PRs Awaiting Processing" value={pendingPRs} description="From all departments" color="yellow" icon={<IndentIcon />} onClick={() => onNavigate?.('prManagement')} />
                <DashboardCard title="Pending PO Approvals" value={pendingPOs} description="Drafts sent for approval" color="blue" icon={<POIcon />} onClick={() => onNavigate?.('poTracking')} />
                <DashboardCard title="Upcoming Deliveries" value="3" description="In the next 7 days" color="indigo" icon={<VendorIcon />} onClick={() => onNavigate?.('deliveryTracking')} />
                <DashboardCard title="Vendor Follow-ups" value="2" description="Reminders for today" color="purple" icon={<TaskIcon />} onClick={() => onNavigate?.('vendorManagementOfficer')} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Live Purchase Orders</h3>
                    <div className="space-y-3">
                        {PURCHASE_ORDERS.slice(0, 4).map(po => (
                            <div key={po.id} className="p-3 bg-gray-50 rounded-md flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{po.poNumber}</p>
                                    <p className="text-sm text-gray-500">{po.materialName}</p>
                                </div>
                                <button className="text-primary-600 text-sm font-semibold">Track Delivery</button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Alerts</h3>
                        <div className="space-y-2">
                            {alerts.map(alert => (
                                <div key={alert.id} className={`p-3 rounded-md border-l-4 text-sm ${getAlertColor(alert.type)}`}>
                                    <p className="font-semibold">{alert.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                     <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Budget Consumption (Read-only)</h3>
                        <p className="text-2xl font-bold text-gray-800">₹8,50,000 / ₹15,00,000</p>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2"><div className="bg-primary-600 h-2.5 rounded-full" style={{ width: '56%' }}></div></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProcOfficerDashboard;