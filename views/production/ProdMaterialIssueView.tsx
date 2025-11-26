import React, { useState } from 'react';
import { MATERIALS } from '../../services/mockData';

const ProdMaterialIssueView: React.FC = () => {
    const [activeTab, setActiveTab] = useState('request');

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Material Issue / Consumption</h1>
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    <button onClick={() => setActiveTab('request')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'request' ? 'border-primary-500 text-primary-600' : 'border-transparent'}`}>Issue Request</button>
                    <button onClick={() => setActiveTab('log')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'log' ? 'border-primary-500 text-primary-600' : 'border-transparent'}`}>Consumption Log</button>
                </nav>
            </div>
            {activeTab === 'request' && (
                <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
                    <h2 className="text-xl font-semibold mb-4">Request Additional Material</h2>
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">Material</label>
                            <select className="mt-1 w-full p-2 border rounded-md bg-white">
                                {MATERIALS.filter(m => m.type === 'Raw Material').map(m => <option key={m.id}>{m.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Required Quantity</label>
                            <input type="number" className="mt-1 w-full p-2 border rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Reason</label>
                            <textarea className="mt-1 w-full p-2 border rounded-md" placeholder="e.g., Spillage, extra requirement..."></textarea>
                        </div>
                        <div className="text-right">
                            <button type="submit" className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg">Submit Request</button>
                        </div>
                    </form>
                </div>
            )}
             {activeTab === 'log' && (
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <p>Consumption Log module coming soon.</p>
                </div>
            )}
        </div>
    );
};

export default ProdMaterialIssueView;