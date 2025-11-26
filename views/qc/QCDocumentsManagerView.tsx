import React from 'react';

const QCDocumentsManagerView: React.FC = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Documents (Controlled Access)</h1>
            <div className="mt-6 bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Document Library</h2>
                <p className="text-gray-600 mb-4">This section allows you to view all controlled documents. Clicking a document would open a viewer with options to add comments or suggest revisions to the QC Head.</p>
                <div className="space-y-2">
                    <div className="p-3 bg-gray-50 rounded-md flex justify-between items-center">
                        <p>SOP-QC-001: HPLC Operation</p>
                        <button className="text-primary-600 font-semibold text-sm">View & Comment</button>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-md flex justify-between items-center">
                        <p>STP-PARA-003: Assay Method for Paracetamol</p>
                         <button className="text-primary-600 font-semibold text-sm">View & Comment</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QCDocumentsManagerView;