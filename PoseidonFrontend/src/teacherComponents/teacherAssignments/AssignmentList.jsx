import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Assignments</h1>
        <Link 
          to="create"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create New Assignment
        </Link>
      </div>

      {loading ? (
        <div>Loading assignments...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="grid gap-4">
          {assignments.map((assignment) => (
            <div 
              key={assignment.id}
              className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">{assignment.title}</h2>
                  <p className="text-gray-600">Class: {assignment.class}</p>
                  <p className="text-gray-600">Due: {assignment.dueDate}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    Submissions: {assignment.submissionCount}/{assignment.totalStudents}
                  </p>
                  <div className="mt-2 space-x-2">
                    <Link 
                      to={`${assignment.id}`}
                      className="text-blue-500 hover:underline"
                    >
                      View
                    </Link>
                    <Link 
                      to={`${assignment.id}/edit`}
                      className="text-green-500 hover:underline"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignmentList; 