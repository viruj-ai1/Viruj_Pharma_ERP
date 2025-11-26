import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { PRODUCTION_BATCHES, DEVIATIONS } from '../../services/mockData';
import { QAReleaseStatus, ProductionBatch } from '../../types';

const QAReleaseView: React.FC = () => {
    const { user } = useAuth();
    if (!user) return null;

    const plantBatches = PRODUCTION_BATCHES.filter(b => b.plantId === user.plantId);
    
    const getDeviationCount = (batchNumber: string) => DEVIATIONS.filter(d => d.batchNumber === batchNumber).length;

    const statusColors: { [key in QAReleaseStatus]: string } = {
        [QAReleaseStatus.Pending]: 'bg-yellow-100 text-yellow-800',
        [QAReleaseStatus.Hold]: 'bg-red-100 text-red-800',
        [QAReleaseStatus.Released]: 'bg-green-100 text-green-800',
        [QAReleaseStatus.Rejected]: 'bg-gray-100 text-gray-800',
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">QA Release Console</h1>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase">Batch ID</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase">Product</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase">Deviations</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase">BMR Status</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase">QA Release</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {plantBatches.map((batch: ProductionBatch) => (
                                <tr key={batch.id} className="hover:bg-gray-50">
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm font-semibold">{batch.batchNumber}</td>
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm">{batch.productName}</td>
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm">{getDeviationCount(batch.batchNumber)}</td>
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm">{batch.bmrStatus}</td>
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[batch.qaReleaseStatus]}`}>
                                            {batch.qaReleaseStatus}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm text-right">
                                        <button className="text-primary-600 font-semibold hover:underline">Review</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default QAReleaseView;