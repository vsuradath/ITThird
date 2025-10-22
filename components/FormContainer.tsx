import React, { useState } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface FormContainerProps {
  title: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  isReadOnly?: boolean;
  submitButtonText?: string;
  reviewerNotes?: string;
  showFileUpload?: boolean;
  footer?: React.ReactNode;
  isSubmitDisabled?: boolean;
  onSaveDraft?: () => void;
  isSavingDraft?: boolean;
  draftSaved?: boolean;
  isReviewMode?: boolean;
  onApprove?: () => void;
  onReject?: () => void;
  reviewComment?: string;
  onReviewCommentChange?: (value: string) => void;
}

const FormContainer: React.FC<FormContainerProps> = ({ 
  title, 
  children, 
  onSubmit, 
  isReadOnly = false, 
  submitButtonText, 
  reviewerNotes, 
  showFileUpload = true, 
  footer, 
  isSubmitDisabled = false,
  onSaveDraft,
  isSavingDraft = false,
  draftSaved = false,
  isReviewMode = false,
  onApprove,
  onReject,
  reviewComment,
  onReviewCommentChange,
}) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFileName(event.target.files[0].name);
    } else {
      setFileName(null);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(isReadOnly || isSubmitDisabled) return;
    
    setIsSubmitting(true);
    onSubmit(e);
    // Simulate API call
    setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 3000);
    }, 1000);
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${!isReadOnly && 'hover:shadow-2xl'}`}>
      <div className="p-4">
        <h2 className="text-xl font-bold text-black mb-3 border-b-2 border-gray-100 pb-2">{title}</h2>
        
        {isReviewMode && (
          <div className="mb-4 p-3 border-2 border-yellow-400 bg-yellow-50 rounded-lg">
            <h3 className="text-base font-bold text-yellow-800">Review Actions</h3>
            <div className="mt-2">
                <label className="block text-sm font-medium text-black mb-1">Your Comments (Required for Rejection)</label>
                <TextArea
                    value={reviewComment}
                    onChange={(e) => onReviewCommentChange?.(e.target.value)}
                    placeholder="Provide feedback for the assessor..."
                />
            </div>
            <div className="mt-4 flex justify-end space-x-3">
                <button type="button" onClick={onReject} disabled={!reviewComment?.trim()} className="px-4 py-2 font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-300">
                    Reject
                </button>
                <button type="button" onClick={onApprove} className="px-4 py-2 font-medium bg-green-600 text-white rounded-lg hover:bg-green-700">
                    Approve
                </button>
            </div>
          </div>
        )}

        {reviewerNotes && (
             <div className="mb-4 p-3 text-sm text-yellow-900 bg-yellow-100 rounded-lg border border-yellow-200">
                <h3 className="font-bold text-yellow-800 mb-2">Reviewer's Notes:</h3>
                <p className="whitespace-pre-wrap">{reviewerNotes}</p>
            </div>
        )}
        
        {draftSaved && (
            <div className="mb-4 p-3 text-sm text-green-700 bg-green-100 rounded-lg" role="alert">
                Draft saved successfully!
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {children}
          
          {showFileUpload && !isReadOnly && (
            <div className="mt-5">
              <label className="block text-sm font-medium text-black mb-1">Attach Supporting Documents</label>
              <input type="file" id="file-upload" className="hidden" onChange={handleFileChange} />
              <button
                type="button"
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 ease-in-out"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <UploadIcon className="mx-auto h-10 w-10 text-gray-400" />
                <span className="mt-2 block text-sm font-medium text-gray-700">
                  {fileName ? `File: ${fileName}` : 'Click to upload a file'}
                </span>
                <span className="mt-1 block text-xs text-gray-500">
                  PDF, DOCX, XLSX up to 10MB
                </span>
              </button>
            </div>
          )}
          
          {!isReadOnly && !isReviewMode && (
             <div className="flex flex-col sm:flex-row justify-end items-center gap-3 mt-6 pt-4 border-t">
               {onSaveDraft && (
                 <button
                   type="button"
                   onClick={onSaveDraft}
                   disabled={isSavingDraft}
                   className="w-full sm:w-auto px-5 py-2.5 font-medium bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                 >
                   {isSavingDraft ? 'Saving...' : 'Save as Draft'}
                 </button>
               )}
                <button
                  type="submit"
                  disabled={isSubmitting || isSubmitDisabled}
                  className="w-full sm:w-auto px-5 py-2.5 font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
                >
                  {isSubmitting ? 'Submitting...' : (submitButtonText || 'Submit')}
                </button>
             </div>
          )}
          {footer}
        </form>
      </div>
    </div>
  );
};

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  helpText?: string;
}

export const FormField: React.FC<FormFieldProps> = ({ label, children, required, helpText }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-black">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        {children}
        {helpText && <p className="mt-1.5 text-xs text-gray-500">{helpText}</p>}
    </div>
);

export const TextInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => {
  return <input {...props} className={`mt-1 block w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-md shadow-sm text-black placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500 ${props.className}`} />;
};

export const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => {
  return <textarea {...props} className={`mt-1 block w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-md shadow-sm text-black placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500 ${props.className}`} />;
};

export default FormContainer;