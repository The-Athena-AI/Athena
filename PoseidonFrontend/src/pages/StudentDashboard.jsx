import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import StudentHome from '../studentComponents/studentHome';
import StudentClasses from '../studentComponents/StudentClasses';
import StudentAssignment from '../studentComponents/StudentAssignment';
import DashboardNavbar from '../components/DashboardNavbar';
import Sidebar from '../studentComponents/studentHomeComponents/Sidebar';


const StudentDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1">
        <DashboardNavbar userRole="Student" />
        
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="home" element={<StudentHome />} />
            <Route path="classes" element={<StudentClasses />} />
            <Route path="assignments/*" element={<StudentAssignment />} />

            <Route path="/" element={<Navigate to="home" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
