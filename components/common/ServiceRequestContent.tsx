import React from 'react';

export const ServiceRequestContent: React.FC = () => {
    const steps = [
        {
            title: 'A) ทำบันทึกขออนุมัติใช้บริการ IT Outsource',
            items: [
                'ระบุ short-list ขั้นต่ำ 3 ราย',
                'ระบุ วิธีการจัดซื้อ/จัดจ้าง',
                'แนบ TOR / RFP',
                'แนวทางในการพิจารณาความเสี่ยง',
                'กำหนดคณะกรรมการสรรหา',
            ],
            note: 'กรณีไม่สามารถมี vendor ถึง 3 ราย จะต้องมีขั้นตอนการขอยกเว้น',
        },
        {
            title: 'B) ทำแบบประเมินที่กำหนด',
            description: 'ทุกรายที่เป็น Short-list ดังนี้:',
            items: [
                '#1_Due diligence',
                '#2_IT Security Requirement',
            ],
            note: null,
        },
        {
            title: 'C) ทำแบบประเมินผลการคัดเลือก IT Outsource',
            items: [
                'ทำทุกรายที่เป็น short-list',
                'ระบุ Pricing',
                'ระบุ ผลการคัดเลือก',
                'แนบ Proposal / Quotation',
                'แนบ Selection rating',
            ],
            note: null,
        },
        {
            title: 'D) หลังจากที่ Award vendor',
            items: [
                'ประเมินความเสี่ยงตาม #3_Risk Assessment',
                'ลงทะเบียน #3_3rd Party',
                'นำเอกสารประเมินของรายที่ Award บันทึกลงเอกสาร #1_Due diligence และ #2_IT Security Requirement',
            ],
            note: 'ขออนุมัติต่อคณะกรรมการ ITSC และที่เกี่ยวข้องตามระเบียบ',
        },
    ];

    return (
        <div>
            <p className="text-center text-gray-800 mb-6 font-semibold">ลงะเทียนขอใช้บริการบุคคลภายนอกและการคัดเลือกบุคคลภายนอกและกระบวนจัดซื้อทางด้าน IT</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">
                {steps.map((step, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 h-full flex flex-col">
                        <h4 className="font-bold text-gray-900 mb-2">{step.title}</h4>
                         {step.description && <p className="text-sm text-gray-700 mb-2">{step.description}</p>}
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 pl-2 flex-grow">
                            {step.items.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                        {step.note && (
                            <p className="mt-3 text-xs text-yellow-800 bg-yellow-100 p-2 rounded">
                                <strong>หมายเหตุ:</strong> {step.note}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
