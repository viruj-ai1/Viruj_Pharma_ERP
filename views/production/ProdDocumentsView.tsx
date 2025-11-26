import React, { useState } from 'react';
import { DOCUMENTS } from '../../services/mockData';
import { DocumentType } from '../../types';

const ProdDocumentsView: React.FC = () => {
    const prodDocs = DOCUMENTS.filter(d => d.type === DocumentType.BMR || d.referenceId.includes('PROD'));
    const pendingApproval = prodDocs.filter(d => d.status === 'Pending Approval');

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Production Documents (SOP/BMR/BPR)</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white shadow-md rounded-lg overflow-hidden">
                    <h2 className="text-xl font-semibold p-4 border-b">Document Library</h2>
                    <table className="min-w-full">
                        <thead className="bg-gray-50"><tr>
                            <th className="p-3 text-left">ID</th>
                            <th className="p-3 text-left">Title</th>
                            <th className="p-3 text-left">Version</th>
                        </tr></thead>
                        <tbody>
                            {prodDocs.map(d => (
                                <tr key={d.id} className="border-b">
                                    <td className="p-3 font-mono">{d.referenceId}</td>
                                    <td className="p-3">{d.title}</td>
                                    <td className="p-3">{d.version}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Pending Approvals</h2>
                    {pendingApproval.map(d => (
                        <div key={d.id} className="p-3 bg-gray-50 rounded-md flex justify-between items-center">
                            <p>{d.title}</p>
                            <button className="text-primary-600 font-semibold text-sm">Approve</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProdDocumentsView;