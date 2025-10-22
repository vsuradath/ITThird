import React, { useState, useMemo } from 'react';
import FormContainer, { FormField, TextInput, TextArea } from '../FormContainer';
import RegistrationPrintView from './print/RegistrationPrintView';
import { FormDefinition } from '../../types';

const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);


interface SubContract {
  name: string;
  scope: string;
}

export interface RegistrationFormData {
  // header
  thirdPartyName: string;
  assessmentDate: string;
  registerDate: string;

  // Part 1
  businessUnit: string;
  department: string;
  thirdPartyOwner: string;
  representative: string;
  
  purpose: string;
  
  thirdPartyUniqueId: string;
  thirdPartyUniqueIdType: string;
  thThirdPartyName: string;
  engThirdPartyName: string;
  relationship: string;
  registeredCountry: string;
  thirdPartyType: string;
  workType: string;
  integrationType: string;
  cloudType: string;
  contractStartDate: string;
  contractEndDate: string;
  
  scopeOfWork: string;
  
  serviceRiskLevel: string;
  serviceSLA: string;
  dataCenterCountry: string;
  
  infraScope: string;
  osMiddlewareScope: string;
  appDbScope: string;
  securityScope: string;
  otherScope: string;
  
  subContracts: SubContract[];
  
  // Part 2
  dataAccessCustomerLevel: string;
  dataAccessCompanyLevel: string;
  cloudOnExistingProvider: string;
  cloudServiceType: string;
  impactsCriticalSystem: string;
  impactsCriticalService: string;
  valueOver10M: string;
  
  // signatures
  assessorSignature?: { name: string; position: string; department: string; date: string; };
  reviewerSignature?: { name: string; position: string; department: string; date: string; };
}

// Options for the new select dropdowns
const thirdPartyIdTypeOptions = [
    "324001 Personal Id", "324002 Passport Number", "324003 Tax Id", "324004 Juristic Id", "324005 BOT Assigned Code",
    "324013 Other Juristic Reference Id", "324014 FI Assigned Code", "324006 Government Organization Id", "324007 FI Code",
    "324009 Oversea Individual Id", "324010 Oversea Juristic Id", "324011 International Organization and Oversea Government Id", "324012 Others"
];
const relationshipOptions = ["Consolidated Company", "Non-Consolidated Company"];
const thirdPartyTypeOptions = [
    "Critical IT Outsourcing - Infrastructure", "Critical IT Outsourcing - Service Channel", "Critical IT Outsourcing - Processing System",
    "Critical IT Outsourcing - Middle and Back office support system", "Other IT Outsourcing - Infrastructure", "Other IT Outsourcing - Service Channel",
    "Other IT Outsourcing - Processing System", "Other IT Outsourcing - Middle and Back office support system", "Partnership - Payment",
    "Partnership - Non-Payment", "Switching", "ISP"
];
const workTypeOptions = ["Production Support", "Non-Production Support", "Administration Support", "Others"];
const integrationTypeOptions = ["Direct Connection", "API", "No Connection", "Others"];
const cloudTypeOptions = ["IaaS", "PaaS", "SaaS", "IaaS; PaaS", "IaaS; SaaS", "PaaS; SaaS", "IaaS; PaaS; SaaS", "Non-cloud"];
const serviceRiskLevelOptions = ["Low", "Medium", "High", "Not Applicable"];
const serviceSLAOptions = ["Pass", "Not Pass", "Not Applicable"];

