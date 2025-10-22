import React from 'react';

export const ThaiCreditLogo: React.FC = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="bg-orange-500 p-2 rounded-full">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2h-5a2 2 0 00-2 2v12" />
        </svg>
      </div>
      <div>
        <div className="text-xs font-bold text-blue-900 tracking-wider">ธนาคาร</div>
        <div className="text-lg font-extrabold text-blue-900 -mt-1">ไทยเครดิต</div>
      </div>
    </div>
  );
};
