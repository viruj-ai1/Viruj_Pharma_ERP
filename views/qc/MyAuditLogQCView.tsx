import React, { useState } from 'react';

const mockAuditLog = [
    { id: 1, date: '2023-11-01 10:05:23', module: 'Testing Bench', action: 'Submitted result for Assay on samp-005.' },
    { id: 2, date: '2023-11-01 09:15:45', module: 'Instruments', action: 'Started session on HPLC-02.' },
    { id: 3, date: '2023-10-30 14:30:01', module: 'Standards', action: 'Consumed 10mg of Paracetamol RS for samp-004.' },
    { id: 4, date: '2023-10-30 11:00:12', module: 'Testing Bench', action: 'Saved draft for Purity test on samp-005.' },
];

const MyAuditLogQCView: React.FC = () => {
    const [moduleFilter, setModuleFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredLog = mockAuditLog.filter(entry => 
        (moduleFilter === 'All' || entry.module === moduleFilter) &&
        (entry.action.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">My Audit Log</h1>
            <div className="mb-4 p-4 bg-white rounded-lg shadow-md flex items-center justify-between gap-4">
                <input 
                    type="text"
                    placeholder="Search actions..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-1/3 p-2 border rounded-md"
                />
                <div className="flex items-center space-x-2">
                    <label className="text-sm">Module:</label>
                    <select value={moduleFilter} onChange={e => setModuleFilter(e.target.value)} className="p-2 border rounded-md bg-white">
                        <option>All</option>
                        <option>Testing Bench</option>
                        <option>Instruments</option>
                        <option>Standards</option>
                    </select>
                </div>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50"><tr>
                        <th className="p-3 text-left text-xs font-semibold uppercase">Timestamp</th>
                        <th className="p-3 text-left text-xs font-semibold uppercase">Module</th>
                        <th className="p-3 text-left text-xs font-semibold uppercase">Action</th>
                    </tr></thead>
                    <tbody>
                        {filteredLog.map(entry => (
                            <tr key={entry.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 whitespace-nowrap">{entry.date}</td>
                                <td className="p-3">{entry.module}</td>
                                <td className="p-3">{entry.action}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyAuditLogQCView;
