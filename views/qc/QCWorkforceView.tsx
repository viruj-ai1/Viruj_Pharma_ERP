import React from 'react';
import { USERS } from '../../services/mockData';
import { Role } from '../../types';

const QCWorkforceView: React.FC = () => {
    const qcTeam = USERS.filter(u => u.department === 'Quality Control');
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">QC Workforce & Competency</h1>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <h2 className="text-xl font-semibold p-4 border-b">Analyst Competency Map</h2>
                <table className="min-w-full">
                     <thead className="bg-gray-50"><tr>
                        <th className="p-3 text-left">Analyst</th>
                        <th className="p-3 text-left">Role</th>
                        <th className="p-3 text-left">Authorizations</th>
                        <th className="p-3"></th>
                    </tr></thead>
                    <tbody>
                        {qcTeam.filter(u => u.role === Role.QC_Operator).map(analyst => (
                            <tr key={analyst.id} className="border-b">
                                <td className="p-3 font-semibold">{analyst.name}</td>
                                <td className="p-3">{analyst.role}</td>
                                <td className="p-3 text-sm">HPLC, GC</td>
                                <td className="p-3 text-right"><button className="text-primary-600 font-semibold text-sm">Approve/Revoke</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default QCWorkforceView;