import React, { useState } from 'react';
import FormContainer, { FormField, TextInput, TextArea } from '../FormContainer';
import { SatisfactionSurveySubmission } from '../../types';

type SurveyFormData = Omit<SatisfactionSurveySubmission, 'id' | 'submittedAt'>;

interface Props {
  onSubmit: (data: SurveyFormData) => void;
  projectName: string;
  thirdPartyName?: string;
  projectId: string;
}

const RatingSelect: React.FC<{
    name: keyof SurveyFormData;
    value: number;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    required?: boolean;
}> = ({ name, value, onChange, required }) => (
    <select
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        required={required}
    >
        <option value={0} disabled>Select a score</option>
        <option value={5}>5 - Excellent</option>
        <option value={4}>4 - Good</option>
        <option value={3}>3 - Average</option>
        <option value={2}>2 - Poor</option>
        <option value={1}>1 - Very Poor</option>
    </select>
);

const SatisfactionSurveyForm: React.FC<Props> = ({ onSubmit, projectName, thirdPartyName, projectId }) => {
  const [formData, setFormData] = useState<SurveyFormData>({
    projectId: projectId,
    projectName: projectName,
    thirdPartyName: thirdPartyName || '',
    submittedByName: '',
    overallSatisfaction: 0,
    communication: 0,
    responsiveness: 0,
    qualityOfService: 0,
    comments: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const isRating = ['overallSatisfaction', 'communication', 'responsiveness', 'qualityOfService'].includes(name);
    setFormData(prev => ({ ...prev, [name]: isRating ? parseInt(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(formData.overallSatisfaction === 0 || formData.communication === 0 || formData.responsiveness === 0 || formData.qualityOfService === 0){
         alert('Please provide a score for all rating categories.');
         return;
    }
    onSubmit(formData);
  };

  return (
    <FormContainer
      title="แบบฟอร์มประเมินผลความพึงพอใจในการให้บริการ"
      onSubmit={handleSubmit}
      submitButtonText="Submit Survey"
    >
      <p className="text-sm text-gray-600 mb-6 -mt-4">
        โปรดให้คะแนนและแสดงความคิดเห็นเพื่อการพัฒนาการให้บริการของ IT Third Party Team
      </p>
      
      <FormField label="ชื่อระบบงาน / โครงการ (Project / System Name)">
        <TextInput name="projectName" value={formData.projectName} onChange={() => {}} disabled />
      </FormField>
      
      <FormField label="ชื่อผู้ให้บริการ (Third Party Name)">
        <TextInput name="thirdPartyName" value={formData.thirdPartyName} onChange={handleChange} placeholder="ระบุชื่อบริษัทผู้ให้บริการ" required />
      </FormField>

      <FormField label="ชื่อผู้ประเมิน / หน่วยงาน (Your Name / Department)">
        <TextInput name="submittedByName" value={formData.submittedByName} onChange={handleChange} placeholder="ระบุชื่อของคุณ (ไม่บังคับ)" />
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 pt-4 border-t mt-6">
        <FormField label="1. ภาพรวมความพึงพอใจ (Overall Satisfaction)">
            <RatingSelect name="overallSatisfaction" value={formData.overallSatisfaction} onChange={handleChange} required/>
        </FormField>
        <FormField label="2. การสื่อสาร (Communication)">
            <RatingSelect name="communication" value={formData.communication} onChange={handleChange} required/>
        </FormField>
        <FormField label="3. การตอบสนอง (Responsiveness)">
            <RatingSelect name="responsiveness" value={formData.responsiveness} onChange={handleChange} required/>
        </FormField>
         <FormField label="4. คุณภาพของงาน/บริการ (Quality of Service)">
            <RatingSelect name="qualityOfService" value={formData.qualityOfService} onChange={handleChange} required/>
        </FormField>
      </div>
      
      <FormField label="ข้อเสนอแนะเพิ่มเติม (Comments / Suggestions)">
        <TextArea name="comments" value={formData.comments} onChange={handleChange} placeholder="ข้อคิดเห็นเพิ่มเติมเพื่อการปรับปรุงและพัฒนา" />
      </FormField>
    </FormContainer>
  );
};

export default SatisfactionSurveyForm;
