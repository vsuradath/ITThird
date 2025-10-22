import React, { useContext } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { AppContext } from './context/AppContext';
import LoginPage from './components/auth/LoginPage';
import Dashboard from './components/dashboard/Dashboard';
import ProjectDetails from './components/dashboard/ProjectDetails';
import AdminDashboard from './components/admin/AdminDashboard';
import SatisfactionSurveyPage from './components/surveys/SatisfactionSurveyPage';
import SatisfactionDashboard from './components/surveys/SatisfactionDashboard';
import MyProjectsPage from './components/dashboard/MyProjectsPage';
import DataDefinitionPage from './components/pages/DataDefinitionPage';
import OverallDocumentFormPage from './components/pages/OverallDocumentFormPage';
import ServiceApprovalPage from './components/pages/ServiceApprovalPage';
import PoliciesAndRegulationsPage from './components/admin_pages/PoliciesAndRegulationsPage';
import ManualsAndDocumentsPage from './components/admin_pages/ManualsAndDocumentsPage';
import ITThirdPartyRegisterPage from './components/admin_pages/ITThirdPartyRegisterPage';
import FourthPartyRegisterPage from './components/admin_pages/FourthPartyRegisterPage';
import DataSetRegisterPage from './components/admin_pages/DataSetRegisterPage';
import FourthPartyFormSetPage from './components/admin_pages/FourthPartyFormSetPage';
import DataSetFormSetPage from './components/admin_pages/DataSetFormSetPage';

const App: React.FC = () => {
  const { currentUser, page, selectedProject, isLoading, error, isSidebarOpen, toggleSidebar } = useContext(AppContext);

  if (!currentUser) {
    return <LoginPage />;
  }

  // Handle global loading state for initial data fetch
  if (isLoading) {
    return (
        <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-600 mx-auto mb-4"></div>
                <p className="text-xl font-semibold text-gray-700">Loading Application Data...</p>
            </div>
        </div>
    );
  }

  // Handle global error state
  if (error) {
     return (
        <div className="flex h-screen w-screen items-center justify-center bg-red-50 p-3">
            <div className="text-center p-6 bg-white shadow-2xl rounded-lg border border-red-200">
                <h2 className="text-2xl font-bold text-red-600 mb-4">An Error Occurred</h2>
                <p className="text-gray-700 max-w-md">{error}</p>
                 <button 
                    onClick={() => window.location.reload()}
                    className="mt-6 px-6 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                    Try Again
                </button>
            </div>
        </div>
    );
  }

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <Dashboard />;
      case 'myProjects':
        return <MyProjectsPage />;
      case 'project':
        if (selectedProject) {
          return <ProjectDetails project={selectedProject} />;
        }
        return <Dashboard />; // Fallback to dashboard
      case 'admin':
        return <AdminDashboard />;
      case 'dataDefinition':
        return <DataDefinitionPage />;
      case 'satisfactionDashboard':
        return <SatisfactionDashboard />;
      case 'overallDocuments':
        return <OverallDocumentFormPage />;
      case 'serviceApproval':
        return <ServiceApprovalPage />;
      case 'submitSurvey':
        if (selectedProject) {
          return <SatisfactionSurveyPage />;
        }
        return <Dashboard />; // Fallback to dashboard
      // New Admin Pages
      case 'policiesAndRegulations':
        return <PoliciesAndRegulationsPage />;
      case 'manualsAndDocuments':
        return <ManualsAndDocumentsPage />;
      case 'itThirdPartyRegister':
        return <ITThirdPartyRegisterPage />;
      case 'fourthPartyRegister':
        return <FourthPartyRegisterPage />;
      case 'dataSetRegister':
        return <DataSetRegisterPage />;
      case 'fourthPartyFormSet':
        return <FourthPartyFormSetPage />;
      case 'dataSetFormSet':
        return <DataSetFormSetPage />;
      default:
        return <Dashboard />;
    }
  };
  
  const getTitle = () => {
    switch (page) {
      case 'dashboard':
        return currentUser?.role === 'admin' ? 'ภาพรวมในการรายงาน' : 'Overall Dashboard';
      case 'myProjects':
        return currentUser?.role === 'admin' ? 'ระบบงานหรือโครงการ' : 'My Projects';
      case 'project':
        return selectedProject?.name || 'Project Details';
      case 'admin':
        return 'Admin Panel';
      case 'dataDefinition':
        return 'Data Definition';
      case 'satisfactionDashboard':
        return currentUser?.role === 'admin' ? 'แดชบอร์ดความพึงพอใจ' : 'Satisfaction Survey Dashboard';
      case 'overallDocuments':
        return 'ชุดแบบฟอร์ม IT Third Party';
      case 'serviceApproval':
        return 'New Third-Party Service Approval Request';
      case 'submitSurvey':
        return `Satisfaction Survey: ${selectedProject?.name || 'Project'}`;
      // New Admin Page Titles
      case 'policiesAndRegulations':
        return 'นโยบายและระเบียบปฏิบัติ';
      case 'manualsAndDocuments':
        return 'คู่มือและเอกสารอื่นฯ';
      case 'itThirdPartyRegister':
        return 'ทะเบียน IT Third Party';
      case 'fourthPartyRegister':
        return 'ทะเบียน Fourth Party';
      case 'dataSetRegister':
        return 'ทะเบียน Data Set';
      case 'fourthPartyFormSet':
        return 'ชุดแบบฟอร์ม Fourth Party';
      case 'dataSetFormSet':
        return 'ชุดแบบฟอร์ม Data Set';
      default:
        return 'IT Third Party Document Management';
    }
  }

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar />

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          onClick={toggleSidebar} 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          aria-hidden="true"
        ></div>
      )}
      
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${isSidebarOpen ? 'md:ml-64' : 'md:ml-0'} print:ml-0 print:overflow-visible`}>
        <div className="print:hidden">
          <Header title={getTitle()} />
        </div>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-2 md:p-4 print:p-0 print:bg-white">
          <div className="container mx-auto max-w-7xl print:max-w-none print:m-0">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;