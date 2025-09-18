import { User, Project, FormSubmission, FormKey, UserRole, SatisfactionSurveySubmission, FormStatus, FormDefinitions, FormDefinition } from '../types';
import { FORMS, CAPABILITY_ASSESSMENT_FORM_TEMPLATE, SECURITY_MEASURES_FORM_TEMPLATE } from '../constants';

// This file simulates a backend API. In a real application, these functions would
// make network requests to a server that connects to a PostgreSQL database.

// --- MOCK DATABASE ---
const getFutureDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
}

let USERS_DB: User[] = [
  { id: 1, name: 'Supanan Ak-karadechawut', role: 'assessor', username: 'Supanan', password: '1234', department: 'IT Operations', registrationDate: '2022-01-10', signatureImage: '' },
  { id: 3, name: 'Doungdow Raksachol', role: 'reviewer', username: 'Doungdow', password: '1234', department: 'IT Compliance', registrationDate: '2021-11-15', signatureImage: '' },
  { id: 5, name: 'Voracahte Suradath', role: 'admin', username: 'admin', password: 'admin', department: 'IT Management', registrationDate: '2020-05-01', signatureImage: '' },
];

let PROJECTS_DB: Project[] = [
    { 
      id: 'proj-001', name: 'New Core Banking System', description: 'Third-party vendor for implementing the new core banking solution.', 
      createdBy: 'Voracahte Suradath', createdAt: new Date('2023-10-01'), status: 'In Progress',
      assessorId: 1, assessorName: 'Supanan Ak-karadechawut', assessorDepartment: 'IT Operations',
      reviewerId: 3, reviewerName: 'Doungdow Raksachol', reviewerDepartment: 'IT Compliance'
    },
    { 
      id: 'proj-002', name: 'New Mobile App Development', description: 'A third-party team will develop the new mobile banking application.', 
      createdBy: 'Voracahte Suradath', createdAt: new Date('2024-01-15'), status: 'In Progress',
      assessorId: 1, assessorName: 'Supanan Ak-karadechawut', assessorDepartment: 'IT Operations',
      reviewerId: 3, reviewerName: 'Doungdow Raksachol', reviewerDepartment: 'IT Compliance'
    },
    { 
      id: 'proj-003', name: 'Cloud Migration Initiative', description: 'Vendor selection for migrating on-premise infrastructure to the cloud.', 
      createdBy: 'Voracahte Suradath', createdAt: new Date('2024-07-20'), status: 'In Progress',
      assessorId: 1, assessorName: 'Supanan Ak-karadechawut', assessorDepartment: 'IT Operations',
      reviewerId: 3, reviewerName: 'Doungdow Raksachol', reviewerDepartment: 'IT Compliance'
    },
    { 
      id: 'proj-004', name: 'Legacy System Decommission', description: 'Vendor for legacy system data archival and hardware disposal.', 
      createdBy: 'Voracahte Suradath', createdAt: new Date('2023-05-01'), status: 'Completed',
      assessorId: 1, assessorName: 'Supanan Ak-karadechawut', assessorDepartment: 'IT Operations',
      reviewerId: 3, reviewerName: 'Doungdow Raksachol', reviewerDepartment: 'IT Compliance'
    },
];

