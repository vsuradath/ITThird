import React, { useState } from 'react';
import FormContainer, { FormField, TextInput, TextArea } from '../FormContainer';
import { FormDefinition, Topic, SubTopic } from '../../types';

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
      disabled: isReadOnly
    };

    switch (field.inputType) {
        case 'textarea':
            return <TextArea {...commonProps} value={value} onChange={e => handleChange(key, e.target.value)} />;
        case 'date':
            return <TextInput {...commonProps} type="date" value={value} onChange={e => handleChange(key, e.target.value)} />;
        case 'checkbox':
            return (
                 <label className="flex items-center">
                    <input {...commonProps} type="checkbox" checked={!!value} onChange={e => handleChange(key, e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"/>
                    <span className="ml-3 text-sm text-black">{field.topic}</span>
                 </label>
            );
        default:
            return <TextInput {...commonProps} type="text" value={value} onChange={e => handleChange(key, e.target.value)} />;
    }
};

const TerminationForm: React.FC<Props> = ({
  onSubmit,
  onSaveDraft,
  definition,
  initialData,
  isReadOnly,
  ...reviewProps
}) => {
  const [formData, setFormData] = useState<Record<string, any>>(initialData || {});

  const handleChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  const handleSaveDraft = () => {
    if(isReadOnly) return;
    onSaveDraft(formData);
  };

  return (
    <FormContainer
      title={definition.label}
      onSubmit={handleSubmit}
      isReadOnly={isReadOnly}
      onSaveDraft={!isReadOnly ? handleSaveDraft : undefined}
      {...reviewProps}
    >
        {definition.topics.map(topic => (
            <div key={topic.no} className="space-y-4 pt-6 mt-6 first:mt-0 first:pt-0 border-t first:border-t-0">
                <h3 className="text-md font-semibold text-black">{topic.topic}</h3>
                {topic.subTopics?.map(subTopic => (
                    <div key={subTopic.fieldKey}>
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
        ))}
    </FormContainer>
  );
};

export default TerminationForm;