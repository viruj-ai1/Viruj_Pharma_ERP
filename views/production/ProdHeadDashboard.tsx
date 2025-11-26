
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { PRODUCTION_BATCHES, DEVIATIONS, MATERIAL_REQUESTS, EQUIPMENT } from '../../services/mockData';
import { BatchStatus, MaterialRequestStatus } from '../../types';
import { DashboardCard } from '../dashboards/shared/CommonComponents';

const ProdHeadDashboard: React.FC<{ onNavigate: (view: string, id?: string) => void }> = ({ onNavigate }) => {
    const { user } = useAuth();
    if (!user || !user.plantId) return null;

    const plantBatches = PRODUCTION_BATCHES.filter(b => b.plantId === user.plantId);
    const runningBatches = plantBatches.filter(b => b.status === BatchStatus.InProgress).length;
    const delayedBatches = plantBatches.filter(b => b.status === BatchStatus.Delayed || b.status === BatchStatus.Blocked).length;
    const oee = 82.5; // Mock
    const yieldLoss = 1.9; // Mock

    const pendingDeviations = DEVIATIONS.filter(d => d.plantId === user.plantId && (d.status === 'Pending Manager Review' || d.status === 'Open')).length;
    const pendingClearance = 2; // Mock
    const breakdownEquipment = EQUIPMENT.filter(e => e.plantId === user.plantId && e.status === 'Breakdown').length;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Executive Manufacturing Dashboard</h1>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <DashboardCard title="OEE" value={`${oee}%`} description="Overall Equipment Effectiveness" color="blue" icon={<></>} />
                <DashboardCard title="Line Utilization" value="91%" description="Plant-wide" color="green" icon={<></>} />
                <DashboardCard title="Running / Delayed Batches" value={`${runningBatches} / ${delayedBatches}`} description="Execution Status" color={delayedBatches > 0 ? "yellow" : "indigo"} icon={<></>} />
                <DashboardCard title="Yield Loss" value={`${yieldLoss}%`} description="Top 5 Contributors" color={yieldLoss > 2 ? "red" : "green"} icon={<></>} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Critical Alerts</h3>
                    <div className="space-y-3">
                         <button onClick={() => onNavigate('prodDeviationCenter')} className="w-full text-left p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400 hover:bg-yellow-100 transition-colors">
                            <p className="font-bold text-yellow-800">{pendingDeviations} Production Deviation(s) Pending Approval</p>
                        </button>
                        <div className="w-full text-left p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
                            <p className="font-bold text-red-800">{breakdownEquipment} Equipment in Breakdown</p>
                        </div>
                        <div className="w-full text-left p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                            <p className="font-bold text-blue-800">{pendingClearance} Line(s) Pending Clearance</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Real-Time Floor View (Heat Map)</h3>
                    <div className="h-48 bg-gray-200 rounded-md flex items-center justify-center">
                        <p className="text-gray-500">Shop Floor Map Placeholder</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProdHeadDashboard;
