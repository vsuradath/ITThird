import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import GenericForm from '../forms/GenericForm';

const ServiceApprovalPage: React.FC = () => {
    const { setPage, formDefinitions } = useContext(AppContext);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (formData: any) => {
        console.log('Service Approval Form Submitted:', formData);
        // In a real application, you would send this data to an API
        // to create a new project request.
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <h2 className="text-2xl font-bold text-green-600 mb-4">Request Submitted Successfully!</h2>
                <p className="text-gray-700">Your request for a new third-party service has been sent for review.</p>
                <p className="text-gray-500 mt-2 text-sm">You will be notified once the project is created.</p>
                 <button
                    onClick={() => setPage('dashboard')}
                    className="mt-6 px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    const handleSaveDraft = (formData: any) => {
        console.log('Draft save attempted:', formData);
        alert('Saving a draft is not supported on this page. Please complete and submit the form.');
    };

    const definition = formDefinitions?.['serviceApproval'];
    
    if (!definition) {
        return (
             <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-600 mx-auto mb-4"></div>
                    <p className="text-xl font-semibold text-gray-700">Loading Form...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-end mb-4">
                <button 
                    onClick={() => setPage('dashboard')} 
                    className="px-5 py-2.5 font-medium bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 shadow-sm transition-all"
                >
                    Back to Dashboard
                </button>
            </div>
            <GenericForm 
                definition={definition}
                onSubmit={handleSubmit} 
                onSaveDraft={handleSaveDraft} 
            />
        </div>
    );
};

export default ServiceApprovalPage;