import React from 'react';
import { FormStatus } from '../../types';

interface StatusBadgeProps {
  status: FormStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusStyles: Record<FormStatus, string> = {
    'Not Started': 'bg-gray-200 text-gray-700',
    'Draft': 'bg-blue-200 text-blue-800',
    'Pending Review': 'bg-yellow-200 text-black',
    'Approved': 'bg-green-200 text-green-800',
    'Rejected': 'bg-red-200 text-black',
    'Completed': 'bg-gray-700 text-white',
  };

  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusStyles[status]}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
