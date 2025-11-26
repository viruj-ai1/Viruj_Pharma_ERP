import React from 'react';

const InvoiceSupportView: React.FC = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Invoice Support & Document Uploads</h1>
            <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
                <h2 className="text-xl font-semibold mb-4">Prepare Files for Finance</h2>
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Invoice No.</label>
                        <input type="text" className="mt-1 w-full p-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Upload Vendor Invoice</label>
                        <input type="file" className="mt-1 w-full text-sm" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Upload Delivery Challan</label>
                        <input type="file" className="mt-1 w-full text-sm" />
                    </div>
                    <div className="text-right">
                        <button type="submit" className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg">Forward to Accounts</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InvoiceSupportView;
