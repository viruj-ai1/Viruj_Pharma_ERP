import React, { useState, useMemo } from 'react';
import { DEVIATIONS, USERS } from '../../services/mockData';
import { Deviation } from '../../types';

const QualityView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'deviations' | 'capa' | 'audits'>('overview');

    const openDeviations = DEVIATIONS.filter(d => d.status !== 'Closed').length;
    const capaInProgress = 5; // Mock data
    const trainingCompliance = 98.2; // Mock data

    const sortedDeviations = useMemo(() => {
        return [...DEVIATIONS].sort((a,b) => new Date(b.dateOpened).getTime() - new Date(a.dateOpened).getTime());
    }, []);

    const getSeverityColor = (severity: Deviation['severity']) => {
        switch(severity) {
            case 'Critical': return 'text-red-600';
            case 'High': return 'text-orange-600';
            case 'Medium': return 'text-yellow-600';
            case 'Low': return 'text-gray-600';
            default: return 'text-gray-600';
        }
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Quality & Compliance Overview</h1>
            <p className="text-gray-500 mt-1">Consolidated view of all quality and regulatory activities.</p>

            <div className="border-b border-gray-200 mt-6">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button onClick={() => setActiveTab('overview')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Compliance Overview</button>
                    <button onClick={() => setActiveTab('deviations')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'deviations' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Deviations / Holds</button>
                    <button onClick={() => setActiveTab('capa')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'capa' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>CAPA Management</button>
                    <button onClick={() => setActiveTab('audits')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'audits' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Audit Trail</button>
                </nav>
            </div>
            
            <div className="mt-8">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-md"><h4 className="text-gray-500">Open Deviations</h4><p className="text-3xl font-bold">{openDeviations}</p></div>
                        <div className="bg-white p-6 rounded-lg shadow-md"><h4 className="text-gray-500">CAPAs in Progress</h4><p className="text-3xl font-bold">{capaInProgress}</p></div>
                        <div className="bg-white p-6 rounded-lg shadow-md"><h4 className="text-gray-500">Training Compliance</h4><p className="text-3xl font-bold">{trainingCompliance}%</p></div>
                        <div className="md:col-span-3 bg-white p-6 rounded-lg shadow-md">
                            <h3 className="font-semibold mb-4">Upcoming Audit Calendar</h3>
                            <p className="text-gray-600">Placeholder for audit calendar visualization.</p>
                        </div>
                    </div>
                )}
                {activeTab === 'deviations' && (
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full leading-normal">
                                <thead>
                                    <tr>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Dev ID</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Plant</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Severity</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Owner</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedDeviations.map(d => (
                                        <tr key={d.id} className="hover:bg-gray-50">
                                            <td className="px-5 py-4 border-b border-gray-200 text-sm"><p className="font-semibold uppercase">{d.id}</p><p className="text-xs text-gray-500">{d.title}</p></td>
                                            <td className="px-5 py-4 border-b border-gray-200 text-sm">{d.plant}</td>
                                            <td className={`px-5 py-4 border-b border-gray-200 text-sm font-semibold ${getSeverityColor(d.severity)}`}>{d.severity}</td>
                                            <td className="px-5 py-4 border-b border-gray-200 text-sm">{d.status}</td>
                                            <td className="px-5 py-4 border-b border-gray-200 text-sm">{USERS.find(u => u.id === d.assignedTo)?.name || 'Unassigned'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                {activeTab !== 'overview' && activeTab !== 'deviations' && (
                     <div className="mt-6 bg-white p-8 rounded-lg shadow-md text-center">
                        <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
                        <p>This area will be built out as per the specification.</p>
                      </div>
                )}
            </div>
        </div>
    );
};

export default QualityView;