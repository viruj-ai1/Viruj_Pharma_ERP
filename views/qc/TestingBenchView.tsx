import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { QC_SAMPLES, USERS } from '../../services/mockData';
import { QualitySample, Test } from '../../types';

const TestExecutionWindow: React.FC<{ test: Test, sample: QualitySample, onBack: () => void, onSubmit: () => void }> = ({ test, sample, onBack, onSubmit }) => {
    const [checklist, setChecklist] = useState({ env: false, clean: false, cal: false });
    const isChecklistComplete = Object.values(checklist).every(Boolean);
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => setTimer(t => t + 1), 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    }

    const handleESign = () => {
        const pwd = prompt("Enter password for e-signature:");
        if (pwd === "demo123") {
            onSubmit();
        } else {
            alert("Incorrect password.");
        }
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <button onClick={onBack} className="mb-4 text-primary-600 hover:underline flex items-center text-sm">&larr; Back to Test List</button>
            <div className="border-b pb-4 mb-4 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Test: {test.name}</h2>
                    <p className="text-gray-500">{sample.productName} ({sample.batchNumber}) | Sample: {sample.id}</p>
                </div>
                <div className="text-right">
                    <p className="font-mono text-xl">{formatTime(timer)}</p>
                    <a href="#" className="text-sm text-primary-600 hover:underline">View SOP/STP</a>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Checklist and Data Entry */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg border">
                        <h3 className="font-semibold mb-2">Pre-Test Checklist</h3>
                        <div className="space-y-1 text-sm">
                            <label className="flex items-center"><input type="checkbox" checked={checklist.env} onChange={e => setChecklist(c => ({...c, env: e.target.checked}))} className="h-4 w-4 rounded mr-2" /> Environment conditions verified.</label>
                            <label className="flex items-center"><input type="checkbox" checked={checklist.clean} onChange={e => setChecklist(c => ({...c, clean: e.target.checked}))} className="h-4 w-4 rounded mr-2" /> Glassware cleaning confirmed.</label>
                            <label className="flex items-center"><input type="checkbox" checked={checklist.cal} onChange={e => setChecklist(c => ({...c, cal: e.target.checked}))} className="h-4 w-4 rounded mr-2" /> Instrument calibration checked.</label>
                        </div>
                    </div>
                    
                    {isChecklistComplete && (
                        <div className="space-y-4 animate-fade-in">
                            {/* Conditional Data Entry Panels */}
                            {test.method === 'HPLC' && (
                                <div className="p-4 border rounded-lg">
                                    <h3 className="font-semibold mb-2">Chromatography Data</h3>
                                    <button className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-100">
                                        <span className="text-gray-500">Click to upload raw .cdf / .ch files</span>
                                    </button>
                                </div>
                            )}
                            {test.method === 'Titration' && (
                                <div className="p-4 border rounded-lg space-y-2">
                                    <h3 className="font-semibold mb-2">Wet Chemistry Data</h3>
                                     <div>
                                        <label className="block text-sm font-medium text-gray-700">Weight (g)</label>
                                        <input type="number" className="mt-1 w-full p-2 border rounded-md"/>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Volume (ml)</label>
                                        <input type="number" className="mt-1 w-full p-2 border rounded-md"/>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                
                {/* Actions */}
                <div className="bg-gray-50 p-4 rounded-lg border flex flex-col justify-between">
                    <div>
                        <h3 className="font-semibold mb-2">Actions</h3>
                        <button className="w-full text-left p-2 text-sm rounded-md hover:bg-gray-200">Request Help from Manager</button>
                        <button className="w-full text-left p-2 text-sm rounded-md hover:bg-gray-200">Attach Additional Files</button>
                    </div>
                    <div className="space-y-2">
                        <button className="w-full bg-gray-200 text-gray-800 font-semibold py-2 rounded-lg hover:bg-gray-300">Save as Draft</button>
                        <button onClick={handleESign} disabled={!isChecklistComplete} className="w-full bg-primary-600 text-white font-bold py-2 rounded-lg hover:bg-primary-700 disabled:bg-gray-400">Submit Result</button>
                    </div>
                </div>
            </div>
            <style>{`.animate-fade-in { animation: fadeIn 0.5s; } @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }`}</style>
        </div>
    );
}


const TestingBenchView: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('my-tests');
    const [selectedTest, setSelectedTest] = useState<{sample: QualitySample, test: Test} | null>(null);

    if (!user) return null;

    const myTests = QC_SAMPLES
        .filter(s => s.analystId === user.id)
        .flatMap(s => s.tests.map(t => ({ sample: s, test: t })))
        .filter(item => item.test.status === 'Not Started' || item.test.status === 'In Progress');

    if (selectedTest) {
        return <TestExecutionWindow 
            test={selectedTest.test} 
            sample={selectedTest.sample} 
            onBack={() => setSelectedTest(null)}
            onSubmit={() => { alert('Submitted!'); setSelectedTest(null); }}
        />
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Testing Bench</h1>
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    <button onClick={() => setActiveTab('my-tests')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'my-tests' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:border-gray-300'}`}>My Tests ({myTests.length})</button>
                    <button onClick={() => setActiveTab('completed')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'completed' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:border-gray-300'}`}>Completed</button>
                    <button onClick={() => setActiveTab('correction')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'correction' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:border-gray-300'}`}>Returned for Correction</button>
                </nav>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50"><tr>
                            <th className="p-3 text-left text-xs font-semibold uppercase">Test Name</th>
                            <th className="p-3 text-left text-xs font-semibold uppercase">Sample ID</th>
                            <th className="p-3 text-left text-xs font-semibold uppercase">Method</th>
                            <th className="p-3 text-left text-xs font-semibold uppercase">Status</th>
                            <th className="p-3"></th>
                        </tr></thead>
                        <tbody>
                            {myTests.map(({sample, test}) => (
                                <tr key={`${sample.id}-${test.name}`} className="border-b hover:bg-gray-50">
                                    <td className="p-3 font-semibold">{test.name}</td>
                                    <td className="p-3">{sample.id}</td>
                                    <td className="p-3">{test.method}</td>
                                    <td className="p-3">{test.status}</td>
                                    <td className="p-3 text-right"><button onClick={() => setSelectedTest({sample, test})} className="text-primary-600 font-semibold">Open Test</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TestingBenchView;
