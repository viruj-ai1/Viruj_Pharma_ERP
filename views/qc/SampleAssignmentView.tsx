import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { QC_SAMPLES, USERS } from '../../services/mockData';
import { QcStatus } from '../../types';

const statusColors: { [key in QcStatus]: string } = {
    [QcStatus.Pending]: 'bg-gray-100 text-gray-800',
    [QcStatus.InProgress]: 'bg-blue-100 text-blue-800',
    [QcStatus.Passed]: 'bg-green-100 text-green-800',
    [QcStatus.Failed]: 'bg-red-100 text-red-800',
    [QcStatus.Submitted]: 'bg-purple-100 text-purple-800',
    [QcStatus.SubmittedForReview]: 'bg-indigo-100 text-indigo-800',
    [QcStatus.Approved]: 'bg-teal-100 text-teal-800',
    [QcStatus.Rejected]: 'bg-pink-100 text-pink-800',
};

const SampleAssignmentView: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('assigned');
    if (!user) return null;

    const mySamples = QC_SAMPLES.filter(s => s.analystId === user.id);
    
    const renderTable = (samples: typeof QC_SAMPLES) => (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full leading-normal">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase">Sample ID</th>
                            <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase">Batch No</th>
                            <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase">Type</th>
                            <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase">Tests</th>
                            <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase">Due Date</th>
                            <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase">Status</th>
                            <th className="px-5 py-3 border-b-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {samples.map(sample => (
                            <tr key={sample.id} className="hover:bg-gray-50">
                                <td className="px-5 py-4 border-b text-sm"><p className="font-semibold">{sample.id}</p><p className="text-xs text-gray-500">{sample.productName}</p></td>
                                <td className="px-5 py-4 border-b text-sm font-mono">{sample.batchNumber}</td>
                                <td className="px-5 py-4 border-b text-sm">{sample.sampleType}</td>
                                <td className="px-5 py-4 border-b text-sm">{sample.tests.length}</td>
                                <td className="px-5 py-4 border-b text-sm">{sample.dueDate}</td>
                                <td className="px-5 py-4 border-b text-sm"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[sample.status]}`}>{sample.status}</span></td>
                                <td className="px-5 py-4 border-b text-sm text-right">
                                    {sample.status === QcStatus.Pending && <button className="font-semibold text-primary-600 hover:underline">Start Testing</button>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Sample Assignment</h1>
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    <button onClick={() => setActiveTab('assigned')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'assigned' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Assigned to Me</button>
                    <button onClick={() => setActiveTab('all')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'all' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>All QC Samples (Read-only)</button>
                </nav>
            </div>
            {activeTab === 'assigned' ? renderTable(mySamples) : renderTable(QC_SAMPLES)}
        </div>
    );
};

export default SampleAssignmentView;