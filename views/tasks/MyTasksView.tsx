import * as React from 'react';
import type { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { INITIAL_USER_TASKS, USERS, DEVIATIONS } from '../../services/mockData';
import { Task, TaskStatus, TaskPriority, Role } from '../../types';
import AddTodoModal from './AddTodoModal';
import { grnApi, PendingQaGrn, qualitySamplesApi, type QualityTestReviewItem } from '../../services/apiClient';
const { useState, useMemo, useEffect } = React;

interface DisplayTask extends Task {
  isTodo: boolean;
  onViewDetails?: () => void;
}

const PriorityBadge = ({ priority }: { priority: TaskPriority }) => {
    const colors: { [key in TaskPriority]: string } = {
        [TaskPriority.Low]: 'bg-slate-100 text-slate-700',
        [TaskPriority.Medium]: 'bg-blue-100 text-blue-700',
        [TaskPriority.High]: 'bg-yellow-100 text-yellow-700',
        [TaskPriority.Critical]: 'bg-red-100 text-red-700'
    };
    return <span className={`px-2.5 py-1 text-xs font-semibold leading-tight rounded-full ${colors[priority]} capitalize`}>{priority}</span>;
}

const StatusBadge = ({ status }: { status: TaskStatus }) => {
    const colors: { [key in TaskStatus]: string } = {
        [TaskStatus.Pending]: 'bg-yellow-100 text-yellow-700',
        [TaskStatus.InProgress]: 'bg-blue-100 text-blue-700',
        [TaskStatus.Completed]: 'bg-green-100 text-green-700'
    };
    const icons: { [key in TaskStatus]: ReactNode } = {
        [TaskStatus.Pending]: <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>,
        [TaskStatus.InProgress]: <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h5"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12A8 8 0 1012 4a8 8 0 00-8 8"></path></svg>,
        [TaskStatus.Completed]: <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
    };
    return <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold leading-tight rounded-full ${colors[status]} capitalize`}>{icons[status]}{status}</span>;
};

type TaskCardProps = { task: DisplayTask; onUpdateStatus?: (id: string) => void; key?: string };
const TaskCard = ({ task, onUpdateStatus }: TaskCardProps) => {
    const assignedByName = USERS.find(u => u.id === task.assignedBy)?.name || 'System';
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border p-5">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-base font-bold text-slate-800">{task.title}</h3>
                    <p className="text-sm text-slate-500">{task.description}</p>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                    <PriorityBadge priority={task.priority} />
                    <StatusBadge status={task.status} />
                </div>
            </div>
            <div className="flex justify-between items-end">
                <div className="flex items-center space-x-6 text-sm text-slate-600">
                    <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                     <div className="flex items-center space-x-2">
                         <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                        <span>From: {assignedByName}</span>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    {task.isTodo && <button onClick={() => onUpdateStatus?.(task.id)} className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors">Toggle Status</button>}
                    {task.onViewDetails && <button onClick={task.onViewDetails} className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors">View Details</button>}
                </div>
            </div>
        </div>
    );
};

const MyTasksView = ({ onNavigate, onViewDeviation }: { onNavigate: (view: string, params?: any) => void; onViewDeviation: (id: string) => void; }) => {
    const { user } = useAuth();
    const [statusFilter, setStatusFilter] = useState<TaskStatus | 'All'>('All');
    const [isTodoModalOpen, setTodoModalOpen] = useState(false);
    const [userTasks, setUserTasks] = useState<Task[]>(INITIAL_USER_TASKS);
    const [qaGrns, setQaGrns] = useState<PendingQaGrn[]>([]);
    const [qaLoading, setQaLoading] = useState(false);
    const [qaError, setQaError] = useState<string | null>(null);
    const [actionGrnId, setActionGrnId] = useState<string | null>(null);
    const [qaTests, setQaTests] = useState<QualityTestReviewItem[]>([]);
    const [qaTestsLoading, setQaTestsLoading] = useState(false);
    const [qaTestsError, setQaTestsError] = useState<string | null>(null);
    const [warehousePending, setWarehousePending] = useState<QualityTestReviewItem[]>([]);
    const [warehouseCompleted, setWarehouseCompleted] = useState<QualityTestReviewItem[]>([]);
    const [warehouseLoading, setWarehouseLoading] = useState(false);
    const [warehouseError, setWarehouseError] = useState<string | null>(null);
    const [warehouseActionId, setWarehouseActionId] = useState<string | null>(null);
    const [warehouseSuccess, setWarehouseSuccess] = useState<string | null>(null);
    const [warehouseActionModal, setWarehouseActionModal] = useState<{ testId: string; testName: string; disposition: string; decision: 'Approve' | 'Reject' } | null>(null);
    const [warehouseActionNotes, setWarehouseActionNotes] = useState('');

    const loadQaGrns = async () => {
        if (user?.role !== Role.QA_Manager) return;
        try {
            setQaLoading(true);
            setQaError(null);
            const pending = await grnApi.getPendingQA();
            setQaGrns(pending);
        } catch (error) {
            console.error('Failed to fetch pending GRNs', error);
            setQaError(error instanceof Error ? error.message : 'Unable to load GRNs');
        } finally {
            setQaLoading(false);
        }
    };

    const loadQaTests = async () => {
        if (user?.role !== Role.QA_Manager) return;
        try {
            setQaTestsLoading(true);
            setQaTestsError(null);
            const tests = await qualitySamplesApi.getTestsForReview('pending', 'qa-manager');
            setQaTests(tests);
        } catch (error) {
            console.error('Failed to fetch QA lab submissions', error);
            setQaTestsError(error instanceof Error ? error.message : 'Unable to load lab submissions');
        } finally {
            setQaTestsLoading(false);
        }
    };

    const loadWarehouseDecisions = async () => {
        if (user?.role !== Role.Warehouse_Manager) return;
        try {
            setWarehouseLoading(true);
            setWarehouseError(null);
            const [pending, completed] = await Promise.all([
                qualitySamplesApi.getWarehouseDecisions('pending'),
                qualitySamplesApi.getWarehouseDecisions('completed'),
            ]);
            setWarehousePending(pending);
            setWarehouseCompleted(completed);
        } catch (error) {
            console.error('Failed to load warehouse decisions', error);
            setWarehouseError(error instanceof Error ? error.message : 'Unable to load QA decisions.');
        } finally {
            setWarehouseLoading(false);
        }
    };

    useEffect(() => {
        if (user?.role === Role.QA_Manager) {
            loadQaGrns();
            loadQaTests();
        } else {
            setQaGrns([]);
            setQaError(null);
            setQaTests([]);
            setQaTestsError(null);
        }
        if (user?.role === Role.Warehouse_Manager) {
            loadWarehouseDecisions();
        } else {
            setWarehousePending([]);
            setWarehouseCompleted([]);
            setWarehouseError(null);
        }
    }, [user]);

    const handleSamplingRequest = async (grnId: string) => {
        try {
            setActionGrnId(grnId);
            await grnApi.requestSampling(grnId);
            await loadQaGrns();
        } catch (error) {
            console.error('Failed to raise sampling request', error);
            setQaError(error instanceof Error ? error.message : 'Unable to raise sampling request');
        } finally {
            setActionGrnId(null);
        }
    };

    const handleWarehouseAction = async (testId: string, action: 'Accepted' | 'Rejected', notes?: string) => {
        try {
            setWarehouseActionId(testId);
            setWarehouseError(null);
            setWarehouseSuccess(null);
            await qualitySamplesApi.submitWarehouseAction(testId, action, notes);
            const formType = action === 'Accepted' ? 'Acceptance' : 'Rejection';
            setWarehouseSuccess(`${formType} form generated successfully.`);
            await loadWarehouseDecisions();
        } catch (error) {
            console.error('Failed to generate form', error);
            setWarehouseError(error instanceof Error ? error.message : 'Unable to generate form.');
        } finally {
            setWarehouseActionId(null);
        }
    };

    const generatedTasks = useMemo((): DisplayTask[] => {
        if (!user) return [];
        const systemTasks: DisplayTask[] = [];

        if (user.role === Role.QA_Operator) {
            DEVIATIONS.forEach(d => {
                if (d.assignedTo === user.id && d.status === 'Investigation') {
                    systemTasks.push({ id: `dev-${d.id}`, title: `Investigate Deviation ${d.id}`, description: d.title, status: TaskStatus.InProgress, priority: d.severity === 'Critical' ? TaskPriority.Critical : TaskPriority.High, dueDate: d.dateOpened, assignedBy: d.openedBy, assignedTo: user.id, isTodo: false, onViewDetails: () => onViewDeviation(d.id) });
                }
            });
        }
        
        return systemTasks;

    }, [user, onNavigate, onViewDeviation]);

    const allMyTasks = useMemo(() => {
        const myUserTasks: DisplayTask[] = userTasks
          .filter(t => t.assignedTo === user?.id)
          .map(t => ({
            ...t,
            isTodo: true,
        }));
        
        const combinedTasks = [...generatedTasks, ...myUserTasks];

        return combinedTasks
            .filter(task => statusFilter === 'All' || task.status === statusFilter)
            .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    }, [user, statusFilter, generatedTasks, userTasks]);
    
    const handleAddTodo = (newTodo: Omit<Task, 'id' | 'status' | 'priority' | 'assignedBy' | 'assignedTo'>) => {
        if (!user) return;
        const task: Task = {
            ...newTodo,
            id: `user-todo-${Date.now()}`,
            status: TaskStatus.Pending,
            priority: TaskPriority.Medium,
            assignedBy: user.id,
            assignedTo: user.id,
        };
        setUserTasks([task, ...userTasks]);
        setTodoModalOpen(false);
    };

    const handleUpdateStatus = (taskId: string) => {
        setUserTasks(userTasks.map(t => {
            if (t.id === taskId) {
                return { ...t, status: t.status === TaskStatus.Completed ? TaskStatus.Pending : TaskStatus.Completed };
            }
            return t;
        }));
    };

    const filterOptions: {label: string, value: TaskStatus | 'All'}[] = [
        { label: "All Tasks", value: 'All'},
        { label: "Pending", value: TaskStatus.Pending},
        { label: "In Progress", value: TaskStatus.InProgress},
        { label: "Completed", value: TaskStatus.Completed}
    ];

    return (
        <div className="space-y-6">
            {isTodoModalOpen && <AddTodoModal onClose={() => setTodoModalOpen(false)} onAdd={handleAddTodo} />}
             <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">My Tasks</h1>
                    <p className="text-slate-500 mt-1">Manage and track your assigned tasks and personal to-dos.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button onClick={() => setTodoModalOpen(true)} className="bg-white text-primary-600 border border-primary-600 font-bold py-2 px-4 rounded-lg hover:bg-primary-50 transition duration-300 flex items-center justify-center shadow-sm hover:shadow-md">
                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                        Add To-Do
                    </button>
                </div>
            </div>

            {user?.role === Role.QA_Manager && (
                <div className="bg-white rounded-lg shadow-md border border-slate-200 p-5 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div>
                            <h2 className="text-xl font-semibold text-slate-800">Lab Test Decisions</h2>
                            <p className="text-sm text-slate-500">Finalize results escalated from QC.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            {qaTestsError && <span className="text-sm text-red-600">{qaTestsError}</span>}
                            <button
                                onClick={loadQaTests}
                                className="px-3 py-1.5 text-sm font-semibold text-primary-600 border border-primary-200 rounded-md hover:bg-primary-50"
                            >
                                Refresh
                            </button>
                        </div>
                    </div>
                    {qaTestsLoading ? (
                        <p className="text-sm text-slate-500">Checking for new submissions...</p>
                    ) : qaTests.length === 0 ? (
                        <p className="text-sm text-slate-500">Nothing awaiting QA review.</p>
                    ) : (
                        <div className="divide-y">
                            {qaTests.map((test) => {
                                const statusLabel =
                                    test.status === 'Submitted to QA Manager'
                                        ? 'Awaiting your review'
                                        : test.status;
                                return (
                                    <div key={test.id} className="py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                        <div>
                                            <p className="font-semibold text-slate-900">{test.test_name}</p>
                                            <p className="text-sm text-slate-600">
                                                Sample {test.sample.entry_code} · {test.sample.product_name}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                Submitted {test.submitted_on || '—'} by {test.analyst?.name || 'Analyst'}
                                            </p>
                                        </div>
                                        <div className="text-right flex flex-col items-end gap-2">
                                            <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-0.5 text-xs font-semibold text-indigo-700">
                                                {statusLabel}
                                            </span>
                                            {test.qa_officer?.name && (
                                                <p className="text-xs text-slate-500">QA Officer: {test.qa_officer.name}</p>
                                            )}
                                            <button
                                                onClick={() => onNavigate('qcTestReview', { focusTestId: test.id })}
                                                className="text-xs font-semibold text-primary-600 border border-primary-200 rounded-md px-3 py-1 hover:bg-primary-50"
                                            >
                                                Review in QA workspace
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    <p className="text-xs text-slate-500">
                        Use Test Review & Approval to assign QA officers or complete decisions.
                    </p>
                </div>
            )}

            {user?.role === Role.QA_Manager && (
                <div className="bg-white rounded-lg shadow-md border border-slate-200 p-5 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div>
                            <h2 className="text-xl font-semibold text-slate-800">Inbound GRNs Awaiting QA</h2>
                            <p className="text-sm text-slate-500">Review GRN data and send sampling requests to QC.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            {qaError && <span className="text-sm text-red-600">{qaError}</span>}
                            <button
                                onClick={loadQaGrns}
                                className="px-3 py-1.5 text-sm font-semibold text-primary-600 border border-primary-200 rounded-md hover:bg-primary-50"
                            >
                                Refresh
                            </button>
                        </div>
                    </div>
                    {qaLoading ? (
                        <p className="text-sm text-slate-500">Loading GRNs...</p>
                    ) : qaGrns.length === 0 ? (
                        <p className="text-sm text-slate-500">No GRNs awaiting QA approval.</p>
                    ) : (
                        <div className="space-y-3">
                            {qaGrns.map(grn => (
                                <div key={grn.grn_id} className="border border-slate-200 rounded-lg p-4 flex flex-col gap-2">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-xs uppercase text-slate-500">Entry</p>
                                            <p className="text-lg font-semibold text-slate-800">{grn.entry_code}</p>
                                        </div>
                                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-amber-100 text-amber-700">{grn.status}</span>
                                    </div>
                                    <p className="text-sm text-slate-600">
                                        <strong>Material:</strong> {grn.material_name} • <strong>Vehicle:</strong> {grn.vehicle_number}
                                    </p>
                                    <p className="text-sm text-slate-600">
                                        <strong>PO:</strong> {grn.po_number} • <strong>Challan:</strong> {grn.delivery_challan || 'NA'}
                                    </p>
                                    <p className="text-sm text-slate-600">
                                        <strong>Quantity:</strong> {grn.quantity_received ?? 'NA'} {grn.uom || ''} • <strong>Arrived:</strong>{' '}
                                        {new Date(grn.gate_created_at).toLocaleString()}
                                    </p>
                                    {grn.remarks && (
                                        <p className="text-sm text-slate-500 border-l-2 border-primary-200 pl-3">{grn.remarks}</p>
                                    )}
                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => handleSamplingRequest(grn.grn_id)}
                                            disabled={actionGrnId === grn.grn_id}
                                            className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50"
                                        >
                                            {actionGrnId === grn.grn_id ? 'Submitting...' : 'Raise Sampling Request'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {user?.role === Role.Warehouse_Manager && (
                <>
                    <div className="bg-white rounded-lg shadow-md border border-slate-200 p-5 space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                            <div>
                                <h2 className="text-xl font-semibold text-slate-800">Material Disposition Decisions</h2>
                                <p className="text-sm text-slate-500">QA Manager has made a decision. Generate the corresponding acceptance or rejection form based on their decision.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                {warehouseError && <span className="text-sm text-red-600">{warehouseError}</span>}
                                {warehouseSuccess && <span className="text-sm text-green-600">{warehouseSuccess}</span>}
                                <button
                                    onClick={loadWarehouseDecisions}
                                    className="px-3 py-1.5 text-sm font-semibold text-primary-600 border border-primary-200 rounded-md hover:bg-primary-50"
                                >
                                    Refresh
                                </button>
                            </div>
                        </div>
                        {warehouseLoading ? (
                            <p className="text-sm text-slate-500">Loading decisions...</p>
                        ) : warehousePending.length === 0 ? (
                            <p className="text-sm text-slate-500">No pending material disposition decisions.</p>
                        ) : (
                            <div className="space-y-3">
                                {warehousePending.map((test) => (
                                    <div key={test.id} className="border border-slate-200 rounded-lg p-4 space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <p className="text-lg font-semibold text-slate-800">{test.test_name}</p>
                                                <p className="text-sm text-slate-600">
                                                    Sample: {test.sample.entry_code} • {test.sample.product_name} • Batch: {test.sample.batch_number}
                                                </p>
                                                <div className="mt-2 space-y-1">
                                                    <p className="text-sm">
                                                        <span className="font-semibold text-slate-700">QA Decision:</span>{' '}
                                                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                                            test.qa_manager_decision === 'Approve' 
                                                                ? 'bg-green-100 text-green-700' 
                                                                : 'bg-red-100 text-red-700'
                                                        }`}>
                                                            {test.qa_manager_decision}
                                                        </span>
                                                    </p>
                                                    <p className="text-sm">
                                                        <span className="font-semibold text-slate-700">Material Disposition:</span>{' '}
                                                        <span className="text-slate-800">{test.material_disposition}</span>
                                                    </p>
                                                    {test.qa_manager_decision_notes && (
                                                        <p className="text-sm text-slate-600">
                                                            <span className="font-semibold">QA Notes:</span> {test.qa_manager_decision_notes}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                                test.material_disposition === 'Accepted - Warehouse'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                            }`}>
                                                {test.material_disposition}
                                            </span>
                                        </div>
                                        <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                                            {test.qa_manager_decision === 'Approve' ? (
                                                <button
                                                    onClick={() => setWarehouseActionModal({
                                                        testId: test.id,
                                                        testName: test.test_name,
                                                        disposition: test.material_disposition || '',
                                                        decision: 'Approve'
                                                    })}
                                                    className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                                                >
                                                    Generate Acceptance Form
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => setWarehouseActionModal({
                                                        testId: test.id,
                                                        testName: test.test_name,
                                                        disposition: test.material_disposition || '',
                                                        decision: 'Reject'
                                                    })}
                                                    className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                                                >
                                                    Generate Rejection Form
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {warehouseCompleted.length > 0 && (
                        <div className="bg-white rounded-lg shadow-md border border-slate-200 p-5 space-y-4">
                            <h2 className="text-xl font-semibold text-slate-800">Completed Actions</h2>
                            <div className="space-y-2">
                                {warehouseCompleted.map((test) => (
                                    <div key={test.id} className="border border-slate-200 rounded-lg p-3 flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold text-slate-800">{test.test_name}</p>
                                            <p className="text-sm text-slate-600">
                                                {test.sample.entry_code} • {test.sample.product_name}
                                            </p>
                                            {test.warehouse_notes && (
                                                <p className="text-xs text-slate-500 mt-1">Notes: {test.warehouse_notes}</p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                                test.warehouse_action === 'Accepted'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                            }`}>
                                                {test.warehouse_action === 'Accepted' ? 'Acceptance Form Generated' : 'Rejection Form Generated'}
                                            </span>
                                            {test.warehouse_acknowledged_at && (
                                                <p className="text-xs text-slate-500 mt-1">
                                                    {new Date(test.warehouse_acknowledged_at).toLocaleString()}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {warehouseActionModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
                                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                                    {warehouseActionModal.decision === 'Approve' ? 'Generate Acceptance Form' : 'Generate Rejection Form'}
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-700">Test:</p>
                                        <p className="text-slate-800">{warehouseActionModal.testName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-700">QA Manager Decision:</p>
                                        <p className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                                            warehouseActionModal.decision === 'Approve'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                        }`}>
                                            {warehouseActionModal.decision === 'Approve' ? 'Approved' : 'Rejected'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-700">Material Disposition:</p>
                                        <p className="text-slate-800">{warehouseActionModal.disposition}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Form Notes (Optional)
                                        </label>
                                        <textarea
                                            value={warehouseActionNotes}
                                            onChange={(e) => setWarehouseActionNotes(e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            rows={3}
                                            placeholder="Add any notes for the form..."
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2 pt-2">
                                        <button
                                            onClick={() => {
                                                setWarehouseActionModal(null);
                                                setWarehouseActionNotes('');
                                            }}
                                            className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleWarehouseAction(
                                                    warehouseActionModal.testId,
                                                    warehouseActionModal.decision === 'Approve' ? 'Accepted' : 'Rejected',
                                                    warehouseActionNotes || undefined
                                                );
                                                setWarehouseActionModal(null);
                                                setWarehouseActionNotes('');
                                            }}
                                            disabled={warehouseActionId === warehouseActionModal.testId}
                                            className={`px-4 py-2 text-sm font-semibold text-white rounded-lg disabled:opacity-50 ${
                                                warehouseActionModal.decision === 'Approve'
                                                    ? 'bg-green-600 hover:bg-green-700'
                                                    : 'bg-red-600 hover:bg-red-700'
                                            }`}
                                        >
                                            {warehouseActionId === warehouseActionModal.testId 
                                                ? 'Generating...' 
                                                : warehouseActionModal.decision === 'Approve' 
                                                    ? 'Generate Acceptance Form' 
                                                    : 'Generate Rejection Form'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
            
            <div className="flex items-center space-x-2 bg-white p-2 rounded-lg shadow-sm border border-slate-200/80 w-fit">
                {filterOptions.map(opt => (
                    <button
                        key={opt.value}
                        onClick={() => setStatusFilter(opt.value)}
                        className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors duration-200 ${
                            statusFilter === opt.value ? 'bg-slate-100 text-primary-700' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
            
            <div className="space-y-4">
                 {allMyTasks.length > 0 ? (
                    allMyTasks.map(task => <TaskCard key={task.id} task={task} onUpdateStatus={handleUpdateStatus} />)
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow-md">
                        <p className="text-slate-500">You have no tasks matching this filter.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyTasksView;