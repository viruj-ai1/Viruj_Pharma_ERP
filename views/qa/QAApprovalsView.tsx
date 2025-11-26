import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { DEVIATIONS, PRODUCTION_BATCHES, CAPAS, CHANGE_CONTROLS } from '../../services/mockData';
import { QAReleaseStatus } from '../../types';

const QAApprovalsView: React.FC = () => {
    const { user } = useAuth();
    if (!user) return null;

    const batchReleases = PRODUCTION_BATCHES.filter(b => b.plantId === user.plantId && b.qaReleaseStatus === QAReleaseStatus.Pending);
    const deviationApprovals = DEVIATIONS.filter(d => d.plantId === user.plantId && d.status === 'Pending Final Approval');
    const capaClosures = CAPAS.filter(c => c.plantId === user.plantId && c.status === 'Effectiveness Check');
    const ccApprovals = CHANGE_CONTROLS.filter(cc => cc.plantId === user.plantId && cc.status === 'Pending Approval');

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Approvals / Inbox</h1>
            <div className="space-y-6">
                 <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Batch Releases ({batchReleases.length})</h2>
                    {batchReleases.map(b => <div key={b.id} className="p-2 border-b">{b.batchNumber}</div>)}
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Deviation Closures ({deviationApprovals.length})</h2>
                    {deviationApprovals.map(d => <div key={d.id} className="p-2 border-b">{d.id}: {d.title}</div>)}
                </div>
                 <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">CAPA Closures ({capaClosures.length})</h2>
                    {capaClosures.map(c => <div key={c.id} className="p-2 border-b">{c.id}: {c.title}</div>)}
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Change Controls ({ccApprovals.length})</h2>
                    {ccApprovals.map(cc => <div key={cc.id} className="p-2 border-b">{cc.id}: {cc.title}</div>)}
                </div>
            </div>
        </div>
    );
};

export default QAApprovalsView;