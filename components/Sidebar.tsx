import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { DocumentIcon } from './icons/DocumentIcon';
import { StarIcon } from './icons/StarIcon';
import { AdminIcon } from './icons/AdminIcon';
import { FolderIcon } from './icons/FolderIcon';
import { SearchIcon } from './icons/SearchIcon';
import { DatabaseIcon } from './icons/DatabaseIcon';

const Sidebar: React.FC = () => {
  const { currentUser, page, setPage, logout } = useContext(AppContext);

  return (
    <div className="w-80 bg-slate-800 text-white flex flex-col h-full flex-shrink-0 hidden md:flex">
      {/* Top Section */}
      <div>
        <div className="h-16 flex items-center justify-center px-4 bg-slate-900 shadow-md">
          <h2 className="text-xl font-bold text-center">IT Third Party Docs</h2>
        </div>
        <div className="p-4 border-b border-slate-700">
          <p className="text-sm text-gray-400">Welcome,</p>
          <p className="font-semibold text-lg">{currentUser?.name}</p>
          <p className="text-xs uppercase bg-cyan-600 inline-block px-2 py-0.5 rounded-full mt-1">{currentUser?.role}</p>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        <a
            href="#"
            onClick={(e) => { e.preventDefault(); setPage('dashboard'); }}
            className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors duration-200 ${
              page === 'dashboard'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <DocumentIcon className="h-5 w-5 mr-3" />
            <span>Overall Dashboard</span>
        </a>
        <a
            href="#"
            onClick={(e) => { e.preventDefault(); setPage('myProjects'); }}
            className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors duration-200 ${
              page === 'myProjects' || page === 'project'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <FolderIcon className="h-5 w-5 mr-3" />
            <span>{currentUser?.role === 'admin' ? 'Overall Projects' : 'My Projects'}</span>
        </a>
        
        {currentUser?.role === 'admin' && (
          <>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); setPage('overallDocuments'); }}
              className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                page === 'overallDocuments'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <SearchIcon className="h-5 w-5 mr-3" />
              <span>Overall Document Form</span>
            </a>
            <a
                href="#"
                onClick={(e) => { e.preventDefault(); setPage('satisfactionDashboard'); }}
                className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                page === 'satisfactionDashboard'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                }`}
            >
                <StarIcon className="h-5 w-5 mr-3" />
                <span>Satisfaction Dashboard</span>
            </a>
          </>
        )}
      </nav>
      
      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-700">
          <div className="mb-4 space-y-1">
            <a
                href="#"
                onClick={(e) => { e.preventDefault(); setPage('dataDefinition'); }}
                className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                page === 'dataDefinition'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                }`}
            >
                <DatabaseIcon className="h-5 w-5 mr-3" />
                <span>Data Definition</span>
            </a>
            {currentUser?.role === 'admin' && (
              <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); setPage('admin'); }}
                  className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                  page === 'admin'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                  }`}
              >
                  <AdminIcon className="h-5 w-5 mr-3" />
                  <span>Admin Panel</span>
              </a>
            )}
          </div>
          <button 
            onClick={logout}
            className="w-full text-center px-3 py-2 text-sm font-medium rounded-md bg-red-600 hover:bg-red-700 text-white transition-colors duration-200"
          >
            Logout
          </button>
      </div>
    </div>
  );
};

export default Sidebar;