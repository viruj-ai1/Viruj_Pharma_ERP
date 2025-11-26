import React, { useState } from 'react';

const InterDeptCommView: React.FC = () => {
    const [activeTab, setActiveTab] = useState('qa');

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Inter-Department Communication</h1>
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    <button onClick={() => setActiveTab('qa')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'qa' ? 'border-primary-500 text-primary-600' : 'border-transparent'}`}>With QA</button>
                    <button onClick={() => setActiveTab('qc')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'qc' ? 'border-primary-500 text-primary-600' : 'border-transparent'}`}>With QC</button>
                    <button onClick={() => setActiveTab('warehouse')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'warehouse' ? 'border-primary-500 text-primary-600' : 'border-transparent'}`}>With Warehouse</button>
                </nav>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Send Escalation to {activeTab.toUpperCase()}</h2>
                <textarea className="w-full p-2 border rounded-md" rows={4} placeholder="Type your message..."></textarea>
                <div className="mt-4 flex justify-end space-x-2">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md">Request Urgent QC Test</button>
                    <button className="px-4 py-2 bg-primary-600 text-white rounded-md">Send Escalation</button>
                </div>
            </div>
        </div>
    );
};

export default InterDeptCommView;