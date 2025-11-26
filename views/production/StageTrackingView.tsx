import React, { useState } from 'react';
import { PRODUCTION_BATCHES, USERS } from '../../services/mockData';
import { ProductionBatch, BatchStatus, ProductionStage } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

const OperationDetailWindow: React.FC<{ stage: ProductionStage; batch: ProductionBatch; onClose: () => void }> = ({ stage, batch, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
                <h2 className="text-xl font-bold mb-4">Live View: {stage.name} for {batch.batchNumber}</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <p><strong>Operator:</strong> {USERS.find(u => u.id === stage.officerId)?.name}</p>
                    <p><strong>Equipment Readings:</strong> Temp: 85°C, RPM: 120</p>
                    <p><strong>EBR Entries:</strong> 5/12 completed</p>
                    <p><strong>QC Sampling:</strong> In-process sample sent</p>
                </div>
                <div className="mt-6 flex justify-end space-x-2">
                    <button className="px-4 py-2 bg-yellow-500 text-white rounded-md text-sm">Trigger Deviation</button>
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md text-sm">Close</button>
                </div>
            </div>
        </div>
    );
};

const StageTrackingView: React.FC = () => {
    const { user } = useAuth();
    const [selectedStage, setSelectedStage] = useState<{ stage: ProductionStage, batch: ProductionBatch } | null>(null);

    const runningStages = PRODUCTION_BATCHES
        .filter(b => b.assignedTo === user?.id && b.status === BatchStatus.InProgress)
        .map(b => ({
            batch: b,
            stage: b.stages.find(s => s.status === 'Running')
        }))
        .filter(item => item.stage);

    return (
        <div>
            {selectedStage && <OperationDetailWindow stage={selectedStage.stage} batch={selectedStage.batch} onClose={() => setSelectedStage(null)} />}
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Stage/Operation Tracking</h1>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50"><tr>
                        <th className="p-3 text-left">Batch</th>
                        <th className="p-3 text-left">Stage</th>
                        <th className="p-3 text-left">Officer</th>
                        <th className="p-3 text-left">Start Time</th>
                        <th className="p-3 text-left">SOP Steps</th>
                        <th className="p-3"></th>
                    </tr></thead>
                    <tbody>
                        {runningStages.map(({ batch, stage }) => stage && (
                            <tr key={`${batch.id}-${stage.name}`} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-semibold">{batch.batchNumber}</td>
                                <td className="p-3">{stage.name}</td>
                                <td className="p-3">{USERS.find(u => u.id === stage.officerId)?.name}</td>
                                <td className="p-3">{batch.startDate}</td>
                                <td className="p-3">5/12</td>
                                <td className="p-3 text-right">
                                    <button onClick={() => setSelectedStage({ stage, batch })} className="text-primary-600 font-semibold text-sm">Open Live View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StageTrackingView;