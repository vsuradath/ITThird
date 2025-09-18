import React from 'react';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="bg-white shadow-md z-10">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">{title}</h1>
      </div>
    </header>
  );
};

export default Header;
