import React from 'react';
import { QC_INSTRUMENTS } from '../../services/mockData';
import { QCInstrument } from '../../types';

const InstrumentControlView: React.FC = () => {
    
    const statusColors: { [key in QCInstrument['status']]: string } = {
        'Ready': 'bg-green-100 text-green-800',
        'In Use': 'bg-blue-100 text-blue-800',
        'Calibration Due': 'bg-yellow-100 text-yellow-800',
        'Out-of-Service': 'bg-red-100 text-red-800',
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Instrument & Calibration Control</h1>
             <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <h2 className="text-xl font-semibold p-4 border-b">Instrument Master List</h2>
                <table className="min-w-full">
                    <thead className="bg-gray-50"><tr>
                        <th className="p-3 text-left">Instrument</th>
                        <th className="p-3 text-left">Status</th>
                        <th className="p-3 text-left">Actions</th>
                    </tr></thead>
                    <tbody>
                        {QC_INSTRUMENTS.map(inst => (
                            <tr key={inst.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-semibold">{inst.name} ({inst.type})</td>
                                <td className="p-3"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[inst.status]}`}>{inst.status}</span></td>
                                <td className="p-3 space-x-2 text-xs font-medium">
                                    <button className="text-blue-600">Certify Calibration</button>
                                    <button className="text-red-600">Declare Out-of-Service</button>
                                    <button className="text-green-600">Approve Back to Service</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InstrumentControlView;