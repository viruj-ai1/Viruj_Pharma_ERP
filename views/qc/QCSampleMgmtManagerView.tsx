import React, { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { QC_SAMPLES, USERS } from '../../services/mockData';
import { QualitySample, QcStatus, Role } from '../../types';

const statusColors: { [key in QcStatus]: string } = {
    [QcStatus.Pending]: 'bg-gray-100 text-gray-800',
    [QcStatus.InProgress]: 'bg-blue-100 text-blue-800',
    [QcStatus.Passed]: 'bg-green-100 text-green-800',
    [QcStatus.Failed]: 'bg-red-100 text-red-800',
    [QcStatus.Submitted]: 'bg-purple-100 text-purple-800',
    [QcStatus.SubmittedForReview]: 'bg-purple-100 text-purple-800',
    [QcStatus.Approved]: 'bg-teal-100 text-teal-800',
    [QcStatus.Rejected]: 'bg-pink-100 text-pink-800',
};

const AssignOfficerModal: React.FC<{ sample: QualitySample; onClose: () => void; onAssign: (sampleId: string, officerId: string) => void; }> = ({ sample, onClose, onAssign }) => {
    const qcOfficers = USERS.filter(u => u.role === Role.QC_Operator);
    const [selectedOfficer, setSelectedOfficer] = useState(sample.analystId || qcOfficers[0]?.id || '');
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Assign Analyst for {sample.id}</h2>
                <select value={selectedOfficer} onChange={e => setSelectedOfficer(e.target.value)} className="w-full p-2 border rounded-md">
                    {qcOfficers.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                </select>
                <div className="mt-6 flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
                    <button onClick={() => onAssign(sample.id, selectedOfficer)} className="px-4 py-2 bg-primary-600 text-white rounded-md">Assign</button>
                </div>
            </div>
        </div>
    );
}


const QCSampleMgmtManagerView: React.FC = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [samples, setSamples] = useState(QC_SAMPLES);
    const [assigningSample, setAssigningSample] = useState<QualitySample | null>(null);

    const handleAssign = (sampleId: string, officerId: string) => {
        setSamples(s => s.map(sample => sample.id === sampleId ? { ...sample, analystId: officerId, status: sample.status === QcStatus.Pending ? QcStatus.InProgress : sample.status } : sample));
        setAssigningSample(null);
    }
    
    const unassignedSamples = useMemo(() => samples.filter(s => !s.analystId), [samples]);
    const stabilitySamples = useMemo(() => samples.filter(s => s.sampleType === 'Stability'), [samples]);

    const renderTable = (data: QualitySample[]) => (
         <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full">
                <thead className="bg-gray-50"><tr>
                    <th className="p-3 text-left text-xs font-semibold uppercase">Sample ID</th>
                    <th className="p-3 text-left text-xs font-semibold uppercase">Type</th>
                    <th className="p-3 text-left text-xs font-semibold uppercase">Priority</th>
                    <th className="p-3 text-left text-xs font-semibold uppercase">Assigned To</th>
                    <th className="p-3 text-left text-xs font-semibold uppercase">Status</th>
                    <th className="p-3"></th>
                </tr></thead>
                <tbody>
                    {data.map(s => (
                        <tr key={s.id} className="border-b hover:bg-gray-50">
                            <td className="p-3 font-semibold">{s.id} <span className="font-normal text-xs text-gray-500 block">{s.productName}</span></td>
                            <td className="p-3">{s.sampleType}</td>
                            <td className="p-3">{s.priority || 'Medium'}</td>
                            <td className="p-3">{USERS.find(u => u.id === s.analystId)?.name || <span className="text-gray-400">Unassigned</span>}</td>
                            <td className="p-3"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[s.status]}`}>{s.status}</span></td>
                            <td className="p-3 text-right">
                                <button onClick={() => setAssigningSample(s)} className="text-sm font-semibold text-primary-600 hover:underline">
                                    {s.analystId ? 'Reassign' : 'Assign'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div>
            {assigningSample && <AssignOfficerModal sample={assigningSample} onClose={() => setAssigningSample(null)} onAssign={handleAssign} />}
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Sample Management</h1>
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    <button onClick={() => setActiveTab('all')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'all' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>All Samples</button>
                    <button onClick={() => setActiveTab('unassigned')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'unassigned' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Unassigned ({unassignedSamples.length})</button>
                    <button onClick={() => setActiveTab('stability')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'stability' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Stability Samples</button>
                </nav>
            </div>
            {activeTab === 'all' && renderTable(samples)}
            {activeTab === 'unassigned' && renderTable(unassignedSamples)}
            {activeTab === 'stability' && renderTable(stabilitySamples)}
        </div>
    );
};

export default QCSampleMgmtManagerView;