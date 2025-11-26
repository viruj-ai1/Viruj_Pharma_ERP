import React, { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { QC_SAMPLES, USERS } from '../../services/mockData';
import { QualitySample, Test } from '../../types';

const ReviewWindow: React.FC<{ item: { sample: QualitySample, test: Test }, onClose: () => void, onAction: (sampleId: string, testName: string, action: 'Approve' | 'Reject', notes: string) => void }> = ({ item, onClose, onAction }) => {
    const { sample, test } = item;
    const [notes, setNotes] = useState('');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-3xl">
                <h2 className="text-2xl font-bold mb-4">Review Test: {test.name}</h2>
                <p className="mb-4 text-gray-500">For Sample {sample.id} ({sample.productName})</p>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border mb-4">
                    <div><p className="text-sm">Analyst:</p> <p className="font-semibold">{USERS.find(u => u.id === sample.analystId)?.name}</p></div>
                    <div><p className="text-sm">Submitted On:</p> <p className="font-semibold">{test.submittedOn}</p></div>
                    <div className="col-span-2"><p className="text-sm">Raw Data:</p> <div className="p-8 text-center bg-gray-200 rounded-md mt-1">Raw Data Viewer Placeholder</div></div>
                </div>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4} placeholder="Add review comments..." className="w-full p-2 border rounded-md"></textarea>
                <div className="mt-6 flex justify-between">
                    <div>
                        <button className="px-4 py-2 bg-blue-100 text-blue-800 rounded-md text-sm hover:bg-blue-200">Query Analyst</button>
                    </div>
                    <div className="space-x-3">
                        <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
                        <button onClick={() => onAction(sample.id, test.name, 'Reject', notes)} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Reject</button>
                        <button onClick={() => onAction(sample.id, test.name, 'Approve', notes)} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Approve</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const QCTestReviewView: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('pending');
    const [samples, setSamples] = useState(QC_SAMPLES);
    const [reviewingItem, setReviewingItem] = useState<{ sample: QualitySample, test: Test } | null>(null);

    const handleAction = (sampleId: string, testName: string, action: 'Approve' | 'Reject', notes: string) => {
        setSamples(prevSamples => prevSamples.map(s => {
            if (s.id === sampleId) {
                return {
                    ...s,
                    tests: s.tests.map(t => {
                        if (t.name === testName) {
                            return {
                                ...t,
                                status: action === 'Approve' ? 'Approved' : 'Rejected',
                                reviewedBy: user?.id,
                                managerNotes: notes
                            };
                        }
                        return t;
                    })
                };
            }
            return s;
        }));
        setReviewingItem(null);
    };
    
    const testsForReview = useMemo(() => {
        return samples.flatMap(s => s.tests.map(t => ({ sample: s, test: t })))
                      .filter(item => item.test.status === 'Submitted for Review');
    }, [samples]);
    
    const reviewedTests = useMemo(() => {
        return samples.flatMap(s => s.tests.map(t => ({ sample: s, test: t })))
                      .filter(item => item.test.status === 'Approved' || item.test.status === 'Rejected');
    }, [samples]);

    const renderTable = (data: { sample: QualitySample, test: Test }[]) => (
         <table className="min-w-full">
            <thead className="bg-gray-50"><tr>
                <th className="p-3 text-left text-xs font-semibold uppercase">Test</th>
                <th className="p-3 text-left text-xs font-semibold uppercase">Sample ID</th>
                <th className="p-3 text-left text-xs font-semibold uppercase">Analyst</th>
                <th className="p-3 text-left text-xs font-semibold uppercase">Submitted On</th>
                <th className="p-3 text-left text-xs font-semibold uppercase">Status</th>
                <th className="p-3"></th>
            </tr></thead>
            <tbody>
                {data.map(({ sample, test }) => (
                    <tr key={`${sample.id}-${test.name}`} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-semibold">{test.name}</td>
                        <td className="p-3">{sample.id}</td>
                        <td className="p-3">{USERS.find(u => u.id === sample.analystId)?.name}</td>
                        <td className="p-3">{test.submittedOn}</td>
                        <td className="p-3 text-sm font-semibold">{test.status}</td>
                        <td className="p-3 text-right">
                            {test.status === 'Submitted for Review' && 
                                <button onClick={() => setReviewingItem({ sample, test })} className="text-sm font-semibold bg-primary-600 text-white px-3 py-1 rounded-md hover:bg-primary-700">Review</button>
                            }
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    return (
        <div>
            {reviewingItem && <ReviewWindow item={reviewingItem} onClose={() => setReviewingItem(null)} onAction={handleAction} />}
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Test Review & Approval</h1>
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    <button onClick={() => setActiveTab('pending')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'pending' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Pending Review ({testsForReview.length})</button>
                    <button onClick={() => setActiveTab('reviewed')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'reviewed' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Reviewed Tests</button>
                </nav>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                {activeTab === 'pending' && renderTable(testsForReview)}
                {activeTab === 'reviewed' && renderTable(reviewedTests)}
            </div>
        </div>
    );
};

export default QCTestReviewView;