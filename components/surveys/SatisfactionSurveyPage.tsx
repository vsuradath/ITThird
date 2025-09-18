import React, { useContext, useState, useEffect } from 'react';
import SatisfactionSurveyForm from '../forms/SatisfactionSurveyForm';
import { AppContext } from '../../context/AppContext';
import { SatisfactionSurveySubmission } from '../../types';

const SatisfactionSurveyPage: React.FC = () => {
    const { selectedProject, submitSatisfactionSurvey, setPage, getProjectFormStatus } = useContext(AppContext);
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        if (isSubmitted) {
            const timer = setTimeout(() => {
                setPage('project');
            }, 3000); 

            return () => clearTimeout(timer);
        }
    }, [isSubmitted, setPage]);

    if (!selectedProject) {
        return (
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <p className="text-red-600">No project selected. Please go back to the dashboard.</p>
                <button
                    onClick={() => setPage('dashboard')}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }
    
    const registrationSubmission = getProjectFormStatus(selectedProject.id, 'registration');
    const thirdPartyName = registrationSubmission?.data?.companyName || '';


    const handleSubmit = (data: Omit<SatisfactionSurveySubmission, 'id' | 'submittedAt'>) => {
        submitSatisfactionSurvey(data);
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <h2 className="text-2xl font-bold text-green-600 mb-4">Thank You!</h2>
                <p className="text-gray-700">Your feedback has been submitted successfully. We appreciate your input.</p>
                <p className="text-gray-500 mt-2 text-sm">You will be redirected back to the project page shortly.</p>
            </div>
        );
    }
    
    return (
        <div>
             <div className="flex justify-end mb-4">
                <button onClick={() => setPage('project')} className="px-5 py-2.5 font-medium bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 shadow-sm transition-all">
                    Back to Project Details
                </button>
            </div>
            <SatisfactionSurveyForm 
                onSubmit={handleSubmit} 
                projectId={selectedProject.id}
                projectName={selectedProject.name}
                thirdPartyName={thirdPartyName}
            />
        </div>
    );
};

export default SatisfactionSurveyPage;