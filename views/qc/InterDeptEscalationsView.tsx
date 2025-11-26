import React from 'react';

const mockEscalations = [
    { id: 1, from: 'Production', title: 'Batch AP-MET-001 showing abnormal color', status: 'Open' },
    { id: 2, from: 'Warehouse', title: 'RM-PHEN-056 received with damaged seal', status: 'Open' },
];

const InterDeptEscalationsView: React.FC = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Inter-Department Escalations</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Escalation Inbox</h2>
                <div className="space-y-3">
                    {mockEscalations.map(esc => (
                        <div key={esc.id} className="p-4 bg-yellow-50 rounded-md border-l-4 border-yellow-400 flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-yellow-800">{esc.title}</p>
                                <p className="text-sm text-gray-600">From: {esc.from}</p>
                            </div>
                            <div className="space-x-2">
                                <button className="text-sm font-semibold text-blue-600">Acknowledge</button>
                                <button className="text-sm font-semibold text-primary-600">Assign to Manager</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default InterDeptEscalationsView;