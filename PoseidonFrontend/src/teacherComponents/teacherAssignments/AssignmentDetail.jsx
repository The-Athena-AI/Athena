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
          title: id === '2' ? 'Essay: Impact of AI in Education' : 'Example Assignment',
          description: id === '2' ? 
            'Write a 500-word essay discussing the potential impacts of Artificial Intelligence on modern education. Consider both positive and negative aspects, and provide specific examples.' :
            'This is an example assignment',
          dueDate: id === '2' ? '2024-03-28T23:59' : '2024-04-01T23:59',
          class: id === '2' ? 'Technology & Society' : 'Web Development 101',
          points: 100,
          aiGradingEnabled: true,
          aiGradingInstructions: id === '2' ? 
            'Grade based on: 1) Understanding of AI concepts 2) Critical analysis 3) Clear examples 4) Writing quality' :
            'Grade based on clarity and completeness'
        };

        const mockSubmissions = id === '2' ? [
          {
            id: 'demo1',
            studentName: 'Demo Student',
            submittedAt: '2024-03-27T15:30',
            status: 'pending',
            grade: null,
            content: `Artificial Intelligence has emerged as a transformative force in education, revolutionizing how we teach and learn. This essay explores the significant impacts of AI on modern education, examining both its benefits and potential challenges.

One of the most prominent positive impacts of AI in education is personalized learning. AI algorithms can analyze student performance data to create customized learning paths, adapting to each student's pace and learning style. For example, adaptive learning platforms use AI to identify knowledge gaps and automatically adjust content difficulty, ensuring students receive targeted instruction where they need it most.

Furthermore, AI has enhanced administrative efficiency in educational institutions. Automated grading systems can handle objective assessments, freeing teachers to focus on more meaningful interactions with students. AI-powered chatbots provide 24/7 support for common student queries, improving accessibility to information and reducing administrative burden.

However, the integration of AI in education also raises concerns. There's a risk of over-reliance on technology, potentially diminishing human interaction in the learning process. The "digital divide" may widen as schools with limited resources struggle to implement AI solutions, creating educational inequalities.

Additionally, data privacy and security concerns emerge as AI systems collect and analyze student data. Educational institutions must carefully balance the benefits of personalized learning with protecting student privacy and ensuring responsible data management.

Looking ahead, AI's role in education will likely expand, but success depends on thoughtful implementation that preserves the irreplaceable human elements of teaching while leveraging technology's advantages. The key lies in using AI as a tool to enhance, rather than replace, traditional educational approaches.`
          }
        ] : [
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
            to="edit"
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
            <p><span className="font-medium">Athena Grading:</span> {assignment.aiGradingEnabled ? 'Enabled' : 'Disabled'}</p>
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
                      to={`submissions/${submission.id}`}
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