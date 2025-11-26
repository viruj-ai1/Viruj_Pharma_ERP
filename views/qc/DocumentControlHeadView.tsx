import React, { useState } from 'react';
import { DOCUMENTS } from '../../services/mockData';
import { Document } from '../../types';

const DocumentControlHeadView: React.FC = () => {
    const [docs, setDocs] = useState(DOCUMENTS);
    const pendingApproval = docs.filter(d => d.status === 'Pending Approval');

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Document Control (QC Head)</h1>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <h2 className="text-xl font-semibold p-4 border-b">Documents Pending Final Approval</h2>
                 <table className="min-w-full">
                    <thead className="bg-gray-50"><tr>
                        <th className="p-3 text-left">Document</th>
                        <th className="p-3 text-left">Version</th>
                        <th className="p-3"></th>
                    </tr></thead>
                    <tbody>
                        {pendingApproval.map(doc => (
                            <tr key={doc.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-semibold">{doc.title}</td>
                                <td className="p-3">{doc.version}</td>
                                <td className="p-3 text-right space-x-2">
                                    <button className="text-sm font-semibold text-red-600">Reject</button>
                                    <button className="text-sm font-semibold text-green-600">Approve</button>
                                </td>
                            </tr>
                        ))}
                         {pendingApproval.length === 0 && (
                            <tr><td colSpan={3} className="text-center p-6 text-gray-500">No documents are pending your approval.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DocumentControlHeadView;