import React, { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { PRODUCTION_BATCHES } from '../../services/mockData';
import { ProductionBatch, BatchStatus } from '../../types';

const MyBatchesView: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('current');

    const myBatches = useMemo(() => {
        if (!user) return [];
        return PRODUCTION_BATCHES.filter(b => b.officerId === user.id);
    }, [user]);
    
    const currentBatches = myBatches.filter(b => b.status !== BatchStatus.Completed);
    const completedBatches = myBatches.filter(b => b.status === BatchStatus.Completed);

    const dataToShow = activeTab === 'current' ? currentBatches : completedBatches;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Batches</h1>
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    <button onClick={() => setActiveTab('current')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'current' ? 'border-primary-500 text-primary-600' : 'border-transparent'}`}>Current Batches ({currentBatches.length})</button>
                    <button onClick={() => setActiveTab('completed')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'completed' ? 'border-primary-500 text-primary-600' : 'border-transparent'}`}>Completed Batches ({completedBatches.length})</button>
                </nav>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50"><tr>
                        <th className="p-3 text-left">Batch No</th>
                        <th className="p-3 text-left">Stage</th>
                        <th className="p-3 text-left">Progress</th>
                        <th className="p-3 text-left">Alerts</th>
                        <th className="p-3"></th>
                    </tr></thead>
                    <tbody>
                        {dataToShow.map(batch => {
                            const currentStage = batch.stages.find(s => s.status === 'Running') || batch.stages.find(s => s.status !== 'Completed');
                            return (
                                <tr key={batch.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3 font-semibold">{batch.batchNumber}</td>
                                    <td className="p-3">{currentStage?.name}</td>
                                    <td className="p-3">{currentStage?.progress}%</td>
                                    <td className="p-3">-</td>
                                    <td className="p-3 text-right"><button className="text-primary-600 font-semibold text-sm">Open Workspace</button></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyBatchesView;