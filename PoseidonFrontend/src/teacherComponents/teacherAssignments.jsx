import React, { useState } from 'react';
import AssignmentList from './teacherAssignments/AssignmentList';
import AssignmentCreate from './teacherAssignments/AssignmentCreate';
import AssignmentEdit from './teacherAssignments/AssignmentEdit';
import AssignmentDetail from './teacherAssignments/AssignmentDetail';
import AssignmentGrades from './teacherAssignments/AssignmentGrades';
import AssignmentStats from './teacherAssignments/AssignmentStats';

const TeacherAssignments = () => {
  const [activeView, setActiveView] = useState('list');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const renderContent = () => {
    switch (activeView) {
      case 'list':
        return <AssignmentList onAssignmentSelect={(assignment) => {
          setSelectedAssignment(assignment);
          setActiveView('detail');
        }} />;
      case 'create':
        return <AssignmentCreate onComplete={() => setActiveView('list')} />;
      case 'detail':
        return selectedAssignment && (
          <AssignmentDetail 
            assignment={selectedAssignment}
            onEdit={() => setActiveView('edit')}
            onViewStats={() => setActiveView('stats')}
            onSubmissionSelect={(submission) => {
              setSelectedSubmission(submission);
              setActiveView('grades');
            }}
          />
        );
      case 'edit':
        return selectedAssignment && (
          <AssignmentEdit 
            assignment={selectedAssignment}
            onComplete={() => setActiveView('detail')}
          />
        );
      case 'grades':
        return selectedSubmission && (
          <AssignmentGrades 
            submission={selectedSubmission}
            onComplete={() => setActiveView('detail')}
          />
        );
      case 'stats':
        return selectedAssignment && (
          <AssignmentStats 
            assignment={selectedAssignment}
            onBack={() => setActiveView('detail')}
          />
        );
      default:
        return <AssignmentList />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4">
        {/* Navigation Bar */}
        <div className="mb-6 bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveView('list')}
                className={`px-4 py-2 rounded-md ${
                  activeView === 'list' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                All Assignments
              </button>
              <button
                onClick={() => setActiveView('create')}
                className={`px-4 py-2 rounded-md ${
                  activeView === 'create' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Create New
              </button>
            </div>

            {/* Breadcrumb navigation */}
            <div className="text-sm text-gray-600">
              {selectedAssignment && activeView !== 'list' && (
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setActiveView('list')}
                    className="hover:text-blue-500"
                  >
                    Assignments
                  </button>
                  <span>/</span>
                  <button 
                    onClick={() => setActiveView('detail')}
                    className="hover:text-blue-500"
                  >
                    {selectedAssignment.title}
                  </button>
                  {activeView !== 'detail' && (
                    <>
                      <span>/</span>
                      <span>
                        {activeView === 'edit' && 'Edit'}
                        {activeView === 'grades' && 'Grade Submission'}
                        {activeView === 'stats' && 'Statistics'}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default TeacherAssignments;