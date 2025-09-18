import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Project, SearchResult } from '../../types';
import { TextInput } from '../FormContainer';
import { FORMS } from '../../constants';

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


const GlobalSearchPage: React.FC = () => {
  const { projects, submissions, setSelectedProject } = useContext(AppContext);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    const term = searchQuery.trim().toLowerCase();
    setHasSearched(true);

    if (!term) {
      setSearchResults([]);
      return;
    }

    const results: SearchResult[] = [];

    // 1. Search in Project names and descriptions
    projects.forEach(project => {
      if (project.name.toLowerCase().includes(term)) {
        results.push({ project, matchContext: 'Project Name', matchedValue: project.name });
      }
      if (project.description.toLowerCase().includes(term)) {
        results.push({ project, matchContext: 'Project Description', matchedValue: project.description });
      }
    });

    // 2. Search within every form submission
    submissions.forEach(submission => {
      const project = projects.find(p => p.id === submission.projectId);
      if (!project) return;

      const formInfo = FORMS.find(f => f.key === submission.formKey);
      const formLabel = formInfo ? formInfo.label.split('.')[1]?.trim() || submission.formKey : submission.formKey;

      const matches = findMatchesInData(submission.data, term);
      matches.forEach(match => {
        // Avoid adding duplicate projects for multiple matches in the same form
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

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Search All Project Data</h2>
        <p className="text-sm text-gray-600 mb-4">Enter a keyword to search across all project names, descriptions, and the data within every submitted form.</p>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <TextInput 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Search all projects, forms, and data..."
            className="flex-grow"
          />
          <button 
            onClick={handleSearch} 
            className="px-6 py-2.5 font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition-all"
          >
            Search
          </button>
        </div>
        
        {/* Results Area */}
        <div className="mt-6">
          {hasSearched && searchResults.length === 0 && (
            <div className="text-center text-gray-500 py-6 bg-gray-50 rounded-md">
              <p>No results found for "{searchQuery}".</p>
            </div>
          )}
          {searchResults.length > 0 && (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <p className="text-sm text-gray-600 mb-2">Found {searchResults.length} matching result(s):</p>
              {searchResults.map((result, index) => (
                <div key={index} className="border p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <button 
                    onClick={() => setSelectedProject(result.project)}
                    className="text-lg font-bold text-blue-600 hover:underline text-left"
                  >
                    {result.project.name}
                  </button>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-semibold">Match in:</span> {result.matchContext}
                  </p>
                  <p className="text-sm text-black bg-yellow-100 p-2 rounded-md mt-2 overflow-hidden text-ellipsis">
                    "{result.matchedValue}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalSearchPage;