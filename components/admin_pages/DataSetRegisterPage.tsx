import React from 'react';
import EditableListPage from './EditableListPage';

const DataSetRegisterPage: React.FC = () => {
    return (
        <EditableListPage
            title="ทะเบียน Data Set"
            description="จัดการทะเบียนชุดข้อมูล (Data Sets) ที่มีการเข้าถึงโดยบุคคลภายนอก"
        />
    );
};

export default DataSetRegisterPage;
