import React from 'react';
import { FormDefinition } from '../../../types';

interface Props {
  data: Record<string, any>;
  definition: FormDefinition;
}

const RegistrationPrintView: React.FC<Props> = ({ data, definition }) => {
    return (
        <div className="hidden print:block text-black p-4 font-sans">
            <h1 className="text-xl font-bold text-center mb-6">{definition.label}</h1>

            <div className="border border-black p-4 text-sm space-y-4">
                {definition.topics.map(topic => (
                    <div key={topic.no} className="border-b border-gray-300 last:border-b-0 pb-2 mb-2">
                         <h3 className="font-bold mb-2">{topic.topic}</h3>
                         <div className="grid grid-cols-2 gap-x-8 gap-y-2 pl-4">
                            {topic.subTopics?.map(st => {
                                const value = data[st.fieldKey] || '....................';
                                return (
                                     <div key={st.fieldKey}>
                                        <strong>{st.topic}:</strong>{' '}
                                        {st.inputType === 'checkbox' ? (value ? 'Yes' : 'No') : value}
                                     </div>
                                );
                            })}
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
                รหัสแบบฟอร์ม ITD-2025-THP003
            </div>
        </div>
    );
};

export default RegistrationPrintView;