import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const AssignmentGrades = () => {
  const { id, submissionId } = useParams();
  const [submission, setSubmission] = useState(null);
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);
  const [aiSuggestion, setAiSuggestion] = useState(null);

  useEffect(() => {
    // TODO: Fetch submission data from backend
    const fetchSubmission = async () => {
      try {
        // Mock data
        const mockSubmission = {
          id: submissionId,
          studentName: 'John Doe',
          submittedAt: '2024-03-25T14:30',
          content: 'This is the student\'s submission content...',
          files: [
            { name: 'assignment.pdf', url: '#' }
          ],
          currentGrade: null,
          status: 'pending'
        };
        setSubmission(mockSubmission);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching submission:', error);
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [submissionId]);

  const requestAiGrading = async () => {
    try {
      // TODO: Implement AI grading request
      const mockAiSuggestion = {
        suggestedGrade: 85,
        feedback: 'Good work overall. Consider improving...',
        rubricBreakdown: {
          understanding: 9,
          implementation: 8,
          presentation: 8
        }
      };
      setAiSuggestion(mockAiSuggestion);
    } catch (error) {
      console.error('Error getting AI suggestion:', error);
    }
  };

  const handleSubmitGrade = async (e) => {
    e.preventDefault();
    // TODO: Submit grade to backend
    console.log('Submitting grade:', { grade, feedback });
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Grade Submission</h1>
          <p className="text-gray-600">Student: {submission.studentName}</p>
          <p className="text-gray-600">Submitted: {submission.submittedAt}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Submission Content</h2>
          <div className="bg-gray-50 p-4 rounded">
            <p className="whitespace-pre-wrap">{submission.content}</p>
          </div>

          {submission.files.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Attached Files:</h3>
              <ul className="list-disc pl-5">
                {submission.files.map((file, index) => (
                  <li key={index}>
                    <a href={file.url} className="text-blue-500 hover:underline">
                      {file.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mb-6">
          <button
            onClick={requestAiGrading}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Request AI Grading Suggestion
          </button>

          {aiSuggestion && (
            <div className="mt-4 bg-purple-50 p-4 rounded">
              <h3 className="font-semibold mb-2">AI Grading Suggestion</h3>
              <p>Suggested Grade: {aiSuggestion.suggestedGrade}</p>
              <p>Feedback: {aiSuggestion.feedback}</p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmitGrade} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Grade</label>
            <input
              type="number"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full p-2 border rounded"
              min="0"
              max="100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Feedback</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full p-2 border rounded"
              rows="4"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Submit Grade
          </button>
        </form>
      </div>
    </div>
  );
};

export default AssignmentGrades; 