import React from 'react';
import { EQUIPMENT } from '../../services/mockData';
import { Equipment } from '../../types';

const LineEquipmentView: React.FC = () => {
    const statusColors: { [key in Equipment['status']]: string } = {
        'Idle': 'bg-gray-200 text-gray-800',
        'Running': 'bg-green-200 text-green-800',
        'Cleaning': 'bg-blue-200 text-blue-800',
        'Sanitization': 'bg-indigo-200 text-indigo-800',
        'Breakdown': 'bg-red-200 text-red-800',
        'Under QA Hold': 'bg-yellow-200 text-yellow-800',
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Line & Equipment Management</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white shadow-md rounded-lg overflow-hidden">
                    <h2 className="text-xl font-semibold p-4 border-b">Equipment Status Dashboard</h2>
                    <table className="min-w-full">
                        <thead className="bg-gray-50"><tr>
                            <th className="p-3 text-left">Equipment</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Next PM</th>
                            <th className="p-3"></th>
                        </tr></thead>
                        <tbody>
                            {EQUIPMENT.map(e => (
                                <tr key={e.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3 font-semibold">{e.name}</td>
                                    <td className="p-3"><span className={`px-2 py-1 text-xs rounded-full ${statusColors[e.status]}`}>{e.status}</span></td>
                                    <td className="p-3">{e.nextPMDate}</td>
                                    <td className="p-3 text-right"><button className="text-primary-600 text-sm font-semibold">Details</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Cleaning & Sanitization Approval</h2>
                    <div className="space-y-3">
                        <div className="p-3 bg-gray-50 rounded-md flex justify-between items-center">
                            <div>
                                <p className="font-semibold">Blender B-102</p>
                                <p className="text-sm text-gray-500">Cleaned by E. Davis</p>
                            </div>
                            <button className="bg-green-600 text-white font-semibold text-sm py-1 px-3 rounded-md">Approve</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LineEquipmentView;