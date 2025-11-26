

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { PURCHASE_ORDERS, MATERIAL_INDENTS, USERS, VENDORS } from '../../services/mockData';
import { PoStatus, IndentStatus, Role } from '../../types';

interface PurchaseOrderDetailViewProps {
  poId: string;
  onBack: () => void;
  onViewVendor: (vendorId: string) => void;
}

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
    return (
        <span className={`px-3 py-1 text-xs font-semibold leading-tight rounded-full ${colors[status] || 'bg-gray-200'}`}>
            {status.replace(/_/g, ' ')}
        </span>
    );
};

const DetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div>
        <p className="text-sm text-gray-500">{label}</p>
        <div className="font-semibold text-gray-800">{value}</div>
    </div>
);


const PurchaseOrderDetailView: React.FC<PurchaseOrderDetailViewProps> = ({ poId, onBack, onViewVendor }) => {
  const { user } = useAuth();
  const [po, setPo] = useState(() => PURCHASE_ORDERS.find(p => p.id === poId));
  
  const vendor = VENDORS.find(v => v.id === po?.vendorId);
  const indent = MATERIAL_INDENTS.find(i => i.id === po?.indentId);
  const indentRaisedBy = USERS.find(u => u.id === indent?.raisedBy)?.name;
  const createdBy = USERS.find(u => u.id === po?.createdBy)?.name;

  const handleStatusUpdate = (newStatus: PoStatus) => {
    if (!po || !user) return;

    const poIndex = PURCHASE_ORDERS.findIndex(p => p.id === po.id);
    if (poIndex > -1) {
        let updatedPo = { ...po, status: newStatus };
        
        if (newStatus === PoStatus.Received || newStatus === PoStatus.Partially_Received) {
            updatedPo.dateReceived = new Date().toISOString().split('T')[0];
            updatedPo.receivedBy = user.id;
        } else if (newStatus === PoStatus.Pending_Management_Approval) {
            updatedPo.financeApprovedBy = user.id;
            updatedPo.financeApprovedOn = new Date().toISOString().split('T')[0];
        } else if (newStatus === PoStatus.Approved) {
            updatedPo.managementApprovedBy = user.id;
            updatedPo.managementApprovedOn = new Date().toISOString().split('T')[0];
        } else if (newStatus === PoStatus.Rejected) {
             if(po.status === PoStatus.Pending_Finance_Approval) {
                updatedPo.financeApprovedBy = user.id;
                updatedPo.financeApprovedOn = new Date().toISOString().split('T')[0];
             } else if(po.status === PoStatus.Pending_Management_Approval) {
                updatedPo.managementApprovedBy = user.id;
                updatedPo.managementApprovedOn = new Date().toISOString().split('T')[0];
             } else if (po.status === PoStatus.Sent) {
                updatedPo.dateReceived = new Date().toISOString().split('T')[0];
                updatedPo.receivedBy = user.id;
             }
        }


        PURCHASE_ORDERS[poIndex] = updatedPo;
        setPo(updatedPo);
    }
  };

  if (!po) {
    return (
      <div>
        <button onClick={onBack} className="mb-4 text-primary-600 hover:underline">
          &larr; Back to All POs
        </button>
        <p>Purchase Order not found.</p>
      </div>
    );
  }

  const canFinanceApprove = user?.role === Role.Finance_Officer && po.status === PoStatus.Pending_Finance_Approval;
  const canManagementApprove = user?.role === Role.Management && po.status === PoStatus.Pending_Management_Approval;

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <button onClick={onBack} className="mb-2 text-primary-600 hover:underline flex items-center text-sm">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to All POs
          </button>
          <h1 className="text-3xl font-bold text-gray-800">
            Purchase Order: <span className="text-primary-600">{po.poNumber}</span>
          </h1>
        </div>
        <div className="flex space-x-3">
             {user?.role === Role.Procurement_Officer && po.status === PoStatus.Approved && <button className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300">Send to Supplier</button>}
            
            {canFinanceApprove && (
                <>
                    <button onClick={() => handleStatusUpdate(PoStatus.Rejected)} className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600">Reject</button>
                    <button onClick={() => handleStatusUpdate(PoStatus.Pending_Management_Approval)} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700">Approve</button>
                </>
            )}
             {canManagementApprove && (
                <>
                    <button onClick={() => handleStatusUpdate(PoStatus.Rejected)} className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600">Reject</button>
                    <button onClick={() => handleStatusUpdate(PoStatus.Approved)} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700">Approve</button>
                </>
            )}

            {user?.role === Role.Warehouse_Manager && po.status === PoStatus.Sent && (
                <>
                    <button onClick={() => handleStatusUpdate(PoStatus.Received)} className="bg-teal-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-700">Mark as Received</button>
                    <button onClick={() => handleStatusUpdate(PoStatus.Partially_Received)} className="bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600">Partially Received</button>
                    <button onClick={() => handleStatusUpdate(PoStatus.Rejected)} className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600">Reject</button>
                </>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <DetailRow label="PO Status" value={<PoStatusBadge status={po.status} />} />
                    <DetailRow label="Date Created" value={po.dateCreated} />
                    <DetailRow label="Created By" value={createdBy || 'N/A'} />
                    <DetailRow label="Expected Delivery" value={po.expectedDeliveryDate} />
                    {po.dateReceived && <DetailRow label="Date Received" value={po.dateReceived} />}
                    {po.receivedBy && <DetailRow label="Received By" value={USERS.find(u => u.id === po.receivedBy)?.name || 'N/A'} />}
                </div>
            </div>
             <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Item Details</h3>
                 <div className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
                    <div>
                         <p className="font-semibold text-gray-800">{po.materialName}</p>
                         <p className="text-sm text-gray-500">{po.quantity} {po.unit}</p>
                    </div>
                     <div className="text-right">
                        <p className="font-semibold text-gray-800 text-lg">₹{po.totalAmount.toLocaleString('en-IN')}</p>
                    </div>
                </div>
            </div>
             {po.justificationNotes && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Justification Notes</h3>
                    <p className="text-gray-600 whitespace-pre-wrap">{po.justificationNotes}</p>
                </div>
            )}
        </div>

        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Supplier Information</h3>
                {vendor ? (
                    <div className="space-y-3">
                       <DetailRow label="Supplier Name" value={<button onClick={() => onViewVendor(vendor.id)} className="text-primary-600 hover:underline font-semibold">{vendor.name}</button>} />
                       <DetailRow label="Contact" value={vendor.contactPerson} />
                       <DetailRow label="Email" value={<a href={`mailto:${vendor.email}`} className="text-primary-600 hover:underline">{vendor.email}</a>} />
                    </div>
                ) : <p>No supplier information.</p>}
            </div>
             <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Approval Trail</h3>
                <div className="space-y-3">
                   <DetailRow label="Finance Approval" value={po.financeApprovedBy ? `${USERS.find(u=>u.id === po.financeApprovedBy)?.name} on ${po.financeApprovedOn}` : 'Pending'} />
                   <DetailRow label="Management Approval" value={po.managementApprovedBy ? `${USERS.find(u=>u.id === po.managementApprovedBy)?.name} on ${po.managementApprovedOn}` : 'Pending'} />
                </div>
            </div>
            {indent && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Linked Indent</h3>
                    <div className="space-y-3">
                       <DetailRow label="Indent ID" value={<span className="font-mono uppercase">{indent.id}</span>} />
                       <DetailRow label="Raised By" value={indentRaisedBy || 'N/A'} />
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderDetailView;