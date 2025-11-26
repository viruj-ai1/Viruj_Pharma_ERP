import React from 'react';
import {
    SALES_ORDERS,
    PRODUCTION_BATCHES,
    DEVIATIONS,
    ESCALATED_ISSUES,
    PROJECTS,
    CAPEX_REQUESTS,
    PLANTS,
} from '../../services/mockData';
import {
    BatchStatus,
    IssuePriority,
} from '../../types';
import { KpiCard } from './shared/CommonComponents';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';


interface ManagementDashboardProps {
    onNavigate: (view: string) => void;
}

const ManagementDashboard: React.FC<ManagementDashboardProps> = ({ onNavigate }) => {
    
    const kpiSparkData = {
        production: [{value: 300}, {value: 400}, {value: 200}, {value: 500}, {value: 450}, {value: 600}],
        delivery: [{value: 98}, {value: 97}, {value: 99}, {value: 98}, {value: 99}, {value: 98.5}],
        quality: [{value: 5}, {value: 3}, {value: 4}, {value: 2}, {value: 3}, {value: 1}],
        sales: [{value: 10}, {value: 12}, {value: 11}, {value: 14}, {value: 15}, {value: 18}]
    };
    const prodVsDemandData = [
        { name: 'Jan', production: 4000, demand: 2400 },
        { name: 'Feb', production: 3000, demand: 1398 },
        { name: 'Mar', production: 2000, demand: 9800 },
        { name: 'Apr', production: 2780, demand: 3908 },
        { name: 'May', production: 1890, demand: 4800 },
        { name: 'Jun', production: 2390, demand: 3800 },
    ];
    
    const totalProduction = PRODUCTION_BATCHES.filter(b => b.status === BatchStatus.Completed).reduce((sum, b) => sum + b.quantity, 0);
    const qualityHolds = DEVIATIONS.filter(d => d.status !== 'Closed').length;
    const totalSales = SALES_ORDERS.reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity * 500, 0), 0);
    const capexSpend = CAPEX_REQUESTS.filter(c => c.stage === 'Approved').reduce((sum, c) => sum + c.amount, 0);
    const topAlerts = ESCALATED_ISSUES.filter(i => i.status === 'Open').slice(0, 5);
    
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Executive Overview</h1>
                    <p className="text-slate-500 mt-1">Consolidated view of all company operations.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-slate-600">View:</label>
                    <select className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white text-slate-900">
                        <option>Company (Consolidated)</option>
                        {PLANTS.map(p => <option key={p.id}>{p.name}</option>)}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                 <KpiCard title="Total Production" value={`${(totalProduction / 1000).toFixed(1)}k MT`} delta="+5.2%" deltaType="increase" data={kpiSparkData.production} />
                 <KpiCard title="On-time Delivery" value="98.2%" delta="-0.5%" deltaType="decrease" data={kpiSparkData.delivery} />
                 <KpiCard title="Quality Holds" value={qualityHolds.toString()} delta="+1" deltaType="decrease" data={kpiSparkData.quality} />
                 <KpiCard title="Total Sales" value={`₹${(totalSales / 100000).toFixed(1)}L`} delta="+12.1%" deltaType="increase" data={kpiSparkData.sales} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-slate-700 mb-4">Production vs. Demand (YTD)</h3>
                <div style={{ height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={prodVsDemandData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="production" stroke="#2563eb" strokeWidth={2} name="Production (MT)" />
                            <Line type="monotone" dataKey="demand" stroke="#7c3aed" strokeWidth={2} name="Demand (MT)" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
                    <h3 className="text-lg font-semibold text-slate-700 mb-4">Top Priority Alerts</h3>
                    <div className="space-y-3">
                        {topAlerts.map(alert => (
                            <div key={alert.id} className={`p-3 rounded-md border-l-4 ${alert.priority === IssuePriority.Critical ? 'bg-red-50 border-red-400' : 'bg-yellow-50 border-yellow-400'}`}>
                                <p className={`font-semibold ${alert.priority === IssuePriority.Critical ? 'text-red-800' : 'text-yellow-800'}`}>{alert.title}</p>
                                <p className="text-xs text-slate-500">{alert.plant} - {alert.date}</p>
                            </div>
                        ))}
                    </div>
                </div>
                 <div className="bg-white p-6 rounded-lg shadow-md">
                     <h3 className="text-lg font-semibold text-slate-700 mb-4">Cash & Forecast</h3>
                     <div className="space-y-4">
                        <div>
                            <p className="text-sm text-slate-500">Cash Runway</p>
                            <p className="text-2xl font-bold text-slate-800">18 Months</p>
                        </div>
                         <div>
                            <p className="text-sm text-slate-500">Net Profit Margin</p>
                            <p className="text-2xl font-bold text-slate-800">22.5%</p>
                        </div>
                        <button onClick={() => onNavigate('finance')} className="text-sm font-semibold text-primary-600 hover:underline">Open Finance Tab &rarr;</button>
                     </div>
                 </div>
            </div>
        </div>
    );
};

export default ManagementDashboard;