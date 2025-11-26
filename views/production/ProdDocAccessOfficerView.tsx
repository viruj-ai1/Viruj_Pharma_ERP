import React, { useState } from 'react';
import { DOCUMENTS } from '../../services/mockData';

const ProdDocAccessOfficerView: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const docs = DOCUMENTS.filter(d => 
        d.referenceId.includes('PROD') || d.referenceId.includes('BMR')
    );

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Document Access (Read-only)</h1>
            <input 
                type="text" 
                placeholder="Search BMRs, SOPs..."
                className="w-full p-3 border rounded-lg mb-4"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50"><tr>
                        <th className="p-3 text-left">ID</th><th className="p-3 text-left">Title</th><th className="p-3"></th>
                    </tr></thead>
                    <tbody>
                        {docs.map(doc => (
                            <tr key={doc.id} className="border-b">
                                <td className="p-3 font-mono">{doc.referenceId}</td>
                                <td className="p-3">{doc.title}</td>
                                <td className="p-3 text-right"><button className="text-primary-600 font-semibold text-sm">View</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProdDocAccessOfficerView;