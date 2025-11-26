import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { PURCHASE_REQUISITIONS as initialIndents, USERS } from '../../services/mockData';
import { PurchaseRequisition, PRStatus, Department } from '../../types';

const PRStatusBadge: React.FC<{ status: PRStatus }> = ({ status }) => {
    const colors = {
        [PRStatus.Pending]: 'bg-yellow-100 text-yellow-800',
        [PRStatus.RFQ_Created]: 'bg-blue-100 text-blue-800',
        [PRStatus.PO_Created]: 'bg-green-100 text-green-800',
        [PRStatus.Closed]: 'bg-gray-100 text-gray-800',
    };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colors[status] || 'bg-gray-100'}`}>{status.replace(/_/g, ' ')}</span>;
};

const PRManagementView: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('incoming');
    if (!user) return null;

    const incomingPRs = initialIndents.filter(pr => pr.status === PRStatus.Pending);
    const processedPRs = initialIndents.filter(pr => pr.status !== PRStatus.Pending);

    const renderTable = (data: PurchaseRequisition[]) => (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full">
                <thead className="bg-gray-50"><tr>
                    <th className="p-3 text-left">PR No</th>
                    <th className="p-3 text-left">Material</th>
                    <th className="p-3 text-left">Department</th>
                    <th className="p-3 text-left">Required Date</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3"></th>
                </tr></thead>
                <tbody>
                    {data.map(pr => (
                        <tr key={pr.id} className="border-b hover:bg-gray-50">
                            <td className="p-3 font-semibold">{pr.id}</td>
                            <td className="p-3">{pr.materialName} ({pr.quantity} {pr.unit})</td>
                            <td className="p-3">{pr.requesterDept}</td>
                            <td className="p-3">{pr.dateRaised}</td>
                            <td className="p-3"><PRStatusBadge status={pr.status} /></td>
                            <td className="p-3 text-right space-x-2">
                                {pr.status === PRStatus.Pending && <button className="text-primary-600 font-semibold text-sm">Create RFQ</button>}
                                <button className="text-gray-600 font-semibold text-sm">View</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Purchase Requisition (PR) Management</h1>
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    <button onClick={() => setActiveTab('incoming')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'incoming' ? 'border-primary-500 text-primary-600' : 'border-transparent'}`}>Incoming PRs ({incomingPRs.length})</button>
                    <button onClick={() => setActiveTab('processed')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'processed' ? 'border-primary-500 text-primary-600' : 'border-transparent'}`}>Processed PRs</button>
                </nav>
            </div>
            {activeTab === 'incoming' ? renderTable(incomingPRs) : renderTable(processedPRs)}
        </div>
    );
};

export default PRManagementView;