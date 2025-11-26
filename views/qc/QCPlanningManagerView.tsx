import React from 'react';

const QCPlanningManagerView: React.FC = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800">QC Planning & Scheduling</h1>
            <div className="mt-6 bg-white p-8 rounded-lg shadow-md text-center">
                <h2 className="text-xl font-semibold mb-4">Daily Plan Generator (Coming Soon)</h2>
                <p className="text-gray-600 mb-4">This module will feature a mini-scheduler to create daily testing plans, assign stability pulls, and balance workloads. An auto-scheduler will propose workload splits which can be manually overridden.</p>
                <button className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg">Generate Today's Plan</button>
            </div>
        </div>
    );
};

export default QCPlanningManagerView;