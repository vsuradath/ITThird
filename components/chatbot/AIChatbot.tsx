import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { SendIcon } from '../icons/SendIcon';

interface Message {
    role: 'user' | 'model';
    text: string;
}

const DOCUMENT_KNOWLEDGE_BASE = `
--- เอกสาร: คู่มือมาตรฐานการปฏิบัติงาน (รหัส P-IT-13-68) ---

**เรื่อง:** การเชื่อมต่อหรือการเข้าถึงข้อมูลกับบุคคลภายนอก และการใช้บริการบุคคลภายนอกด้านเทคโนโลยีสารสนเทศ (จัดทำครั้งที่ 1)

**ผู้เห็นชอบและอนุมัติ:**
- หน่วยงานวางแผนงบประมาณและธุรการเทคโนโลยีสารสนเทศ (นางสาวสุรีลักษณ์ สุทธิประภา)
- หน่วยงานเทคโนโลยีสารสนเทศ (นายคริสโตเฟอร์ ชาน)
- หน่วยงานกลยุทธ์สายงานบริหารทรัพยากรบุคคล (นางชัญญานุช ฉวีวงศ์)
- หน่วยงานบริหารความเสี่ยงด้านปฏิบัติการ (นางสาวจุฑารัตน์ ชอนชล)
- หน่วยงานกำกับการปฏิบัติตามกฎเกณฑ์ (นางสาวณัฏฐิตา โล่ห์วีระ)

**ข้อมูลทั่วไป:**
- **วันที่มีผลบังคับใช้:** 1 สิงหาคม 2568
- **จัดทำโดย:** หน่วยงานงบประมาณและธุรการเทคโนโลยีสารสนเทศ

---

### **สารบัญ**

**1. สรุปการทบทวนและปรับปรุงคู่มือ (History Record)**
**2. วัตถุประสงค์**
**3. ขอบเขตและหลักเกณฑ์**
**4. บทบาทหน้าที่ ความรับผิดชอบ (Role and Responsibility)**
**5. คำจำกัดความ**
**6. ขั้นตอนการปฏิบัติงาน**
    6.1 การขออนุมัติใช้บริการ
    6.2 การประกวดราคา
    6.3 การประเมินศักยภาพ (Due diligence)
    6.4 การประเมินด้านการรักษาความปลอดภัยด้านเทคโนโลยีสารสนเทศ (IT Security)
    6.5 การลงทะเบียนการใช้บริการบุคคลภายนอก (Third party register)
    6.6 ประเมินความเสี่ยงบุคคลภายนอก (Risk Assessment)
    6.7 การประเมินเกี่ยวกับการเปิดเผยข้อมูลส่วนบุคคลไปยังหน่วยงานภายนอก
    6.8 การสอบทานผลการประเมินความเสี่ยง
    6.9 ขออนุมัติใช้บริการบุคคลภายนอก
    6.10 การจัดทำสัญญา
    6.11 ติดตามการใช้บริการบุคคลภายนอก
    6.12 การต่ออายุสัญญาและการทบทวนการประเมินผลประจำปี
    6.13 การปรับปรุงข้อมูลทะเบียน Third party และรายงาน
    6.14 การยกเลิกและสิ้นสุดสัญญาหรือข้อตกลง
**7. แบบฟอร์มที่เกี่ยวข้อง**
    1) บันทึกการขออนุมัติใช้บริการจากบุคคลภายนอก
    2) แบบการประเมินศักยภาพฯ (IT Third Party)
    3) แบบประเมินมาตรการรักษาความปลอดภัยฯ (IT Third Party)
    4) แบบประเมินความเสี่ยงฯ (IT Third Party)
    5) แบบลงทะเบียนการใช้บริการฯ
    6) แบบประเมินข้อกำหนดในเงื่อนไขสำคัญของสัญญาฯ
    7) แบบประเมินการติดตามผลการปฏิบัติงานฯ
    8) แบบประเมินการยกเลิกสัญญาฯ
    9) แบบประเมินผลการปฏิบัติงานฯ
    10) แบบประเมิน: CONTROLLER vs PROCESSOR Checklist
    11) แบบประเมินการใช้บริการฯ ด้านการคุ้มครองข้อมูลส่วนบุคคล
**8. ภาคผนวก**
    ก: Format ของชุดข้อมูล (Data Set) ของ ธปท.
    ข: หลักเกณฑ์การพิจารณางาน Third Party
    ค: หลักเกณฑ์การจัดระดับความเสี่ยงและความมีนัยสำคัญ

---

### **เนื้อหารายละเอียด**

**1. สรุปการทบทวนและปรับปรุงคู่มือ (History Record)**
- จัดทำครั้งที่ 1 โดยยกเลิกคู่มือฉบับเดิม (O-IT-01-67) และปรับปรุงเนื้อหาให้ครอบคลุมและสอดคล้องกับการปฏิบัติงานปัจจุบัน

**2. วัตถุประสงค์**
2.1 เพื่อให้มีแนวทางการควบคุมความเสี่ยงจากการใช้บริการบุคคลภายนอก
2.2 เพื่อให้มีกรอบมาตรฐานของสัญญาหรือข้อตกลงที่เป็นลายลักษณ์อักษร
2.3 เพื่อให้มีการติดตาม ดูแล และตรวจสอบการปฏิบัติงานของบุคคลภายนอก
2.4 เพื่อให้มีแนวทางปฏิบัติเมื่อมีการยกเลิกหรือสิ้นสุดสัญญา

**3. ขอบเขตและหลักเกณฑ์**
อ้างอิงหลักเกณฑ์จาก:
- ประกาศธนาคารแห่งประเทศไทย (ธปท.)
- ประกาศคณะกรรมการกำกับหลักทรัพย์และตลาดหลักทรัพย์ (ก.ล.ต.)
- นโยบายภายในของธนาคาร เช่น IT Risk Management, IT Security, Anti-Corruption, Data Classification เป็นต้น

**4. บทบาทหน้าที่ ความรับผิดชอบ (Role and Responsibility)**
- **คณะกรรมการธนาคาร:** อนุมัตินโยบายการบริหารจัดการความเสี่ยงจากบุคคลภายนอก
- **คณะเจ้าหน้าที่บริหาร และ คณะกรรมการกำกับความเสี่ยง:** เห็นชอบและกำกับดูแลนโยบาย
- **คณะกรรมการ IT Steering:** เห็นชอบนโยบาย, กำกับดูแล, และอนุมัติการใช้บริการที่มีนัยสำคัญหรือมีความเสี่ยงระดับกลางขึ้นไป
- **หน่วยงานผู้ขอใช้บริการ:** จัดทำเอกสาร, ประเมินความเสี่ยง, ติดตามดูแล, และรายงานผล
- **หน่วยงานวางแผนงบประมาณและธุรการเทคโนโลยีสารสนเทศ:** บริหารความเสี่ยง, แจ้งทบทวนข้อมูล, ปรับปรุงทะเบียน
- **หน่วยงานกฎหมาย:** พิจารณารายละเอียดข้อตกลงและสัญญา
- **หน่วยงาน IT Controllership:** จัดทำนโยบาย, สอบทานผลการประเมิน, สอบทานทะเบียน IT Third party
- **หน่วยงาน IT Security:** สอบทานผลการประเมินมาตรการความปลอดภัย
- **หน่วยงานบริหารความเสี่ยงด้านเทคโนโลยีสารสนเทศ:** กำกับดูแลให้เป็นไปตามนโยบาย, สอบทานผลประเมินความเสี่ยง
- **หน่วยงานกำกับการปฏิบัติตามกฎเกณฑ์:** ให้คำปรึกษาและกำกับดูแลให้เป็นไปตามกฎหมายและกฎเกณฑ์
- **หน่วยงานตรวจสอบ:** จัดให้มีการตรวจสอบการใช้บริการจากบุคคลภายนอก

**5. คำจำกัดความ**
- **เทคโนโลยีสารสนเทศ (IT):** ครอบคลุมข้อมูล, ระบบปฏิบัติการ, แอปพลิเคชัน, ฐานข้อมูล, ฮาร์ดแวร์, และเครือข่าย
- **บุคคลภายนอก (Third Party):** บุคคลหรือนิติบุคคลภายนอกที่ให้บริการด้าน IT, มีการเชื่อมต่อกับระบบ IT, หรือเข้าถึงข้อมูลสำคัญของธนาคาร
- **ผู้ให้บริการที่บุคคลภายนอกจ้างช่วงต่อ (4th Party, Subcontractor):** ผู้ที่ Third Party ว่าจ้างต่ออีกทอดหนึ่ง
- **Cloud Computing:** การใช้บริการผ่านอินเทอร์เน็ตเพื่อจัดเก็บ, ประมวลผลข้อมูล (Public, Private, Hybrid)
- **ระบบงานหรือเทคโนโลยีที่มีนัยสำคัญ (Significant System):** ระบบที่อาจก่อให้เกิดความเสี่ยงในวงกว้างต่อธุรกิจ, สถาบันการเงิน, หรือเกี่ยวข้องกับบริการทางการเงินที่สำคัญ (Critical Services)
- **ผู้ให้บริการ Third Party ที่มีนัยสำคัญ:** มีลักษณะเช่น เข้าถึงข้อมูล Confidential ของลูกค้าหรือธนาคาร, เกี่ยวข้องกับระบบงาน/บริการที่สำคัญ (Core banking, Mobile banking), ใช้เทคโนโลยีสำคัญ (Biometric, AI), โครงการขนาดใหญ่ (มูลค่าตั้งแต่ 10,000,000 บาทขึ้นไป)
- **งาน IT Outsource:** งาน IT ที่โดยปกติธนาคารต้องทำเอง เช่น จ้างทีมพัฒนา Software, แก้ไขปัญหา Software/Hardware
- **งานที่ไม่จัดเป็น IT Outsource:** เช่น การจัดซื้อโปรแกรมสำเร็จรูป, การใช้บริการข้อมูลการเงิน, การจ้างที่ปรึกษา

**6. ขั้นตอนการปฏิบัติงาน**
**6.1 การขออนุมัติใช้บริการ:**
    1. กำหนดขอบเขตบริการ วัตถุประสงค์ และความต้องการทางธุรกิจ
    2. กำหนดคุณสมบัติ (Features) และฟังก์ชัน (Functionalities)
    3. กำหนดระดับบริการที่คาดหวัง (Service Level Expectations)
    4. พิจารณาความเสี่ยงตามวัฏจักรการบริหารจัดการบุคคลภายนอก
    5. กำหนดผู้ทำหน้าที่สรรหา (ประกอบด้วย ผู้ขอใช้บริการ, IT, IT Controllership, IT Risk/Compliance)

**6.2 การประกวดราคา:**
    1. ส่งเรื่องให้หน่วยงานจัดซื้อเพื่อสืบราคาจากผู้ให้บริการอย่างน้อย 3 ราย
    2. ชี้แจงรายละเอียดความต้องการต่อผู้เข้าร่วมประกวดราคา
    3. เปรียบเทียบคุณสมบัติและข้อเสนอ
    4. กรณีจัดซื้อด้วยวิธีประกวดราคา ให้ดำเนินการตามประกาศธนาคาร
    5. คณะกรรมการประกวดราคาสรุปและแจ้งผล

**6.3 การประเมินศักยภาพ (Due diligence):**
    - ประเมินบริษัทที่เข้าร่วมทุกรายใน short list ตามหัวข้อ: ฐานะทางการเงินและชื่อเสียง, ความเชี่ยวชาญ, ธรรมาภิบาล, การบริหารความเสี่ยง, IT Security, BCP/DR, การตรวจสอบ, การปฏิบัติตามกฎหมาย, มาตรฐานสากล, ความเสี่ยงจากต่างประเทศ, Concentration Risk, และ Open Technology
    - หากคะแนนต่ำกว่า 75 ต้องจัดทำแผนบริหารความเสี่ยงและขออนุมัติต่อ IT Steering

**6.4 การประเมินด้าน IT Security:**
    - ประเมินตามหัวข้อ: การกำหนดระดับชั้นข้อมูล, Access Control, Communications Security, Logging, System Security Configuration, Vulnerability Management, Endpoint Security, Security Awareness Training, Data Backup, Incident Management, Change Management, Capacity Management, Physical Security

**6.5 การลงทะเบียนบุคคลภายนอก (Third party register):**
    - ลงทะเบียนข้อมูล: ฝ่ายงาน, วัตถุประสงค์, รายละเอียดบุคคลภายนอก, ขอบเขตงาน, Subcontract & 4th Party
    - ประเมินผู้ให้บริการที่มีนัยสำคัญเพิ่มเติม

**6.6 ประเมินความเสี่ยงบุคคลภายนอก (Risk Assessment):**
    - ประเมินตามหัวข้อ: Strategic Risk, Reputation Risk, IT & Cyber Risk, Legal Risk, Cross Border Risk, Contract Risk, Vendor Lock-in, Concentration Risk, Subcontractor Risk, Quality Risk, Business Continuity Risk
    - หากความเสี่ยงสูง (Medium/High) ต้องขอความเห็นชอบจาก IT Steering และจัดทำแผนจัดการความเสี่ยง

**6.7 การประเมินการเปิดเผยข้อมูลส่วนบุคคล (PDPA):**
    - ทำแบบประเมิน CONTROLLER vs PROCESSOR Checklist และส่งให้หน่วยงาน PDPU เพื่อประเมิน
    - หากเกี่ยวข้องกับข้อมูลส่วนบุคคล ต้องจัดทำ Data Processing Agreement (DPA) / Data Sharing Agreement (DSA)

**6.8 การสอบทานผลการประเมินความเสี่ยง:**
    - ผลการประเมินต่างๆ จะถูกส่งให้หน่วยงานที่เกี่ยวข้องสอบทาน (IT Controllership, IT Security, IT Risk, หน่วยงานคุ้มครองข้อมูลส่วนบุคคล)

**6.9 ขออนุมัติใช้บริการบุคคลภายนอก:**
    - ขอความเห็นชอบต่อ IT Steering
    - ขออนุมัติจัดซื้อจัดจ้างต่อคณะกรรมการจัดซื้อ
    - กรณีบริการมีนัยสำคัญ ต้องขออนุมัติผลประเมินความเสี่ยงต่อคณะกรรมการบริหารความเสี่ยง

**6.10 การจัดทำสัญญา:**
    - ประเมินข้อกำหนดในเงื่อนไขสำคัญของสัญญา: ขอบเขตบริการ, บทบาทหน้าที่, มาตรฐานการควบคุม, แผนฉุกเฉิน, การติดตามและรายงานผล, การคุ้มครองข้อมูล, การทำลายข้อมูล, สิทธิ์ในการเปลี่ยนแปลง/ยกเลิกสัญญา, สิทธิ์ในการตรวจสอบ เป็นต้น

**6.11 ติดตามการใช้บริการบุคคลภายนอก:**
    - บันทึกการติดตามผลการปฏิบัติงานเป็นประจำทุกเดือน

**6.12 การต่ออายุสัญญาและการทบทวนประจำปี:**
    - แจ้งทบทวนข้อมูลทุกไตรมาส และแจ้งเตือนต่อสัญญาล่วงหน้า 3 เดือน
    - ทบทวนประเมินผลอย่างน้อยปีละ 1 ครั้ง (ประเมินศักยภาพ, IT Security, ความเสี่ยง)
    - กรณีเปลี่ยนแปลงผู้ให้บริการ ต้องประเมินการยกเลิกสัญญากับรายเดิมก่อน

**6.13 การปรับปรุงข้อมูลทะเบียน Third party และรายงาน:**
    - ปรับปรุงชุดข้อมูล Data Set ทุกไตรมาส และนำส่ง ธปท.
    - รายงานข้อมูลทะเบียนต่อ IT Steering ทุก 6 เดือน

**6.14 การยกเลิกและสิ้นสุดสัญญา:**
    - **ประเมินการยกเลิก:** ประเมินล่วงหน้าอย่างน้อย 6 เดือน (สำหรับระบบที่มีนัยสำคัญ) เพื่อวางกลยุทธ์และแผน (Exit Strategy)
    - **การจัดทำแผน:** กำหนดขั้นตอน, ทดสอบแผน, กำหนดเงื่อนไขการตัดสินใจ, และเตรียมแผนสำรอง
    - **การดำเนินการ:** ขอความเห็นชอบ, สื่อสารแผน, สำรอง/ลบ/คืนทรัพย์สิน
    - **การติดตามผล:** บริหารจัดการภาระหน้าที่ที่อาจคงอยู่หลังสิ้นสุดสัญญา และรายงานผล

**7. ภาคผนวก**
- **ภาคผนวก ก:** รูปแบบชุดข้อมูล (Data Set) ที่ต้องรายงาน ธปท.
- **ภาคผนวก ข:** หลักเกณฑ์พิจารณาว่าบริการใดเป็นงาน Third Party (เช่น IT Outsourcing, การเชื่อมต่อระบบ, การเข้าถึงข้อมูลสำคัญ, Cloud Computing)
- **ภาคผนวก ค:** หลักเกณฑ์การจัดระดับความเสี่ยงและความมีนัยสำคัญ (เช่น ระบบที่กระทบวงกว้าง, เกี่ยวข้องกับ Critical Services, ใช้เทคโนโลยีใหม่ใน Regulatory Sandbox)
`;