const dataAccessLevelOptions = ["General data", "Personal data", "Sensitive data", "Confidential data"];
const cloudProviderStatusOptions = ["Non-Cloud", "Cloud - ธนาคารใช้งานอยู่แล้ว (AWS,AZURE)", "Cloud - ธนาคารที่ไม่เคยใช้งาน (Amazon RDS, Google App Engine,Huawei,Oracle,Other)"];
const cloudServiceTypeOptions = ["ผู้ให้บริการ Cloud Provider รายใหม่ แบบ Private Cloud", "ผู้ให้บริการ Cloud Provider รายใหม่ แบบ Public Cloud", "ผู้ให้บริการ Cloud Provider รายใหม่ แบบ Hybrid Cloud", "ผู้ให้บริการ Cloud Provider รายเดิมที่ธนาคารใช้บริการอยู่แล้ว", "ไม่เกี่ยวข้อง"];
const criticalSystemImpactOptions = [
    "ระบบ Core banking system ที่มีนัยสำคัญ", "ระบบ Mobile banking ที่มีนัยสำคัญ", "ระบบ Swift", "ระบบ Teller system ที่มีนัยสำคัญ",
    "ระบบตัวกลางการโอน / ชำระเงิน", "ระบบสาขาอิเล็กทรอนิกส์ หรือช่องทางดิจิทัล", "ใช้เทคโนโลยี Biometric", "ใช้เทคโนโลยี AI, Machine Learning, Blockchain, BigData",
    "โครงสร้างพื้นฐานด้าน Networking ที่กระทบเป็นวงกว้าง", "โครงสร้างพื้นฐานด้าน Data Center (DC, DR) ที่กระทบเป็นวงกว้าง", "ต้องเข้า Regulatory Sandbox", "ไม่เกี่ยวข้อง"
];
const criticalServiceImpactOptions = [
    "ATM, Card less", "ORFT via ATM, ORFT via Counter", "เงินโอนระหว่างประเทศ", "บริการฝาก – ถอนเงิน (via Branch, ATM or Mobile banking)",
    "ระบบการหักบัญชีเช็คด้วยภาพเช็ค และระบบการจัดเก็บภาพเช็ค (ICS)", "ระบบบาทเนต (BAHTNET)", "ระบบพร้อมเพย์ (PromptPay)", "ไม่เกี่ยวข้อง"
];
const valueOver10MOptions = ["Yes", "No"];


interface Props {
  onSubmit: (data: RegistrationFormData) => void;
  onSaveDraft: (data: RegistrationFormData) => void;
  definition?: FormDefinition;
  initialData?: Partial<RegistrationFormData>;
  isReadOnly?: boolean;
  isReviewMode?: boolean;
  onApprove?: () => void;
  onReject?: () => void;
  reviewComment?: string;
  onReviewCommentChange?: (value: string) => void;
  reviewerNotes?: string;
}

