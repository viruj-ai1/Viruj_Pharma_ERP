import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { PRODUCTION_BATCHES } from '../../services/mockData';
import { BatchStatus } from '../../types';

const PlantQualityView: React.FC = () => {
    const { user } = useAuth();

    if (!user || !user.plantId) return <div>User plant not found</div>;

    const plantBatches = PRODUCTION_BATCHES.filter(b => b.plantId === user.plantId);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Quality Overview - {user.plantId.replace('plant-','').toUpperCase()}</h1>
            
            <div className="mt-8">
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">QA Release Console</h2>
                    {/* Table for QA Release */}
                        <table className="min-w-full">
                        <thead><tr><th className="px-4 py-2 bg-gray-50 text-left">Batch</th><th className="px-4 py-2 bg-gray-50 text-left">QA Status</th></tr></thead>
                        <tbody>{plantBatches.map(b => <tr key={b.id} className="border-b"><td className="px-4 py-3 font-semibold">{b.batchNumber}</td><td className="px-4 py-3">{b.status === BatchStatus.OnHold ? 'Blocked' : 'Released'}</td></tr>)}</tbody>
                        </table>
                </div>
            </div>
        </div>
    );
};

export default PlantQualityView;
