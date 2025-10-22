import React, { useState, useMemo } from 'react';
import FormContainer, { FormField, TextInput, TextArea } from '../FormContainer';
import GenericPrintView from './print/GenericPrintView';
import { FormDefinition, SubTopic, Topic } from '../../types';

interface Props {
  onSubmit: (data: Record<string, any>) => void;
  onSaveDraft: (data: Record<string, any>) => void;
  definition: FormDefinition;
  initialData?: Record<string, any>;
  isReadOnly?: boolean;
  isReviewMode?: boolean;
  onApprove?: () => void;
  onReject?: () => void;
  reviewComment?: string;
  onReviewCommentChange?: (value: string) => void;
  reviewerNotes?: string;
}

const renderField = (field: Topic | SubTopic, formData: Record<string, any>, handleChange: (key: string, value: any) => void, isReadOnly?: boolean) => {
    const key = field.fieldKey;
    if (!key) return null;

    const value = formData[key] || '';
    const commonProps = {
        name: key,
        required: field.required,
        disabled: isReadOnly,
    };

    switch (field.inputType) {
        case 'textarea':
            return <TextArea {...commonProps} value={value} onChange={e => handleChange(key, e.target.value)} placeholder={field.details} />;
        case 'select':
            return (
                <select {...commonProps} value={value} onChange={e => handleChange(key, e.target.value)} className="mt-1 block w-full px-3 py-1.5 bg-white border border-gray-300 rounded-md shadow-sm text-black placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100">
                    <option value="">Select an option</option>
                    {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            );
        case 'date':
             return <TextInput {...commonProps} type="date" value={value} onChange={e => handleChange(key, e.target.value)} />;
        case 'checkbox':
            return (
                 <label className="flex items-center space-x-3 mt-2">
                    <input {...commonProps} type="checkbox" checked={!!value} onChange={e => handleChange(key, e.target.checked)} className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"/>
                    {field.details && <span className="text-sm text-gray-600">{field.details}</span>}
                 </label>
            );
        case 'number':
             return <TextInput {...commonProps} value={value} onChange={e => handleChange(key, e.target.value)} type="number" min="1" max="5" placeholder={field.details} />;
        default:
             // The riskId field should be read-only if present
            if (key === 'riskId') {
                return <TextInput {...commonProps} value={value} readOnly disabled />;
            }
            return <TextInput {...commonProps} type="text" value={value} onChange={e => handleChange(key, e.target.value)} placeholder={field.details} />;
    }
};

const GenericForm: React.FC<Props> = ({ 
    onSubmit, 
    onSaveDraft, 
    definition,
    initialData, 
    isReadOnly,
    ...reviewProps
}) => {
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    // Auto-generate riskId if the definition requires it and it's not already in initialData
    const hasRiskId = definition.topics.some(t => t.subTopics?.some(st => st.fieldKey === 'riskId'));
    if (hasRiskId && !initialData?.riskId) {
        return { ...initialData, riskId: `RISK-${Date.now().toString().slice(-6)}` };
    }
    return initialData || {};
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  
  const isFormComplete = useMemo(() => {
     const requiredFields = definition.topics.flatMap(t => t.subTopics || [t]).filter(f => f.required && f.fieldKey);
     const isMainFormComplete = requiredFields.every(f => formData[f.fieldKey!] !== undefined && formData[f.fieldKey!] !== '');
     
     if(definition.hasSignatures) {
        const signature = formData.assessorSignature;
        return isMainFormComplete && signature && signature.name && signature.position && signature.department && signature.date;
     }
     return isMainFormComplete;
  }, [formData, definition]);

  const handleChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };
  
  const handleSignatureChange = (signer: 'assessorSignature', field: string, value: string) => {
    setFormData(prev => ({
        ...prev,
        [signer]: { ...(prev[signer] || {}), [field]: value },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;
    setIsSubmitting(true);
    onSubmit(formData);
    // Visual feedback handled by FormContainer
  };

  const handleSaveDraft = () => {
    if (isReadOnly) return;
    setIsSavingDraft(true);
    onSaveDraft(formData);
    setTimeout(() => {
      setIsSavingDraft(false);
      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 3000);
    }, 1000);
  };

  const formFooter = (
    <div className="flex justify-between items-center pt-4 print:hidden">
        <div>
            {/* You can make form code dynamic via definition if needed */}
        </div>
        <div className="flex space-x-3">
            <button
                type="button"
                onClick={() => window.print()}
                disabled={!isFormComplete || isReadOnly}
                className="inline-flex items-center justify-center px-5 py-2.5 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300 ease-in-out disabled:bg-gray-200 disabled:cursor-not-allowed disabled:text-gray-400"
            >
                PDF Review
            </button>
            {!isReadOnly && (
                <>
                <button
                    type="button"
                    onClick={handleSaveDraft}
                    disabled={isSavingDraft || isSubmitting}
                    className="inline-flex items-center justify-center px-5 py-2.5 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out disabled:bg-gray-200 disabled:cursor-not-allowed"
                >
                    {isSavingDraft ? 'Saving...' : 'Save as Draft'}
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting || isSavingDraft}
                    className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Submitting...' : "Submit for Review"}
                </button>
                </>
            )}
        </div>
    </div>
  );

  return (
    <>
      <div className="print:hidden">
        <FormContainer 
            title={definition.label}
            onSubmit={handleSubmit} 
            isReadOnly={isReadOnly}
            showFileUpload={true}
            footer={definition.hasSignatures ? formFooter : undefined}
            draftSaved={draftSaved}
            onSaveDraft={!isReadOnly ? handleSaveDraft : undefined}
            {...reviewProps}
        >
            {definition.topics.map(topic => (
                 <div key={topic.no} className="space-y-4 pt-6 mt-6 first:mt-0 first:pt-0 border-t first:border-t-0">
                     <h3 className="text-md font-semibold text-black">{topic.topic}</h3>
                     {/* For topics that are single fields themselves */}
                     {topic.fieldKey && (
                        <FormField label="">
                            {renderField(topic, formData, handleChange, isReadOnly)}
                        </FormField>
                     )}
                     {/* For topics that have sub-fields */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                       {topic.subTopics?.map(subTopic => (
                           <div key={subTopic.fieldKey} className={subTopic.inputType === 'textarea' ? 'md:col-span-2' : ''}>
                                {subTopic.inputType === 'checkbox' ? (
                                    renderField(subTopic, formData, handleChange, isReadOnly)
                                ) : (
                                    <FormField label={subTopic.topic}>
                                       {renderField(subTopic, formData, handleChange, isReadOnly)}
                                   </FormField>
                                )}
                           </div>
                       ))}
                    </div>
                 </div>
            ))}

            {definition.hasSignatures && (
                <div className="mt-8 border-t pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Assessor Column */}
                        <div>
                            <h3 className="text-lg font-bold text-black mb-4 text-center">ผู้ประเมิน</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-black mb-1">ผู้ประเมิน</label>
                                    <TextInput value={formData.assessorSignature?.name || ''} onChange={e => handleSignatureChange('assessorSignature', 'name', e.target.value)} disabled={isReadOnly} placeholder="(................)"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-black mb-1">ตำแหน่ง</label>
                                    <TextInput value={formData.assessorSignature?.position || ''} onChange={e => handleSignatureChange('assessorSignature', 'position', e.target.value)} disabled={isReadOnly} placeholder="กรอกตำแหน่ง"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-black mb-1">หน่วยงาน</label>
                                    <TextInput value={formData.assessorSignature?.department || ''} onChange={e => handleSignatureChange('assessorSignature', 'department', e.target.value)} disabled={isReadOnly} placeholder="กรอกหน่วยงาน"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-black mb-1">วันที่ประเมิน</label>
                                    <TextInput type="date" value={formData.assessorSignature?.date || ''} onChange={e => handleSignatureChange('assessorSignature', 'date', e.target.value)} disabled={isReadOnly}/>
                                </div>
                            </div>
                        </div>
                        {/* Reviewer Column */}
                        <div>
                            <h3 className="text-lg font-bold text-black mb-4 text-center">ผู้สอบทาน</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-black mb-1">ผู้สอบทาน</label>
                                    <TextInput value={formData.reviewerSignature?.name || ''} disabled={true} placeholder="(................)"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-black mb-1">ตำแหน่ง</label>
                                    <TextInput value={formData.reviewerSignature?.position || ''} disabled={true} placeholder="กรอกตำแหน่ง"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-black mb-1">หน่วยงาน</label>
                                    <TextInput value={formData.reviewerSignature?.department || ''} disabled={true} placeholder="กรอกหน่วยงาน"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-black mb-1">วันที่สอบทาน</label>
                                    <TextInput type="date" value={formData.reviewerSignature?.date || ''} disabled={true}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </FormContainer>
      </div>
      <GenericPrintView data={formData} definition={definition} />
    </>
  );
};

export default GenericForm;