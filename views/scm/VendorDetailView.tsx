import React, { useMemo } from 'react';
import { VENDORS, PURCHASE_ORDERS } from '../../services/mockData';
import { Vendor, PurchaseOrder, PoStatus } from '../../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from 'recharts';

interface VendorDetailViewProps {
  vendorId: string;
  onBack: () => void;
}

const DetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-semibold text-gray-800">{value}</p>
    </div>
);

const PoStatusBadge: React.FC<{ status: PoStatus }> = ({ status }) => {
    const colors: { [key in PoStatus]?: string } = {
        [PoStatus.Draft]: 'bg-gray-200 text-gray-800',
        [PoStatus.Pending_Finance_Approval]: 'bg-yellow-200 text-yellow-800',
        [PoStatus.Pending_Management_Approval]: 'bg-orange-200 text-orange-800',
        [PoStatus.Approved]: 'bg-blue-200 text-blue-800',
        [PoStatus.Sent]: 'bg-indigo-200 text-indigo-800',
        [PoStatus.Completed]: 'bg-green-200 text-green-800',
        [PoStatus.Received]: 'bg-teal-200 text-teal-800',
        [PoStatus.Partially_Received]: 'bg-yellow-200 text-yellow-800',
        [PoStatus.Rejected]: 'bg-red-200 text-red-800'
    };
    const colorClass = colors[status] || 'bg-gray-100 text-gray-800';
    return <span className={`px-2 py-1 text-xs font-semibold leading-tight rounded-full ${colorClass}`}>{status.replace(/_/g, ' ')}</span>;
};


const VendorDetailView: React.FC<VendorDetailViewProps> = ({ vendorId, onBack }) => {
  const vendor = VENDORS.find(v => v.id === vendorId);
  const vendorPOs = PURCHASE_ORDERS.filter(po => po.vendorId === vendorId);

  const deliveryStats = useMemo(() => {
      if (!vendor) return { data: [] };
      const relevantPOs = vendorPOs.filter(po => po.dateReceived && po.expectedDeliveryDate);
      const onTime = relevantPOs.filter(po => new Date(po.dateReceived!) <= new Date(po.expectedDeliveryDate)).length;
      const late = relevantPOs.length - onTime;
      return {
          data: [
              { name: 'On-Time', value: onTime },
              { name: 'Late', value: late },
          ]
      }
  }, [vendor, vendorPOs]);

  if (!vendor) {
    return (
      <div>
        <button onClick={onBack} className="mb-4 text-primary-600 hover:underline">&larr; Back</button>
        <p>Vendor not found.</p>
      </div>
    );
  }

  const DELIVERY_COLORS = ['#22c55e', '#f59e0b'];

  return (
    <div>
      <div className="mb-6">
        <button onClick={onBack} className="mb-2 text-primary-600 hover:underline flex items-center text-sm">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Vendors
        </button>
        <h1 className="text-3xl font-bold text-gray-800">{vendor.name}</h1>
        <p className="text-gray-500">Vendor Performance Dashboard</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <DetailRow label="Contact Person" value={vendor.contactPerson} />
              <DetailRow label="Email" value={<a href={`mailto:${vendor.email}`} className="text-primary-600 hover:underline">{vendor.email}</a>} />
              <DetailRow label="Phone" value={vendor.phone} />
              <DetailRow label="Address" value={vendor.address} />
          </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
               <h3 className="text-lg font-semibold text-gray-700 mb-4">On-Time Delivery Performance</h3>
              <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={deliveryStats.data} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" allowDecimals={false} />
                      <YAxis type="category" dataKey="name" width={60} />
                      <Bar dataKey="value" barSize={40}>
                         {deliveryStats.data.map((entry, index) => <Cell key={`cell-${index}`} fill={DELIVERY_COLORS[index % DELIVERY_COLORS.length]} />)}
                      </Bar>
                  </BarChart>
              </ResponsiveContainer>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Overall Performance Score</h3>
             <div className="text-center">
                 <p className="text-6xl font-bold text-primary-600">88<span className="text-2xl">%</span></p>
                 <p className="text-gray-500">Based on delivery, quality & cost</p>
             </div>
          </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <h3 className="text-lg font-semibold text-gray-700 p-4 border-b">Purchase Order History</h3>
        <div className="overflow-x-auto">
            <table className="min-w-full leading-normal">
                <thead>
                    <tr>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">PO Number</th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Material</th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date Created</th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {vendorPOs.map((po: PurchaseOrder) => (
                        <tr key={po.id} className="hover:bg-gray-50">
                            <td className="px-5 py-4 border-b border-gray-200 text-sm"><p className="font-semibold">{po.poNumber}</p></td>
                            <td className="px-5 py-4 border-b border-gray-200 text-sm"><p>{po.materialName}</p></td>
                            <td className="px-5 py-4 border-b border-gray-200 text-sm"><p>{po.dateCreated}</p></td>
                            <td className="px-5 py-4 border-b border-gray-200 text-sm"><PoStatusBadge status={po.status} /></td>
                        </tr>
                    ))}
                     {vendorPOs.length === 0 && (
                        <tr><td colSpan={4} className="text-center py-10 text-gray-500">No purchase orders found for this vendor.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>

    </div>
  );
};

export default VendorDetailView;