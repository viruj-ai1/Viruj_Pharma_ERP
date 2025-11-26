import React from 'react';

const TrainingItem: React.FC<{ title: string, items: string[] }> = ({ title, items }) => (
    <div className="bg-gray-50 p-4 rounded-lg border">
        <h3 className="font-semibold text-gray-700 mb-2">{title}</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
            {items.map(item => <li key={item}>{item}</li>)}
        </ul>
    </div>
)

const TrainingMatrixQCView: React.FC = () => {
  return (
    <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Training & Competency Matrix</h1>
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">My Qualifications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <TrainingItem title="Methods Trained" items={['HPLC Assay', 'GC Purity', 'Karl Fischer Titration', 'UV-Vis Spectrophotometry']} />
                    <TrainingItem title="Instruments Qualified" items={['HPLC-01', 'HPLC-02', 'GC-03', 'TITRATOR-02']} />
                    <TrainingItem title="Tests Allowed to Execute" items={['All routine RM/FG tests', 'Stability samples (T0, T3)']} />
                </div>
            </div>
             <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-yellow-800">Pending Training Requirements</h2>
                <div className="p-4 bg-yellow-50 rounded-md border border-yellow-200">
                    <p className="font-semibold">Advanced HPLC Troubleshooting</p>
                    <p className="text-sm text-gray-600">Due: 2023-12-15. Please complete the online module and quiz.</p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default TrainingMatrixQCView;
