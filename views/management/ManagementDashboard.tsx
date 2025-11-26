import React, { useState, useMemo } from 'react';
import {
    SALES_ORDERS,
    PRODUCTION_BATCHES,
    PURCHASE_ORDERS,
    DEVIATIONS,
    ESCALATED_ISSUES,
    PROJECTS,
    CAPEX_REQUESTS,
    MATERIAL_INDENTS,
    QC_SAMPLES,
    PLANTS,
} from '../../services/mockData';
import {
    BatchStatus,
    IssuePriority,
    Role,
    SalesOrderStatus,
    PoStatus,
    IndentStatus,
    QcStatus,
} from '../../types';
import { KpiCard } from '../dashboards/shared/CommonComponents';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';


interface ManagementDashboardProps {
    onNavigate: (view: string) => void;
}

const ManagementDashboard: React.FC<ManagementDashboardProps> = ({ onNavigate }) => {
    
    // --- MOCK DATA FOR CHARTS ---
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
    
    const qualitySnapshotData = [
        { name: 'Passed', value: QC_SAMPLES.filter(s => s.status === QcStatus.Passed).length },
        { name: 'Failed', value: QC_SAMPLES.filter(s => s.status === QcStatus.Failed).length },
    ];

    // --- CALCULATIONS ---
    const totalProduction = PRODUCTION_BATCHES.filter(b => b.status === BatchStatus.Completed).reduce((sum, b) => sum + b.quantity, 0);
    const qualityHolds = DEVIATIONS.filter(d => d.status !== 'Closed').length;
    const totalSales = SALES_ORDERS.reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity * 500, 0), 0);
    const capexSpend = CAPEX_REQUESTS.filter(c => c.stage === 'Approved').reduce((sum, c) => sum + c.amount, 0);
    const topAlerts = ESCALATED_ISSUES.filter(i => i.status === 'Open').slice(0, 5);

    const pendingIndentProposals = MATERIAL_INDENTS.filter(i => i.status === IndentStatus.Pending_Management_Approval);
    const pendingSalesOrders = SALES_ORDERS.filter(so => so.status === SalesOrderStatus.Pending_Management_Approval);
    const pendingPOs = PURCHASE_ORDERS.filter(po => po.status === PoStatus.Pending_Management_Approval);
    const recentApprovals = [...MATERIAL_INDENTS, ...SALES_ORDERS, ...PURCHASE_ORDERS]
        .filter(item => 'managementApprovedOn' in item && item.managementApprovedOn)
        .sort((a, b) => new Date(b.managementApprovedOn!).getTime() - new Date(a.managementApprovedOn!).getTime())
        .slice(0, 3);
    
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Executive Overview</h1>
                    <p className="text-gray-500 mt-1">Consolidated view of all company operations.</p>
                </div>
                {/* Global View Selector (Dummy) */}
                <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-gray-600">View:</label>
                    <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900">
                        <option>Company (Consolidated)</option>
                        {PLANTS.map(p => <option key={p.id}>{p.name}</option>)}
                    </select>
                </div>
            </div>

            {/* Row 1: KPI Tiles */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                 <KpiCard title="Total Production" value={`${(totalProduction / 1000).toFixed(1)}k MT`} delta="+5.2%" deltaType="increase" data={kpiSparkData.production} />
                 <KpiCard title="On-time Delivery" value="98.2%" delta="-0.5%" deltaType="decrease" data={kpiSparkData.delivery} />
                 <KpiCard title="Quality Holds" value={qualityHolds.toString()} delta="+1" deltaType="decrease" data={kpiSparkData.quality} />
                 <KpiCard title="Total Sales" value={`₹${(totalSales / 100000).toFixed(1)}L`} delta="+12.1%" deltaType="increase" data={kpiSparkData.sales} />
                 <KpiCard title="CAPEX Spend (YTD)" value={`₹${(capexSpend / 100000).toFixed(1)}L`} delta="65% of Budget" deltaType="decrease" data={[]} />
                 <KpiCard title="System Health" value="2 Incidents" delta="Resolved" deltaType="increase" data={[]} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Production vs. Demand</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={prodVsDemandData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="production" stroke="#3b82f6" strokeWidth={2} name="Production (MT)" />
                            <Line type="monotone" dataKey="demand" stroke="#8b5cf6" strokeWidth={2} name="Demand (MT)" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Top 5 Alerts */}
                <div className="bg-white p-6 rounded-xl shadow-md lg:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Top 5 Priority Alerts</h3>
                    <div className="space-y-3">
                        {topAlerts.map(alert => (
                            <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${alert.priority === IssuePriority.Critical ? 'bg-red-50 border-red-400' : 'bg-yellow-50 border-yellow-400'}`}>
                                <p className={`font-semibold ${alert.priority === IssuePriority.Critical ? 'text-red-800' : 'text-yellow-800'}`}>{alert.title}</p>
                                <p className="text-xs text-gray-500">{alert.plant} - {alert.date}</p>
                            </div>
                        ))}
                    </div>
                </div>
                 {/* Cash & Forecast */}
                 <div className="bg-white p-6 rounded-xl shadow-md">
                     <h3 className="text-lg font-semibold text-gray-700 mb-4">Cash & Forecast</h3>
                     <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-500">Cash Runway</p>
                            <p className="text-2xl font-bold text-gray-800">18 Months</p>
                        </div>
                         <div>
                            <p className="text-sm text-gray-500">Net Profit Margin</p>
                            <p className="text-2xl font-bold text-gray-800">22.5%</p>
                        </div>
                        <button onClick={() => onNavigate('finance')} className="text-sm font-semibold text-primary-600 hover:underline">Open Finance Tab &rarr;</button>
                     </div>
                 </div>
            </div>
            
             {/* Row 4 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Active Strategic Projects */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                     <h3 className="text-lg font-semibold text-gray-700 mb-4">Active Strategic Projects (CAPEX)</h3>
                     <div className="space-y-4">
                         {PROJECTS.filter(p => p.status !== 'Completed').map(proj => (
                             <div key={proj.id} className="p-4 bg-gray-50 rounded-lg">
                                 <div className="flex justify-between items-start">
                                     <p className="font-semibold text-gray-800">{proj.title}</p>
                                     <span className={`px-2 py-0.5 text-xs rounded-full ${proj.status === 'On Track' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{proj.status}</span>
                                 </div>
                                 <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
                                    <div className="bg-primary-600 h-2.5 rounded-full" style={{width: `${proj.percentComplete}%`}}></div>
                                 </div>
                                 <div className="flex justify-between text-xs text-gray-500 mt-1">
                                     <span>Budget: ₹{(proj.budget/100000).toFixed(1)}L</span>
                                     <span>{proj.percentComplete}% Complete</span>
                                 </div>
                             </div>
                         ))}
                     </div>
                </div>
                 {/* Recent Approvals */}
                 <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Approvals / Decisions</h3>
                    <div className="space-y-3">
                       {recentApprovals.map(item => (
                           <div key={item.id} className="flex items-center space-x-3 text-sm">
                               <span className="bg-green-100 text-green-700 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg></span>
                               <div>
                                  <p className="text-gray-800">You approved <span className="font-semibold">{'poNumber' in item ? item.poNumber : item.id}</span></p>
                                  <p className="text-xs text-gray-500">Moments ago</p>
                               </div>
                           </div>
                       ))}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ManagementDashboard;