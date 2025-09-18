import React, { useState, useMemo } from 'react';
import FormContainer, { FormField, TextInput, TextArea } from '../FormContainer';
import RegistrationPrintView from './print/RegistrationPrintView';
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

const renderField = (field: Topic | SubTopic, formData: Record<string, any>, handleChange: (key: string, value: any) => void) => {
    const key = field.fieldKey;
    if (!key) return null;

    const value = formData[key] || '';

    switch (field.inputType) {
        case 'textarea':
            return <TextArea name={key} value={value} onChange={e => handleChange(key, e.target.value)} required={field.required} />;
        case 'checkbox':
            return (
                <div className="flex items-center h-10">
                    <input type="checkbox" id={key} name={key} checked={!!value} onChange={e => handleChange(key, e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                </div>
            );
        case 'date':
            return <TextInput name={key} type="date" value={value} onChange={e => handleChange(key, e.target.value)} required={field.required} />;
        default:
            return <TextInput name={key} type="text" value={value} onChange={e => handleChange(key, e.target.value)} required={field.required} />;
    }
};

const RegistrationForm: React.FC<Props> = ({ 
    onSubmit, 
    onSaveDraft, 
    definition,
    initialData, 
    isReadOnly,
    ...reviewProps
}) => {
  const [formData, setFormData] = useState<Record<string, any>>(initialData || {});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);

  const isFormComplete = useMemo(() => {
    const requiredFields = definition.topics.flatMap(t => t.subTopics || [t]).filter(f => f.required && f.fieldKey);
    return requiredFields.every(f => formData[f.fieldKey!] !== undefined && formData[f.fieldKey!] !== '');
  }, [formData, definition]);

  const handleChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;
    setIsSubmitting(true);
    // Add assessor signature data before submitting
    const finalData = {
      ...formData,
      assessorSignature: formData.assessorSignature || { name: '', position: '', department: '', date: '' },
      reviewerSignature: formData.reviewerSignature || { name: '', position: '', department: '', date: '' },
    };
    onSubmit(finalData);
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

  const handleSignatureChange = (signer: 'assessorSignature', field: string, value: string) => {
    setFormData(prev => ({
        ...prev,
        [signer]: {
            ...(prev[signer] || {}),
            [field]: value,
        },
    }));
  };

  const formFooter = (
    <div className="flex justify-between items-center pt-4 print:hidden">
        <div>
            <span className="text-sm text-gray-500">รหัสแบบฟอร์ม ITD-2025-THP003</span>
        </div>
        <div className="flex space-x-3">
            <button
                type="button"
                onClick={() => window.print()}
                disabled={!isFormComplete || isReadOnly}
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300 ease-in-out disabled:bg-gray-200 disabled:cursor-not-allowed disabled:text-gray-400"
            >
                PDF Review
            </button>
            {!isReadOnly && (
                <>
                <button
                    type="button"
                    onClick={handleSaveDraft}
                    disabled={isSavingDraft || isSubmitting}
                    className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out disabled:bg-gray-200 disabled:cursor-not-allowed"
                >
                    {isSavingDraft ? 'Saving...' : 'Save as Draft'}
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting || isSavingDraft}
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed"
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
            footer={formFooter}
            draftSaved={draftSaved}
            {...reviewProps}
        >
            {definition.topics.map(topic => (
                 <div key={topic.no} className="space-y-6">
                    <h3 className="text-lg font-semibold text-black pt-4 border-t">{topic.topic}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {topic.subTopics?.map(subTopic => (
                           <FormField key={subTopic.fieldKey} label={subTopic.topic}>
                               {renderField(subTopic, formData, handleChange)}
                           </FormField>
                       ))}
                    </div>
                 </div>
            ))}

            <div className="mt-8 border-t pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Assessor Column */}
                    <div>
                        <h3 className="text-lg font-bold text-black mb-4 text-center">ผู้ประเมิน</h3>
                        <div className="space-y-4">
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
                        <div className="space-y-4">
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
        </FormContainer>
      </div>
      <RegistrationPrintView data={formData} definition={definition} />
    </>
  );
};

export default RegistrationForm;