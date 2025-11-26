import React, { useState, useMemo } from 'react';
import { INVENTORY_ITEMS } from '../../services/mockData';
import { InventoryItem } from '../../types';

interface RawMaterialsViewProps {
    onViewLedger: (materialId: string) => void;
}

const RawMaterialsView: React.FC<RawMaterialsViewProps> = ({ onViewLedger }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'in-stock' | 'stocked-out'>('in-stock');
    
    const rawMaterials = useMemo(() => {
        return INVENTORY_ITEMS
            .filter(item => item.type === 'Raw Material')
            .filter(item =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.materialId.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [searchTerm]);

    const displayedItems = useMemo(() => {
        if (activeTab === 'in-stock') {
            return rawMaterials.filter(item => item.quantity > 0);
        } else {
            return rawMaterials.filter(item => item.quantity === 0);
        }
    }, [rawMaterials, activeTab]);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Raw Materials Inventory</h1>

            <div className="mb-4 p-4 bg-white rounded-lg shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
                 <input
                    type="text"
                    placeholder="Search by name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900 placeholder-gray-500"
                />
                 <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('in-stock')}
                        className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors duration-200 ${
                            activeTab === 'in-stock' ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-600 hover:bg-white/60'
                        }`}
                    >
                        In Stock
                    </button>
                    <button
                        onClick={() => setActiveTab('stocked-out')}
                        className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors duration-200 ${
                            activeTab === 'stocked-out' ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-600 hover:bg-white/60'
                        }`}
                    >
                        Stocked Out
                    </button>
                </div>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Material ID</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Quantity</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Expiry Date</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedItems.map((item: InventoryItem) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm"><p className="text-gray-600 whitespace-no-wrap">{item.materialId}</p></td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm"><p className="text-gray-900 whitespace-no-wrap font-semibold">{item.name}</p></td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm"><p className="text-gray-900 whitespace-no-wrap">{item.quantity} {item.unit}</p></td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm"><p className="text-gray-900 whitespace-no-wrap">{item.location}</p></td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm"><p className="text-gray-900 whitespace-no-wrap">{item.expiryDate}</p></td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                                        <button onClick={() => onViewLedger(item.materialId)} className="text-primary-600 hover:text-primary-900 font-semibold">View Ledger</button>
                                    </td>
                                </tr>
                            ))}
                            {displayedItems.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center py-10 text-gray-500">
                                        No items found in this category.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default RawMaterialsView;