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

const App: React.FC = () => {
  const { currentUser, page, selectedProject, isLoading, error } = useContext(AppContext);

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
        <div className="flex h-screen w-screen items-center justify-center bg-red-50 p-4">
            <div className="text-center p-8 bg-white shadow-2xl rounded-lg border border-red-200">
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
      case 'submitSurvey':
        if (selectedProject) {
          return <SatisfactionSurveyPage />;
        }
        return <Dashboard />; // Fallback to dashboard
      default:
        return <Dashboard />;
    }
  };
  
  const getTitle = () => {
    switch (page) {
      case 'dashboard':
        return 'Overall Dashboard';
      case 'myProjects':
        return currentUser?.role === 'admin' ? 'Overall Projects' : 'My Projects';
      case 'project':
        return selectedProject?.name || 'Project Details';
      case 'admin':
        return 'Admin Panel';
      case 'dataDefinition':
        return 'Data Definition';
      case 'satisfactionDashboard':
        return 'Satisfaction Survey Dashboard';
      case 'overallDocuments':
        return 'Overall Document Forms';
      case 'submitSurvey':
        return `Satisfaction Survey: ${selectedProject?.name || 'Project'}`;
      default:
        return 'IT Third Party Document Management';
    }
  }

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <div className="print:hidden">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden print:overflow-visible">
        <div className="print:hidden">
          <Header title={getTitle()} />
        </div>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-8 print:p-0 print:bg-white">
          <div className="container mx-auto max-w-7xl print:max-w-none print:m-0">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;