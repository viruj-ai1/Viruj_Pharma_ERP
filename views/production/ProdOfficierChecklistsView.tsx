import React from 'react';

const ProdOfficierChecklistsView: React.FC = () => {
    const checklists = [
        'Line Clearance Checklist (Line 02)',
        'Safety Checklist (Granulation Area)',
        'Equipment Readiness (R-101)',
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Checklists</h1>
            <div className="bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto">
                <h2 className="text-xl font-semibold mb-4">My Pending Checklists</h2>
                <div className="space-y-3">
                    {checklists.map(c => (
                        <div key={c} className="p-4 bg-gray-50 rounded-md flex justify-between items-center">
                            <p>{c}</p>
                            <button className="text-primary-600 font-semibold text-sm">Complete</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProdOfficierChecklistsView;