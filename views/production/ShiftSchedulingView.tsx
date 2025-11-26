import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { SHIFTS, USERS } from '../../services/mockData';
import { Role } from '../../types';

const ShiftSchedulingView: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('roster');

    const operators = USERS.filter(u => u.role === Role.Production_Operator && u.plantId === user?.plantId);
    
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Shift Scheduling & Crew Assignment</h1>
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    <button onClick={() => setActiveTab('roster')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'roster' ? 'border-primary-500 text-primary-600' : 'border-transparent'}`}>Manage Shift Roster</button>
                    <button onClick={() => setActiveTab('allocation')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'allocation' ? 'border-primary-500 text-primary-600' : 'border-transparent'}`}>Real-Time Allocation</button>
                </nav>
            </div>
            
            <div className="grid grid-cols-4 gap-6">
                {/* Operator List */}
                <div className="col-span-1 bg-white p-4 rounded-lg shadow-md">
                    <h3 className="font-semibold mb-2">Available Operators</h3>
                    <div className="space-y-2">
                        {operators.map(op => (
                            <div key={op.id} className="p-2 bg-gray-100 rounded-md cursor-grab">
                                {op.name}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Shift Panels */}
                <div className="col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {SHIFTS.filter(s => s.plantId === user?.plantId).map(shift => (
                        <div key={shift.id} className="bg-white p-4 rounded-lg shadow-md">
                            <h3 className="font-bold text-lg">{shift.name} Shift</h3>
                            <div className="mt-2 p-4 bg-gray-50 border-dashed border-2 rounded-lg min-h-[10rem]">
                                {shift.operatorIds.map(id => (
                                    <div key={id} className="p-2 bg-blue-100 text-blue-800 rounded-md mb-2">
                                        {USERS.find(u => u.id === id)?.name}
                                    </div>
                                ))}
                                <p className="text-center text-gray-400 text-sm">Drag operators here</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ShiftSchedulingView;