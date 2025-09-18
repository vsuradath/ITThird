import React from 'react';

const dataDefinitions = [
  { dataElement: 'วัตถุประสงค์', explanation: '', validationRule: '', dropdownList: 'N/A', description: '', relatedValue: '' },
  { dataElement: 'Third Party Unique Id Type', explanation: '', validationRule: '', dropdownList: 'N/A', description: '', relatedValue: '' },
  { dataElement: 'ประเภทนิติบุคคล', explanation: '', validationRule: '', dropdownList: 'N/A', description: '', relatedValue: '' },
  { dataElement: 'Third Party Unique Id Type', explanation: '', validationRule: '', dropdownList: 'N/A', description: '', relatedValue: '' },
  { dataElement: 'Third Party Name', explanation: '', validationRule: '', dropdownList: 'N/A', description: '', relatedValue: '' },
  { dataElement: 'Relationship', explanation: '', validationRule: '', dropdownList: 'N/A', description: '', relatedValue: '' },
  { dataElement: 'Registered Country', explanation: '', validationRule: '', dropdownList: 'N/A', description: '', relatedValue: '' },
  { dataElement: 'Third Party Type', explanation: '', validationRule: '', dropdownList: 'N/A', description: '', relatedValue: '' },
  { dataElement: 'Work Type', explanation: '', validationRule: '', dropdownList: 'N/A', description: '', relatedValue: '' },
  { dataElement: 'Integration Type', explanation: '', validationRule: '', dropdownList: 'N/A', description: '', relatedValue: '' },
  { dataElement: 'Scope of work Description', explanation: '', validationRule: '', dropdownList: 'N/A', description: '', relatedValue: '' },
  { dataElement: 'Service Start Date', explanation: '', validationRule: '', dropdownList: 'N/A', description: '', relatedValue: '' },
  { dataElement: 'Service End Date', explanation: '', validationRule: '', dropdownList: 'N/A', description: '', relatedValue: '' },
  { dataElement: 'Service Risk Level', explanation: '', validationRule: '', dropdownList: 'N/A', description: '', relatedValue: '' },
  { dataElement: 'Service SLA', explanation: '', validationRule: '', dropdownList: 'N/A', description: '', relatedValue: '' },
  { dataElement: 'Cloud Type', explanation: '', validationRule: '', dropdownList: 'N/A', description: '', relatedValue: '' },
  { dataElement: 'Data Center Country', explanation: '', validationRule: '', dropdownList: 'N/A', description: '', relatedValue: '' },
  { dataElement: 'Data Access', explanation: '', validationRule: '', dropdownList: 'N/A', description: '', relatedValue: '' },
  { dataElement: '2.1 ระบบงาน/บริการ อยู่บน Cloud Provide ที่ธนาคารมีอยู่แล้ว', explanation: '', validationRule: '', dropdownList: 'N/A', description: '', relatedValue: '' },
  { dataElement: '2.2 ประเภทการให้บริการ Cloud', explanation: '', validationRule: '', dropdownList: 'N/A', description: '', relatedValue: '' },
  { dataElement: '3.1 ขอบเขตการให้บริการ เกี่ยวข้องหรือกระทบกับระบบงานที่สำคัญ', explanation: '', validationRule: '', dropdownList: 'N/A', description: '', relatedValue: '' },
  { dataElement: '3.2 ขอบเขตการให้บริการ เกี่ยวข้องหรือกระทบกับบริการที่สำคัญ', explanation: '', validationRule: '', dropdownList: 'N/A', description: '', relatedValue: '' },
  { dataElement: 'ดำเนินการแล้วหรือไม่', explanation: '', validationRule: '', dropdownList: 'N/A', description: '', relatedValue: '' },
  { dataElement: '4) ขนาด และมูลค่าของโครงการ', explanation: '', validationRule: '', dropdownList: 'N/A', description: '', relatedValue: '' },
  { dataElement: 'ผลการพิจารณา', explanation: '', validationRule: '', dropdownList: 'N/A', description: '', relatedValue: '' },
];

const DataDefinitionPage: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Data Definition</h2>
      <p className="text-sm text-gray-600 mb-6">
        This table provides definitions for key data elements used throughout the IT Third Party Management System. It ensures clarity, consistency, and proper usage of data.
      </p>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Element</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Explanation</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Validation Rule</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dropdown List</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Related Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {dataDefinitions.map((def, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{def.dataElement}</td>
                <td className="px-6 py-4 whitespace-normal text-sm text-gray-600">{def.explanation}</td>
                <td className="px-6 py-4 whitespace-normal text-sm text-gray-600">{def.validationRule}</td>
                <td className="px-6 py-4 whitespace-normal text-sm text-gray-600">{def.dropdownList}</td>
                <td className="px-6 py-4 whitespace-normal text-sm text-gray-600">{def.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{def.relatedValue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataDefinitionPage;