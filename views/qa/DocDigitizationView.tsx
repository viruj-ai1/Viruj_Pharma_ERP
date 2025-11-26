import React, { useState } from 'react';

const mockDocsToValidate = [
    { id: 'DIG-001', type: 'Historical BMR', date: '2018-05-10', uploader: 'QA Operator 1', status: 'Pending Validation' },
    { id: 'DIG-002', type: 'Cleaning Log', date: '2019-11-22', uploader: 'QA Operator 2', status: 'Pending Validation' },
    { id: 'DIG-003', type: 'Legacy SOP', date: '2015-02-01', uploader: 'QA Operator 1', status: 'Correction Needed' },
];

const DocDigitizationView: React.FC = () => {
    const [activeTab, setActiveTab] = useState('validation');
    const [selectedDoc, setSelectedDoc] = useState(mockDocsToValidate[0]);

    const renderContent = () => {
        switch (activeTab) {
            case 'upload':
                return (
                    <div className="text-center p-8 border-2 border-dashed rounded-lg">
                        <h3 className="text-xl font-semibold mb-4">Upload Center</h3>
                        <p className="text-gray-600 mb-4">Upload scanned documents, PDFs, or bulk ZIP files.</p>
                        <button className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg">Select Files</button>
                    </div>
                );
            case 'validation':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1 bg-gray-50 rounded-lg p-4 h-full">
                            <h3 className="font-semibold mb-2">Validation Queue</h3>
                            <div className="space-y-2">
                                {mockDocsToValidate.map(doc => (
                                    <button 
                                        key={doc.id} 
                                        onClick={() => setSelectedDoc(doc)}
                                        className={`w-full text-left p-3 rounded-md ${selectedDoc.id === doc.id ? 'bg-primary-100 text-primary-800' : 'hover:bg-gray-100'}`}
                                    >
                                        <p className="font-semibold">{doc.id} - {doc.type}</p>
                                        <p className="text-xs text-gray-500">{doc.status}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="md:col-span-2 space-y-4">
                            <div>
                                <h3 className="text-xl font-bold">{selectedDoc.id}: {selectedDoc.type}</h3>
                                <p className="text-sm text-gray-500">Uploaded by {selectedDoc.uploader} on {selectedDoc.date}</p>
                            </div>
                            <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
                                <p>Scanned Document Viewer Placeholder</p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Validation Checklist</h4>
                                <div className="space-y-2">
                                    {['Image clarity', 'Completeness', 'Signature/Stamp presence', 'Page order', 'Data integrity'].map(item => (
                                        <label key={item} className="flex items-center">
                                            <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                                            <span className="ml-2 text-gray-700">{item}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                             <div className="flex justify-end space-x-3 pt-4 border-t">
                                <button className="px-4 py-2 text-sm font-semibold text-yellow-700 bg-yellow-100 border border-yellow-300 rounded-lg hover:bg-yellow-200">Return for Correction</button>
                                <button className="px-4 py-2 text-sm font-semibold text-red-700 bg-red-100 border border-red-300 rounded-lg hover:bg-red-200">Reject</button>
                                <button className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700">Validated – Send to QA Head</button>
                            </div>
                        </div>
                    </div>
                );
            default:
                return <div>Coming soon</div>;
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Document Digitization & Validation</h1>
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button onClick={() => setActiveTab('upload')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'upload' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Upload Center</button>
                    <button onClick={() => setActiveTab('validation')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'validation' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Validation Stage</button>
                    <button onClick={() => setActiveTab('archive')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'archive' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Archive & Audit Trail</button>
                </nav>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                {renderContent()}
            </div>
        </div>
    );
};

export default DocDigitizationView;
