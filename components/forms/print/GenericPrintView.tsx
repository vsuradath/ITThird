import React from 'react';
import { FormDefinition } from '../../../types';

interface Props {
  data: Record<string, any>;
  definition: FormDefinition;
}

const GenericPrintView: React.FC<Props> = ({ data, definition }) => {
    return (
        <div className="hidden print:block text-black p-4 font-sans">
            <h1 className="text-xl font-bold text-center mb-6">{definition.label}</h1>
            
            <div className="border border-black p-4 text-sm space-y-4 mt-6">
                {definition.topics.map(topic => (
                    <div key={topic.no} className="pt-2 first:pt-0">
                        <h3 className="font-bold mb-2">{topic.no}. {topic.topic}</h3>
                         {topic.fieldKey && (
                            <div>
                               <p className="whitespace-pre-wrap pl-4">{data[topic.fieldKey] || '....................'}</p>
                            </div>
                         )}
                        <div className="grid grid-cols-2 gap-x-8 gap-y-4 pl-4">
                        {topic.subTopics?.map(st => (
                            <div key={st.fieldKey} className={st.inputType === 'textarea' ? 'col-span-2' : 'col-span-1'}>
                                <p><strong>{st.topic}:</strong></p>
                                <p className="whitespace-pre-wrap pl-4">
                                    {st.inputType === 'checkbox'
                                        ? (data[st.fieldKey!] ? 'Yes' : 'No')
                                        : (data[st.fieldKey!] || '....................')
                                    }
                                </p>
                            </div>
                        ))}
                        </div>
                    </div>
                ))}
            </div>

            {definition.hasSignatures && (
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
            )}
            
            <div className="mt-8 pt-4 border-t border-black text-left text-xs text-gray-600">
                {/* This could also be part of the form definition */}
            </div>
        </div>
    );
};

export default GenericPrintView;
