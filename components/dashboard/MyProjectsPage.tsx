import React, { useContext, useState, useMemo, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import Modal from '../common/Modal';
import { TextInput, TextArea } from '../FormContainer';
import { UserRole, Project, FormStatus, FormKey } from '../../types';
import { FORMS } from '../../constants';

interface EditProjectState extends Partial<Project> {
  formStatuses?: Record<FormKey, FormStatus>;
}

// Helper function to recursively search for a term within any data structure
const searchInData = (data: any, term: string): boolean => {
  if (!data) return false;

  if (Array.isArray(data)) {
    return data.some(item => searchInData(item, term));
  }

  if (typeof data === 'object' && data !== null) {
    return Object.values(data).some(value => searchInData(value, term));
  }

  if (typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean') {
    return String(data).toLowerCase().includes(term);
  }

  return false;
};


const MyProjectsPage: React.FC = () => {
  const { currentUser, projects, submissions, createProject, setSelectedProject, users, getProjectFormStatus, updateProjectDetails, adminUpdateFormStatus } = useContext(AppContext);
  
  // State for the "Create Project" modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [selectedAssessor, setSelectedAssessor] = useState('');
  const [selectedReviewer, setSelectedReviewer] = useState('');
  
  // State for the "Edit Project" modal
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editState, setEditState] = useState<EditProjectState>({});

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FormStatus | 'All'>('All');


  useEffect(() => {
    if (editingProject) {
        const initialFormStatuses: Record<FormKey, FormStatus> = {} as any;
        FORMS.forEach(form => {
            const submission = getProjectFormStatus(editingProject.id, form.key);
            initialFormStatuses[form.key] = submission?.status || 'Not Started';
        });
        setEditState({
            name: editingProject.name,
            description: editingProject.description,
            status: editingProject.status,
            assessorId: editingProject.assessorId,
            reviewerId: editingProject.reviewerId,
            formStatuses: initialFormStatuses,
        });
    } else {
        setEditState({});
    }
  }, [editingProject, getProjectFormStatus]);


  const userProjects = useMemo(() => {
    if (!currentUser) return [];

    let baseProjects;
    if (currentUser.role === 'admin') {
      baseProjects = projects;
    } else if (currentUser.role === 'assessor') {
      baseProjects = projects.filter(p => p.assessorId === currentUser.id);
    } else if (currentUser.role === 'reviewer') {
      baseProjects = projects.filter(p => p.reviewerId === currentUser.id);
    } else {
        baseProjects = [];
    }

    const statusFilteredProjects = (statusFilter === 'All' || currentUser.role !== 'admin')
      ? baseProjects
      : baseProjects.filter(project => {
          if (statusFilter === 'Not Started') {
            return FORMS.some(form => !submissions.some(s => s.projectId === project.id && s.formKey === form.key));
          }
          return submissions.some(s => s.projectId === project.id && s.status === statusFilter);
        });
    
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery === '') {
      return statusFilteredProjects;
    }

    const lowercasedQuery = trimmedQuery.toLowerCase();

    return statusFilteredProjects.filter(project => {
      // Base search criteria for all users
      if (
        project.name.toLowerCase().includes(lowercasedQuery) ||
        project.description.toLowerCase().includes(lowercasedQuery)
      ) {
        return true;
      }

      // Admin-only advanced search criteria
      if (currentUser.role === 'admin') {
        if (
          project.assessorName.toLowerCase().includes(lowercasedQuery) ||
          project.reviewerName.toLowerCase().includes(lowercasedQuery)
        ) {
          return true;
        }

        const projectSubmissions = submissions.filter(s => s.projectId === project.id);
        if (projectSubmissions.some(submission => searchInData(submission.data, lowercasedQuery))) {
          return true;
        }
      }

      return false;
    });
  }, [projects, submissions, currentUser, searchQuery, statusFilter]);

  const getAssignableUsers = (role: UserRole) => {
    return users.filter(u => u.role === role);
  }

  const handleCreateProject = () => {
    if (newProjectName.trim() && newProjectDesc.trim() && selectedAssessor && selectedReviewer) {
      createProject(newProjectName, newProjectDesc, parseInt(selectedAssessor), parseInt(selectedReviewer));
      setNewProjectName('');
      setNewProjectDesc('');
      setSelectedAssessor('');
      setSelectedReviewer('');
      setIsCreateModalOpen(false);
    } else {
        alert("Please fill all fields.");
    }
  };

  const handleOpenEditModal = (project: Project) => {
    setEditingProject(project);
  };

  const handleCloseEditModal = () => {
    setEditingProject(null);
  };
  
  const handleEditStateChange = (field: keyof EditProjectState, value: any) => {
      setEditState(prev => ({ ...prev, [field]: value }));
  };
  
  const handleFormStatusChange = (formKey: FormKey, status: FormStatus) => {
      setEditState(prev => ({
          ...prev,
          formStatuses: {
              ...prev.formStatuses,
              [formKey]: status,
          }
      }));
  };

  const handleSaveChanges = async () => {
    if (!editingProject || !editState) return;

    // 1. Update project details if they have changed
    const projectUpdates: Partial<Project> = {};
    if (editState.name !== editingProject.name) projectUpdates.name = editState.name;
    if (editState.description !== editingProject.description) projectUpdates.description = editState.description;
    if (editState.status !== editingProject.status) projectUpdates.status = editState.status;
    if (editState.assessorId !== editingProject.assessorId) projectUpdates.assessorId = editState.assessorId;
    if (editState.reviewerId !== editingProject.reviewerId) projectUpdates.reviewerId = editState.reviewerId;

    if (Object.keys(projectUpdates).length > 0) {
      await updateProjectDetails(editingProject.id, projectUpdates);
    }

    // 2. Update form statuses that have changed
    if (editState.formStatuses) {
      for (const key of FORMS.map(f => f.key)) {
        const originalStatus = getProjectFormStatus(editingProject.id, key)?.status || 'Not Started';
        const newStatus = editState.formStatuses[key];
        if (originalStatus !== newStatus) {
            await adminUpdateFormStatus(editingProject.id, key, newStatus);
        }
      }
    }
    
    handleCloseEditModal();
  };


  return (
    <div className="space-y-8">
       <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-700">{currentUser?.role === 'admin' ? 'Overall Projects' : 'My Projects'}</h2>
        {currentUser?.role === 'admin' && (
            <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-5 py-2.5 font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md transition-all"
            >
                + New Project
            </button>
        )}
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Search & Filter Projects</h3>
        <div className="flex flex-col md:flex-row gap-4">
            <TextInput 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={
                    currentUser?.role === 'admin' 
                    ? "Search by project, assignee, or content in any form..." 
                    : "Search by project name or description..."
                }
                className="flex-grow"
            />
             {currentUser?.role === 'admin' && (
              <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value as FormStatus | 'All')}
                  className="mt-1 block w-full md:w-64 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  aria-label="Filter by form status"
              >
                  <option value="All">All Form Statuses</option>
                  <option value="Not Started">Not Started</option>
                  <option value="Draft">Draft</option>
                  <option value="Pending Review">Pending Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Completed">Completed</option>
              </select>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userProjects.length > 0 ? userProjects.map(project => (
          <div key={project.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">
            <div 
                className="p-5 flex-grow cursor-pointer"
                onClick={() => setSelectedProject(project)}
            >
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-gray-800 pr-2 flex-1">{project.name}</h3>
                    <span className={`flex-shrink-0 text-xs font-semibold px-2 py-1 rounded-full ${project.status === 'Completed' ? 'bg-gray-200 text-gray-700' : 'bg-green-100 text-green-800'}`}>{project.status}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2 h-20 overflow-hidden text-ellipsis">
                    {project.description}
                </p>
            </div>
            
            <div className="border-t border-gray-200 px-5 py-3 text-xs text-gray-600 space-y-1">
                <p><b>Assessor:</b> {project.assessorName} ({project.assessorDepartment})</p>
                <p><b>Reviewer:</b> {project.reviewerName} ({project.reviewerDepartment})</p>
            </div>
            
            {currentUser?.role === 'admin' && (
                <div className="border-t border-gray-200 p-3 bg-gray-50/50 rounded-b-lg">
                    <button 
                        onClick={() => handleOpenEditModal(project)} 
                        className="w-full text-center px-4 py-2 text-sm font-medium bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                    >
                        Manage Project
                    </button>
                </div>
            )}
        </div>
        )) : (
            <div className="md:col-span-2 lg:col-span-3 text-center py-10 text-gray-500 bg-white rounded-lg shadow-md">
                {searchQuery || statusFilter !== 'All' ? `No projects found for the current filters.` : 'You have no projects assigned to you.'}
            </div>
        )}
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create a New Project"
        onConfirm={handleCreateProject}
        confirmText="Create"
      >
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                <TextInput value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} placeholder="e.g., New CRM Implementation"/>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <TextArea value={newProjectDesc} onChange={(e) => setNewProjectDesc(e.target.value)} placeholder="Describe the project and the role of the third party."/>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign Assessor</label>
                <select value={selectedAssessor} onChange={e => setSelectedAssessor(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black">
                    <option value="" disabled>Select an assessor</option>
                    {getAssignableUsers('assessor').map(user => <option key={user.id} value={user.id}>{user.name} ({user.department})</option>)}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign Reviewer</label>
                <select value={selectedReviewer} onChange={e => setSelectedReviewer(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black">
                    <option value="" disabled>Select a reviewer</option>
                    {getAssignableUsers('reviewer').map(user => <option key={user.id} value={user.id}>{user.name} ({user.department})</option>)}
                </select>
            </div>
        </div>
      </Modal>

      {editingProject && (
        <Modal
            isOpen={!!editingProject}
            onClose={handleCloseEditModal}
            title={`Manage Project: ${editingProject.name}`}
            onConfirm={handleSaveChanges}
            confirmText="Save Changes"
            large
        >
            <div className="space-y-6">
                {/* Project Details */}
                <fieldset className="border p-4 rounded-lg">
                    <legend className="text-lg font-semibold px-2">Project Details</legend>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                            <TextInput value={editState.name || ''} onChange={e => handleEditStateChange('name', e.target.value)} />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Project Status</label>
                            <select value={editState.status} onChange={e => handleEditStateChange('status', e.target.value as 'In Progress' | 'Completed')} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-black">
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                        <div className="col-span-2">
                             <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <TextArea value={editState.description || ''} onChange={e => handleEditStateChange('description', e.target.value)} />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Assessor</label>
                            <select value={editState.assessorId} onChange={e => handleEditStateChange('assessorId', parseInt(e.target.value))} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-black">
                                {getAssignableUsers('assessor').map(user => <option key={user.id} value={user.id}>{user.name} ({user.department})</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Reviewer</label>
                            <select value={editState.reviewerId} onChange={e => handleEditStateChange('reviewerId', parseInt(e.target.value))} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-black">
                                {getAssignableUsers('reviewer').map(user => <option key={user.id} value={user.id}>{user.name} ({user.department})</option>)}
                            </select>
                        </div>
                    </div>
                </fieldset>
                {/* Form Statuses */}
                <fieldset className="border p-4 rounded-lg">
                    <legend className="text-lg font-semibold px-2">Form Statuses</legend>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {FORMS.map(form => (
                            <div key={form.key}>
                                <label className="block text-sm font-medium text-gray-700 mb-1 truncate" title={form.label}>{form.label.split('.')[0]}</label>
                                <select 
                                    value={editState.formStatuses?.[form.key] || 'Not Started'} 
                                    onChange={e => handleFormStatusChange(form.key, e.target.value as FormStatus)} 
                                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-black"
                                >
                                    <option>Not Started</option>
                                    <option>Draft</option>
                                    <option>Pending Review</option>
                                    <option>Approved</option>
                                    <option>Rejected</option>
                                    <option>Completed</option>
                                </select>
                            </div>
                        ))}
                    </div>
                </fieldset>
            </div>
        </Modal>
      )}
    </div>
  );
};

export default MyProjectsPage;