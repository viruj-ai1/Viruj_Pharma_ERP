import React from 'react';

const CapaTasksView: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">My CAPA Tasks</h1>
       <div className="mt-6 bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
        <p>This module will list all Corrective and Preventive Action (CAPA) steps assigned to you for execution.</p>
      </div>
    </div>
  );
};

export default CapaTasksView;
