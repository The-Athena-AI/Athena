import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaEdit, FaUserGraduate, FaClock, FaCheckCircle, FaRobot, FaChevronRight } from 'react-icons/fa';

const AssignmentDetail = () => {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        // Mock data for demo assignment
        if (id === '2') {
          const demoAssignment = {
            id: 2,
            title: "Essay: Impact of AI in Education",
            description: "Write a 500-word essay discussing the potential impacts of Artificial Intelligence on modern education. Consider both positive and negative aspects, and provide specific examples.",
            dueDate: "2024-03-28T23:59",
            class: "Technology & Society",
            points: 100,
            submissionCount: 1,
            totalStudents: 1,
            aiGradingEnabled: true,
            submissions: [
              {
                id: 1,
                studentName: "Mike Williams",
                submittedAt: "2025-01-17T14:30",
                status: "graded",
                grade: "A"
              }
            ]
          };
          setAssignment(demoAssignment);
        } else {
          // Regular mock assignment
          const mockAssignment = {
            id: 1,
            title: "Introduction to React",
            description: "Build a simple React component that demonstrates state management.",
            dueDate: "2024-04-01T23:59",
            class: "Web Development 101",
            points: 100,
            submissionCount: 15,
            totalStudents: 20,
            aiGradingEnabled: true,
            submissions: [
              {
                id: 1,
                studentName: "Alice Smith",
                submittedAt: "2024-03-25T10:15",
                status: "pending"
              },
              {
                id: 2,
                studentName: "Bob Johnson",
                submittedAt: "2024-03-26T15:45",
                status: "graded",
                grade: "B+"
              }
            ]
          };
          setAssignment(mockAssignment);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching assignment:', error);
        setError('Failed to load assignment details');
        setLoading(false);
      }
    };

    fetchAssignment();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-6">
        <div className="text-yellow-400">Loading assignment details...</div>
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

  if (!assignment) {
    return (
      <div className="min-h-screen bg-black p-6">
        <div className="text-yellow-400">Assignment not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-yellow-400 mb-2">{assignment.title}</h1>
              <div className="space-y-2">
                <p className="text-yellow-400/70 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-yellow-400"></span>
                  {assignment.class}
                </p>
                <p className="text-yellow-400/70 flex items-center gap-2">
                  <FaClock className="text-yellow-400/50" />
                  Due: {new Date(assignment.dueDate).toLocaleString()}
                </p>
                <p className="text-yellow-400/70 flex items-center gap-2">
                  <FaUserGraduate className="text-yellow-400/50" />
                  {assignment.submissionCount}/{assignment.totalStudents} Submissions
                </p>
              </div>
            </div>
            <Link
              to={`edit`}
              className="bg-gray-800 text-yellow-400 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <FaEdit size={14} />
              Edit Assignment
            </Link>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-800">
            <h2 className="text-lg font-semibold text-yellow-400 mb-2">Description</h2>
            <p className="text-yellow-400/70 whitespace-pre-wrap">{assignment.description}</p>
          </div>
          {assignment.aiGradingEnabled && (
            <div className="mt-4 flex items-center gap-2 text-yellow-400/70">
              <FaRobot className="text-yellow-400" />
              <span>Athena AI Grading Enabled</span>
            </div>
          )}
        </div>

        {/* Submissions Section */}
        <div className="bg-gray-900 rounded-lg border border-gray-800">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-yellow-400 mb-4">Student Submissions</h2>
            <div className="space-y-4">
              {assignment.submissions.map((submission) => (
                <Link
                  key={submission.id}
                  to={`submissions/${submission.id}`}
                  className="block bg-black rounded-lg p-4 border border-gray-800 hover:border-yellow-400/50 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="font-medium text-yellow-400">{submission.studentName}</p>
                      <p className="text-sm text-yellow-400/70">
                        Submitted: {new Date(submission.submittedAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <FaCheckCircle 
                          className={
                            submission.status === 'graded' 
                              ? 'text-green-400' 
                              : 'text-yellow-400/50'
                          } 
                        />
                        <span className={`text-sm ${
                          submission.status === 'graded' 
                            ? 'text-green-400' 
                            : 'text-yellow-400/70'
                        }`}>
                          {submission.status === 'graded' ? `Graded: ${submission.grade}` : 'Pending'}
                        </span>
                      </div>
                      <FaChevronRight className="text-yellow-400/50" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetail; 