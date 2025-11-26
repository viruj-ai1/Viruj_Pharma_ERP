
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { QC_SAMPLES, QC_INSTRUMENTS, USERS, DEVIATIONS } from '../../services/mockData';
import { DashboardCard } from '../dashboards/shared/CommonComponents';
import { Role } from '../../types';

const QCDashboardManager: React.FC<{ onNavigate: (view: string, id?: string) => void }> = ({ onNavigate }) => {
    const { user } = useAuth();
    if (!user) return null;

    const pendingReviewCount = QC_SAMPLES.flatMap(s => s.tests).filter(t => t.status === 'Submitted for Review').length;
    const oosCount = DEVIATIONS.filter(d => d.sourceDept === 'Quality Control' && d.status !== 'Closed').length;
    const unassignedSamples = QC_SAMPLES.filter(s => !s.analystId).length;
    const overdueTests = QC_SAMPLES.filter(s => new Date(s.dueDate) < new Date() && (s.status === 'Pending' || s.status === 'In Progress')).length;
    const calibrationDue = QC_INSTRUMENTS.filter(i => i.status === 'Calibration Due').length;
    const qcOfficers = USERS.filter(u => u.role === Role.QC_Operator);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">QC Manager Dashboard</h1>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                <button onClick={() => onNavigate('qcTestReview')} className="text-left"><DashboardCard title="Pending Test Review" value={pendingReviewCount} description="Tests awaiting your approval" color="yellow" icon={<></>} /></button>
                <button onClick={() => onNavigate('qcInvestigationsManager')} className="text-left"><DashboardCard title="OOS / OOT Open" value={oosCount} description="Awaiting assessment" color="red" icon={<></>} /></button>
                <DashboardCard title="Stability Pulls Due" value={1} description="Scheduled for today" color="blue" icon={<></>} />
                <button onClick={() => onNavigate('qcInstrumentsManager')} className="text-left"><DashboardCard title="Calibration Due" value={calibrationDue} description="Instruments needing approval" color="purple" icon={<></>} /></button>
                <DashboardCard title="Pending COA Drafts" value={0} description="From QA" color="gray" icon={<></>} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Officer Workload Distribution</h3>
                    <div className="space-y-4">
                        {qcOfficers.map(officer => {
                            const assigned = QC_SAMPLES.filter(s => s.analystId === officer.id && (s.status === 'In Progress' || s.status === 'Pending')).length;
                            const total = QC_SAMPLES.length / qcOfficers.length; // simple distribution for demo
                            return (
                                <div key={officer.id}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium">{officer.name}</span>
                                        <span>{assigned} Active Samples</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5"><div className="bg-primary-600 h-2.5 rounded-full" style={{ width: `${(assigned / (total || 1)) * 100}%` }}></div></div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                 <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Workload Summary</h3>
                        <p>Samples Pending Assignment: <strong className="text-primary-600">{unassignedSamples}</strong></p>
                        <p>Tests Overdue: <strong className="text-red-600">{overdueTests}</strong></p>
                        <button onClick={() => onNavigate('qcSampleMgmtManager')} className="text-sm font-semibold text-primary-600 hover:underline mt-2">Go to Assignment &rarr;</button>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Alerts</h3>
                         <div className="text-sm space-y-2">
                             <p className="p-2 bg-yellow-50 border-l-4 border-yellow-400">GC-03 requires unscheduled maintenance.</p>
                             <p className="p-2 bg-blue-50 border-l-4 border-blue-400">Deviation escalated from Production for BATCH-003.</p>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QCDashboardManager;
