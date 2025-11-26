import React from 'react';
import { DOCUMENTS } from '../../services/mockData';
import { DocumentType } from '../../types';

const WarehouseComplianceDocsView: React.FC = () => {
    const warehouseDocs = DOCUMENTS.filter(d => d.type === DocumentType.SOP && d.referenceId.includes('WH'));
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Warehouse Compliance Docs</h1>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50"><tr>
                        <th className="p-3 text-left">Document</th>
                        <th className="p-3 text-left">Version</th>
                    </tr></thead>
                    <tbody>
                        {warehouseDocs.map(doc => (
                            <tr key={doc.id} className="border-b">
                                <td className="p-3">{doc.title}</td>
                                <td className="p-3">{doc.version}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default WarehouseComplianceDocsView;
