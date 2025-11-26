import React, { useState, useMemo } from 'react';
import { VENDORS } from '../../services/mockData';
import { MaterialIndent, IndentStatus } from '../../types';

interface IndentProposalModalProps {
    indent: MaterialIndent;
    onClose: () => void;
    onSubmit: (indentId: string, proposalData: any) => void;
}

const IndentProposalModal: React.FC<IndentProposalModalProps> = ({ indent, onClose, onSubmit }) => {
    const approvedVendors = useMemo(() => VENDORS.filter(v => v.suppliedMaterialIds.includes(indent.materialId)), [indent.materialId]);
    
    const [vendorId, setVendorId] = useState(indent.proposalVendorId || approvedVendors[0]?.id || '');
    const [price, setPrice] = useState(indent.proposalPrice || '');
    const [deliveryDate, setDeliveryDate] = useState(indent.proposalDeliveryDate || '');
    const [notes, setNotes] = useState(indent.proposalNotes || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (vendorId && price && deliveryDate) {
            onSubmit(indent.id, {
                proposalVendorId: vendorId,
                proposalPrice: parseFloat(price.toString()),
                proposalDeliveryDate: deliveryDate,
                proposalNotes: notes,
            });
        }
    };

    // Mock last purchase details for context
    const lastPurchase = {
        vendor: 'ChemPro Inc.',
        price: 45000,
        date: '2023-08-15'
    };

    return (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl animate-fade-in-down">
                <h2 className="text-2xl font-bold mb-2 text-gray-800">Procurement Proposal</h2>
                <p className="mb-6 text-gray-500">For Indent <span className="font-mono uppercase">{indent.id}</span> - {indent.quantity} {indent.unit} of <span className="font-semibold">{indent.materialName}</span>.</p>

                {indent.status === IndentStatus.Proposal_Revision_Needed && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                        <p className="font-bold text-yellow-800">Revision Requested</p>
                        <p className="text-sm text-yellow-700">{indent.revisionFeedback}</p>
                    </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Proposal Details</h3>
                         <div>
                            <label htmlFor="vendor" className="block text-sm font-medium text-gray-700">Select Vendor</label>
                            <select id="vendor" value={vendorId} onChange={e => setVendorId(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                               {approvedVendors.map(v => <option key={v.id} value={v.id}>{v.name} (Rating: {v.rating}/5)</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Proposed Price (Total)</label>
                            <input type="number" id="price" value={price} onChange={e => setPrice(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"/>
                        </div>
                        <div>
                            <label htmlFor="deliveryDate" className="block text-sm font-medium text-gray-700">Expected Delivery Date</label>
                            <input type="date" id="deliveryDate" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"/>
                        </div>
                        <div>
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Justification / Notes</label>
                            <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" placeholder="Reason for vendor selection, price justification, etc."></textarea>
                        </div>
                        <div className="pt-4 flex justify-end space-x-3">
                            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Submit for Approval</button>
                        </div>
                    </form>
                    <div className="bg-gray-50 p-4 rounded-lg border">
                        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Context</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Last Purchase Details (Mock)</p>
                                <p className="text-sm text-gray-800"><strong>Vendor:</strong> {lastPurchase.vendor}</p>
                                <p className="text-sm text-gray-800"><strong>Price:</strong> ₹{lastPurchase.price.toLocaleString('en-IN')}</p>
                                <p className="text-sm text-gray-800"><strong>Date:</strong> {lastPurchase.date}</p>
                            </div>
                            <div>
                                 <p className="text-sm font-medium text-gray-600">Approval Workflow</p>
                                 <ol className="text-xs text-gray-500 list-decimal list-inside mt-1 space-y-1">
                                    <li>Proposal Submission (You)</li>
                                    <li>Plant Head Approval</li>
                                    <li>Management Approval</li>
                                    <li>PO Creation</li>
                                 </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
             <style>{`
                @keyframes fade-in-down {
                    0% { opacity: 0; transform: translateY(-10px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-down { animation: fade-in-down 0.2s ease-out; }
            `}</style>
        </div>
    );
};

export default IndentProposalModal;