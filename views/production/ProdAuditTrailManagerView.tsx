
import React from 'react';
import { PRODUCTION_AUDIT_LOG } from '../../services/mockData';

const ProdAuditTrailManagerView: React.FC = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Audit Trail (Manager Scope)</h1>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50"><tr>
                        <th className="p-3 text-left text-xs font-semibold uppercase">Timestamp</th>
                        <th className="p-3 text-left text-xs font-semibold uppercase">User</th>
                        <th className="p-3 text-left text-xs font-semibold uppercase">Action</th>
                        <th className="p-3 text-left text-xs font-semibold uppercase">Details</th>
                    </tr></thead>
                    <tbody>
                        {PRODUCTION_AUDIT_LOG.slice(0, 10).map(log => (
                            <tr key={log.id} className="border-b">
                                <td className="p-3 text-sm">{log.timestamp}</td>
                                <td className="p-3 font-semibold text-sm">{log.user}</td>
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

export default ProdAuditTrailManagerView;