let SUBMISSIONS_DB: FormSubmission[] = [
    // Project 1 Data
    { id: 'proj-001_registration', projectId: 'proj-001', formKey: 'registration', status: 'Approved', data: { companyName: 'Fintech Solutions Ltd.', isFourthParty: false, dataSet: 'Transactional Data' }, submittedBy: 'Supanan Ak-karadechawut', reviewedBy: 'Doungdow Raksachol', submittedAt: new Date(), reviewedAt: new Date() },
    { id: 'proj-001_capability', projectId: 'proj-001', formKey: 'capability', status: 'Pending Review', data: { thirdPartyName: 'Fintech Solutions Ltd.', assessmentDate: '2024-05-10', torRfpReference: 'Refer to TOR document XYZ for project requirements.' }, submittedBy: 'Supanan Ak-karadechawut', submittedAt: new Date() },
    { id: 'proj-001_risk', projectId: 'proj-001', formKey: 'risk', status: 'Approved', data: { riskIdentification: 'Data breach risk', impactLevel: 'High', mitigationPlan: 'Encryption and access controls', customerDataAcess: 'Read/Write', companyDataAcess: 'Read', isOnExistingCloud: true, cloudServiceType: 'SaaS', impactsCriticalSystem: true, projectValue: 15000000 }, reviewedBy: 'Doungdow Raksachol' },
    { id: 'proj-001_contract', projectId: 'proj-001', formKey: 'contract', status: 'Approved', data: { contractId: 'FS-2023-001', endDate: getFutureDate(60) }, reviewedBy: 'Doungdow Raksachol' },

    // Project 2 Data
    { id: 'proj-002_registration', projectId: 'proj-002', formKey: 'registration', status: 'Approved', data: { companyName: 'Mobile Dev Co.', isFourthParty: true, dataSet: 'Customer PII' }, reviewedBy: 'Doungdow Raksachol' },
    { id: 'proj-002_capability', projectId: 'proj-002', formKey: 'capability', status: 'Draft', data: { thirdPartyName: 'Mobile Dev Co.' }, submittedBy: 'Supanan Ak-karadechawut', submittedAt: new Date() },
    { id: 'proj-002_risk', projectId: 'proj-002', formKey: 'risk', status: 'Approved', data: { impactLevel: 'Medium', projectValue: 8000000, customerDataAcess: 'Read' }, reviewedBy: 'Doungdow Raksachol' },
    { id: 'proj-002_contract', projectId: 'proj-002', formKey: 'contract', status: 'Approved', data: { contractId: 'MD-2024-001', endDate: getFutureDate(120) }, reviewedBy: 'Doungdow Raksachol' },

    // Project 3 Data
    { id: 'proj-003_risk', projectId: 'proj-003', formKey: 'risk', status: 'Pending Review', data: { impactLevel: 'High', cloudServiceType: 'IaaS' } },

    // Project 4 Data (Terminated)
    { id: 'proj-004_registration', projectId: 'proj-004', formKey: 'registration', status: 'Approved', data: { companyName: 'Archive Inc.', dataSet: 'Legacy User Data' }, reviewedBy: 'Doungdow Raksachol' },
    { id: 'proj-004_termination', projectId: 'proj-004', formKey: 'termination', status: 'Approved', data: { terminationReason: 'Project Completed' }, reviewedBy: 'Doungdow Raksachol' }

];

let SURVEYS_DB: SatisfactionSurveySubmission[] = [
    {
      id: 'survey-001',
      projectId: 'proj-001',
      projectName: 'New Core Banking System',
      thirdPartyName: 'Fintech Solutions Ltd.',
      submittedByName: 'Internal User A',
      submittedAt: new Date('2024-05-20'),
      overallSatisfaction: 5,
      communication: 4,
      responsiveness: 5,
      qualityOfService: 4,
      comments: 'The team was very professional and delivered a high-quality product on time. Communication was clear and consistent.'
    },
];

