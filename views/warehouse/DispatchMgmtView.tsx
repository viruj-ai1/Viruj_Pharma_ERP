import React from 'react';
import { SALES_ORDERS } from '../../services/mockData';

const DispatchMgmtView: React.FC = () => {
    const dispatchPlan = SALES_ORDERS.filter(so => so.status === 'Ready for Dispatch');
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Dispatch Management (Finished Goods)</h1>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <h2 className="text-xl font-semibold p-4 border-b">Dispatch Plan</h2>
                <table className="min-w-full">
                    <thead className="bg-gray-50"><tr>
                        <th className="p-3 text-left">Order No.</th>
                        <th className="p-3 text-left">Customer</th>
                        <th className="p-3 text-left">Dispatch Date</th>
                        <th className="p-3"></th>
                    </tr></thead>
                    <tbody>
                        {dispatchPlan.map(so => (
                            <tr key={so.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-semibold">{so.id}</td>
                                <td className="p-3">{so.customerId}</td>
                                <td className="p-3">{so.date}</td>
                                <td className="p-3 text-right">
                                    <button className="text-primary-600 text-sm font-semibold">Approve Pick List</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DispatchMgmtView;
