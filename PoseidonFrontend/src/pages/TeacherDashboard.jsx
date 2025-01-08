import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import TeacherSidebar from "../teacherComponents/teacherHomeComponents/TeacherSidebar";
import TeacherHome from "../teacherComponents/TeacherHome";
import TeacherClasses from "../teacherComponents/TeacherClasses";
import TeacherAssignments from "../teacherComponents/teacherAssignments";

const TeacherDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <TeacherSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <Routes>
          <Route path="home" element={<TeacherHome />} />
          <Route path="classes" element={<TeacherClasses />} />
          <Route path="assignments" element={<TeacherAssignments />} />
          {/* Add other routes as needed */}
        </Routes>
      </main>
    </div>
  );
};

export default TeacherDashboard;