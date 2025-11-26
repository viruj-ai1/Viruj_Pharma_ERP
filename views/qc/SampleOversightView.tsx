import React, { useState, useMemo } from 'react';
import { QC_SAMPLES, USERS } from '../../services/mockData';
import { QualitySample, QcStatus } from '../../types';

const DetailModal: React.FC<{ sample: QualitySample; onClose: () => void }> = ({ sample, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">Sample Detail: {sample.id}</h2>
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div><p className="text-gray-500">Product</p><p className="font-semibold">{sample.productName}</p></div>
                    <div><p className="text-gray-500">Batch</p><p className="font-semibold">{sample.batchNumber}</p></div>
                    <div><p className="text-gray-500">Analyst</p><p className="font-semibold">{USERS.find(u => u.id === sample.analystId)?.name || 'N/A'}</p></div>
                    <div><p className="text-gray-500">Status</p><p className="font-semibold">{sample.status}</p></div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border mb-4">
                    <h3 className="font-semibold mb-2">Tests</h3>
                    {sample.tests.map(test => (
                        <div key={test.name} className="flex justify-between items-center text-sm p-2 border-b">
                            <span>{test.name} ({test.method})</span>
                            <span>{test.status}</span>
                        </div>
                    ))}
                </div>
                <div className="mt-6 flex justify-between">
                    <div className="space-x-2">
                        <button className="px-3 py-1 bg-yellow-500 text-white rounded-md text-xs">Override Priority</button>
                        <button className="px-3 py-1 bg-red-500 text-white rounded-md text-xs">Put Batch on Hold</button>
                    </div>
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Close</button>
                </div>
            </div>
        </div>
    )
}

const SampleOversightView: React.FC = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [selectedSample, setSelectedSample] = useState<QualitySample | null>(null);

    const atRiskSamples = useMemo(() => QC_SAMPLES.filter(s => 
        new Date(s.dueDate) < new Date() || s.priority === 'Critical' || s.status === QcStatus.Failed
    ), []);

    const dataToShow = activeTab === 'all' ? QC_SAMPLES : atRiskSamples;

    return (
        <div>
            {selectedSample && <DetailModal sample={selectedSample} onClose={() => setSelectedSample(null)} />}
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Sample Oversight</h1>
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    <button onClick={() => setActiveTab('all')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'all' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>All Samples</button>
                    <button onClick={() => setActiveTab('at-risk')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'at-risk' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>At-Risk Samples ({atRiskSamples.length})</button>
                </nav>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50"><tr>
                        <th className="p-3 text-left">Sample ID</th>
                        <th className="p-3 text-left">Type</th>
                        <th className="p-3 text-left">Status</th>
                        <th className="p-3 text-left">Analyst</th>
                        <th className="p-3 text-left">Manager Review</th>
                        <th className="p-3"></th>
                    </tr></thead>
                    <tbody>
                        {dataToShow.map(sample => (
                            <tr key={sample.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-semibold">{sample.id}</td>
                                <td className="p-3">{sample.sampleType}</td>
                                <td className="p-3">{sample.status}</td>
                                <td className="p-3">{USERS.find(u => u.id === sample.analystId)?.name || 'N/A'}</td>
                                <td className="p-3">{sample.tests.some(t => t.reviewedBy) ? 'Complete' : 'Pending'}</td>
                                <td className="p-3 text-right"><button onClick={() => setSelectedSample(sample)} className="text-primary-600 font-semibold text-sm">View Details</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SampleOversightView;
