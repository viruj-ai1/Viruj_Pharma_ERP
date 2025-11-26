import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { PROJECTS } from '../../services/mockData';

const PlantProjectsView: React.FC = () => {
    const { user } = useAuth();
    if (!user || !user.plantId) return <div>User plant not found</div>;

    const plantProjects = PROJECTS.filter(p => p.plantId === user.plantId);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Projects & CAPA - {user.plantId.replace('plant-','').toUpperCase()}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {plantProjects.map(project => (
                    <div key={project.id} className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="font-bold text-lg">{project.title}</h3>
                        <p className="text-sm">Status: {project.status}</p>
                        <p className="text-sm">Progress: {project.percentComplete}%</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlantProjectsView;
