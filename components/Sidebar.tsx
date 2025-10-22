import React, { useContext, useState, ReactNode } from 'react';
import { AppContext } from '../context/AppContext';
import Modal from './common/Modal';
import { ServiceRequestContent } from './common/ServiceRequestContent';
import { DocumentIcon } from './icons/DocumentIcon';
import { StarIcon } from './icons/StarIcon';
import { AdminIcon } from './icons/AdminIcon';
import { FolderIcon } from './icons/FolderIcon';
import { SearchIcon } from './icons/SearchIcon';
import { DatabaseIcon } from './icons/DatabaseIcon';
import { DocumentAddIcon } from './icons/DocumentAddIcon';
import { Page } from '../types';

const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

interface CollapsibleMenuProps {
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
}

const CollapsibleMenu: React.FC<CollapsibleMenuProps> = ({ title, icon, isOpen, onToggle, children }) => (
  <div>
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full px-3 py-1.5 text-sm font-medium text-left text-gray-300 rounded-md hover:bg-slate-700 hover:text-white"
    >
      <div className="flex items-center">
        {icon}
        <span className="ml-3">{title}</span>
      </div>
      <ChevronDownIcon className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
    </button>
    {isOpen && <div className="mt-1 pl-6 space-y-1">{children}</div>}
  </div>
);

interface SubMenuItemProps {
  pageKey: Page;
  label: string;
}

const SubMenuItem: React.FC<SubMenuItemProps> = ({ pageKey, label }) => {
  const { page, setPage } = useContext(AppContext);
  return (
    <a
      href="#"
      onClick={(e) => { e.preventDefault(); setPage(pageKey); }}
      className={`block px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
        page === pageKey
          ? 'bg-blue-600 text-white'
          : 'text-gray-400 hover:bg-slate-600 hover:text-white'
      }`}
    >
      {label}
    </a>
  );
};

// FIX: Correctly type props for NonAdminMenu
interface NonAdminMenuProps {
  setIsServiceRequestModalOpen: (isOpen: boolean) => void;
}

const NonAdminMenu: React.FC<NonAdminMenuProps> = ({ setIsServiceRequestModalOpen }) => {
    // FIX: Remove setIsServiceRequestModalOpen from context destructuring as it's passed via props.
    const { currentUser, page, setPage } = useContext(AppContext);
    return (
        <>
            {currentUser?.role === 'assessor' && (
              <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); setIsServiceRequestModalOpen(true); }}
                  className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                  page === 'serviceApproval'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                  }`}
              >
                  <DocumentAddIcon className="h-5 w-5 mr-3" />
                  <span>New Service Request</span>
              </a>
            )}
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); setPage('dashboard'); }}
              className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
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
                className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                  page === 'myProjects' || page === 'project'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <FolderIcon className="h-5 w-5 mr-3" />
                <span>My Projects</span>
            </a>
        </>
    );
};

const AdminMenu: React.FC = () => {
  const [openMenu, setOpenMenu] = useState<string | null>('menu4');

  const toggleMenu = (menuKey: string) => {
    setOpenMenu(openMenu === menuKey ? null : menuKey);
  };
  
  return (
    <>
      <CollapsibleMenu title="01. นโยบายและขั้นตอน" icon={<DocumentIcon className="h-5 w-5"/>} isOpen={openMenu === 'menu1'} onToggle={() => toggleMenu('menu1')}>
        <SubMenuItem pageKey="policiesAndRegulations" label="นโยบายและระเบียบปฏิบัติ" />
        <SubMenuItem pageKey="manualsAndDocuments" label="คู่มือและเอกสารอื่นฯ" />
      </CollapsibleMenu>

      <CollapsibleMenu title="02. ทะเบียนและหลักฐาน" icon={<DatabaseIcon className="h-5 w-5"/>} isOpen={openMenu === 'menu2'} onToggle={() => toggleMenu('menu2')}>
        <SubMenuItem pageKey="itThirdPartyRegister" label="ทะเบียน IT Third Party" />
        <SubMenuItem pageKey="fourthPartyRegister" label="ทะเบียน Fourth Party" />
        <SubMenuItem pageKey="dataSetRegister" label="ทะเบียน Data Set" />
      </CollapsibleMenu>
      
      <CollapsibleMenu title="03. แบบฟอร์มและเอกสาร" icon={<FolderIcon className="h-5 w-5"/>} isOpen={openMenu === 'menu3'} onToggle={() => toggleMenu('menu3')}>
        <SubMenuItem pageKey="overallDocuments" label="ชุดแบบฟอร์ม IT Third Party" />
        <SubMenuItem pageKey="fourthPartyFormSet" label="ชุดแบบฟอร์ม Fourth Party" />
        <SubMenuItem pageKey="dataSetFormSet" label="ชุดแบบฟอร์ม Data Set" />
      </CollapsibleMenu>

      <CollapsibleMenu title="04. การรายงานและติดตาม" icon={<SearchIcon className="h-5 w-5"/>} isOpen={openMenu === 'menu4'} onToggle={() => toggleMenu('menu4')}>
        <SubMenuItem pageKey="myProjects" label="ระบบงานหรือโครงการ" />
        <SubMenuItem pageKey="dashboard" label="ภาพรวมในการรายงาน" />
        <SubMenuItem pageKey="satisfactionDashboard" label="แดชบอร์ดความพึงพอใจ" />
      </CollapsibleMenu>
    </>
  );
};


const Sidebar: React.FC = () => {
  // FIX: Add 'page' to context destructuring to fix 'Cannot find name' errors.
  const { currentUser, page, setPage, logout, isSidebarOpen } = useContext(AppContext);
  const [isServiceRequestModalOpen, setIsServiceRequestModalOpen] = useState(false);

  return (
    <>
      <div className={`
        w-64 bg-slate-800 text-white flex flex-col h-full flex-shrink-0 fixed z-30
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Top Section */}
        <div>
          <div className="h-12 flex items-center justify-center px-4 bg-slate-900 shadow-md">
            <h2 className="text-lg font-bold text-center">IT Third Party Docs</h2>
          </div>
          <div className="p-2 border-b border-slate-700">
            <p className="text-sm text-gray-400">Welcome,</p>
            <p className="font-semibold text-base">{currentUser?.name}</p>
            <p className="text-xs uppercase bg-cyan-600 inline-block px-2 py-0.5 rounded-full mt-1">{currentUser?.role}</p>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-2 py-2 space-y-1 overflow-y-auto">
          {currentUser?.role === 'admin' ? <AdminMenu /> : <NonAdminMenu setIsServiceRequestModalOpen={setIsServiceRequestModalOpen} />}
        </nav>
        
        {/* Footer / Logout */}
        <div className="p-3 border-t border-slate-700">
            <div className="mb-4 space-y-1">
              <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); setPage('dataDefinition'); }}
                  className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
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
                    className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
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
      <Modal
          isOpen={isServiceRequestModalOpen}
          onClose={() => setIsServiceRequestModalOpen(false)}
          title="IT Third-Party Service Request"
          large
      >
          <ServiceRequestContent />
          <div className="mt-6 flex justify-end border-t pt-4">
              <button
                  onClick={() => {
                      setPage('serviceApproval');
                      setIsServiceRequestModalOpen(false);
                  }}
                  className="px-5 py-2.5 font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                  เริ่ม ลงะเทียนขอใช้บริการบุคคลภายนอก
              </button>
          </div>
      </Modal>
    </>
  );
};

export default Sidebar;