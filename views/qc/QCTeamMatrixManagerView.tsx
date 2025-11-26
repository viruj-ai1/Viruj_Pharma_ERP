import React from 'react';
import { USERS } from '../../services/mockData';
import { Role } from '../../types';

const QCTeamMatrixManagerView: React.FC = () => {
    const qcOfficers = USERS.filter(u => u.role === Role.QC_Operator);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Team & Training Matrix</h1>
            <div className="mt-6 bg-white shadow-md rounded-lg overflow-hidden">
                <h2 className="text-xl font-semibold p-4 border-b">Team Overview</h2>
                <table className="min-w-full">
                    <thead className="bg-gray-50"><tr>
                        <th className="p-3 text-left">Analyst</th>
                        <th className="p-3 text-left">Skills</th>
                        <th className="p-3 text-left">Instruments Qualified</th>
                        <th className="p-3"></th>
                    </tr></thead>
                    <tbody>
                        {qcOfficers.map(officer => (
                             <tr key={officer.id} className="border-b">
                                <td className="p-3 font-semibold">{officer.name}</td>
                                <td className="p-3">HPLC, GC, Titration</td>
                                <td className="p-3">HPLC-01, GC-03</td>
                                <td className="p-3 text-right"><button className="text-primary-600 font-semibold text-sm">View Profile</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Pending Training Requirements</h2>
                <p>No mandatory training pending for any team member.</p>
            </div>
        </div>
    );
};

export default QCTeamMatrixManagerView;