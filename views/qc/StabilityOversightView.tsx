import React from 'react';
import { STABILITY_STUDIES } from '../../services/mockData';
import { StabilityStudy } from '../../types';

const StabilityOversightView: React.FC = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Stability Program Oversight</h1>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <h2 className="text-xl font-semibold p-4 border-b">Stability Studies Overview</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50"><tr>
                            <th className="p-3 text-left">Product</th>
                            <th className="p-3 text-left">Condition</th>
                            <th className="p-3 text-left">Duration</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3"></th>
                        </tr></thead>
                        <tbody>
                            {STABILITY_STUDIES.map(study => (
                                <tr key={study.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3 font-semibold">{study.productName} ({study.batchNumber})</td>
                                    <td className="p-3">25°C / 60% RH</td>
                                    <td className="p-3">12 Months</td>
                                    <td className="p-3">{study.status}</td>
                                    <td className="p-3 text-right"><button className="text-primary-600 font-semibold text-sm">View Study</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StabilityOversightView;