import React from 'react';

const QCAnalyticsView: React.FC = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Analytics & KPI Intelligence</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-semibold mb-2">OOS/OOT Trend Dashboard</h3>
                    <div className="h-48 bg-gray-200 rounded-md flex items-center justify-center"><p>Chart Placeholder</p></div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-semibold mb-2">Analyst Productivity Trends</h3>
                    <div className="h-48 bg-gray-200 rounded-md flex items-center justify-center"><p>Chart Placeholder</p></div>
                </div>
                 <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-semibold mb-2">Lab Bottleneck Analysis</h3>
                    <div className="h-48 bg-gray-200 rounded-md flex items-center justify-center"><p>Chart Placeholder</p></div>
                </div>
                 <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-semibold mb-2">Equipment Usage Patterns</h3>
                    <div className="h-48 bg-gray-200 rounded-md flex items-center justify-center"><p>Chart Placeholder</p></div>
                </div>
            </div>
        </div>
    );
};

export default QCAnalyticsView;