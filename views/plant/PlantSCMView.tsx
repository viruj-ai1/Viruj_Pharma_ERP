import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { INVENTORY_ITEMS, MATERIAL_INDENTS, PURCHASE_ORDERS } from '../../services/mockData';
import { IndentStatus } from '../../types';

const PlantSCMView: React.FC = () => {
    const { user } = useAuth();
    if (!user || !user.plantId) return <div>User plant not found</div>;

    const plantInventory = INVENTORY_ITEMS.filter(i => i.plantId === user.plantId);
    const plantIndents = MATERIAL_INDENTS.filter(i => i.plantId === user.plantId);
    const plantPOs = PURCHASE_ORDERS.filter(po => po.plantId === user.plantId);

    const lowStockItems = plantInventory.filter(i => i.quantity < 1000 && i.quantity > 0).length;
    const expiringSoon = plantInventory.filter(i => new Date(i.expiryDate) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)).length;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Supply Chain Overview - {user.plantId.replace('plant-','').toUpperCase()}</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Material Status</h2>
                    <p>Low Stock Items: <strong className={lowStockItems > 0 ? 'text-red-500' : ''}>{lowStockItems}</strong></p>
                    <p>Expiring Soon (90 days): <strong className={expiringSoon > 0 ? 'text-yellow-500' : ''}>{expiringSoon}</strong></p>
                </div>
                 <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Indents / PRs</h2>
                    <p>Pending: {plantIndents.filter(i => i.status.startsWith('Pending')).length}</p>
                    <p>Approved for PO: {plantIndents.filter(i => i.status === IndentStatus.Approved_for_PO).length}</p>
                </div>
                 <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Purchase Orders</h2>
                    <p>Active: {plantPOs.filter(p => p.status !== 'Completed' && p.status !== 'Received').length}</p>
                </div>
            </div>
        </div>
    );
};

export default PlantSCMView;