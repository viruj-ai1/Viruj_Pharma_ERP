import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { TRAINING_RECORDS, USERS } from '../../services/mockData';
import { TrainingRecord } from '../../types';

const TrainingView: React.FC = () => {
    const { user } = useAuth();
    if (!user) return null;

    const plantTrainingRecords = TRAINING_RECORDS.filter(t => t.plantId === user.plantId);

    const getUserName = (userId: string) => USERS.find(u => u.id === userId)?.name || 'Unknown User';

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Training & Qualification</h1>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <h2 className="text-xl font-semibold p-4 border-b">Training Matrix</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal">
                         <thead className="bg-gray-50">
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase">Employee</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase">Training</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase">Completion Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {plantTrainingRecords.map((record: TrainingRecord) => (
                                <tr key={record.id} className="hover:bg-gray-50">
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm font-semibold">{getUserName(record.userId)}</td>
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm">{record.training}</td>
                                    <td className={`px-5 py-4 border-b border-gray-200 text-sm font-semibold ${record.status === 'Overdue' ? 'text-red-500' : 'text-green-600'}`}>
                                        {record.status}
                                    </td>
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm">{record.completionDate || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TrainingView;