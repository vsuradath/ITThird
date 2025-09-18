import React from 'react';
import { FormDefinition } from '../../../types';

interface Props {
  data: Record<string, any>;
  definition: FormDefinition;
}

const RiskAssessmentPrintView: React.FC<Props> = ({ data, definition }) => {
    return (
        <div className="hidden print:block text-black p-4 font-sans">
            <h1 className="text-xl font-bold text-center mb-6">{definition.label}</h1>
            
            <div className="border border-black p-4 text-sm space-y-4 mt-6">
                {definition.topics.map(topic => (
                    <div key={topic.no}>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                        {topic.subTopics?.map(st => (
                            <div key={st.fieldKey} className={st.inputType === 'textarea' ? 'col-span-2' : ''}>
                                <p><strong>{st.topic}:</strong></p>
                                <p className="whitespace-pre-wrap pl-4">{data[st.fieldKey] || '....................'}</p>
                            </div>
                        ))}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ pageBreakInside: 'avoid', marginTop: '4rem' }}>
                <div className="grid grid-cols-2 gap-8 text-sm">
                    <div className="text-center">
                        <p className="mb-16">................................................................</p>
                        <p>( {data.assessorSignature?.name || '...................................'} )</p>
                        <p>ผู้ประเมิน</p>
                        <p>ตำแหน่ง: {data.assessorSignature?.position || '...................................'}</p>
                        <p>หน่วยงาน: {data.assessorSignature?.department || '...................................'}</p>
                        <p>วันที่: {data.assessorSignature?.date || '...................................'}</p>
                    </div>
                    <div className="text-center">
                        <p className="mb-16">................................................................</p>
                        <p>( ................................................................ )</p>
                        <p>ผู้สอบทาน</p>
                        <p>ตำแหน่ง: ................................................................</p>
                        <p>หน่วยงาน: ................................................................</p>
                        <p>วันที่: ................................................................</p>
                    </div>
                </div>
            </div>
            
            <div className="mt-8 pt-4 border-t border-black text-left text-xs text-gray-600">
                รหัสแบบฟอร์ม ITD-2025-THP004
            </div>
        </div>
    );
};

export default RiskAssessmentPrintView;