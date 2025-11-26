import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { CAPAS, USERS } from '../../services/mockData';

const CAPAView: React.FC = () => {
    const { user } = useAuth();
    if (!user) return null;

    const plantCapas = CAPAS.filter(c => c.plantId === user.plantId);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">CAPA Management</h1>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal">
                         <thead className="bg-gray-50">
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase">CAPA ID</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase">Title</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase">Source</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase">Owner</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {plantCapas.map(capa => (
                                <tr key={capa.id} className="hover:bg-gray-50">
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm font-semibold">{capa.id}</td>
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm">{capa.title}</td>
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm font-mono">{capa.source}</td>
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm">{USERS.find(u => u.id === capa.owner)?.name}</td>
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm">{capa.status}</td>
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm text-right">
                                        <button className="text-primary-600 font-semibold hover:underline">View Details</button>
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

export default CAPAView;
