import React from 'react';
import { FormStatus } from '../../types';
import { CheckIcon } from '../icons/CheckIcon';
import { ClockIcon } from '../icons/ClockIcon';
import { XCircleIcon } from '../icons/XCircleIcon';
import { PencilIcon } from '../icons/PencilIcon';

// Define status colors and icons for tooltip
const STATUS_VISUALS: Record<FormStatus, { color: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }> = {
    'Approved': { color: 'bg-green-500', icon: CheckIcon },
    'Pending Review': { color: 'bg-yellow-500', icon: ClockIcon },
    'Rejected': { color: 'bg-red-500', icon: XCircleIcon },
    'Draft': { color: 'bg-blue-500', icon: PencilIcon },
    'Not Started': { color: 'bg-gray-400', icon: () => <div className="w-2.5 h-2.5 bg-gray-400 rounded-full"></div> },
    'Completed': { color: 'bg-gray-600', icon: CheckIcon },
};

// Define aggregate step status logic
const getStepAggregateStatus = (counts: Record<FormStatus, number>, total: number): FormStatus | 'In Progress' => {
    if (total === 0) return 'Not Started';
    if (counts['Rejected'] > 0) return 'Rejected';
    if (counts['Pending Review'] > 0) return 'Pending Review';
    if (counts['Draft'] > 0) return 'Draft';
    if (counts['Approved'] === total && total > 0) return 'Approved';
    
    const totalStarted = counts['Approved'] + counts['Draft'] + counts['Pending Review'] + counts['Rejected'] + counts['Completed'];
    if (totalStarted > 0) return 'In Progress';
    
    return 'Not Started';
};

// Define visuals for the chevron items
const CHEVRON_VISUALS: Record<FormStatus | 'In Progress', { bgColor: string, textColor: string, icon: React.FC<React.SVGProps<SVGSVGElement>> }> = {
    'Approved': { bgColor: 'bg-green-500', textColor: 'text-white', icon: CheckIcon },
    'In Progress': { bgColor: 'bg-teal-500', textColor: 'text-white', icon: CheckIcon },
    'Pending Review': { bgColor: 'bg-yellow-400', textColor: 'text-black', icon: ClockIcon },
    'Draft': { bgColor: 'bg-blue-500', textColor: 'text-white', icon: PencilIcon },
    'Rejected': { bgColor: 'bg-red-500', textColor: 'text-white', icon: XCircleIcon },
    'Not Started': { bgColor: 'bg-gray-300', textColor: 'text-gray-800', icon: () => <div className="w-5 h-5"></div> },
    'Completed': { bgColor: 'bg-gray-600', textColor: 'text-white', icon: CheckIcon },
};


export interface WorkflowStepStatus {
  title: string;
  description: string;
  counts: Record<FormStatus, number>;
  totalProjects: number;
}

interface Props {
  steps: WorkflowStepStatus[];
  setHoveredStatus: (status: FormStatus | 'In Progress' | null) => void;
}

const ChevronStep: React.FC<{ 
    step: WorkflowStepStatus; 
    index: number; 
    isFirst: boolean; 
    isLast: boolean;
    setHoveredStatus: (status: FormStatus | 'In Progress' | null) => void;
}> = ({ step, index, isFirst, isLast, setHoveredStatus }) => {
    const aggregateStatus = getStepAggregateStatus(step.counts, step.totalProjects);
    const visuals = CHEVRON_VISUALS[aggregateStatus];
    const IconComponent = visuals.icon;

    const relevantStatuses = (Object.keys(step.counts) as FormStatus[]).filter(status => step.counts[status] > 0);
    
    const arrowWidth = 20;

    let clipPathStyle = '';
    if (isFirst && isLast) {
        clipPathStyle = `polygon(0 0, 100% 0, 100% 100%, 0 100%)`; // rectangle for single item
    } else if (isFirst) {
        clipPathStyle = `polygon(0 0, calc(100% - ${arrowWidth}px) 0, 100% 50%, calc(100% - ${arrowWidth}px) 100%, 0 100%)`;
    } else if (isLast) {
        clipPathStyle = `polygon(${arrowWidth}px 0, 100% 0, 100% 100%, ${arrowWidth}px 100%, 0 50%)`;
    } else {
        clipPathStyle = `polygon(${arrowWidth}px 0, calc(100% - ${arrowWidth}px) 0, 100% 50%, calc(100% - ${arrowWidth}px) 100%, ${arrowWidth}px 100%, 0 50%)`;
    }
    
    return (
        <div 
            className={`group relative flex items-center justify-center h-12 w-48 shrink-0 ${isFirst ? '' : `ml-[-${arrowWidth}px]`}`}
            onMouseEnter={() => setHoveredStatus(aggregateStatus)}
            onMouseLeave={() => setHoveredStatus(null)}
        >
            <div
                className={`absolute inset-0 transition-transform duration-200 group-hover:scale-105 ${visuals.bgColor}`}
                style={{ clipPath: clipPathStyle, zIndex: 20 - index }} // zIndex adjusted for two rows
            ></div>
            <div className={`relative flex items-center p-2 transition-transform duration-200 group-hover:scale-105 ${visuals.textColor}`} style={{ zIndex: 21 - index }}>
                <IconComponent className="w-5 h-5 mr-2 shrink-0" />
                <div className="text-left">
                    <p className="text-xs font-bold">{step.title}</p>
                </div>
            </div>
            
            {/* Tooltip */}
            <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-60 p-3 bg-slate-800 text-white text-sm rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 z-50 pointer-events-none">
                <p className="font-bold border-b border-slate-600 pb-1">{step.title}</p>
                {step.totalProjects > 0 && relevantStatuses.length > 0 ? (
                    <ul className="space-y-1 mt-2">
                        {relevantStatuses.map(status => (
                            <li key={status} className="flex items-center">
                                <span className={`w-3 h-3 rounded-full mr-2 ${STATUS_VISUALS[status].color}`}></span>
                                <span>{status}: {step.counts[status]}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-400 mt-2">{ index === 0 ? "Initial process step" : "No projects in this stage."}</p>
                )}
                {/* Arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-800 rotate-45"></div>
            </div>
        </div>
    );
};

const WorkflowStatusDiagram: React.FC<Props> = ({ steps, setHoveredStatus }) => {
  const firstRowSteps = steps.slice(0, 5);
  const secondRowSteps = steps.slice(5);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">IT Third Party Workflow Status</h2>
      <div className="flex flex-col items-start space-y-2">
        {/* First Row */}
        <div className="flex items-center p-2">
          {firstRowSteps.map((step, index) => (
            <ChevronStep
                key={index}
                step={step}
                index={index}
                isFirst={index === 0}
                isLast={index === firstRowSteps.length - 1 && secondRowSteps.length === 0}
                setHoveredStatus={setHoveredStatus}
            />
          ))}
        </div>
        {/* Second Row */}
        {secondRowSteps.length > 0 && (
          <div className="flex items-center p-2">
            {secondRowSteps.map((step, index) => (
              <ChevronStep
                  key={index + 5}
                  step={step}
                  index={index + 5}
                  isFirst={index === 0}
                  isLast={index === secondRowSteps.length - 1}
                  setHoveredStatus={setHoveredStatus}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowStatusDiagram;
