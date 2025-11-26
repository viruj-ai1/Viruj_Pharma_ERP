import React, { useState } from 'react';
import { INVENTORY_ITEMS } from '../../services/mockData';
import { InventoryItem } from '../../types';

const WarehouseQCCoordinationView: React.FC = () => {
    const [activeTab, setActiveTab] = useState('pending');

    const pendingQC = INVENTORY_ITEMS.filter(i => i.qcStatus === 'Pending' || i.qcStatus === 'Quarantine');

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">QC Coordination (Raw/Packing Materials)</h1>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50"><tr>
                        <th className="p-3 text-left">Material</th>
                        <th className="p-3 text-left">Bin Location</th>
                        <th className="p-3 text-left">QC Status</th>
                        <th className="p-3"></th>
                    </tr></thead>
                    <tbody>
                        {pendingQC.map(item => (
                            <tr key={item.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-semibold">{item.name}</td>
                                <td className="p-3">{item.binLocation}</td>
                                <td className="p-3 text-sm font-semibold text-yellow-600">{item.qcStatus}</td>
                                <td className="p-3 text-right">
                                    <button className="text-primary-600 text-sm font-semibold">Print QC Label</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default WarehouseQCCoordinationView;
