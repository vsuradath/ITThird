import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../../context/AppContext';
import { TextInput } from '../FormContainer';
import { WORKFLOW_STEPS } from '../../constants';
import Modal from '../common/Modal';
import { WorkflowImage } from '../icons/WorkflowImage';
import { ServiceRequestContent } from '../common/ServiceRequestContent';
import AIChatbot from '../chatbot/AIChatbot';

const FormattedPopupContent: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split('\n').filter(line => line.trim() !== '');

  return (
    <div className="text-black">
      {lines.map((line, index) => {
        const headerRegex = /^([A-D]\)|[0-9.]+\))/; // Handle A) and 1.1)
        const noteRegex = /^หมายเหตุ/;
        const listItemRegex = /^- /;

        if (headerRegex.test(line)) {
          return <p key={index} className="font-bold text-gray-800 mt-3 mb-1 first:mt-0">{line}</p>;
        }
        if (noteRegex.test(line)) {
          return <p key={index} className="mt-2 text-sm text-yellow-800 bg-yellow-100 p-2 rounded">{line}</p>;
        }
        if (listItemRegex.test(line)) {
          return <p key={index} className="ml-4 pl-2 text-gray-600 border-l border-gray-300">{line.substring(1).trim()}</p>;
        }
        // First line that doesn't match other patterns becomes a title
        if(index === 0) {
            return <p key={index} className="font-bold text-gray-900 mb-2">{line}</p>;
        }
        return <p key={index} className="text-gray-700">{line}</p>;
      })}
    </div>
  );
};

interface WorkflowStepProps {
  index: number;
  title: string;
  description: string;
  isLast: boolean;
  onClick?: () => void;
}

const WorkflowStep: React.FC<WorkflowStepProps> = ({ index, title, description, isLast, onClick }) => {
    const isFormatted = description.includes('\n');
    
    let positionClass = 'top-0';
    if (index === 0) {
        positionClass = 'top-[-3.5rem]';
    } else if (index >= 6) {
        positionClass = 'bottom-0';
    }

    const arrowPositionClass = positionClass.startsWith('bottom') ? 'bottom-4' : 'top-4';
    
    const stepNumber = title.split('.')[0];
    const stepTitle = title.split('.')[1]?.trim() || title;
    const [mainTitle, subTitle] = stepTitle.split('\n');

    const content = (
        <>
            <div className="flex flex-col items-center mr-6 shrink-0">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full text-blue-600 font-bold">
                    {stepNumber}
                </div>
                {!isLast && <div className="w-px h-full bg-blue-200"></div>}
            </div>
            <div className="pb-4 flex items-center relative">
                <div>
                  <p className="text-md font-medium text-gray-700">{mainTitle}</p>
                  {subTitle && <p className="text-sm text-gray-500 -mt-1">{subTitle}</p>}
                </div>
                 {/* Tooltip Popup for non-clickable steps */}
                {!onClick && (
                    <div 
                        className={`absolute right-full ${positionClass} mr-4 p-4 text-sm rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 z-10 pointer-events-none ${
                            isFormatted
                                ? 'w-96 bg-white border border-gray-200' 
                                : 'w-64 bg-slate-800 text-white'
                        }`}
                    >
                        {isFormatted ? <FormattedPopupContent content={description} /> : description}
                        {/* Arrow */}
                        <div className={`absolute ${arrowPositionClass} -right-1.5 w-3 h-3 rotate-45 ${
                            isFormatted
                                ? 'bg-white border-r border-t border-gray-200'
                                : 'bg-slate-800'
                        }`}></div>
                    </div>
                )}
            </div>
        </>
    );

    if (onClick) {
        return (
            <button onClick={onClick} className="flex text-left w-full hover:bg-gray-200 rounded-md transition-colors">
                {content}
            </button>
        );
    }
    
    return (
        <div className="flex group">
            {content}
        </div>
    );
};


