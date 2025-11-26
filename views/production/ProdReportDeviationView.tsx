import React from 'react';

const ProdReportDeviationView: React.FC = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Deviation / Incident Reporting</h1>
            <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
                <h2 className="text-xl font-semibold mb-4">Report New Deviation</h2>
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Deviation Type</label>
                        <select className="mt-1 w-full p-2 border rounded-md bg-white">
                            <option>Process Deviation</option>
                            <option>Equipment Malfunction</option>
                            <option>Safety Incident</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Description</label>
                        <textarea rows={5} className="mt-1 w-full p-2 border rounded-md"></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Attach Photos/Evidence</label>
                        <input type="file" className="mt-1 w-full p-2 border rounded-md text-sm" />
                    </div>
                    <div className="text-right">
                        <button type="submit" className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg">Submit to Manager</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProdReportDeviationView;