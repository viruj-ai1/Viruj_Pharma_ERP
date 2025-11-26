import React, { useState } from 'react';
import { CAPEX_REQUESTS, USERS } from '../../services/mockData';
import { CapexRequest } from '../../types';

const FinanceView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'snapshot' | 'capex' | 'suppliers' | 'inventory'>('snapshot');

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Finance & Consolidated Reports</h1>
      <p className="text-gray-500 mt-1">Consolidated financial visibility and high-value approvals.</p>

      <div className="border-b border-gray-200 mt-6">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button onClick={() => setActiveTab('snapshot')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'snapshot' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Financial Snapshot</button>
          <button onClick={() => setActiveTab('capex')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'capex' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>CAPEX Requests</button>
        </nav>
      </div>
      
      <div className="mt-8">
        {activeTab === 'snapshot' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md"><h4 className="text-gray-500">Consolidated P&L</h4><p className="text-3xl font-bold text-green-600">+₹1.2M</p></div>
            <div className="bg-white p-6 rounded-lg shadow-md"><h4 className="text-gray-500">Cash Position</h4><p className="text-3xl font-bold">₹25.4M</p></div>
            <div className="bg-white p-6 rounded-lg shadow-md"><h4 className="text-gray-500">AR Aging ({'>'}30d)</h4><p className="text-3xl font-bold">₹1.8M</p></div>
            <div className="bg-white p-6 rounded-lg shadow-md"><h4 className="text-gray-500">AP Aging ({'>'}30d)</h4><p className="text-3xl font-bold">₹0.9M</p></div>
          </div>
        )}
        {activeTab === 'capex' && (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <h2 className="text-xl p-4 font-semibold">CAPEX Approval Queue</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stage</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ROI</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {CAPEX_REQUESTS.map((req: CapexRequest) => (
                    <tr key={req.id}>
                      <td className="px-6 py-4 whitespace-nowrap"><p className="font-semibold">{req.id.toUpperCase()}</p><p className="text-xs text-gray-500">{req.title}</p></td>
                      <td className="px-6 py-4 whitespace-nowrap">{req.plant}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold">₹{req.amount.toLocaleString('en-IN')}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{req.stage}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{req.roi}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button className="text-primary-600 hover:text-primary-900">Approve</button>
                        <button className="text-yellow-600 hover:text-yellow-900">Changes</button>
                        <button className="text-red-600 hover:text-red-900">Reject</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinanceView;