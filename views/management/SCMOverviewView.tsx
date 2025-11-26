import React from 'react';

const SCMOverviewView: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Consolidated SCM Overview</h1>
      <p className="text-gray-500 mt-1">
        High-level visibility into inventory, supplier performance, and risks across all plants.
      </p>
      
      <div className="mt-6 space-y-8">
        {/* Inventory Health */}
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Inventory Health</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-md"><p className="text-sm text-gray-500">Days of Supply</p><p className="text-2xl font-bold">45</p></div>
                <div className="bg-gray-50 p-4 rounded-md"><p className="text-sm text-gray-500">Top SKU Value</p><p className="text-2xl font-bold">₹2.1M</p></div>
                <div className="bg-gray-50 p-4 rounded-md"><p className="text-sm text-gray-500">Approaching Expiry</p><p className="text-2xl font-bold">₹150k</p></div>
                <div className="bg-gray-50 p-4 rounded-md"><p className="text-sm text-gray-500">FEFO Compliance</p><p className="text-2xl font-bold">99.8%</p></div>
            </div>
        </div>

         {/* Supplier Dashboard */}
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Supplier Performance</h2>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-md"><p className="text-sm text-gray-500">Top Suppliers</p><p className="text-2xl font-bold">5</p></div>
                <div className="bg-gray-50 p-4 rounded-md"><p className="text-sm text-gray-500">On-Time Delivery</p><p className="text-2xl font-bold">96.4%</p></div>
                <div className="bg-gray-50 p-4 rounded-md"><p className="text-sm text-gray-500">Rejection Rate</p><p className="text-2xl font-bold text-red-600">1.2%</p></div>
                <div className="bg-gray-50 p-4 rounded-md"><p className="text-sm text-gray-500">Open PO Value</p><p className="text-2xl font-bold">₹8.9M</p></div>
            </div>
        </div>

        {/* Risk Alerts */}
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Logistics & Risk Alerts</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <p className="font-semibold text-yellow-800">Delayed Shipments ({'>'}5 days)</p>
                    <p className="text-2xl font-bold text-yellow-900">3</p>
                </div>
                 <div className="bg-red-50 border-l-4 border-red-400 p-4">
                    <p className="font-semibold text-red-800">Single-Sourced Critical RMs</p>
                    <p className="text-2xl font-bold text-red-900">8</p>
                </div>
             </div>
        </div>

      </div>
    </div>
  );
};

export default SCMOverviewView;