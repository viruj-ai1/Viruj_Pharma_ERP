import React from 'react';

const ProdOfficerNotificationsView: React.FC = () => {
    const notifications = [
        { id: 1, text: 'Task from Manager: Verify operator entry for Step 3', read: false },
        { id: 2, text: 'QC sample for AP-MET-001 is delayed.', read: false },
        { id: 3, text: 'SOP-PROD-002 has been updated. Please acknowledge.', read: true },
    ];
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Notifications & Task Inbox</h1>
            <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
                <div className="space-y-3">
                    {notifications.map(n => (
                        <div key={n.id} className={`p-4 rounded-md ${n.read ? 'bg-gray-100' : 'bg-blue-50 border-l-4 border-blue-400'}`}>
                            <p className={n.read ? 'text-gray-600' : 'font-semibold text-blue-800'}>{n.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProdOfficerNotificationsView;