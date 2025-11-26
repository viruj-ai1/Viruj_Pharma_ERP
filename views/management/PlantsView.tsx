import React, { useState } from 'react';
import { PLANTS, USERS } from '../../services/mockData';
import { Plant } from '../../types';

const PlantsView: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [compareMode, setCompareMode] = useState(false);
  const [selectedPlants, setSelectedPlants] = useState<string[]>([]);

  const handleSelectPlant = (plantId: string) => {
    if (compareMode) {
      setSelectedPlants(prev => 
        prev.includes(plantId) 
          ? prev.filter(id => id !== plantId)
          : [...prev, plantId].slice(0, 3) // Limit to 3
      );
    }
  };
  
  const getManagerName = (id: string) => USERS.find(u => u.id === id)?.name || 'N/A';
  
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Plants Management</h1>
          <p className="text-gray-500 mt-1">Compare plant performance and open plant-level dashboards.</p>
        </div>
        <div className="flex items-center space-x-2">
            <button onClick={() => setCompareMode(!compareMode)} className={`px-4 py-2 text-sm font-semibold rounded-lg border ${compareMode ? 'bg-primary-100 text-primary-700 border-primary-300' : 'bg-white'}`}>
                {compareMode ? 'Exit Compare Mode' : 'Compare Plants'}
            </button>
            <div className="flex items-center bg-gray-200 p-1 rounded-lg">
                <button onClick={() => setViewMode('list')} className={`px-3 py-1 text-sm rounded-md ${viewMode === 'list' ? 'bg-white shadow' : ''}`}>List</button>
                <button onClick={() => setViewMode('map')} className={`px-3 py-1 text-sm rounded-md ${viewMode === 'map' ? 'bg-white shadow' : ''}`}>Map</button>
            </div>
        </div>
      </div>
      
      {viewMode === 'list' && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  {compareMode && <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>}
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Plant</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">OEE (%)</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Yield (%)</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Open QA Holds</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Inventory Value</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Manager</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
                </tr>
              </thead>
              <tbody>
                {PLANTS.map((plant: Plant) => (
                  <tr key={plant.id} className={`hover:bg-gray-50 ${compareMode ? 'cursor-pointer' : ''} ${selectedPlants.includes(plant.id) ? 'bg-blue-50' : ''}`} onClick={() => handleSelectPlant(plant.id)}>
                    {compareMode && (
                      <td className="px-5 py-4 border-b border-gray-200 text-sm">
                        <input type="checkbox" className="h-4 w-4 text-primary-600 border-gray-300 rounded" readOnly checked={selectedPlants.includes(plant.id)} />
                      </td>
                    )}
                    <td className="px-5 py-4 border-b border-gray-200 text-sm">
                      <p className="font-semibold">{plant.name}</p>
                      <p className="text-xs text-gray-500">{plant.region}</p>
                    </td>
                    <td className="px-5 py-4 border-b border-gray-200 text-sm">{plant.oee.toFixed(1)}%</td>
                    <td className="px-5 py-4 border-b border-gray-200 text-sm">{plant.yield.toFixed(1)}%</td>
                    <td className="px-5 py-4 border-b border-gray-200 text-sm">{plant.openQaHolds}</td>
                    <td className="px-5 py-4 border-b border-gray-200 text-sm">₹{plant.inventoryValue.toLocaleString('en-IN')}</td>
                    <td className="px-5 py-4 border-b border-gray-200 text-sm">{getManagerName(plant.managerId)}</td>
                    <td className="px-5 py-4 border-b border-gray-200 text-sm text-right">
                      <button className="text-primary-600 hover:text-primary-900 font-semibold">Open Dashboard</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {viewMode === 'map' && (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <h2 className="text-xl font-semibold mb-4">Map View</h2>
              <p>This area would display an interactive world map with pins for each plant location.</p>
              <div className="mt-4 h-64 bg-gray-200 rounded-md flex items-center justify-center">
                  <p className="text-gray-500">Map Component Placeholder</p>
              </div>
          </div>
      )}

      {compareMode && selectedPlants.length > 0 && (
          <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Comparing {selectedPlants.length} Plants</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {PLANTS.filter(p => selectedPlants.includes(p.id)).map(plant => (
                      <div key={plant.id} className="bg-white p-6 rounded-lg shadow-md">
                          <h3 className="font-bold text-lg mb-4">{plant.name}</h3>
                          <div className="space-y-2 text-sm">
                              <p><strong>OEE:</strong> {plant.oee.toFixed(1)}%</p>
                              <p><strong>Yield:</strong> {plant.yield.toFixed(1)}%</p>
                              <p><strong>QA Holds:</strong> {plant.openQaHolds}</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}

    </div>
  );
};

export default PlantsView;