import React, { useState, useMemo } from 'react';
import FormContainer, { FormField, TextInput, TextArea } from '../FormContainer';
import { DetailedAssessmentRow, FormDefinition } from '../../types';
import SecurityMeasuresPrintView from './print/SecurityMeasuresPrintView';

const PaperclipIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
    </svg>
);

export interface SecurityMeasuresFormData {
  thirdPartyName: string;
  assessmentDate: string;
  torRfpReference: string;
  assessmentRows: DetailedAssessmentRow[];
  summaryStatus: 'none' | 'sufficient' | 'insufficient';
  sufficientReason: string;
  insufficientReason: string;
  assessorSignature: {
    name: string;
    position: string;
    department: string;
    date: string;
  };
  reviewerSignature: {
    name: string;
    position: string;
    department: string;
    date: string;
  };
}

interface Props {
  onSubmit: (data: SecurityMeasuresFormData) => void;
  onSaveDraft: (data: SecurityMeasuresFormData) => void;
  definition: FormDefinition;
  initialData?: Partial<SecurityMeasuresFormData>;
  isReadOnly?: boolean;
  isReviewMode?: boolean;
  onApprove?: () => void;
  onReject?: () => void;
  reviewComment?: string;
  onReviewCommentChange?: (value: string) => void;
  reviewerNotes?: string;
}

