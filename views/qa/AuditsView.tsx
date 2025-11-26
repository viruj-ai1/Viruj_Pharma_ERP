import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { INTERNAL_AUDITS } from '../../services/mockData';
import { InternalAudit } from '../../types';

const AuditsView: React.FC = () => {
    const { user } = useAuth();
    if (!user) return null;

    const plantAudits = INTERNAL_AUDITS.filter(a => a.plantId === user.plantId);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Internal Audits</h1>
             <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal">
                         <thead className="bg-gray-50">
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase">Audit ID</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase">Title</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase">Findings</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {plantAudits.map((audit: InternalAudit) => (
                                <tr key={audit.id} className="hover:bg-gray-50">
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm font-semibold">{audit.id}</td>
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm">{audit.title}</td>
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm">{audit.date}</td>
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm">{audit.status}</td>
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm">{audit.findings}</td>
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm text-right">
                                        <button className="text-primary-600 font-semibold hover:underline">View Report</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AuditsView;