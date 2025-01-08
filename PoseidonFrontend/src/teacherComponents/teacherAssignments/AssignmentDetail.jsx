import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const AssignmentDetail = () => {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch assignment and submissions from backend
    // Mock data for now
    const fetchData = async () => {
      try {
        const mockAssignment = {
          id,
          title: 'Example Assignment',
          description: 'This is an example assignment',
          dueDate: '2024-04-01T23:59',
          class: 'Web Development 101',
          points: 100,
          aiGradingEnabled: true,
          aiGradingInstructions: 'Grade based on clarity and completeness'
        };

        const mockSubmissions = [
          {
            id: 1,
            studentName: 'John Doe',
            submittedAt: '2024-03-25T14:30',
            status: 'graded',
            grade: 95
          },
          {
            id: 2,
            studentName: 'Jane Smith',
            submittedAt: '2024-03-26T16:45',
            status: 'pending',
            grade: null
          }
        ];

        setAssignment(mockAssignment);
        setSubmissions(mockSubmissions);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{assignment.title}</h1>
          <Link
            to={`/teacher/assignments/${id}/edit`}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Edit Assignment
          </Link>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded">
            <h2 className="font-semibold mb-2">Assignment Details</h2>
            <p><span className="font-medium">Class:</span> {assignment.class}</p>
            <p><span className="font-medium">Due Date:</span> {assignment.dueDate}</p>
            <p><span className="font-medium">Points:</span> {assignment.points}</p>
            <p><span className="font-medium">AI Grading:</span> {assignment.aiGradingEnabled ? 'Enabled' : 'Disabled'}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded">
            <h2 className="font-semibold mb-2">Submission Statistics</h2>
            <p><span className="font-medium">Total Submissions:</span> {submissions.length}</p>
            <p><span className="font-medium">Graded:</span> {submissions.filter(s => s.status === 'graded').length}</p>
            <p><span className="font-medium">Pending:</span> {submissions.filter(s => s.status === 'pending').length}</p>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Description</h2>
          <p className="whitespace-pre-wrap">{assignment.description}</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Student Submissions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {submissions.map((submission) => (
                <tr key={submission.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{submission.studentName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{submission.submittedAt}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      submission.status === 'graded' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {submission.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{submission.grade || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      to={`/teacher/assignments/${id}/submissions/${submission.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetail; 