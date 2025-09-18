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
      <div className="p-6 md:p-8">
        <h2 className="text-2xl font-bold text-black mb-6 border-b-2 border-gray-100 pb-4">{title}</h2>
        
        {isReviewMode && (
          <div className="mb-6 p-4 border-2 border-yellow-400 bg-yellow-50 rounded-lg">
            <h3 className="text-lg font-bold text-yellow-800">Review Actions</h3>
            <div className="mt-2">
                <label className="block text-sm font-medium text-black mb-1">Your Comments (Required for Rejection)</label>
                <TextArea
                    value={reviewComment}
                    onChange={(e) => onReviewCommentChange?.(e.target.value)}
                    placeholder="Provide feedback for the assessor..."
                />
            </div>
            <div className="mt-4 flex justify-end space-x-3">
                <button type="button" onClick={onReject} disabled={!reviewComment?.trim()} className="px-5 py-2.5 font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-300">
                    Reject
                </button>
                <button type="button" onClick={onApprove} className="px-5 py-2.5 font-medium bg-green-600 text-white rounded-lg hover:bg-green-700">
                    Approve
                </button>
            </div>
          </div>
        )}

        {reviewerNotes && (
             <div className="mb-6 p-4 text-sm text-yellow-800 bg-yellow-100 rounded-lg" role="alert">
                <span className="font-bold">Reviewer Notes:</span> {reviewerNotes}
            </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <fieldset disabled={isReadOnly} className="space-y-6">
            {children}

            {showFileUpload && (
              <div className="border-t-2 border-gray-100 pt-6">
                <label className="block text-sm font-medium text-black mb-2">
                  แนบเอกสารที่เกี่ยวข้อง (ถ้ามี)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className={`relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 ${isReadOnly ? 'text-gray-400' : ''}`}
                      >
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} disabled={isReadOnly} />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                    {fileName && <p className="text-sm text-green-600 mt-2">Selected: {fileName}</p>}
                  </div>
                </div>
              </div>
            )}
          </fieldset>
          
          {!isReadOnly && (
            footer ? footer : (
              <div className="flex justify-end pt-4 space-x-3">
                 {onSaveDraft && (
                    <button
                        type="button"
                        onClick={onSaveDraft}
                        disabled={isSavingDraft || isSubmitting}
                        className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out disabled:bg-gray-200 disabled:cursor-not-allowed"
                    >
                        {isSavingDraft ? 'Saving Draft...' : 'Save as Draft'}
                    </button>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting || isSubmitDisabled || isSavingDraft}
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : (submitButtonText || 'Submit for Review')}
                </button>
              </div>
            )
          )}

           {isSubmitted && (
                <div className="mt-4 p-4 text-sm text-green-700 bg-green-100 rounded-lg" role="alert">
                    <span className="font-medium">Success!</span> Form has been submitted for review.
                </div>
            )}
            {draftSaved && (
                <div className="mt-4 p-4 text-sm text-blue-700 bg-blue-100 rounded-lg" role="alert">
                    <span className="font-medium">Draft Saved!</span> You can continue editing later.
                </div>
            )}
        </form>
      </div>
    </div>
  );
};

export const FormField: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div>
        <label className="block text-sm font-medium text-black mb-1">{label}</label>
        {children}
    </div>
);

export const TextInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input
        type="text"
        {...props}
        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-black placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
    />
);

export const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
    <textarea
        {...props}
        rows={4}
        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-black placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
    />
);

export default FormContainer;