import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ManageClass = ({ classData, onClose }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [showAIGrading, setShowAIGrading] = useState(false);
  const [gradingComplete, setGradingComplete] = useState(false);
  const navigate = useNavigate();
  
  const currentAssignment = {
    id: 2,
    title: 'Essay Writing Fundamentals',
    description: 'Write a 500-word essay on a topic of your choice, demonstrating the writing techniques learned in class.',
    dueDate: '2025-01-19',
    points: 100
  };

  const handleAIGrading = () => {
    setShowAIGrading(true);
    // Simulate AI grading process
    setTimeout(() => {
      setGradingComplete(true);
    }, 4000);
    
  };

  const handleViewGradedAssignment = () => {
    setShowAIGrading(false);
    setGradingComplete(false);
    navigate('/teacher-dashboard/assignments/2/submissions/demo1');
  };

  return (
    <div className="bg-gray-900 rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-yellow-400">{classData.name}</h2>
        <button onClick={onClose} className="text-yellow-400 hover:text-yellow-500">
          ×
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-800 mb-6">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-2 px-4 ${
              activeTab === 'details'
                ? 'border-b-2 border-yellow-400 text-yellow-400'
                : 'text-yellow-400/70'
            }`}
          >
            Class Details
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`py-2 px-4 ${
              activeTab === 'students'
                ? 'border-b-2 border-yellow-400 text-yellow-400'
                : 'text-yellow-400/70'
            }`}
          >
            Students
          </button>
          <button
            onClick={() => setActiveTab('assignments')}
            className={`py-2 px-4 ${
              activeTab === 'assignments'
                ? 'border-b-2 border-yellow-400 text-yellow-400'
                : 'text-yellow-400/70'
            }`}
          >
            Assignments
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'details' && (
        <div>
          <div className="bg-black/50 p-4 rounded-lg mb-4">
            <h3 className="text-lg font-semibold mb-2 text-yellow-400">About this Class</h3>
            <p className="text-yellow-400/80">{classData.description}</p>
          </div>
        </div>
      )}

      {activeTab === 'students' && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-yellow-400">Enrolled Students ({Object.keys(classData.students).length})</h3>
          <div className="space-y-3">
            {Object.entries(classData.students).map(([studentId, student]) => (
              <div
                key={studentId}
                className="p-3 bg-black/50 rounded-lg flex justify-between items-center border border-gray-800"
              >
                <div>
                  <p className="font-medium text-yellow-400">{student.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'assignments' && (
        <div className="grid grid-cols-2 gap-6">
          {/* Current Assignment */}
          <div className="bg-black/50 p-4 rounded-lg border border-gray-800">
            <h3 className="text-lg font-semibold mb-4 text-yellow-400">Current Assignment</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-900 rounded-lg border border-gray-800">
                <h4 className="text-yellow-400 font-medium mb-2">{currentAssignment.title}</h4>
                <p className="text-yellow-400/70 text-sm mb-3">{currentAssignment.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-yellow-400/70">Due: {new Date(currentAssignment.dueDate).toLocaleDateString()}</span>
                  <span className="text-yellow-400/70">Points: {currentAssignment.points}</span>
                </div>
                <div className="mt-4 flex gap-2">
                  <button 
                    onClick={() => navigate('/teacher-dashboard/assignments/2')}
                    className="flex-1 bg-yellow-400 text-black py-2 rounded-lg hover:bg-yellow-500 transition-colors font-medium"
                  >
                    View Assignment
                  </button>
                  <button 
                    onClick={handleAIGrading}
                    className="flex-1 bg-black text-yellow-400 py-2 rounded-lg hover:bg-gray-900 transition-colors font-medium border border-yellow-400"
                  >
                    Athena Grading
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Create New Assignment */}
          <div className="bg-black/50 p-4 rounded-lg border border-gray-800">
            <h3 className="text-lg font-semibold mb-4 text-yellow-400">Create New Assignment</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-yellow-400 mb-1">Title</label>
                <input
                  type="text"
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg p-2 text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Enter assignment title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-400 mb-1">Description</label>
                <textarea
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg p-2 text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  rows="3"
                  placeholder="Enter assignment description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-400 mb-1">Due Date</label>
                <input
                  type="date"
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg p-2 text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-400 mb-1">Points</label>
                <input
                  type="number"
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg p-2 text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Enter points"
                  min="0"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-yellow-400 text-black py-2 rounded-lg hover:bg-yellow-500 transition-colors font-medium"
              >
                Create Assignment
              </button>
            </form>
          </div>
        </div>
      )}

      {/* AI Grading Modal */}
      <AnimatePresence>
        {showAIGrading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-xl p-8 max-w-md w-full mx-4 border border-gray-800"
            >
              {!gradingComplete ? (
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-6 relative">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-full h-full border-4 border-yellow-400/20 rounded-full border-t-yellow-400"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-yellow-400 mb-2">Athena is Grading</h3>
                  <p className="text-yellow-400/70">Please wait while Athena analyzes and grades the assignments...</p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-6 bg-yellow-400/10 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-yellow-400 mb-2">Grading Complete!</h3>
                  <p className="text-yellow-400/70 mb-6">All assignments have been graded by Athena.</p>
                  <button
                    onClick={handleViewGradedAssignment}
                    className="bg-yellow-400 text-black px-6 py-2 rounded-lg hover:bg-yellow-500 transition-colors font-medium"
                  >
                    View Graded Assignments
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageClass;