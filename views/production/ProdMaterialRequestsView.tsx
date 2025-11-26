import React, { useState } from 'react';
import { MATERIAL_REQUESTS } from '../../services/mockData';

const ProdMaterialRequestsView: React.FC = () => {
    const [activeTab, setActiveTab] = useState('consumption');

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Material Consumption, Requests & Variance</h1>
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    <button onClick={() => setActiveTab('consumption')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'consumption' ? 'border-primary-500 text-primary-600' : 'border-transparent'}`}>Consumption Tracker</button>
                    <button onClick={() => setActiveTab('requests')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'requests' ? 'border-primary-500 text-primary-600' : 'border-transparent'}`}>Material Requests</button>
                    <button onClick={() => setActiveTab('variance')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'variance' ? 'border-primary-500 text-primary-600' : 'border-transparent'}`}>Variance Reports</button>
                </nav>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                {activeTab === 'requests' && (
                    <>
                        <h2 className="text-xl font-semibold mb-4">Pending Material Requests</h2>
                        <div className="space-y-3">
                            {MATERIAL_REQUESTS.filter(r => r.status === 'Pending Manager Approval').map(req => (
                                <div key={req.id} className="p-3 bg-gray-50 rounded-md flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">{req.materialName} ({req.quantity} {req.unit})</p>
                                        <p className="text-sm text-gray-500">For Batch {req.batchNumber}</p>
                                    </div>
                                    <div className="space-x-2">
                                        <button className="text-sm font-semibold text-red-600">Reject</button>
                                        <button className="text-sm font-semibold text-green-600">Approve</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
                 {activeTab !== 'requests' && (
                     <div className="text-center p-8">
                        <p className="text-gray-500">Content for '{activeTab}' tab coming soon.</p>
                     </div>
                )}
            </div>
        </div>
    );
};

export default ProdMaterialRequestsView;