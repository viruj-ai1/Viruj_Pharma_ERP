import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { DEVIATIONS } from '../../services/mockData';
import { Department } from '../../types';

const DeviationsQCView: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('report');
    if (!user) return null;
    
    const myInvestigations = DEVIATIONS.filter(d => d.assignedTo === user.id && d.status === 'Investigation');

    const renderContent = () => {
        switch (activeTab) {
            case 'report':
                return (
                    <div className="space-y-4 max-w-2xl mx-auto">
                        <h2 className="text-xl font-semibold text-center">Report an Out-of-Specification / Out-of-Trend Event</h2>
                        <div>
                            <label className="block text-sm font-medium">Test & Sample Details</label>
                            <input type="text" className="mt-1 w-full p-2 border rounded-md" placeholder="e.g., Assay for samp-002" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium">Initial Observation</label>
                            <textarea rows={4} className="mt-1 w-full p-2 border rounded-md" placeholder="Describe the event..."></textarea>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium">Attachments</label>
                            <button className="w-full text-sm p-4 border-2 border-dashed rounded-md hover:bg-gray-50">Attach Raw Data</button>
                            <button className="w-full text-sm p-4 border-2 border-dashed rounded-md hover:bg-gray-50">Attach Instrument Screenshot</button>
                        </div>
                        <div className="text-right">
                            <button className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg">Submit to Manager</button>
                        </div>
                    </div>
                );
            case 'investigations':
                return (
                    <div className="space-y-3">
                        {myInvestigations.map(dev => (
                            <div key={dev.id} className="p-4 bg-gray-50 rounded-md flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{dev.title}</p>
                                    <p className="text-sm text-gray-500">For Batch {dev.batchNumber}, Raised on {dev.dateOpened}</p>
                                </div>
                                <button className="bg-blue-600 text-white font-semibold py-1 px-3 rounded-md text-sm">Respond</button>
                            </div>
                        ))}
                         {myInvestigations.length === 0 && <p className="text-gray-500 text-center p-4">No open investigations assigned to you.</p>}
                    </div>
                );
        }
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Deviations / OOS / OOT</h1>
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    <button onClick={() => setActiveTab('report')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'report' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Report an OOS/OOT</button>
                    <button onClick={() => setActiveTab('investigations')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'investigations' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>My Open Investigations ({myInvestigations.length})</button>
                </nav>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                {renderContent()}
            </div>
        </div>
    );
};

export default DeviationsQCView;
