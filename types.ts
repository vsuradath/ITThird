export type FormKey = 
  | 'serviceApproval'
  | 'capability'
  | 'security'
  | 'registration'
  | 'risk'
  | 'contract'
  | 'monitoring'
  | 'termination'
  | 'evaluation'
  | 'dataProtection';

export interface FormItem {
  key: FormKey;
  label: string;
}

export type UserRole = 'assessor' | 'reviewer' | 'admin';

export interface User {
  id: number;
  name: string;
  role: UserRole;
  username: string;
  department: string;
  password?: string;
  registrationDate?: string; // YYYY-MM-DD
  signatureImage?: string; // base64 encoded image
}

export type FormStatus = 'Not Started' | 'Pending Review' | 'Approved' | 'Rejected' | 'Draft' | 'Completed';

export interface FormSubmission {
  id: string; // Composite key: `${projectId}_${formKey}`
  projectId: string;
  formKey: FormKey;
  status: FormStatus;
  data: Record<string, any>;
  submittedBy?: string; // Assessor's name
  reviewedBy?: string; // Reviewer's name
  submittedAt?: Date;
  reviewedAt?: Date;
  comments?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdBy: string; // Admin's name
  createdAt: Date;
  status: 'In Progress' | 'Completed';
  assessorId: number;
  reviewerId: number;
  assessorName: string;
  reviewerName: string;
  assessorDepartment: string;
  reviewerDepartment: string;
}

export interface SatisfactionSurveySubmission {
  id: string;
  projectId: string;
  projectName: string;
  thirdPartyName: string;
  submittedByName: string; // Optional submitter's name
  submittedAt: Date;
  overallSatisfaction: number;
  communication: number;
  responsiveness: number;
  qualityOfService: number;
  comments: string;
}

export interface DetailedAssessmentRow {
  result: 'ระบุ--' | 'Pass' | 'Pass with condition' | 'Not Pass' | 'Not Applicable' | 'Partially Pass';
  reason: string;
  reference: string;
  comment: string;
}

export interface DetailedCapabilityAssessmentData {
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

export type Page = 'dashboard' | 'project' | 'admin' | 'submitSurvey' | 'satisfactionDashboard' | 'myProjects' | 'dataDefinition' | 'overallDocuments' | 'serviceApproval'
  // New pages for Admin Menu
  | 'policiesAndRegulations'
  | 'manualsAndDocuments'
  | 'itThirdPartyRegister'
  | 'fourthPartyRegister'
  | 'dataSetRegister'
  | 'fourthPartyFormSet'
  | 'dataSetFormSet';


// FIX: Add SearchResult interface to resolve import error in GlobalSearchPage.tsx.
export interface SearchResult {
  project: Project;
  matchContext: string;
  matchedValue: string;
}


// New types for dynamic forms
export type InputType = 'text' | 'textarea' | 'date' | 'checkbox' | 'select' | 'number';

export interface SubTopic {
  no: string;
  topic: string; // This is the label
  details?: string; // This is help text or description
  fieldKey?: string; // e.g., 'companyName'
  inputType?: InputType;
  options?: string[];
  required?: boolean;
}

export interface Topic {
  no: string;
  topic: string; // The section header, or field label if no subtopics
  details?: string;
  subTopics?: SubTopic[];
  fieldKey?: string; // Only if this topic represents a single field
  inputType?: InputType;
  options?: string[];
  required?: boolean;
}

export interface FormDefinition {
  key: FormKey;
  label: string;
  topics: Topic[];
  isEditable?: boolean;
  hasSignatures?: boolean;
  isStructureLocked?: boolean;
}

export type FormDefinitions = {
  [key in FormKey]?: FormDefinition;
};