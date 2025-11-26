import React from 'react';
import { DEVIATIONS } from '../../services/mockData';
import { Department } from '../../types';

const QCInvestigationsManagerView: React.FC = () => {
    const qcDeviations = DEVIATIONS.filter(d => d.sourceDept === Department.QC && d.status !== 'Closed');

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Investigations (OOS/OOT/Deviations)</h1>
             <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">OOS/OOT Inbox</h2>
                <div className="space-y-3">
                    {qcDeviations.length > 0 ? qcDeviations.map(dev => (
                         <div key={dev.id} className="p-4 bg-red-50 rounded-md border-l-4 border-red-400 flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-red-800">{dev.title}</p>
                                <p className="text-sm text-gray-600">For Batch {dev.batchNumber}, Raised on {dev.dateOpened}</p>
                            </div>
                            <button className="bg-red-600 text-white font-semibold py-1 px-3 rounded-md text-sm">Open Case</button>
                        </div>
                    )) : (
                        <p className="text-gray-500">No open OOS/OOT cases.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QCInvestigationsManagerView;