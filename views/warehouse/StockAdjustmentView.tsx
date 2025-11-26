import React from 'react';
import { STOCK_ADJUSTMENTS } from '../../services/mockData';

const StockAdjustmentView: React.FC = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Stock Adjustments & Approvals</h1>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <h2 className="text-xl font-semibold p-4 border-b">Pending Adjustments</h2>
                <table className="min-w-full">
                     <thead className="bg-gray-50"><tr>
                        <th className="p-3 text-left">Material</th>
                        <th className="p-3 text-left">Reason</th>
                        <th className="p-3 text-left">Change</th>
                        <th className="p-3 text-left">Status</th>
                    </tr></thead>
                    <tbody>
                        {STOCK_ADJUSTMENTS.map(adj => (
                            <tr key={adj.id} className="border-b">
                                <td className="p-3">{adj.materialId}</td>
                                <td className="p-3">{adj.reason}</td>
                                <td className="p-3">{adj.quantityChange}</td>
                                <td className="p-3">{adj.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StockAdjustmentView;
