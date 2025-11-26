
import React from 'react';

const ProdInterDeptActionsView: React.FC = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Inter-department Action Center</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">New Request</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <button className="p-3 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm font-semibold">Request QC Sampling</button>
                    <button className="p-3 bg-green-100 text-green-700 rounded-md hover:bg-green-200 text-sm font-semibold">Request QA Inspection</button>
                    <button className="p-3 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 text-sm font-semibold">Request Material</button>
                    <button className="p-3 bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 text-sm font-semibold">Report Equipment Issue</button>
                </div>
                <textarea className="w-full p-2 border rounded-md" rows={3} placeholder="Add details to your request..."></textarea>
                <div className="text-right mt-2">
                    <button className="bg-primary-600 text-white font-semibold py-2 px-4 rounded-md">Send Request</button>
                </div>
            </div>
        </div>
    );
};

export default ProdInterDeptActionsView;
