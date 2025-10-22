import { User, Project, FormSubmission, FormKey, UserRole, SatisfactionSurveySubmission, FormStatus, FormDefinitions, FormDefinition, Topic } from '../types';
import { FORMS } from '../constants';

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
    { id: 'proj-001_serviceApproval', projectId: 'proj-001', formKey: 'serviceApproval', status: 'Approved', data: { providerName: 'Fintech Solutions Ltd.' }, submittedBy: 'Supanan Ak-karadechawut', reviewedBy: 'Doungdow Raksachol', submittedAt: new Date(), reviewedAt: new Date() },
    { id: 'proj-001_registration', projectId: 'proj-001', formKey: 'registration', status: 'Approved', data: { companyName: 'Fintech Solutions Ltd.', isFourthParty: false, dataSet: 'Transactional Data' }, submittedBy: 'Supanan Ak-karadechawut', reviewedBy: 'Doungdow Raksachol', submittedAt: new Date(), reviewedAt: new Date() },
    { id: 'proj-001_capability', projectId: 'proj-001', formKey: 'capability', status: 'Pending Review', data: { thirdPartyName: 'Fintech Solutions Ltd.', assessmentDate: '2024-05-10', torRfpReference: 'Refer to TOR document XYZ for project requirements.' }, submittedBy: 'Supanan Ak-karadechawut', submittedAt: new Date() },
    { id: 'proj-001_risk', projectId: 'proj-001', formKey: 'risk', status: 'Approved', data: { riskIdentification: 'Data breach risk', impactLevel: 'High', mitigationPlan: 'Encryption and access controls', customerDataAcess: 'Read/Write', companyDataAcess: 'Read', isOnExistingCloud: true, cloudServiceType: 'SaaS', impactsCriticalSystem: true, projectValue: 15000000 }, reviewedBy: 'Doungdow Raksachol' },
    { id: 'proj-001_contract', projectId: 'proj-001', formKey: 'contract', status: 'Approved', data: { contractId: 'FS-2023-001', endDate: getFutureDate(60) }, reviewedBy: 'Doungdow Raksachol' },

    // Project 2 Data
    { id: 'proj-002_serviceApproval', projectId: 'proj-002', formKey: 'serviceApproval', status: 'Approved', data: { providerName: 'Mobile Dev Co.' }, reviewedBy: 'Doungdow Raksachol' },
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

// --- FORM DEFINITION TEMPLATES ---

