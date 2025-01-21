import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import TeacherHome from '../teacherComponents/TeacherHome';
import TeacherClasses from '../teacherComponents/TeacherClasses';
import TeacherAssignments from '../teacherComponents/teacherAssignments';
import TeacherSidebar from '../teacherComponents/teacherHomeComponents/TeacherSidebar';

const TeacherDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <TeacherSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1">

        
        <div className="max-w-7xl mx-auto">
          <Routes>
            <Route path="home" element={<TeacherHome />} />
            <Route path="classes" element={<TeacherClasses />} />
            <Route path="assignments/*" element={<TeacherAssignments />} />
            <Route path="/" element={<Navigate to="home" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;