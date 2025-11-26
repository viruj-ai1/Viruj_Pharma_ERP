
import React from 'react';

const ProdReportsManagerView: React.FC = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Reports & Analytics (Manager)</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg cursor-pointer transition-shadow">
                    <h3 className="font-semibold text-primary-700">Operator Performance KPI</h3>
                </div>
                 <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg cursor-pointer transition-shadow">
                    <h3 className="font-semibold text-primary-700">Batch Delays by Root Cause</h3>
                </div>
                 <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg cursor-pointer transition-shadow">
                    <h3 className="font-semibold text-primary-700">Daily Production Report</h3>
                </div>
                 <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg cursor-pointer transition-shadow">
                    <h3 className="font-semibold text-primary-700">Equipment Downtime</h3>
                </div>
            </div>
        </div>
    );
};

export default ProdReportsManagerView;