const AIChatbot: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', text: 'สวัสดีครับ ผมคือผู้ช่วย AI สำหรับระบบจัดการเอกสาร IT Third Party มีอะไรให้ช่วยเหลือเกี่ยวกับคู่มือและกระบวนการทำงาน สามารถสอบถามได้เลยครับ' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);
    
    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const history = messages.map(msg => ({
                role: msg.role,
                parts: [{ text: msg.text }]
            }));
            const contents = [...history, { role: 'user', parts: [{ text: currentInput }] }];

            const systemInstruction = `คุณคือผู้ช่วย AI อัจฉริยะสำหรับ "ระบบจัดการเอกสาร IT Third Party" ของธนาคารไทยเครดิต ภารกิจของคุณคือการตอบคำถามเกี่ยวกับขั้นตอนการทำงาน, บทบาทหน้าที่, และรายละเอียดต่างๆ โดยอ้างอิงจาก "คู่มือมาตรฐานการปฏิบัติงาน" ที่ให้มานี้เท่านั้น ห้ามตอบคำถามนอกเหนือจากเนื้อหาในเอกสารนี้โดยเด็ดขาด

จงใช้เอกสารนี้เป็นแหล่งข้อมูลเพียงแหล่งเดียวในการตอบคำถาม:
--- DOCUMENT START ---
${DOCUMENT_KNOWLEDGE_BASE}
--- DOCUMENT END ---

ให้ตอบคำถามของผู้ใช้อย่างกระชับ, ถูกต้อง, และเป็นประโยชน์ โดยอ้างอิงจากข้อมูลในเอกสารที่ให้มาเท่านั้น`;

            const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents,
              config: {
                systemInstruction,
              }
            });
            
            const modelMessage: Message = { role: 'model', text: response.text };
            setMessages(prev => [...prev, modelMessage]);

        } catch (error) {
            console.error("Error calling Gemini API:", error);
            const errorMessage: Message = { role: 'model', text: 'ขออภัยค่ะ ดูเหมือนว่าจะมีปัญหาในการเชื่อมต่อ โปรดลองอีกครั้งในภายหลัง' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg flex flex-col h-full max-h-[85vh]">
            <div className="p-4 border-b">
                <h3 className="text-lg font-bold text-gray-800 text-center">สงสัย? ก็ถามได้เลย</h3>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs md:max-w-sm lg:max-w-md px-4 py-2 rounded-xl ${
                            msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                        }`}>
                            <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                         <div className="max-w-xs md:max-w-sm lg:max-w-md px-4 py-2 rounded-xl bg-gray-200 text-gray-800">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t bg-white rounded-b-2xl">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="สอบถามเกี่ยวกับคู่มือ..."
                        className="flex-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-black placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
                        aria-label="Send message"
                    >
                        <SendIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AIChatbot;