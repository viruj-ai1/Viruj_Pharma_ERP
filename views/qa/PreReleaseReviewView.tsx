import React, { useState } from 'react';
import { PRODUCTION_BATCHES } from '../../services/mockData';

type ChecklistStatus = 'Verified' | 'Pending' | 'Issue';

interface ReviewItem {
    status: ChecklistStatus;
    details: string;
}

const ChecklistItem: React.FC<{ label: string; status: ChecklistStatus; details: string }> = ({ label, status, details }) => {
    const colors = {
        Verified: { bg: 'bg-green-50', border: 'border-green-400', text: 'text-green-800' },
        Pending: { bg: 'bg-yellow-50', border: 'border-yellow-400', text: 'text-yellow-800' },
        Issue: { bg: 'bg-red-50', border: 'border-red-400', text: 'text-red-800' }
    };
    const color = colors[status];
    return (
        <div className={`p-4 rounded-md border-l-4 ${color.bg} ${color.border}`}>
            <div className="flex justify-between items-center">
                <p className="font-semibold text-gray-800">{label}</p>
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${color.text} ${color.bg}`}>{status}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{details}</p>
        </div>
    );
};

const PreReleaseReviewView: React.FC = () => {
    const [selectedBatch, setSelectedBatch] = useState<string>(PRODUCTION_BATCHES[0].id);

    // Mock data collation
    const reviewData: Record<string, ReviewItem> = {
        bmr: { status: 'Verified', details: 'All steps are signed off by Production and QA.' },
        qc: { status: 'Verified', details: 'All in-process and final QC tests passed.' },
        deviations: { status: 'Issue', details: '1 open minor deviation (DEV-004) linked to this batch.' },
        traceability: { status: 'Verified', details: 'All raw material lots traced and verified.' },
        yield: { status: 'Verified', details: 'Final yield (98.5%) is within specification (95-105%).' },
        packaging: { status: 'Pending', details: 'Packaging line clearance records not yet uploaded.' }
    };

    const isReadyForSubmission = Object.values(reviewData).every(item => item.status === 'Verified');

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Pre-Release Review</h1>
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-4 mb-6">
                    <label htmlFor="batch-select" className="text-lg font-semibold">Select Batch for Review:</label>
                    <select
                        id="batch-select"
                        value={selectedBatch}
                        onChange={e => setSelectedBatch(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        {PRODUCTION_BATCHES.map(b => (
                            <option key={b.id} value={b.id}>{b.batchNumber} - {b.productName}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-4">
                    <ChecklistItem label="BMR Review Summary" {...reviewData.bmr} />
                    <ChecklistItem label="QC Result Verification" {...reviewData.qc} />
                    <ChecklistItem label="Deviation Resolution Check" {...reviewData.deviations} />
                    <ChecklistItem label="Material Traceability Overview" {...reviewData.traceability} />
                    <ChecklistItem label="Final Yield Reconciliation" {...reviewData.yield} />
                    <ChecklistItem label="Packaging & Labeling Records" {...reviewData.packaging} />
                </div>

                <div className="mt-8 pt-6 border-t flex flex-col items-end">
                    <p className={`mb-4 font-semibold ${isReadyForSubmission ? 'text-green-600' : 'text-red-600'}`}>
                        {isReadyForSubmission ? 'All checks passed. Ready for QA Head submission.' : 'Some checks have issues or are pending. Cannot submit.'}
                    </p>
                    <button
                        disabled={!isReadyForSubmission}
                        className="bg-primary-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Submit to QA Head for Final Release
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PreReleaseReviewView;