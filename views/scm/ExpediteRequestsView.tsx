import React from 'react';
import { PURCHASE_ORDERS } from '../../services/mockData';

const ExpediteRequestsView: React.FC = () => {
    const delayedPOs = PURCHASE_ORDERS.filter(po => new Date(po.expectedDeliveryDate) < new Date());
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Expedite Requests (Delay Handling)</h1>
             <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
                <h2 className="text-xl font-semibold mb-4">Raise Expedite Request</h2>
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Select Delayed PO</label>
                        <select className="mt-1 w-full p-2 border rounded-md bg-white">
                            {delayedPOs.map(po => <option key={po.id}>{po.poNumber} - {po.materialName}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Reason for Escalation</label>
                        <textarea className="mt-1 w-full p-2 border rounded-md" placeholder="e.g., Vendor delay, production requirement accelerated..."></textarea>
                    </div>
                    <div className="text-right">
                        <button type="submit" className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg">Send Escalation</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ExpediteRequestsView;
