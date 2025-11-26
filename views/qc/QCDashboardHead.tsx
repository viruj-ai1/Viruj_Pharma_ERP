
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { QC_SAMPLES, DEVIATIONS, COAS, DOCUMENTS, QC_INSTRUMENTS } from '../../services/mockData';
import { DashboardCard } from '../dashboards/shared/CommonComponents';
import { CoaStatus, DocumentType } from '../../types';

const QCDashboardHead: React.FC<{ onNavigate: (view: string, id?: string) => void }> = ({ onNavigate }) => {
    const { user } = useAuth();
    if (!user) return null;

    // KPIs
    const avgTat = 2.8; // Mock
    const failureRate = (QC_SAMPLES.filter(s => s.status === 'Failed').length / QC_SAMPLES.length * 100).toFixed(1);
    const oosCount = DEVIATIONS.filter(d => d.sourceDept === 'Quality Control' && d.status !== 'Closed').length;
    const instrumentUptime = 98; // Mock

    // Alerts
    const pendingCoas = COAS.filter(c => c.status === CoaStatus.PendingHeadApproval);
    const pendingDeviations = DEVIATIONS.filter(d => d.status === 'Pending Final Approval');
    const pendingDocuments = DOCUMENTS.filter(d => d.status === 'Pending Approval' && d.referenceId.includes('QC'));

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Executive Dashboard (QC)</h1>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <DashboardCard title="Avg. Sample TAT" value={`${avgTat} days`} description="Turnaround Time" color="blue" icon={<></>} />
                <DashboardCard title="Failure Rate" value={`${failureRate}%`} description="OOS/OOT" color={parseFloat(failureRate) > 2 ? "red" : "green"} icon={<></>} />
                <DashboardCard title="Open Investigations" value={oosCount} description="Deviations / OOS" color="yellow" icon={<></>} />
                <DashboardCard title="Instrument Uptime" value={`${instrumentUptime}%`} description="Overall lab uptime" color="indigo" icon={<></>} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Role-Based Alerts</h3>
                    <div className="space-y-3">
                        {pendingCoas.length > 0 && (
                            <button onClick={() => onNavigate('coaApprovalCenter')} className="w-full text-left p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400 hover:bg-yellow-100 transition-colors">
                                <p className="font-bold text-yellow-800">{pendingCoas.length} COA(s) Pending Final Approval</p>
                                <p className="text-sm text-yellow-700">Batches are awaiting your final release decision.</p>
                            </button>
                        )}
                         {pendingDeviations.length > 0 && (
                             <button onClick={() => onNavigate('investigationCenter')} className="w-full text-left p-4 bg-red-50 rounded-lg border-l-4 border-red-400 hover:bg-red-100 transition-colors">
                                <p className="font-bold text-red-800">{pendingDeviations.length} Deviation(s) Needing Final Closure</p>
                                <p className="text-sm text-red-700">Review investigation reports and provide final approval.</p>
                            </button>
                        )}
                        {pendingDocuments.length > 0 && (
                            <button onClick={() => onNavigate('documentControlHead')} className="w-full text-left p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400 hover:bg-blue-100 transition-colors">
                                <p className="font-bold text-blue-800">{pendingDocuments.length} Document(s) Awaiting Approval</p>
                                <p className="text-sm text-blue-700">SOPs or other controlled documents are pending your sign-off.</p>
                            </button>
                        )}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Test Summary (Today)</h3>
                    <div className="space-y-4">
                        <div className="text-center">
                            <p className="text-4xl font-bold text-gray-800">128</p>
                            <p className="text-sm text-gray-500">Total Tests Executed</p>
                        </div>
                        <div className="flex justify-around">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-green-600">125</p>
                                <p className="text-sm text-gray-500">Passed</p>
                            </div>
                             <div className="text-center">
                                <p className="text-2xl font-bold text-red-600">3</p>
                                <p className="text-sm text-gray-500">Failed / OOS</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QCDashboardHead;
