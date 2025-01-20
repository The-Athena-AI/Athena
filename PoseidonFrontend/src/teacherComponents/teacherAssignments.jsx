import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import AssignmentList from './teacherAssignments/AssignmentList';
import AssignmentCreate from './teacherAssignments/AssignmentCreate';
import AssignmentEdit from './teacherAssignments/AssignmentEdit';
import AssignmentDetail from './teacherAssignments/AssignmentDetail';
import AssignmentGrades from './teacherAssignments/AssignmentGrades';
import AssignmentStats from './teacherAssignments/AssignmentStats';
import TeacherRubric from './teacherAssignments/TeacherRubric';

const TeacherAssignments = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow">
          <Routes>
            <Route path="" element={<AssignmentList />} />
            <Route path="create" element={<AssignmentCreate />} />
            <Route path=":id" element={<AssignmentDetail />} />
            <Route path=":id/edit" element={<AssignmentEdit />} />
            <Route path="rubric" element={<TeacherRubric />} />
            <Route path=":id/submissions/:submissionId" element={<AssignmentGrades />} />
            <Route path=":id/stats" element={<AssignmentStats />} />
          </Routes>
        </div>
      </div>
  );
};

export default TeacherAssignments;