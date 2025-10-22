import React from 'react';
import DataTablePage from '../common/DataTablePage';

const columns = [
    { key: 'createDate', header: 'Create Date', description: 'วันที่ลงทะเบียนผู้ใช้บริการ (ยึด PO หรือ MA ขึ้นอยู่ลักษณะการบริหารจัดการ Fourth Party)' },
    { key: 'fourthPartyId', header: 'Fourth Party Id', description: 'รหัสเลขเพิ่มรัน เช่น F2025-001 เพื่อเป็นการลงทะเบียนหมายเลขให้บริการ (เลขสามตัวท้ายจะอ้างอิงให้ตรงกับเลขของ Third Party ID' },
    { key: 'refThirdPartyUniqueId', header: 'Refer: Third Party Unique Id', description: 'อ้างอิงหมายเลขนิติบุคคลของผู้ให้บริการบุคคลภายนอก Third Party สำหรับ Fourth Party' },
    { key: 'refThirdPartyNameTH', header: 'Refer: Third Party name (TH)', description: 'อ้างอิงชื่อบริษัทหรือสถานประกอบการของผู้ให้บริการบุคคลภายนอกของ Fourth Party ที่รับจ้างช่วงจาก Third Party' },
    { key: 'refThirdPartyPO', header: 'Refer: Third Party Purchase Order', description: 'หมายเลช PO : Purchase Order ที่ฝ่ายจัดซื้อของธนาคารออกให้กับผู้ขายเพื่อสั่งซื้อสินค้าและบริการ ตามขอบเขต Third Party แล้ว' },
    { key: 'owner', header: 'Owner', description: 'ผู้รับผิดชอบหรือเจ้าของงาน/โครงการที่เกี่ยวข้องกับ Third Party สำหรับ Fourth Party' },
    { key: 'department', header: 'Department', description: 'ฝ่าย/หน่วยงานที่รับผิดชอบหรือเจ้าของงาน/โครงการที่เกี่ยวข้องกับ Third Party สำหรับ Fourth Party' },
    { key: 'fourthPartyUniqueId', header: 'Fourth Party Unique Id', description: 'เลขทะเบียนนิติบุคคลของบุคคลภายนอก (ทั้งนี้หากผู้ให้บริการ Third Partty มีการจ้างช่วง ให้ อ้างอิงไปถึง Fourth Party โดยใช้หมายเลขนิติบุคคลของผู้ว่าจ้างเป็นจุดเชื่อมโยง)' },
    { key: 'scopeOfWork', header: 'Scope of work Description', description: 'คำอธิบายเพิ่มเติมถึงขอบเขตของ Fourth Party' },
    { key: 'fourthPartyNameTH', header: 'Fourth Party name (TH)', description: 'ชื่อจดทะเบียนของบุคคลภายนอก ของ Fourth Party สำหรับการรับจ้างช่วงในการให้บริการ ในรูปแบบภาษาไทย' },
    { key: 'fourthPartyNameEN', header: 'Fourth Party name (ENG)', description: 'ชื่อจดทะเบียนของบุคคลภายนอก ของ Fourth Party สำหรับการรับจ้างช่วงในการให้บริการ ในรูปแบบภาษาอังกฤษ' },
    { key: 'typeOfBusiness', header: 'Type of business', description: 'ประเภทของธุรกิจที่ใช้บริการของ Fourth Party' },
    { key: 'serviceRiskLevel', header: 'Service Risk Level', description: 'ระบุระดับความเสี่ยงของการใช้บริการ ในการเชื่อมต่อระบบจากบุคคลภายนอก จากหลักเเกณฑ์ในการควบคุมความเสี่ยงของงานบริการหรือโครงการทั้งที่มีนัยสำคัญและไม่มีนัยะ ตาม Third Party เพื่อควบคุมความเสี่ยงให้เป็นระดับเดียวกันหรือสูงกว่า' },
    { key: 'fourthPartyStatus', header: 'Fourth Party Status', description: 'สถานะผู้ให้บริการภายนอกจ้างช่วง (กรณีติดตามผลการปฏิบัติงานของ Third Parrty เช่น Active , Termination , Blacklist) สถานะผู้ให้บริการภายนอกที่ไม่ผ่านการประเมินศักยภาพหรือไม่เป็นไปตามข้อกำหนดมาตรการรักษาความปลอดภัยทาง IT ตลอดจนจากการประเมินความเสี่ยงที่มีนัยสำคัญ' },
    { key: 'dataClassification', header: 'Data Classification', description: 'การประเมินผู้ให้บริการ Fourth Party ที่มีนัยสำคัญเดียวกันกับ Third Parrty' },
    { key: 'cloudComputing', header: 'Cloud Computing', description: 'การประเมินผู้ให้บริการ Fourth Party ที่มีนัยสำคัญเดียวกันกับ Third Parrty' },
    { key: 'bankWideImpact', header: 'Bank wide impact', description: 'การประเมินผู้ให้บริการ Fourth Party ที่มีนัยสำคัญเดียวกันกับ Third Parrty' },
    { key: 'dataAccess', header: 'Data Access', description: 'มีการประมวลผลเก็บข้อมูลต้องมีการจัดลำดับชั้นความลับตาม นโยบายชั้นความลับของผู้รับจ้างช่วง Fourth Party หรือไม่' },
    { key: 'serviceStartDate', header: 'Service Start Date', description: 'วัันที่เริ่มใช้บริการ ของ Fourth Party ตามเงื่อนไขสำคัญในการจัดทำสัญญา หรือข้อตกลง (หมายเหตุ : กรณีมีหลายสัญญาในประเภทให้บริการเดียวกัน (Third Party Type)) ให้ระบุที่ทำสัญญาใช้บริการแรกสุด' },
    { key: 'serviceEndDate', header: 'Service End Date', description: 'วัันที่สิ้นสุดใช้บริการ ของ Fourth Party ตามเงื่อนไขสำคัญในการจัดทำสัญญา หรือข้อตกลง (หมายเหตุ : กรณีมีหลายสัญญาในประเภทให้บริการเดียวกัน (Third Party Type)) ให้ระบุวันที่สิ้นสุดสัญญาล่าสุด' },
];

const initialData = [
    {
        createDate: '2024-03-20',
        fourthPartyId: 'F2024-001',
        refThirdPartyUniqueId: '0105558012345',
        refThirdPartyNameTH: 'บริษัท โมบาย ดีเวลอปเมนท์ จำกัด',
        refThirdPartyPO: 'PO-98765',
        owner: 'Supanan Ak-karadechawut',
        department: 'IT Operations',
        fourthPartyUniqueId: '0105560987654',
        scopeOfWork: 'Backend API development for payment gateway integration.',
        fourthPartyNameTH: 'บริษัท เอพีไอ คอนเน็ค จำกัด',
        fourthPartyNameEN: 'API Connect Co., Ltd.',
        typeOfBusiness: 'API Development',
        serviceRiskLevel: 'High',
        fourthPartyStatus: 'Active',
        dataClassification: 'Sensitive data',
        cloudComputing: 'No',
        bankWideImpact: 'Payment Gateway',
        dataAccess: 'Yes',
        serviceStartDate: '2024-04-01',
        serviceEndDate: '2024-12-31',
    },
];

const FourthPartyRegisterPage: React.FC = () => {
    return (
        <DataTablePage
            title="ทะเบียน Fourth Party"
            description="ทะเบียนสำหรับเก็บข้อมูลและติดตามสถานะของผู้ให้บริการช่วงต่อ (Fourth Party) ทั้งหมดขององค์กร"
            columns={columns}
            initialData={initialData}
        />
    );
};

export default FourthPartyRegisterPage;