let FORM_DEFINITIONS_DB: FormDefinitions = {
  'capability': { key: 'capability', label: FORMS.find(f => f.key === 'capability')?.label || '', topics: CAPABILITY_ASSESSMENT_FORM_TEMPLATE },
  'security': { key: 'security', label: FORMS.find(f => f.key === 'security')?.label || '', topics: SECURITY_MEASURES_FORM_TEMPLATE },
  'registration': {
    key: 'registration', label: FORMS.find(f => f.key === 'registration')?.label || '',
    topics: [
      { no: '1', topic: 'Company Information', subTopics: [
          { no: '1.1', topic: 'Company Name', details: '', fieldKey: 'companyName', inputType: 'text', required: true },
          { no: '1.2', topic: 'Company Address', details: '', fieldKey: 'companyAddress', inputType: 'text' },
          { no: '1.3', topic: 'Contact Person', details: '', fieldKey: 'contactPerson', inputType: 'text' },
          { no: '1.4', topic: 'Contact Email', details: '', fieldKey: 'contactEmail', inputType: 'text' },
        ]
      },
      { no: '2', topic: 'Service Details', subTopics: [
          { no: '2.1', topic: 'Service Description', details: '', fieldKey: 'serviceDescription', inputType: 'textarea', required: true },
          { no: '2.2', topic: 'Data Sets Accessed', details: 'e.g., Customer PII, Transactional Data, etc.', fieldKey: 'dataSets', inputType: 'text' },
          { no: '2.3', topic: 'Is this a 4th Party (Subcontractor)?', details: '', fieldKey: 'isFourthParty', inputType: 'checkbox' },
        ]
      }
    ]
  },
  'risk': {
    key: 'risk', label: FORMS.find(f => f.key === 'risk')?.label || '',
    topics: [{ no: '1', topic: 'Risk Assessment Details', subTopics: [
        { no: '1.1', topic: 'Risk ID', details: 'Auto-generated unique identifier for the risk.', fieldKey: 'riskId', inputType: 'text' },
        { no: '1.2', topic: 'Risk Description', details: 'Describe the identified risk...', fieldKey: 'riskDescription', inputType: 'textarea', required: true },
        { no: '1.3', topic: 'Impact Level', details: '', fieldKey: 'impactLevel', inputType: 'select', options: ['Low', 'Medium', 'High', 'Critical'], required: true },
        { no: '1.4', topic: 'Likelihood', details: '', fieldKey: 'likelihood', inputType: 'select', options: ['Low', 'Medium', 'High'], required: true },
        { no: '1.5', topic: 'Mitigation Plan', details: 'Describe the plan to mitigate this risk...', fieldKey: 'mitigationPlan', inputType: 'textarea', required: true },
      ]
    }]
  },
   'contract': {
    key: 'contract', label: FORMS.find(f => f.key === 'contract')?.label || '',
    topics: [{ no: '1', topic: 'Contract Details', subTopics: [
        { no: '1.1', topic: 'Contract ID', details: '', fieldKey: 'contractId', inputType: 'text', required: true },
        { no: '1.2', topic: 'Start Date', details: '', fieldKey: 'startDate', inputType: 'date', required: true },
        { no: '1.3', topic: 'End Date', details: '', fieldKey: 'endDate', inputType: 'date', required: true },
        { no: '1.4', topic: 'SLA Details', details: 'Summarize key Service Level Agreements (SLAs)...', fieldKey: 'slaDetails', inputType: 'textarea' },
        { no: '1.5', topic: 'Key Clauses', details: 'Note any key clauses related to data protection, termination, liability, etc.', fieldKey: 'keyClauses', inputType: 'textarea' },
      ]
    }]
  },
  'monitoring': {
    key: 'monitoring', label: FORMS.find(f => f.key === 'monitoring')?.label || '',
    topics: [{ no: '1', topic: 'Monitoring Details', subTopics: [
        { no: '1.1', topic: 'Monitoring Period', details: 'e.g., Q1 2024', fieldKey: 'monitoringPeriod', inputType: 'text', required: true },
        { no: '1.2', topic: 'SLA Compliance', details: '', fieldKey: 'slaCompliance', inputType: 'select', options: ['Met', 'Partially Met', 'Not Met'], required: true },
        { no: '1.3', topic: 'Issues Identified', details: 'Detail any issues, incidents, or deviations from the SLA.', fieldKey: 'issuesIdentified', inputType: 'textarea' },
        { no: '1.4', topic: 'Action Plan', details: 'Outline the action plan to address any identified issues.', fieldKey: 'actionPlan', inputType: 'textarea' },
      ]
    }]
  },
  'termination': {
    key: 'termination', label: FORMS.find(f => f.key === 'termination')?.label || '',
    topics: [
      { no: '1', topic: 'Termination Details', subTopics: [
          { no: '1.1', topic: 'Reason for Termination', details: 'e.g., Contract expired, Project completed, Non-performance', fieldKey: 'terminationReason', inputType: 'textarea', required: true },
          { no: '1.2', topic: 'Effective Date', details: '', fieldKey: 'effectiveDate', inputType: 'date', required: true },
          { no: '1.3', topic: 'Additional Notes', details: 'Add any relevant details about the termination process, final handovers, etc.', fieldKey: 'notes', inputType: 'textarea' },
        ]
      },
      { no: '2', topic: 'Exit Checklist', subTopics: [
          { no: '2.1', topic: 'All company data has been securely destroyed or returned.', details: '', fieldKey: 'dataDestructionConfirmed', inputType: 'checkbox' },
          { no: '2.2', topic: 'All company assets (laptops, badges, etc.) have been returned.', details: '', fieldKey: 'assetReturnConfirmed', inputType: 'checkbox' },
        ]
      }
    ]
  },
  'evaluation': {
    key: 'evaluation', label: FORMS.find(f => f.key === 'evaluation')?.label || '',
    topics: [{ no: '1', topic: 'Performance Evaluation', subTopics: [
        { no: '1.1', topic: 'Evaluation Period', details: 'เช่น ประจำปี 2567, ไตรมาสที่ 4', fieldKey: 'evaluationPeriod', inputType: 'text', required: true },
        { no: '1.2', topic: 'Satisfaction Score (1-5)', details: 'ให้คะแนน 1 (น้อยที่สุด) ถึง 5 (มากที่สุด)', fieldKey: 'satisfactionScore', inputType: 'number', required: true },
        { no: '1.3', topic: 'Performance Summary', details: 'สรุปจุดเด่นและจุดที่ควรปรับปรุงของผู้ให้บริการ', fieldKey: 'summary', inputType: 'textarea', required: true },
        { no: '1.4', topic: 'Recommendations for Improvement', details: 'ให้ข้อเสนอแนะสำหรับการให้บริการในอนาคต', fieldKey: 'recommendations', inputType: 'textarea' },
      ]
    }]
  },
  'dataProtection': {
    key: 'dataProtection', label: FORMS.find(f => f.key === 'dataProtection')?.label || '',
    topics: [{ no: '1', topic: 'Data Protection Assessment', subTopics: [
        { no: '1.1', topic: 'Type of Personal Data Accessed', details: 'เช่น ชื่อ, ที่อยู่, ข้อมูลสุขภาพ, ข้อมูลทางการเงิน', fieldKey: 'dataType', inputType: 'text', required: true },
        { no: '1.2', topic: 'Technical Measures', details: 'อธิบายมาตรการ เช่น การเข้ารหัส (Encryption), การควบคุมการเข้าถึง (Access Control)', fieldKey: 'technicalMeasures', inputType: 'textarea', required: true },
        { no: '1.3', topic: 'Data Protection Officer (DPO)', details: 'ระบุชื่อและข้อมูลติดต่อของ DPO (ถ้ามี)', fieldKey: 'dpoContact', inputType: 'text' },
        { no: '1.4', topic: 'PDPA Compliance', details: 'สรุปว่าผู้ให้บริการมีแนวทางปฏิบัติตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคลอย่างไร', fieldKey: 'pdpaCompliance', inputType: 'textarea', required: true },
      ]
    }]
  },
};
// --- END MOCK DATABASE ---


