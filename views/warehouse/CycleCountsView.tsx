import React from 'react';
import { CYCLE_COUNTS } from '../../services/mockData';

const CycleCountsView: React.FC = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Cycle Counts / Stock Audits</h1>
             <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <h2 className="text-xl font-semibold p-4 border-b">Cycle Counts</h2>
                <table className="min-w-full">
                     <thead className="bg-gray-50"><tr>
                        <th className="p-3 text-left">Date</th>
                        <th className="p-3 text-left">Bins</th>
                        <th className="p-3 text-left">Variances</th>
                        <th className="p-3 text-left">Status</th>
                    </tr></thead>
                    <tbody>
                        {CYCLE_COUNTS.map(cc => (
                            <tr key={cc.id} className="border-b">
                                <td className="p-3">{cc.date}</td>
                                <td className="p-3">{cc.bins.join(', ')}</td>
                                <td className="p-3">{cc.variances}</td>
                                <td className="p-3">{cc.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CycleCountsView;
