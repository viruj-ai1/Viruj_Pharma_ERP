import React from 'react';
import { QC_INSTRUMENTS } from '../../services/mockData';

const QCInstrumentsManagerView: React.FC = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Instruments & Calibration</h1>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <h2 className="text-xl font-semibold p-4 border-b">Instrument Overview</h2>
                <table className="min-w-full">
                    <thead className="bg-gray-50"><tr>
                        <th className="p-3 text-left text-xs font-semibold uppercase">ID</th>
                        <th className="p-3 text-left text-xs font-semibold uppercase">Type</th>
                        <th className="p-3 text-left text-xs font-semibold uppercase">Status</th>
                        <th className="p-3 text-left text-xs font-semibold uppercase">Assigned Tasks</th>
                        <th className="p-3"></th>
                    </tr></thead>
                    <tbody>
                        {QC_INSTRUMENTS.map(inst => (
                            <tr key={inst.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-semibold">{inst.name}</td>
                                <td className="p-3">{inst.type}</td>
                                <td className="p-3">{inst.status}</td>
                                <td className="p-3">2</td>
                                <td className="p-3 text-right"><button className="text-primary-600 font-semibold text-sm">View Details</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Calibration Requests (Pending Approval)</h2>
                <p className="text-gray-600">No pending calibration requests.</p>
            </div>
        </div>
    );
};

export default QCInstrumentsManagerView;