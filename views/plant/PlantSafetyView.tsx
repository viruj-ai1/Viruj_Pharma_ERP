import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { SAFETY_INCIDENTS } from '../../services/mockData';

const PlantSafetyView: React.FC = () => {
    const { user } = useAuth();
    if (!user || !user.plantId) return <div>User plant not found</div>;

    const plantIncidents = SAFETY_INCIDENTS.filter(i => i.plantId === user.plantId);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Safety / EHS - {user.plantId.replace('plant-','').toUpperCase()}</h1>
             <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Open Safety Incidents</h2>
                 <table className="min-w-full">
                    <thead><tr><th className="px-4 py-2 bg-gray-50 text-left">Incident</th><th className="px-4 py-2 bg-gray-50 text-left">Date</th><th className="px-4 py-2 bg-gray-50 text-left">Severity</th></tr></thead>
                    <tbody>{plantIncidents.filter(i => i.status === 'Open').map(i => <tr key={i.id} className="border-b"><td className="px-4 py-3 font-semibold">{i.title}</td><td className="px-4 py-3">{i.date}</td><td className={`px-4 py-3 font-semibold ${i.severity === 'High' ? 'text-red-500' : ''}`}>{i.severity}</td></tr>)}</tbody>
                </table>
            </div>
        </div>
    );
};

export default PlantSafetyView;
