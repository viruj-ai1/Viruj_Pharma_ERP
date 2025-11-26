import React from 'react';
import { QC_STANDARDS } from '../../services/mockData';

const QCStandardsManagerView: React.FC = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Standards & Reagents Control</h1>
            <div className="mt-6 bg-white shadow-md rounded-lg overflow-hidden">
                <h2 className="text-xl font-semibold p-4 border-b">Current Stock</h2>
                 <table className="min-w-full">
                    <thead className="bg-gray-50"><tr>
                        <th className="p-3 text-left">ID</th>
                        <th className="p-3 text-left">Name</th>
                        <th className="p-3 text-left">Type</th>
                        <th className="p-3 text-left">Quantity</th>
                        <th className="p-3 text-left">Validity</th>
                    </tr></thead>
                    <tbody>
                        {QC_STANDARDS.map(std => (
                            <tr key={std.id} className="border-b">
                                <td className="p-3 font-semibold">{std.id}</td>
                                <td className="p-3">{std.name}</td>
                                <td className="p-3">{std.type}</td>
                                <td className="p-3">{std.quantity} {std.unit}</td>
                                <td className="p-3">{std.validity}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-2">Issue Requests</h3>
                    <p className="text-sm text-gray-500">No pending requests.</p>
                 </div>
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-2">Update Potency</h3>
                    <button className="text-primary-600 text-sm font-semibold">Prepare Working Standard &rarr;</button>
                 </div>
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-2">Disposal Approval</h3>
                    <p className="text-sm text-gray-500">No pending disposal requests.</p>
                 </div>
            </div>
        </div>
    );
};

export default QCStandardsManagerView;