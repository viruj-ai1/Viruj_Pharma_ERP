import React, { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { INITIAL_USER_TASKS, USERS, DEVIATIONS } from '../../services/mockData';
import { Task, TaskStatus, TaskPriority, Role, IndentStatus, Deviation, MaterialRequestStatus, SalesOrderStatus, PoStatus } from '../../types';
import AddTodoModal from './AddTodoModal';

interface DisplayTask extends Task {
  isTodo: boolean;
  onViewDetails?: () => void;
}

const PriorityBadge: React.FC<{ priority: TaskPriority }> = ({ priority }) => {
    const colors: { [key in TaskPriority]: string } = {
        [TaskPriority.Low]: 'bg-slate-100 text-slate-700',
        [TaskPriority.Medium]: 'bg-blue-100 text-blue-700',
        [TaskPriority.High]: 'bg-yellow-100 text-yellow-700',
        [TaskPriority.Critical]: 'bg-red-100 text-red-700'
    };
    return <span className={`px-2.5 py-1 text-xs font-semibold leading-tight rounded-full ${colors[priority]} capitalize`}>{priority}</span>;
}

const StatusBadge: React.FC<{ status: TaskStatus }> = ({ status }) => {
    const colors: { [key in TaskStatus]: string } = {
        [TaskStatus.Pending]: 'bg-yellow-100 text-yellow-700',
        [TaskStatus.InProgress]: 'bg-blue-100 text-blue-700',
        [TaskStatus.Completed]: 'bg-green-100 text-green-700'
    };
    const icons: { [key in TaskStatus]: React.ReactNode } = {
        [TaskStatus.Pending]: <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>,
        [TaskStatus.InProgress]: <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h5"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12A8 8 0 1012 4a8 8 0 00-8 8"></path></svg>,
        [TaskStatus.Completed]: <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
    };
    return <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold leading-tight rounded-full ${colors[status]} capitalize`}>{icons[status]}{status}</span>;
};

const TaskCard: React.FC<{ task: DisplayTask; onUpdateStatus?: (id: string) => void; }> = ({ task, onUpdateStatus }) => {
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

const MyTasksView: React.FC<{ 
    onNavigate: (view: string, id?: string) => void;
    onViewDeviation: (id: string) => void; 
}> = ({ onNavigate, onViewDeviation }) => {
    const { user } = useAuth();
    const [statusFilter, setStatusFilter] = useState<TaskStatus | 'All'>('All');
    const [isTodoModalOpen, setTodoModalOpen] = useState(false);
    const [userTasks, setUserTasks] = useState<Task[]>(INITIAL_USER_TASKS);

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
        setUserTasks(prev => [task, ...prev]);
        setTodoModalOpen(false);
    };

    const handleUpdateStatus = (taskId: string) => {
        setUserTasks(prevTasks => prevTasks.map(t => {
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