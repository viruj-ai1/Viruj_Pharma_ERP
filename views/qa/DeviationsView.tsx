import React, { useState, useMemo } from 'react';
import { DEVIATIONS as initialDeviations, USERS } from '../../services/mockData';
import { Deviation, Role, User } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

type DeviationStatus = Deviation['status'];

const statusColors: { [key in DeviationStatus]: string } = {
    'Open': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Investigation': 'bg-blue-100 text-blue-800 border-blue-200',
    'Pending Manager Review': 'bg-purple-100 text-purple-800 border-purple-200',
    'Pending Final Approval': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'Closed': 'bg-green-100 text-green-800 border-green-200',
    'Rejected': 'bg-red-100 text-red-800 border-red-200'
};

const StatusBadge: React.FC<{ status: DeviationStatus }> = ({ status }) => (
    <span className={`px-2.5 py-1 text-xs font-semibold leading-tight rounded-full ${statusColors[status]}`}>{status}</span>
);

const AssignDeviationModal: React.FC<{ deviation: Deviation, onClose: () => void, onAssign: (deviationId: string, operatorId: string) => void }> = ({ deviation, onClose, onAssign }) => {
    const qaOperators = USERS.filter(u => u.role === Role.QA_Operator);
    const [selectedOperator, setSelectedOperator] = useState<string>(qaOperators[0]?.id || '');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedOperator) {
            onAssign(deviation.id, selectedOperator);
        }
    }

    return (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Assign Deviation</h2>
                <p className="mb-6 text-gray-500">Assign <span className="font-mono uppercase">{deviation.id}</span> to a QA Operator for investigation.</p>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="operator" className="block text-sm font-medium text-gray-700">Select Operator</label>
                    <select id="operator" value={selectedOperator} onChange={e => setSelectedOperator(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                        {qaOperators.map(op => <option key={op.id} value={op.id}>{op.name}</option>)}
                    </select>
                    <div className="pt-6 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Assign</button>
                    </div>
                </form>
            </div>
        </div>
    )
}


const DeviationsView: React.FC<{ onViewDetails: (id: string) => void }> = ({ onViewDetails }) => {
    const { user } = useAuth();
    const [deviations, setDeviations] = useState<Deviation[]>(initialDeviations);
    const [statusFilter, setStatusFilter] = useState<DeviationStatus | 'All'>('All');
    const [sortOrder, setSortOrder] = useState('date-desc');
    const [assigningDeviation, setAssigningDeviation] = useState<Deviation | null>(null);
    const [activeTab, setActiveTab] = useState('all');
    
    const handleAssignDeviation = (deviationId: string, operatorId: string) => {
        setDeviations(currentDevs => currentDevs.map(d => d.id === deviationId ? { ...d, assignedTo: operatorId, status: 'Investigation' } : d));
        setAssigningDeviation(null);
    }

    const filteredAndSortedDeviations = useMemo(() => {
        let devs = [...deviations];

        if (user?.role === Role.QA_Operator) {
            devs = devs.filter(d => d.assignedTo === user.id);
        }

        if (statusFilter !== 'All') {
            devs = devs.filter(d => d.status === statusFilter);
        }
        
        switch(sortOrder) {
            case 'date-desc': 
                devs.sort((a,b) => new Date(b.dateOpened).getTime() - new Date(a.dateOpened).getTime()); 
                break;
            case 'date-asc': 
                devs.sort((a,b) => new Date(a.dateOpened).getTime() - new Date(b.dateOpened).getTime()); 
                break;
            case 'status':
                devs.sort((a, b) => a.status.localeCompare(b.status));
                break;
            case 'assigned-asc':
                const getUserName = (id?: string) => USERS.find(u => u.id === id)?.name || 'zzzz_Unassigned'; // use zzzz to sort unassigned last
                devs.sort((a, b) => getUserName(a.assignedTo).localeCompare(getUserName(b.assignedTo)));
                break;
        }

        return devs;
    }, [deviations, statusFilter, sortOrder, user]);

  return (
    <div>
      {assigningDeviation && <AssignDeviationModal deviation={assigningDeviation} onClose={() => setAssigningDeviation(null)} onAssign={handleAssignDeviation} />}
      <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Deviations</h1>
          <button className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-700 transition duration-300 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
              Log Deviation
          </button>
      </div>

       <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button onClick={() => setActiveTab('all')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'all' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>All Deviations</button>
              { user?.role !== Role.QA_Operator && <button onClick={() => setActiveTab('trending')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'trending' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Trending</button> }
              { user?.role !== Role.QA_Operator && <button onClick={() => setActiveTab('aging')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'aging' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Aging Dashboard</button> }
          </nav>
      </div>

      {activeTab === 'all' && (
        <>
        <div className="mb-4 p-4 bg-white rounded-lg shadow-md flex items-center justify-between gap-4">
           <div className="flex items-center space-x-2">
                <label htmlFor="status-filter" className="text-sm font-medium text-gray-600">Status:</label>
                <select id="status-filter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900">
                    <option value="All">All</option>
                    {Object.keys(statusColors).map(status => <option key={status} value={status}>{status}</option>)}
                </select>
            </div>
            <div className="flex items-center space-x-2">
                <label htmlFor="sort-order" className="text-sm font-medium text-gray-600">Sort by:</label>
                <select id="sort-order" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900">
                    <option value="date-desc">Date Opened (Newest)</option>
                    <option value="date-asc">Date Opened (Oldest)</option>
                    <option value="status">Status</option>
                    <option value="assigned-asc">Assigned To</option>
                </select>
            </div>
        </div>

        <div className="space-y-4">
            {filteredAndSortedDeviations.map(d => {
                const canAssign = (user?.role === Role.QA_Manager || user?.role === Role.QA_Head) && d.status === 'Open';
                
                let buttonText = 'View Details';
                if (user?.role === Role.QA_Operator && d.status === 'Investigation') {
                    buttonText = 'Update Investigation';
                } else if (user?.role === Role.QA_Manager && d.status === 'Pending Manager Review') {
                    buttonText = 'Review';
                } else if (user?.role === Role.QA_Head && d.status === 'Pending Final Approval') {
                    buttonText = 'Final Review';
                }
                
                return (
                    <div key={d.id} className="bg-white rounded-lg shadow-md p-5 border-l-4" style={{ borderColor: statusColors[d.status].split(' ')[0].replace('bg-', '').replace('-100', '-400') }}>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-bold text-gray-800">{d.title}</p>
                                <p className="text-sm text-gray-500">ID: <span className="font-mono uppercase">{d.id}</span> | Batch: <span className="font-mono">{d.batchNumber}</span></p>
                            </div>
                            <StatusBadge status={d.status} />
                        </div>
                        <div className="mt-4 flex justify-between items-end">
                            <div>
                                <p className="text-xs text-gray-500">Opened by: {d.openedBy} on {d.dateOpened}</p>
                                <p className="text-xs text-gray-500">Assigned to: {USERS.find(u => u.id === d.assignedTo)?.name || 'Unassigned'}</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                {canAssign && (
                                    <button onClick={() => setAssigningDeviation(d)} className="bg-blue-500 text-white font-bold py-1 px-3 rounded-md text-sm hover:bg-blue-600">Assign</button>
                                )}
                                <button onClick={() => onViewDetails(d.id)} className="text-primary-600 hover:text-primary-800 font-semibold text-sm">
                                {buttonText}
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
            {filteredAndSortedDeviations.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                    <p className="text-gray-500">No deviations match your criteria.</p>
                </div>
            )}
        </div>
        </>
      )}
      {activeTab !== 'all' && (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
            <p>This section will show charts and data for {activeTab} analysis.</p>
        </div>
      )}
    </div>
  );
};

export default DeviationsView;