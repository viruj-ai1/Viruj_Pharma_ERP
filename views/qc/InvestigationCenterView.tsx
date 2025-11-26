import React, { useState } from 'react';
import { DEVIATIONS } from '../../services/mockData';
import { Deviation } from '../../types';

const InvestigationCenterView: React.FC = () => {
    const [activeTab, setActiveTab] = useState('oos');

    const pendingFinalApproval = DEVIATIONS.filter(d => d.status === 'Pending Final Approval');

    const renderDashboard = () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold text-gray-700">Phase I Pending</h3>
                <p className="text-3xl font-bold">2</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold text-gray-700">Phase II Pending</h3>
                <p className="text-3xl font-bold">1</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold text-gray-700">Pending Final Closure</h3>
                <p className="text-3xl font-bold">{pendingFinalApproval.length}</p>
            </div>
            <div className="md:col-span-3 bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold mb-4">Investigations Awaiting Final Closure</h3>
                {pendingFinalApproval.map(d => (
                    <div key={d.id} className="p-3 bg-gray-50 rounded-md flex justify-between items-center">
                        <p>{d.id}: {d.title}</p>
                        <button className="text-primary-600 font-semibold text-sm">Review & Close</button>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Investigation Center</h1>
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    <button onClick={() => setActiveTab('oos')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'oos' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>OOS Dashboard</button>
                    <button onClick={() => setActiveTab('oot')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'oot' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>OOT Investigations</button>
                    <button onClick={() => setActiveTab('deviations')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'deviations' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Deviations</button>
                </nav>
            </div>
            {renderDashboard()}
        </div>
    );
};

export default InvestigationCenterView;