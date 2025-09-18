import React, { useContext, useMemo, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { SatisfactionSurveySubmission } from '../../types';
import Modal from '../common/Modal';
import { StarIcon } from '../icons/StarIcon';

const SatisfactionDashboard: React.FC = () => {
  const { satisfactionSurveys, deleteSatisfactionSurvey } = useContext(AppContext);
  const [viewingSurvey, setViewingSurvey] = useState<SatisfactionSurveySubmission | null>(null);
 
  const surveyStats = useMemo(() => {
    if (satisfactionSurveys.length === 0) {
      return { total: 0, overall: 0, communication: 0, responsiveness: 0, quality: 0 };
    }
    const total = satisfactionSurveys.length;
    const sum = satisfactionSurveys.reduce((acc, survey) => {
        acc.overall += survey.overallSatisfaction;
        acc.communication += survey.communication;
        acc.responsiveness += survey.responsiveness;
        acc.quality += survey.qualityOfService;
        return acc;
    }, { overall: 0, communication: 0, responsiveness: 0, quality: 0 });

    return {
        total,
        overall: (sum.overall / total).toFixed(2),
        communication: (sum.communication / total).toFixed(2),
        responsiveness: (sum.responsiveness / total).toFixed(2),
        quality: (sum.quality / total).toFixed(2),
    };
  }, [satisfactionSurveys]);
  
  const scoreDistribution = useMemo(() => {
    if (satisfactionSurveys.length === 0) {
      return { gradient: '', legend: [], total: 0 };
    }

    const scoreCounts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let totalWithScores = 0;
    satisfactionSurveys.forEach(survey => {
      if (survey.overallSatisfaction >= 1 && survey.overallSatisfaction <= 5) {
        scoreCounts[survey.overallSatisfaction]++;
        totalWithScores++;
      }
    });

    if (totalWithScores === 0) {
      return { gradient: '', legend: [], total: 0 };
    }
    
    const SCORE_COLORS: Record<number, string> = {
      5: '#22c55e', // green-500
      4: '#84cc16', // lime-500
      3: '#facc15', // yellow-400
      2: '#fb923c', // orange-400
      1: '#ef4444', // red-500
    };

    let cumulativePercentage = 0;
    const gradientParts: string[] = [];
    const legend: { score: number; count: number; percentage: string; color: string; }[] = [];
    const sortedScores = [5, 4, 3, 2, 1];

    for (const score of sortedScores) {
      const count = scoreCounts[score];
      if (count > 0) {
        const percentage = (count / totalWithScores) * 100;
        const color = SCORE_COLORS[score];
        
        gradientParts.push(`${color} ${cumulativePercentage}% ${cumulativePercentage + percentage}%`);
        
        legend.push({
          score,
          count,
          percentage: percentage.toFixed(1),
          color
        });

        cumulativePercentage += percentage;
      }
    }

    return {
      gradient: `conic-gradient(${gradientParts.join(', ')})`,
      legend,
      total: totalWithScores,
    };
  }, [satisfactionSurveys]);

  const handleDeleteSurvey = (surveyId: string) => {
      if (window.confirm('Are you sure you want to delete this survey submission?')) {
          deleteSatisfactionSurvey(surveyId);
      }
  };

  return (
    <div className="space-y-8">
       <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Satisfaction Survey Results</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 text-center">
                <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Total Submissions</p>
                    <p className="mt-1 text-3xl font-semibold text-gray-900">{surveyStats.total}</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm font-medium text-yellow-800">Avg. Overall</p>
                    <p className="mt-1 text-3xl font-semibold text-yellow-800 flex items-center justify-center">{surveyStats.overall} <StarIcon className="w-5 h-5 ml-1 text-yellow-500"/></p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-600">Avg. Communication</p>
                    <p className="mt-1 text-3xl font-semibold text-blue-800 flex items-center justify-center">{surveyStats.communication} <StarIcon className="w-5 h-5 ml-1 text-blue-500"/></p>
                </div>
                 <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-600">Avg. Quality</p>
                    <p className="mt-1 text-3xl font-semibold text-green-800 flex items-center justify-center">{surveyStats.quality} <StarIcon className="w-5 h-5 ml-1 text-green-500"/></p>
                </div>
          </div>
          
          <div className="border-t pt-6 mt-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Overall Score Distribution</h3>
            {scoreDistribution.total > 0 ? (
              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                <div
                  className="relative w-48 h-48 rounded-full"
                  style={{ background: scoreDistribution.gradient }}
                  role="img"
                  aria-label="Doughnut chart showing overall score distribution"
                >
                  <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                      <div className="text-center">
                          <span className="text-3xl font-bold text-gray-800">{scoreDistribution.total}</span>
                          <span className="block text-sm text-gray-500">Total Surveys</span>
                      </div>
                  </div>
                </div>
                <ul className="space-y-2" aria-label="Chart legend">
                  {scoreDistribution.legend.map(item => (
                    <li key={item.score} className="flex items-center text-sm">
                      <span
                        className="w-4 h-4 rounded-sm mr-3"
                        style={{ backgroundColor: item.color }}
                      ></span>
                      <span className="font-medium text-gray-700 w-24 flex items-center">{item.score} Stars <StarIcon className="w-4 h-4 ml-1 text-yellow-400"/></span>
                      <span className="text-gray-600 w-20 text-right">{item.count} ({item.percentage}%)</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No survey data to display distribution.</p>
            )}
          </div>

          <div className="overflow-x-auto mt-6 border-t pt-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">All Submissions</h3>
            <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project / System</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Third Party</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overall Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted On</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                {satisfactionSurveys.map(survey => (
                    <tr key={survey.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{survey.projectName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{survey.thirdPartyName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center">{survey.overallSatisfaction} / 5 <StarIcon className="w-4 h-4 ml-1 text-yellow-400"/></td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{survey.submittedAt.toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium space-x-2">
                           <button onClick={() => setViewingSurvey(survey)} className="text-indigo-600 hover:text-indigo-900">Details</button>
                           <button onClick={() => handleDeleteSurvey(survey.id)} className="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                    </tr>
                ))}
                 {satisfactionSurveys.length === 0 && (
                    <tr>
                        <td colSpan={5} className="text-center py-10 text-gray-500">No survey submissions yet.</td>
                    </tr>
                )}
                </tbody>
            </table>
            </div>
       </div>

      {/* View Survey Modal */}
      {viewingSurvey && (
        <Modal isOpen={true} onClose={() => setViewingSurvey(null)} title="Survey Submission Details">
          <div className="space-y-4 text-sm text-black">
            <p><strong>Project/System:</strong> {viewingSurvey.projectName}</p>
            <p><strong>Third Party:</strong> {viewingSurvey.thirdPartyName}</p>
            <p><strong>Submitted By:</strong> {viewingSurvey.submittedByName || 'Anonymous'}</p>
            <p><strong>Submitted On:</strong> {viewingSurvey.submittedAt.toLocaleString()}</p>
            <div className="border-t pt-4 mt-4 space-y-2">
                <p><strong>Overall Satisfaction:</strong> {viewingSurvey.overallSatisfaction} / 5</p>
                <p><strong>Communication:</strong> {viewingSurvey.communication} / 5</p>
                <p><strong>Responsiveness:</strong> {viewingSurvey.responsiveness} / 5</p>
                <p><strong>Quality of Service:</strong> {viewingSurvey.qualityOfService} / 5</p>
            </div>
            {viewingSurvey.comments && (
                <div className="border-t pt-4 mt-4">
                    <p className="font-semibold">Comments:</p>
                    <p className="mt-1 p-3 bg-gray-50 rounded-md whitespace-pre-wrap">{viewingSurvey.comments}</p>
                </div>
            )}
            <div className="flex justify-end pt-4">
                 <button 
                    onClick={() => setViewingSurvey(null)} 
                    className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10"
                >
                Close
                </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SatisfactionDashboard;