import React, { useState, useRef } from 'react';

const DocDigitizationUploaderView: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [step, setStep] = useState<'upload' | 'metadata'>('upload');
    const [docType, setDocType] = useState('Historical BMR');
    const [batchId, setBatchId] = useState('BMR-2018-05-PARA');

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
                setStep('metadata');
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };
    
    const handleSubmitForValidation = () => {
        alert(`Document ${batchId} submitted to QA Manager for validation.`);
        setFile(null);
        setPreview(null);
        setStep('upload');
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Document Digitization Uploader</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                {step === 'upload' && (
                    <div className="text-center p-8 border-2 border-dashed rounded-lg">
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,application/pdf" />
                        <h3 className="text-xl font-semibold mb-4">Upload Center</h3>
                        <p className="text-gray-600 mb-6">Select a scanned document to begin the digitization process.</p>
                        <div className="flex justify-center space-x-4">
                            <button onClick={handleUploadClick} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                Upload from Computer
                            </button>
                             <button className="bg-gray-600 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                Use Camera
                            </button>
                        </div>
                    </div>
                )}
                {step === 'metadata' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                             <h3 className="text-xl font-semibold mb-4">Document Preview</h3>
                             {preview && <img src={preview} alt="Document Preview" className="rounded-lg shadow-inner border max-h-96 w-full object-contain" />}
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold">Metadata Correction (OCR Assisted)</h3>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Document Type</label>
                                <select value={docType} onChange={e => setDocType(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                                    <option>Historical BMR</option>
                                    <option>Cleaning Log</option>
                                    <option>Calibration Certificate</option>
                                    <option>Legacy SOP</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Batch ID / Reference ID</label>
                                <input type="text" value={batchId} onChange={e => setBatchId(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"/>
                            </div>
                            <div className="pt-6 flex justify-end space-x-3">
                                <button onClick={() => setStep('upload')} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                                <button onClick={handleSubmitForValidation} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Send to QA Manager for Validation</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DocDigitizationUploaderView;
