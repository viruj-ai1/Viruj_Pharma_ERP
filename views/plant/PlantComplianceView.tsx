import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { DOCUMENTS } from '../../services/mockData';
import { DocumentType } from '../../types';

const PlantComplianceView: React.FC = () => {
    const { user } = useAuth();
    if (!user || !user.plantId) return <div>User plant not found</div>;

    const plantSOPs = DOCUMENTS.filter(d => d.plantId === user.plantId && d.type === DocumentType.SOP);
    
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Compliance & Documents - {user.plantId.replace('plant-','').toUpperCase()}</h1>
            <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Plant SOPs</h2>
                 <table className="min-w-full">
                    <thead><tr><th className="px-4 py-2 bg-gray-50 text-left">SOP</th><th className="px-4 py-2 bg-gray-50 text-left">Reference ID</th></tr></thead>
                    <tbody>{plantSOPs.map(d => <tr key={d.id} className="border-b"><td className="px-4 py-3 font-semibold">{d.title}</td><td className="px-4 py-3 font-mono">{d.referenceId}</td></tr>)}</tbody>
                </table>
            </div>
        </div>
    );
};

export default PlantComplianceView;