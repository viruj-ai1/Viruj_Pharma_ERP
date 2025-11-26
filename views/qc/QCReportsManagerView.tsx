import React from 'react';

const reports = [
    { id: 1, title: 'Daily QC Summary' },
    { id: 2, title: 'Sample Turnaround Time (TAT)' },
    { id: 3, title: 'Failure Trends (Month-wise)' },
    { id: 4, title: 'Analyst Performance Report' },
    { id: 5, title: 'Instrument Downtime' },
    { id: 6, title: 'Standard Consumption' },
];

const QCReportsManagerView: React.FC = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Reports & Analytics</h1>
            <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
                 <h2 className="text-xl font-semibold mb-4">Report Library</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {reports.map(report => (
                         <div key={report.id} className="p-4 bg-gray-50 rounded-lg border hover:border-primary-300 cursor-pointer">
                            <h3 className="font-semibold text-primary-800">{report.title}</h3>
                            <div className="mt-2 space-x-2">
                                <button className="text-xs text-blue-600">PDF</button>
                                <button className="text-xs text-green-600">Excel</button>
                                <button className="text-xs text-gray-600">CSV</button>
                            </div>
                        </div>
                    ))}
                 </div>
            </div>
        </div>
    );
};

export default QCReportsManagerView;