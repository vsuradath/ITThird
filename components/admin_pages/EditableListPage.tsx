import React, { useState } from 'react';
import { TextInput } from '../FormContainer';

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


interface EditableListPageProps {
    title: string;
    description: string;
}

const EditableListPage: React.FC<EditableListPageProps> = ({ title, description }) => {
    const [items, setItems] = useState<string[]>(['Sample Item 1', 'Sample Item 2']);

    const handleItemChange = (index: number, value: string) => {
        const newItems = [...items];
        newItems[index] = value;
        setItems(newItems);
    };

    const handleAddItem = () => {
        setItems([...items, `New Item ${items.length + 1}`]);
    };

    const handleRemoveItem = (index: number) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            const newItems = items.filter((_, i) => i !== index);
            setItems(newItems);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
            <p className="text-sm text-gray-600 mb-6">{description}</p>
            <div className="space-y-4">
                {items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-md border">
                        <span className="text-gray-500 font-medium">{index + 1}.</span>
                        <TextInput
                            value={item}
                            onChange={(e) => handleItemChange(index, e.target.value)}
                            className="flex-grow"
                        />
                        <button
                            onClick={() => handleRemoveItem(index)}
                            className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors"
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
                Add New Item
            </button>
        </div>
    );
};

export default EditableListPage;
