import React from 'react';
import DocumentManagementPage from './DocumentManagementPage';

const ManualsAndDocumentsPage: React.FC = () => {
    return (
        <DocumentManagementPage
            title="คู่มือและเอกสารอื่นฯ"
            description="จัดการคู่มือการใช้งานและเอกสารอื่นๆ ที่เกี่ยวข้อง โดยสามารถเพิ่ม/ลบ/แก้ไขหัวข้อ, คำอธิบาย, และแนบไฟล์เอกสารได้"
        />
    );
};

export default ManualsAndDocumentsPage;