const CAPABILITY_ASSESSMENT_FORM_TEMPLATE: Topic[] = [
  { 
    no: '1', 
    topic: 'ฐานะทางการเงิน และชื่อเสียง', 
    subTopics: [
      { no: '1.1', topic: 'ฐานะทางการเงิน - ความมั่นคงทางการเงิน(ทุนจดทะเบียน, กำไรสุทธิ, สภาพคล่องทางการเงิน, การบริหารจัดการสินทรัพย์และหนี้สิน)', details: '** กรณีการทบทวนรายปี ต้องพิจารณาฐานะของผู้ให้บริการในช่วง 1 ปีที่ผ่านมาเมื่อเปรียบเทียบกับปีก่อน ไม่มีการเปลี่ยนแปลงอย่างมีนัยสำคัญ ซึ่งอาจมีผลต่อการให้บริการต่อธนาคารได้ ***' }
    ]
  },
  { 
    no: '2', 
    topic: 'ชื่อเสียง', 
    subTopics: [
      { no: '2.1', topic: 'ชื่อเสียง ภาพลักษณ์องค์กร ภาพลักษณ์ผู้บริหาร', details: 'นิติบุคคล กรรมการ กรรมการผู้มีอานาจลงนาม และผู้บริหารระดับสูงไม่เคยมีประวัติการถูกร้องเรียนจากการใช้บริการกับบริษัท หรือสถาบันการเงินอื่น' },
      { no: '2.2', topic: 'ผลการตรวจสอบ Datamart และ Special list ของ นิติบคุคลและกรรมการ', details: 'นิติบุคคล และ กรรมการผู้มีอำนาจลงนาม ทั้งกรณีที่ ไม่เป็น หรือ เคยเป็นบุคคลซึ่งศาลมีคำสั่งพิทักษ์ทรัพย์ หรือ ล้มละลาย หรือเป็นบุคคลที่ถูกกำหนดตามกฎหมาย ปปง.กรณีไม่เกี่ยวข้องกับการเมือง หรือไม่เป็นผู้ดำรงตำแหน่งทางการเมือง' },
      { no: '2.3', topic: 'ผลตรวจสอบรายชื่อจากระบบ RPT เพื่อตรวจสอบการมีส่วนเกี่ยวข้องกับคณะกรรมการและผู้บริหารระดับสูง ของธนาคารรวมทั้งผู้เกี่ยวข้อง', details: 'นิติบุคคล กรรมการผู้มีอำนาจลงนาม และผู้ถือหุ้นตั้งแต่ร้อยละ 20 ขึ้นไป ของนิติบุคคล ต้องไม่เป็นผู้มีผลประโยชน์เกี่ยวข้องกับธนาคาร' },
      { no: '2.4', topic: 'การบริหารงานทั่วไปหรืออื่น ๆ', details: '(1) ไม่มีประวัติ หรือข่าวการถูกโจมตีทางไซเบอร์สำเร็จ ถูก Ransomeware หรือ ถูก Compomised และ(2) ผู้ให้บริการไม่มีปัญหาภายในองค์กร (ที่เกี่ยวข้องกับการบริหารงาน และการจ้างงาน)' }
    ]
  },
  {
    no: '3',
    topic: 'ความรู้ความเชี่ยวชาญ ความเชี่ยวชาญในเทคโนโลยีระบบงาน ที่ให้บริการ',
    subTopics: [
      { no: '3.1', topic: 'ความเชี่ยวชาญในเทคโนโลยีระบบงาน ที่ให้บริการ', details: '' },
      { no: '3.2', topic: 'ประสบการณ์ในการให้บริการ ในเทคโนโลยี ระบบงาน ที่ให้บริการ, Customer site reference', details: '(1) ข้อมูล ประสบการณ์ในการให้บริการ ด้านเทคโนโลยี ระบบงาน ที่ให้บริการทั้งของนิติบุคคล  และผู้บริหาร(2) ข้อมูล  Customer site reference' },
      { no: '3.3', topic: 'การบริหารจัดการโครงการ', details: '(1) การนำเสนอข้อมูล กระบวนการ แผนงานในการบริหารจัดการโครงการ (2) กระบวนวิเคราะห์ และแก้ไขปัญหา Project issue, GAP, Incident (3) Impact from change, Deployment failed, Repeat incident (4) คุณภาพการให้บริการ และ SLA' },
      { no: '3.4', topic: 'การบริหารจัดการด้านทรัพยากรให้รองรับการให้บริการ', details: '(1) พิจารณาความเพียงพอของทรัพยากร ที่ใช้ในการดำเนินงาน และให้บริการ (2) พิจารณาทักษะ  ประสบการณ์ และความเชี่ยวชาญของบุคลากรที่ใช้ในการดำเนินงาน และให้บริการ' },
      { no: '3.5', topic: 'การบริหารงานทั่วไปหรืออื่น ๆ', details: 'ข้อร้องเรียน ปัญหาและอุปสรรคที่พบ จากการดำเนินงานหรือคำติชม ข้อเสนอแนะจากผู้ร่วมงานต่าง ๆ ของธนาคาร' }
    ]
  },
  { no: '4', topic: 'ธรรมาภิบาลและวัฒนธรรมองค์กรของบุคคลภายนอก', details: '-  การดำเนินธุรกิจ อย่างปร่งใส เปิดเผย\n-  มีความรับผิดชอบ และแก้ไขปัญหาอย่างจริงจัง\n-  มีจริยธรรมในการดำเนินธุรกิจ\n-  มีการถ่วงดุลอำนาจแบบ 3 lines of defense\n-  มีกระบวนการตรวจสอบภายใน\nNote: TBC ต้องทำแบบประเมิน RoPa?\n\n(1) โครงสร้างองค์กรเหมาะสมกับธุรกิจ  และมีการถ่วงดุลอำนาจแบบ 3 lines of defense\n(2) ผู้ให้บริการภายนอกมีนโยบายในการดูแลพนักงานในองค์กร ให้มีจริยธรรม จรรยาบรรณในการทำงาน และควบคุมดูแลการปฏิบัติงานให้อยู่ภายใต้กฎระเบียบกฎหมาย ข้อบังคับต่างๆของทางราชการที่เกี่ยวข้อง\n(3) ผู้ห้บริการภายนอกมีนโยบายการรักษาความปลอดภัยของข้อมูลการรักษาความลับ และความเป็นส่วนตัวของข้อมูลลูกค้า และข้อมูลของธนาคารผู้\n(4) ผู้ให้บริการภายนอกมีแนวทางในการประเมินผลตรวจสอบ คุณภาพของงานที่ให้ บริการ\n(5) ผู้ให้บริการภายนอกมีนโยบายที่สอดคล้อง กับการดำเนินการตามกฎหมาย กฎเกณฑ์ทางการที่เกี่ยวข้อง\n(6) ผู้ให้บริการภายนอกมีการดำเนินธุรกิจ ตามหลักการของการต่อต้านคอร์รัปชั่น โดยยึดหลักจริยธรรม คุณธรรมอย่างเคร่งครัด และปฏิบัติตามกฎหมายเกี่ยวกับการป้องกันการคอร์รัปชั่นของประเทศไทย รวมทั้งนโยบายต่อต้านการคอร์รัปชั่นที่ธนาคารกำหนด' },
  { no: '5', topic: 'การบริหารจัดการความเสี่ยง และการควบคุมภายใน', details: 'มีกระบวนการประเมิน และบริหารความเสี่ยงภายใน' },
  { no: '6', topic: 'การรักษาความมั่นคงปลอดภัยด้านเทคโนโลยีสารสนเทศ', details: 'อ้างอิง IT-Security requirement' },
  { no: '7', topic: 'การบริหารจัดการความต่อเนื่องทางธุรกิจ หรือความพร้อมรับมือภัยหรือเหตุการณ์ต่างๆ ทั้งแผน BCP และทดสอบแผน BCP ตลอดจน แผน DR และ Backup & Recovery', details: '(1) ผู้ให้บริการภายนอกมีการจัดทำแผน BCP เพื่อรองรับกรณีไม่สามารถให้บริการได้อย่างต่อเนื่อง โดยเฉพาะผู้ให้บริการภายนอกหลัก (Key Service Provider) ที่เกี่ยวข้องกับงานสำคัญ(Significant Activity) ของธนาคาร ซึ่งหากไม่สามารถให้บริการได้ จะมีผลกระทบในวงกว้าง (Wide Impact) ต้องมีการจัดทำแผน BCP และแผน DR และ Backup & Recovery\n(2) การทดสอบแผน BCP หรือแผน DR เป็นประจำ หรืออย่างน้อยปีละ 1 ครั้ง\n(3) หรือหน่วยงานผู้ขอใช้บริการมีความจำเป็น และสามารถทดสอบแผน BCP ร่วมกับผู้ให้บริการภายนอกได้ รวมทั้งมีการบันทึกผลการทดสอบไว้ให้สามารถตรวจสอบได้\n(4) หรือไม่มีประเด็นการหยุดชะงักที่มีนัยสำคัญต่อการให้บริการ' },
  { no: '8', topic: 'การตรวจสอบจากหน่วยงานตรวจสอบภายใน และหน่วยงานตรวจสอบภายนอก', details: ' ' },
  {
    no: '9',
    topic: 'การปฏิบัตตามกฎหมายและกฎเกณฑ์ที่เกี่ยวข้อง',
    details: '9.1 การขอรับรองจากบุคคลภายนอก\n9.2 ใบอนุญาต\n9.3 การดำเนินการตามกฎหมายและกฎเกณฑ์ที่เกี่ยวข้อง เป็นต้น'
  },
  {
    no: '10',
    topic: 'การปฏิบัติตามมาตรฐานสากลด้านเทคโนโลยีสารสนเทศ',
    details: '10.1 การขอตรวจสอบการได้รับการรับรองตามมาตรฐาน ISO 27001 เป็นต้น\n10.2 กรณีที่มีการรับรองมาตรฐานอื่น ๆ ให้ระบุและแนบเอกสารรับรอง'
  },
  {
    no: '11',
    topic: 'กรณีผู้ให้บริการตั้งอยู่ต่างประเทศ หรือมีผู้ถือหุ้นหลัก หรือผู้บริหารหลัก เป็นคนต่างชาติ อาจมีความเสี่ยงจากปัจจัยภายนอกที่อาจกระทบต่อการให้บริการของบุคคลภายนอก',
    details: '11.1 สถานการณ์ทางการเมือง\n11.2 ข้อจำกัดด้านกฎหมายของประเทศที่บุคคลภายนอกตั้งอยู่'
  },
  {
    no: '12',
    topic: 'ความเสี่ยงในกรณีผู้ให้บริการภายนอกให้บริการแก่หลายสถาบันการเงิน (Concentration Risk)',
    details: '12.1 การบริหารจัดการทรัพยากร - ผู้ให้บริการภายนอก มีทรัพยากรต่าง ๆ และบุคลากรที่เพียงพอสามารถให้บริการแก่ธนาคารและสถาบันการเงินอื่นได้ โดยมีผลงานเป็นไปตามมาตรฐานการให้บริการขั้นต่ำตามที่ธนาคารกำหนด'
  },
  { no: '13', topic: 'การใช้เทคโนโลยีแบบเปิด (Open Technology) เพื่อให้สามารถนำระบบไปใช้งานหรือเชื่อมโยงกับระบบอื่นได้ (Interoperability)', details: ' ' }
];

