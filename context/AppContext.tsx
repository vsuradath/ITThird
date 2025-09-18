import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { User, Project, FormSubmission, Page, FormKey, UserRole, SatisfactionSurveySubmission, FormStatus, FormDefinitions, FormDefinition } from '../types';
import * as api from '../lib/api';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  createUser: (name: string, username: string, password: string, role: UserRole, department: string, registrationDate?: string, signatureImage?: string) => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  deleteUser: (userId: number) => Promise<void>;
  
  projects: Project[];
  createProject: (name: string, description: string, assessorId: number, reviewerId: number) => Promise<void>;
  updateProjectDetails: (projectId: string, updates: Partial<Project>) => Promise<void>;

  submissions: FormSubmission[];
  getProjectFormStatus: (projectId: string, formKey: FormKey) => FormSubmission | undefined;
  submitForm: (projectId: string, formKey: FormKey, data: any) => Promise<void>;
  saveDraft: (projectId: string, formKey: FormKey, data: any) => Promise<void>;
  approveForm: (submissionId: string, comments: string) => Promise<void>;
  rejectForm: (submissionId: string, comments: string) => Promise<void>;
  adminUpdateFormStatus: (projectId: string, formKey: FormKey, newStatus: FormStatus) => Promise<void>;

  satisfactionSurveys: SatisfactionSurveySubmission[];
  getSurveysForProject: (projectId: string) => SatisfactionSurveySubmission[];
  submitSatisfactionSurvey: (data: Omit<SatisfactionSurveySubmission, 'id' | 'submittedAt'>) => Promise<void>;
  deleteSatisfactionSurvey: (surveyId: string) => Promise<void>;

  formDefinitions: FormDefinitions | null;
  updateFormDefinition: (formKey: FormKey, definition: FormDefinition) => Promise<void>;

  page: Page;
  setPage: (page: Page) => void;
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;

  isLoading: boolean;
  error: string | null;
}

