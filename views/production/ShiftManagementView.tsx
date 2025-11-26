import React from 'react';
import { SHIFTS, USERS } from '../../services/mockData';

const ShiftManagementView: React.FC = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Shift Management & Resource Allocation</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {SHIFTS.map(shift => (
                    <div key={shift.id} className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold">{shift.name} Shift</h2>
                        <p className="text-sm text-gray-500">{shift.date}</p>
                        <div className="mt-4">
                            <p><strong>Manager:</strong> {USERS.find(u => u.id === shift.managerId)?.name}</p>
                            <p><strong>Operators:</strong></p>
                            <ul className="list-disc list-inside text-sm">
                                {shift.operatorIds.map(id => <li key={id}>{USERS.find(u=>u.id === id)?.name}</li>)}
                                {shift.operatorIds.length === 0 && <li className="text-gray-400">No operators assigned</li>}
                            </ul>
                        </div>
                        <button className="mt-4 text-sm font-semibold text-primary-600">Edit Assignment</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShiftManagementView;