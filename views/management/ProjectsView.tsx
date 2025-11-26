import React from 'react';
import { PROJECTS, USERS } from '../../services/mockData';
import { Project } from '../../types';

const RAG_COLORS = {
    'On Track': 'bg-green-500',
    'At Risk': 'bg-yellow-500',
    'Off Track': 'bg-red-500',
    'Completed': 'bg-blue-500'
}

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
    const owner = USERS.find(u => u.id === project.owner);
    return (
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4" style={{ borderColor: RAG_COLORS[project.status].replace('bg-','').replace('-500','') }}>
            <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg text-gray-800">{project.title}</h3>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${project.status === 'On Track' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{project.status}</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">Owner: {owner?.name || 'N/A'}</p>
            
            <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{project.percentComplete}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-primary-600 h-2.5 rounded-full" style={{width: `${project.percentComplete}%`}}></div>
                </div>
            </div>

            <div className="mt-4 flex justify-between text-sm text-gray-600">
                <div>
                    <p className="text-xs text-gray-500">Budget</p>
                    <p className="font-semibold">₹{project.budget.toLocaleString('en-IN')}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500">Next Milestone</p>
                    <p className="font-semibold">{project.nextMilestone}</p>
                </div>
            </div>

            <button className="mt-4 text-primary-600 font-semibold text-sm hover:underline">View Details &rarr;</button>
        </div>
    )
}

const ProjectsView: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Projects & Strategy</h1>
      <p className="text-gray-500 mt-1">
        Portfolio of strategic CAPEX projects and company-wide initiatives.
      </p>
       <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PROJECTS.map(project => (
            <ProjectCard key={project.id} project={project} />
        ))}
       </div>
    </div>
  );
};

export default ProjectsView;