import React, { useState, useRef } from 'react';
import { TextInput } from '../FormContainer';
import { InfoIcon } from '../icons/InfoIcon';
import { CheckIcon } from '../icons/CheckIcon';
import { XCircleIcon } from '../icons/XCircleIcon';
import Modal from './Modal';
import { UploadIcon } from '../icons/UploadIcon';

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

const PencilIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
  </svg>
);

interface Column {
    key: string;
    header: string;
    description: string;
    inputType?: 'text' | 'select';
    options?: string[];
}

interface DataTablePageProps {
    title: string;
    description: string;
    columns: Column[];
    initialData: Record<string, any>[];
}

const DataTablePage: React.FC<DataTablePageProps> = ({ title, description, columns, initialData }) => {
    // FIX: Explicitly type the state to ensure `id` is recognized as a required property.
    const [data, setData] = useState<(Record<string, any> & { id: number })[]>(initialData.map((item, index) => ({ ...item, id: index })));
    const [editingRowId, setEditingRowId] = useState<number | null>(null);
    // FIX: Explicitly type the edited row data to match the structure of a row in the `data` state.
    const [editedRowData, setEditedRowData] = useState<(Record<string, any> & { id: number }) | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isImportConfirmOpen, setIsImportConfirmOpen] = useState(false);
    const [csvDataToImport, setCsvDataToImport] = useState<Record<string, any>[] | null>(null);
    const [csvImportWarning, setCsvImportWarning] = useState<string | null>(null);


    const handleAddNewRow = () => {
        const newId = data.length > 0 ? Math.max(...data.map(d => d.id)) + 1 : 0;
        const newRow = columns.reduce((acc, col) => ({ ...acc, [col.key]: col.options ? col.options[0] : '' }), { id: newId });
        setData([...data, newRow]);
        setEditingRowId(newId);
        setEditedRowData(newRow);
    };

    const handleEditRow = (row: Record<string, any> & { id: number }) => {
        setEditingRowId(row.id);
        setEditedRowData({ ...row });
    };

    const handleCancelEdit = () => {
        const isNewUnsavedRow = editedRowData && !initialData.some(d => d.id === editedRowData.id) && data.some(d => d.id === editingRowId);
        if (isNewUnsavedRow) {
             setData(data.filter(d => d.id !== editingRowId));
        }
        setEditingRowId(null);
        setEditedRowData(null);
    };

    const handleSaveRow = () => {
        if (!editedRowData) return;
        setData(data.map(row => (row.id === editingRowId ? editedRowData : row)));
        setEditingRowId(null);
        setEditedRowData(null);
    };
    
    const handleDeleteRow = (id: number) => {
        if (window.confirm('Are you sure you want to delete this row?')) {
            setData(data.filter(row => row.id !== id));
        }
    };

    const handleInputChange = (key: string, value: string) => {
        if (editedRowData) {
            setEditedRowData({ ...editedRowData, [key]: value });
        }
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const parseCSV = (text: string): { headers: string[], rows: Record<string, string>[] } => {
        const lines = text.trim().replace(/\r/g, '').split('\n');
        if (lines.length < 1) return { headers: [], rows: [] };

        const headers = lines.shift()!.split(',').map(h => h.trim());
        const rows = lines.map(line => {
            const regex = /(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|([^\",]*))(?:\,|$)/g;
            const values: string[] = [];
            let match;
            while ((match = regex.exec(line))) {
                if (match[0] === ',' || match[0] === '') {
                    if (values.length < headers.length) {
                         values.push('');
                    }
                    if(match[0] === '') break;
                } else {
                    values.push(match[1] ? match[1].replace(/\"\"/g, '"') : match[2]);
                }
            }
            // Ensure row has same number of columns as header
            while(values.length < headers.length) values.push('');

            const rowObject: Record<string, string> = {};
            headers.forEach((header, index) => {
                rowObject[header] = values[index] || '';
            });
            return rowObject;
        });
        return { headers, rows };
    };


    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            if (!text) return;

            const { headers: csvHeaders, rows: parsedRows } = parseCSV(text);
            const tableKeys = columns.map(c => c.key);

            const validHeaders = csvHeaders.filter(h => tableKeys.includes(h));
            const invalidHeaders = csvHeaders.filter(h => !tableKeys.includes(h));

            if (validHeaders.length === 0) {
                alert("CSV import failed: No matching column headers found in the file. Please ensure the CSV column headers match the table's 'key' values.");
                return;
            }

            let warning = null;
            if (invalidHeaders.length > 0) {
                warning = `The following columns from your file will be ignored because they don't match the table: ${invalidHeaders.join(', ')}`;
            }

            const formattedData = parsedRows.map(row => {
                const newRow: Record<string, any> = {};
                columns.forEach(col => {
                    newRow[col.key] = row[col.key] || (col.options ? col.options[0] : '');
                });
                return newRow;
            });

            setCsvDataToImport(formattedData);
            setCsvImportWarning(warning);
            setIsImportConfirmOpen(true);
        };

        reader.readAsText(file);
        event.target.value = '';
    };

    const handleConfirmImport = () => {
        if (csvDataToImport) {
            const newData = csvDataToImport.map((item, index) => ({ ...item, id: Date.now() + index }));
            setData(newData);
        }
        handleCancelImport();
    };

    const handleCancelImport = () => {
        setIsImportConfirmOpen(false);
        setCsvDataToImport(null);
        setCsvImportWarning(null);
    };


    return (
        <>
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
                        <p className="text-sm text-gray-600">{description}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                            onClick={handleImportClick}
                             className="flex items-center gap-2 px-4 py-2 font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-sm transition-all whitespace-nowrap"
                        >
                            <UploadIcon className="w-5 h-5" />
                            Import CSV
                        </button>
                        <button
                            onClick={handleAddNewRow}
                            className="flex items-center gap-2 px-4 py-2 font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition-all whitespace-nowrap"
                        >
                            <PlusIcon className="w-5 h-5" />
                            เพิ่มรายการใหม่
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            accept=".csv"
                            className="hidden"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                {columns.map(col => (
                                    <th key={col.key} className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider sticky top-0 bg-gray-100 z-10">
                                        <div className="flex items-center gap-1 group relative">
                                            <span>{col.header}</span>
                                            <InfoIcon className="w-4 h-4 text-gray-400 cursor-help" />
                                            <div className="absolute top-full mt-2 w-60 p-3 text-sm text-white bg-gray-800 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 text-right normal-case font-medium left-1/2 -translate-x-1/2">
                                                {col.description}
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-3 h-3 -mb-1 transform rotate-45 bg-gray-800"></div>
                                            </div>
                                        </div>
                                    </th>
                                ))}
                                <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider sticky top-0 bg-gray-100 z-10 right-0">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {data.map((row) => (
                                <tr key={row.id} className="hover:bg-gray-50 align-top">
                                    {columns.map(col => (
                                        <td key={col.key} className="px-4 py-2 whitespace-nowrap">
                                            {editingRowId === row.id ? (
                                                col.inputType === 'select' ? (
                                                    <select
                                                        value={editedRowData?.[col.key] || ''}
                                                        onChange={(e) => handleInputChange(col.key, e.target.value)}
                                                        className="mt-1 block w-48 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-black placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                    >
                                                        {col.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                                    </select>
                                                ) : (
                                                    <TextInput
                                                        value={editedRowData?.[col.key] || ''}
                                                        onChange={(e) => handleInputChange(col.key, e.target.value)}
                                                        className="w-48"
                                                    />
                                                )
                                            ) : (
                                                <span className="text-gray-800">{row[col.key]}</span>
                                            )}
                                        </td>
                                    ))}
                                    <td className="px-4 py-2 whitespace-nowrap text-right sticky right-0 bg-white/80 backdrop-blur-sm">
                                        {editingRowId === row.id ? (
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={handleSaveRow} className="p-2 text-green-600 hover:bg-green-100 rounded-full" aria-label="Save"><CheckIcon className="w-5 h-5"/></button>
                                                <button onClick={handleCancelEdit} className="p-2 text-gray-600 hover:bg-gray-200 rounded-full" aria-label="Cancel"><XCircleIcon className="w-5 h-5"/></button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleEditRow(row)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full" aria-label="Edit"><PencilIcon className="w-5 h-5"/></button>
                                                <button onClick={() => handleDeleteRow(row.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-full" aria-label="Delete"><TrashIcon className="w-5 h-5"/></button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {data.length === 0 && (
                                <tr>
                                    <td colSpan={columns.length + 1} className="text-center py-10 text-gray-500">
                                        No data available. Click "เพิ่มรายการใหม่" to add an entry or "Import CSV" to upload data.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <Modal
                isOpen={isImportConfirmOpen}
                onClose={handleCancelImport}
                title="Confirm CSV Import"
                onConfirm={handleConfirmImport}
                confirmText="Confirm & Overwrite"
            >
                <div className="space-y-4">
                    <p className="text-lg font-semibold">
                        Found {csvDataToImport?.length || 0} rows to import.
                    </p>
                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
                        <strong className="font-bold">Warning:</strong> This action will overwrite all existing data in the table. This cannot be undone.
                    </div>
                    {csvImportWarning && (
                        <div className="text-sm text-yellow-800 bg-yellow-50 p-3 rounded-md border border-yellow-200">
                            <strong className="font-bold">Note:</strong> {csvImportWarning}
                        </div>
                    )}
                </div>
            </Modal>
        </>
    );
};

export default DataTablePage;