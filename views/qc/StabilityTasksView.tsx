import React, { useState } from 'react';
import { QC_SAMPLES } from '../../services/mockData';
import { QualitySample } from '../../types';

const PullWindowModal: React.FC<{ sample: QualitySample, onClose: () => void }> = ({ sample, onClose }) => {
    return (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Stability Pull for {sample.batchNumber}</h2>
                <div className="space-y-3 bg-gray-50 p-4 rounded-md border">
                    <h3 className="font-semibold text-gray-700">Pull Checklist</h3>
                    <label className="flex items-center"><input type="checkbox" className="h-4 w-4 rounded mr-2" /> Chamber opening procedure followed.</label>
                    <label className="flex items-center"><input type="checkbox" className="h-4 w-4 rounded mr-2" /> Sample condition checked and found satisfactory.</label>
                    <label className="flex items-center"><input type="checkbox" className="h-4 w-4 rounded mr-2" /> Sample correctly labeled post-pull.</label>
                    <label className="flex items-center"><input type="checkbox" className="h-4 w-4 rounded mr-2" /> Sample transferred to QC lab.</label>
                </div>
                <div className="mt-6 flex justify-between items-center">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md text-sm">Cancel</button>
                    <button onClick={onClose} className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm">Mark Pulled & Sent for Testing</button>
                </div>
            </div>
        </div>
    );
}

const StabilityTasksView: React.FC = () => {
    const [activeTab, setActiveTab] = useState('pulls');
    const [pullingSample, setPullingSample] = useState<QualitySample | null>(null);
    const stabilitySamples = QC_SAMPLES.filter(s => s.sampleType === 'Stability');

    return (
        <div>
            {pullingSample && <PullWindowModal sample={pullingSample} onClose={() => setPullingSample(null)} />}
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Stability Tasks</h1>
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    <button onClick={() => setActiveTab('pulls')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'pulls' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Stability Pulls Assigned</button>
                    <button onClick={() => setActiveTab('testing')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'testing' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Stability Test Execution</button>
                </nav>
            </div>
            {activeTab === 'pulls' && (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full">
                        <thead className="bg-gray-50"><tr>
                            <th className="p-3 text-left">Product</th>
                            <th className="p-3 text-left">Batch #</th>
                            <th className="p-3 text-left">Pull Date</th>
                            <th className="p-3"></th>
                        </tr></thead>
                        <tbody>
                            {stabilitySamples.map(sample => (
                                <tr key={sample.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3 font-semibold">{sample.productName}</td>
                                    <td className="p-3 font-mono">{sample.batchNumber}</td>
                                    <td className="p-3">{sample.sampleDate}</td>
                                    <td className="p-3 text-right"><button onClick={() => setPullingSample(sample)} className="text-primary-600 font-semibold text-sm">Perform Pull</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
             {activeTab === 'testing' && (
                <div className="p-6 bg-white rounded-lg shadow-md text-center">
                    <p className="text-gray-600">Stability test execution follows the same workflow as the main <span className="font-semibold">Testing Bench</span>.</p>
                </div>
            )}
        </div>
    );
};

export default StabilityTasksView;
