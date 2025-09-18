import React, { useState } from 'react';
import FormContainer, { FormField, TextInput, TextArea } from '../FormContainer';
import { FormDefinition, Topic, SubTopic } from '../../types';

interface Props {
  onSubmit: (data: Record<string, any>) => void;
  definition: FormDefinition;
  initialData?: Partial<Record<string, any>>;
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
            return <TextArea name={key} value={value} onChange={e => handleChange(key, e.target.value)} placeholder={field.details} required={field.required} />;
        default:
            return <TextInput name={key} value={value} onChange={e => handleChange(key, e.target.value)} placeholder={field.details} required={field.required} />;
    }
};

const DataProtectionForm: React.FC<Props> = ({ 
    onSubmit, 
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

  return (
    <FormContainer 
        title={definition.label}
        onSubmit={handleSubmit} 
        isReadOnly={isReadOnly}
        {...reviewProps}
    >
      {definition.topics.map(topic => (
            <div key={topic.no} className="space-y-6">
                {topic.subTopics ? topic.subTopics.map(subTopic => (
                    <FormField key={subTopic.fieldKey} label={subTopic.topic}>
                        {renderField(subTopic, formData, handleChange)}
                    </FormField>
                )) : (
                    <FormField key={topic.fieldKey} label={topic.topic}>
                        {renderField(topic, formData, handleChange)}
                    </FormField>
                )}
            </div>
        ))}
    </FormContainer>
  );
};

export default DataProtectionForm;