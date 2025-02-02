import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaChalkboardTeacher,
  FaTasks,
  FaUserGraduate,
  FaEnvelope,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaBook
} from "react-icons/fa";
import { supabase } from "../../supabase";

const TeacherSidebar = ({ isOpen, setIsOpen, userId }) => {
  const location = useLocation();
  
  const menuItems = [
    { name: "Home", icon: <FaHome size={20} />, path: `/teacher/${userId}/dashboard/home` },
    { name: "Classes", icon: <FaChalkboardTeacher size={20} />, path: `/teacher/${userId}/dashboard/classes` },
    { name: "Assignments", icon: <FaBook size={20} />, path: `/teacher/${userId}/dashboard/assignments` },
    { name: "Students", icon: <FaUserGraduate size={20} />, path: `/teacher/${userId}/dashboard/students` },
    { name: "Messages", icon: <FaEnvelope size={20} />, path: `/teacher/${userId}/dashboard/messages` },
    { name: "Settings", icon: <FaCog size={20} />, path: `/teacher/${userId}/dashboard/settings` },
  ];

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div
        className={`h-screen themed-sidebar fixed top-0 left-0
        ${isOpen ? "w-64" : "w-20"} transition-all duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header Section */}
          <div className="p-6 border-b themed-border">
            {isOpen ? (
              <h1 className="text-xl font-bold themed-text">Teacher</h1>
            ) : (
              <button
                onClick={() => setIsOpen(true)}
                className="w-full flex justify-center"
              >
                <FaBars size={24} className="themed-text" />
              </button>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 py-4">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-6 py-3 transition-colors duration-200
                  ${location.pathname.includes(item.path)
                    ? "themed-nav-item active" 
                    : "themed-nav-item"}`}
              >
                <span className={isOpen ? "mr-4" : "mx-auto"}>{item.icon}</span>
                {isOpen && <span className="font-medium">{item.name}</span>}
              </Link>
            ))}
          </nav>

          {/* Sign Out Button */}
          <div className="p-4 border-t themed-border">
            <button
              onClick={handleSignOut}
              className={`flex items-center w-full px-4 py-2 text-red-400 
                hover:themed-bg-elevated rounded-lg transition-colors duration-200
                ${isOpen ? "" : "justify-center"}`}
            >
              <FaSignOutAlt size={20} className={isOpen ? "mr-4" : ""} />
              {isOpen && <span className="font-medium">Sign Out</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 ${isOpen ? "ml-64" : "ml-20"} transition-all duration-300`}>
        {isOpen && (
          <button
            onClick={() => setIsOpen(false)}
            className="fixed top-6 left-[13rem] p-1 rounded-lg themed-button "
          >
            <FaTimes size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default TeacherSidebar;