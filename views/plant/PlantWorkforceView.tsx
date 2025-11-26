import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { TRAINING_RECORDS, USERS } from '../../services/mockData';

const PlantWorkforceView: React.FC = () => {
    const { user } = useAuth();
    if (!user || !user.plantId) return <div>User plant not found</div>;

    const plantTraining = TRAINING_RECORDS.filter(t => t.plantId === user.plantId);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Workforce & Training - {user.plantId.replace('plant-','').toUpperCase()}</h1>
            <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Training Matrix</h2>
                 <table className="min-w-full">
                    <thead><tr><th className="px-4 py-2 bg-gray-50 text-left">Employee</th><th className="px-4 py-2 bg-gray-50 text-left">Training</th><th className="px-4 py-2 bg-gray-50 text-left">Status</th></tr></thead>
                    <tbody>{plantTraining.map(t => <tr key={t.id} className="border-b"><td className="px-4 py-3 font-semibold">{USERS.find(u => u.id === t.userId)?.name}</td><td className="px-4 py-3">{t.training}</td><td className={`px-4 py-3 font-semibold ${t.status === 'Overdue' ? 'text-red-500' : 'text-green-500'}`}>{t.status}</td></tr>)}</tbody>
                </table>
            </div>
        </div>
    );
};

export default PlantWorkforceView;
