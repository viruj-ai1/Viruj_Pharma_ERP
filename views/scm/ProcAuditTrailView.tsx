import React from 'react';
import { PROC_AUDIT_LOG } from '../../services/mockData';

const ProcAuditTrailView: React.FC = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">My Audit Trail</h1>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50"><tr>
                        <th className="p-3 text-left">Timestamp</th>
                        <th className="p-3 text-left">Module</th>
                        <th className="p-3 text-left">Action</th>
                        <th className="p-3 text-left">Details</th>
                    </tr></thead>
                    <tbody>
                        {PROC_AUDIT_LOG.map(log => (
                            <tr key={log.id} className="border-b">
                                <td className="p-3 text-sm">{log.timestamp}</td>
                                <td className="p-3 text-sm">{log.module}</td>
                                <td className="p-3 text-sm">{log.action}</td>
                                <td className="p-3 text-sm">{log.details}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProcAuditTrailView;
