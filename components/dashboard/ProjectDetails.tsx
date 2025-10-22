import React, { useContext, useState } from 'react';
import { Project, FormKey } from '../../types';
import { AppContext } from '../../context/AppContext';
import { FORMS } from '../../constants';
import StatusBadge from '../common/Badge';

// Import all form components
import CapabilityAssessmentForm from '../forms/CapabilityAssessmentForm';
import SecurityMeasuresForm from '../forms/SecurityMeasuresForm';
import RegistrationForm from '../forms/RegistrationForm';
import GenericForm from '../forms/GenericForm';
import { StarIcon } from '../icons/StarIcon';

interface Props {
  project: Project;
}

const ProjectDetails: React.FC<Props> = ({ project }) => {
  const { currentUser, getProjectFormStatus, submitForm, saveDraft, approveForm, rejectForm, setPage, getSurveysForProject, formDefinitions } = useContext(AppContext);
  const [activeFormKey, setActiveFormKey] = useState<FormKey | null>(null);
  const [reviewComments, setReviewComments] = useState('');

  if (!currentUser || !formDefinitions) return null;

  const isAssessor = currentUser.role === 'assessor' && currentUser.id === project.assessorId;
  const isReviewer = currentUser.role === 'reviewer' && currentUser.id === project.reviewerId;

  const serviceApprovalSubmission = getProjectFormStatus(project.id, 'serviceApproval');
  const isServiceRequestApproved = serviceApprovalSubmission?.status === 'Approved';


  // Get surveys for this project
  const projectSurveys = getSurveysForProject(project.id);

  const handleFormSubmit = (data: any) => {
    if(activeFormKey){
        submitForm(project.id, activeFormKey, data);
        setActiveFormKey(null); // Close form after submission
    }
  };

  const handleSaveDraft = (data: any) => {
    if(activeFormKey){
        saveDraft(project.id, activeFormKey, data);
        // Feedback is shown inside the form component
    }
  };

  const renderForm = (formKey: FormKey, readOnly: boolean, initialData?: any, reviewProps: any = {}) => {
    const commonProps = {
        initialData: initialData || {},
        isReadOnly: readOnly,
        onSubmit: handleFormSubmit,
        onSaveDraft: handleSaveDraft,
        ...reviewProps
    };
    
    const definition = formDefinitions[formKey];

    if (!definition) {
      return (
        <div className="flex h-64 items-center justify-center bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-blue-500 mx-auto mb-3"></div>
            <p className="text-lg font-semibold text-gray-700">Loading form structure...</p>
          </div>
        </div>
      );
    }

    const definitionProps = { ...commonProps, definition };

    switch (formKey) {
      case 'capability': 
        return <CapabilityAssessmentForm {...definitionProps} />;
      case 'security': 
        return <SecurityMeasuresForm {...definitionProps} />;
      case 'registration': 
        return <RegistrationForm {...definitionProps} />;
      // All other forms use the generic renderer
      case 'serviceApproval':
      case 'risk':
      case 'contract':
      case 'monitoring':
      case 'termination':
      case 'evaluation':
      case 'dataProtection':
        return <GenericForm {...definitionProps} />;
      default: 
        return null;
    }
  };

  const handleFormClick = (formKey: FormKey) => {
     const submission = getProjectFormStatus(project.id, formKey);
     const status = submission?.status || 'Not Started';

     if(isAssessor && (status === 'Not Started' || status === 'Rejected' || status === 'Draft')) {
        setActiveFormKey(formKey);
        return;
     }

     if(isReviewer && status === 'Pending Review') {
        setReviewComments(submission?.comments || '');
        setActiveFormKey(formKey);
        return;
     }
     
     // Allow anyone to view a submitted/approved form
     if (submission) {
        setActiveFormKey(formKey);
     }
  }

  if (activeFormKey) {
    const submission = getProjectFormStatus(project.id, activeFormKey);
    const status = submission?.status || 'Not Started';
    const isReadOnly = !(isAssessor && (status === 'Not Started' || status === 'Rejected' || status === 'Draft'));
    const isReviewMode = isReviewer && status === 'Pending Review';

    const handleApprove = () => {
        if(submission) {
            approveForm(submission.id, reviewComments);
            setActiveFormKey(null);
            setReviewComments('');
        }
    }

    const handleReject = () => {
        if(submission && reviewComments.trim()) {
            rejectForm(submission.id, reviewComments);
            setActiveFormKey(null);
            setReviewComments('');
        } else {
            alert("Please provide comments for rejection.")
        }
    }
    
    const reviewProps = {
        isReviewMode,
        onApprove: handleApprove,
        onReject: handleReject,
        reviewComment: reviewComments,
        onReviewCommentChange: setReviewComments,
        reviewerNotes: submission?.comments
    };
    
    return (
        <div>
            <div className="flex justify-end mb-4">
                <button onClick={() => { setActiveFormKey(null); setReviewComments(''); }} className="px-5 py-2.5 font-medium bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 shadow-sm transition-all">
                    Back to Project Forms
                </button>
            </div>
            {renderForm(activeFormKey, isReadOnly, submission?.data, reviewProps)}
        </div>
    );
  }

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-start mb-4">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">{project.name}</h2>
                <p className="text-gray-600 mt-1">{project.description}</p>
            </div>
             <button onClick={() => setPage('dashboard')} className="px-5 py-2.5 font-medium bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 shadow-sm transition-all flex-shrink-0">
                Back to Dashboard
            </button>
        </div>

        <div className="mt-4 mb-6 text-sm text-gray-700 bg-gray-50 p-3 rounded-md border">
            <p><b>Assessor:</b> {project.assessorName} ({project.assessorDepartment})</p>
            <p><b>Reviewer:</b> {project.reviewerName} ({project.reviewerDepartment})</p>
        </div>

        <div className="space-y-3">
          {/* Always show service approval form */}
          {FORMS.filter(f => f.key === 'serviceApproval').map(form => {
            const submission = getProjectFormStatus(project.id, form.key);
            const status = submission?.status || 'Not Started';

            return (
              <div
                key={form.key}
                onClick={() => handleFormClick(form.key)}
                className="flex justify-between items-center p-4 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-700">{formDefinitions[form.key]?.label || form.label}</span>
                <StatusBadge status={status} />
              </div>
            );
          })}

          {/* Conditionally show other forms */}
          {isServiceRequestApproved ? (
            FORMS.filter(f => f.key !== 'serviceApproval').map(form => {
              const submission = getProjectFormStatus(project.id, form.key);
              const status = submission?.status || 'Not Started';

              return (
                <div
                  key={form.key}
                  onClick={() => handleFormClick(form.key)}
                  className="flex justify-between items-center p-4 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-700">{formDefinitions[form.key]?.label || form.label}</span>
                  <StatusBadge status={status} />
                </div>
              );
            })
          ) : (
            <div className="text-center p-8 mt-4 border-2 border-dashed rounded-md bg-gray-50 text-gray-600">
                <p className="font-semibold text-lg">Awaiting Service Request Approval</p>
                <p className="mt-2">The remaining project forms will become available once the initial service request is approved by the reviewer.</p>
            </div>
          )}
        </div>
      </div>
      
      {isServiceRequestApproved && !isReviewer && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Satisfaction Surveys</h3>
                <button 
                    onClick={() => setPage('submitSurvey')} 
                    className="px-5 py-2.5 font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-md transition-all"
                >
                    + Submit Survey
                </button>
            </div>
            {projectSurveys.length > 0 ? (
                <div className="space-y-3">
                    {projectSurveys.map(survey => (
                        <div key={survey.id} className="p-4 border rounded-md flex justify-between items-center">
                            <div>
                                <p className="font-medium">Submitted by: <span className="font-normal">{survey.submittedByName || 'Anonymous'}</span></p>
                                <p className="text-sm text-gray-500">on {survey.submittedAt.toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center text-lg font-bold text-yellow-500">
                                {survey.overallSatisfaction} / 5 <StarIcon className="w-5 h-5 ml-1" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 text-center py-4">No satisfaction surveys have been submitted for this project yet.</p>
            )}
        </div>
      )}
    </>
  );
};

export default ProjectDetails;