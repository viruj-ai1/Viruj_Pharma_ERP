import React, { useState } from 'react';
import { GRNS, PURCHASE_ORDERS } from '../../services/mockData';
import { GoodsReceiptNote, PoStatus } from '../../types';

const InboundView: React.FC = () => {
    const [activeTab, setActiveTab] = useState('grn-creation');
    const expectedDeliveries = PURCHASE_ORDERS.filter(po => po.status === PoStatus.Sent || po.status === PoStatus.Dispatched);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Inbound (GRN & Receiving)</h1>
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    <button onClick={() => setActiveTab('expected')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'expected' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:border-gray-300'}`}>Expected Deliveries</button>
                    <button onClick={() => setActiveTab('grn-creation')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'grn-creation' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:border-gray-300'}`}>GRN Creation</button>
                    <button onClick={() => setActiveTab('grn-history')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'grn-history' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:border-gray-300'}`}>GRN History</button>
                </nav>
            </div>
            {activeTab === 'expected' && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Expected Deliveries</h2>
                    {/* Placeholder content */}
                    <p>Showing {expectedDeliveries.length} upcoming deliveries.</p>
                </div>
            )}
            {activeTab === 'grn-creation' && (
                 <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Create Goods Receipt Note (GRN)</h2>
                     <form className="space-y-4 max-w-lg">
                        <div><label className="block text-sm font-medium">PO Number</label><input type="text" className="mt-1 w-full p-2 border rounded-md" /></div>
                        <div><label className="block text-sm font-medium">Delivery Challan</label><input type="text" className="mt-1 w-full p-2 border rounded-md" /></div>
                        <div><label className="block text-sm font-medium">Quantity Received</label><input type="number" className="mt-1 w-full p-2 border rounded-md" /></div>
                        <div className="flex justify-end"><button type="submit" className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg">Approve GRN</button></div>
                    </form>
                </div>
            )}
            {activeTab === 'grn-history' && (
                 <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">GRN History</h2>
                    {GRNS.map(grn => <div key={grn.id} className="p-2 border-b">{grn.id} for PO {grn.poId}</div>)}
                </div>
            )}
        </div>
    );
};

export default InboundView;
