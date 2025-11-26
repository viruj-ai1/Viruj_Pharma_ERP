import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { STABILITY_STUDIES } from '../../services/mockData';
import { StabilityStudy } from '../../types';

const StabilityView: React.FC = () => {
    const { user } = useAuth();
    if (!user) return null;

    const plantStudies = STABILITY_STUDIES.filter(s => s.plantId === user.plantId);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Stability Studies</h1>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <h2 className="text-xl font-semibold p-4 border-b">Study Master List</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal">
                         <thead className="bg-gray-50">
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase">Study ID</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase">Product</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase">Batch #</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase">Study Type</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {plantStudies.map((study: StabilityStudy) => (
                                <tr key={study.id} className="hover:bg-gray-50">
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm font-semibold">{study.id}</td>
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm">{study.productName}</td>
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm font-mono">{study.batchNumber}</td>
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm">{study.studyType}</td>
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm">{study.status}</td>
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

export default StabilityView;