import React from 'react';
import DocumentManagementPage from './DocumentManagementPage';

const PoliciesAndRegulationsPage: React.FC = () => {
    return (
        <DocumentManagementPage
            title="นโยบายและระเบียบปฏิบัติ"
            description="จัดการรายการนโยบายและระเบียบปฏิบัติที่เกี่ยวข้องกับการกำกับดูแล IT Third Party โดยสามารถเพิ่ม/ลบ/แก้ไขหัวข้อ, คำอธิบาย, และแนบไฟล์เอกสารได้"
        />
    );
};

export default PoliciesAndRegulationsPage;
