import React from 'react';
import DataTablePage from '../common/DataTablePage';

const columns = [
    { key: 'createDate', header: 'Create Date', description: 'วันที่ลงทะเบียนผู้ใช้บริการ (ยึดวันที่ เอกสาร Registration ขึ้นอยู่ลักษณะการบริหารจัดการ Third Party และต้องได้รับการยืนันจากฝ่ายบริหาร)' },
    { key: 'thirdPartyId', header: 'Third Party Id', description: 'รหัสเลขเพิ่มรัน เช่น T2025-001 เพื่อเป็นการลงทะเบียนหมายเลขให้บริการ' },
    { key: 'owner', header: 'Owner', description: 'ผู้รับผิดชอบหรือเจ้าของงาน/โครงการที่เกี่ยวข้องกับ Third Party' },
    { key: 'department', header: 'Department', description: 'ฝ่าย/หน่วยงานที่รับผิดชอบหรือเจ้าของงาน/โครงการที่เกี่ยวข้องกับ Third Party' },
    { key: 'vendorAccount', header: 'Vendor Account', description: 'รหัสผู้ให้บริการ/ผู้รับเหมา/ผู้ขายในระบบ ERP' },
    { key: 'purchaseOrder', header: 'Purchase Order (PO)', description: 'หมายเลช PO : Purchase Order ที่ฝ่ายจัดซื้อของธนาคารออกให้กับผู้ขายเพื่อสั่งซื้อสินค้าและบริการ ตามขอบเขต Third Party แล้ว' },
    { key: 'netAmount', header: 'Net amount', description: 'งบประมาณที่ใช้โดยรวมของทั้งระบบงานหรือโครงการ' },
    { key: 'erpStatus', header: 'ERP Status', description: 'อ้างอิง ERP ของสถานะของผู้ให้บริการภายนอก' },
    { key: 'procurementCategory', header: 'Procurement Category', description: 'การใช้งบตามหมวดหมู่ของกระบวนการจัดซื้อและบัญชี ตลอดจนประเภทของทรัพย์สินที่ใช้ในระบบ ERP' },
    { key: 'servicesName', header: 'Services Name', description: 'ระบบ application หรือ ระบบอื่นๆ นี้ที่จ้างมา มีวัตถุประสงค์อะไร? หรือ รูปแบบการให้บริการต่างๆ หรือ บริการต่างๆ เช่น Network' },
    { key: 'serviceType', header: 'Service Type', description: 'ประเภทการใช้บริการ การเชื่อมต่อ หรือการเข้าถึงข้อมูลจากบุคคลภายนอก เช่น IT Outsourcing cloud computing, บริการร่วมกับพันธมิิตรทางธุรกิจ, การใช้บริการเครือข่าย, การใช้บริการชำระเงินกลาง เป็นต้น' },
    { key: 'dataClassification', header: 'Data Classification (Data Access)', description: 'การประเมินผู้ให้บริการ Third Party ที่มีนัยสำคัญในการเข้าถึงข้อมูลของลูกค้าหรือบริษัทในระดับใด' },
    { key: 'cloudComputing', header: 'Cloud Computing', description: 'การประเมินผู้ให้บริการ Third Party ที่มีนัยสำคัญ ธนาคารไม่เคยใช้งาน' },
    { key: 'bankWideImpact', header: 'Bank wide impact', description: 'การประเมินผู้ให้บริการ Third Party ที่มีนัยสำคัญ ที่เกี่ยวข้องหรือกระทบกับระบบงานหรือการให้บริการที่สำคัญ' },
    { key: 'dataProtection', header: 'Data Protection', description: 'การประเมินหน่วยงานภายนอกด้านการคุ้มครองข้อมูลส่วนบุคคล (Third Party Assessment - Data Privacy Protection)' },
    { key: 'importanceSignificance', header: 'Importance / Significance', description: 'สถานะจากการประเมินผู้ให้บริการ Third Party แล้ว ว่าเข้าหลักเกณฑ์ที่มีนัยสำคัญหรือไม่?' },
    { key: 'buSupport', header: 'BU Support', description: 'แยกประเภทการให้บริการบนทะเบียน IT Third Party, IT Outsource และ Vendor ออกให้ชัดเจน' },
    { key: 'contractTerm', header: 'Contract Term', description: 'ระยะเวลาที่สัญญามีผลบังคับใช้ ให้ระบุ เป็นจำนวนเดือน' },
    { key: 'thirdPartyNameTH', header: 'Third Party name (TH)', description: 'ชื่อจดทะเบียนของบุคคลภายนอก ในรูปแบบภาษาไทย' },
    { key: 'typeOfBusiness', header: 'Type of business', description: 'ประเภทของธุรกิจที่ใช้บริการ' },
    { key: 'thirdPartyStatus', header: 'Third Party Status', description: 'สถานะผู้ให้บริการภายนอก (กรณีติดตามผลการปฏิบัติงานของ Third Parrty เช่น Active , Termination , Blacklist)' },
    { key: 'criticalLevel', header: 'Critical Level', description: 'ระบุระดับที่มีความสำคัญหรือเร่งด่วนสูงสุด' },
    { key: 'dataRecoveryCountry', header: 'Data Recovery Country', description: 'DR ตั้งอยู่ที่ไหน' },
    { key: 'certificate', header: 'Certificate', description: 'เช่น ISO27001 , SOC2 เป็นต้น' },
    { key: 'dataAccess', header: 'Data Access', description: 'มีการประมวลผลเก็บข้อมูลต้องมีการจัดลำดับชั้นความลับตาม นโยบายชั้นความลับ หรือไม่' },
    { key: 'dataSetDate', header: 'Data Set Date', description: 'วันที่ของชุดข้อมูล' },
    { key: 'organizationId', header: 'Organization Id', description: 'รหัสผู้ส่งข้อมูล' },
    { key: 'thirdPartyUniqueId', header: 'Third Party Unique Id', description: 'เลขทะเบียนนิติบุคคลของบุคคลภายนอก (ทั้งนี้หากผู้ให้บริการ Third Partty มีการจ้างช่วง ให้ อ้างอิงไปถึง Fourth Party โดยใช้หมายเลขนิติบุคคลของผู้ว่าจ้างเป็นจุดเชื่อมโยง)' },
    { key: 'thirdPartyUniqueIdType', header: 'Third Party Unique Id Type', description: 'ประเภทรหัสของบุคคลภายนอก' },
    { key: 'thirdPartyNameEN', header: 'Third Party Name', description: 'ชื่อจดทะเบียนของบุคคลภายนอก ในรูปแบบภาษาอังกฤษ' },
    { key: 'relationship', header: 'Relationship', description: 'ความเกี่ยวข้องของสถาบันการเงินกับบุคคลภายนอก' },
    { key: 'registeredCountry', header: 'Registered Country', description: 'ประเทศที่ตั้งตามที่จดทะเบียนของบุคคลภายนอก' },
    { key: 'thirdPartyType', header: 'Third Party Type', description: 'ประเภทการให้บริการและการเชื่อมต่อระบบจากบุคคลภายนอก' },
    { key: 'workType', header: 'Work type', description: 'ประเภทที่ให้บริการโดยผู้ให้บริการภายนอก' },
    { key: 'integrationType', header: 'Integration Type', description: 'ประเภทการเชื่อมต่อระบบกับบุคคลภายนอก' },
    { key: 'scopeOfWork', header: 'Scope of work', description: 'คำอธิบายเพิ่มเติมถึงขอบเขตของการให้บริการและการเชื่อมต่อระบบจากบุคคลภายนอก' },
    { key: 'serviceStartDate', header: 'Service Start Date', description: 'วันที่เริ่มใช้บริการ (หมายเหตุ : กรณีมีหลายสัญญาในประเภทให้บริการเดียวกัน (Third Party Type)) ให้ระบุที่ทำสัญญาใช้บริการแรกสุด' },
    { key: 'serviceEndDate', header: 'Service End Date', description: 'วันที่สิ้นสุดใช้บริการ (หมายเหตุ : กรณีมีหลายสัญญาในประเภทให้บริการเดียวกัน (Third Party Type)) ให้ระบุวันที่สิ้นสุดสัญญาล่าสุด' },
    { key: 'serviceRiskLevel', header: 'Service Risk Level', description: 'ระบุระดับความเสี่ยงของการใช้บริการ ในการเชื่อมต่อระบบจากบุคคลภายนอก จากหลักเเกณฑ์ในการควบคุมความเสี่ยงของงานบริการหรือโครงการทั้งที่มีนัยสำคัญและไม่มีนัยะ' },
    { key: 'serviceSLA', header: 'Service SLA', description: 'ผลการปฏิบัติงานตามข้อตกลง (SLA) ที่กำหนดในสัญญาที่ทำกับบุคคลภายนอก' },
    { key: 'cloudType', header: 'Cloud Type', description: 'รูปแบบการใช้บริการของ Cloud' },
    { key: 'dataCenterCountry', header: 'Data Center Country', description: 'DC ตั้งอยู่ที่ไหน : รหัสประเทศที่ตั้ง (อ้างอิงจากเอกสาร DMS Classification) ของศูนย์คอมพิวเตอร์หลักและศูนย์คอมพิวเตอร์สำรองของบุคคลภายนอก' },
    { 
        key: 'isDone', 
        header: 'ดำเนินการรึยัง', 
        description: 'สถานะการดำเนินการของรายการนี้',
        // FIX: Use 'as const' to ensure TypeScript infers the literal type 'select' instead of 'string'.
        inputType: 'select' as const,
        options: ['ดำเนินการแล้ว', 'ยังไม่ดำเนินการ', 'กำลังดำเนินการ']
    },
];

