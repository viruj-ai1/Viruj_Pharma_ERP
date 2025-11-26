import React, { useState } from 'react';
import { QC_STANDARDS } from '../../services/mockData';
import { QCStandard } from '../../types';

const ConsumptionModal: React.FC<{ standard: QCStandard, onClose: () => void }> = ({ standard, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Log Consumption for {standard.name}</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Weight/Volume Taken</label>
                        <input type="number" className="mt-1 w-full p-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Purpose (Sample ID / Test ID)</label>
                        <input type="text" className="mt-1 w-full p-2 border rounded-md" />
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md text-sm">Cancel</button>
                    <button onClick={onClose} className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm">Log Consumption</button>
                </div>
            </div>
        </div>
    )
}

const StandardsReagentsView: React.FC = () => {
    const [activeTab, setActiveTab] = useState('available');
    const [loggingStandard, setLoggingStandard] = useState<QCStandard | null>(null);
    const expiringSoon = QC_STANDARDS.filter(s => new Date(s.validity) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000));

    return (
        <div>
            {loggingStandard && <ConsumptionModal standard={loggingStandard} onClose={() => setLoggingStandard(null)} />}
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Standards & Reagents</h1>
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    <button onClick={() => setActiveTab('available')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'available' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Available Standards</button>
                    <button onClick={() => setActiveTab('alerts')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'alerts' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Expiry Alerts ({expiringSoon.length})</button>
                </nav>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50"><tr>
                        <th className="p-3 text-left">Name</th><th className="p-3 text-left">Type</th><th className="p-3 text-left">Validity</th><th className="p-3 text-left">Quantity</th><th className="p-3"></th>
                    </tr></thead>
                    <tbody>
                        {(activeTab === 'available' ? QC_STANDARDS : expiringSoon).map(std => (
                            <tr key={std.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-semibold">{std.name}</td>
                                <td className="p-3">{std.type}</td>
                                <td className="p-3">{std.validity}</td>
                                <td className="p-3">{std.quantity} {std.unit}</td>
                                <td className="p-3 text-right">
                                    <button onClick={() => setLoggingStandard(std)} className="text-primary-600 font-semibold text-sm">Issue / Consume</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StandardsReagentsView;
