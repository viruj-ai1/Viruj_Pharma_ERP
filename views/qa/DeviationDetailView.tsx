import React, { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { DEVIATIONS, USERS } from '../../services/mockData';
import { Deviation, Role, User } from '../../types';

type DeviationStatus = Deviation['status'];

const statusColors: { [key in DeviationStatus]: string } = {
    'Open': 'bg-yellow-100 text-yellow-800',
    'Investigation': 'bg-blue-100 text-blue-800',
    'Pending Manager Review': 'bg-purple-100 text-purple-800',
    'Pending Final Approval': 'bg-indigo-100 text-indigo-800',
    'Closed': 'bg-green-100 text-green-800',
    'Rejected': 'bg-red-100 text-red-800'
};

const StatusBadge: React.FC<{ status: DeviationStatus }> = ({ status }) => (
    <span className={`px-3 py-1 text-sm font-semibold leading-tight rounded-full ${statusColors[status]}`}>{status}</span>
);

const DetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div>
        <p className="text-sm text-gray-500">{label}</p>
        <div className="font-semibold text-gray-800">{value}</div>
    </div>
);

const Section: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">{title}</h3>
        <div className="space-y-4">{children}</div>
    </div>
);

const TextArea: React.FC<{ label: string; value: string; onChange: (val: string) => void; isEditable: boolean }> = ({ label, value, onChange, isEditable }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            readOnly={!isEditable}
            rows={5}
            className={`w-full p-2 border rounded-md ${isEditable ? 'bg-white border-gray-300 focus:ring-primary-500 focus:border-primary-500' : 'bg-gray-100 border-gray-200 cursor-not-allowed'}`}
        />
    </div>
)

const DeviationDetailView: React.FC<{ deviationId: string; onBack: () => void; }> = ({ deviationId, onBack }) => {
    const { user } = useAuth();
    const [deviation, setDeviation] = useState(() => DEVIATIONS.find(d => d.id === deviationId));

    // Local state for edits
    const [investigationSummary, setInvestigationSummary] = useState(deviation?.investigationSummary || '');
    const [rootCause, setRootCause] = useState(deviation?.rootCause || '');
    const [capa, setCapa] = useState(deviation?.capa || '');

    const handleUpdate = (newStatus: DeviationStatus) => {
        if (!deviation || !user) return;
        
        const devIndex = DEVIATIONS.findIndex(d => d.id === deviation.id);
        if (devIndex === -1) return;

        const updatedDeviation: Deviation = {
            ...deviation,
            status: newStatus,
            investigationSummary,
            rootCause,
            capa,
            managerReviewedBy: newStatus === 'Pending Final Approval' ? user.id : deviation.managerReviewedBy,
            approvedBy: newStatus === 'Closed' ? user.id : deviation.approvedBy,
        };

        DEVIATIONS[devIndex] = updatedDeviation;
        setDeviation(updatedDeviation);
    };

    const isOperator = user?.role === Role.QA_Operator;
    const isManager = user?.role === Role.QA_Manager;
    const isHead = user?.role === Role.QA_Head;

    const assignedToUser = USERS.find(u => u.id === deviation?.assignedTo);

    if (!deviation) {
        return <div>Deviation not found</div>;
    }
    
    const canOperatorEdit = isOperator && deviation.status === 'Investigation' && deviation.assignedTo === user.id;
    const canManagerReview = isManager && deviation.status === 'Pending Manager Review';
    const canHeadApprove = isHead && deviation.status === 'Pending Final Approval';
    
    return (
        <div>
            <button onClick={onBack} className="mb-4 text-primary-600 hover:underline flex items-center text-sm">
                &larr; Back to Deviations List
            </button>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{deviation.title}</h1>
                    <p className="text-gray-500">ID: <span className="font-mono uppercase">{deviation.id}</span> | Batch: <span className="font-mono">{deviation.batchNumber}</span></p>
                </div>
                <StatusBadge status={deviation.status} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                     <Section title="Investigation Details">
                        <TextArea label="Investigation Summary" value={investigationSummary} onChange={setInvestigationSummary} isEditable={canOperatorEdit} />
                        <TextArea label="Root Cause Analysis" value={rootCause} onChange={setRootCause} isEditable={canOperatorEdit} />
                        <TextArea label="Corrective & Preventive Actions (CAPA)" value={capa} onChange={setCapa} isEditable={canOperatorEdit} />
                        {canOperatorEdit && <button onClick={() => handleUpdate('Pending Manager Review')} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-700">Submit for Manager Review</button>}
                    </Section>

                    {canManagerReview && (
                        <Section title="Manager Review">
                            <p className="text-sm text-gray-600">Review the investigation details and approve to send for final approval, or send back for revision.</p>
                            <div className="flex justify-end space-x-3">
                                <button className="bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600">Request Revision</button>
                                <button onClick={() => handleUpdate('Pending Final Approval')} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700">Approve & Submit to Head</button>
                            </div>
                        </Section>
                    )}

                    {canHeadApprove && (
                         <Section title="Final Approval">
                            <p className="text-sm text-gray-600">Review all details and close the deviation.</p>
                            <div className="flex justify-end space-x-3">
                                <button className="bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600">Request Revision</button>
                                <button onClick={() => handleUpdate('Closed')} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700">Approve & Close Deviation</button>
                            </div>
                        </Section>
                    )}
                </div>

                <div className="space-y-6">
                    <Section title="Deviation Info">
                        <DetailRow label="Opened By" value={deviation.openedBy} />
                        <DetailRow label="Date Opened" value={deviation.dateOpened} />
                        <DetailRow label="Severity" value={deviation.severity} />
                        <DetailRow label="Assigned To" value={assignedToUser?.name || 'Unassigned'} />
                        <DetailRow label="Plant" value={deviation.plant} />
                        <DetailRow label="Source Department" value={deviation.sourceDept} />
                    </Section>

                     <Section title="Approval Trail">
                        <DetailRow label="Manager Review" value={deviation.managerReviewedBy ? USERS.find(u => u.id === deviation.managerReviewedBy)?.name : 'Pending'} />
                        <DetailRow label="Final Approval (Head)" value={deviation.approvedBy ? USERS.find(u => u.id === deviation.approvedBy)?.name : 'Pending'} />
                    </Section>
                </div>
            </div>

        </div>
    );
};

export default DeviationDetailView;