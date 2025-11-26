import React from 'react';

const reports = [
    { id: 1, title: 'Monthly Executive KPI Pack', description: 'Consolidated performance metrics for board review.', lastRun: '2023-10-28' },
    { id: 2, title: 'Quarterly GxP Compliance Summary', description: 'Overview of deviations, CAPAs, and audit findings.', lastRun: '2023-10-15' },
    { id: 3, title: 'Plant Performance Comparison', description: 'Side-by-side comparison of OEE, Yield, and Quality.', lastRun: '2023-10-25' },
    { id: 4, title: 'Annual Financial Statement', description: 'Consolidated P&L, balance sheet, and cash flow.', lastRun: '2023-09-30' },
];

const ReportsView: React.FC = () => {
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Reports & Analytics</h1>
            <p className="text-gray-500 mt-1">
              Access curated reports and build your own analysis.
            </p>
          </div>
          <button className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-700 transition duration-300">
            Open Report Builder
          </button>
      </div>
      
       <div className="mt-6 bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Report Library</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reports.map(report => (
                <div key={report.id} className="p-6 bg-gray-50 rounded-lg border hover:border-primary-300 hover:bg-primary-50 cursor-pointer transition-colors">
                    <h3 className="font-bold text-primary-800">{report.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                    <p className="text-xs text-gray-400 mt-3">Last run: {report.lastRun}</p>
                </div>
            ))}
        </div>
      </div>

    </div>
  );
};

export default ReportsView;