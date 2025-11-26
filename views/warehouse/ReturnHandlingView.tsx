import React from 'react';

const ReturnHandlingView: React.FC = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Return Handling</h1>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Vendor Returns</h2>
                    <p>Handle returns for QC rejections, damages, etc.</p>
                </div>
                 <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Customer Returns (FG)</h2>
                    <p>Handle returns of finished goods from customers.</p>
                </div>
            </div>
        </div>
    );
};

export default ReturnHandlingView;
