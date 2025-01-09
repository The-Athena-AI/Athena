import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import AssignmentList from './teacherAssignments/AssignmentList';
import AssignmentCreate from './teacherAssignments/AssignmentCreate';
import AssignmentEdit from './teacherAssignments/AssignmentEdit';
import AssignmentDetail from './teacherAssignments/AssignmentDetail';
import AssignmentGrades from './teacherAssignments/AssignmentGrades';
import AssignmentStats from './teacherAssignments/AssignmentStats';

const TeacherAssignments = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4">
        {/* Navigation Bar */}
        <div className="mb-6 bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('')}
                className={`px-4 py-2 rounded-md ${
                  location.pathname.endsWith('assignments') 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                All Assignments
              </button>
              <button
                onClick={() => navigate('create')}
                className={`px-4 py-2 rounded-md ${
                  location.pathname.includes('create') 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Create New
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow">
          <Routes>
            <Route path="" element={<AssignmentList />} />
            <Route path="create" element={<AssignmentCreate />} />
            <Route path=":id" element={<AssignmentDetail />} />
            <Route path=":id/edit" element={<AssignmentEdit />} />
            <Route path=":id/submissions/:submissionId" element={<AssignmentGrades />} />
            <Route path=":id/stats" element={<AssignmentStats />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default TeacherAssignments;