
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Role, Deviation, ProductionBatch, QAReleaseStatus, CAPA, ChangeControl, StabilityStudy, Document, BatchStatus } from '../../types';
import { DEVIATIONS, USERS, PRODUCTION_BATCHES, CAPAS, CHANGE_CONTROLS, STABILITY_STUDIES, DOCUMENTS } from '../../services/mockData';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DashboardCard } from './shared/CommonComponents';
import { ReleaseIcon, SafetyIcon, CapaIcon, ChangeControlIcon, TaskIcon, BatchReviewIcon, AuditIcon } from '../../constants';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

const deviationStatusColors: { [key: string]: 'warning' | 'info' | 'secondary' | 'default' | 'success' | 'destructive' } = {
    'Open': 'warning',
    'Investigation': 'info',
    'Pending Manager Review': 'secondary',
    'Pending Final Approval': 'default',
    'Closed': 'success',
    'Rejected': 'destructive'
};

interface DashboardProps {
    onNavigate: (view: string, params?: any) => void;
}

const QAHeadDashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
    const { user } = useAuth();
    if (!user) return null;
    const plantDeviations = DEVIATIONS.filter(d => d.plantId === user.plantId);
    const plantBatches = PRODUCTION_BATCHES.filter(b => b.plantId === user.plantId);
    
    const releasePending = plantBatches.filter(b => b.qaReleaseStatus === QAReleaseStatus.Pending).length;
    const deviationsOpen = plantDeviations.filter(d => d.status !== 'Closed').length;
    const capasOpen = CAPAS.filter(c => c.plantId === user.plantId && c.status !== 'Closed').length;
    const changeControlsOpen = CHANGE_CONTROLS.filter(cc => cc.plantId === user.plantId && cc.status !== 'Closed').length;
    
    const deviationSeverityData = Object.entries(plantDeviations.reduce((acc, d) => {
        acc[d.severity] = (acc[d.severity] || 0) + 1;
        return acc;
    }, {} as Record<string, number>)).map(([name, value]) => ({name, value}));
    const COLORS = {'Critical': 'var(--color-red-500)', 'High': 'var(--color-orange-500)', 'Medium': 'var(--color-yellow-500)', 'Low': 'var(--color-slate-500)'};

    return (
        <div className="space-y-6">
             <h1 className="text-3xl font-bold text-text-primary">QA Head Dashboard</h1>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardCard title="Batch Release Pending" value={releasePending} description="Awaiting QA decision" color="blue" icon={<ReleaseIcon />} onClick={() => onNavigate('qaRelease')}/>
                <DashboardCard title="Deviations Open" value={deviationsOpen} description="Across all stages" color="red" icon={<SafetyIcon />} onClick={() => onNavigate('deviations')} />
                <DashboardCard title="CAPA Open" value={capasOpen} description="Corrective actions" color="yellow" icon={<CapaIcon />} onClick={() => onNavigate('capa')} />
                <DashboardCard title="Change Controls Open" value={changeControlsOpen} description="Pending assessment" color="purple" icon={<ChangeControlIcon />} onClick={() => onNavigate('changeControl')} />
             </div>
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <Card className="lg:col-span-2">
                     <CardHeader><CardTitle>QA Release Snapshot</CardTitle></CardHeader>
                     <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Batch</TableHead>
                                    <TableHead>QC Status</TableHead>
                                    <TableHead>Deviations</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {plantBatches.filter(b => b.qaReleaseStatus === QAReleaseStatus.Pending).slice(0,5).map(b => (
                                    <TableRow key={b.id}>
                                        <TableCell className="font-medium">{b.batchNumber}</TableCell>
                                        <TableCell>{b.status === BatchStatus.QCReview ? <Badge variant="warning">Pending</Badge> : <Badge variant="success">Pass</Badge>}</TableCell>
                                        <TableCell>{DEVIATIONS.filter(d => d.batchNumber === b.batchNumber).length}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                     </CardContent>
                 </Card>
                 <Card>
                    <CardHeader><CardTitle>Deviation Overview</CardTitle></CardHeader>
                    <CardContent className="h-[200px] w-full">
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={deviationSeverityData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
                                    {deviationSeverityData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />)}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: 'var(--color-ui-card)', border: '1px solid var(--color-ui-border)' }} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                 </Card>
             </div>
        </div>
    );
};

const QAManagerDashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
    const { user } = useAuth();
    if(!user) return null;
    const openDeviations = DEVIATIONS.filter(d => d.plantId === user.plantId && (d.status === 'Open' || d.status === 'Investigation')).length;
    const pendingReview = DEVIATIONS.filter(d => d.plantId === user.plantId && d.status === 'Pending Manager Review').length;
    
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-text-primary">QA Manager Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardCard title="Open Deviations" value={openDeviations} description="Requires action or assignment" color="red" icon={<SafetyIcon />} onClick={() => onNavigate('deviations')} />
                <DashboardCard title="Pending Your Review" value={pendingReview} description="Investigations ready for review" color="purple" icon={<AuditIcon />} onClick={() => onNavigate('deviations')} />
            </div>
        </div>
    );
};

const QAOperatorDashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
    const { user } = useAuth();
    if (!user) return null;
    const myDeviations = DEVIATIONS.filter(d => d.assignedTo === user.id && d.status !== 'Closed');

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-text-primary">QA Officer Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DashboardCard title="My Open Investigations" value={myDeviations.length} description="Deviations assigned to you" color="blue" icon={<TaskIcon />} />
                <DashboardCard title="Batch Records to Review" value={2} description="Pending document review" color="green" icon={<BatchReviewIcon />} />
            </div>
            <Card>
                <CardHeader><CardTitle>My Assigned Deviations</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                         <TableBody>
                        {myDeviations.map((d: Deviation) => (
                            <TableRow key={d.id}>
                                <TableCell>
                                    <p className="font-semibold">{d.id.toUpperCase()}</p>
                                    <p className="text-sm text-text-secondary">{d.title}</p>
                                </TableCell>
                                <TableCell><p className="text-sm text-text-secondary">{d.batchNumber}</p></TableCell>
                                <TableCell><Badge variant={deviationStatusColors[d.status]}>{d.status}</Badge></TableCell>
                                <TableCell className="text-right">
                                    <Button variant="link" onClick={() => onNavigate('deviationDetail', { deviationId: d.id })}>Investigate</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                         </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

const QADashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
    const { user } = useAuth();
    if (!user) return null;

    switch (user.role) {
        case Role.QA_Operator:
            return <QAOperatorDashboard onNavigate={onNavigate} />;
        case Role.QA_Manager:
            return <QAManagerDashboard onNavigate={onNavigate} />;
        case Role.QA_Head:
            return <QAHeadDashboard onNavigate={onNavigate} />;
        default:
            return <div>Role-specific dashboard not available.</div>;
    }
};

export default QADashboard;