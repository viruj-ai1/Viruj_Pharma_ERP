import React from 'react';
import { STOCK_LEDGER, MATERIALS, INVENTORY_ITEMS } from '../../services/mockData';
import { StockLedgerEntry, InventoryLedgerAction } from '../../types';

interface MaterialLedgerViewProps {
    materialId: string;
    onBack: () => void;
}

const actionColors: { [key in InventoryLedgerAction]: string } = {
    [InventoryLedgerAction.Received]: 'text-green-600',
    [InventoryLedgerAction.Issued]: 'text-red-600',
    [InventoryLedgerAction.Dispatched]: 'text-red-600',
    [InventoryLedgerAction.Adjustment]: 'text-blue-600'
};

const MaterialLedgerView: React.FC<MaterialLedgerViewProps> = ({ materialId, onBack }) => {
    const material = MATERIALS.find(m => m.id === materialId);
    const inventoryItem = INVENTORY_ITEMS.find(i => i.materialId === materialId);
    const ledgerEntries = STOCK_LEDGER
        .filter(entry => entry.materialId === materialId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (!material) {
        return <div>Material not found.</div>;
    }

    return (
        <div>
            <div className="mb-6">
                <button onClick={onBack} className="mb-2 text-primary-600 hover:underline flex items-center text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Inventory
                </button>
                <h1 className="text-3xl font-bold text-gray-800">Stock Card: {material.name}</h1>
                <p className="text-gray-500">Traceability ledger for {material.id}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                        <p className="text-sm text-gray-500">Current Stock</p>
                        <p className="text-2xl font-bold text-gray-800">{inventoryItem?.quantity || 0} {inventoryItem?.unit}</p>
                    </div>
                     <div>
                        <p className="text-sm text-gray-500">Material Type</p>
                        <p className="text-lg font-semibold text-gray-800">{material.type}</p>
                    </div>
                 </div>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                 <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Reference</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Quantity Change</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ledgerEntries.map((entry: StockLedgerEntry) => (
                                <tr key={entry.id} className="hover:bg-gray-50">
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm"><p>{entry.date}</p></td>
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm"><p className={`font-semibold ${actionColors[entry.action]}`}>{entry.action}</p></td>
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm"><p className="font-mono text-gray-600">{entry.referenceId}</p></td>
                                    <td className={`px-5 py-4 border-b border-gray-200 text-sm text-right font-bold ${entry.quantityChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {entry.quantityChange > 0 ? `+${entry.quantityChange}` : entry.quantityChange}
                                    </td>
                                     <td className="px-5 py-4 border-b border-gray-200 text-sm text-right font-semibold"><p>{entry.balance}</p></td>
                                </tr>
                            ))}
                             {ledgerEntries.length === 0 && (
                                <tr><td colSpan={5} className="text-center py-10 text-gray-500">No transaction history for this material.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MaterialLedgerView;