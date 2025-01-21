import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaEye, FaPencilAlt, FaCheckCircle, FaClock } from 'react-icons/fa';

const AssignmentList = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // TODO: Fetch assignments from backend
    // Mock data for now
    const mockAssignments = [
      {
        id: 1,
        title: "Introduction to React",
        dueDate: "2024-04-01",
        class: "Web Development 101",
        submissionCount: 15,
        totalStudents: 20
      },
      {
        id: 2,
        title: "Essay: Impact of AI in Education",
        dueDate: "2024-03-28",
        class: "Technology & Society",
        submissionCount: 1,
        totalStudents: 1,
        hasDemo: true
      }
    ];
    setAssignments(mockAssignments);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-6">
        <div className="text-yellow-400">Loading assignments...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black p-6">
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-yellow-400">Assignments</h1>
          <Link 
            to="create"
            className="bg-yellow-400 text-black px-6 py-2 rounded-lg hover:bg-yellow-500 transition-colors flex items-center gap-2"
          >
            <FaPlus size={14} />
            Create New Assignment
          </Link>
        </div>

        <div className="grid gap-6">
          {assignments.map((assignment) => (
            <div 
              key={assignment.id}
              className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-yellow-400/50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-yellow-400">{assignment.title}</h2>
                  <p className="text-yellow-400/70 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-yellow-400"></span>
                    {assignment.class}
                  </p>
                  <p className="text-yellow-400/70 flex items-center gap-2">
                    <FaClock className="text-yellow-400/50" />
                    Due: {assignment.dueDate}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 text-yellow-400/70 mb-4">
                    <FaCheckCircle className={assignment.submissionCount === assignment.totalStudents ? "text-green-400" : "text-yellow-400/50"} />
                    <p className="text-sm">
                      {assignment.submissionCount}/{assignment.totalStudents} Submissions
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Link 
                      to={`${assignment.id}`}
                      className="text-yellow-400 hover:text-yellow-500 transition-colors flex items-center gap-1"
                    >
                      <FaEye size={14} />
                      View
                    </Link>
                    <Link 
                      to={`${assignment.id}/edit`}
                      className="text-yellow-400 hover:text-yellow-500 transition-colors flex items-center gap-1"
                    >
                      <FaPencilAlt size={14} />
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
              {assignment.hasDemo && (
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <p className="text-yellow-400/70 text-sm">
                    Athena's AI grading capabilities.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssignmentList; 