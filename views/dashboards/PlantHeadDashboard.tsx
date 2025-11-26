import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Role, BatchStatus, IndentStatus, SalesOrderStatus, MaterialRequestStatus } from '../../types';
import { PRODUCTION_BATCHES, DEVIATIONS, MATERIAL_REQUESTS, SALES_ORDERS, EQUIPMENT, SAFETY_INCIDENTS, MATERIAL_INDENTS } from '../../services/mockData';
import { DashboardCard } from './shared/CommonComponents';
import { OEEIcon, YieldIcon, ProductionIcon, QAIcon, MaintenanceIcon, SafetyIcon, TaskIcon } from '../../constants';


const PlantHeadDashboard: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
    const { user } = useAuth();
    if (!user || !user.plantId) return <div>User plant not found</div>;

    const plantBatches = PRODUCTION_BATCHES.filter(b => b.plantId === user.plantId);
    const plantDeviations = DEVIATIONS.filter(d => d.plantId === user.plantId);
    const plantMaterialRequests = MATERIAL_REQUESTS.filter(mr => mr.plantId === user.plantId);
    const plantEquipment = EQUIPMENT.filter(e => e.plantId === user.plantId);
    const plantSafetyIncidents = SAFETY_INCIDENTS.filter(i => i.plantId === user.plantId);

    const oee = 85.2;
    const yieldPercent = 98.7;
    const batchesInProgress = plantBatches.filter(b => b.status === BatchStatus.InProgress).length;
    const batchesDelayed = plantBatches.filter(b => b.status === BatchStatus.OnHold || b.status === BatchStatus.Delayed).length;
    const openDeviations = plantDeviations.filter(d => d.status !== 'Closed').length;
    const equipmentBreakdown = plantEquipment.filter(e => e.status === 'Breakdown').length;
    const safetyIncidents = plantSafetyIncidents.filter(i => i.status === 'Open').length;
    const totalApprovals = 
        plantMaterialRequests.filter(mr => mr.status === MaterialRequestStatus.Pending_Plant_Head_Approval).length +
        SALES_ORDERS.filter(so => so.plantId === user.plantId && so.status === SalesOrderStatus.Pending_Plant_Head_Approval).length +
        MATERIAL_INDENTS.filter(i => i.plantId === user.plantId && i.status === IndentStatus.Pending_Plant_Head_Approval).length;
    
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">Plant Dashboard - {user.plantId.replace('plant-','').charAt(0).toUpperCase() + user.plantId.slice(7)}</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardCard title="OEE" value={`${oee}%`} description="Overall Equipment Effectiveness" color="blue" icon={<OEEIcon/>} />
                <DashboardCard title="Yield %" value={`${yieldPercent}%`} description="Today / MTD" color="green" icon={<YieldIcon/>} />
                <DashboardCard title="Batches In Progress" value={batchesInProgress} description={`${batchesDelayed} Delayed`} color="indigo" icon={<ProductionIcon />} />
                <DashboardCard title="Open Deviations" value={openDeviations} description="Across all departments" color={openDeviations > 0 ? 'yellow' : 'green'} icon={<QAIcon />} />
                <DashboardCard title="Equipment Status" value={`${equipmentBreakdown} Breakdowns`} description="Plant Machinery Health" color={equipmentBreakdown > 0 ? 'red' : 'green'} icon={<MaintenanceIcon />} />
                <DashboardCard title="Safety Incidents" value={safetyIncidents} description="Open EHS Incidents" color={safetyIncidents > 0 ? 'red' : 'green'} icon={<SafetyIcon />} />
                <DashboardCard title="Pending Approvals" value={totalApprovals} description="Items needing your review" color="purple" icon={<TaskIcon />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-slate-700 mb-4">Current Production Overview</h3>
                     <div className="space-y-3 max-h-96 overflow-y-auto">
                        {plantBatches.filter(b => b.status === 'In Progress').map(batch => (
                            <div key={batch.id} className="bg-slate-50 p-4 rounded-md flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-slate-800">{batch.batchNumber}</p>
                                    <p className="text-sm text-slate-500">{batch.productName}</p>
                                </div>
                                <span className="text-sm font-medium text-blue-600">{batch.status}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                     <h3 className="text-lg font-semibold text-slate-700 mb-4">Latest QA Status</h3>
                      <div className="space-y-2">
                         {plantDeviations.filter(s => s.status !== 'Closed').slice(0, 4).map(dev => (
                            <div key={dev.id} className="flex justify-between text-sm">
                                <p className="text-slate-600">{dev.batchNumber}</p>
                                <span className={`font-semibold ${dev.severity === 'Critical' ? 'text-red-500' : 'text-slate-700'}`}>{dev.status}</span>
                            </div>
                         ))}
                     </div>
                </div>
            </div>
        </div>
    );
};

export default PlantHeadDashboard;