const SecurityMeasuresForm: React.FC<Props> = ({ 
    onSubmit, 
    onSaveDraft,
    definition,
    initialData, 
    isReadOnly,
    isReviewMode,
    onApprove,
    onReject,
    reviewComment,
    onReviewCommentChange,
    reviewerNotes 
}) => {
  const totalRows = useMemo(() => {
    if (!definition || !definition.topics) return 0;
    return definition.topics.reduce((acc, topic) => acc + (topic.subTopics?.length || 1), 0);
  }, [definition]);
  
  const initialRows = useMemo(() => Array(totalRows).fill({
    result: 'ระบุ--',
    reason: '',
    reference: '',
    comment: ''
  }), [totalRows]);

  const initialDataStructure: SecurityMeasuresFormData = useMemo(() => ({
    thirdPartyName: '',
    assessmentDate: '',
    torRfpReference: '',
    assessmentRows: initialRows,
    summaryStatus: 'none',
    sufficientReason: '',
    insufficientReason: '',
    assessorSignature: { name: '', position: '', department: '', date: '' },
    reviewerSignature: { name: '', position: '', department: '', date: '' },
  }), [initialRows]);

  const [formData, setFormData] = useState<SecurityMeasuresFormData>({
      ...initialDataStructure,
      ...initialData,
      assessmentRows: initialData?.assessmentRows && initialData.assessmentRows.length === totalRows ? initialData.assessmentRows : initialRows,
      assessorSignature: initialData?.assessorSignature || initialDataStructure.assessorSignature,
      reviewerSignature: initialData?.reviewerSignature || initialDataStructure.reviewerSignature,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);

  const hasNotPass = useMemo(() => {
    return formData.assessmentRows.some(row => row.result === 'Not Pass');
  }, [formData.assessmentRows]);

  const isFormComplete = useMemo(() => {
    const isHeaderComplete = formData.thirdPartyName && formData.assessmentDate && formData.torRfpReference;
    const areRowsComplete = formData.assessmentRows.every(row => row.result !== 'ระบุ--');
    const isSummaryComplete = formData.summaryStatus !== 'none';
    const isSignatureComplete = formData.assessorSignature.name && formData.assessorSignature.position && formData.assessorSignature.department && formData.assessorSignature.date;

    return isHeaderComplete && areRowsComplete && isSummaryComplete && isSignatureComplete;
  }, [formData]);

  const evaluationResult = useMemo(() => {
    const areAllRowsEvaluated = formData.assessmentRows.every(row => row.result !== 'ระบุ--');
    if (!areAllRowsEvaluated) {
        return { text: "กรุณากรอกให้ครบ", status: 'incomplete' };
    }
    
    if (hasNotPass) {
        return { text: "ไม่ผ่าน", status: 'fail' };
    }

    return { text: "ผ่าน", status: 'pass' };
  }, [formData.assessmentRows, hasNotPass]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRowChange = (index: number, field: keyof DetailedAssessmentRow, value: string) => {
        const newRows = [...formData.assessmentRows];
        newRows[index] = { ...newRows[index], [field]: value };
        setFormData(prev => ({ ...prev, assessmentRows: newRows }));
  };

  const handleSummaryChange = (field: keyof SecurityMeasuresFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
  };
    
  const handleSignatureChange = (
        signer: 'assessorSignature',
        field: keyof SecurityMeasuresFormData['assessorSignature'], 
        value: string
    ) => {
        setFormData(prev => ({
            ...prev,
            [signer]: {
                ...prev[signer],
                [field]: value,
            },
        }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly || hasNotPass) return;
    setIsSubmitting(true);
    onSubmit(formData);
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
            <span className="text-sm text-gray-500">รหัสแบบฟอร์ม ITD-2025-THP002</span>
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
                    disabled={isSubmitting || hasNotPass || isSavingDraft}
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Submitting...' : "Submit for Review"}
                </button>
                </>
            )}
        </div>
    </div>
  );

  let rowIndex = 0;

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
            isReviewMode={isReviewMode}
            onApprove={onApprove}
            onReject={onReject}
            reviewComment={reviewComment}
            onReviewCommentChange={onReviewCommentChange}
            reviewerNotes={reviewerNotes}
        >
          <FormField label="ชื่อบริษัทผู้ให้บริการ">
            <TextInput name="thirdPartyName" value={formData.thirdPartyName} onChange={handleChange} placeholder="กรอกชื่อบริษัทหรือบุคคลภายนอก" required />
          </FormField>
          <FormField label="วันที่ประเมิน">
            <TextInput name="assessmentDate" type="date" value={formData.assessmentDate} onChange={handleChange} required />
          </FormField>
          <FormField label="อ้างอิงตาม TOR / RFP จากโครงการ">
            <TextArea name="torRfpReference" value={formData.torRfpReference} onChange={handleChange} placeholder="ระบุรายละเอียดตาม TOR/RFP" required />
          </FormField>

          <div className="mt-8 pt-6 border-t-2 border-gray-100">
            <h3 className="text-xl font-bold text-black mb-4">รายละเอียดการประเมิน</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300 text-sm text-black table-fixed">
                    <thead className="bg-gray-100 text-center font-semibold">
                        <tr>
                            <th className="border border-gray-300 p-2 w-[4%]">No.</th>
                            <th className="border border-gray-300 p-2 w-[31%]">ประเมินข้อกำหนดมาตรการรักษาความปลอดภัยด้าน IT</th>
                            <th className="border border-gray-300 p-2 w-[12%]">ผลการพิจารณา</th>
                            <th className="border border-gray-300 p-2 w-[20%]">โปรดระบุลักษณะความเสี่ยงและมาตรการควบคุม</th>
                            <th className="border border-gray-300 p-2 w-[13%]">เอกสารอ้างอิง</th>
                            <th className="border border-gray-300 p-2 w-[20%]">ให้ความเห็น (ผู้สอบทาน)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {definition.topics.map((mainTopic) => (
                            <React.Fragment key={mainTopic.no}>
                                {mainTopic.subTopics && mainTopic.subTopics.length > 0 ? (
                                    <>
                                        <tr className="bg-gray-200 font-bold">
                                            <td className="border border-gray-300 p-2 text-center align-top">{mainTopic.no}</td>
                                            <td colSpan={5} className="border border-gray-300 p-2 align-top">{mainTopic.topic}</td>
                                        </tr>
                                        {mainTopic.subTopics.map((subTopic) => {
                                            const currentIndex = rowIndex++;
                                            const result = formData.assessmentRows[currentIndex]?.result;
                                            return (
                                                <tr key={subTopic.no}>
                                                    <td className="border border-gray-300 p-2 text-right align-top">{subTopic.no}</td>
                                                    <td className="border border-gray-300 p-2 pl-8 align-top">{subTopic.topic}</td>
                                                    <td className="border border-gray-300 p-2 align-top">
                                                        <select 
                                                            value={result || 'ระบุ--'} 
                                                            onChange={e => handleRowChange(currentIndex, 'result', e.target.value)}
                                                            disabled={isReadOnly}
                                                            className={`w-full p-1 border border-gray-300 rounded bg-white text-black disabled:bg-gray-100 ${
                                                                result === 'Not Pass' ? 'bg-red-600 text-white' : 
                                                                result === 'Partially Pass' ? 'bg-yellow-300 text-black' :
                                                                result === 'Not Applicable' ? 'bg-gray-200 text-black' : ''
                                                            }`}
                                                        >
                                                            <option>ระบุ--</option>
                                                            <option>Pass</option>
                                                            <option>Partially Pass</option>
                                                            <option>Not Pass</option>
                                                            <option>Not Applicable</option>
                                                        </select>
                                                    </td>
                                                    <td className="border border-gray-300 p-2 align-top">
                                                        <TextArea rows={3} value={formData.assessmentRows[currentIndex]?.reason || ''} onChange={e => handleRowChange(currentIndex, 'reason', e.target.value)} disabled={isReadOnly} />
                                                    </td>
                                                    <td className="border border-gray-300 p-2 align-top text-center">
                                                        {isReadOnly ? (
                                                            <span className="text-xs break-all">{formData.assessmentRows[currentIndex]?.reference || '-'}</span>
                                                        ) : (
                                                            <div>
                                                                {formData.assessmentRows[currentIndex]?.reference ? (
                                                                    <div className="text-xs text-center">
                                                                        <p className="break-all font-medium text-gray-700">{formData.assessmentRows[currentIndex].reference}</p>
                                                                        <button 
                                                                            type="button"
                                                                            onClick={() => handleRowChange(currentIndex, 'reference', '')} 
                                                                            className="text-red-600 hover:underline mt-1 text-xs"
                                                                        >
                                                                            ลบไฟล์
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    <>
                                                                        <label 
                                                                            htmlFor={`file-upload-${currentIndex}`} 
                                                                            className="cursor-pointer bg-gray-100 border-gray-300 text-gray-700 px-2.5 py-1.5 rounded-md text-sm hover:bg-gray-200 text-center inline-flex items-center justify-center gap-1.5"
                                                                        >
                                                                            <PaperclipIcon />
                                                                            <span>แนบไฟล์</span>
                                                                        </label>
                                                                        <input 
                                                                            id={`file-upload-${currentIndex}`} 
                                                                            type="file" 
                                                                            className="hidden" 
                                                                            onChange={e => handleRowChange(currentIndex, 'reference', e.target.files ? e.target.files[0].name : '')}
                                                                        />
                                                                    </>
                                                                )}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="border border-gray-300 p-2 align-top">
                                                        <TextArea rows={3} value={formData.assessmentRows[currentIndex]?.comment || ''} onChange={e => handleRowChange(currentIndex, 'comment', e.target.value)} disabled={isReadOnly} />
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </>
                                ) : (
                                    (() => {
                                        const currentIndex = rowIndex++;
                                        const result = formData.assessmentRows[currentIndex]?.result;
                                        return (
                                            <tr key={mainTopic.no}>
                                                <td className="border border-gray-300 p-2 text-center font-semibold align-top">{mainTopic.no}</td>
                                                <td className="border border-gray-300 p-2 font-semibold align-top">{mainTopic.topic}</td>
                                                <td className="border border-gray-300 p-2 align-top">
                                                    <select 
                                                        value={result || 'ระบุ--'} 
                                                        onChange={e => handleRowChange(currentIndex, 'result', e.target.value)}
                                                        disabled={isReadOnly}
                                                        className={`w-full p-1 border border-gray-300 rounded bg-white text-black disabled:bg-gray-100 ${
                                                            result === 'Not Pass' ? 'bg-red-600 text-white' : 
                                                            result === 'Partially Pass' ? 'bg-yellow-300 text-black' :
                                                            result === 'Not Applicable' ? 'bg-gray-200 text-black' : ''
                                                        }`}
                                                    >
                                                        <option>ระบุ--</option>
                                                        <option>Pass</option>
                                                        <option>Partially Pass</option>
                                                        <option>Not Pass</option>
                                                        <option>Not Applicable</option>
                                                    </select>
                                                </td>
                                                <td className="border border-gray-300 p-2 align-top">
                                                    <TextArea rows={3} value={formData.assessmentRows[currentIndex]?.reason || ''} onChange={e => handleRowChange(currentIndex, 'reason', e.target.value)} disabled={isReadOnly} />
                                                </td>
                                                <td className="border border-gray-300 p-2 align-top text-center">
                                                    {isReadOnly ? (
                                                        <span className="text-xs break-all">{formData.assessmentRows[currentIndex]?.reference || '-'}</span>
                                                    ) : (
                                                        <div>
                                                            {formData.assessmentRows[currentIndex]?.reference ? (
                                                                <div className="text-xs text-center">
                                                                    <p className="break-all font-medium text-gray-700">{formData.assessmentRows[currentIndex].reference}</p>
                                                                    <button 
                                                                        type="button"
                                                                        onClick={() => handleRowChange(currentIndex, 'reference', '')} 
                                                                        className="text-red-600 hover:underline mt-1 text-xs"
                                                                    >
                                                                        ลบไฟล์
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <label 
                                                                        htmlFor={`file-upload-${currentIndex}`} 
                                                                        className="cursor-pointer bg-gray-100 border-gray-300 text-gray-700 px-2.5 py-1.5 rounded-md text-sm hover:bg-gray-200 text-center inline-flex items-center justify-center gap-1.5"
                                                                    >
                                                                        <PaperclipIcon />
                                                                        <span>แนบไฟล์</span>
                                                                    </label>
                                                                    <input 
                                                                        id={`file-upload-${currentIndex}`} 
                                                                        type="file" 
                                                                        className="hidden" 
                                                                        onChange={e => handleRowChange(currentIndex, 'reference', e.target.files ? e.target.files[0].name : '')}
                                                                    />
                                                                </>
                                                            )}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="border border-gray-300 p-2 align-top">
                                                    <TextArea rows={3} value={formData.assessmentRows[currentIndex]?.comment || ''} onChange={e => handleRowChange(currentIndex, 'comment', e.target.value)} disabled={isReadOnly} />
                                                </td>
                                            </tr>
                                        );
                                    })()
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
          </div>

          <div className="mt-8 border-t pt-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-black">สรุปความเห็นของผู้ประเมิน</h3>
                    <div className={`text-lg font-bold p-2 rounded-md ${
                        evaluationResult.status === 'fail' ? 'bg-red-100 text-red-700' :
                        evaluationResult.status === 'pass' ? 'bg-green-100 text-green-700' :
                        'bg-blue-100 text-black'
                    }`}>
                      ผลประเมิน: <span className={
                        evaluationResult.status === 'fail' ? 'text-red-700' :
                        evaluationResult.status === 'pass' ? 'text-green-700' :
                        'text-blue-700'
                      }>{evaluationResult.text}</span>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="flex items-start">
                        <input 
                            type="radio" 
                            id="sufficient" 
                            name="summaryStatus" 
                            checked={formData.summaryStatus === 'sufficient'}
                            onChange={() => handleSummaryChange('summaryStatus', 'sufficient')}
                            disabled={isReadOnly}
                            className="mt-1"
                        />
                        <div className="ml-3 flex-1">
                            <label htmlFor="sufficient" className="font-medium text-black">มีข้อกำหนดเป็นไปตามมาตรการรักษาความปลอดภัยด้าน IT</label>
                            <TextArea 
                                placeholder="เหตุผล" 
                                rows={2} 
                                value={formData.sufficientReason}
                                onChange={(e) => handleSummaryChange('sufficientReason', e.target.value)}
                                disabled={isReadOnly || formData.summaryStatus !== 'sufficient'}
                                className="mt-1" 
                            />
                        </div>
                    </div>
                        <div className="flex items-start">
                        <input 
                            type="radio" 
                            id="insufficient" 
                            name="summaryStatus"
                            checked={formData.summaryStatus === 'insufficient'}
                            onChange={() => handleSummaryChange('summaryStatus', 'insufficient')}
                            disabled={isReadOnly}
                            className="mt-1"
                        />
                        <div className="ml-3 flex-1">
                            <label htmlFor="insufficient" className="font-medium text-black">ไม่เป็นไปตามมาตรการรักษาความปลอดภัยด้าน IT</label>
                            <TextArea 
                                placeholder="เหตุผล" 
                                rows={2} 
                                value={formData.insufficientReason}
                                onChange={(e) => handleSummaryChange('insufficientReason', e.target.value)}
                                disabled={isReadOnly || formData.summaryStatus !== 'insufficient'}
                                className="mt-1" 
                            />
                        </div>
                    </div>
                </div>
            </div>

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
      <SecurityMeasuresPrintView data={formData} definition={definition} />
    </>
  );
};

export default SecurityMeasuresForm;
