import React, { useState } from 'react';
import { QC_SAMPLES } from '../../services/mockData';

const QCAssignmentCenterView: React.FC = () => {
    const [activeTab, setActiveTab] = useState('sample');
    const unassignedSamples = QC_SAMPLES.filter(s => !s.analystId);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Assignment Center</h1>
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    <button onClick={() => setActiveTab('sample')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'sample' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Sample Assignment</button>
                    <button onClick={() => setActiveTab('test')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'test' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Test Assignment</button>
                    <button onClick={() => setActiveTab('workload')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'workload' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Workload Dashboard</button>
                </nav>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                 <h2 className="text-xl font-semibold mb-4">Unassigned Samples Queue</h2>
                 <p className="mb-4 text-gray-600">This is a task-optimized layout to quickly assign pending samples to analysts.</p>
                 <div className="space-y-3">
                    {unassignedSamples.map(sample => (
                        <div key={sample.id} className="p-3 bg-gray-50 rounded-md flex justify-between items-center">
                            <div>
                                <p className="font-semibold">{sample.id}: {sample.productName}</p>
                                <p className="text-sm text-gray-500">{sample.tests.length} tests required</p>
                            </div>
                            <button className="bg-blue-600 text-white font-semibold py-1 px-3 rounded-md text-sm">Assign</button>
                        </div>
                    ))}
                 </div>
            </div>
        </div>
    );
};

export default QCAssignmentCenterView;