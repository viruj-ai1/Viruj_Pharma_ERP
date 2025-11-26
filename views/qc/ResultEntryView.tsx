import React, { useState } from 'react';
import { QC_SAMPLES } from '../../services/mockData';
import { QualitySample, Test } from '../../types';

const ResultEntryView: React.FC = () => {
    const [activeTab, setActiveTab] = useState('pending');

    const testsPendingEntry = QC_SAMPLES.flatMap(s => s.tests.map(t => ({ sample: s, test: t })))
        .filter(item => item.test.status === 'In Progress');
    const completedTests = QC_SAMPLES.flatMap(s => s.tests.map(t => ({ sample: s, test: t })))
        .filter(item => item.test.status === 'Approved' || item.test.status === 'Submitted for Review');
    const returnedTests = QC_SAMPLES.flatMap(s => s.tests.map(t => ({ sample: s, test: t })))
        .filter(item => item.test.status === 'Rejected');

    const renderTable = (data: { sample: QualitySample, test: Test }[], actionText: string) => (
        <table className="min-w-full">
            <thead className="bg-gray-50"><tr>
                <th className="p-3 text-left text-xs font-semibold uppercase">Test Name</th>
                <th className="p-3 text-left text-xs font-semibold uppercase">Sample ID</th>
                <th className="p-3 text-left text-xs font-semibold uppercase">Status</th>
                <th className="p-3"></th>
            </tr></thead>
            <tbody>
                {data.map(({ sample, test }) => (
                    <tr key={`${sample.id}-${test.name}`} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-semibold">{test.name}</td>
                        <td className="p-3">{sample.id}</td>
                        <td className="p-3">{test.status}</td>
                        <td className="p-3 text-right">
                            <button className="text-primary-600 font-semibold text-sm">{actionText}</button>
                        </td>
                    </tr>
                ))}
                {data.length === 0 && (
                    <tr><td colSpan={4} className="text-center p-6 text-gray-500">No tests in this category.</td></tr>
                )}
            </tbody>
        </table>
    );

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Result Entry & Raw Data Upload</h1>
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    <button onClick={() => setActiveTab('pending')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'pending' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Pending Result Entry</button>
                    <button onClick={() => setActiveTab('completed')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'completed' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Completed & Submitted</button>
                    <button onClick={() => setActiveTab('returned')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'returned' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Returned for Correction</button>
                </nav>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                {activeTab === 'pending' && renderTable(testsPendingEntry, 'Enter Data')}
                {activeTab === 'completed' && renderTable(completedTests, 'View')}
                {activeTab === 'returned' && renderTable(returnedTests, 'Correct Data')}
            </div>
        </div>
    );
};

export default ResultEntryView;
