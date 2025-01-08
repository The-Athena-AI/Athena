import React, { useState } from 'react';
import { useClass } from '../contexts/ClassContext';
import { Routes, Route } from 'react-router-dom';
import Sidebar from "../studentComponents/studentHomeComponents/Sidebar";
import StudentHome from "../studentComponents/studentHome";
import StudentAssignment from "../studentComponents/StudentAssignment";
import StudentClasses from "../studentComponents/StudentClasses";

const StudentDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [classCode, setClassCode] = useState('');
  const { enrolledClasses, joinClass, loading } = useClass();

  const handleJoinClass = async (e) => {
    e.preventDefault();
    try {
      await joinClass(classCode);
      alert('Successfully joined the class!');
      setClassCode('');
      setShowJoinModal(false);
    } catch (error) {
      alert('Error joining class: ' + error.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <Routes>
          <Route path="home" element={<StudentHome />} />
          <Route path="assignments" element={<StudentAssignment />} />
          <Route path="classes" element={<StudentClasses />} />
        </Routes>
      </main>

      {/* Join Class Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Join Class</h2>
            <form onSubmit={handleJoinClass}>
              <input
                type="text"
                value={classCode}
                onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                placeholder="Enter class code"
                className="w-full p-2 border rounded mb-4"
                required
              />
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="px-4 py-2 text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Join Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
