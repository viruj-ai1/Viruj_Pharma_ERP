
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ProductionBatch, BatchStatus } from '../../types';
import { PRODUCTION_BATCHES, USERS, SHIFTS } from '../../services/mockData';
import { DashboardCard } from '../dashboards/shared/CommonComponents';
import { ProductionIcon, TaskIcon, WorkforceIcon, SafetyIcon } from '../../constants';


const ProdManagerDashboard: React.FC<{ onNavigate: (view: string, id?: string) => void }> = ({ onNavigate }) => {
    const { user } = useAuth();
    if (!user) return null;

    const myBatches = PRODUCTION_BATCHES.filter(b => b.assignedTo === user.id);
    const runningBatches = myBatches.filter(b => b.status === BatchStatus.InProgress);
    const upcomingBatches = PRODUCTION_BATCHES.filter(b => b.status === BatchStatus.Planned && b.plantId === user.plantId);
    
    const currentShift = SHIFTS.find(s => s.managerId === user.id && s.date === new Date().toISOString().split('T')[0]);
    const operatorsOnShift = currentShift ? currentShift.operatorIds.length : 0;
    
    const criticalAlerts = [
        { id: 'dev-01', text: 'Deviation pending for AP-MET-001', action: () => onNavigate('prodEventManager') },
        { id: 'mat-01', text: 'Material shortage warning for AP-PARA-002', action: () => onNavigate('prodMaterialRequests') },
        { id: 'eq-01', text: 'Blender B-102 needs cleaning verification', action: () => onNavigate('lineReadiness') },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">Manager Dashboard (Real-time Ops)</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardCard title="Running Batches" value={runningBatches.length} description="Under your supervision" color="blue" icon={<ProductionIcon />} />
                <DashboardCard title="Upcoming Batches" value={upcomingBatches.length} description="In next 48 hours" color="indigo" icon={<TaskIcon />} />
                <DashboardCard title="Shift Status" value={`${operatorsOnShift} Operators`} description="Currently on shift" color="green" icon={<WorkforceIcon />} />
                <DashboardCard title="Critical Alerts" value={criticalAlerts.length} description="Require your attention" color="red" icon={<SafetyIcon />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-slate-700 mb-4">Current Running Batches</h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {runningBatches.length > 0 ? runningBatches.map(batch => {
                            const currentStage = batch.stages.find(s => s.status === 'Running');
                            return (
                                <button key={batch.id} onClick={() => onNavigate('batchControlPanel')} className="w-full text-left p-4 bg-slate-50 rounded-lg hover:bg-primary-50 hover:shadow-md transition-all border border-slate-200/80">
                                    <div className="flex justify-between items-center">
                                        <p className="font-bold text-slate-800">{batch.productName} <span className="font-normal text-slate-500">({batch.batchNumber})</span></p>
                                        <span className="text-xs font-semibold text-blue-600">{currentStage?.name} ({currentStage?.progress}%)</span>
                                    </div>
                                    <div className="text-sm text-slate-600 mt-1">
                                        <span>Officer: <span className="font-semibold">{USERS.find(u => u.id === currentStage?.officerId)?.name}</span></span> | 
                                        <span> Time Remaining: <span className="font-semibold">~8h</span></span>
                                    </div>
                                </button>
                            );
                        }) : (
                            <p className="text-center text-slate-500 py-8">No batches are currently running under your supervision.</p>
                        )}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-slate-700 mb-4">Critical Alerts</h3>
                    <div className="space-y-2">
                        {criticalAlerts.map(alert => (
                            <button key={alert.id} onClick={alert.action} className="w-full text-left text-sm p-3 bg-red-50 border-l-4 border-red-400 rounded-r-md hover:bg-red-100 font-medium text-red-800">
                                {alert.text}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProdManagerDashboard;