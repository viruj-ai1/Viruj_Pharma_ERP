import React, { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { PurchaseOrder, PoStatus, Material, Vendor } from '../../types';
import { MATERIALS, VENDORS, PURCHASE_ORDERS } from '../../services/mockData';

interface CreatePoModalProps {
    onClose: () => void;
    onPoCreated: () => void;
}

const CreatePoModal: React.FC<CreatePoModalProps> = ({ onClose, onPoCreated }) => {
    const { user } = useAuth();
    const [materialId, setMaterialId] = useState<string>('');
    const [vendorId, setVendorId] = useState<string>('');
    const [quantity, setQuantity] = useState('');
    const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');
    const [justificationNotes, setJustificationNotes] = useState('');

    const availableVendors = useMemo(() => {
        if (!materialId) return [];
        return VENDORS.filter(v => v.suppliedMaterialIds.includes(materialId));
    }, [materialId]);

    const selectedMaterial = useMemo(() => {
        return MATERIALS.find(m => m.id === materialId);
    }, [materialId]);
    
    React.useEffect(() => {
        setVendorId('');
    }, [materialId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!materialId || !vendorId || !quantity || !expectedDeliveryDate || !user || !user.plantId || !selectedMaterial) return;
        
        const poNumber = `PO-${new Date().getFullYear()}-${String(PURCHASE_ORDERS.length + 1).padStart(3, '0')}`;
        const randomPricePerUnit = Math.random() * 50 + 10;
        const totalAmount = Math.round(parseInt(quantity) * randomPricePerUnit);

        const newPO: PurchaseOrder = {
            id: `po-${Date.now()}`,
            poNumber,
            materialId,
            materialName: selectedMaterial.name,
            quantity: parseInt(quantity),
            unit: selectedMaterial.defaultUnit,
            vendorId,
            status: PoStatus.Pending_Finance_Approval, // Start of new workflow
            dateCreated: new Date().toISOString().split('T')[0],
            expectedDeliveryDate,
            totalAmount,
            createdBy: user.id,
            justificationNotes,
            plantId: user.plantId,
        };

        PURCHASE_ORDERS.push(newPO);
        onPoCreated();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg animate-fade-in-down">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Create New Purchase Order</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="material" className="block text-sm font-medium text-gray-700">Material</label>
                        <select id="material" value={materialId} onChange={e => setMaterialId(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                            <option value="" disabled>Select a material</option>
                            {MATERIALS.filter(m => m.type !== 'Finished Good').map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="vendor" className="block text-sm font-medium text-gray-700">Vendor</label>
                        <select id="vendor" value={vendorId} onChange={e => setVendorId(e.target.value)} required disabled={!materialId} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100">
                            <option value="" disabled>Select a vendor</option>
                            {availableVendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                        </select>
                        {!materialId && <p className="text-xs text-gray-500 mt-1">Please select a material first to see approved vendors.</p>}
                    </div>
                     <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
                        <input type="number" id="quantity" value={quantity} onChange={e => setQuantity(e.target.value)} required min="1" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"/>
                    </div>
                     <div>
                        <label htmlFor="deliveryDate" className="block text-sm font-medium text-gray-700">Expected Delivery Date</label>
                        <input type="date" id="deliveryDate" value={expectedDeliveryDate} onChange={e => setExpectedDeliveryDate(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"/>
                    </div>
                    <div>
                        <label htmlFor="justification" className="block text-sm font-medium text-gray-700">Justification / Notes for Approvers</label>
                        <textarea id="justification" value={justificationNotes} onChange={e => setJustificationNotes(e.target.value)} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" placeholder="e.g., Reason for vendor selection, urgency, etc."></textarea>
                    </div>
                    <div className="pt-4 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Create PO</button>
                    </div>
                </form>
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

export default CreatePoModal;