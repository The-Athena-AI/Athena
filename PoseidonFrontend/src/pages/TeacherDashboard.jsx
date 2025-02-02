import React, { useState } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import TeacherHome from '../teacherComponents/TeacherHome';
import TeacherClasses from '../teacherComponents/TeacherClasses';
import TeacherAssignments from '../teacherComponents/teacherAssignments';
import TeacherSidebar from '../teacherComponents/teacherHomeComponents/TeacherSidebar';
import TeacherStudents from '../teacherComponents/TeacherStudents';
import TeacherRubric from '../teacherComponents/teacherAssignments/TeacherRubric';
import AssignmentGrades from '../teacherComponents/teacherAssignments/AssignmentGrades';
import TeacherAssignmentView from '../teacherComponents/TeacherAssignmentView';

const TeacherAssignment = ({userId}) =>{
  return (
    <Routes>
      <Route path="" element={<TeacherAssignments userId={userId} />} />
      <Route path="view/:assignmentId" element={<TeacherAssignmentView userId={userId} />} />
    </Routes>
  )
}

const TeacherDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { userId } = useParams();

  return (
    <div className="flex min-h-screen themed-bg">
      <TeacherSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} userId={userId} />
      <div className="flex-1">
        <div className="max-w-7xl mx-auto">
          <Routes>
            <Route path="home" element={<TeacherHome userId={userId} />} />
            <Route path="classes" element={<TeacherClasses userId={userId} />} />
            <Route path="assignments/*" element={<TeacherAssignment userId={userId} />} />
            <Route path="students" element={<TeacherStudents userId={userId} />} />
            <Route path="/" element={<Navigate to="home" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;