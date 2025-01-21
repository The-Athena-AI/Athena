import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaBookOpen,
  FaTasks,
  FaBookmark,
  FaEnvelope,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaRobot
} from "react-icons/fa";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  
  const menuItems = [
    { name: "Home", icon: <FaHome size={20} />, path: "/student-dashboard/home" },
    { name: "Classes", icon: <FaBookOpen size={20} />, path: "/student-dashboard/classes" },
    { name: "Assignments", icon: <FaTasks size={20} />, path: "/student-dashboard/assignments" },
    { name: "Athena's Wisdom", icon: <FaRobot size={20} />, path: "/student-dashboard/lecture" },
    { name: "Bookmarks", icon: <FaBookmark size={20} />, path: "/student-dashboard/bookmarks" },
    { name: "Messages", icon: <FaEnvelope size={20} />, path: "/student-dashboard/messages" },
    { name: "Settings", icon: <FaCog size={20} />, path: "/student-dashboard/settings" },
  ];

  const handleSignOut = () => {
    // Add sign out logic here
    console.log("Signing out...");
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div
        className={`h-screen bg-white text-gray-800 fixed top-0 left-0
        ${isOpen ? "w-64" : "w-20"} transition-all duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header Section */}
          <div className="p-6 border-b border-gray-200">
            {isOpen ? (
              <h1 className="text-xl font-bold">Student Portal</h1>
            ) : (
              <button
                onClick={() => setIsOpen(true)}
                className="w-full flex justify-center"
              >
                <FaBars size={24} className="text-blue-600" />
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
                    ? "bg-blue-600 text-white" 
                    : "text-gray-700 hover:bg-gray-100"}`}
              >
                <span className={isOpen ? "mr-4" : "mx-auto"}>{item.icon}</span>
                {isOpen && <span className="font-medium">{item.name}</span>}
              </Link>
            ))}
          </nav>

          {/* Sign Out Button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleSignOut}
              className={`flex items-center w-full px-4 py-2 text-red-600 
                hover:bg-red-50 rounded-lg transition-colors duration-200
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
            className="fixed top-6 left-[15.5rem] z-50 p-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            <FaTimes size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
