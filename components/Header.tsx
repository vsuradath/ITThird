import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { MenuIcon } from './icons/MenuIcon';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { toggleSidebar } = useContext(AppContext);

  return (
    <header className="bg-white shadow-md z-10">
      <div className="px-2 sm:px-4 lg:px-5 py-2 flex items-center">
        <button
          onClick={toggleSidebar}
          className="mr-4 text-gray-600 hover:text-gray-800 focus:outline-none"
          aria-label="Toggle menu"
        >
          <MenuIcon className="h-6 w-6" />
        </button>
        <h1 className="text-lg md:text-xl font-semibold text-gray-800">{title}</h1>
      </div>
    </header>
  );
};

export default Header;