// --- API FUNCTIONS ---
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Auth
export const apiLogin = async (username: string, password: string): Promise<User> => {
    await sleep(500);
    const user = USERS_DB.find(u => u.username === username && u.password === password);
    if (user) return { ...user };
    throw new Error('Invalid credentials');
}

// Users
export const apiGetUsers = async (): Promise<User[]> => {
    await sleep(300);
    return JSON.parse(JSON.stringify(USERS_DB));
};

export const apiCreateUser = async (name: string, username: string, password: string, role: UserRole, department: string, registrationDate?: string, signatureImage?: string): Promise<User> => {
    await sleep(400);
    if (USERS_DB.some(u => u.username === username)) {
        throw new Error("Username already exists.");
    }
    const newUser: User = { id: Date.now(), name, username, password, role, department, registrationDate, signatureImage };
    USERS_DB.push(newUser);
    return { ...newUser };
};

export const apiUpdateUser = async (updatedUser: User): Promise<User> => {
    await sleep(400);
    const index = USERS_DB.findIndex(u => u.id === updatedUser.id);
    if (index === -1) throw new Error("User not found.");
    const originalUser = USERS_DB[index];
    // If password is blank, keep the old one
    const finalUser = { ...updatedUser };
    if (!finalUser.password) {
        finalUser.password = originalUser.password;
    }
    USERS_DB[index] = finalUser;
    return { ...finalUser };
};

