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
  FaTimes
} from "react-icons/fa";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  
  const menuItems = [
    { name: "Home", icon: <FaHome size={20} />, path: "/student-dashboard/home" },
    { name: "Classes", icon: <FaBookOpen size={20} />, path: "/student-dashboard/classes" },
    { name: "Assignments", icon: <FaTasks size={20} />, path: "/student-dashboard/assignments" },
    { name: "Bookmarks", icon: <FaBookmark size={20} />, path: "/student-dashboard/bookmarks" },
    { name: "Messages", icon: <FaEnvelope size={20} />, path: "/student-dashboard/messages" },
    { name: "Settings", icon: <FaCog size={20} />, path: "/student-dashboard/settings" },
  ];

  const handleSignOut = () => {
    // Add sign out logic here
    console.log("Signing out...");
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-screen bg-white text-gray-800 
        ${isOpen ? "w-64" : "w-0"} transition-all duration-300 ease-in-out 
        shadow-lg overflow-hidden z-40`}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header Section */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-xl font-bold">Student Portal</h1>
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
                <span className="mr-4">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Sign Out Button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-4 py-2 text-red-600 
                hover:bg-red-50 rounded-lg transition-colors duration-200"
            >
              <FaSignOutAlt size={20} className="mr-4" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-4 z-50 p-3 rounded-lg bg-blue-600 text-white
          hover:bg-blue-700 transition-all duration-300 ease-in-out
          ${isOpen ? "left-[268px]" : "left-4"}`}
      >
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
