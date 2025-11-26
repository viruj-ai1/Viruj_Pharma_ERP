import React from 'react';

const MaterialYieldView: React.FC = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Material Consumption & Yield Tracking</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Yield Reconciliation</h2>
                    <p>Coming soon: Detailed yield reconciliation tables.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Material Variance Approvals</h2>
                    <p>No variances pending approval.</p>
                </div>
            </div>
        </div>
    );
};

export default MaterialYieldView;