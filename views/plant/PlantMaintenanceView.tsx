import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { EQUIPMENT, MAINTENANCE_TASKS } from '../../services/mockData';

const PlantMaintenanceView: React.FC = () => {
    const { user } = useAuth();
    if (!user || !user.plantId) return <div>User plant not found</div>;

    const plantEquipment = EQUIPMENT.filter(e => e.plantId === user.plantId);
    const plantTasks = MAINTENANCE_TASKS.filter(t => t.plantId === user.plantId);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Maintenance & Engineering - {user.plantId.replace('plant-','').toUpperCase()}</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Equipment List</h2>
                    <table className="min-w-full">
                        <thead><tr><th className="px-4 py-2 bg-gray-50 text-left">Equipment</th><th className="px-4 py-2 bg-gray-50 text-left">Status</th><th className="px-4 py-2 bg-gray-50 text-left">Next PM</th></tr></thead>
                        <tbody>{plantEquipment.map(e => <tr key={e.id} className="border-b"><td className="px-4 py-3 font-semibold">{e.name}</td><td className={`px-4 py-3 font-semibold ${e.status === 'Breakdown' ? 'text-red-500' : ''}`}>{e.status}</td><td className="px-4 py-3">{e.nextPMDate}</td></tr>)}</tbody>
                    </table>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Maintenance Tasks</h2>
                     <table className="min-w-full">
                        <thead><tr><th className="px-4 py-2 bg-gray-50 text-left">Task</th><th className="px-4 py-2 bg-gray-50 text-left">Type</th><th className="px-4 py-2 bg-gray-50 text-left">Status</th></tr></thead>
                        <tbody>{plantTasks.map(t => <tr key={t.id} className="border-b"><td className="px-4 py-3 font-semibold">{t.task}</td><td className="px-4 py-3">{t.type}</td><td className="px-4 py-3">{t.status}</td></tr>)}</tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PlantMaintenanceView;
