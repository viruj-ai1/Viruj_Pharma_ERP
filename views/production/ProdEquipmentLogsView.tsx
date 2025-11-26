import React, { useState } from 'react';

const ProdEquipmentLogsView: React.FC = () => {
    const [activeTab, setActiveTab] = useState('usage');

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Equipment Usage & Cleaning Logs</h1>
             <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    <button onClick={() => setActiveTab('usage')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'usage' ? 'border-primary-500 text-primary-600' : 'border-transparent'}`}>Usage Log</button>
                    <button onClick={() => setActiveTab('cleaning')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'cleaning' ? 'border-primary-500 text-primary-600' : 'border-transparent'}`}>Cleaning Log</button>
                </nav>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
                <h2 className="text-xl font-semibold mb-4">Log {activeTab === 'usage' ? 'Usage' : 'Cleaning'} for R-101</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Observations</label>
                        <textarea rows={4} className="mt-1 w-full p-2 border rounded-md"></textarea>
                    </div>
                    <div className="text-right">
                        <button className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg">Submit Log</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProdEquipmentLogsView;