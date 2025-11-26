import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { PRODUCTION_BATCHES } from '../../services/mockData';
import { ProductionBatch, BatchStatus } from '../../types';

const BatchTracker: React.FC<{ plantId: string }> = ({ plantId }) => {
    const plantBatches = PRODUCTION_BATCHES.filter(b => b.plantId === plantId);

    const statusColors: { [key in BatchStatus]?: string } = {
        [BatchStatus.Planned]: 'bg-gray-200 text-gray-800',
        [BatchStatus.InProgress]: 'bg-blue-200 text-blue-800',
        [BatchStatus.QCReview]: 'bg-yellow-200 text-yellow-800',
        [BatchStatus.Completed]: 'bg-green-200 text-green-800',
        [BatchStatus.OnHold]: 'bg-red-200 text-red-800'
    };

    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Batch ID</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Stage</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Start Time</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">QA Status</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {plantBatches.map((batch: ProductionBatch) => (
                            <tr key={batch.id} className="hover:bg-gray-50">
                                <td className="px-5 py-5 border-b border-gray-200 text-sm font-semibold">{batch.batchNumber}</td>
                                <td className="px-5 py-5 border-b border-gray-200 text-sm">{batch.productName}</td>
                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                    <span className={`px-2 py-1 text-xs rounded-full ${statusColors[batch.status]}`}>{batch.status}</span>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 text-sm">{batch.startDate}</td>
                                <td className="px-5 py-5 border-b border-gray-200 text-sm">{batch.status === BatchStatus.OnHold ? 'Blocked' : 'Released'}</td>
                                <td className="px-5 py-5 border-b border-gray-200 text-sm text-right"><button className="text-primary-600 hover:text-primary-900">Open</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}


const PlantProductionView: React.FC = () => {
    const { user } = useAuth();
    if (!user || !user.plantId) return <div>User plant not found</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Production Overview - {user.plantId.replace('plant-','').toUpperCase()}</h1>
            <BatchTracker plantId={user.plantId} />
        </div>
    );
};

export default PlantProductionView;