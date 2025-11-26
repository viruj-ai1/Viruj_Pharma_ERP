import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { CHANGE_CONTROLS, USERS } from '../../services/mockData';

const ChangeControlView: React.FC = () => {
    const { user } = useAuth();
    if (!user) return null;

    const plantChangeControls = CHANGE_CONTROLS.filter(cc => cc.plantId === user.plantId);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Change Control</h1>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal">
                         <thead className="bg-gray-50">
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase">CC ID</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase">Title</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {plantChangeControls.map(cc => (
                                <tr key={cc.id} className="hover:bg-gray-50">
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm font-semibold">{cc.id}</td>
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm">{cc.title}</td>
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm">{cc.type}</td>
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm">{cc.status}</td>
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm text-right">
                                        <button className="text-primary-600 font-semibold hover:underline">View Details</button>
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

export default ChangeControlView;
