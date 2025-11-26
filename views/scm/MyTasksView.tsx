import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { MATERIAL_INDENTS, INITIAL_USER_TASKS as initialTasks } from '../../services/mockData';
import { IndentStatus, Task, TaskStatus, TaskPriority } from '../../types';

interface MyTasksViewProps {
    onNavigateToIndents: () => void;
}

const MyTasksView: React.FC<MyTasksViewProps> = ({ onNavigateToIndents }) => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [newTaskContent, setNewTaskContent] = useState('');
    const [newTaskDueDate, setNewTaskDueDate] = useState('');

    const indentsForApproval = MATERIAL_INDENTS.filter(i => i.status === IndentStatus.Pending);
    const indentsForPO = MATERIAL_INDENTS.filter(i => i.status === IndentStatus.Approved_for_PO);

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTaskContent.trim() && user) {
            const newTask: Task = {
                id: `task-${Date.now()}`,
                title: newTaskContent.trim(),
                description: 'User-added to-do item.',
                status: TaskStatus.Pending,
                priority: TaskPriority.Medium,
                dueDate: newTaskDueDate || new Date().toISOString().split('T')[0],
                assignedBy: user.id,
                assignedTo: user.id,
            };
            setTasks([newTask, ...tasks]);
            setNewTaskContent('');
            setNewTaskDueDate('');
        }
    };

    const toggleTaskCompletion = (taskId: string) => {
        setTasks(tasks.map(task =>
            task.id === taskId ? { ...task, status: task.status === TaskStatus.Completed ? TaskStatus.Pending : TaskStatus.Completed } : task
        ));
    };

    const sortedTasks = [...tasks].sort((a, b) => {
        const aCompleted = a.status === TaskStatus.Completed;
        const bCompleted = b.status === TaskStatus.Completed;
        if (aCompleted !== bCompleted) {
            return aCompleted ? 1 : -1;
        }
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">My Tasks</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Task Lists */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Indents for Approval */}
                    <div className="bg-white rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold text-gray-700 p-4 border-b">
                            Indents Awaiting Approval ({indentsForApproval.length})
                        </h2>
                        <div className="divide-y">
                            {indentsForApproval.length > 0 ? indentsForApproval.slice(0, 3).map(indent => (
                                <div key={indent.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                                    <div>
                                        <p className="font-semibold text-gray-800">{indent.materialName}</p>
                                        <p className="text-sm text-gray-500">{indent.quantity} {indent.unit} - Raised on {indent.dateRaised}</p>
                                    </div>
                                    <button onClick={onNavigateToIndents} className="bg-yellow-500 text-white font-bold py-1 px-3 rounded-md text-sm hover:bg-yellow-600">Review</button>
                                </div>
                            )) : <p className="p-4 text-gray-500">No indents are currently waiting for approval.</p>}
                            {indentsForApproval.length > 3 && 
                                <div className="p-4 text-center">
                                    <button onClick={onNavigateToIndents} className="text-primary-600 font-medium hover:underline">View All {indentsForApproval.length} Indents</button>
                                </div>
                            }
                        </div>
                    </div>

                    {/* Indents ready for PO */}
                     <div className="bg-white rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold text-gray-700 p-4 border-b">
                            Approved Indents Ready for PO ({indentsForPO.length})
                        </h2>
                         <div className="divide-y">
                            {indentsForPO.length > 0 ? indentsForPO.slice(0, 3).map(indent => (
                                <div key={indent.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                                    <div>
                                        <p className="font-semibold text-gray-800">{indent.materialName}</p>
                                        <p className="text-sm text-gray-500">{indent.quantity} {indent.unit} - Approved on {indent.managementApprovedOn}</p>
                                    </div>
                                    <button onClick={onNavigateToIndents} className="bg-blue-500 text-white font-bold py-1 px-3 rounded-md text-sm hover:bg-blue-600">Create PO</button>
                                </div>
                            )) : <p className="p-4 text-gray-500">No approved indents are waiting for a PO.</p>}
                             {indentsForPO.length > 3 && 
                                <div className="p-4 text-center">
                                    <button onClick={onNavigateToIndents} className="text-primary-600 font-medium hover:underline">View All {indentsForPO.length} Indents</button>
                                </div>
                            }
                        </div>
                    </div>
                </div>

                {/* To-Do List */}
                <div className="bg-white rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold text-gray-700 p-4 border-b">My To-Do List</h2>
                    <form onSubmit={handleAddTask} className="p-4 border-b flex flex-col gap-2">
                        <input 
                            type="text"
                            value={newTaskContent}
                            onChange={(e) => setNewTaskContent(e.target.value)}
                            placeholder="Add a new task..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                        />
                         <div className="flex gap-2">
                            <input 
                                type="date"
                                value={newTaskDueDate}
                                onChange={(e) => setNewTaskDueDate(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                            />
                            <button type="submit" className="bg-primary-600 text-white font-semibold px-4 rounded-md hover:bg-primary-700">Add</button>
                        </div>
                    </form>
                    <div className="max-h-96 overflow-y-auto">
                       {sortedTasks.map(task => (
                           <div key={task.id} className="p-4 flex items-start border-b last:border-b-0">
                               <input 
                                   type="checkbox"
                                   checked={task.status === TaskStatus.Completed}
                                   onChange={() => toggleTaskCompletion(task.id)}
                                   className="mt-1 h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                               />
                               <div className="ml-3">
                                   <p className={`text-gray-800 ${task.status === TaskStatus.Completed ? 'line-through text-gray-400' : ''}`}>{task.title}</p>
                                   <p className={`text-xs ${task.status === TaskStatus.Completed ? 'text-gray-400' : 'text-gray-500'}`}>{task.dueDate}</p>
                               </div>
                           </div>
                       ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyTasksView;