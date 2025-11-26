import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const PlantBatchReportsView: React.FC = () => {
    const { user } = useAuth();
    if (!user || !user.plantId) return <div>User plant not found</div>;
    
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Batch Reports - {user.plantId.replace('plant-','').toUpperCase()}</h1>
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <h2 className="text-xl font-semibold mb-4">Batch Report Module</h2>
                <p>This area will contain generated batch reports, drafts, and analytics as specified.</p>
                <button className="mt-4 bg-primary-600 text-white font-bold py-2 px-4 rounded-lg">Generate New Report</button>
            </div>
        </div>
    );
};

export default PlantBatchReportsView;
