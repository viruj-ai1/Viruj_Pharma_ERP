import React, { useState } from 'react';
import { PRODUCTION_BATCHES, DEVIATIONS } from '../../services/mockData';
import { ProductionBatch, BatchStatus, ProductionStage } from '../../types';

const BatchMasterViewModal: React.FC<{ batch: ProductionBatch, onClose: () => void }> = ({ batch, onClose }) => {
    // FIX: A batch has multiple stages. Find the current stage to display its name and progress.
    const currentStage = batch.stages.find(s => s.status === 'Running') || batch.stages.find(s => s.status !== 'Completed') || batch.stages[batch.stages.length - 1];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">Batch Master View: {batch.batchNumber}</h2>
                {/* Details and actions go here */}
                <p>Stage: {currentStage?.name}</p>
                <p>Progress: {currentStage?.progress}%</p>
                <div className="mt-6 flex justify-end space-x-2">
                    <button className="px-4 py-2 bg-yellow-500 text-white rounded-md">Place on Hold</button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md">Approve Stage Closure</button>
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Close</button>
                </div>
            </div>
        </div>
    );
};

const BatchOversightView: React.FC = () => {
    const [selectedBatch, setSelectedBatch] = useState<ProductionBatch | null>(null);
    const statusColors: { [key in BatchStatus]?: string } = {
        [BatchStatus.Planned]: 'bg-gray-200 text-gray-800',
        [BatchStatus.InProgress]: 'bg-blue-200 text-blue-800',
        [BatchStatus.QCReview]: 'bg-yellow-200 text-yellow-800',
        [BatchStatus.Completed]: 'bg-green-200 text-green-800',
        [BatchStatus.OnHold]: 'bg-red-200 text-red-800',
        [BatchStatus.Delayed]: 'bg-orange-200 text-orange-800',
        [BatchStatus.Blocked]: 'bg-red-200 text-red-800',
    };

    // FIX: Helper function to calculate overall batch progress from its stages.
    const getOverallProgress = (stages: ProductionStage[]) => {
        if (!stages || stages.length === 0) return 0;
        const completed = stages.filter(s => s.status === 'Completed').length;
        return Math.round((completed / stages.length) * 100);
    }

    return (
        <div>
            {selectedBatch && <BatchMasterViewModal batch={selectedBatch} onClose={() => setSelectedBatch(null)} />}
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Batch Manufacturing Oversight</h1>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50"><tr>
                        <th className="p-3 text-left">Batch No.</th>
                        <th className="p-3 text-left">Product</th>
                        <th className="p-3 text-left">Stage</th>
                        <th className="p-3 text-left">Progress</th>
                        <th className="p-3 text-left">Status</th>
                        <th className="p-3 text-left">QC Status</th>
                        <th className="p-3 text-left">Deviations</th>
                        <th className="p-3"></th>
                    </tr></thead>
                    <tbody>
                        {PRODUCTION_BATCHES.map(batch => {
                            // FIX: Determine current stage and overall progress for each batch.
                            const currentStage = batch.stages.find(s => s.status === 'Running') || batch.stages.find(s => s.status !== 'Completed') || batch.stages[batch.stages.length - 1];
                            const overallProgress = getOverallProgress(batch.stages);
                            return (
                                <tr key={batch.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3 font-semibold">{batch.batchNumber}</td>
                                    <td className="p-3">{batch.productName}</td>
                                    <td className="p-3">{currentStage?.name || 'N/A'}</td>
                                    <td className="p-3 w-40">
                                        <div className="w-full bg-gray-200 rounded-full h-2.5"><div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${overallProgress}%` }}></div></div>
                                    </td>
                                    <td className="p-3"><span className={`px-2 py-1 text-xs rounded-full ${statusColors[batch.status]}`}>{batch.status}</span></td>
                                    <td className="p-3">{batch.qcDependenceStatus}</td>
                                    <td className="p-3">{DEVIATIONS.filter(d => d.batchNumber === batch.batchNumber).length > 0 ? 'Yes' : 'No'}</td>
                                    <td className="p-3 text-right"><button onClick={() => setSelectedBatch(batch)} className="text-primary-600 font-semibold text-sm">Open Master View</button></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BatchOversightView;