import React from 'react';
import { MATERIAL_REQUESTS } from '../../services/mockData';

const MaterialIssuanceView: React.FC = () => {
    const pendingRequests = MATERIAL_REQUESTS.filter(mr => mr.status === 'Ready for Issuance');
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Material Issuance</h1>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <h2 className="text-xl font-semibold p-4 border-b">Issue Requests from Departments</h2>
                <table className="min-w-full">
                    <thead className="bg-gray-50"><tr>
                        <th className="p-3 text-left">Material</th>
                        <th className="p-3 text-left">Batch Ref.</th>
                        <th className="p-3 text-left">Requester</th>
                        <th className="p-3"></th>
                    </tr></thead>
                    <tbody>
                        {pendingRequests.map(req => (
                            <tr key={req.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-semibold">{req.materialName} ({req.quantity} {req.unit})</td>
                                <td className="p-3">{req.batchNumber}</td>
                                <td className="p-3">{req.requestedBy}</td>
                                <td className="p-3 text-right">
                                    <button className="text-primary-600 text-sm font-semibold">Approve for Picking</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MaterialIssuanceView;