const SECURITY_MEASURES_FORM_TEMPLATE: Topic[] = [
  { 
    no: '1', 
    topic: 'การรักษาความมั่นคงปลอดภัยของข้อมูล (Information Security)', 
    subTopics: [
      { no: '1.1', topic: 'บริษัทผู้ให้บริการภายนอกมีการกำหนดระดับชั้นของข้อมูล (Information Classification) รวมถึงมีการกำหนดมาตรการดูแลรักษาความปลอดภัยของข้อมูลตามแต่ละระดับชั้น', details: '' },
      { no: '1.2', topic: 'บริษัทผู้ให้บริการภายนอกมีมาตรการและการบริหารจัดการในการเข้ารหัสข้อมูล (Encryption) สำหรับข้อมูลส่วนบุคคล (PII) และข้อมูลอ่อนไหว (Sensitive Data) (เช่น ข้อมูลบัตรเครดิต (Card Holder Data) , ข้อมูลรหัสผ่าน (Password/PIN) เป็นต้น) ซึ่งมีการจัดเก็บอยู่บนอุปกรณ์ที่ใช้ปฏิบัติงาน (Data at Endpoint) ข้อมูลที่อยู่ระหว่างการรับส่งผ่านเครือข่าย (Data in Transit) และข้อมูลที่อยู่บนระบบงานและสื่อบันทึกข้อมูล (Data at Rest) รวมถึงข้อมูลสำรอง  (Backup Data)', details: '' },
      { no: '1.3', topic: 'บริษัทผู้ให้บริการภายนอกมีการกำหนดมาตรการ เรื่องการลบทำลายข้อมูล (Information Disposal and Destruction) เมื่อสิ้นสุดระยะเวลาการจัดเก็บตามกฎหมาย รวมถึงมีกระบวนการจัดเก็บหลักฐานการลบทำลายข้อมูลที่สามารถตรวจสอบได้', details: '' },
      { no: '1.4', topic: 'บริษัทผู้ให้บริการภายนอกมีการกำหนดมาตรฐานกุญแจเข้ารหัสข้อมูลสอดคล้องกับมาตรฐานสากลที่ยอมรับอย่างเหมาะสม เช่น การใช้ RSA2048, AES256 เป็นต้น', details: '' }
    ]
  },
  {
    no: '2',
    topic: 'การควบคุมการเข้าถึง (Access Control)',
    subTopics: [
      { no: '2.1', topic: 'บริษัทผู้ให้บริการภายนอกมีการกำหนดมาตรการ เรื่องการบริหารจัดการบัญชีผู้ใช้งานระบบ (User Access Management) ครอบคลุมถึงการยกเลิกสิทธิ์บัญชีผู้ใช้งานระบบที่ลาออกหรือมีการเปลี่ยนแปลงโยกย้าย', details: '' },
      { no: '2.2', topic: 'บริษัทผู้ให้บริการภายนอกมีการกำหนดสิทธิ์การเข้าถึงระบบงานตามความจำเป็นและหน้าที่ของผู้ใช้งานระบบ (Role-Based Access Control) รวมถึงมีมาตรการในการทบทวนสิทธิ์การเข้าถึงระบบงานอย่างสม่ำเสมอ', details: '' },
      { no: '2.3', topic: 'บริษัทผู้ให้บริการภายนอกมีการกำหนดวิธีการพิสูจน์ตัวตนผู้ใช้งาน (Authentication) ด้วยวิธีการที่รัดกุมเพียงพอ ตามมาตรฐานสากลที่เป็นที่ยอมรับโดยทั่วไป', details: '' },
      { no: '2.4', topic: 'บริษัทผู้ให้บริการภายนอกมีการกำหนดมาตรการ เรื่องการบริหารจัดการบัญชีผู้ใช้งานสิทธิ์สูงสุด (High Privileged User) ครอบคลุมกระบวนการพิสูจน์ตัวตนหลายชั้น (Multi-factor Authentication) กระบวนการสอบทานสิทธิ์ และการสอบทานการเข้าถึงระบบงานตามรอบระยะเวลาที่สอดคล้องกับระดับความเสี่ยงอย่างสม่ำเสมอ', details: '' },
      { no: '2.5', topic: 'กรณีมีการเข้าถึงระบบงานระยะไกล (Remote Access) บริษัทผู้ให้บริการภายนอกไม่อนุญาตให้เครื่องคอมพิวเตอร์ส่วนบุคคลของพนักงานเข้าถึงระบบงานของธนาคาร รวมทั้งมีมาตรการในการพิสูจน์ตัวตนแบบ Multi-Factor Authentication (MFA) และมีกระบวนการสอบทานการเข้าถึงระบบงานระยะไกลอย่างสม่ำเสมอ', details: '' },
      { no: '2.6', topic: 'บริษัทผู้ให้บริการภายนอกต้องมีความรู้ความเชี่ยวชาญ ประสบการณ์ด้านการรักษาความมั่นคงปลอดภัยด้านเทคโนโลยีสารสนเทศที่กำหนด สอดคล้องตามมาตรฐานสากลที่เป็นที่ยอมรับ เช่น ISO27001, PCIDSS เป็นต้น (หรือมีรายงานผลการตรวจสอบ SOC 2 Type 2 เป็นต้น)', details: '' }
    ]
  },
  {
    no: '3',
    topic: 'การรักษาความมั่นคงปลอดภัยของระบบเครือข่าย (Communications Security)',
    subTopics: [
      { no: '3.1', topic: 'บริษัทผู้ให้บริการภายนอกมีการกำหนดมาตรการและแผนการดำเนินงานในการรักษาความปลอดภัยในการรับ-ส่งข้อมูลผ่านระบบเครือข่ายสื่อสาร (Communication Security Policy) ให้เป็นไปตาม นโยบายการรักษาความมั่นคงปลอดภัยด้านเทคโนโลยีสารสนเทศ', details: '' },
      { no: '3.2', topic: 'บริษัทผู้ให้บริการภายนอกจัดให้มีระบบหรือกระบวนการสำหรับคัดกรอง Traffic ที่ส่งผ่านระบบเครือข่าย ตรวจจับ แจ้งเตือน และสามารถยับยั้งการบุกรุกการโจมตีบนระบบเครือข่ายได้อย่างทันการณ์ เช่น Firewall, IPS/IDS เป็นต้น', details: '' }
    ]
  },
  {
    no: '4',
    topic: 'การจัดเก็บข้อมูลบันทึกเหตุการณ์และการเฝ้าระวังด้านความปลอดภัย (Logging and Security Monitoring)',
    subTopics: [
      { no: '4.1', topic: 'บริษัทผู้ให้บริการภายนอกมีมาตรการในการจัดเก็บข้อมูลบันทึกเหตุการณ์ที่ครบถ้วนเพียงพอและปลอดภัย โดยจัดเก็บอย่างน้อย 90 วัน เพื่อให้สามารถติดตามตรวจสอบร่องรอยการเข้าถึงและการใช้งานระบบหรือข้อมูลของผู้ใช้งาน รวมทั้งใช้เป็นหลักฐานการทำธุรกรรมทางอิเล็กทรอนิกส์ตามที่กฎหมายกำหนด', details: '' },
      { no: '4.2', topic: 'บริษัทผู้ให้บริการภายนอกจัดให้มีมาตรการในการติดตามและวิเคราะห์ข้อมูลบันทึกเหตุการณ์ (Log Monitoring and Analysis) ของระบบงานที่ให้บริการหรือระบบที่มีการเชื่อมต่อกับเครือข่ายกับธนาคาร เพื่อป้องกันและตรวจจับการบุกรุก', details: '' }
    ]
  },
  {
    no: '5',
    topic: 'การบริหารจัดการค่าความปลอดภัยระบบ (System Security Configuration Management)',
    subTopics: [
      { no: '5.1', topic: 'บริษัทผู้ให้บริการภายนอกมีกำหนดมาตรฐานการตั้งค่าความปลอดภัยของระบบงาน (Security Configuration Baseline) สอดคล้องตามมาตรฐานสากล เช่น CIS เป็นต้น', details: '' },
      { no: '5.2', topic: 'บริษัทผู้ให้บริการภายนอกมีการกำหนดมาตรการ เรื่องการสอบทานการตั้งค่าความปลอดภัย (Security Configutation Review) อย่างสม่ำเสมอ โดยครอบคลุมถึงการตั้งค่าบนระบบปฏิบัติการ ระบบฐานข้อมูล และอุปกรณ์เครือข่าย ที่เกี่ยวข้องกับการให้บริการธนาคาร', details: '' }
    ]
  },
  {
    no: '6',
    topic: 'การบริหารจัดการช่องโหว่และการทดสอบเจาะระบบ (Vulnerability Management and Penetration Testing)',
    subTopics: [
      { no: '6.1', topic: 'บริษัทผู้ให้บริการภายนอกมีการกำหนดมาตรการ เรื่องการอัพเดท Security Patch ตามที่เจ้าของผลิตภัณฑ์ (Product) ประกาศอย่างสม่ำเสมอ ภายในระยะเวลาที่เหมาะสม', details: '' },
      { no: '6.2', topic: 'บริษัทผู้ให้บริการภายนอกมีการกำหนดมาตรการ เรื่องการประเมินช่องโหว่ (Vulnerability Assessment) อย่างน้อยปีละ 1 ครั้ง และเมื่อมีการเปลี่ยนแปลงอย่างมีนัยสำคัญ รวมทั้งมีมาตรการในการจัดทำแผนและดำเนินการแก้ไขช่องโหว่ที่พบภายในระยะเวลาที่เหมาะสมสอดคล้องตามความเสี่ยงช่องโหว่นั้นๆ', details: '' },
      { no: '6.3', topic: 'บริษัทผู้ให้บริการภายนอกมีการกำหนดมาตรการ เรื่องการทดสอบเจาะระบบ (Penetration Test) อย่างน้อยปีละ 1 ครั้ง ในกรณีที่ระบบงานและระบบเครือข่ายมีการเชื่อมต่อกับเครือข่ายสาธารณะ (Internet Facing)', details: '' }
    ]
  },
  {
    no: '7',
    topic: 'การรักษาความมั่นคงปลอดภัยเครื่องคอมพิวเตอร์ลูกข่าย (Endpoint Security Protection)',
    subTopics: [
      { no: '7.1', topic: 'บริษัทผู้ให้บริการภายนอกมีการกำหนดมาตรการและแผนการรักษาความมั่นคงปลอดภัยเครื่องคอมพิวเตอร์ลูกข่าย (Endpoint Security Protection) ที่สามารถเข้าถึงระบบงานที่ให้บริการ/หรือมีการเชื่อมต่อกับเครือข่ายของธนาคารอย่างเหมาะสมสอดคล้องตามมาตรฐานสากล เช่น การติดตั้งและอัปเดตซอฟต์แวร์ป้องกันมัลแวร์ (Antivirus/Antimalware) อย่างสม่ำเสมอ', details: '' }
    ]
  },
  {
    no: '8',
    topic: 'การฝึกอบรมด้านการรักษาความมั่นคงปลอดภัยระบบเทคโนโลยีสารสนเทศ (IT Security Awareness)',
    subTopics: [
      { no: '8.1', topic: 'บริษัทผู้ให้บริการภายนอกมีการกำหนดมาตรการ การฝึกอบรมเกี่ยวกับความปลอดภัยทางไซเบอร์แก่บุคลากรของบริษัทผู้ให้บริการภายนอกอย่างสม่ำเสมอ', details: '' }
    ]
  },
  {
    no: '9',
    topic: 'การสำรองข้อมูล (Data Backup)',
    subTopics: [
      { no: '9.1', topic: 'บริษัทผู้ให้บริการภายนอกมีการกำหนดมาตรการและแผนการสำรองข้อมูล (Data Backup)', details: '' },
      { no: '9.2', topic: 'บริษัทผู้ให้บริการภายนอกมีการกำหนดมาตรการและแผนการสุ่มเพื่อทดสอบการกู้คืนข้อมูล (Restoration data) อย่างน้อยปีละ 1 ครั้ง', details: '' }
    ]
  },
  {
    no: '10',
    topic: 'การบริหารจัดการเหตุการณ์ผิดปกติด้านเทคโนโลยีสารสนเทศ (IT Security Incident Management)',
    subTopics: [
      { no: '10.1', topic: 'บริษัทผู้ให้บริการภายนอกมีการกำหนดมาตรการและแผนการบริหารจัดการเหตุการณ์ผิดปกติด้านความปลอดภัยเทคโนโลยีสารสนเทศ (Security Incident Management) รวมทั้งมีมาตรการในการทดสอบแผนการรับมือเหตุการณ์ผิดปกติด้านความปลอดภัยเทคโนโลยีสารสนเทศอย่างสม่ำเสมอ', details: '' }
    ]
  },
  {
    no: '11',
    topic: 'การบริหารจัดการการเปลี่ยนแปลงด้านเทคโนโลยีสารสนเทศ (IT Change Management)',
    subTopics: [
      { no: '11.1', topic: 'บริษัทผู้ให้บริการภายนอกมีการกำหนดมาตรการในการแจ้งเตือนและสื่อสารการเปลี่ยนแปลงด้านระบบเทคโนโลยีสารสนเทศที่มีผลกระทบกับการให้บริการแก่ธนาคารได้ทราบล่วงหน้าเพื่อให้พิจารณาลดผลกระทบต่อการให้บริการลูกค้าของธนาคารอย่างเหมาะสม', details: '' }
    ]
  },
  {
    no: '12',
    topic: 'การบริหารจัดการขีดความสามารถของระบบ (Capacity Management)',
    subTopics: [
      { no: '12.1', topic: 'บริษัทผู้ให้บริการภายนอกมีการกำหนดกระบวนการติดตาม ประเมินประสิทธิภาพและความเพียงพอของทรัพยากรด้านเทคโนโลยีสารสนเทศ ที่ให้บริการแก่ธนาคารอย่างเพียงพอและต่อเนื่อง', details: '' },
      { no: '12.2', topic: 'บริษัทผู้ให้บริการภายนอกมีการกำหนดตัวชี้วัดการใช้ทรัพยากรด้านเทคโนโลยีสารสนเทศ (threshold และ trigger) ในการเฝ้าระวัง (monitor) ความเพียงพอของทรัพยากรด้านเทคโนโลยีสารสนเทศ', details: '' }
    ]
  },
  {
    no: '13',
    topic: 'การรักษาความมั่นคงปลอดภัยทางกายภาพและสภาพแวดล้อม (Physical and Environmental Security)',
    subTopics: [
      { no: '13.1', topic: 'บริษัทผู้ให้บริการภายนอกมีการกำหนดมาตรการและระเบียบปฏิบัติในการควบคุมการเข้าถึงศูนย์คอมพิวเตอร์ และพื้นที่สำคัญต่างๆภายในศูนย์คอมพิวเตอร์', details: '' },
      { no: '13.2', topic: 'บริษัทผู้ให้บริการภายนอกมีระบบควบคุมการเข้าถึงตัวอาคารศูนย์คอมพิวเตอร์ และพื้นที่สำคัญต่างๆภายในศูนย์คอมพิวเตอร์ ให้เข้าถึงได้เฉพาะบุคคลที่ได้รับอนุญาตตามสิทธิที่ได้รับมอบหมายเท่านั้น', details: '' },
      { no: '13.3', topic: 'บริษัทผู้ให้บริการภายนอกมีการกำหนดมาตรการในการบริหารจัดการศูนย์คอมพิวเตอร์ (facility management) เพื่อป้องกันความเสียหายที่อาจเกิดขึ้นจากการบุกรุกหรือจากภัยธรรมชาติ และเพื่อให้มีความพร้อมใช้งานอย่างต่อเนื่อง', details: '' },
      { no: '13.4', topic: 'บริษัทผู้ให้บริการภายนอกจัดให้มีการประเมินความเสี่ยงของศูนย์คอมพิวเตอร์เป็นประจำทุกปี', details: '' }
    ]
  }
];