const RegistrationForm: React.FC<Props> = ({ 
    onSubmit, 
    onSaveDraft, 
    definition,
    initialData, 
    isReadOnly,
    ...reviewProps
}) => {
  const [formData, setFormData] = useState<RegistrationFormData>({
    thirdPartyName: initialData?.thirdPartyName || '',
    assessmentDate: initialData?.assessmentDate || new Date().toISOString().split('T')[0],
    registerDate: initialData?.registerDate || new Date().toISOString().split('T')[0],
    businessUnit: '',
    department: '',
    thirdPartyOwner: '',
    representative: '',
    purpose: '',
    thirdPartyUniqueId: '',
    thirdPartyUniqueIdType: '',
    thThirdPartyName: '',
    engThirdPartyName: '',
    relationship: '',
    registeredCountry: '',
    thirdPartyType: '',
    workType: '',
    integrationType: '',
    cloudType: '',
    contractStartDate: '',
    contractEndDate: '',
    scopeOfWork: '',
    serviceRiskLevel: '',
    serviceSLA: '',
    dataCenterCountry: '',
    infraScope: '',
    osMiddlewareScope: '',
    appDbScope: '',
    securityScope: '',
    otherScope: '',
    dataAccessCustomerLevel: '',
    dataAccessCompanyLevel: '',
    cloudOnExistingProvider: '',
    cloudServiceType: '',
    impactsCriticalSystem: '',
    impactsCriticalService: '',
    valueOver10M: '',
    ...initialData,
    // FIX: Removed duplicate `subContracts` property from the initializer object.
    // The property was defined once before `...initialData` and once after, causing a compilation error.
    subContracts: initialData?.subContracts && initialData.subContracts.length > 0 ? initialData.subContracts : [{ name: '', scope: '' }],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  
  const isFormComplete = useMemo(() => {
    return formData.thirdPartyName && formData.assessmentDate && formData.thThirdPartyName;
  }, [formData]);

  const getLabel = useMemo(() => (key: string, fallback: string) => {
    if (!definition) return fallback;
    for (const topic of definition.topics) {
        if (topic.no === key) return topic.topic;
        if (topic.subTopics) {
            for (const sub of topic.subTopics) {
                if (sub.no === key) return sub.topic;
            }
        }
    }
    return fallback;
  }, [definition]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubContractChange = (index: number, field: keyof SubContract, value: string) => {
    const newSubContracts = [...formData.subContracts];
    newSubContracts[index][field] = value;
    setFormData(prev => ({ ...prev, subContracts: newSubContracts }));
  };

  const addSubContractRow = () => {
    setFormData(prev => ({
      ...prev,
      subContracts: [...prev.subContracts, { name: '', scope: '' }]
    }));
  };

  const removeSubContractRow = (index: number) => {
    if (formData.subContracts.length <= 1) return;
    const newSubContracts = formData.subContracts.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, subContracts: newSubContracts }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;
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

  // FIX: Provide a default object for the signature to ensure type correctness when updating.
  const handleSignatureChange = (signer: 'assessorSignature', field: string, value: string) => {
    setFormData(prev => ({
        ...prev,
        [signer]: {
            ...(prev[signer] || { name: '', position: '', department: '', date: '' }),
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

  const selectClassName = "mt-1 block w-full px-3 py-1.5 bg-white border border-gray-300 rounded-md shadow-sm text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100";

  return (
    <>
      <div className="print:hidden">
        <FormContainer 
            title={definition?.label || '03. แบบฟอร์มการลงทะเบียนการใช้บริการบุคคลภายนอก (3rd Party Registration)'}
            onSubmit={handleSubmit} 
            isReadOnly={isReadOnly}
            showFileUpload={true}
            footer={formFooter}
            draftSaved={draftSaved}
            {...reviewProps}
        >
            <FormField label={getLabel('header_thirdPartyName', 'ชื่อบริษัทผู้ให้บริการ (Third Party Name)')}>
                <TextInput name="thirdPartyName" value={formData.thirdPartyName} onChange={handleChange} placeholder="กรอกชื่อบริษัทหรือบุคคลภายนอก" required />
            </FormField>
            <FormField label={getLabel('header_assessmentDate', 'วันที่ประเมิน (Assessment Date)')}>
                <TextInput name="assessmentDate" type="date" value={formData.assessmentDate} onChange={handleChange} required />
            </FormField>
            
            <div className="mt-8 pt-6 border-t-2 border-gray-100 bg-green-50/50 p-3 -m-3 rounded-lg">
                <h3 className="text-lg font-bold text-black mb-4 bg-green-200 px-3 py-1 rounded-md inline-block">{getLabel('p1_header', 'ส่วนที่ 1 : รายละเอียดทะเบียน 3rd Party')}</h3>
                
                <div className="space-y-4">
                    <div className="p-3 border rounded-md bg-white">
                        <h4 className="font-semibold text-black mb-3">{getLabel('p1_s1', '1. ฝ่ายงานที่ขอประเมิน')}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField label={getLabel('p1_s1_f1', 'วันที่ลงทะเบียน (Register Date)')}><TextInput name="registerDate" type="date" value={formData.registerDate} onChange={handleChange}/></FormField>
                            <FormField label={getLabel('p1_s1_f2', 'สายงาน (Business Unit)')}><TextInput name="businessUnit" value={formData.businessUnit} onChange={handleChange}/></FormField>
                            <FormField label={getLabel('p1_s1_f3', 'ฝ่าย/แผนก (Department)')}><TextInput name="department" value={formData.department} onChange={handleChange}/></FormField>
                            <FormField label={getLabel('p1_s1_f4', 'ผู้รับผิดชอบ (3rd Party Owner)')}><TextInput name="thirdPartyOwner" value={formData.thirdPartyOwner} onChange={handleChange}/></FormField>
                            <FormField label={getLabel('p1_s1_f5', 'ผู้ประสานงาน (Representative)')}><TextInput name="representative" value={formData.representative} onChange={handleChange}/></FormField>
                        </div>
                    </div>
                    <div className="p-3 border rounded-md bg-white">
                        <h4 className="font-semibold text-black mb-3">{getLabel('p1_s2', '2. วัตถุประสงค์การประเมิน')}</h4>
                        <FormField label={getLabel('p1_s2_f1', 'วัตถุประสงค์ (Purpose)')}>
                            <select
                                name="purpose"
                                value={formData.purpose}
                                onChange={handleChange}
                                className={selectClassName}
                                disabled={isReadOnly}
                                required
                            >
                                <option value="">----------- ระบุ -----------</option>
                                <option value="การจัดจ้างขอใช้บริการครั้งแรก">การจัดจ้างขอใช้บริการครั้งแรก</option>
                                <option value="มีการเพิ่มเติม/เปลี่ยนแปลงขอบเขตงานที่ให้บริการที่มีนัยสำคัญ">มีการเพิ่มเติม/เปลี่ยนแปลงขอบเขตงานที่ให้บริการที่มีนัยสำคัญ</option>
                                <option value="การต่อสัญญา และทบทวนประจำปี - มีการเปลี่ยนแปลงขอบเขตงานที่ให้บริการ">การต่อสัญญา และทบทวนประจำปี - มีการเปลี่ยนแปลงขอบเขตงานที่ให้บริการ</option>
                                <option value="การต่อสัญญา และการทบทวนประจำปี - ไม่มีการเปลี่ยนแปลงขอบเขตงานที่ให้บริการ">การต่อสัญญา และการทบทวนประจำปี - ไม่มีการเปลี่ยนแปลงขอบเขตงานที่ให้บริการ</option>
                            </select>
                        </FormField>
                    </div>

                    <div className="p-3 border rounded-md bg-white">
                        <h4 className="font-semibold text-black mb-3">{getLabel('p1_s3', '3. รายละเอียดบุคคลภายนอก')}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField label={getLabel('p1_s3_f1', 'รหัสบุคคลภายนอก (Third Party Unique Id)')}><TextInput name="thirdPartyUniqueId" value={formData.thirdPartyUniqueId} onChange={handleChange}/></FormField>
                            <FormField label={getLabel('p1_s3_f2', 'ประเภทรหัสบุคคลภายนอก (Third Party Unique Id Type)')}>
                                <select name="thirdPartyUniqueIdType" value={formData.thirdPartyUniqueIdType} onChange={handleChange} className={selectClassName} disabled={isReadOnly}>
                                    <option value="">----------- ระบุ -----------</option>
                                    {thirdPartyIdTypeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            </FormField>
                            <FormField label={getLabel('p1_s3_f3', 'ชื่อบุคคลภายนอก (ภาษาไทย)')}><TextInput name="thThirdPartyName" value={formData.thThirdPartyName} onChange={handleChange} required/></FormField>
                            <FormField label={getLabel('p1_s3_f4', 'ชื่อบุคคลภายนอก (English)')}><TextInput name="engThirdPartyName" value={formData.engThirdPartyName} onChange={handleChange}/></FormField>
                            <FormField label={getLabel('p1_s3_f5', 'ความสัมพันธ์ (Relationship)')}>
                                <select name="relationship" value={formData.relationship} onChange={handleChange} className={selectClassName} disabled={isReadOnly}>
                                    <option value="">----------- ระบุ -----------</option>
                                    {relationshipOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            </FormField>
                            <FormField label={getLabel('p1_s3_f6', 'ประเทศที่จดทะเบียน (Registered Country)')}><TextInput name="registeredCountry" value={formData.registeredCountry} onChange={handleChange}/></FormField>
                            <FormField label={getLabel('p1_s3_f7', 'Third Party Type')}>
                                <select name="thirdPartyType" value={formData.thirdPartyType} onChange={handleChange} className={selectClassName} disabled={isReadOnly}>
                                    <option value="">----------- ระบุ -----------</option>
                                    {thirdPartyTypeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            </FormField>
                            <FormField label={getLabel('p1_s3_f8', 'Work Type')}>
                                <select name="workType" value={formData.workType} onChange={handleChange} className={selectClassName} disabled={isReadOnly}>
                                    <option value="">----------- ระบุ -----------</option>
                                    {workTypeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            </FormField>
                            <FormField label={getLabel('p1_s3_f9', 'ประเภทการเชื่อมต่อ (Integration Type)')}>
                                <select name="integrationType" value={formData.integrationType} onChange={handleChange} className={selectClassName} disabled={isReadOnly}>
                                    <option value="">----------- ระบุ -----------</option>
                                    {integrationTypeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            </FormField>
                            <FormField label={getLabel('p1_s3_f10', 'Cloud Type')}>
                                <select name="cloudType" value={formData.cloudType} onChange={handleChange} className={selectClassName} disabled={isReadOnly}>
                                    <option value="">----------- ระบุ -----------</option>
                                    {cloudTypeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            </FormField>
                            <FormField label={getLabel('p1_s3_f11', 'วันเริ่มต้นสัญญา (Contract Start Date)')}><TextInput name="contractStartDate" type="date" value={formData.contractStartDate} onChange={handleChange}/></FormField>
                            <FormField label={getLabel('p1_s3_f12', 'วันสิ้นสุดสัญญา (Contract End Date)')}><TextInput name="contractEndDate" type="date" value={formData.contractEndDate} onChange={handleChange}/></FormField>
                            <div className="md:col-span-2"><FormField label={getLabel('p1_s3_f13', 'ขอบเขตงานที่ให้บริการ โดยสรุป (Scope of work)')}><TextArea name="scopeOfWork" value={formData.scopeOfWork} onChange={handleChange}/></FormField></div>
                            <FormField label={getLabel('p1_s3_f14', 'Service Risk Level')}>
                                <select name="serviceRiskLevel" value={formData.serviceRiskLevel} onChange={handleChange} className={selectClassName} disabled={isReadOnly}>
                                    <option value="">----------- ระบุ -----------</option>
                                    {serviceRiskLevelOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            </FormField>
                            <FormField label={getLabel('p1_s3_f15', 'Service SLA')}>
                                <select name="serviceSLA" value={formData.serviceSLA} onChange={handleChange} className={selectClassName} disabled={isReadOnly}>
                                    <option value="">----------- ระบุ -----------</option>
                                    {serviceSLAOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            </FormField>
                            <FormField label={getLabel('p1_s3_f16', 'Data Center Country')}><TextInput name="dataCenterCountry" value={formData.dataCenterCountry} onChange={handleChange}/></FormField>
                        </div>
                    </div>
                    
                    <div className="p-3 border rounded-md bg-white">
                        <h4 className="font-semibold text-black mb-3">{getLabel('p1_s4', '4. ขอบเขตงานที่ให้บริการ')}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField label={getLabel('p1_s4_f1', 'โครงสร้างพื้นฐาน (Server & Network Infrastructure)')}><TextArea name="infraScope" value={formData.infraScope} onChange={handleChange}/></FormField>
                            <FormField label={getLabel('p1_s4_f2', 'O/S, Middle ware')}><TextArea name="osMiddlewareScope" value={formData.osMiddlewareScope} onChange={handleChange}/></FormField>
                            <FormField label={getLabel('p1_s4_f3', 'ระบบงาน / ระบบฐานข้อมูล')}><TextArea name="appDbScope" value={formData.appDbScope} onChange={handleChange}/></FormField>
                            <FormField label={getLabel('p1_s4_f4', 'การรักษาความปลอดภัย')}><TextArea name="securityScope" value={formData.securityScope} onChange={handleChange}/></FormField>
                            <FormField label={getLabel('p1_s4_f5', 'อื่นๆ')}><TextArea name="otherScope" value={formData.otherScope} onChange={handleChange}/></FormField>
                        </div>
                    </div>
                    
                    <div className="p-3 border rounded-md bg-white">
                        <h4 className="font-semibold text-black mb-3">{getLabel('p1_s5', '5. Sub contract & 4th Party')}</h4>
                        <table className="w-full text-sm">
                            <thead className="bg-gray-100 text-black">
                                <tr>
                                    <th className="p-2 text-left font-medium border">{getLabel('p1_s5_th1', 'ชื่อบุคคลภายนอก')}</th>
                                    <th className="p-2 text-left font-medium border">{getLabel('p1_s5_th2', 'ขอบเขตงาน')}</th>
                                    <th className="p-2 border w-12"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {formData.subContracts.map((sub, index) => (
                                    <tr key={index}>
                                        <td className="p-1 border"><TextInput value={sub.name} onChange={(e) => handleSubContractChange(index, 'name', e.target.value)} disabled={isReadOnly} /></td>
                                        <td className="p-1 border"><TextInput value={sub.scope} onChange={(e) => handleSubContractChange(index, 'scope', e.target.value)} disabled={isReadOnly} /></td>
                                        <td className="p-1 border text-center">
                                            {!isReadOnly && <button type="button" onClick={() => removeSubContractRow(index)} disabled={formData.subContracts.length <= 1} className="text-red-500 disabled:text-gray-300"><TrashIcon className="w-4 h-4" /></button>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {!isReadOnly && <button type="button" onClick={addSubContractRow} className="mt-2 text-sm text-blue-600 hover:underline">{getLabel('p1_s5_add_btn', '+ Add Row')}</button>}
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t-2 border-gray-100 bg-yellow-50/50 p-3 -m-3 rounded-lg">
                <h3 className="text-lg font-bold text-black mb-4 bg-yellow-200 px-3 py-1 rounded-md inline-block">{getLabel('p2_header', 'ส่วนที่ 2 : การประเมินผู้ให้บริการ Third Party ที่มีนัยสำคัญ')}</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                        <thead className="bg-yellow-100 text-black">
                            <tr>
                                <th className="p-2 text-left font-medium border-b-2 border-yellow-300 w-3/5">{getLabel('p2_th1', 'การพิจารณาความมีนัยสำคัญ')}</th>
                                <th className="p-2 text-left font-medium border-b-2 border-yellow-300 w-2/5">{getLabel('p2_th2', 'ผลการพิจารณา')}</th>
                            </tr>
                        </thead>
                        <tbody className="text-black">
                            <tr className="bg-gray-100"><td colSpan={2} className="p-1 font-semibold text-black">{getLabel('p2_s1_header', '1) Data Access')}</td></tr>
                            <tr>
                                <td className="p-2 border-b">{getLabel('p2_s1_f1', '1.1 บุคคลภายนอกมีการเข้าถึงข้อมูลของลูกค้าในระดับใด')}</td>
                                <td className="p-2 border-b">
                                    <select name="dataAccessCustomerLevel" value={formData.dataAccessCustomerLevel} onChange={handleChange} className={selectClassName} disabled={isReadOnly}>
                                        <option value="">--- ระบุ ---</option>
                                        {dataAccessLevelOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td className="p-2 border-b">{getLabel('p2_s1_f2', '1.2 บุคคลภายนอกมีการเข้าถึงข้อมูลของบริษัทในระดับใด')}</td>
                                <td className="p-2 border-b">
                                    <select name="dataAccessCompanyLevel" value={formData.dataAccessCompanyLevel} onChange={handleChange} className={selectClassName} disabled={isReadOnly}>
                                        <option value="">--- ระบุ ---</option>
                                        {dataAccessLevelOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                </td>
                            </tr>
                            <tr className="bg-gray-100"><td colSpan={2} className="p-1 font-semibold text-black">{getLabel('p2_s2_header', '2) Cloud Computing')}</td></tr>
                            <tr>
                                <td className="p-2 border-b">{getLabel('p2_s2_f1', '2.1 ระบบงาน/บริการ อยู่บน Cloud Provide ที่ธนาคารมีอยู่แล้ว')}</td>
                                <td className="p-2 border-b">
                                    <select name="cloudOnExistingProvider" value={formData.cloudOnExistingProvider} onChange={handleChange} className={selectClassName} disabled={isReadOnly}>
                                        <option value="">--- ระบุ ---</option>
                                        {cloudProviderStatusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td className="p-2 border-b">{getLabel('p2_s2_f2', '2.2 ประเภทการให้บริการ Cloud')}</td>
                                <td className="p-2 border-b">
                                    <select name="cloudServiceType" value={formData.cloudServiceType} onChange={handleChange} className={selectClassName} disabled={isReadOnly}>
                                        <option value="">--- ระบุ ---</option>
                                        {cloudServiceTypeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                </td>
                            </tr>
                            <tr className="bg-gray-100"><td colSpan={2} className="p-1 font-semibold text-black">{getLabel('p2_s3_header', '3) เกี่ยวข้องกับระบบงาน หรือบริการที่สำคัญ')}</td></tr>
                            <tr>
                                <td className="p-2 border-b">{getLabel('p2_s3_f1', '3.1 ขอบเขตการให้บริการ เกี่ยวข้องหรือกระทบกับระบบงานที่สำคัญ')}</td>
                                <td className="p-2 border-b">
                                    <select name="impactsCriticalSystem" value={formData.impactsCriticalSystem} onChange={handleChange} className={selectClassName} disabled={isReadOnly}>
                                        <option value="">--- ระบุ ---</option>
                                        {criticalSystemImpactOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td className="p-2 border-b">{getLabel('p2_s3_f2', '3.2 ขอบเขตการให้บริการ เกี่ยวข้องหรือกระทบกับบริการที่สำคัญ')}</td>
                                <td className="p-2 border-b">
                                    <select name="impactsCriticalService" value={formData.impactsCriticalService} onChange={handleChange} className={selectClassName} disabled={isReadOnly}>
                                        <option value="">--- ระบุ ---</option>
                                        {criticalServiceImpactOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                </td>
                            </tr>
                            <tr className="bg-gray-100"><td colSpan={2} className="p-1 font-semibold text-black">{getLabel('p2_s4_header', '4) ขนาด และมูลค่าของโครงการ')}</td></tr>
                            <tr>
                                <td className="p-2 border-b">{getLabel('p2_s4_f1', '4.1 สัญญาโครงการที่มีมูลค่า ตั้งแต่ 10,000,000 บาทขึ้นไป')}</td>
                                <td className="p-2 border-b">
                                     <select name="valueOver10M" value={formData.valueOver10M} onChange={handleChange} className={selectClassName} disabled={isReadOnly}>
                                        <option value="">--- ระบุ ---</option>
                                        {valueOver10MOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>


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
        </FormContainer>
      </div>
      <RegistrationPrintView data={formData} definition={definition} />
    </>
  );
};

export default RegistrationForm;