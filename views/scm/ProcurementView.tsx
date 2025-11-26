import React, { useState } from 'react';
import { PURCHASE_ORDERS, VENDORS } from '../../services/mockData';
import { PoStatus } from '../../types';

const statusColors: { [key in PoStatus]: string } = {
    [PoStatus.Approved]: 'bg-blue-100 text-blue-800',
    [PoStatus.Dispatched]: 'bg-indigo-100 text-indigo-800',
    [PoStatus.Delivered]: 'bg-green-100 text-green-800',
    [PoStatus.QCHold]: 'bg-yellow-100 text-yellow-800',
    [PoStatus.GRNPending]: 'bg-orange-100 text-orange-800',
    [PoStatus.Draft]: 'bg-gray-100 text-gray-800',
    [PoStatus.Pending_Finance_Approval]: 'bg-yellow-100 text-yellow-800',
    [PoStatus.Pending_Management_Approval]: 'bg-orange-100 text-orange-800',
    [PoStatus.Rejected]: 'bg-red-100 text-red-800',
    [PoStatus.Sent]: 'bg-indigo-100 text-indigo-800',
    [PoStatus.Received]: 'bg-green-100 text-green-800',
    [PoStatus.Partially_Received]: 'bg-yellow-100 text-yellow-800',
    [PoStatus.Completed]: 'bg-gray-100 text-gray-800',
};

const POTrackingView: React.FC = () => {
    const [selectedPO, setSelectedPO] = useState(null);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Purchase Order (PO) Creation & Tracking</h1>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50"><tr>
                        <th className="p-3 text-left">PO No</th>
                        <th className="p-3 text-left">Vendor</th>
                        <th className="p-3 text-left">Value</th>
                        <th className="p-3 text-left">ETA</th>
                        <th className="p-3 text-left">Status</th>
                        <th className="p-3"></th>
                    </tr></thead>
                    <tbody>
                        {PURCHASE_ORDERS.map(po => (
                            <tr key={po.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-semibold">{po.poNumber}</td>
                                <td className="p-3">{VENDORS.find(v => v.id === po.vendorId)?.name}</td>
                                <td className="p-3">₹{po.totalAmount.toLocaleString('en-IN')}</td>
                                <td className="p-3">{po.expectedDeliveryDate}</td>
                                <td className="p-3"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[po.status]}`}>{po.status}</span></td>
                                <td className="p-3 text-right"><button className="text-primary-600 font-semibold text-sm">View Details</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default POTrackingView;