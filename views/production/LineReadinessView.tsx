import React from 'react';

const LineReadinessView: React.FC = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Equipment & Line Readiness</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Line Readiness Checklist for Line 03 (Batch AP-PARA-002)</h2>
                <div className="space-y-3">
                    <label className="flex items-center p-3 bg-gray-50 rounded-md"><input type="checkbox" className="h-4 w-4 rounded mr-3" /> Cleaning status verified</label>
                    <label className="flex items-center p-3 bg-gray-50 rounded-md"><input type="checkbox" className="h-4 w-4 rounded mr-3" /> Sanitization status verified</label>
                    <label className="flex items-center p-3 bg-gray-50 rounded-md"><input type="checkbox" className="h-4 w-4 rounded mr-3" /> QA clearance received</label>
                    <label className="flex items-center p-3 bg-gray-50 rounded-md"><input type="checkbox" className="h-4 w-4 rounded mr-3" /> Material staged and verified</label>
                </div>
            </div>
        </div>
    );
};

export default LineReadinessView;