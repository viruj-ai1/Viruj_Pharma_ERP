import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { MATERIAL_INDENTS, MATERIAL_REQUESTS, SALES_ORDERS } from '../../services/mockData';
import { IndentStatus, MaterialRequestStatus, SalesOrderStatus } from '../../types';

const PlantApprovalsView: React.FC = () => {
    const { user } = useAuth();
    if (!user || !user.plantId) return <div>User plant not found</div>;

    const indentApprovals = MATERIAL_INDENTS.filter(i => i.plantId === user.plantId && i.status === IndentStatus.Pending_Plant_Head_Approval);
    const materialRequestApprovals = MATERIAL_REQUESTS.filter(mr => mr.plantId === user.plantId && mr.status === MaterialRequestStatus.Pending_Plant_Head_Approval);
    const salesOrderApprovals = SALES_ORDERS.filter(so => so.plantId === user.plantId && so.status === SalesOrderStatus.Pending_Plant_Head_Approval);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Approvals / Inbox - {user.plantId.replace('plant-','').toUpperCase()}</h1>
            <div className="space-y-6">
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Indent Proposals ({indentApprovals.length})</h2>
                    {indentApprovals.map(i => <div key={i.id} className="p-2 border-b">{i.materialName} - {i.quantity} {i.unit}</div>)}
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Material Requests ({materialRequestApprovals.length})</h2>
                    {materialRequestApprovals.map(mr => <div key={mr.id} className="p-2 border-b">{mr.materialName} - {mr.quantity} {mr.unit} for {mr.batchNumber}</div>)}
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Sales Orders ({salesOrderApprovals.length})</h2>
                     {salesOrderApprovals.map(so => <div key={so.id} className="p-2 border-b">Order {so.id}</div>)}
                </div>
            </div>
        </div>
    );
};

export default PlantApprovalsView;
