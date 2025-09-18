import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import DetailedCapabilityAssessmentForm from '../forms/DetailedCapabilityAssessmentForm';
import { DetailedCapabilityAssessmentData } from '../../types';

const DetailedCapabilityAssessmentPage: React.FC = () => {
    const { currentUser, selectedProject, getProjectFormStatus, submitForm, setPage } = useContext(AppContext);

    if (!selectedProject || !currentUser) {
        return (
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <p className="text-red-600">No project selected or user not found. Please go back to the dashboard.</p>
                <button
                    onClick={() => setPage('dashboard')}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    const submission = getProjectFormStatus(selectedProject.id, 'capability');
    
    // The simple form data (header data) must exist to proceed
    if (!submission || !submission.data || !submission.data.thirdPartyName) {
         return (
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <p className="text-red-600">Initial assessment data not found. Please complete the first part of Form 01.</p>
                <button
                    onClick={() => setPage('project')}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                >
                    Back to Project Forms
                </button>
            </div>
        );
    }

    const handleFormSubmit = (detailedData: DetailedCapabilityAssessmentData) => {
        const fullData = {
            ...submission.data,
            detailedAssessment: detailedData,
        };
        // The detailed form submission implies the form is ready for review
        submitForm(selectedProject.id, 'capability', fullData);
        setPage('project'); // Go back to project details after submission
    };

    const isReadOnly = !(currentUser.role === 'assessor' && currentUser.id === selectedProject.assessorId && (submission.status === 'Not Started' || submission.status === 'Rejected'));

    return (
        <div>
            <div className="flex justify-end mb-4">
                <button onClick={() => setPage('project')} className="px-5 py-2.5 font-medium bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 shadow-sm transition-all">
                    Back to Project Forms
                </button>
            </div>
            <DetailedCapabilityAssessmentForm 
                onSubmit={handleFormSubmit}
                headerData={submission.data}
                initialData={submission.data.detailedAssessment}
                isReadOnly={isReadOnly}
            />
        </div>
    );
};

export default DetailedCapabilityAssessmentPage;