export const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [satisfactionSurveys, setSatisfactionSurveys] = useState<SatisfactionSurveySubmission[]>([]);
  const [formDefinitions, setFormDefinitions] = useState<FormDefinitions | null>(null);
  const [page, setPage] = useState<Page>('dashboard');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (currentUser) {
        setIsLoading(true);
        setError(null);
        try {
          // Fetch data in parallel for efficiency
          const [projectsData, submissionsData, surveysData, usersData, formDefsData] = await Promise.all([
            api.apiGetProjects(),
            api.apiGetSubmissions(),
            api.apiGetSurveys(),
            api.apiGetUsers(),
            api.apiGetFormDefinitions(),
          ]);

          setProjects(projectsData.map(p => ({...p, createdAt: new Date(p.createdAt)})));
          setSubmissions(submissionsData.map(s => ({...s, submittedAt: s.submittedAt ? new Date(s.submittedAt) : undefined, reviewedAt: s.reviewedAt ? new Date(s.reviewedAt) : undefined })));
          setSatisfactionSurveys(surveysData.map(s => ({...s, submittedAt: new Date(s.submittedAt)})));
          setUsers(usersData);
          setFormDefinitions(formDefsData);

        } catch (e: any) {
          setError(`Failed to load application data: ${e.message}`);
          console.error(e);
        } finally {
          setIsLoading(false);
        }
      } else {
        // Clear data on logout
        setProjects([]);
        setSubmissions([]);
        setSatisfactionSurveys([]);
        setUsers([]);
        setFormDefinitions(null);
      }
    };
    loadData();
  }, [currentUser]);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const user = await api.apiLogin(username, password);
      setCurrentUser(user);
      setPage('dashboard');
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setSelectedProject(null);
    setPage('dashboard');
  };

  const createUser = async (name: string, username: string, password: string, role: UserRole, department: string, registrationDate?: string, signatureImage?: string) => {
    try {
      const newUser = await api.apiCreateUser(name, username, password, role, department, registrationDate, signatureImage);
      setUsers(prev => [...prev, newUser]);
    } catch(e) {
      alert(`Error creating user: ${e.message}`);
    }
  };

  const updateUser = async (updatedUser: User) => {
    try {
      const returnedUser = await api.apiUpdateUser(updatedUser);
      setUsers(prev => prev.map(user => (user.id === returnedUser.id ? returnedUser : user)));
    } catch(e) {
      alert(`Error updating user: ${e.message}`);
    }
  };

  const deleteUser = async (userId: number) => {
    if (currentUser?.id === userId) {
      alert("You cannot delete your own account.");
      return;
    }
    try {
      await api.apiDeleteUser(userId);
      setUsers(prev => prev.filter(user => user.id !== userId));
    } catch(e) {
      alert(`Error deleting user: ${e.message}`);
    }
  };

  const createProject = async (name: string, description: string, assessorId: number, reviewerId: number) => {
    if (!currentUser || currentUser.role !== 'admin') return;
    try {
      // Need to pass currentUser to API to set `createdBy`
      const newProject = await api.apiCreateProject(name, description, assessorId, reviewerId, currentUser);
      setProjects(prev => [newProject, ...prev]);
    } catch(e) {
       alert(`Error creating project: ${e.message}`);
    }
  };

  const updateProjectDetails = async (projectId: string, updates: Partial<Project>) => {
     if (!currentUser || currentUser.role !== 'admin') return;
     try {
       const updatedProject = await api.apiUpdateProjectDetails(projectId, updates);
       setProjects(prev => prev.map(p => p.id === projectId ? updatedProject : p));
     } catch (e) {
       alert(`Error updating project: ${e.message}`);
     }
  };
  
  const getProjectFormStatus = (projectId: string, formKey: FormKey) => {
    return submissions.find(s => s.projectId === projectId && s.formKey === formKey);
  };

  const saveDraft = async (projectId: string, formKey: FormKey, data: any) => {
    if (!currentUser) return;
    const project = projects.find(p => p.id === projectId);
    if (currentUser.id !== project?.assessorId) return;

    try {
      const draft = await api.apiSaveDraft(projectId, formKey, data, currentUser);
      setSubmissions(prev => {
        const index = prev.findIndex(s => s.id === draft.id);
        if (index > -1) {
            const updated = [...prev];
            updated[index] = draft;
            return updated;
        }
        return [...prev, draft];
      });
    } catch(e) {
      alert(`Error saving draft: ${e.message}`);
    }
  };

  const submitForm = async (projectId: string, formKey: FormKey, data: any) => {
    if (!currentUser) return;
    const project = projects.find(p => p.id === projectId);
    if (currentUser.id !== project?.assessorId) return;

    try {
      const submission = await api.apiSubmitForm(projectId, formKey, data, currentUser);
      setSubmissions(prev => {
        const index = prev.findIndex(s => s.id === submission.id);
        if (index > -1) {
            const updated = [...prev];
            updated[index] = submission;
            return updated;
        }
        return [...prev, submission];
      });
    } catch(e) {
      alert(`Error submitting form: ${e.message}`);
    }
  };

  const updateSubmissionStatus = async (submissionId: string, status: 'Approved' | 'Rejected', comments: string) => {
    const submission = submissions.find(s => s.id === submissionId);
    if (!currentUser || !submission) return;
    
    const project = projects.find(p => p.id === submission.projectId);
    if (!project || currentUser.id !== project.reviewerId) {
        alert("Permission denied: Only the assigned reviewer can approve or reject this form.");
        return;
    };

    try {
      const updatedSubmission = await api.apiUpdateSubmissionStatus(submissionId, status, comments, currentUser);
      setSubmissions(prev => prev.map(s => s.id === updatedSubmission.id ? updatedSubmission : s));
    } catch(e) {
      alert(`Error updating status: ${e.message}`);
    }
  };

  const adminUpdateFormStatus = async (projectId: string, formKey: FormKey, newStatus: FormStatus) => {
    if (!currentUser || currentUser.role !== 'admin') return;
    try {
      const updatedSubmission = await api.apiAdminUpdateFormStatus(projectId, formKey, newStatus, currentUser);
      setSubmissions(prev => {
        const index = prev.findIndex(s => s.id === updatedSubmission.id);
        if (index > -1) {
            const updated = [...prev];
            updated[index] = updatedSubmission;
            return updated;
        }
        return [...prev, updatedSubmission];
      });
    } catch (e) {
      alert(`Error updating form status: ${e.message}`);
    }
  };

  const approveForm = (submissionId: string, comments: string) => updateSubmissionStatus(submissionId, 'Approved', comments);
  const rejectForm = (submissionId: string, comments: string) => updateSubmissionStatus(submissionId, 'Rejected', comments);

  const getSurveysForProject = (projectId: string) => {
    return satisfactionSurveys.filter(s => s.projectId === projectId);
  };

  const submitSatisfactionSurvey = async (data: Omit<SatisfactionSurveySubmission, 'id' | 'submittedAt'>) => {
    try {
      const newSurvey = await api.apiSubmitSurvey(data);
      setSatisfactionSurveys(prev => [newSurvey, ...prev]);
    } catch(e) {
      alert(`Error submitting survey: ${e.message}`);
    }
  };

  const deleteSatisfactionSurvey = async (surveyId: string) => {
    try {
      await api.apiDeleteSurvey(surveyId);
      setSatisfactionSurveys(prev => prev.filter(s => s.id !== surveyId));
    } catch(e) {
      alert(`Error deleting survey: ${e.message}`);
    }
  };

  const updateFormDefinition = async (formKey: FormKey, definition: FormDefinition) => {
    if (!currentUser || currentUser.role !== 'admin') return;
    try {
      const updatedDefinition = await api.apiUpdateFormDefinition(formKey, definition);
      setFormDefinitions(prev => {
        if (!prev) return { [formKey]: updatedDefinition };
        return {
          ...prev,
          [formKey]: updatedDefinition,
        }
      });
    } catch(e) {
      alert(`Error updating form definition: ${e.message}`);
    }
  };

  const contextValue: AppContextType = {
    currentUser,
    users,
    login,
    logout,
    createUser,
    updateUser,
    deleteUser,
    projects,
    createProject,
    updateProjectDetails,
    submissions,
    getProjectFormStatus,
    submitForm,
    saveDraft,
    approveForm,
    rejectForm,
    adminUpdateFormStatus,
    satisfactionSurveys,
    getSurveysForProject,
    submitSatisfactionSurvey,
    deleteSatisfactionSurvey,
    formDefinitions,
    updateFormDefinition,
    page,
    setPage: (p: Page) => {
      if (p === 'dashboard') setSelectedProject(null);
      setPage(p);
    },
    selectedProject,
    setSelectedProject: (project: Project | null) => {
        setSelectedProject(project);
        if (project) {
            setPage('project');
        }
    },
    isLoading,
    error,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};