import React from 'react';
import { VENDORS } from '../../services/mockData';

const VendorManagementOfficerView: React.FC = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Vendor Management</h1>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50"><tr>
                        <th className="p-3 text-left">Vendor Name</th>
                        <th className="p-3 text-left">Category</th>
                        <th className="p-3 text-left">Status</th>
                        <th className="p-3 text-left">Performance</th>
                        <th className="p-3"></th>
                    </tr></thead>
                    <tbody>
                        {VENDORS.map(vendor => (
                            <tr key={vendor.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-semibold">{vendor.name}</td>
                                <td className="p-3 text-sm">{vendor.suppliedMaterialIds.length} materials</td>
                                <td className="p-3 text-sm">Approved</td>
                                <td className="p-3 text-sm">{vendor.rating}/5</td>
                                <td className="p-3 text-right space-x-2">
                                    <button className="text-primary-600 font-semibold text-sm">Send Message</button>
                                    <button className="text-gray-600 font-semibold text-sm">Upload File</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default VendorManagementOfficerView;
