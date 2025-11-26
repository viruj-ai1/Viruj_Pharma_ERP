import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { MARKET_COMPLAINTS } from '../../services/mockData';
import { MarketComplaint } from '../../types';

const MarketComplaintsView: React.FC = () => {
    const { user } = useAuth();
    if (!user) return null;

    const plantComplaints = MARKET_COMPLAINTS.filter(mc => mc.plantId === user.plantId);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Market Complaints</h1>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal">
                         <thead className="bg-gray-50">
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase">Complaint ID</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase">Product</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase">Batch #</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {plantComplaints.map((complaint: MarketComplaint) => (
                                <tr key={complaint.id} className="hover:bg-gray-50">
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm font-semibold">{complaint.id}</td>
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm">{complaint.productName}</td>
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm font-mono">{complaint.batchNumber}</td>
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm">{complaint.status}</td>
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm text-right">
                                        <button className="text-primary-600 font-semibold hover:underline">Investigate</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MarketComplaintsView;