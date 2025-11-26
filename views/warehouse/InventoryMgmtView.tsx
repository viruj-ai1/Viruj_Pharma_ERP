import React from 'react';
import { INVENTORY_ITEMS } from '../../services/mockData';

const InventoryMgmtView: React.FC = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Inventory Management</h1>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50"><tr>
                        <th className="p-3 text-left">Material</th>
                        <th className="p-3 text-left">Quantity</th>
                        <th className="p-3 text-left">Bin Location</th>
                        <th className="p-3 text-left">Expiry</th>
                        <th className="p-3 text-left">QC Status</th>
                    </tr></thead>
                    <tbody>
                        {INVENTORY_ITEMS.map(item => (
                            <tr key={item.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-semibold">{item.name}</td>
                                <td className="p-3">{item.quantity} {item.unit}</td>
                                <td className="p-3">{item.binLocation}</td>
                                <td className="p-3">{item.expiryDate}</td>
                                <td className="p-3">{item.qcStatus}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InventoryMgmtView;
