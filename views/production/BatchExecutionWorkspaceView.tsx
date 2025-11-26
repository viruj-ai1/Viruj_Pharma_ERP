import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { PRODUCTION_BATCHES } from '../../services/mockData';
import { SOPStep } from '../../types';

const StepExecutionWindow: React.FC<{ step: SOPStep, onBack: () => void }> = ({ step, onBack }) => {
    
    const handleESign = () => {
        const password = prompt("Please enter your password to eSign this step:");
        if (password === 'demo123') {
            alert("Step signed and submitted successfully!");
            onBack();
        } else {
            alert("Incorrect password.");
        }
    }

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold">{step.name}</h3>
            <div className="p-4 bg-gray-100 rounded-md">
                <p className="font-semibold">Instructions:</p>
                <p className="text-gray-700">{step.instructions}</p>
            </div>

            {step.type === 'dataEntry' && (
                <div>
                    <label className="block text-sm font-medium">Record Value</label>
                    <input type="text" className="mt-1 w-full p-2 border rounded-md" />
                </div>
            )}
            
            {step.type === 'qcSample' && (
                <button className="w-full bg-blue-100 text-blue-700 p-3 rounded-md">Request QC Sample Pickup</button>
            )}

            {step.type === 'timer' && (
                <div className="text-center p-4 bg-gray-200 rounded-md">
                    <p className="text-2xl font-mono">03:59:58</p>
                    <p className="text-sm text-gray-600">Time remaining</p>
                </div>
            )}
            
            <div className="flex justify-end space-x-2 pt-4 border-t">
                <button className="px-4 py-2 bg-gray-200 rounded-md">Save Draft</button>
                {step.requiresESig ? (
                    <button onClick={handleESign} className="px-4 py-2 bg-primary-600 text-white rounded-md">eSign & Submit</button>
                ) : (
                    <button onClick={onBack} className="px-4 py-2 bg-primary-600 text-white rounded-md">Submit</button>
                )}
            </div>
        </div>
    );
};

const BatchExecutionWorkspaceView: React.FC = () => {
    const { user } = useAuth();
    const [activeStep, setActiveStep] = useState<SOPStep | null>(null);

    const activeBatch = PRODUCTION_BATCHES.find(b => b.officerId === user?.id && b.status === 'In Progress');
    const activeStage = activeBatch?.stages.find(s => s.status === 'Running');

    if (!activeBatch || !activeStage) {
        return <div className="p-6 bg-white rounded-lg shadow-md text-center">No active batch assigned. Please check the 'My Batches' screen.</div>
    }

    return (
        <div>
            <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">{activeBatch.batchNumber} - {activeBatch.productName}</h1>
                    <p className="text-gray-600">Current Stage: <span className="font-semibold">{activeStage.name}</span></p>
                </div>
                <button className="text-sm font-semibold text-primary-600">Chat with Manager</button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Pane: Steps */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="font-semibold mb-2">Stage Steps (SOP)</h3>
                    <div className="space-y-2">
                        {activeStage.steps.map(step => (
                            <button key={step.id} onClick={() => setActiveStep(step)} className={`w-full text-left p-3 rounded-md border-l-4 ${step.status === 'Completed' ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-100'}`}>
                                {step.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Center Pane: Execution */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    {activeStep ? (
                        <StepExecutionWindow step={activeStep} onBack={() => setActiveStep(null)} />
                    ) : (
                        <div className="text-center p-8 h-full flex flex-col justify-center">
                            <p className="text-gray-500">Select a step from the left to begin execution.</p>
                        </div>
                    )}
                </div>

                {/* Right Pane: Resources */}
                <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="font-semibold mb-2">Materials</h3>
                        <button className="text-sm w-full p-2 bg-blue-50 text-blue-700 rounded-md">Request More Material</button>
                    </div>
                     <div className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="font-semibold mb-2">Equipment</h3>
                        <button className="text-sm w-full p-2 bg-gray-100 rounded-md">Start/Stop Equipment</button>
                    </div>
                     <div className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="font-semibold mb-2">QC Sampling</h3>
                        <button className="text-sm w-full p-2 bg-indigo-50 text-indigo-700 rounded-md">Send Sample Request</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BatchExecutionWorkspaceView;