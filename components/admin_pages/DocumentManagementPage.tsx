import React, { useState } from 'react';
import { TextInput, TextArea } from '../FormContainer';

const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const UploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
    />
  </svg>
);


interface DocumentItem {
  id: number;
  title: string;
  description: string;
  fileName: string | null;
}

interface DocumentManagementPageProps {
  title: string;
  description: string;
}

const DocumentManagementPage: React.FC<DocumentManagementPageProps> = ({ title, description }) => {
  const [items, setItems] = useState<DocumentItem[]>([
    { id: 1, title: 'นโยบายความปลอดภัยสารสนเทศ', description: 'นโยบายหลักด้านความปลอดภัยขององค์กร', fileName: 'information-security-policy.pdf' },
    { id: 2, title: 'ระเบียบการใช้บริการ Outsource', description: 'ขั้นตอนและข้อบังคับในการจัดจ้างผู้ให้บริการภายนอก', fileName: null },
  ]);

  const handleItemChange = (id: number, field: 'title' | 'description', value: string) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleFileChange = (id: number, file: File | null) => {
     setItems(items.map(item => item.id === id ? { ...item, fileName: file ? file.name : null } : item));
  };

  const handleAddItem = () => {
    const newItem: DocumentItem = {
      id: Date.now(),
      title: 'หัวข้อเอกสารใหม่',
      description: '',
      fileName: null,
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id: number) => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรายการเอกสารนี้')) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
      <p className="text-sm text-gray-600 mb-6">{description}</p>
      
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200/80 relative transition-all hover:border-blue-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">หัวข้อเอกสาร</label>
                <TextInput
                  value={item.title}
                  onChange={(e) => handleItemChange(item.id, 'title', e.target.value)}
                  placeholder="กรอกชื่อเอกสาร"
                />
              </div>
              <div>
                 <label className="block text-sm font-medium text-black mb-1">ไฟล์แนบ</label>
                 <div className="mt-1">
                     {item.fileName ? (
                         <div className="flex items-center justify-between text-sm bg-white border p-2.5 rounded-md">
                            <span className="text-gray-700 font-medium truncate pr-2">{item.fileName}</span>
                            <button onClick={() => handleFileChange(item.id, null)} className="text-red-600 hover:underline ml-2 font-semibold flex-shrink-0">ลบ</button>
                         </div>
                     ) : (
                        <label
                          htmlFor={`file-upload-${item.id}`}
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 border-2 border-dashed p-2.5 flex justify-center items-center h-[42px] hover:bg-blue-50"
                        >
                          <div className="flex items-center gap-2">
                            <UploadIcon className="w-5 h-5 text-gray-400"/>
                            <span>Upload a file</span>
                          </div>
                          <input id={`file-upload-${item.id}`} name="file-upload" type="file" className="sr-only" onChange={(e) => handleFileChange(item.id, e.target.files ? e.target.files[0] : null)} />
                        </label>
                     )}
                 </div>
              </div>
              <div className="md:col-span-2">
                 <label className="block text-sm font-medium text-black mb-1">คำอธิบาย</label>
                 <TextArea
                    value={item.description}
                    onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                    rows={3}
                    placeholder="เพิ่มคำอธิบายเกี่ยวกับเอกสารนี้..."
                 />
              </div>
            </div>
            <button
                onClick={() => handleRemoveItem(item.id)}
                className="absolute top-2 right-2 p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors"
                aria-label="Remove item"
            >
                <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={handleAddItem}
        className="mt-6 flex items-center gap-2 text-md text-blue-600 hover:text-blue-800 font-bold py-2 px-3 rounded-md hover:bg-blue-100 border-2 border-dashed border-gray-300 w-full justify-center transition-colors"
      >
        <PlusIcon className="w-5 h-5" />
        เพิ่มเอกสารใหม่
      </button>
    </div>
  );
};

export default DocumentManagementPage;
