import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { DOCUMENTS } from '../../services/mockData';
import { DocumentType } from '../../types';

const DocumentControlView: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('sops');
    if (!user) return null;

    const getDocsByType = (type: DocumentType) => DOCUMENTS.filter(d => d.plantId === user.plantId && d.type === type);

    const sops = getDocsByType(DocumentType.SOP);
    const bmrs = getDocsByType(DocumentType.BMR);
    const specs = getDocsByType(DocumentType.Specification);

    const renderTable = (docs: any[], title: string) => (
        <table className="min-w-full">
            <thead className="bg-gray-50">
                <tr>
                    <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
                    <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase">Title</th>
                    <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase">Version</th>
                    <th className="p-3"></th>
                </tr>
            </thead>
            <tbody>
                {docs.map(doc => (
                    <tr key={doc.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-mono">{doc.referenceId}</td>
                        <td className="p-3">{doc.title}</td>
                        <td className="p-3">{doc.version}</td>
                        <td className="p-3 text-right"><button className="text-primary-600 font-semibold text-sm">View</button></td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Document Control</h1>
             <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button onClick={() => setActiveTab('sops')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'sops' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>SOPs</button>
                    <button onClick={() => setActiveTab('bmrs')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'bmrs' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>BMR Templates</button>
                    <button onClick={() => setActiveTab('specs')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'specs' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Specifications</button>
                </nav>
            </div>
            <div className="mt-6 bg-white shadow-md rounded-lg overflow-hidden">
                {activeTab === 'sops' && renderTable(sops, 'SOPs')}
                {activeTab === 'bmrs' && renderTable(bmrs, 'BMR Templates')}
                {activeTab === 'specs' && renderTable(specs, 'Specifications')}
            </div>
        </div>
    );
};

export default DocumentControlView;