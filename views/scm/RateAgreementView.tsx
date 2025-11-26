import React from 'react';
import { RATE_AGREEMENTS, VENDORS } from '../../services/mockData';

const RateAgreementView: React.FC = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Contract / Rate Agreement Viewer</h1>
             <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50"><tr>
                        <th className="p-3 text-left">Vendor</th>
                        <th className="p-3 text-left">Material</th>
                        <th className="p-3 text-left">Rate</th>
                        <th className="p-3 text-left">Validity</th>
                    </tr></thead>
                    <tbody>
                        {RATE_AGREEMENTS.map(ra => (
                            <tr key={ra.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-semibold">{VENDORS.find(v => v.id === ra.vendorId)?.name}</td>
                                <td className="p-3">{ra.materialId}</td>
                                <td className="p-3">₹{ra.rate}</td>
                                <td className="p-3">{ra.validTo}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RateAgreementView;
