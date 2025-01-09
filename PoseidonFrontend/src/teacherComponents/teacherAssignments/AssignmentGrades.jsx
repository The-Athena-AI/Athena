import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const AssignmentGrades = () => {
  const { id, submissionId } = useParams();
  const [submission, setSubmission] = useState(null);
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [isAiGrading, setIsAiGrading] = useState(false);

  useEffect(() => {
    // TODO: Fetch submission data from backend
    const fetchSubmission = async () => {
      try {
        // Mock data for demo submission
        if (id === '2' && submissionId === 'demo1') {
          const mockSubmission = {
            id: submissionId,
            studentName: 'Demo Student',
            submittedAt: '2024-03-27T15:30',
            content: `Artificial Intelligence has emerged as a transformative force in education, revolutionizing how we teach and learn. This essay explores the significant impacts of AI on modern education, examining both its benefits and potential challenges.

One of the most prominent positive impacts of AI in education is personalized learning. AI algorithms can analyze student performance data to create customized learning paths, adapting to each student's pace and learning style. For example, adaptive learning platforms use AI to identify knowledge gaps and automatically adjust content difficulty, ensuring students receive targeted instruction where they need it most.

Furthermore, AI has enhanced administrative efficiency in educational institutions. Automated grading systems can handle objective assessments, freeing teachers to focus on more meaningful interactions with students. AI-powered chatbots provide 24/7 support for common student queries, improving accessibility to information and reducing administrative burden.

However, the integration of AI in education also raises concerns. There's a risk of over-reliance on technology, potentially diminishing human interaction in the learning process. The "digital divide" may widen as schools with limited resources struggle to implement AI solutions, creating educational inequalities.

Additionally, data privacy and security concerns emerge as AI systems collect and analyze student data. Educational institutions must carefully balance the benefits of personalized learning with protecting student privacy and ensuring responsible data management.

Looking ahead, AI's role in education will likely expand, but success depends on thoughtful implementation that preserves the irreplaceable human elements of teaching while leveraging technology's advantages. The key lies in using AI as a tool to enhance, rather than replace, traditional educational approaches.`,
            files: [],
            currentGrade: null,
            status: 'pending'
          };
          setSubmission(mockSubmission);
        } else {
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
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching submission:', error);
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [submissionId, id]);

  const requestAiGrading = async () => {
    try {
      setIsAiGrading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock AI grading response for demo
      if (id === '2' && submissionId === 'demo1') {
        const mockAiSuggestion = {
          suggestedGrade: 92,
          feedback: `Overall Evaluation: Excellent essay that demonstrates a comprehensive understanding of AI's impact on education.

Strengths:
1. Clear structure and logical flow of ideas
2. Strong examples of AI applications in education
3. Balanced discussion of benefits and challenges
4. Well-supported arguments with specific examples

Areas for Improvement:
1. Could include more specific statistics or research findings
2. Consider expanding on potential solutions to the digital divide
3. Brief mention of implementation strategies could be more detailed

Rubric Breakdown:
- Understanding of AI Concepts: 23/25
- Critical Analysis: 24/25
- Clear Examples: 23/25
- Writing Quality: 22/25

Total Score: 92/100`,
          rubricBreakdown: {
            'Understanding of AI Concepts': 23,
            'Critical Analysis': 24,
            'Clear Examples': 23,
            'Writing Quality': 22
          }
        };
        setAiSuggestion(mockAiSuggestion);
        setGrade(mockAiSuggestion.suggestedGrade.toString());
        setFeedback(mockAiSuggestion.feedback);
      } else {
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
      }
    } catch (error) {
      console.error('Error getting AI suggestion:', error);
    } finally {
      setIsAiGrading(false);
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
            disabled={isAiGrading}
            className={`${
              isAiGrading 
                ? 'bg-purple-300 cursor-not-allowed' 
                : 'bg-purple-500 hover:bg-purple-600'
            } text-white px-4 py-2 rounded flex items-center gap-2`}
          >
            {isAiGrading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              "Athena's Graded Suggestion"
            )}
          </button>

          {aiSuggestion && (
            <div className="mt-4 bg-purple-50 p-4 rounded">
              <h3 className="font-semibold mb-2">Athena's Suggestion</h3>
              <p className="font-medium">Suggested Grade: {aiSuggestion.suggestedGrade}/100</p>
              
              {aiSuggestion.rubricBreakdown && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Rubric Breakdown:</h4>
                  <div className="space-y-2">
                    {Object.entries(aiSuggestion.rubricBreakdown).map(([criterion, score]) => (
                      <div key={criterion} className="flex items-center">
                        <span className="w-48 text-sm">{criterion}:</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded">
                          <div
                            className="h-full bg-purple-500 rounded"
                            style={{ width: `${(score / 25) * 100}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm">{score}/25</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-4">
                <h4 className="font-medium mb-2">Athena's Feedback:</h4>
                <p className="whitespace-pre-wrap text-gray-700">{aiSuggestion.feedback}</p>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmitGrade} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Final Grade</label>
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
            <label className="block text-sm font-medium mb-1">Teacher Feedback</label>
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