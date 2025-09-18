import React, { useState } from 'react';
import { DetailedAssessmentRow, DetailedCapabilityAssessmentData } from '../../types';
import { TextArea, TextInput } from '../FormContainer';

const TOPICS = [
    { no: '1', topic: 'ฐานะทางการเงิน และชื่อเสียง', details: '1.1. ฐานะทางการเงิน - ความมั่นคงทางการเงิน(ทุนจดทะเบียน, กำไรสุทธิ, สภาพคล่องทางการเงิน, การบริหารจัดการสินทรัพย์และหนี้สิน)\n** กรณีการทบทวนรายปี ต้องพิจารณาฐานะของผู้ให้บริการในช่วง 1 ปีที่ผ่านมาเมื่อเปรียบเทียบกับปีก่อน ไม่มีการเปลี่ยนแปลงอย่างมีนัยสำคัญ ซึ่งอาจมีผลต่อการให้บริการต่อธนาคารได้ ***' },
    { no: '2', topic: 'ชื่อเสียง', details: '2.1. ชื่อเสียง ภาพลักษณ์องค์กร ภาพลักษณ์ผู้บริหาร\n2.2. ผลการตรวจสอบ Datamart และ Special list ของ นิติบคุคลและกรรมการ\n2.3. ผลตรวจสอบรายชื่อจากระบบ RPT เพื่อตรวจสอบการมีส่วนเกี่ยวข้องกับคณะกรรมการและผู้บริหารระดับสูง ของธนาคารรวมทั้งผู้เกี่ยวข้อง\n2.4. การบริหารงานทั่วไปหรืออื่น ๆ' },
    { no: '3', topic: 'ความรู้ความเชี่ยวชาญ ความเชี่ยวชาญในเทคโนโลยีระบบงาน ที่ให้บริการ', details: '3.1. ความเชี่ยวชาญในเทคโนโลยีระบบงาน ที่ให้บริการ\n3.2. ประสบการณ์ในการให้บริการ ในเทคโนโลยี ระบบงาน ที่ให้บริการ, Customer site reference\n3.3. การบริหารจัดการโครงการ\n3.4. การบริหารจัดการด้านทรัพยากรให้รองรับการให้บริการ\n3.5. การบริหารงานทั่วไปหรืออื่น ๆ' },
    { no: '4', topic: 'ธรรมาภิบาลและวัฒนธรรมองค์กรของบุคคลภายนอก', details: 'การดำเนินธุรกิจอย่างโปร่งใส เปิดเผย\nมีความรับผิดชอบ และแก้ไขปัญหาอย่างจริงจัง\nมีจริยธรรมในการดำเนินธุรกิจ\nมีการถ่วงดุลอำนาจแบบ 3 lines of defense\nมีกระบวนการตรวจสอบภายใน' },
    { no: '5', topic: 'การบริหารจัดการความเสี่ยง และการควบคุมภายใน', details: 'มีกระบวนการประเมิน และบริหารความเสี่ยงภายใน' },
    { no: '6', topic: 'การรักษาความมั่นคงปลอดภัยด้านเทคโนโลยีสารสนเทศ', details: 'อ้างอิง IT-Security requirement' },
    { no: '7', topic: 'การบริหารจัดการความต่อเนื่องทางธุรกิจ หรือความพร้อมรับมือภัยหรือเหตุการณ์ต่างๆ ทั้งแผน BCP และทดสอบแผน BCP ตลอดจน แผน DR และ Backup & Recovery', details: ' ' },
    { no: '8', topic: 'การตรวจสอบจากหน่วยงานตรวจสอบภายใน และหน่วยงานตรวจสอบภายนอก', details: ' ' },
    { no: '9', topic: 'การปฏิบัติตามกฎหมายและกฎเกณฑ์ที่เกี่ยวข้อง', details: '(1) การขอรับรองจากบุคคลภายนอก\n(2) ใบอนุญาต\n(3) การดำเนินการตามกฎหมายและกฎเกณฑ์ที่เกี่ยวข้อง เป็นต้น' },
    { no: '10', topic: 'การปฏิบัติตามมาตรฐานสากลด้านเทคโนโลยีสารสนเทศ', details: '(1) การขอตรวจสอบการได้รับการรับรองตามมาตรฐาน ISO 27001 เป็นต้น\n(2) กรณีที่มีการรับรองมาตรฐานอื่น ๆ ให้ระบุและแนบเอกสารรับรอง' },
    { no: '11', topic: 'กรณีผู้ให้บริการตั้งอยู่ต่างประเทศ หรือมีผู้ถือหุ้นหลัก หรือผู้บริหารหลักเป็นคนต่างชาติ อาจมีความเสี่ยงจากปัจจัยภายนอกที่อาจกระทบต่อการให้บริการของบุคคลภายนอก', details: '(1) สถานการณ์ทางการเมือง\n(2) ข้อจำกัดด้านกฎหมายของประเทศที่บุคคลภายนอกตั้งอยู่' },
    { no: '12', topic: 'ความเสี่ยงในกรณีผู้ให้บริการภายนอกให้บริการแก่หลายสถาบันการเงิน (Concentration Risk)', details: '(1) การบริหารจัดการทรัพยากร - ผู้ให้บริการภายนอก มีทรัพยากรต่าง ๆ และบุคลากรที่เพียงพอสามารถให้บริการแก่ธนาคารและสถาบันการเงินอื่นได้ โดยมีผลงานเป็นไปตามมาตรฐานการให้บริการขั้นต่ำตามที่ธนาคารกำหนด' },
    { no: '13', topic: 'การใช้เทคโนโลยีแบบเปิด (Open Technology) เพื่อให้สามารถนำระบบไปใช้งานหรือเชื่อมโยงกับระบบอื่นได้ (Interoperability)', details: ' ' }
];

