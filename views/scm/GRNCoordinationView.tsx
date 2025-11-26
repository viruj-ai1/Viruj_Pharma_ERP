import React from 'react';
import { PURCHASE_ORDERS } from '../../services/mockData';
import { PoStatus } from '../../types';

const GRNCoordinationView: React.FC = () => {
    const pendingGRN = PURCHASE_ORDERS.filter(po => po.status === PoStatus.Delivered || po.status === PoStatus.Received);
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">GRN / Receiving Coordination</h1>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <h2 className="text-xl font-semibold p-4 border-b">Deliveries Pending GRN</h2>
                <table className="min-w-full">
                    <thead className="bg-gray-50"><tr>
                        <th className="p-3 text-left">PO No</th>
                        <th className="p-3 text-left">Material</th>
                        <th className="p-3 text-left">Received Date</th>
                        <th className="p-3"></th>
                    </tr></thead>
                    <tbody>
                        {pendingGRN.map(po => (
                            <tr key={po.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-semibold">{po.poNumber}</td>
                                <td className="p-3">{po.materialName}</td>
                                <td className="p-3">{po.dateReceived || 'N/A'}</td>
                                <td className="p-3 text-right space-x-2">
                                    <button className="text-gray-600 font-semibold text-sm">Upload Docs</button>
                                    <button className="text-primary-600 font-semibold text-sm">Log Discrepancy</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GRNCoordinationView;
