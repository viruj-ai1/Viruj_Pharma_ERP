import React from 'react';
import { USERS } from '../../services/mockData';
import { Role } from '../../types';

const ProdWorkforceView: React.FC = () => {
    const operators = USERS.filter(u => u.department === 'Production' && u.role === Role.Production_Operator);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Workforce Competency & Training Matrix</h1>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50"><tr>
                        <th className="p-3 text-left">Operator</th>
                        <th className="p-3 text-left">Certifications</th>
                        <th className="p-3 text-left">Training Due</th>
                        <th className="p-3"></th>
                    </tr></thead>
                    <tbody>
                        {operators.map(op => (
                            <tr key={op.id} className="border-b">
                                <td className="p-3 font-semibold">{op.name}</td>
                                <td className="p-3 text-sm">Reactor R-101, Blender B-102</td>
                                <td className="p-3 text-sm">None</td>
                                <td className="p-3 text-right"><button className="text-primary-600 font-semibold text-sm">View Profile</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProdWorkforceView;