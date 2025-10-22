import React from 'react';
import { RegistrationFormData } from '../RegistrationForm';
import { FormDefinition } from '../../../types';

interface Props {
  data: RegistrationFormData;
  definition?: FormDefinition;
}

const RegistrationPrintView: React.FC<Props> = ({ data, definition }) => {
    const getLabel = (key: string, fallback: string) => {
        if (!definition) return fallback;
        for (const topic of definition.topics) {
            if (topic.no === key) return topic.topic;
            if (topic.subTopics) {
                for (const sub of topic.subTopics) {
                    if (sub.no === key) return sub.topic;
                }
            }
        }
        return fallback;
    };

    return (
        <div className="hidden print:block text-black p-4 font-sans text-xs">
            <h1 className="text-base font-bold text-center">{definition?.label || 'แบบฟอร์มการลงทะเบียนการใช้บริการบุคคลภายนอก (3rd Party Registration)'}</h1>
            <div className="text-right text-xs mb-2">
                รหัสแบบฟอร์ม ITD-2025-THP003
            </div>

            <div className="border border-black p-2 mt-4">
                <h2 className="text-sm font-bold bg-gray-200 p-1">{getLabel('p1_header', 'ส่วนที่ 1 : รายละเอียดทะเบียน 3rd Party')}</h2>
                
                <div className="mt-2">
                    <h3 className="font-bold">{getLabel('p1_s1', '1. ฝ่ายงานที่ขอประเมิน')}</h3>
                    <div className="grid grid-cols-2 gap-x-4 pl-4">
                        <p><strong>{getLabel('p1_s1_f1', 'วันที่ลงทะเบียน')}:</strong> {data.registerDate || '................'}</p>
                        <p><strong>{getLabel('p1_s1_f2', 'สายงาน')}:</strong> {data.businessUnit || '................'}</p>
                        <p><strong>{getLabel('p1_s1_f3', 'ฝ่าย/แผนก')}:</strong> {data.department || '................'}</p>
                        <p><strong>{getLabel('p1_s1_f4', 'ผู้รับผิดชอบ')}:</strong> {data.thirdPartyOwner || '................'}</p>
                        <p><strong>{getLabel('p1_s1_f5', 'ผู้ประสานงาน')}:</strong> {data.representative || '................'}</p>
                    </div>
                </div>

                <div className="mt-2">
                    <h3 className="font-bold">{getLabel('p1_s2', '2. วัตถุประสงค์การประเมิน')}</h3>
                    <p className="pl-4 whitespace-pre-wrap">{data.purpose || '................'}</p>
                </div>

                <div className="mt-2">
                    <h3 className="font-bold">{getLabel('p1_s3', '3. รายละเอียดบุคคลภายนอก')}</h3>
                    <div className="grid grid-cols-2 gap-x-4 pl-4">
                        <p><strong>{getLabel('p1_s3_f1', 'รหัสบุคคลภายนอก')}:</strong> {data.thirdPartyUniqueId || '................'}</p>
                        <p><strong>{getLabel('p1_s3_f2', 'ประเภทรหัสบุคคลภายนอก')}:</strong> {data.thirdPartyUniqueIdType || '................'}</p>
                        <p><strong>{getLabel('p1_s3_f3', 'ชื่อบุคคลภายนอก (ไทย)')}:</strong> {data.thThirdPartyName || '................'}</p>
                        <p><strong>{getLabel('p1_s3_f4', 'ชื่อบุคคลภายนอก (Eng)')}:</strong> {data.engThirdPartyName || '................'}</p>
                        <p><strong>{getLabel('p1_s3_f5', 'ความสัมพันธ์')}:</strong> {data.relationship || '................'}</p>
                        <p><strong>{getLabel('p1_s3_f6', 'ประเทศที่จดทะเบียน')}:</strong> {data.registeredCountry || '................'}</p>
                        <p><strong>{getLabel('p1_s3_f7', 'Third Party Type')}:</strong> {data.thirdPartyType || '................'}</p>
                        <p><strong>{getLabel('p1_s3_f8', 'Work Type')}:</strong> {data.workType || '................'}</p>
                        <p><strong>{getLabel('p1_s3_f9', 'ประเภทการเชื่อมต่อ')}:</strong> {data.integrationType || '................'}</p>
                        <p><strong>{getLabel('p1_s3_f10', 'Cloud Type')}:</strong> {data.cloudType || '................'}</p>
                        <p><strong>{getLabel('p1_s3_f11', 'วันเริ่มต้นสัญญา')}:</strong> {data.contractStartDate || '................'}</p>
                        <p><strong>{getLabel('p1_s3_f12', 'วันสิ้นสุดสัญญา')}:</strong> {data.contractEndDate || '................'}</p>
                        <p className="col-span-2"><strong>{getLabel('p1_s3_f13', 'ขอบเขตงานที่ให้บริการ โดยสรุป')}:</strong> {data.scopeOfWork || '................'}</p>
                        <p><strong>{getLabel('p1_s3_f14', 'Service Risk Level')}:</strong> {data.serviceRiskLevel || '................'}</p>
                        <p><strong>{getLabel('p1_s3_f15', 'Service SLA')}:</strong> {data.serviceSLA || '................'}</p>
                        <p><strong>{getLabel('p1_s3_f16', 'Data Center Country')}:</strong> {data.dataCenterCountry || '................'}</p>
                    </div>
                </div>

                <div className="mt-2">
                    <h3 className="font-bold">{getLabel('p1_s4', '4. ขอบเขตงานที่ให้บริการ')}</h3>
                    <div className="pl-4">
                        <p><strong>{getLabel('p1_s4_f1', 'โครงสร้างพื้นฐาน')}:</strong> {data.infraScope || '................'}</p>
                        <p><strong>{getLabel('p1_s4_f2', 'O/S, Middle ware')}:</strong> {data.osMiddlewareScope || '................'}</p>
                        <p><strong>{getLabel('p1_s4_f3', 'ระบบงาน / ระบบฐานข้อมูล')}:</strong> {data.appDbScope || '................'}</p>
                        <p><strong>{getLabel('p1_s4_f4', 'การรักษาความปลอดภัย')}:</strong> {data.securityScope || '................'}</p>
                        <p><strong>{getLabel('p1_s4_f5', 'อื่นๆ')}:</strong> {data.otherScope || '................'}</p>
                    </div>
                </div>

                <div className="mt-2">
                    <h3 className="font-bold">{getLabel('p1_s5', '5. Sub contract & 4th Party')}</h3>
                    <table className="w-full border-collapse border border-black mt-1">
                        <thead>
                            <tr>
                                <th className="border border-black p-1 text-left">{getLabel('p1_s5_th1', 'ชื่อบุคคลภายนอก')}</th>
                                <th className="border border-black p-1 text-left">{getLabel('p1_s5_th2', 'ขอบเขตงาน')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(data.subContracts || []).map((sub, i) => (
                                <tr key={i}>
                                    <td className="border border-black p-1">{sub.name}</td>
                                    <td className="border border-black p-1">{sub.scope}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="border border-black p-2 mt-4">
                <h2 className="text-sm font-bold bg-gray-200 p-1">{getLabel('p2_header', 'ส่วนที่ 2 : การประเมินผู้ให้บริการ Third Party ที่มีนัยสำคัญ')}</h2>
                <table className="w-full border-collapse border border-black mt-1">
                    <thead>
                        <tr>
                            <th className="border border-black p-1 text-left w-3/5">{getLabel('p2_th1', 'การพิจารณาความมีนัยสำคัญ')}</th>
                            <th className="border border-black p-1 text-left w-2/5">{getLabel('p2_th2', 'ผลการพิจารณา')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td colSpan={2} className="p-1 font-semibold bg-gray-100">{getLabel('p2_s1_header', '1) Data Access')}</td></tr>
                        <tr>
                            <td className="border border-black p-1">{getLabel('p2_s1_f1', '1.1 บุคคลภายนอกมีการเข้าถึงข้อมูลของลูกค้าในระดับใด')}</td>
                            <td className="border border-black p-1">{data.dataAccessCustomerLevel}</td>
                        </tr>
                        <tr>
                            <td className="border border-black p-1">{getLabel('p1_s1_f2', '1.2 บุคคลภายนอกมีการเข้าถึงข้อมูลของบริษัทในระดับใด')}</td>
                            <td className="border border-black p-1">{data.dataAccessCompanyLevel}</td>
                        </tr>
                        <tr><td colSpan={2} className="p-1 font-semibold bg-gray-100">{getLabel('p2_s2_header', '2) Cloud Computing')}</td></tr>
                        <tr>
                            <td className="border border-black p-1">{getLabel('p2_s2_f1', '2.1 ระบบงาน/บริการ อยู่บน Cloud Provide ที่ธนาคารมีอยู่แล้ว')}</td>
                            <td className="border border-black p-1">{data.cloudOnExistingProvider}</td>
                        </tr>
                        <tr>
                            <td className="border border-black p-1">{getLabel('p2_s2_f2', '2.2 ประเภทการให้บริการ Cloud')}</td>
                            <td className="border border-black p-1">{data.cloudServiceType}</td>
                        </tr>
                        <tr><td colSpan={2} className="p-1 font-semibold bg-gray-100">{getLabel('p2_s3_header', '3) เกี่ยวข้องกับระบบงาน หรือบริการที่สำคัญ')}</td></tr>
                        <tr>
                            <td className="border border-black p-1">{getLabel('p2_s3_f1', '3.1 ขอบเขตการให้บริการ เกี่ยวข้องหรือกระทบกับระบบงานที่สำคัญ')}</td>
                            <td className="border border-black p-1">{data.impactsCriticalSystem}</td>
                        </tr>
                        <tr>
                            <td className="border border-black p-1">{getLabel('p2_s3_f2', '3.2 ขอบเขตการให้บริการ เกี่ยวข้องหรือกระทบกับบริการที่สำคัญ')}</td>
                            <td className="border border-black p-1">{data.impactsCriticalService}</td>
                        </tr>
                        <tr><td colSpan={2} className="p-1 font-semibold bg-gray-100">{getLabel('p2_s4_header', '4) ขนาด และมูลค่าของโครงการ')}</td></tr>
                        <tr>
                            <td className="border border-black p-1">{getLabel('p2_s4_f1', '4.1 สัญญาโครงการที่มีมูลค่า ตั้งแต่ 10,000,000 บาทขึ้นไป')}</td>
                            <td className="border border-black p-1">{data.valueOver10M}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div style={{ pageBreakInside: 'avoid', marginTop: '2rem' }}>
                <div className="grid grid-cols-2 gap-8 text-xs">
                    <div className="text-center">
                        <p className="mb-12">................................................................</p>
                        <p>( {data.assessorSignature?.name || '...................................'} )</p>
                        <p>ผู้ประเมิน</p>
                        <p>ตำแหน่ง: {data.assessorSignature?.position || '...................................'}</p>
                        <p>หน่วยงาน: {data.assessorSignature?.department || '...................................'}</p>
                        <p>วันที่: {data.assessorSignature?.date || '...................................'}</p>
                    </div>
                    <div className="text-center">
                        <p className="mb-12">................................................................</p>
                        <p>( ................................................................ )</p>
                        <p>ผู้สอบทาน</p>
                        <p>ตำแหน่ง: ................................................................</p>
                        <p>หน่วยงาน: ................................................................</p>
                        <p>วันที่: ................................................................</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegistrationPrintView;