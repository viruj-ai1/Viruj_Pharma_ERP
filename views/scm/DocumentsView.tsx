import React, { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { DOCUMENTS } from '../../services/mockData';
import { Document, DocumentType, Role } from '../../types';

const DocumentTypeBadge: React.FC<{ type: DocumentType }> = ({ type }) => {
    const colors: { [key in DocumentType]?: string } = {
        [DocumentType.Indent]: 'bg-yellow-100 text-yellow-800',
        [DocumentType.PurchaseOrder]: 'bg-blue-100 text-blue-800',
        [DocumentType.CoA]: 'bg-sky-100 text-sky-800',
        [DocumentType.BMR]: 'bg-orange-100 text-orange-800',
        [DocumentType.SOP]: 'bg-gray-100 text-gray-800',
        [DocumentType.DeviationReport]: 'bg-red-100 text-red-800'
    };
    const colorClass = colors[type] || 'bg-gray-100 text-gray-800';
    return (
        <span className={`px-2 py-1 text-xs font-semibold leading-tight rounded-full ${colorClass}`}>
            {type}
        </span>
    );
};

const DocumentsView: React.FC = () => {
    const [filterType, setFilterType] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('date-desc');

    // Procurement officer is interested in these document types
    const procurementDocTypes = [
        DocumentType.Indent, 
        DocumentType.PurchaseOrder,
        DocumentType.CoA,
    ];

    const filteredAndSortedDocuments = useMemo(() => {
        let docs = DOCUMENTS.filter(doc => {
            if (!procurementDocTypes.includes(doc.type)) return false;
            if (searchTerm && !doc.title.toLowerCase().includes(searchTerm.toLowerCase()) && !doc.referenceId.toLowerCase().includes(searchTerm.toLowerCase())) return false;
            if (filterType !== 'All' && doc.type !== filterType) return false;
            return true;
        });

        switch(sortOrder) {
            case 'date-desc':
                docs.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                break;
            case 'date-asc':
                 docs.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                break;
            case 'title-asc':
                docs.sort((a,b) => a.title.localeCompare(b.title));
                break;
            case 'type-asc':
                docs.sort((a,b) => a.type.localeCompare(b.type));
                break;
        }

        return docs;
    }, [filterType, searchTerm, sortOrder]);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Procurement Document Center</h1>

            <div className="mb-4 p-4 bg-white rounded-lg shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
                 <input
                    type="text"
                    placeholder="Search by title or reference ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <label htmlFor="doc-type-filter" className="text-sm font-medium text-gray-600">Type:</label>
                        <select id="doc-type-filter" value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                            <option value="All">All Types</option>
                            {procurementDocTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                     <div className="flex items-center space-x-2">
                        <label htmlFor="sort-order" className="text-sm font-medium text-gray-600">Sort by:</label>
                        <select id="sort-order" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                           <option value="date-desc">Date (Newest)</option>
                           <option value="date-asc">Date (Oldest)</option>
                           <option value="title-asc">Title (A-Z)</option>
                           <option value="type-asc">Type</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Document Title</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Reference ID</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAndSortedDocuments.map((doc: Document) => (
                                <tr key={doc.id} className="hover:bg-gray-50">
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm"><p className="text-gray-900 whitespace-no-wrap font-semibold">{doc.title}</p></td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm"><DocumentTypeBadge type={doc.type} /></td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm"><p className="text-gray-600 whitespace-no-wrap uppercase">{doc.referenceId}</p></td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm"><p className="text-gray-900 whitespace-no-wrap">{doc.date}</p></td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right"><button className="text-primary-600 hover:text-primary-900">View Document</button></td>
                                </tr>
                            ))}
                            {filteredAndSortedDocuments.length === 0 && (
                                <tr><td colSpan={5} className="text-center py-10 text-gray-500">No documents found matching your criteria.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DocumentsView;