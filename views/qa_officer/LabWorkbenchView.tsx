import React, { useState, useMemo } from 'react';
import { USERS, QC_SAMPLES } from '../../services/mockData';
import { QualitySample, QcStatus } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

const qcStatusColors: { [key in QcStatus]: string } = {
    [QcStatus.Pending]: 'bg-gray-200 text-gray-800',
    [QcStatus.InProgress]: 'bg-blue-200 text-blue-800',
    [QcStatus.Passed]: 'bg-green-200 text-green-800',
    [QcStatus.Failed]: 'bg-red-200 text-red-800',
    [QcStatus.Submitted]: 'bg-purple-200 text-purple-800',
    [QcStatus.SubmittedForReview]: 'bg-indigo-200 text-indigo-800',
    [QcStatus.Approved]: 'bg-teal-200 text-teal-800',
    [QcStatus.Rejected]: 'bg-pink-200 text-pink-800',
};


const TestExecutionScreen: React.FC<{ sample: QualitySample; onBack: () => void; onSubmit: (sampleId: string) => void; }> = ({ sample, onBack, onSubmit }) => {

    const handleESignAndSubmit = () => {
        const password = window.prompt("To sign and submit, please re-enter your password.");
        if (password === 'demo123') {
            alert(`eSignature captured. Results for ${sample.id} submitted for review.`);
            onSubmit(sample.id);
        } else if (password !== null) {
            alert("Invalid password. Submission cancelled.");
        }
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <button onClick={onBack} className="mb-4 text-primary-600 hover:underline flex items-center text-sm">
                &larr; Back to Test Queue
            </button>
            <div className="border-b pb-4 mb-4">
                <h2 className="text-2xl font-bold">Test Execution: {sample.id.toUpperCase()}</h2>
                <p className="text-gray-500">{sample.productName} - Batch: {sample.batchNumber}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Assay (%)</label>
                        <input type="number" placeholder="98.0 - 102.0" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Related Substances (%)</label>
                        <input type="number" placeholder="< 0.5" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Appearance</label>
                         <select className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                            <option>Pass</option>
                            <option>Fail</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Comments</label>
                        <textarea rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" placeholder="Add any notes for the reviewer..."></textarea>
                    </div>
                </div>
                <div className="space-y-4">
                     <div className="bg-gray-50 p-4 rounded-lg border">
                        <h3 className="font-semibold mb-2 text-gray-700">Instrument Data</h3>
                        <button className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-100 transition-colors">
                             <span className="text-gray-500">Attach instrument file (e.g., CSV, PDF)</span>
                        </button>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border">
                        <h3 className="font-semibold mb-2 text-gray-700">Attachments</h3>
                        <button className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-100 transition-colors">
                             <span className="text-gray-500">Attach photos or raw data files</span>
                        </button>
                    </div>
                </div>
            </div>
            <div className="mt-6 pt-6 border-t flex justify-end space-x-3">
                <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Save Draft</button>
                <button onClick={handleESignAndSubmit} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">eSign & Submit for Review</button>
            </div>
        </div>
    )
}

const LabWorkbenchView: React.FC = () => {
    const { user } = useAuth();
    const [samples, setSamples] = useState<QualitySample[]>(QC_SAMPLES);
    const [selectedSample, setSelectedSample] = useState<QualitySample | null>(null);

    const mySamples = useMemo(() => {
        if (!user) return [];
        return samples.filter(s => (s.analystId === user.id || !s.analystId) && s.status !== QcStatus.Passed);
    }, [user, samples]);

    const handleStartTest = (sampleId: string) => {
        setSamples(prev => prev.map(s => s.id === sampleId ? { ...s, status: QcStatus.InProgress, analystId: user!.id } : s));
        const sampleToOpen = samples.find(s => s.id === sampleId);
        if (sampleToOpen) {
            setSelectedSample({ ...sampleToOpen, status: QcStatus.InProgress, analystId: user!.id });
        }
    };
    
    const handleSubmitTest = (sampleId: string) => {
        setSamples(prev => prev.map(s => s.id === sampleId ? { ...s, status: QcStatus.Passed } : s)); // Simplified: Assume always pass
        setSelectedSample(null);
    }

    if (selectedSample) {
        return <TestExecutionScreen sample={selectedSample} onBack={() => setSelectedSample(null)} onSubmit={handleSubmitTest} />;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Lab Workbench</h1>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-semibold">Test Queue</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Sample ID</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Product / Batch</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Analyst</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {mySamples.length > 0 ? mySamples.map(sample => (
                                <tr key={sample.id}>
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm font-semibold">{sample.id.toUpperCase()}</td>
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm">{sample.productName}<br/><span className="text-xs text-gray-500">{sample.batchNumber}</span></td>
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm"><span className={`px-2 py-1 text-xs rounded-full ${qcStatusColors[sample.status]}`}>{sample.status}</span></td>
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm">{USERS.find(u => u.id === sample.analystId)?.name || 'Unassigned'}</td>
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm text-right">
                                        {sample.status === QcStatus.Pending && <button onClick={() => handleStartTest(sample.id)} className="font-semibold text-primary-600 hover:text-primary-800">Start Test</button>}
                                        {sample.status === QcStatus.InProgress && sample.analystId === user?.id && <button onClick={() => setSelectedSample(sample)} className="font-semibold text-green-600 hover:text-green-800">Enter Results</button>}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-10 text-gray-500">No samples in your queue.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LabWorkbenchView;