const LoginPage: React.FC = () => {
  const { login, setPostLoginRedirect } = useContext(AppContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRequestServiceModalOpen, setIsRequestServiceModalOpen] = useState(false);
  const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false);

  const workflowStepsForDiagram = useMemo(() => {
    // Remove the first step ("Selection & IT Procurement") from the diagram view
    return WORKFLOW_STEPS.slice(1);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    setIsLoggingIn(true);
    const success = await login(username.trim(), password);
    if (!success) {
      setError('Invalid username or password.');
    }
    // On success, the App component will automatically re-render
    setIsLoggingIn(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-screen-2xl mx-auto rounded-2xl shadow-2xl grid grid-cols-1 lg:grid-cols-3 overflow-hidden">
            {/* Login Form Section */}
            <div className="bg-white p-8 md:p-12 flex flex-col justify-center lg:col-span-1">
                 <div>
                    <h2 className="text-xl font-semibold text-center text-gray-900">
                        IT Third Party Document Management
                    </h2>
                    <p className="mt-2 text-sm text-center text-gray-600">
                        Please sign in to your account
                    </p>
                </div>
                <div className="mt-8">
                    <form onSubmit={handleLogin} className="space-y-6">
                        {info && !error && (
                            <div className="p-3 text-sm text-blue-700 bg-blue-100 rounded-lg text-center" role="alert">
                                {info}
                            </div>
                        )}
                        {error && (
                            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg text-center" role="alert">
                            {error}
                            </div>
                        )}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Username
                            </label>
                            <TextInput
                            id="username"
                            name="username"
                            type="text"
                            autoComplete="username"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            disabled={isLoggingIn}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                            </label>
                            <TextInput
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            disabled={isLoggingIn}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoggingIn}
                            className="relative flex justify-center w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md group hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105 disabled:bg-blue-300 disabled:cursor-not-allowed"
                        >
                            {isLoggingIn ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                     <div className="mt-4 text-center">
                        <button
                            type="button"
                            onClick={() => setIsRequestServiceModalOpen(true)}
                            className="relative flex justify-center w-full px-4 py-3 text-sm font-medium text-gray-800 bg-gray-200 border border-transparent rounded-md group hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-transform transform hover:scale-105"
                        >
                            IT Third-Party Service Request
                        </button>
                    </div>
                </div>
            </div>
            {/* Workflow Section */}
            <div className="bg-slate-100 p-8 md:p-12 hidden lg:block lg:col-span-1">
                <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">IT Third Party Workflow</h3>
                <div>
                    {workflowStepsForDiagram.map((step, index) => (
                        <WorkflowStep 
                            key={index}
                            index={index}
                            title={step.title}
                            description={step.description}
                            isLast={index === workflowStepsForDiagram.length - 1}
                        />
                    ))}
                </div>
            </div>
            {/* AI Chatbot Section */}
            <div className="bg-gray-200 p-4 hidden lg:block lg:col-span-1">
                <AIChatbot />
            </div>
        </div>
         <Modal
            isOpen={isRequestServiceModalOpen}
            onClose={() => setIsRequestServiceModalOpen(false)}
            title="IT Third-Party Service Request"
            large
        >
            <ServiceRequestContent />
            <div className="mt-6 flex justify-end border-t pt-4">
                <button
                    onClick={() => {
                        setPostLoginRedirect('serviceApproval');
                        setIsRequestServiceModalOpen(false);
                        setInfo('Please log in to proceed with the service request.');
                        document.getElementById('username')?.focus();
                    }}
                    className="px-5 py-2.5 font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    เริ่ม ลงะเทียนขอใช้บริการบุคคลภายนอก
                </button>
            </div>
        </Modal>
         <Modal
            isOpen={isWorkflowModalOpen}
            onClose={() => setIsWorkflowModalOpen(false)}
            title="IT Third Party Workflow Process"
            large
        >
            <WorkflowImage />
        </Modal>
    </div>
  );
};

export default LoginPage;