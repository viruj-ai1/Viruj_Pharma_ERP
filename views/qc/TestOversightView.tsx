import React, { useState, useMemo } from 'react';
import { QC_SAMPLES } from '../../services/mockData';
import { QualitySample, Test } from '../../types';

const TestOversightView: React.FC = () => {
    const [activeTab, setActiveTab] = useState('summary');

    const allTests = useMemo(() => 
        QC_SAMPLES.flatMap(s => s.tests.map(t => ({ sample: s, test: t })))
    , []);

    const statusCounts = useMemo(() => allTests.reduce((acc, { test }) => {
        acc[test.status] = (acc[test.status] || 0) + 1;
        return acc;
    }, {} as Record<Test['status'], number>), [allTests]);

    const returnedTests = useMemo(() => allTests.filter(({ test }) => test.status === 'Rejected'), [allTests]);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Test Oversight</h1>
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    <button onClick={() => setActiveTab('summary')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'summary' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Test Summary</button>
                    <button onClick={() => setActiveTab('returned')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'returned' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Returned/Flagged Tests ({returnedTests.length})</button>
                </nav>
            </div>

            {activeTab === 'summary' && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Plant-Wide Test Status Breakdown</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(statusCounts).map(([status, count]) => (
                            <div key={status} className="bg-gray-50 p-4 rounded-md border text-center">
                                <p className="text-2xl font-bold">{count}</p>
                                <p className="text-sm text-gray-600">{status}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'returned' && (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full">
                        <thead className="bg-gray-50"><tr>
                            <th className="p-3 text-left">Test</th>
                            <th className="p-3 text-left">Sample</th>
                            <th className="p-3 text-left">Reason</th>
                            <th className="p-3"></th>
                        </tr></thead>
                        <tbody>
                            {returnedTests.map(({ sample, test }) => (
                                <tr key={`${sample.id}-${test.name}`} className="border-b hover:bg-gray-50">
                                    <td className="p-3 font-semibold">{test.name}</td>
                                    <td className="p-3">{sample.id}</td>
                                    <td className="p-3 text-sm text-red-600">{test.managerNotes}</td>
                                    <td className="p-3 text-right space-x-2">
                                        <button className="text-xs font-semibold text-blue-600">Approve Manager Action</button>
                                        <button className="text-xs font-semibold text-red-600">Override</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TestOversightView;
