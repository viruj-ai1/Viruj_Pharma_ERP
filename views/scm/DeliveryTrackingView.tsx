import React from 'react';
import { PURCHASE_ORDERS } from '../../services/mockData';
import { PoStatus } from '../../types';

const DeliveryTrackingView: React.FC = () => {
    const expectedDeliveries = PURCHASE_ORDERS.filter(po => po.status === PoStatus.Approved || po.status === PoStatus.Sent);
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Delivery Tracking & Follow-ups</h1>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50"><tr>
                        <th className="p-3 text-left">PO No</th>
                        <th className="p-3 text-left">Dispatch Date</th>
                        <th className="p-3 text-left">Carrier</th>
                        <th className="p-3 text-left">ETA</th>
                        <th className="p-3 text-left">Status</th>
                        <th className="p-3"></th>
                    </tr></thead>
                    <tbody>
                        {expectedDeliveries.map(po => (
                            <tr key={po.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-semibold">{po.poNumber}</td>
                                <td className="p-3">{po.dateCreated}</td>
                                <td className="p-3">Blue Dart</td>
                                <td className="p-3">{po.expectedDeliveryDate}</td>
                                <td className="p-3">{po.status}</td>
                                <td className="p-3 text-right"><button className="text-primary-600 font-semibold text-sm">Add Follow-up</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DeliveryTrackingView;
