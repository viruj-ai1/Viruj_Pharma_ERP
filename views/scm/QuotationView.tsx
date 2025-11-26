import React, { useState } from 'react';
import { PURCHASE_REQUISITIONS, VENDORS, RFQS, QUOTATIONS } from '../../services/mockData';
import { PurchaseRequisition, PRStatus } from '../../types';

const QuotationView: React.FC = () => {
    const [step, setStep] = useState(1);
    const [selectedPR, setSelectedPR] = useState<PurchaseRequisition | null>(null);

    const incomingPRs = PURCHASE_REQUISITIONS.filter(pr => pr.status === PRStatus.Pending);

    const handleSelectPR = (pr: PurchaseRequisition) => {
        setSelectedPR(pr);
        setStep(2);
    }

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Step 1: Select a Purchase Requisition to Process</h2>
                        <div className="space-y-2">
                            {incomingPRs.map(pr => (
                                <div key={pr.id} className="p-3 bg-gray-50 rounded-md flex justify-between items-center">
                                    <p>{pr.id}: {pr.materialName} ({pr.quantity} {pr.unit})</p>
                                    <button onClick={() => handleSelectPR(pr)} className="bg-primary-600 text-white font-semibold text-sm py-1 px-3 rounded-md">Create RFQ</button>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 2:
                return (
                     <div>
                        <h2 className="text-xl font-semibold mb-4">Step 2: Create RFQ for {selectedPR?.id}</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold">Select Vendors to include:</h3>
                                {VENDORS.map(v => <label key={v.id} className="flex items-center"><input type="checkbox" className="mr-2" />{v.name}</label>)}
                            </div>
                            <button onClick={() => setStep(3)} className="bg-primary-600 text-white font-semibold py-2 px-4 rounded-md">Send RFQ & Proceed</button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Step 3: Capture Quotes for RFQ-001</h2>
                        <p className="text-gray-600 mb-4">Quotes received from vendors are captured here.</p>
                        <button onClick={() => setStep(4)} className="bg-primary-600 text-white font-semibold py-2 px-4 rounded-md">View Comparison Sheet</button>
                    </div>
                );
            case 4:
                return (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Step 4: Comparison Sheet</h2>
                        <table className="min-w-full border">
                            <thead className="bg-gray-100"><tr><th className="p-2 border">Vendor</th><th className="p-2 border">Price</th><th className="p-2 border">Delivery Time</th></tr></thead>
                            <tbody>
                                {QUOTATIONS.map(q => {
                                    const vendor = VENDORS.find(v => v.id === q.vendorId);
                                    return (<tr key={q.id} className="border"><td className="p-2 border">{vendor?.name}</td><td className="p-2 border">₹{q.price.toLocaleString('en-IN')}</td><td className="p-2 border">{q.deliveryTime} days</td></tr>)
                                })}
                            </tbody>
                        </table>
                        <div className="mt-4 flex justify-end">
                            <button className="bg-green-600 text-white font-semibold py-2 px-4 rounded-md">Send for Approval</button>
                        </div>
                    </div>
                );
            default: return null;
        }
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Quotation Collection & Vendor Comparison</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                {renderStep()}
            </div>
        </div>
    );
};

export default QuotationView;