let FORM_DEFINITIONS_DB: FormDefinitions = {
  'serviceApproval': {
    key: 'serviceApproval',
    label: '00. แบบการขออนุมัติใช้บริการจากบุคคลภายนอก (New Service Request)',
    isEditable: true,
    hasSignatures: true,
    topics: [
      {
        no: '1',
        topic: 'รายละเอียดคำขอ',
        subTopics: [
          { no: '1.1', topic: 'วันที่', fieldKey: 'requestDate', inputType: 'date', required: true },
          { no: '1.2', topic: 'เรื่อง', fieldKey: 'subject', inputType: 'text', required: true, details: 'เช่น ขออนุมัติใช้บริการจากบุคคลภายนอก' },
          { no: '1.3', topic: 'เรียน', fieldKey: 'to', inputType: 'text', required: true, details: 'เช่น ผู้อำนวยอนุมัติ' },
          { no: '1.4', topic: 'จาก (หน่วยงานผู้ขอใช้บริการ)', fieldKey: 'from', inputType: 'text', required: true },
        ]
      },
      {
        no: '2',
        topic: 'ข้อมูลการใช้บริการ',
        subTopics: [
          { no: '2.1', topic: '1. ชื่อผู้ให้บริการ', fieldKey: 'providerName', inputType: 'text', required: true },
          { no: '2.2', topic: '2. วัตถุประสงค์ในการใช้บริการ', fieldKey: 'objective', inputType: 'textarea', required: true },
          { no: '2.3', topic: '3. ขอบเขตของงานที่ใช้บริการ', fieldKey: 'scope', inputType: 'textarea', required: true, details: 'คุณลักษณะของระบบหรือรูปแบบการบริการ เงื่อนไขข้อกำหนด กระบวนการที่เกี่ยวข้องกับการใช้บริการ โดยสังเขป' },
          { no: '2.4', topic: '4. ระยะเวลาที่ใช้บริการ', fieldKey: 'duration', inputType: 'text', required: true },
          { no: '2.5', topic: '5. ประมาณการค่าใช้จ่าย', fieldKey: 'costEstimation', inputType: 'text', required: true, details: 'ประมาณการอย่างน้อย 3-5 ปี' },
          { no: '2.6', topic: '6. ประโยชน์ที่จะได้รับ', fieldKey: 'benefits', inputType: 'textarea', required: true, details: 'โดยเปรียบเทียบกรณีที่หน่วยงานดำเนินการเองกับการจ้างผู้ให้บริการภายนอกให้ดำเนินการแทน' },
        ]
      },
      {
        no: '3',
        topic: 'ความเห็นหน่วยงานผู้ใช้บริการ',
        subTopics: [
           { no: '3.1', topic: 'ความเห็น', fieldKey: 'requesterOpinion', inputType: 'textarea' },
        ]
      }
    ]
  },
  'capability': { 
    key: 'capability', 
    label: FORMS.find(f => f.key === 'capability')?.label || '', 
    topics: CAPABILITY_ASSESSMENT_FORM_TEMPLATE,
    isEditable: true, 
    hasSignatures: true,
  },
  'security': { 
    key: 'security', 
    label: FORMS.find(f => f.key === 'security')?.label || '', 
    topics: SECURITY_MEASURES_FORM_TEMPLATE,
    isEditable: true, 
    hasSignatures: true,
  },
  'registration': {
    key: 'registration',
    label: '03. แบบฟอร์มการลงทะเบียนการใช้บริการบุคคลภายนอก (3rd Party Registration)',
    isEditable: true,
    isStructureLocked: true,
    hasSignatures: true,
    topics: [
        { no: 'header_thirdPartyName', topic: 'ชื่อบริษัทผู้ให้บริการ (Third Party Name)' },
        { no: 'header_assessmentDate', topic: 'วันที่ประเมิน (Assessment Date)' },
        { no: 'p1_header', topic: 'ส่วนที่ 1 : รายละเอียดทะเบียน 3rd Party' },
        {
            no: 'p1_s1',
            topic: '1. ฝ่ายงานที่ขอประเมิน',
            subTopics: [
                { no: 'p1_s1_f1', topic: 'วันที่ลงทะเบียน (Register Date)' },
                { no: 'p1_s1_f2', topic: 'สายงาน (Business Unit)' },
                { no: 'p1_s1_f3', topic: 'ฝ่าย/แผนก (Department)' },
                { no: 'p1_s1_f4', topic: 'ผู้รับผิดชอบ (3rd Party Owner)' },
                { no: 'p1_s1_f5', topic: 'ผู้ประสานงาน (Representative)' },
            ]
        },
        {
            no: 'p1_s2',
            topic: '2. วัตถุประสงค์การประเมิน',
            subTopics: [
                { no: 'p1_s2_f1', topic: 'วัตถุประสงค์ (Purpose)' },
            ]
        },
        {
            no: 'p1_s3',
            topic: '3. รายละเอียดบุคคลภายนอก',
            subTopics: [
                { no: 'p1_s3_f1', topic: 'รหัสบุคคลภายนอก (Third Party Unique Id)' },
                { no: 'p1_s3_f2', topic: 'ประเภทรหัสบุคคลภายนอก (Third Party Unique Id Type)' },
                { no: 'p1_s3_f3', topic: 'ชื่อบุคคลภายนอก (ภาษาไทย)' },
                { no: 'p1_s3_f4', topic: 'ชื่อบุคคลภายนอก (English)' },
                { no: 'p1_s3_f5', topic: 'ความสัมพันธ์ (Relationship)' },
                { no: 'p1_s3_f6', topic: 'ประเทศที่จดทะเบียน (Registered Country)' },
                { no: 'p1_s3_f7', topic: 'Third Party Type' },
                { no: 'p1_s3_f8', topic: 'Work Type' },
                { no: 'p1_s3_f9', topic: 'ประเภทการเชื่อมต่อ (Integration Type)' },
                { no: 'p1_s3_f10', topic: 'Cloud Type' },
                { no: 'p1_s3_f11', topic: 'วันเริ่มต้นสัญญา (Contract Start Date)' },
                { no: 'p1_s3_f12', topic: 'วันสิ้นสุดสัญญา (Contract End Date)' },
                { no: 'p1_s3_f13', topic: 'ขอบเขตงานที่ให้บริการ โดยสรุป (Scope of work)' },
                { no: 'p1_s3_f14', topic: 'Service Risk Level' },
                { no: 'p1_s3_f15', topic: 'Service SLA' },
                { no: 'p1_s3_f16', topic: 'Data Center Country' },
            ]
        },
        {
            no: 'p1_s4',
            topic: '4. ขอบเขตงานที่ให้บริการ',
            subTopics: [
                { no: 'p1_s4_f1', topic: 'โครงสร้างพื้นฐาน (Server & Network Infrastructure)' },
                { no: 'p1_s4_f2', topic: 'O/S, Middle ware' },
                { no: 'p1_s4_f3', topic: 'ระบบงาน / ระบบฐานข้อมูล' },
                { no: 'p1_s4_f4', topic: 'การรักษาความปลอดภัย' },
                { no: 'p1_s4_f5', topic: 'อื่นๆ' },
            ]
        },
        {
            no: 'p1_s5',
            topic: '5. Sub contract & 4th Party',
            subTopics: [
                { no: 'p1_s5_th1', topic: 'ชื่อบุคคลภายนอก' },
                { no: 'p1_s5_th2', topic: 'ขอบเขตงาน' },
                { no: 'p1_s5_add_btn', topic: '+ Add Row' },
            ]
        },
        { no: 'p2_header', topic: 'ส่วนที่ 2 : การประเมินผู้ให้บริการ Third Party ที่มีนัยสำคัญ' },
        { no: 'p2_th1', topic: 'การพิจารณาความมีนัยสำคัญ' },
        { no: 'p2_th2', topic: 'ผลการพิจารณา' },
        { no: 'p2_s1_header', topic: '1) Data Access' },
        { no: 'p2_s1_f1', topic: '1.1 บุคคลภายนอกมีการเข้าถึงข้อมูลของลูกค้าในระดับใด' },
        { no: 'p2_s1_f2', topic: '1.2 บุคคลภายนอกมีการเข้าถึงข้อมูลของบริษัทในระดับใด' },
        { no: 'p2_s2_header', topic: '2) Cloud Computing' },
        { no: 'p2_s2_f1', topic: '2.1 ระบบงาน/บริการ อยู่บน Cloud Provide ที่ธนาคารมีอยู่แล้ว' },
        { no: 'p2_s2_f2', topic: '2.2 ประเภทการให้บริการ Cloud' },
        { no: 'p2_s3_header', topic: '3) เกี่ยวข้องกับระบบงาน หรือบริการที่สำคัญ' },
        { no: 'p2_s3_f1', topic: '3.1 ขอบเขตการให้บริการ เกี่ยวข้องหรือกระทบกับระบบงานที่สำคัญ' },
        { no: 'p2_s3_f2', topic: '3.2 ขอบเขตการให้บริการ เกี่ยวข้องหรือกระทบกับบริการที่สำคัญ' },
        { no: 'p2_s4_header', topic: '4) ขนาด และมูลค่าของโครงการ' },
        { no: 'p2_s4_f1', topic: '4.1 สัญญาโครงการที่มีมูลค่า ตั้งแต่ 10,000,000 บาทขึ้นไป' },
    ]
  },
  'risk': {
    key: 'risk', 
    label: FORMS.find(f => f.key === 'risk')?.label || '',
    isEditable: true,
    hasSignatures: true,
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
    key: 'contract', 
    label: FORMS.find(f => f.key === 'contract')?.label || '',
    isEditable: true,
    hasSignatures: true,
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
    key: 'monitoring', 
    label: FORMS.find(f => f.key === 'monitoring')?.label || '',
    isEditable: true,
    hasSignatures: true,
    topics: [{ no: '1', topic: 'Monitoring Details', subTopics: [
        { no: '1.1', topic: 'Monitoring Period', details: 'e.g., Q1 2024', fieldKey: 'monitoringPeriod', inputType: 'text', required: true },
        { no: '1.2', topic: 'SLA Compliance', details: '', fieldKey: 'slaCompliance', inputType: 'select', options: ['Met', 'Partially Met', 'Not Met'], required: true },
        { no: '1.3', topic: 'Issues Identified', details: 'Detail any issues, incidents, or deviations from the SLA.', fieldKey: 'issuesIdentified', inputType: 'textarea' },
        { no: '1.4', topic: 'Action Plan', details: 'Outline the action plan to address any identified issues.', fieldKey: 'actionPlan', inputType: 'textarea' },
      ]
    }]
  },
  'termination': {
    key: 'termination', 
    label: FORMS.find(f => f.key === 'termination')?.label || '',
    isEditable: true,
    hasSignatures: false,
    topics: [
      { no: '1', topic: 'Termination Details', subTopics: [
          { no: '1.1', topic: 'Reason for Termination', details: 'e.g., Contract expired, Project completed, Non-performance', fieldKey: 'terminationReason', inputType: 'textarea', required: true },
          { no: '1.2', topic: 'Effective Date', details: '', fieldKey: 'effectiveDate', inputType: 'date', required: true },
          { no: '1.3', topic: 'Additional Notes', details: 'Add any relevant details about the termination process, final handovers, etc.', fieldKey: 'notes', inputType: 'textarea' },
        ]
      },
      { no: '2', topic: 'Exit Checklist', subTopics: [
          { no: '2.1', topic: 'All company data has been securely destroyed or returned.', fieldKey: 'dataDestructionConfirmed', inputType: 'checkbox' },
          { no: '2.2', topic: 'All company assets (laptops, badges, etc.) have been returned.', fieldKey: 'assetReturnConfirmed', inputType: 'checkbox' },
        ]
      }
    ]
  },
  'evaluation': {
    key: 'evaluation', 
    label: FORMS.find(f => f.key === 'evaluation')?.label || '',
    isEditable: true,
    hasSignatures: false,
    topics: [{ no: '1', topic: 'Performance Evaluation', subTopics: [
        { no: '1.1', topic: 'Evaluation Period', details: 'เช่น ประจำปี 2567, ไตรมาสที่ 4', fieldKey: 'evaluationPeriod', inputType: 'text', required: true },
        { no: '1.2', topic: 'Satisfaction Score (1-5)', details: 'ให้คะแนน 1 (น้อยที่สุด) ถึง 5 (มากที่สุด)', fieldKey: 'satisfactionScore', inputType: 'number', required: true },
        { no: '1.3', topic: 'Performance Summary', details: 'สรุปจุดเด่นและจุดที่ควรปรับปรุงของผู้ให้บริการ', fieldKey: 'summary', inputType: 'textarea', required: true },
        { no: '1.4', topic: 'Recommendations for Improvement', details: 'ให้ข้อเสนอแนะสำหรับการให้บริการในอนาคต', fieldKey: 'recommendations', inputType: 'textarea' },
      ]
    }]
  },
  'dataProtection': {
    key: 'dataProtection', 
    label: FORMS.find(f => f.key === 'dataProtection')?.label || '',
    isEditable: true,
    hasSignatures: false,
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
    const user = USERS_DB.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
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
    if (USERS_DB.some(u => u.username.toLowerCase() === username.toLowerCase())) {
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

    // Check for username uniqueness on update, case-insensitively
    if (updatedUser.username && USERS_DB.some(u => u.id !== updatedUser.id && u.username.toLowerCase() === updatedUser.username.toLowerCase())) {
        throw new Error("Username already exists.");
    }
    
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