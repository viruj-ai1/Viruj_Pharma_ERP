import React, { useState, useMemo } from 'react';
import { DOCUMENTS } from '../../services/mockData';
import { Document, DocumentType } from '../../types';

const DocumentTypeBadge: React.FC<{ type: DocumentType }> = ({ type }) => {
    const colors: { [key in DocumentType]?: string } = {
        [DocumentType.Indent]: 'bg-yellow-100 text-yellow-700',
        [DocumentType.PurchaseOrder]: 'bg-blue-100 text-blue-700',
        [DocumentType.CoA]: 'bg-sky-100 text-sky-700',
        [DocumentType.BMR]: 'bg-orange-100 text-orange-700',
        [DocumentType.SOP]: 'bg-slate-100 text-slate-700',
        [DocumentType.DeviationReport]: 'bg-red-100 text-red-700',
        [DocumentType.QCReport]: 'bg-teal-100 text-teal-700',
    };
    const colorClass = colors[type] || 'bg-slate-100 text-slate-700';
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

    const procurementDocTypes = [
        DocumentType.Indent, 
        DocumentType.PurchaseOrder,
        DocumentType.CoA,
        DocumentType.QCReport,
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
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">Procurement Document Center</h1>

            <div className="p-4 bg-white rounded-lg shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
                 <input
                    type="text"
                    placeholder="Search by title or reference ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-1/3 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <label htmlFor="doc-type-filter" className="text-sm font-medium text-slate-600">Type:</label>
                        <select id="doc-type-filter" value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                            <option value="All">All Types</option>
                            {procurementDocTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                     <div className="flex items-center space-x-2">
                        <label htmlFor="sort-order" className="text-sm font-medium text-slate-600">Sort by:</label>
                        <select id="sort-order" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500">
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
                    <table className="min-w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Document Title</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Reference ID</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {filteredAndSortedDocuments.map((doc: Document) => (
                                <tr key={doc.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 whitespace-nowrap"><p className="text-sm text-slate-900 font-semibold">{doc.title}</p></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><DocumentTypeBadge type={doc.type} /></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><p className="text-sm text-slate-500 uppercase font-mono">{doc.referenceId}</p></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><p className="text-sm text-slate-600">{doc.date}</p></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"><button className="text-primary-600 hover:text-primary-800">View Document</button></td>
                                </tr>
                            ))}
                            {filteredAndSortedDocuments.length === 0 && (
                                <tr><td colSpan={5} className="text-center py-10 text-slate-500">No documents found matching your criteria.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DocumentsView;