import React from 'react';
import { PURCHASE_ORDERS } from '../../services/mockData';
import { PoStatus } from '../../types';

const QCInspectionView: React.FC = () => {
    const pendingInspection = PURCHASE_ORDERS.filter(po => po.status === PoStatus.Received);
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Quality Inspection Coordination</h1>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50"><tr>
                        <th className="p-3 text-left">PO No</th>
                        <th className="p-3 text-left">Material</th>
                        <th className="p-3 text-left">QC Status</th>
                        <th className="p-3"></th>
                    </tr></thead>
                    <tbody>
                        {pendingInspection.map(po => (
                            <tr key={po.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-semibold">{po.poNumber}</td>
                                <td className="p-3">{po.materialName}</td>
                                <td className="p-3">Under Test</td>
                                <td className="p-3 text-right">
                                    <button className="text-primary-600 font-semibold text-sm">Notify Vendor</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default QCInspectionView;
