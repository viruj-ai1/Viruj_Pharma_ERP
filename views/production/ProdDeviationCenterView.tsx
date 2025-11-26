import React from 'react';
// FIX: The 'Department' enum is exported from types.ts, not mockData.ts.
import { DEVIATIONS } from '../../services/mockData';
import { Department } from '../../types';

const ProdDeviationCenterView: React.FC = () => {
    const prodDeviations = DEVIATIONS.filter(d => d.sourceDept === Department.Production);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Deviation/Incident Center (Production)</h1>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50"><tr>
                        <th className="p-3 text-left">ID</th>
                        <th className="p-3 text-left">Title</th>
                        <th className="p-3 text-left">Batch</th>
                        <th className="p-3 text-left">Status</th>
                        <th className="p-3"></th>
                    </tr></thead>
                    <tbody>
                        {prodDeviations.map(d => (
                            <tr key={d.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-semibold">{d.id}</td>
                                <td className="p-3">{d.title}</td>
                                <td className="p-3 font-mono">{d.batchNumber}</td>
                                <td className="p-3">{d.status}</td>
                                <td className="p-3 text-right"><button className="text-primary-600 font-semibold text-sm">Review</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProdDeviationCenterView;