
import React from 'react';

const ProdDocsChecklistsView: React.FC = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Production Documents & Checklists</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Daily Checklists Pending Validation</h2>
                <div className="space-y-2">
                    <div className="p-3 bg-gray-50 rounded-md flex justify-between items-center">
                        <p>Line 03 - Pre-start Checklist</p>
                        <button className="text-primary-600 text-sm font-semibold">Validate</button>
                    </div>
                     <div className="p-3 bg-gray-50 rounded-md flex justify-between items-center">
                        <p>Blender B-102 - Cleaning Checklist</p>
                        <button className="text-primary-600 text-sm font-semibold">Validate</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProdDocsChecklistsView;
