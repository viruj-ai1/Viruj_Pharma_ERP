import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const reports = [
    { id: 'dev-trends', title: 'Deviation Trends', description: 'Analyze deviations by type, source, and severity over time.' },
    { id: 'capa-effect', title: 'CAPA Effectiveness', description: 'Track timeliness and success rate of corrective actions.' },
    { id: 'em-trends', title: 'EM Microbial Trends', description: 'Monitor environmental monitoring results and OOS rates.' },
    { id: 'stability-fail', title: 'Stability Failure Rate', description: 'Report on stability study outcomes and trends.' },
    { id: 'workload', title: 'QA Officer Workload', description: 'Visualize task distribution and completion rates.' },
    { id: 'digitization', title: 'Document Digitization Progress', description: 'Track the progress of digitizing legacy documents.' },
    { id: 'review-time', title: 'Batch Review Turnaround Time', description: 'Analyze the time taken for batch record reviews.' },
];

const mockDeviationData = [
  { name: 'Jan', Process: 4, Equipment: 2, SOP: 1 },
  { name: 'Feb', Process: 3, Equipment: 3, SOP: 2 },
  { name: 'Mar', Process: 5, Equipment: 1, SOP: 1 },
  { name: 'Apr', Process: 2, Equipment: 4, SOP: 3 },
];

const QAReportsView: React.FC = () => {
    const [selectedReport, setSelectedReport] = useState<string | null>(null);

    const renderReportContent = () => {
        if (!selectedReport) {
            return (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reports.map(report => (
                        <div key={report.id} onClick={() => setSelectedReport(report.id)} className="p-6 bg-gray-50 rounded-lg border hover:border-primary-300 hover:bg-primary-50 cursor-pointer transition-colors">
                            <h3 className="font-bold text-primary-800">{report.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                        </div>
                    ))}
                </div>
            )
        }
        
        const report = reports.find(r => r.id === selectedReport);
        
        return (
            <div>
                <button onClick={() => setSelectedReport(null)} className="mb-4 text-primary-600 font-semibold">&larr; Back to Report Library</button>
                <h2 className="text-2xl font-bold mb-4">{report?.title}</h2>

                <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                    <p>Filters and export options would be here.</p>
                </div>

                {selectedReport === 'dev-trends' && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                         <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={mockDeviationData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Process" stackId="a" fill="#8884d8" />
                                <Bar dataKey="Equipment" stackId="a" fill="#82ca9d" />
                                <Bar dataKey="SOP" stackId="a" fill="#ffc658" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
                {selectedReport !== 'dev-trends' && <div className="text-center p-8 bg-white rounded-lg shadow-md"><p>Chart placeholder for {report?.title}</p></div>}
            </div>
        )

    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">QA Reports & Analytics</h1>
            {renderReportContent()}
        </div>
    );
};

export default QAReportsView;
