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
  FaTimes
} from "react-icons/fa";

const TeacherSidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  
  const menuItems = [
    { name: "Home", icon: <FaHome size={20} />, path: "/teacher-dashboard/home" },
    { name: "Classes", icon: <FaChalkboardTeacher size={20} />, path: "/teacher-dashboard/classes" },
    { name: "Assignments", icon: <FaTasks size={20} />, path: "/teacher-dashboard/assignments" },
    { name: "Students", icon: <FaUserGraduate size={20} />, path: "/teacher-dashboard/students" },
    { name: "Messages", icon: <FaEnvelope size={20} />, path: "/teacher-dashboard/messages" },
    { name: "Settings", icon: <FaCog size={20} />, path: "/teacher-dashboard/settings" },
  ];

  const handleSignOut = () => {
    // Add sign out logic here
    console.log("Signing out...");
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div
        className={`bg-black text-gray-300 absolute top-0 left-0
        ${isOpen ? "w-64" : "w-20"} transition-all duration-300 ease-in-out`} style={{height: '142%'}}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header Section */}
          <div className="p-6 border-b border-gray-800">
            {isOpen ? (
              <h1 className="text-xl font-bold text-yellow-400">Teacher Portal</h1>
            ) : (
              <button
                onClick={() => setIsOpen(true)}
                className="w-full flex justify-center"
              >
                <FaBars size={24} className="text-yellow-400" />
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
                  ${location.pathname === item.path 
                    ? "bg-yellow-400 text-black" 
                    : "text-gray-300 hover:bg-gray-800"}`}
              >
                <span className={isOpen ? "mr-4" : "mx-auto"}>{item.icon}</span>
                {isOpen && <span className="font-medium">{item.name}</span>}
              </Link>
            ))}
          </nav>

          {/* Sign Out Button */}
          <div className="p-4 border-t border-gray-800">
            <button
              onClick={handleSignOut}
              className={`flex items-center w-full px-4 py-2 text-red-400 
                hover:bg-gray-800 rounded-lg transition-colors duration-200 
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
            className="absolute top-6 left-[15.5rem] z-50 p-1 rounded-lg bg-yellow-400 text-black hover:bg-yellow-500 transition-colors"
          >
            <FaTimes size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default TeacherSidebar; 