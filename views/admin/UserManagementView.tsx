import React from 'react';
import { USERS } from '../../services/mockData';
import { User } from '../../types';

const UserManagementView: React.FC = () => {
  return (
    <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
                <p className="text-slate-500 mt-1">Manage all user accounts and roles in the system.</p>
            </div>
             <button className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-700 transition duration-300 flex items-center justify-center shadow-sm hover:shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add User
            </button>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Department</th>
                            <th className="px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {USERS.map((user: User) => (
                            <tr key={user.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <p className="text-sm text-slate-900 font-semibold">{user.name}</p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <p className="text-sm text-slate-600">{user.email}</p>
                                </td>
                                 <td className="px-6 py-4 whitespace-nowrap">
                                    <p className="text-sm text-slate-600">{user.role}</p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <p className="text-sm text-slate-600">{user.department}</p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-primary-600 hover:text-primary-800">Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};

export default UserManagementView;