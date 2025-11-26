import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { COAS, USERS, DEVIATIONS } from '../../services/mockData';
import { CoA, CoaStatus } from '../../types';

const statusColors: { [key in CoaStatus]: string } = {
    [CoaStatus.Draft]: 'bg-gray-100 text-gray-800',
    [CoaStatus.PendingManagerReview]: 'bg-blue-100 text-blue-800',
    [CoaStatus.PendingHeadApproval]: 'bg-yellow-100 text-yellow-800',
    [CoaStatus.Released]: 'bg-green-100 text-green-800',
    [CoaStatus.Rejected]: 'bg-red-100 text-red-800',
};

const ApprovalWindow: React.FC<{ coa: CoA; onClose: () => void; onApprove: (id: string) => void; }> = ({ coa, onClose, onApprove }) => {
    
    const handleESign = () => {
        const pwd = prompt("Enter password for e-signature to finalize approval:");
        if (pwd === "demo123") {
            onApprove(coa.id);
        } else {
            alert("Incorrect password.");
        }
    }
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">COA Approval: {coa.id} for Batch {coa.batchNumber}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg border">
                            <h3 className="font-semibold text-gray-700">Results vs. Specifications (Placeholder)</h3>
                            <p className="text-sm text-gray-500 mt-2">A table comparing test results against specification limits would be displayed here.</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border">
                            <h3 className="font-semibold text-gray-700">Linked Deviations</h3>
                            <p className="text-sm text-gray-500 mt-2">{DEVIATIONS.filter(d => d.batchNumber === coa.batchNumber).length} deviations found.</p>
                        </div>
                    </div>
                     <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg border">
                            <h3 className="font-semibold text-gray-700">Approval Trail</h3>
                            <p className="text-sm">Prepared by: {USERS.find(u => u.id === coa.preparedBy)?.name}</p>
                            <p className="text-sm">Reviewed by: {USERS.find(u => u.id === coa.reviewedBy)?.name}</p>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                             <h3 className="font-semibold text-yellow-800">Final Action</h3>
                            <div className="mt-4 flex justify-end space-x-3">
                                <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
                                <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Reject COA</button>
                                <button onClick={handleESign} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Final Approve with E-signature</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CoaApprovalCenterView: React.FC = () => {
    const [coas, setCoas] = useState(COAS);
    const [activeTab, setActiveTab] = useState('pending');
    const [reviewingCoa, setReviewingCoa] = useState<CoA | null>(null);

    const handleApprove = (id: string) => {
        setCoas(prev => prev.map(c => c.id === id ? { ...c, status: CoaStatus.Released } : c));
        setReviewingCoa(null);
    }
    
    const pendingCoas = coas.filter(c => c.status === CoaStatus.PendingHeadApproval);
    const allCoas = coas;

    const renderTable = (data: CoA[]) => (
        <table className="min-w-full">
            <thead className="bg-gray-50"><tr>
                <th className="p-3 text-left">COA ID</th>
                <th className="p-3 text-left">Batch</th>
                <th className="p-3 text-left">Reviewed By</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3"></th>
            </tr></thead>
            <tbody>
                {data.map(coa => (
                    <tr key={coa.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-semibold">{coa.id}</td>
                        <td className="p-3">{coa.batchNumber}</td>
                        <td className="p-3">{USERS.find(u => u.id === coa.reviewedBy)?.name}</td>
                        <td className="p-3"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[coa.status]}`}>{coa.status}</span></td>
                        <td className="p-3 text-right">
                            {coa.status === CoaStatus.PendingHeadApproval && <button onClick={() => setReviewingCoa(coa)} className="text-sm font-semibold bg-primary-600 text-white px-3 py-1 rounded-md">Review & Approve</button>}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    return (
        <div>
            {reviewingCoa && <ApprovalWindow coa={reviewingCoa} onClose={() => setReviewingCoa(null)} onApprove={handleApprove} />}
            <h1 className="text-3xl font-bold text-gray-800 mb-2">COA Approval Center</h1>
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    <button onClick={() => setActiveTab('pending')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'pending' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Pending Final Approval ({pendingCoas.length})</button>
                    <button onClick={() => setActiveTab('all')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'all' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>All COAs</button>
                </nav>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                {activeTab === 'pending' ? renderTable(pendingCoas) : renderTable(allCoas)}
            </div>
        </div>
    );
};

export default CoaApprovalCenterView;