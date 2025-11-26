import React from 'react';

const ProdSamplingQCView: React.FC = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Sampling & QC Requests</h1>
            <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
                <h2 className="text-xl font-semibold mb-4">Send Sample to QC</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Container ID</label>
                        <input type="text" className="mt-1 w-full p-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Test Type</label>
                        <select className="mt-1 w-full p-2 border rounded-md bg-white">
                            <option>In-Process Check</option>
                            <option>Final Release</option>
                            <option>Stability</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button className="px-4 py-2 bg-gray-200 rounded-md">Generate Sample Label</button>
                        <button className="px-4 py-2 bg-primary-600 text-white rounded-md">Send Request to QC</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProdSamplingQCView;