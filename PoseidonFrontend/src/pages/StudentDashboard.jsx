import React, { useState } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import StudentHome from '../studentComponents/studentHome';
import StudentClasses from '../studentComponents/StudentClasses';
import Sidebar from '../studentComponents/studentHomeComponents/Sidebar';
import StudentLecture from '../studentComponents/StudentLecture';
import StudentAssignmentList from '../studentComponents/StudentAssignmentList';
import StudentAssignmentView from '../studentComponents/StudentAssignmentView';

const StudentAssignment = ({ userId }) => {
  return (
    <Routes>
      <Route path="" element={<StudentAssignmentList userId={userId} />} />
      <Route path="view/:assignmentId" element={<StudentAssignmentView userId={userId} />} />
    </Routes>
  );
};

const StudentDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { userId } = useParams();

  return (
    <div className="flex min-h-screen themed-bg">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} userId={userId} />
      <div className="flex-1">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="home" element={<StudentHome userId={userId} />} />
            <Route path="classes" element={<StudentClasses userId={userId} />} />
            <Route path="assignments/*" element={<StudentAssignment userId={userId} />} />
            <Route path="lecture" element={<StudentLecture userId={userId} />} />
            <Route path="/" element={<Navigate to="home" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};



export default StudentDashboard;
