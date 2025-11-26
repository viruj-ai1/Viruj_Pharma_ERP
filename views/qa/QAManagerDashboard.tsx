
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { DEVIATIONS, CAPAS, CHANGE_CONTROLS, DOCUMENTS } from '../../services/mockData';
import { DocumentType } from '../../types';
import { DashboardCard } from '../dashboards/shared/CommonComponents';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface QAManagerDashboardProps {
    onNavigate: (view: string, id?: string) => void;
}

const QAManagerDashboard: React.FC<QAManagerDashboardProps> = ({ onNavigate }) => {
    const { user } = useAuth();
    if (!user) return null;

    const myDeviations = DEVIATIONS.filter(d => d.assignedTo === user.id).length;
    const myCapas = CAPAS.filter(c => c.owner === user.id && c.status !== 'Closed').length;
    const myChangeControls = CHANGE_CONTROLS.filter(c => c.status === 'Impact Assessment').length;
    const docsToDigitize = DOCUMENTS.filter(d => d.type === DocumentType.BMR).length; // Mock

    const batchReviewData = [
        { name: 'Verified', value: 12 },
        { name: 'Pending', value: 3 },
        { name: 'Queries Raised', value: 2 },
    ];
    const COLORS = ['#10b981', '#a8a29e', '#f59e0b'];
    
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <DashboardCard title="Batches Assigned" value="5" description="For BMR review" color="blue" icon={<></>} />
                <DashboardCard title="Deviations Assigned" value={myDeviations} description="For investigation" color="red" icon={<></>} />
                <DashboardCard title="CAPAs in Progress" value={myCapas} description="Owned by you" color="yellow" icon={<></>} />
                <DashboardCard title="CC Pending Assessment" value={myChangeControls} description="For impact analysis" color="purple" icon={<></>} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-semibold mb-4 text-gray-700">Deviations Under Investigation</h3>
                    <div className="space-y-3">
                    {DEVIATIONS.filter(d => d.status === 'Investigation').slice(0, 4).map(d => (
                        <div key={d.id} className="p-3 rounded-md bg-gray-50 flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-gray-800">{d.title}</p>
                                <p className="text-xs text-gray-500">{d.id} | {d.plant}</p>
                            </div>
                            <button onClick={() => onNavigate('deviations', d.id)} className="text-primary-600 font-semibold text-sm">Review</button>
                        </div>
                    ))}
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
                    <h3 className="font-semibold mb-4 text-gray-700">Batch Review Progress</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie data={batchReviewData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                {batchReviewData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
             <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold mb-4 text-gray-700">Document Digitization Queue</h3>
                <p>Documents awaiting validation: <strong>{docsToDigitize}</strong></p>
                <button onClick={() => onNavigate('docDigitization')} className="mt-2 text-primary-600 font-semibold text-sm">Go to Validation Stage &rarr;</button>
            </div>
        </div>
    );
};

export default QAManagerDashboard;
