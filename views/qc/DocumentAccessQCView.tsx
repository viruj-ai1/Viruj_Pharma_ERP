import React, { useState, useMemo } from 'react';
import { DOCUMENTS } from '../../services/mockData';
import { DocumentType } from '../../types';

const DocumentAccessQCView: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    
    const qcDocuments = useMemo(() => {
        return DOCUMENTS.filter(doc => 
            (doc.type === DocumentType.SOP || doc.type === DocumentType.Specification) &&
            (doc.referenceId.toLowerCase().includes('qc') || doc.title.toLowerCase().includes('hplc'))
        ).filter(doc => 
            doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
            doc.referenceId.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Document Access (Read-only)</h1>
            <div className="mb-4">
                <input 
                    type="text" 
                    placeholder="Search SOPs, STPs, Methods..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                />
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50"><tr>
                        <th className="p-3 text-left text-xs font-semibold uppercase">Document Title</th>
                        <th className="p-3 text-left text-xs font-semibold uppercase">Reference ID</th>
                        <th className="p-3 text-left text-xs font-semibold uppercase">Version</th>
                        <th className="p-3"></th>
                    </tr></thead>
                    <tbody>
                        {qcDocuments.map(doc => (
                            <tr key={doc.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-semibold">{doc.title}</td>
                                <td className="p-3 font-mono">{doc.referenceId}</td>
                                <td className="p-3">{doc.version}</td>
                                <td className="p-3 text-right">
                                    <button className="text-primary-600 font-semibold text-sm">View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DocumentAccessQCView;
