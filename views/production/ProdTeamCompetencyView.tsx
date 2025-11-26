
import React from 'react';
import { USERS } from '../../services/mockData';
import { Role } from '../../types';

const ProdTeamCompetencyView: React.FC = () => {
    const myTeam = USERS.filter(u => u.role === Role.Production_Operator);
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Team Competency</h1>
            <div className="bg-white p-6 rounded-lg shadow-md overflow-hidden">
                 <table className="min-w-full">
                    <thead className="bg-gray-50"><tr>
                        <th className="p-3 text-left text-xs font-semibold uppercase">Operator</th>
                        <th className="p-3 text-left text-xs font-semibold uppercase">Machine Certifications</th>
                        <th className="p-3 text-left text-xs font-semibold uppercase">Training Status</th>
                    </tr></thead>
                    <tbody>
                        {myTeam.map(op => (
                            <tr key={op.id} className="border-b">
                                <td className="p-3 font-semibold">{op.name}</td>
                                <td className="p-3 text-sm">R-101, B-102</td>
                                <td className="p-3 text-sm text-green-600">Up to date</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProdTeamCompetencyView;
