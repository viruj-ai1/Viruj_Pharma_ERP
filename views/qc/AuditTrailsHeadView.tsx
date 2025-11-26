import React, { useState } from 'react';
import { QC_AUDIT_LOG } from '../../services/mockData';

const AuditTrailsHeadView: React.FC = () => {
    const [moduleFilter, setModuleFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredLog = QC_AUDIT_LOG.filter(entry => 
        (moduleFilter === 'All' || entry.module === moduleFilter) &&
        (entry.action.toLowerCase().includes(searchTerm.toLowerCase()) || entry.user.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'Critical': return 'bg-red-100 text-red-800';
            case 'Major': return 'bg-orange-100 text-orange-800';
            case 'Warning': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Audit Trails (Extended Visibility)</h1>
            <div className="mb-4 p-4 bg-white rounded-lg shadow-md flex items-center justify-between gap-4">
                <input 
                    type="text"
                    placeholder="Search actions or users..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-1/3 p-2 border rounded-md"
                />
                <div className="flex items-center space-x-2">
                    <label className="text-sm">Module:</label>
                    <select value={moduleFilter} onChange={e => setModuleFilter(e.target.value)} className="p-2 border rounded-md bg-white">
                        <option>All</option>
                        <option>Testing Bench</option>
                        <option>Test Review</option>
                        <option>COA Approval</option>
                        <option>Instrument Control</option>
                    </select>
                </div>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50"><tr>
                        <th className="p-3 text-left">Timestamp</th>
                        <th className="p-3 text-left">User</th>
                        <th className="p-3 text-left">Module</th>
                        <th className="p-3 text-left">Action</th>
                        <th className="p-3 text-left">Severity</th>
                    </tr></thead>
                    <tbody>
                        {filteredLog.map(entry => (
                            <tr key={entry.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 whitespace-nowrap text-sm">{entry.timestamp}</td>
                                <td className="p-3 text-sm font-semibold">{entry.user}</td>
                                <td className="p-3 text-sm">{entry.module}</td>
                                <td className="p-3 text-sm">{entry.action}</td>
                                <td className="p-3 text-sm"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(entry.severity)}`}>{entry.severity}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AuditTrailsHeadView;
