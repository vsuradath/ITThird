import React from 'react';
import { SecurityMeasuresFormData } from '../SecurityMeasuresForm';
import { DetailedAssessmentRow, FormDefinition } from '../../../types';

const defaultRow: DetailedAssessmentRow = {
    result: 'ระบุ--',
    reason: '',
    reference: '',
    comment: '',
};

interface Props {
  data: SecurityMeasuresFormData;
  definition: FormDefinition;
}

const SecurityMeasuresPrintView: React.FC<Props> = ({ data, definition }) => {
    let rowIndex = 0;
    return (
        <div className="hidden print:block text-black p-4 font-sans">
            <h1 className="text-xl font-bold text-center mb-2">{definition.label.split('.')[0]}. {definition.label.split('.')[1]}</h1>
            <h2 className="text-lg text-center mb-6">สำหรับผู้ให้บริการภายนอก (IT Third Party)</h2>

            <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-6 border border-black p-4 text-sm">
                <p><strong>ชื่อบริษัทผู้ให้บริการ:</strong> {data.thirdPartyName || '................................'}</p>
                <p><strong>วันที่ประเมิน:</strong> {data.assessmentDate || '................................'}</p>
                <div className="col-span-2">
                    <p><strong>อ้างอิงตาม TOR / RFP จากโครงการ:</strong></p>
                    <p className="whitespace-pre-wrap pl-4">{data.torRfpReference || '................................'}</p>
                </div>
            </div>

            <h3 className="text-lg font-bold mb-2">รายละเอียดการประเมิน</h3>
            <table className="min-w-full border-collapse border border-black text-xs">
                <thead className="bg-gray-200 text-center font-bold">
                    <tr>
                        <th className="border border-black p-1 w-12">No.</th>
                        <th className="border border-black p-1">ประเมินข้อกำหนดมาตรการรักษาความปลอดภัยด้าน IT</th>
                        <th className="border border-black p-1 w-28">ผลการพิจารณา</th>
                        <th className="border border-black p-1">โปรดระบุลักษณะความเสี่ยงและมาตรการควบคุม</th>
                        <th className="border border-black p-1">เอกสารอ้างอิง</th>
                        <th className="border border-black p-1">ให้ความเห็น (ผู้สอบทาน)</th>
                    </tr>
                </thead>
                <tbody>
                    {definition.topics.map((mainTopic) => (
                        <React.Fragment key={mainTopic.no}>
                            {mainTopic.subTopics && mainTopic.subTopics.length > 0 ? (
                                <>
                                    <tr className="bg-gray-200 font-bold">
                                        <td className="border border-black p-1 text-center">{mainTopic.no}</td>
                                        <td colSpan={5} className="border border-black p-1">{mainTopic.topic}</td>
                                    </tr>
                                    {mainTopic.subTopics.map((subTopic) => {
                                        const currentIndex = rowIndex++;
                                        const row = data.assessmentRows[currentIndex] || defaultRow;
                                        return (
                                            <tr key={subTopic.no}>
                                                <td className="border border-black p-1 text-right">{subTopic.no}</td>
                                                <td className="border border-black p-1 pl-4">{subTopic.topic}</td>
                                                <td className="border border-black p-1 text-center">{row.result !== 'ระบุ--' ? row.result : ''}</td>
                                                <td className="border border-black p-1 whitespace-pre-wrap">{row.reason}</td>
                                                <td className="border border-black p-1 whitespace-pre-wrap">{row.reference}</td>
                                                <td className="border border-black p-1 whitespace-pre-wrap">{row.comment}</td>
                                            </tr>
                                        );
                                    })}
                                </>
                            ) : (
                                (() => {
                                    const currentIndex = rowIndex++;
                                    const row = data.assessmentRows[currentIndex] || defaultRow;
                                    return (
                                        <tr key={mainTopic.no}>
                                            <td className="border border-black p-1 text-center font-bold">{mainTopic.no}</td>
                                            <td className="border border-black p-1 font-bold">{mainTopic.topic}</td>
                                            <td className="border border-black p-1 text-center">{row.result !== 'ระบุ--' ? row.result : ''}</td>
                                            <td className="border border-black p-1 whitespace-pre-wrap">{row.reason}</td>
                                            <td className="border border-black p-1 whitespace-pre-wrap">{row.reference}</td>
                                            <td className="border border-black p-1 whitespace-pre-wrap">{row.comment}</td>
                                        </tr>
                                    );
                                })()
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>

            <div className="mt-6 border-t border-black pt-4 text-sm">
                <h3 className="text-lg font-bold mb-2">สรุปความเห็นของผู้ประเมิน</h3>
                <div className="pl-4">
                    <p>
                        [&nbsp;{data.summaryStatus === 'sufficient' ? 'X' : ' '}&nbsp;] มีข้อกำหนดเป็นไปตามมาตรการรักษาความปลอดภัยด้าน IT
                        {data.summaryStatus === 'sufficient' && <span className="pl-4">เหตุผล: {data.sufficientReason}</span>}
                    </p>
                    <p>
                        [&nbsp;{data.summaryStatus === 'insufficient' ? 'X' : ' '}&nbsp;] ไม่เป็นไปตามมาตรการรักษาความปลอดภัยด้าน IT
                        {data.summaryStatus === 'insufficient' && <span className="pl-4">เหตุผล: {data.insufficientReason}</span>}
                    </p>
                </div>
            </div>

            <div style={{ pageBreakInside: 'avoid', marginTop: '4rem' }}>
                <div className="grid grid-cols-2 gap-8 text-sm">
                    <div className="text-center">
                        <p className="mb-16">................................................................</p>
                        <p>( {data.assessorSignature.name || '...................................'} )</p>
                        <p>ผู้ประเมิน</p>
                        <p>ตำแหน่ง: {data.assessorSignature.position || '...................................'}</p>
                        <p>หน่วยงาน: {data.assessorSignature.department || '...................................'}</p>
                        <p>วันที่: {data.assessorSignature.date || '...................................'}</p>
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
                รหัสแบบฟอร์ม ITD-2025-THP002
            </div>
        </div>
    );
};

export default SecurityMeasuresPrintView;
