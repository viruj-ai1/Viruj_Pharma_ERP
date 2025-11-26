
import React, { useState } from 'react';
import { Task } from '../../types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

interface AddTodoModalProps {
    onClose: () => void;
    onAdd: (newTodo: Omit<Task, 'id' | 'status' | 'priority' | 'assignedBy' | 'assignedTo'>) => void;
}

const AddTodoModal: React.FC<AddTodoModalProps> = ({ onClose, onAdd }) => {
    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            onAdd({ 
                title: title.trim(), 
                description: "User-added to-do item.",
                dueDate: dueDate || new Date().toISOString().split('T')[0]
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <Card className="w-full max-w-md">
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle>Add New To-Do</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-text-secondary mb-1">Task Title</label>
                            <Input
                                type="text"
                                id="title"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                required
                                placeholder="e.g., Follow up on vendor report"
                            />
                        </div>
                        <div>
                            <label htmlFor="dueDate" className="block text-sm font-medium text-text-secondary mb-1">Due Date</label>
                            <Input
                                type="date"
                                id="dueDate"
                                value={dueDate}
                                onChange={e => setDueDate(e.target.value)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="justify-end space-x-2">
                        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                        <Button type="submit">Add To-Do</Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default AddTodoModal;