export const apiDeleteUser = async (userId: number): Promise<{ id: number }> => {
    await sleep(400);
    USERS_DB = USERS_DB.filter(u => u.id !== userId);
    return { id: userId };
};

// Projects
export const apiGetProjects = async (): Promise<Project[]> => {
    await sleep(300);
    return JSON.parse(JSON.stringify(PROJECTS_DB));
}

export const apiCreateProject = async (name: string, description: string, assessorId: number, reviewerId: number, currentUser: User): Promise<Project> => {
    await sleep(500);
    const assessor = USERS_DB.find(u => u.id === assessorId);
    const reviewer = USERS_DB.find(u => u.id === reviewerId);
    if (!assessor || !reviewer) throw new Error("Assessor or Reviewer not found.");

    const newProject: Project = {
        id: `proj-${String(Date.now()).slice(-4)}`,
        name, description,
        createdBy: currentUser.name, createdAt: new Date(), status: 'In Progress',
        assessorId, reviewerId,
        assessorName: assessor.name, reviewerName: reviewer.name,
        assessorDepartment: assessor.department, reviewerDepartment: reviewer.department,
    };
    PROJECTS_DB.unshift(newProject);
    return { ...newProject };
};

export const apiUpdateProjectDetails = async (projectId: string, updates: Partial<Project>): Promise<Project> => {
    await sleep(400);
    const index = PROJECTS_DB.findIndex(p => p.id === projectId);
    if (index === -1) throw new Error("Project not found.");

    // Handle re-assignment of users
    if (updates.assessorId && updates.assessorId !== PROJECTS_DB[index].assessorId) {
        const newAssessor = USERS_DB.find(u => u.id === updates.assessorId);
        if (newAssessor) {
            updates.assessorName = newAssessor.name;
            updates.assessorDepartment = newAssessor.department;
        }
    }
    if (updates.reviewerId && updates.reviewerId !== PROJECTS_DB[index].reviewerId) {
        const newReviewer = USERS_DB.find(u => u.id === updates.reviewerId);
        if (newReviewer) {
            updates.reviewerName = newReviewer.name;
            updates.reviewerDepartment = newReviewer.department;
        }
    }

    PROJECTS_DB[index] = { ...PROJECTS_DB[index], ...updates };
    return { ...PROJECTS_DB[index] };
};


// Submissions
export const apiGetSubmissions = async (): Promise<FormSubmission[]> => {
    await sleep(300);
    return JSON.parse(JSON.stringify(SUBMISSIONS_DB));
};

export const apiSaveDraft = async (projectId: string, formKey: FormKey, data: any, currentUser: User): Promise<FormSubmission> => {
    await sleep(500);
    const id = `${projectId}_${formKey}`;
    const existingIndex = SUBMISSIONS_DB.findIndex(s => s.id === id);
    const draftSubmission: FormSubmission = {
      id, projectId, formKey, data,
      status: 'Draft',
      submittedBy: currentUser.name,
      submittedAt: new Date(),
    };
    if (existingIndex > -1) {
        SUBMISSIONS_DB[existingIndex] = draftSubmission;
    } else {
        SUBMISSIONS_DB.push(draftSubmission);
    }
    return { ...draftSubmission };
};

