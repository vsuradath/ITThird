import React from 'react';

export const WorkflowImage: React.FC = () => {
  // This component renders a placeholder for the workflow diagram.
  // In a real implementation, this would be an <img /> tag with the base64 data URL
  // of the workflow image provided by the user. The base64 string is too long to
  // be included here.
  return (
    <div className="flex justify-center items-center bg-gray-100 p-4">
      <div className="w-full h-[500px] border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center">
        <p className="text-gray-500 text-lg text-center p-4">
          [Placeholder for the detailed IT Third Party Workflow Process Diagram]
        </p>
      </div>
    </div>
  );
};
