import React from 'react';
import { PRODUCTION_BATCHES } from '../../services/mockData';
import { BatchStatus } from '../../types';

const StageProgressView: React.FC = () => {
    const runningBatches = PRODUCTION_BATCHES.filter(b => b.status === BatchStatus.InProgress);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Stage/Operation Progress Monitor</h1>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50"><tr>
                        <th className="p-3 text-left">Stage</th>
                        <th className="p-3 text-left">Batch</th>
                        <th className="p-3 text-left">Start Time</th>
                        <th className="p-3 text-left">Time Remaining</th>
                        <th className="p-3 text-left">Machine</th>
                        <th className="p-3"></th>
                    </tr></thead>
                    <tbody>
                        {runningBatches.map(batch => {
                            // FIX: Get current running stage from stages array.
                            const currentStage = batch.stages.find(s => s.status === 'Running');
                            return (
                                <tr key={batch.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3 font-semibold">{currentStage?.name || 'N/A'}</td>
                                    <td className="p-3">{batch.batchNumber}</td>
                                    <td className="p-3">{batch.startDate}</td>
                                    <td className="p-3">8h 30m</td>
                                    <td className="p-3">R-101</td>
                                    <td className="p-3 text-right"><button className="text-primary-600 font-semibold text-sm">Open Live View</button></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StageProgressView;