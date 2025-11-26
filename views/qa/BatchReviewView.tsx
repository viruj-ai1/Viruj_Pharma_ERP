import React, { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { PRODUCTION_BATCHES, DEVIATIONS, USERS } from '../../services/mockData';
import { QAReleaseStatus, ProductionBatch, BMRStep, Role } from '../../types';

const calculateReviewProgress = (batch: ProductionBatch): number => {
    const bmrSteps = batch.bmrSteps || [];
    if (bmrSteps.length === 0) return 0;
    const verifiedSteps = bmrSteps.filter(s => s.status === 'Verified').length;
    return Math.round((verifiedSteps / bmrSteps.length) * 100);
}

const BatchReviewDetailScreen: React.FC<{ 
    batch: ProductionBatch; 
    onBack: () => void; 
    onUpdateBmrStep: (batchId: string, stepName: string, status: BMRStep['status']) => void;
}> = ({ batch, onBack, onUpdateBmrStep }) => {
    const linkedDeviations = DEVIATIONS.filter(d => d.batchNumber === batch.batchNumber);
    const bmrSteps = batch.bmrSteps || [];
    
    const getStatusColor = (status: string) => {
        if (status === 'Verified') return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-400' };
        if (status === 'Clarification') return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-400' };
        if (status === 'Missing') return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-400' };
        return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' };
    }

    const isBmrComplete = bmrSteps.every(s => s.status === 'Verified');
    const areDeviationsClosed = linkedDeviations.every(d => d.status === 'Closed');

    const checklistItems = [
        { label: 'BMR Complete', checked: isBmrComplete, details: isBmrComplete ? "All BMR steps verified." : "Pending BMR step verification." },
        { label: 'Deviations Closed/Assessed', checked: areDeviationsClosed, details: areDeviationsClosed ? "All linked deviations are closed." : `${linkedDeviations.filter(d=>d.status !== 'Closed').length} open deviation(s).` },
    ];
    const isReadyForSubmission = checklistItems.every(item => item.checked);

    return (
        <div>
            <button onClick={onBack} className="mb-4 text-primary-600 hover:underline flex items-center text-sm">
                &larr; Back to Batch List
            </button>
            <div className={`p-4 rounded-lg mb-6 ${isReadyForSubmission ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <p className="font-bold">{isReadyForSubmission ? 'Ready for Submission' : 'Action Required'}</p>
                <p className="text-sm">{isReadyForSubmission ? 'All checks have passed. This batch can be submitted to the QA Head.' : 'One or more checklist items have not been met.'}</p>
            </div>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Batch Review: {batch.batchNumber}</h1>
                    <p className="text-gray-500">{batch.productName}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">BMR Step Verification</h3>
                        <div className="space-y-2">
                            {bmrSteps.map(step => (
                                <div key={step.name} className={`p-3 rounded-md border-l-4 ${getStatusColor(step.status).bg} ${getStatusColor(step.status).border}`}>
                                    <div className="flex justify-between items-center">
                                        <span>{step.name}</span>
                                        <div className="flex items-center space-x-2">
                                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(step.status).bg} ${getStatusColor(step.status).text}`}>{step.status}</span>
                                            {step.status !== 'Verified' && <button onClick={() => onUpdateBmrStep(batch.id, step.name, 'Verified')} className="text-xs font-semibold bg-green-200 text-green-800 px-2 py-1 rounded hover:bg-green-300">Verify</button>}
                                            {step.status !== 'Clarification' && <button onClick={() => onUpdateBmrStep(batch.id, step.name, 'Clarification')} className="text-xs font-semibold bg-yellow-200 text-yellow-800 px-2 py-1 rounded hover:bg-yellow-300">Clarify</button>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Completion Checklist</h3>
                        <div className="space-y-3">
                             {checklistItems.map(item => (
                                <div key={item.label} className="flex items-start">
                                    <input type="checkbox" checked={item.checked} disabled className="h-5 w-5 mt-0.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-not-allowed" />
                                    <div className="ml-2">
                                        <span className="text-gray-700 text-sm font-semibold">{item.label}</span>
                                        <p className="text-xs text-gray-500">{item.details}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                     <div className="bg-white p-6 rounded-lg shadow-md">
                         <button 
                            disabled={!isReadyForSubmission}
                            className="w-full bg-primary-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-700 transition duration-300 shadow-md hover:shadow-lg hover:-translate-y-px disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none">
                            Submit to QA Head for Release Decision
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


const BatchReviewView: React.FC = () => {
    const { user } = useAuth();
    const [batches, setBatches] = useState<ProductionBatch[]>(PRODUCTION_BATCHES);
    const [selectedBatch, setSelectedBatch] = useState<ProductionBatch | null>(null);
    const [activeTab, setActiveTab] = useState('in-review');
    const [assignments, setAssignments] = useState<Record<string, string>>({});
    
    if (!user) return null;
    
    const qaOperators = USERS.filter(u => u.role === Role.QA_Operator);

    const handleAssignOfficer = (batchId: string) => {
        const officerId = assignments[batchId];
        if (!officerId) return;
        setBatches(currentBatches => 
            currentBatches.map(b => b.id === batchId ? { ...b, qaOfficerId: officerId } : b)
        );
        // Clear the assignment dropdown for this batch after assigning
        setAssignments(prev => {
            const newAssignments = {...prev};
            delete newAssignments[batchId];
            return newAssignments;
        });
    };

    const handleBmrStepUpdate = (batchId: string, stepName: string, newStatus: BMRStep['status']) => {
        const updateSteps = (steps: BMRStep[] | undefined) => {
            if (!steps) return [];
            return steps.map(step => step.name === stepName ? { ...step, status: newStatus } : step);
        }
        
        setBatches(currentBatches => 
            currentBatches.map(b => b.id === batchId ? { ...b, bmrSteps: updateSteps(b.bmrSteps) } : b)
        );

        setSelectedBatch(prev => prev ? {...prev, bmrSteps: updateSteps(prev.bmrSteps)} : null);
    };

    const batchesForAssignment = batches.filter(b => !b.qaOfficerId && b.plantId === user.plantId);
    const batchesInReview = batches.filter(b => !!b.qaOfficerId && b.plantId === user.plantId);
    
    const getDeviationCount = (batchNumber: string) => DEVIATIONS.filter(d => d.batchNumber === batchNumber && d.status !== 'Closed').length;

    if (selectedBatch) {
        const fullBatchData = batches.find(b => b.id === selectedBatch.id);
        if (fullBatchData) {
            return <BatchReviewDetailScreen batch={fullBatchData} onBack={() => setSelectedBatch(null)} onUpdateBmrStep={handleBmrStepUpdate} />
        }
    }
    
    const renderTabContent = () => {
        switch (activeTab) {
            case 'assignment':
                return (
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <table className="min-w-full">
                            <thead className="bg-gray-50"><tr><th className="p-3 text-left">Batch ID</th><th className="p-3 text-left">Product</th><th className="p-3 text-left">Assign To</th><th className="p-3"></th></tr></thead>
                            <tbody>
                                {batchesForAssignment.map(batch => (
                                    <tr key={batch.id} className="border-b">
                                        <td className="p-3 font-semibold">{batch.batchNumber}</td>
                                        <td className="p-3">{batch.productName}</td>
                                        <td className="p-3">
                                            <select 
                                                value={assignments[batch.id] || ''} 
                                                onChange={e => setAssignments({...assignments, [batch.id]: e.target.value})}
                                                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                                            >
                                                <option value="" disabled>Select Officer</option>
                                                {qaOperators.map(op => <option key={op.id} value={op.id}>{op.name}</option>)}
                                            </select>
                                        </td>
                                        <td className="p-3 text-right">
                                            <button onClick={() => handleAssignOfficer(batch.id)} disabled={!assignments[batch.id]} className="bg-blue-600 text-white font-semibold py-1 px-3 rounded-md text-sm disabled:bg-gray-400">Assign</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            case 'in-review':
                return (
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full leading-normal">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase">Batch ID</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase">Review %</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase">Deviations</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase">Officer</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {batchesInReview.map(batch => {
                                        const progress = calculateReviewProgress(batch);
                                        return (
                                        <tr key={batch.id} className="hover:bg-gray-50">
                                            <td className="px-5 py-4 border-b border-gray-200 text-sm"><p className="font-semibold">{batch.batchNumber}</p><p className="text-xs text-gray-500">{batch.productName}</p></td>
                                            <td className="px-5 py-4 border-b border-gray-200 text-sm w-40">
                                                <div className="w-full bg-gray-200 rounded-full h-2.5"><div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div></div>
                                                <p className="text-xs text-right text-gray-500">{progress}%</p>
                                            </td>
                                            <td className="px-5 py-4 border-b border-gray-200 text-sm">{getDeviationCount(batch.batchNumber)}</td>
                                            <td className="px-5 py-4 border-b border-gray-200 text-sm">{USERS.find(u => u.id === batch.qaOfficerId)?.name}</td>
                                            <td className="px-5 py-4 border-b border-gray-200 text-sm text-right">
                                                <button onClick={() => setSelectedBatch(batch)} className="text-primary-600 font-semibold hover:underline">Open Review</button>
                                            </td>
                                        </tr>
                                    )})}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            default:
                 return <div className="text-center py-12 bg-white rounded-lg shadow-md"><p className="text-gray-500">This module is under construction.</p></div>;
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Batch Review</h1>
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  <button onClick={() => setActiveTab('in-review')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'in-review' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Batches in Review ({batchesInReview.length})</button>
                  <button onClick={() => setActiveTab('assignment')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'assignment' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Officer Assignment ({batchesForAssignment.length})</button>
                  <button onClick={() => setActiveTab('queries')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'queries' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Queries (0)</button>
              </nav>
            </div>
            {renderTabContent()}
        </div>
    );
};

export default BatchReviewView;