import React, { useState } from 'react';
import { QC_INSTRUMENTS } from '../../services/mockData';
import { QCInstrument } from '../../types';

const UsageLogModal: React.FC<{ instrument: QCInstrument, onClose: () => void }> = ({ instrument, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Usage Log for {instrument.name}</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Run ID Reference</label>
                        <input type="text" className="mt-1 w-full p-2 border rounded-md" placeholder="e.g., HPLC-RUN-20231101-01" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Observations</label>
                        <textarea rows={3} className="mt-1 w-full p-2 border rounded-md" placeholder="e.g., System suitability passed."></textarea>
                    </div>
                </div>
                <div className="mt-6 flex justify-between items-center">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md text-sm">Close</button>
                    <div className="space-x-2">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm">Start Session</button>
                        <button className="px-4 py-2 bg-red-600 text-white rounded-md text-sm">End Session</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const InstrumentsQCView: React.FC = () => {
    const [activeTab, setActiveTab] = useState('assigned');
    const [loggingInstrument, setLoggingInstrument] = useState<QCInstrument | null>(null);

    const statusColors: { [key in QCInstrument['status']]: string } = {
        'Ready': 'bg-green-100 text-green-800',
        'In Use': 'bg-blue-100 text-blue-800',
        'Calibration Due': 'bg-yellow-100 text-yellow-800',
        'Out-of-Service': 'bg-red-100 text-red-800',
    };

    return (
        <div>
            {loggingInstrument && <UsageLogModal instrument={loggingInstrument} onClose={() => setLoggingInstrument(null)} />}
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Instruments</h1>
             <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    <button onClick={() => setActiveTab('assigned')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'assigned' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Instruments Assigned to Me</button>
                    <button onClick={() => setActiveTab('calibration')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'calibration' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Calibration Tasks (1)</button>
                </nav>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50"><tr>
                        <th className="p-3 text-left text-xs font-semibold uppercase">Instrument ID</th>
                        <th className="p-3 text-left text-xs font-semibold uppercase">Type</th>
                        <th className="p-3 text-left text-xs font-semibold uppercase">Status</th>
                        <th className="p-3"></th>
                    </tr></thead>
                    <tbody>
                        {QC_INSTRUMENTS.map(inst => (
                            <tr key={inst.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-semibold">{inst.name}</td>
                                <td className="p-3">{inst.type}</td>
                                <td className="p-3"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[inst.status]}`}>{inst.status}</span></td>
                                <td className="p-3 text-right">
                                    <button onClick={() => setLoggingInstrument(inst)} className="text-primary-600 font-semibold text-sm">Open Usage Log</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InstrumentsQCView;
