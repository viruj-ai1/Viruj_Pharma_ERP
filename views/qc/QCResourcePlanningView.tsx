import React from 'react';
import { QC_SAMPLES, USERS } from '../../services/mockData';
import { Role } from '../../types';

const QCResourcePlanningView: React.FC = () => {
    const qcOfficers = USERS.filter(u => u.role === Role.QC_Operator);
    const priorityBatches = QC_SAMPLES.filter(s => s.priority === 'Critical' || s.priority === 'High');

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">QC Planning & Resource Allocation</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Set Daily/Weekly Priority Batches</h2>
                    <div className="space-y-2">
                        {priorityBatches.map(sample => (
                            <div key={sample.id} className="p-3 bg-yellow-50 rounded-md flex justify-between items-center">
                                <p className="font-semibold">{sample.batchNumber} ({sample.productName})</p>
                                <span className="text-xs font-semibold bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">{sample.priority}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Approve QC Manager Schedules</h2>
                    <div className="p-4 bg-gray-50 rounded-md text-center">
                        <p className="text-gray-600">No schedules pending approval.</p>
                        <button className="mt-2 text-sm font-semibold text-primary-600">View Master Schedule</button>
                    </div>
                </div>
                <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Override Assignment Bottlenecks</h2>
                    <div className="space-y-4">
                        {qcOfficers.map(officer => {
                             const assigned = QC_SAMPLES.filter(s => s.analystId === officer.id && (s.status === 'In Progress' || s.status === 'Pending')).length;
                             return (
                                <div key={officer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                                    <p className="font-medium">{officer.name}</p>
                                    <div className="flex items-center space-x-4">
                                        <p className="text-sm">{assigned} active samples</p>
                                        <button className="text-xs font-semibold text-red-600">Override/Reassign</button>
                                    </div>
                                </div>
                             );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QCResourcePlanningView;
