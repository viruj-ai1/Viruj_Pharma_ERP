import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { EM_SAMPLES } from '../../services/mockData';
import { EnvironmentalMonitoring } from '../../types';

const EMView: React.FC = () => {
    const { user } = useAuth();
    if (!user) return null;

    const plantEmSamples = EM_SAMPLES.filter(em => em.plantId === user.plantId);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Environmental Monitoring</h1>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <h2 className="text-xl font-semibold p-4 border-b">EM Test Results</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal">
                         <thead className="bg-gray-50">
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase">Sample ID</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase">Location</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase">Result</th>
                            </tr>
                        </thead>
                        <tbody>
                            {plantEmSamples.map((sample: EnvironmentalMonitoring) => (
                                <tr key={sample.id} className="hover:bg-gray-50">
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm font-semibold">{sample.id}</td>
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm">{sample.room}</td>
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm">{sample.date}</td>
                                    <td className={`px-5 py-4 border-b border-gray-200 text-sm font-semibold ${sample.result === 'Out of Spec' ? 'text-red-500' : 'text-green-600'}`}>
                                        {sample.result}
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

export default EMView;