import React, { useContext, useMemo, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { FormStatus, SearchResult } from '../../types';
import { FORMS, WORKFLOW_STEPS } from '../../constants';
import WorkflowStatusDiagram, { WorkflowStepStatus } from './WorkflowStatusDiagram';
import { TextInput } from '../FormContainer';
import { DatabaseIcon } from '../icons/DatabaseIcon';
import { FolderIcon } from '../icons/FolderIcon';

// Helper function to recursively search within any object or array
const findMatchesInData = (data: any, term: string, currentPath: string = ''): { path: string, value: string }[] => {
  let matches: { path: string, value: string }[] = [];
  if (!data) return matches;

  if (Array.isArray(data)) {
    data.forEach((item, index) => {
      const newPath = `${currentPath}[${index}]`;
      matches = matches.concat(findMatchesInData(item, term, newPath));
    });
  } else if (typeof data === 'object' && data !== null) {
    Object.keys(data).forEach(key => {
      const newPath = currentPath ? `${currentPath}.${key}` : key;
      matches = matches.concat(findMatchesInData(data[key], term, newPath));
    });
  } else if (typeof data === 'string' || typeof data === 'number') {
    if (String(data).toLowerCase().includes(term)) {
      matches.push({ path: currentPath, value: String(data) });
    }
  }

  return matches;
};

// FIX: Add interface for form status data to ensure correct type inference.
interface FormStatusData {
  counts: Record<FormStatus, number>;
  total: number;
}


const Dashboard: React.FC = () => {
  const { currentUser, projects, submissions, setSelectedProject } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [hoveredStatus, setHoveredStatus] = useState<FormStatus | 'In Progress' | null>(null);


  const userProjects = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === 'admin') return projects;
    if (currentUser.role === 'assessor') {
      return projects.filter(p => p.assessorId === currentUser.id);
    }
    if (currentUser.role === 'reviewer') {
      return projects.filter(p => p.reviewerId === currentUser.id);
    }
    return [];
  }, [projects, currentUser]);

  const formStatusData = useMemo<FormStatusData>(() => {
    if (userProjects.length === 0) {
      return {
        counts: { 'Approved': 0, 'Pending Review': 0, 'Rejected': 0, 'Draft': 0, 'Not Started': 0, 'Completed': 0 },
        total: 0,
      };
    }

    const counts: Record<FormStatus, number> = {
      'Approved': 0,
      'Pending Review': 0,
      'Rejected': 0,
      'Draft': 0,
      'Not Started': 0,
      'Completed': 0,
    };

    userProjects.forEach(project => {
      FORMS.forEach(form => {
        const submission = submissions.find(s => s.projectId === project.id && s.formKey === form.key);
        if (submission) {
          counts[submission.status]++;
        } else {
          counts['Not Started']++;
        }
      });
    });

    const total = userProjects.length * FORMS.length;

    return { counts, total };
  }, [submissions, userProjects]);

  // FIX: Explicitly type the return value of useMemo to prevent incorrect type inference for `departments` when it's an empty object.
  // This resolves a downstream error where `sort` function arguments were inferred as `never`.
  const projectsByDepartment = useMemo<{ total: number, departments: Record<string, number> }>(() => {
    if (userProjects.length === 0) {
      return { total: 0, departments: {} };
    }

    const departments: Record<string, number> = {};
    userProjects.forEach(project => {
      const dept = project.assessorDepartment;
      if (departments[dept]) {
        departments[dept]++;
      } else {
        departments[dept] = 1;
      }
    });

    return {
      total: userProjects.length,
      departments,
    };
  }, [userProjects]);

  const managementReportStats = useMemo(() => {
    const approvedRegistrations = submissions.filter(s => s.formKey === 'registration' && s.status === 'Approved');
    const approvedRisks = submissions.filter(s => s.formKey === 'risk' && s.status === 'Approved');
    const approvedContracts = submissions.filter(s => s.formKey === 'contract' && s.status === 'Approved');
    const approvedTerminations = submissions.filter(s => s.formKey === 'termination' && s.status === 'Approved');

    const totalThirdParties = approvedRegistrations.length;
    const totalFourthParties = approvedRegistrations.filter(s => s.data.isFourthParty === true).length;
    
    const dataSets = new Set<string>();
    approvedRegistrations.forEach(s => {
      if(s.data.dataSet) dataSets.add(s.data.dataSet);
    });
    const totalDataSets = dataSets.size;

    const riskLevels: Record<string, number> = { High: 0, Medium: 0, Low: 0, Unassessed: 0 };
    approvedRisks.forEach(s => {
        const level = s.data.impactLevel || 'Unassessed';
        if (level in riskLevels) {
            riskLevels[level as keyof typeof riskLevels]++;
        }
    });

    const significantProjects = {
        byValue: approvedRisks.filter(s => s.data.projectValue > 10000000).length,
        byCustomerData: approvedRisks.filter(s => s.data.customerDataAcess && s.data.customerDataAcess !== 'None').length,
        byCompanyData: approvedRisks.filter(s => s.data.companyDataAcess && s.data.companyDataAcess !== 'None').length,
        byCloud: approvedRisks.filter(s => s.data.isOnExistingCloud === true).length,
        byCriticalSystem: approvedRisks.filter(s => s.data.impactsCriticalSystem === true).length
    };
    
    const now = new Date();
    const ninetyDaysFromNow = new Date();
    ninetyDaysFromNow.setDate(now.getDate() + 90);
    const expiringContracts = approvedContracts
        .map(s => {
            const project = projects.find(p => p.id === s.projectId);
            return { ...s, projectName: project?.name, endDate: new Date(s.data.endDate) };
        })
        .filter(s => s.endDate && s.endDate.getTime() > now.getTime() && s.endDate.getTime() <= ninetyDaysFromNow.getTime());

    const terminatedContracts = approvedTerminations.length;

    return { 
        totalThirdParties, totalFourthParties, totalDataSets, 
        riskLevels, significantProjects, expiringContracts, terminatedContracts
    };
  }, [submissions, projects]);

  const workflowStepStatuses = useMemo((): WorkflowStepStatus[] => {
    if (!userProjects || userProjects.length === 0) {
        return WORKFLOW_STEPS.map(step => ({
            title: step.title,
            description: step.description,
            counts: { 'Approved': 0, 'Pending Review': 0, 'Rejected': 0, 'Draft': 0, 'Not Started': 0, 'Completed': 0 },
            totalProjects: 0,
        }));
    }

    return WORKFLOW_STEPS.map(step => {
        const counts: Record<FormStatus, number> = {
            'Approved': 0,
            'Pending Review': 0,
            'Rejected': 0,
            'Draft': 0,
            'Not Started': 0,
            'Completed': 0,
        };

        if (step.formKey) {
            userProjects.forEach(project => {
                const submission = submissions.find(s => s.projectId === project.id && s.formKey === step.formKey);
                if (submission) {
                    counts[submission.status]++;
                } else {
                    counts['Not Started']++;
                }
            });
        }

        return {
            title: step.title,
            description: step.description,
            counts,
            totalProjects: userProjects.length,
        };
    });
  }, [userProjects, submissions]);


  const handleSearch = () => {
    const term = searchQuery.trim().toLowerCase();
    setHasSearched(true);

    if (!term) {
      setSearchResults([]);
      return;
    }
    const results: SearchResult[] = [];
    projects.forEach(project => {
      if (project.name.toLowerCase().includes(term)) {
        results.push({ project, matchContext: 'Project Name', matchedValue: project.name });
      }
      if (project.description.toLowerCase().includes(term)) {
        results.push({ project, matchContext: 'Project Description', matchedValue: project.description });
      }
    });
    submissions.forEach(submission => {
      const project = projects.find(p => p.id === submission.projectId);
      if (!project) return;
      const formInfo = FORMS.find(f => f.key === submission.formKey);
      const formLabel = formInfo ? formInfo.label.split('.')[1]?.trim() || submission.formKey : submission.formKey;
      const matches = findMatchesInData(submission.data, term);
      matches.forEach(match => {
        if (!results.some(r => r.project.id === project.id && r.matchContext.startsWith(formLabel))) {
            results.push({
              project,
              matchContext: `${formLabel} (${match.path})`,
              matchedValue: match.value,
            });
        }
      });
    });
    setSearchResults(results);
  };

  const statusColors: Record<FormStatus, string> = {
    'Approved': '#22c55e',
    'Pending Review': '#facc15',
    'Rejected': '#ef4444',
    'Draft': '#3b82f6',
    'Not Started': '#9ca3af',
    'Completed': '#4b5563',
  };
  const sortedStatuses: FormStatus[] = ['Approved', 'Pending Review', 'Rejected', 'Draft', 'Not Started', 'Completed'];

  let cumulativePercentage = 0;
  const gradientParts = sortedStatuses
    .map(status => {
      if (formStatusData.total === 0) return '';
      const percentage = (formStatusData.counts[status] / formStatusData.total) * 100;
      if (percentage === 0) return '';
      const color = statusColors[status];
      const part = `${color} ${cumulativePercentage}% ${cumulativePercentage + percentage}%`;
      cumulativePercentage += percentage;
      return part;
    })
    .filter(Boolean);
  
  const doughnutGradient = `conic-gradient(${gradientParts.join(', ')})`;

  return (
    <div className="space-y-8">
      {/* Search Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Global Search</h2>
        <div className="flex space-x-2">
            <TextInput 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="Search all projects, forms, and data..."
                className="flex-grow"
            />
            <button onClick={handleSearch} className="px-6 py-2.5 font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700">Search</button>
        </div>
        {hasSearched && (
            <div className="mt-4">
                {searchResults.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">No results found for "{searchQuery}".</p>
                ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                        {searchResults.map((result, index) => (
                            <div key={index} className="border p-3 rounded-md bg-gray-50">
                                <button onClick={() => setSelectedProject(result.project)} className="text-blue-600 hover:underline font-bold text-left">{result.project.name}</button>
                                <p className="text-sm text-gray-700 mt-1"><span className="font-semibold">Match in:</span> {result.matchContext}</p>
                                <p className="text-sm text-black bg-yellow-100 p-2 rounded mt-1 overflow-hidden text-ellipsis">"{result.matchedValue}"</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}
      </div>

      <WorkflowStatusDiagram steps={workflowStepStatuses} setHoveredStatus={setHoveredStatus} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Overall Forms Status</h3>
          {formStatusData.total > 0 ? (
            <div className="flex flex-col items-center gap-6">
              <div className="relative w-48 h-48 rounded-full" style={{ background: doughnutGradient }}>
                <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-3xl font-bold text-gray-800">{formStatusData.total}</span>
                    <span className="block text-sm text-gray-500">Total Forms</span>
                  </div>
                </div>
              </div>
              <ul className="space-y-1">
                {sortedStatuses.map(status => (
                  <li key={status} className={`flex items-center text-sm transition-opacity duration-200 ${hoveredStatus && hoveredStatus !== status ? 'opacity-30' : 'opacity-100'}`}>
                    <span className="w-4 h-4 rounded-sm mr-3" style={{ backgroundColor: statusColors[status] }}></span>
                    <span className="font-medium text-gray-700 w-32">{status}</span>
                    <span className="text-gray-600 w-16 text-right">{formStatusData.counts[status]} ({formStatusData.total > 0 ? ((formStatusData.counts[status] / formStatusData.total) * 100).toFixed(0) : 0}%)</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : <p className="text-center text-gray-500 py-4">No project data to display.</p>}
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Projects by Department</h3>
          {projectsByDepartment.total > 0 ? (
            <div className="space-y-2">
              {/* FIX: Use a more robust sort function to avoid type inference issues with destructuring in parameters. */}
              {Object.entries(projectsByDepartment.departments).sort(([, countA], [, countB]) => countB - countA).map(([dept, count]) => (
                <div key={dept} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center">
                    <FolderIcon className="h-5 w-5 mr-3 text-gray-400"/>
                    <span className="font-medium text-gray-800">{dept}</span>
                  </div>
                  <span className="font-bold text-lg text-gray-900">{count} <span className="text-sm font-normal text-gray-600">project{count > 1 ? 's' : ''}</span></span>
                </div>
              ))}
            </div>
          ) : <p className="text-center text-gray-500 py-4">No project data to display.</p>}
        </div>
      </div>

      {currentUser?.role === 'admin' && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Management Reports</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-gray-50 rounded-lg"><p className="text-sm text-gray-600">IT Third Parties</p><p className="text-3xl font-semibold text-gray-900">{managementReportStats.totalThirdParties}</p></div>
              <div className="p-4 bg-gray-50 rounded-lg"><p className="text-sm text-gray-600">IT Fourth Parties</p><p className="text-3xl font-semibold text-gray-900">{managementReportStats.totalFourthParties}</p></div>
              <div className="p-4 bg-gray-50 rounded-lg"><p className="text-sm text-gray-600">Terminated</p><p className="text-3xl font-semibold text-gray-900">{managementReportStats.terminatedContracts}</p></div>
              <div className="p-4 bg-gray-50 rounded-lg"><p className="text-sm text-gray-600">Data Sets</p><p className="text-3xl font-semibold text-gray-900">{managementReportStats.totalDataSets}</p></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 border-t pt-4">
              <div>
                  <h3 className="font-semibold text-lg mb-2 text-gray-900">Contracts Expiring in 90 Days</h3>
                  {managementReportStats.expiringContracts.length > 0 ? (
                      <ul className="list-disc list-inside text-sm space-y-1 text-gray-800">
                          {managementReportStats.expiringContracts.map(c => <li key={c.id}><strong>{c.projectName}:</strong> Expires on {c.endDate.toLocaleDateString()}</li>)}
                      </ul>
                  ) : <p className="text-sm text-gray-600">No contracts expiring soon.</p>}
              </div>
              <div>
                  <h3 className="font-semibold text-lg mb-2 text-gray-900">Significant Projects</h3>
                  <ul className="list-disc list-inside text-sm space-y-1 text-gray-800">
                      <li><strong>By Value (&gt;10M):</strong> {managementReportStats.significantProjects.byValue}</li>
                      <li><strong>Accessing Customer Data:</strong> {managementReportStats.significantProjects.byCustomerData}</li>
                      <li><strong>Impacting Critical Systems:</strong> {managementReportStats.significantProjects.byCriticalSystem}</li>
                  </ul>
              </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;