export const apiSubmitForm = async (projectId: string, formKey: FormKey, data: any, currentUser: User): Promise<FormSubmission> => {
    await sleep(500);
    const id = `${projectId}_${formKey}`;
    const existingIndex = SUBMISSIONS_DB.findIndex(s => s.id === id);
    const newSubmission: FormSubmission = {
      id, projectId, formKey, data,
      status: 'Pending Review',
      submittedBy: currentUser.name,
      submittedAt: new Date(),
    };
    if (existingIndex > -1) {
        SUBMISSIONS_DB[existingIndex] = newSubmission;
    } else {
        SUBMISSIONS_DB.push(newSubmission);
    }
    return { ...newSubmission };
};

export const apiUpdateSubmissionStatus = async (submissionId: string, status: 'Approved' | 'Rejected', comments: string, currentUser: User): Promise<FormSubmission> => {
    await sleep(500);
    const index = SUBMISSIONS_DB.findIndex(s => s.id === submissionId);
    if (index === -1) throw new Error("Submission not found.");
    
    SUBMISSIONS_DB[index] = {
        ...SUBMISSIONS_DB[index],
        status, comments,
        reviewedBy: currentUser.name,
        reviewedAt: new Date(),
    };
    return { ...SUBMISSIONS_DB[index] };
};

export const apiAdminUpdateFormStatus = async (projectId: string, formKey: FormKey, newStatus: FormStatus, adminUser: User): Promise<FormSubmission> => {
    await sleep(300);
    const id = `${projectId}_${formKey}`;
    const existingIndex = SUBMISSIONS_DB.findIndex(s => s.id === id);

    if (existingIndex > -1) {
        SUBMISSIONS_DB[existingIndex].status = newStatus;
        SUBMISSIONS_DB[existingIndex].reviewedBy = adminUser.name;
        SUBMISSIONS_DB[existingIndex].reviewedAt = new Date();
        SUBMISSIONS_DB[existingIndex].comments = `Status overridden by admin.`;
        return { ...SUBMISSIONS_DB[existingIndex] };
    } else {
        // Create a new submission if one doesn't exist
        const newSubmission: FormSubmission = {
            id,
            projectId,
            formKey,
            status: newStatus,
            data: {},
            reviewedBy: adminUser.name,
            reviewedAt: new Date(),
            comments: `Status set by admin.`,
        };
        SUBMISSIONS_DB.push(newSubmission);
        return { ...newSubmission };
    }
};

// Surveys
export const apiGetSurveys = async (): Promise<SatisfactionSurveySubmission[]> => {
    await sleep(300);
    return JSON.parse(JSON.stringify(SURVEYS_DB));
};

export const apiSubmitSurvey = async (data: Omit<SatisfactionSurveySubmission, 'id' | 'submittedAt'>): Promise<SatisfactionSurveySubmission> => {
    await sleep(400);
    const newSurvey: SatisfactionSurveySubmission = {
        ...data,
        id: `survey-${Date.now()}`,
        submittedAt: new Date(),
    };
    SURVEYS_DB.unshift(newSurvey);
    return { ...newSurvey };
};

export const apiDeleteSurvey = async (surveyId: string): Promise<{ id: string }> => {
    await sleep(400);
    SURVEYS_DB = SURVEYS_DB.filter(s => s.id !== surveyId);
    return { id: surveyId };
};

// Form Definitions
export const apiGetFormDefinitions = async (): Promise<FormDefinitions> => {
    await sleep(200);
    return JSON.parse(JSON.stringify(FORM_DEFINITIONS_DB));
};

export const apiUpdateFormDefinition = async (formKey: FormKey, definition: FormDefinition): Promise<FormDefinition> => {
    await sleep(400);
    if (!FORM_DEFINITIONS_DB[formKey]) {
        throw new Error("Form definition not found.");
    }
    FORM_DEFINITIONS_DB[formKey] = definition;
    return JSON.parse(JSON.stringify(definition));
};