const initialData = [
  {
    createDate: '2024-01-15',
    thirdPartyId: 'T2024-001',
    owner: 'Supanan Ak-karadechawut',
    department: 'IT Operations',
    vendorAccount: 'V01234',
    purchaseOrder: 'PO-98765',
    netAmount: '5,000,000 THB',
    erpStatus: 'Active',
    procurementCategory: 'Software Development',
    servicesName: 'New Mobile App',
    serviceType: 'IT Outsourcing',
    dataClassification: 'Sensitive data',
    cloudComputing: 'No',
    bankWideImpact: 'Mobile banking',
    dataProtection: 'Pass',
    importanceSignificance: 'Yes',
    buSupport: 'IT Outsource',
    contractTerm: '12 months',
    thirdPartyNameTH: 'บริษัท โมบาย ดีเวลอปเมนท์ จำกัด',
    typeOfBusiness: 'Software House',
    thirdPartyStatus: 'Active',
    criticalLevel: 'High',
    dataRecoveryCountry: 'Thailand',
    certificate: 'ISO27001',
    dataAccess: 'Yes',
    dataSetDate: '2024-01-10',
    organizationId: 'ORG-002',
    thirdPartyUniqueId: '0105558012345',
    thirdPartyUniqueIdType: 'Juristic Id',
    thirdPartyNameEN: 'Mobile Development Co., Ltd.',
    relationship: 'Non-Consolidated Company',
    registeredCountry: 'Thailand',
    thirdPartyType: 'Other IT Outsourcing - Service Channel',
    workType: 'Production Support',
    integrationType: 'API',
    scopeOfWork: 'Develop and maintain the new mobile banking application.',
    serviceStartDate: '2024-02-01',
    serviceEndDate: '2025-01-31',
    serviceRiskLevel: 'High',
    serviceSLA: 'Pass',
    cloudType: 'Non-cloud',
    dataCenterCountry: 'Thailand',
    isDone: 'กำลังดำเนินการ'
  }
];

const ITThirdPartyRegisterPage: React.FC = () => {
    return (
        <DataTablePage
            title="ทะเบียน IT Third Party"
            description="ทะเบียนสำหรับเก็บข้อมูลและติดตามสถานะของผู้ให้บริการภายนอก (Third Party) ทั้งหมดขององค์กร"
            columns={columns}
            initialData={initialData}
        />
    );
};

export default ITThirdPartyRegisterPage;