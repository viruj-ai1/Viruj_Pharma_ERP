import React from 'react';
import { USERS, DOCUMENTS } from '../../services/mockData';
import { DashboardCard } from './shared/CommonComponents';
import { Role } from '../../types';
import { UserManagementIcon, DocumentIcon, AdminIcon } from '../../constants';


const AdminDashboard: React.FC = () => {
    const roleCounts = Object.values(Role).length;
    
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DashboardCard
                    title="Total Users"
                    value={USERS.length}
                    description="Active users in the system"
                    icon={<UserManagementIcon />}
                    color="purple"
                />
                <DashboardCard
                    title="Total Documents"
                    value={DOCUMENTS.length}
                    description="Across all modules"
                    icon={<DocumentIcon />}
                    color="blue"
                />
                <DashboardCard
                    title="Configured Roles"
                    value={roleCounts}
                    description="System-wide user roles"
                    icon={<AdminIcon />}
                    color="green"
                />
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-slate-700 mb-4">System Administration</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button className="w-full text-left p-4 bg-slate-50 hover:bg-slate-100 rounded-md transition-colors">
                        <h4 className="font-semibold text-slate-800">User Management</h4>
                        <p className="text-sm text-slate-500">Add, edit, or disable user accounts.</p>
                    </button>
                    <button className="w-full text-left p-4 bg-slate-50 hover:bg-slate-100 rounded-md transition-colors">
                        <h4 className="font-semibold text-slate-800">View Audit Logs</h4>
                        <p className="text-sm text-slate-500">Track all system activities and changes.</p>
                    </button>
                    <button className="w-full text-left p-4 bg-slate-50 hover:bg-slate-100 rounded-md transition-colors">
                        <h4 className="font-semibold text-slate-800">System Configuration</h4>
                        <p className="text-sm text-slate-500">Manage global settings and modules.</p>
                    </button>
                </div>
            </div>

        </div>
    );
};
export default AdminDashboard;