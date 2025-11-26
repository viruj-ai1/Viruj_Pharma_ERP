import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { PRODUCTION_BATCHES } from '../../services/mockData';
import { BatchStatus } from '../../types';

const ProdOperatorDashboard: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
    const { user } = useAuth();
    if (!user) return null;

    const myActiveBatch = PRODUCTION_BATCHES.find(b => b.officerId === user.id && b.status === BatchStatus.InProgress);
    const assignedTasks = [
        { id: 1, text: 'Verify operator entry for Step 3' },
        { id: 2, text: 'Complete startup checklist for Line 02' },
    ];
    const criticalAlerts = [
        { id: 1, text: 'QC sample for AP-MET-001 is delayed.' },
        { id: 2, text: 'Material shortage: Phenol' },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Officer Dashboard</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {myActiveBatch && (
                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-primary-500">
                            <h3 className="text-xl font-bold text-gray-800">My Active Batch</h3>
                            <p className="text-lg text-gray-600">{myActiveBatch.productName} - <span className="font-mono">{myActiveBatch.batchNumber}</span></p>
                            <p>Current Stage: <span className="font-semibold">{myActiveBatch.stages.find(s => s.status === 'Running')?.name}</span></p>
                            <div className="mt-4 flex space-x-2">
                                <button onClick={() => onNavigate('batchExecutionWorkspace')} className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700">Resume Execution</button>
                                <button onClick={() => onNavigate('prodSamplingQC')} className="bg-blue-100 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-200">Send QC Sample</button>
                                <button onClick={() => onNavigate('prodReportDeviation')} className="bg-red-100 text-red-700 px-4 py-2 rounded-md hover:bg-red-200">Report Incident</button>
                            </div>
                        </div>
                    )}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Upcoming Tasks (Next 4 Hours)</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li>SOP Step: Reaction monitoring for AP-MET-001</li>
                            <li>Material issuance verification for AP-PARA-002</li>
                            <li>QC sampling for AP-MET-001</li>
                        </ul>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Tasks Assigned by Manager</h3>
                        <div className="space-y-2">
                            {assignedTasks.map(task => (
                                <div key={task.id} className="p-3 bg-gray-50 rounded-md">{task.text}</div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Critical Alerts</h3>
                        <div className="space-y-2">
                            {criticalAlerts.map(alert => (
                                <div key={alert.id} className="p-3 bg-red-50 border-l-4 border-red-400 text-red-700">{alert.text}</div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProdOperatorDashboard;