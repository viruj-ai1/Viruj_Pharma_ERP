import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { QC_SAMPLES, QC_INSTRUMENTS } from '../../services/mockData';

const QCDashboardOfficer: React.FC<{ onNavigate: (view: string, id?: string) => void }> = ({ onNavigate }) => {
    const { user } = useAuth();
    if (!user) return null;

    const mySamples = QC_SAMPLES.filter(s => s.analystId === user.id && s.status !== 'Passed' && s.status !== 'Failed');
    const today = new Date().toISOString().split('T')[0];
    const todaysTasks = mySamples.filter(s => s.dueDate === today);

    const notifications = [
        { id: 1, text: 'Instrument HPLC-01 is unavailable for use.', type: 'warning' },
        { id: 2, text: 'Results for samp-001 returned by Manager for correction.', type: 'info' },
        { id: 3, text: 'Re-test ordered for AP-ASP-001.', type: 'info' },
    ];
    
    const getNotificationColor = (type: string) => type === 'warning' ? 'bg-yellow-50 border-yellow-400' : 'bg-blue-50 border-blue-400';

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">My Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Assigned Samples */}
                <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Assigned Samples ({mySamples.length})</h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {mySamples.map(sample => (
                            <button key={sample.id} onClick={() => onNavigate('sampleAssignment')} className="w-full text-left p-4 bg-gray-50 rounded-lg hover:bg-primary-50 hover:shadow-md transition-all">
                                <div className="flex justify-between items-center">
                                    <p className="font-bold text-gray-800">{sample.productName} <span className="font-normal text-gray-500">({sample.batchNumber})</span></p>
                                    <span className="text-xs font-semibold text-red-600">{new Date(sample.dueDate) < new Date() ? 'OVERDUE' : ''}</span>
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                    <span>Sample ID: <span className="font-mono">{sample.id}</span></span> | 
                                    <span> Tests: <span className="font-semibold">{sample.tests.length}</span></span> |
                                    <span> Due: <span className="font-semibold">{sample.dueDate}</span></span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Today's Tasks & Notifications */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Today's Tasks</h3>
                        <div className="space-y-2">
                           {todaysTasks.length > 0 ? todaysTasks.map(task => (
                               <div key={task.id} className="text-sm p-2 bg-blue-50 rounded-md">{task.productName} tests due</div>
                           )) : <p className="text-sm text-gray-500">No specific tasks due today.</p>}
                           <div className="text-sm p-2 bg-blue-50 rounded-md">Stability pull for ST-001</div>
                           <div className="text-sm p-2 bg-blue-50 rounded-md">Calibrate pH Meter PH-02</div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Notifications</h3>
                        <div className="space-y-2">
                            {notifications.map(n => (
                                <div key={n.id} className={`p-2 rounded-md border-l-4 text-sm ${getNotificationColor(n.type)}`}>{n.text}</div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Performance Snapshot (This Week)</h3>
                    <div className="flex justify-around">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-primary-600">42</p>
                            <p className="text-sm text-gray-500">Tests Completed</p>
                        </div>
                         <div className="text-center">
                            <p className="text-3xl font-bold text-primary-600">2.8 <span className="text-xl">days</span></p>
                            <p className="text-sm text-gray-500">Average TAT</p>
                        </div>
                    </div>
                </div>
             </div>
        </div>
    );
};

export default QCDashboardOfficer;
