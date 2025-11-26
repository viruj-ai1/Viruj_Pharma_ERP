import React, { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { PRODUCTION_BATCHES, USERS, DEVIATIONS } from '../../services/mockData';
import { ProductionBatch, ProductionStage, BatchStatus, Role } from '../../types';

const statusColors: { [key in BatchStatus]?: string } = {
    [BatchStatus.Planned]: 'bg-gray-200 text-gray-800',
    [BatchStatus.InProgress]: 'bg-blue-200 text-blue-800',
    [BatchStatus.QCReview]: 'bg-yellow-200 text-yellow-800',
    [BatchStatus.Completed]: 'bg-green-200 text-green-800',
    [BatchStatus.OnHold]: 'bg-red-200 text-red-800',
    [BatchStatus.Delayed]: 'bg-orange-200 text-orange-800',
    [BatchStatus.Blocked]: 'bg-red-200 text-red-800',
};

const stageStatusColors: { [key in ProductionStage['status']]: string } = {
    'Not Started': 'bg-gray-100 text-gray-600',
    'Running': 'bg-blue-100 text-blue-600',
    'QA Hold': 'bg-yellow-100 text-yellow-700',
    'QC Hold': 'bg-orange-100 text-orange-700',
    'Completed': 'bg-green-100 text-green-700',
}

const BatchExecutionWorkspace: React.FC<{ batch: ProductionBatch, onClose: () => void }> = ({ batch, onClose }) => {
    const productionOfficers = USERS.filter(u => u.role === Role.Production_Operator);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-6xl max-h-[95vh] flex flex-col animate-fade-in-down">
                <div className="flex justify-between items-center pb-4 border-b">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Batch Execution Workspace</h2>
                        <p className="text-gray-500">{batch.batchNumber} - {batch.productName}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
                </div>
                
                <div className="flex-grow overflow-y-auto pt-6 pr-2">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column: Stages */}
                        <div className="lg:col-span-2 space-y-4">
                            <h3 className="text-lg font-semibold text-gray-700">Stage Timeline</h3>
                            {batch.stages.map(stage => (
                                <div key={stage.name} className="bg-gray-50 p-4 rounded-lg border">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-bold">{stage.name}</h4>
                                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${stageStatusColors[stage.status]}`}>{stage.status}</span>
                                    </div>
                                    <div className="text-sm text-gray-600 mt-2">
                                        <p>Officer: {USERS.find(u => u.id === stage.officerId)?.name || 'N/A'}</p>
                                    </div>
                                    <div className="flex justify-end space-x-2 mt-3 text-xs font-medium">
                                        <button className="text-blue-600">Assign Officer</button>
                                        <button className="text-green-600">Request QA Clearance</button>
                                        <button className="text-purple-600">Request QC Sample</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Right Column: Panels */}
                        <div className="space-y-6">
                            <div className="bg-white p-4 rounded-lg border">
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">Material Panel</h3>
                                <button className="w-full text-sm py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200">Request More Material</button>
                            </div>
                            <div className="bg-white p-4 rounded-lg border">
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">QC Status Panel</h3>
                                <p className="text-sm text-gray-600">Sample sent for 'Reaction' stage.</p>
                                <button className="text-xs font-semibold text-primary-600 mt-1">Request urgent test</button>
                            </div>
                             <div className="bg-white p-4 rounded-lg border">
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">Deviation Center</h3>
                                <p className="text-sm text-red-600">1 open deviation</p>
                                <button className="text-xs font-semibold text-primary-600 mt-1">Add Investigation Notes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
             <style>{`
                @keyframes fade-in-down {
                    0% { opacity: 0; transform: translateY(-10px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-down { animation: fade-in-down 0.2s ease-out; }
            `}</style>
        </div>
    );
}

const BatchControlPanelView: React.FC = () => {
    const { user } = useAuth();
    const [selectedBatch, setSelectedBatch] = useState<ProductionBatch | null>(null);

    const myBatches = useMemo(() => {
        if (!user) return [];
        return PRODUCTION_BATCHES.filter(b => b.assignedTo === user.id);
    }, [user]);

    const getOverallProgress = (stages: ProductionStage[]) => {
        const completed = stages.filter(s => s.status === 'Completed').length;
        return Math.round((completed / stages.length) * 100);
    }
    
    return (
        <div>
            {selectedBatch && <BatchExecutionWorkspace batch={selectedBatch} onClose={() => setSelectedBatch(null)} />}
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Batch Execution Control Panel</h1>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 bg-gray-50 text-left text-xs font-semibold uppercase">Batch No.</th>
                                <th className="px-5 py-3 border-b-2 bg-gray-50 text-left text-xs font-semibold uppercase">Product</th>
                                <th className="px-5 py-3 border-b-2 bg-gray-50 text-left text-xs font-semibold uppercase">Overall Progress</th>
                                <th className="px-5 py-3 border-b-2 bg-gray-50 text-left text-xs font-semibold uppercase">Status</th>
                                <th className="px-5 py-3 border-b-2 bg-gray-50"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {myBatches.map((batch: ProductionBatch) => (
                                <tr key={batch.id} className="hover:bg-gray-50">
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm font-semibold">{batch.batchNumber}</td>
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm">{batch.productName}</td>
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm">
                                        <div className="w-full bg-gray-200 rounded-full h-2.5"><div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${getOverallProgress(batch.stages)}%` }}></div></div>
                                    </td>
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm">
                                        <span className={`px-2 py-1 text-xs rounded-full ${statusColors[batch.status]}`}>{batch.status}</span>
                                    </td>
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm text-right">
                                        <button onClick={() => setSelectedBatch(batch)} className="text-primary-600 font-semibold">Open Workspace</button>
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

export default BatchControlPanelView;