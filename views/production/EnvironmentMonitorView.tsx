import React from 'react';

const EnvironmentMonitorView: React.FC = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Environmental & Utility Monitoring</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2">HVAC Parameters</h2>
                    <p>Placeholder for live HVAC data.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2">Purified Water System</h2>
                    <p>Placeholder for live water system data.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2">Differential Pressures</h2>
                    <p>Placeholder for live pressure data.</p>
                </div>
            </div>
        </div>
    );
};

export default EnvironmentMonitorView;