const initialRows: DetailedAssessmentRow[] = Array(13).fill({
    result: 'ระบุ--',
    reason: '',
    reference: '',
    comment: ''
});

const initialDataStructure: DetailedCapabilityAssessmentData = {
    assessmentRows: initialRows,
    summaryStatus: 'none',
    sufficientReason: '',
    insufficientReason: '',
    assessorSignature: { name: '', position: '', department: '', date: '' },
    reviewerSignature: { name: '', position: '', department: '', date: '' },
};

interface Props {
  onSubmit: (data: DetailedCapabilityAssessmentData) => void;
  headerData: any;
  initialData?: DetailedCapabilityAssessmentData;
  isReadOnly?: boolean;
}

const DetailedCapabilityAssessmentForm: React.FC<Props> = ({ onSubmit, headerData, initialData, isReadOnly }) => {
    const [formData, setFormData] = useState<DetailedCapabilityAssessmentData>(initialData || initialDataStructure);

    const handleRowChange = (index: number, field: keyof DetailedAssessmentRow, value: string) => {
        const newRows = [...formData.assessmentRows];
        newRows[index] = { ...newRows[index], [field]: value };
        setFormData(prev => ({ ...prev, assessmentRows: newRows }));
    };

    const handleSummaryChange = (field: keyof DetailedCapabilityAssessmentData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };
    
    const handleSignatureChange = (
        signer: 'assessorSignature' | 'reviewerSignature', 
        field: keyof DetailedCapabilityAssessmentData['assessorSignature'], 
        value: string
    ) => {
        setFormData(prev => ({
            ...prev,
            [signer]: {
                ...prev[signer],
                [field]: value,
            },
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">แบบการประเมินศักยภาพของบุคคลภายนอกด้านงานเทคโนโลยีสารสนเทศ</h2>
            <p className="text-gray-600 mb-6">สำหรับผู้ให้บริการภายนอก (IT Third Party)</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 border rounded-md bg-gray-50 text-sm">
                <div><strong>ชื่อบริษัทผู้ให้บริการ:</strong> {headerData.thirdPartyName}</div>
                <div><strong>วันที่ประเมิน:</strong> {headerData.assessmentDate}</div>
                <div><strong>อ้างอิงตาม TOR / RFP:</strong> {headerData.torRfpReference}</div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse border border-gray-300 text-sm">
                        <thead className="bg-gray-100 text-center font-semibold">
                            <tr>
                                <th className="border border-gray-300 p-2 w-12">No.</th>
                                <th className="border border-gray-300 p-2">หัวข้อการประเมิน</th>
                                <th className="border border-gray-300 p-2">รายละเอียดที่ควรพิจารณา</th>
                                <th className="border border-gray-300 p-2 w-40">ผลการพิจารณา</th>
                                <th className="border border-gray-300 p-2">เหตุผลประกอบการพิจารณา</th>
                                <th className="border border-gray-300 p-2">เอกสารอ้างอิง</th>
                                <th className="border border-gray-300 p-2">Comment จากผู้ประเมิน/ผู้สอบทาน</th>
                            </tr>
                        </thead>
                        <tbody>
                            {TOPICS.map((item, index) => (
                                <tr key={item.no}>
                                    <td className="border border-gray-300 p-2 text-center font-semibold">{item.no}</td>
                                    <td className="border border-gray-300 p-2 font-semibold">{item.topic}</td>
                                    <td className="border border-gray-300 p-2 whitespace-pre-wrap">{item.details}</td>
                                    <td className="border border-gray-300 p-2">
                                        <select 
                                            value={formData.assessmentRows[index]?.result || 'ระบุ--'} 
                                            onChange={e => handleRowChange(index, 'result', e.target.value)}
                                            disabled={isReadOnly}
                                            className="w-full p-1 border border-gray-300 rounded bg-white text-black disabled:bg-gray-100"
                                        >
                                            <option>ระบุ--</option>
                                            <option>ผ่าน</option>
                                            <option>ไม่ผ่าน</option>
                                            <option>ไม่มีข้อมูล</option>
                                        </select>
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                        <TextArea rows={3} value={formData.assessmentRows[index]?.reason || ''} onChange={e => handleRowChange(index, 'reason', e.target.value)} disabled={isReadOnly} />
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                        <TextArea rows={3} value={formData.assessmentRows[index]?.reference || ''} onChange={e => handleRowChange(index, 'reference', e.target.value)} disabled={isReadOnly} />
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                        <TextArea rows={3} value={formData.assessmentRows[index]?.comment || ''} onChange={e => handleRowChange(index, 'comment', e.target.value)} disabled={isReadOnly} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-8 border-t pt-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">สรุปความเห็นของผู้ประเมิน</h3>
                    <div className="space-y-4">
                        <div className="flex items-start">
                            <input 
                                type="radio" 
                                id="sufficient" 
                                name="summaryStatus" 
                                checked={formData.summaryStatus === 'sufficient'}
                                onChange={() => handleSummaryChange('summaryStatus', 'sufficient')}
                                disabled={isReadOnly}
                                className="mt-1"
                            />
                            <div className="ml-3 flex-1">
                                <label htmlFor="sufficient" className="font-medium text-gray-700">มีศักยภาพเพียงพอในการปฏิบัติงาน</label>
                                <TextArea 
                                    placeholder="เหตุผล" 
                                    rows={2} 
                                    value={formData.sufficientReason}
                                    onChange={(e) => handleSummaryChange('sufficientReason', e.target.value)}
                                    disabled={isReadOnly || formData.summaryStatus !== 'sufficient'}
                                    className="mt-1" 
                                />
                            </div>
                        </div>
                         <div className="flex items-start">
                            <input 
                                type="radio" 
                                id="insufficient" 
                                name="summaryStatus"
                                checked={formData.summaryStatus === 'insufficient'}
                                onChange={() => handleSummaryChange('summaryStatus', 'insufficient')}
                                disabled={isReadOnly}
                                className="mt-1"
                            />
                            <div className="ml-3 flex-1">
                                <label htmlFor="insufficient" className="font-medium text-gray-700">ไม่มีศักยภาพเพียงพอในการปฏิบัติงาน</label>
                                <TextArea 
                                    placeholder="เหตุผล" 
                                    rows={2} 
                                    value={formData.insufficientReason}
                                    onChange={(e) => handleSummaryChange('insufficientReason', e.target.value)}
                                    disabled={isReadOnly || formData.summaryStatus !== 'insufficient'}
                                    className="mt-1" 
                                />
                            </div>
                        </div>
                    </div>
                </div>

                 <div className="mt-8 border-t pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Assessor Column */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">ผู้ประเมิน</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">ผู้ประเมิน</label>
                                    <TextInput value={formData.assessorSignature?.name || ''} onChange={e => handleSignatureChange('assessorSignature', 'name', e.target.value)} disabled={isReadOnly} placeholder="(................)"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">ตำแหน่ง</label>
                                    <TextInput value={formData.assessorSignature?.position || ''} onChange={e => handleSignatureChange('assessorSignature', 'position', e.target.value)} disabled={isReadOnly} placeholder="กรอกตำแหน่ง"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">หน่วยงาน</label>
                                    <TextInput value={formData.assessorSignature?.department || ''} onChange={e => handleSignatureChange('assessorSignature', 'department', e.target.value)} disabled={isReadOnly} placeholder="กรอกหน่วยงาน"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">วันที่ประเมิน</label>
                                    <TextInput type="date" value={formData.assessorSignature?.date || ''} onChange={e => handleSignatureChange('assessorSignature', 'date', e.target.value)} disabled={isReadOnly}/>
                                </div>
                            </div>
                        </div>
                        {/* Reviewer Column */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">ผู้สอบทาน</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">ผู้สอบทาน</label>
                                    <TextInput value={formData.reviewerSignature?.name || ''} disabled={true} placeholder="(................)"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">ตำแหน่ง</label>
                                    <TextInput value={formData.reviewerSignature?.position || ''} disabled={true} placeholder="กรอกตำแหน่ง"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">หน่วยงาน</label>
                                    <TextInput value={formData.reviewerSignature?.department || ''} disabled={true} placeholder="กรอกหน่วยงาน"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">วันที่สอบทาน</label>
                                    <TextInput type="date" value={formData.reviewerSignature?.date || ''} disabled={true}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {!isReadOnly && (
                    <div className="flex justify-end pt-8">
                        <button
                            type="submit"
                            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all"
                        >
                            Submit Detailed Assessment
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default DetailedCapabilityAssessmentForm;