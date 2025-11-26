import React, { useState } from 'react';
import { DEVIATIONS } from '../../services/mockData';
import { Department } from '../../types';

const ProdEventManagerView: React.FC = () => {
    const [activeTab, setActiveTab] = useState('deviations');
    const officerDeviations = DEVIATIONS.filter(d => d.sourceDept === Department.Production && d.status === 'Open');

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Deviation & Event Management</h1>
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    <button onClick={() => setActiveTab('deviations')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'deviations' ? 'border-primary-500 text-primary-600' : 'border-transparent'}`}>Deviations from Officers</button>
                    <button onClick={() => setActiveTab('utility')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'utility' ? 'border-primary-500 text-primary-600' : 'border-transparent'}`}>Utility Events</button>
                    <button onClick={() => setActiveTab('equipment')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'equipment' ? 'border-primary-500 text-primary-600' : 'border-transparent'}`}>Equipment Events</button>
                </nav>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Deviations Raised by Officers ({officerDeviations.length})</h2>
                <div className="space-y-3">
                    {officerDeviations.map(dev => (
                        <div key={dev.id} className="p-3 bg-yellow-50 rounded-md border-l-4 border-yellow-400 flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-yellow-800">{dev.title}</p>
                                <p className="text-sm text-gray-600">For Batch {dev.batchNumber}</p>
                            </div>
                            <button className="bg-blue-600 text-white font-semibold py-1 px-3 rounded-md text-sm">Start Investigation</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProdEventManagerView;