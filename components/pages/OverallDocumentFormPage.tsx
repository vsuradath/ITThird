import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { FORMS } from '../../constants';
import Modal from '../common/Modal';
import { FormDefinition, Topic, SubTopic, FormKey, InputType } from '../../types';
import { TextInput, TextArea, FormField } from '../FormContainer';

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

const InfoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const FormEditor: React.FC<{
    formState: FormDefinition;
    setFormState: React.Dispatch<React.SetStateAction<FormDefinition | null>>;
}> = ({ formState, setFormState }) => {
    
    const isLocked = formState.isStructureLocked;

    const handleTopicChange = (topicIndex: number, field: keyof Topic, value: any) => {
        if (!formState) return;
        const newTopics = [...formState.topics];
        (newTopics[topicIndex] as any)[field] = value;
        setFormState({ ...formState, topics: newTopics });
    };

    const handleSubTopicChange = (topicIndex: number, subTopicIndex: number, field: keyof SubTopic, value: any) => {
        if (!formState) return;
        const newTopics = [...formState.topics];
        const newSubTopics = [...(newTopics[topicIndex].subTopics || [])];
        (newSubTopics[subTopicIndex] as any)[field] = value;
        newTopics[topicIndex].subTopics = newSubTopics;
        setFormState({ ...formState, topics: newTopics });
    };

    const addTopic = () => {
        if (!formState || isLocked) return;
        const newTopic: Topic = {
            no: `${formState.topics.length + 1}`,
            topic: 'New Topic',
            subTopics: []
        };
        setFormState({ ...formState, topics: [...formState.topics, newTopic] });
    };
    
    const removeTopic = (topicIndex: number) => {
        if (!formState || isLocked) return;
        const newTopics = formState.topics.filter((_, i) => i !== topicIndex);
        setFormState({ ...formState, topics: newTopics });
    };

    const addSubTopic = (topicIndex: number) => {
        if (!formState || isLocked) return;
        const newTopics = [...formState.topics];
        const parentTopic = newTopics[topicIndex];
        const newSubTopics = [...(parentTopic.subTopics || [])];
        const newSubTopic: SubTopic = {
            no: `${parentTopic.no}.${newSubTopics.length + 1}`,
            topic: 'New Field',
            details: '',
            fieldKey: `newField${Date.now()}`
        };
        parentTopic.subTopics = [...newSubTopics, newSubTopic];
        setFormState({ ...formState, topics: newTopics });
    };
    
    const removeSubTopic = (topicIndex: number, subTopicIndex: number) => {
        if (!formState || isLocked) return;
        const newTopics = [...formState.topics];
        const parentTopic = newTopics[topicIndex];
        if (parentTopic.subTopics) {
            parentTopic.subTopics = parentTopic.subTopics.filter((_, i) => i !== subTopicIndex);
            setFormState({ ...formState, topics: newTopics });
        }
    };

    return (
        <div className="space-y-4">
            {formState.topics.map((topic, topicIndex) => (
                <div key={topicIndex} className="p-4 border-2 border-gray-200 rounded-lg bg-white shadow-sm">
                    <div className="flex items-center gap-2 mb-3 pb-3 border-b">
                        <TextInput value={topic.no} onChange={(e) => handleTopicChange(topicIndex, 'no', e.target.value)} className="font-bold w-24" disabled={isLocked} />
                        <TextInput value={topic.topic} onChange={(e) => handleTopicChange(topicIndex, 'topic', e.target.value)} className="flex-grow font-semibold text-lg" />
                        {!isLocked && <button onClick={() => removeTopic(topicIndex)} className="p-2 text-red-500 hover:bg-red-100 rounded-full"><TrashIcon className="w-5 h-5"/></button>}
                    </div>

                    {topic.subTopics ? (
                        <div className="pl-4 space-y-3">
                            {topic.subTopics.map((sub, subIndex) => (
                                <div key={subIndex} className="p-3 border rounded-md bg-gray-50/50 relative">
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField label="No."><TextInput value={sub.no} onChange={(e) => handleSubTopicChange(topicIndex, subIndex, 'no', e.target.value)} disabled={isLocked} /></FormField>
                                        <FormField label="Field Label (Topic)"><TextInput value={sub.topic} onChange={(e) => handleSubTopicChange(topicIndex, subIndex, 'topic', e.target.value)} /></FormField>
                                        <FormField label="Field Key (for data)"><TextInput value={sub.fieldKey} onChange={(e) => handleSubTopicChange(topicIndex, subIndex, 'fieldKey', e.target.value)} disabled={isLocked} /></FormField>
                                        <FormField label="Input Type">
                                            <select 
                                                value={sub.inputType || 'text'} 
                                                onChange={(e) => handleSubTopicChange(topicIndex, subIndex, 'inputType', e.target.value as InputType)}
                                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-black"
                                                disabled={isLocked}
                                            >
                                                <option value="text">Text</option>
                                                <option value="textarea">Text Area</option>
                                                <option value="date">Date</option>
                                                <option value="checkbox">Checkbox</option>
                                                <option value="select">Select</option>
                                                <option value="number">Number</option>
                                            </select>
                                        </FormField>
                                        <div className="col-span-2">
                                            <FormField label="Help Text (Details)"><TextArea value={sub.details} onChange={(e) => handleSubTopicChange(topicIndex, subIndex, 'details', e.target.value)} rows={2} /></FormField>
                                        </div>
                                         <FormField label="Required?">
                                             <input type="checkbox" checked={!!sub.required} onChange={e => handleSubTopicChange(topicIndex, subIndex, 'required', e.target.checked)} className="h-5 w-5" disabled={isLocked} />
                                         </FormField>
                                    </div>
                                    {!isLocked && <button onClick={() => removeSubTopic(topicIndex, subIndex)} className="absolute top-2 right-2 p-1 text-red-400 hover:bg-red-100 rounded-full"><TrashIcon className="w-4 h-4"/></button>}
                                </div>
                            ))}
                            {!isLocked && (
                                <button onClick={() => addSubTopic(topicIndex)} className="mt-3 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium py-1 px-2 rounded-md hover:bg-blue-50">
                                    <PlusIcon className="w-4 h-4"/> Add Field
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="pl-4">
                           <FormField label="Details">
                               <TextArea value={topic.details || ''} onChange={(e) => handleTopicChange(topicIndex, 'details', e.target.value)} rows={3} />
                           </FormField>
                        </div>
                    )}
                </div>
            ))}
            {!isLocked && (
                <button onClick={addTopic} className="mt-4 flex items-center gap-2 text-md text-green-600 hover:text-green-800 font-bold py-2 px-3 rounded-md hover:bg-green-100 border-2 border-dashed border-gray-300 w-full justify-center">
                    <PlusIcon className="w-5 h-5"/> Add Topic Section
                </button>
            )}
        </div>
    );
};


const OverallDocumentFormPage: React.FC = () => {
    const { formDefinitions, updateFormDefinition } = useContext(AppContext);
    const [editingFormKey, setEditingFormKey] = useState<FormKey | null>(null);
    const [formState, setFormState] = useState<FormDefinition | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (editingFormKey && formDefinitions?.[editingFormKey]) {
            // Deep copy to prevent mutating original state
            setFormState(JSON.parse(JSON.stringify(formDefinitions[editingFormKey])));
        } else {
            setFormState(null);
        }
    }, [editingFormKey, formDefinitions]);

    const handleSave = async () => {
        if (formState && editingFormKey) {
            setIsSaving(true);
            try {
                await updateFormDefinition(editingFormKey, formState);
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 4000);
            } catch (error) {
                console.error("Failed to save form definition:", error);
                alert(`Error: ${error.message}`);
            } finally {
                setIsSaving(false);
                setEditingFormKey(null);
            }
        }
    };

    const handleClose = () => {
        setEditingFormKey(null);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Overall Document Forms</h2>
            <p className="text-sm text-gray-600 mb-6">
                Administrators can edit the structure and content of key assessment forms here. Changes will be reflected across all projects immediately.
            </p>

            {showSuccess && (
                <div className="mb-4 p-4 text-sm text-green-700 bg-green-100 rounded-lg flex justify-between items-center" role="alert">
                    <div>
                        <span className="font-medium">Success!</span> The form definition has been deployed and updated across the system.
                    </div>
                    <button onClick={() => setShowSuccess(false)} className="font-bold text-lg leading-none">&times;</button>
                </div>
            )}

            <div className="space-y-3">
                {FORMS.map(form => {
                    const definition = formDefinitions?.[form.key];
                    const isEditable = definition?.isEditable ?? false;
                    return (
                        <div key={form.key} className="flex justify-between items-center p-4 border rounded-md">
                            <span className="font-medium text-gray-700">{form.label}</span>
                            <div className="flex items-center gap-2">
                                {!isEditable && (
                                    <div className="relative group">
                                        <InfoIcon className="w-5 h-5 text-gray-400" />
                                        <div className="absolute bottom-full mb-2 w-64 p-2 text-xs text-white bg-gray-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none -translate-x-1/2 left-1/2 z-10">
                                            This form has a custom layout and cannot be modified with the standard editor.
                                            <svg className="absolute text-gray-700 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255"><polygon className="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
                                        </div>
                                    </div>
                                )}
                                <button
                                    onClick={() => isEditable && setEditingFormKey(form.key)}
                                    disabled={!isEditable}
                                    className="px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    Edit
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {formState && (
                <Modal
                    isOpen={!!editingFormKey}
                    onClose={handleClose}
                    title={`Editing Form: ${formState.label}`}
                    onConfirm={handleSave}
                    confirmText={isSaving ? 'Deploying...' : 'Save and Deploy Changes'}
                    large
                >
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <p className="text-sm text-yellow-800 bg-yellow-100 p-3 rounded-md mb-4">
                            <b>Warning:</b> Changes made here will affect this form in all active and future projects. Edit with caution.
                        </p>
                        {formState.isStructureLocked && (
                             <p className="text-sm text-blue-800 bg-blue-100 p-3 rounded-md mb-4">
                                <b>Note:</b> This form has a complex layout. You can only edit text labels and descriptions. The form's structure (fields, input types) is locked to prevent breaking it.
                            </p>
                        )}
                        <FormEditor formState={formState} setFormState={setFormState} />
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default OverallDocumentFormPage;