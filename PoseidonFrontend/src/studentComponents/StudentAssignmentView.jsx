import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import '../styles/resizable.css';
import { motion } from 'framer-motion';
import pdfjsLib from 'pdfjs-dist';
import { 
  FaArrowLeft, 
  FaClock, 
  FaGraduationCap,
  FaRobot,
  FaUserTie,
  FaChevronDown,
  FaChevronUp,
  FaFileAlt,
  FaBook,
  FaDownload
} from 'react-icons/fa';

import { supabase } from '../supabase';

const StudentAssignmentView = ({ userId }) => {
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { assignmentId } = useParams();
  const [splitPosition, setSplitPosition] = useState(50); // percentage
  const [isDragging, setIsDragging] = useState(false);
  const [parsedStrengths, setParsedStrengths] = useState([]);
  const [parsedWeaknesses, setParsedWeaknesses] = useState([]);
  const [expandedFeedback, setExpandedFeedback] = useState({}); // Track expanded/collapsed state
  const [selectedText, setSelectedText] = useState(null);
  const [activeView, setActiveView] = useState('assignment');

  const navigate = useNavigate();

  const isValidUUID = (uuid) => {
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return regex.test(uuid);
  };

  useEffect(() => {
    if (!assignmentId || !isValidUUID(assignmentId)) {
      console.log("Invalid UserID");
      setError('Invalid assignment ID');
      setLoading(false);
      return;
    }
    fetchAssignmentDetails();
  }, [assignmentId]);

  useEffect(() => {
    if (assignment?.submissions?.[0]) {
      const submission = assignment.submissions[0];
  
      // Process strengths
      const strengths = Array.isArray(submission.ai_feedback_strengths)
        ? submission.ai_feedback_strengths.map((strength) => {
            const parsed = typeof strength === 'string' ? JSON.parse(strength) : strength;
            return {
              questionLines: parsed["questions/lines"],
              rubricLines: parsed["rubric lines"],
              feedback: parsed["feedback"],
            };
          })
        : submission.ai_feedback_strengths // If it's a single dictionary
          ? [{
              questionLines: submission.ai_feedback_strengths["questions/lines"],
              rubricLines: submission.ai_feedback_strengths["rubric lines"],
              feedback: submission.ai_feedback_strengths["feedback"],
            }]
          : []; // Fallback to an empty array
  
      setParsedStrengths(strengths);
  
      // Process weaknesses
      let weaknesses = [];
      if (Array.isArray(submission.ai_feedback_weaknesses)) {
        weaknesses = submission.ai_feedback_weaknesses.map((weakness) => {
            const parsed = typeof weakness === 'string' ? JSON.parse(weakness) : weakness;
            return {
              questionLines: parsed["questions/lines"],
              rubricLines: parsed["rubric lines"],
              feedback: parsed["feedback"],
            };
        });
      } else if (typeof submission.ai_feedback_weaknesses === 'string') {
        const parsed = JSON.parse(submission.ai_feedback_weaknesses);
        weaknesses = [{
            questionLines: parsed["questions/lines"],
            rubricLines: parsed["rubric lines"],
            feedback: parsed["feedback"],
        }];
      }
      setParsedWeaknesses(weaknesses);
    }
  }, [assignment]);

// Add these console logs at the start of fetchAssignmentDetails
const fetchAssignmentDetails = async () => {
    try {
      console.log('Current userId:', userId);
      setLoading(true);
      const { data, error: detailsError } = await supabase
        .from('CreateAssignments')
        .select(`
          *,
          class:classes(
            id,
            name,
            teacher:UserInfo(
              name
            )
          ),
          submissions:SubmittedAssignment(
            id,
            assignment_id,
            student_id,
            status,
            submitted_at,
            file,
            teacher_grade,
            teacher_feedback,
            ai_grade,
            ai_feedback_strengths,
            ai_feedback_weaknesses,
            ai_overview,
            ai_rubric_grades,
            file_text
          )
        `)
        .eq('id', assignmentId)
        .single();
  
      if (detailsError) throw detailsError;
      if (!data) throw new Error('No assignment found with the provided ID');
  
      // Log all submissions before filtering
      console.log('All submissions:', data.submissions);
      
      const filteredData = {
        ...data,
        submissions: data.submissions?.filter(sub => {
          console.log('Comparing submission student_id:', sub.student_id, 'with userId:', userId);
          return sub.student_id === userId;
        }) || []
      };
  
      // Log filtered submissions
      console.log('Filtered submissions:', filteredData.submissions);
  
      setAssignment(filteredData);
    } catch (err) {
      console.error('Error in fetchAssignmentDetails:', err);
      setError(err.message || 'Failed to load assignment');
    } finally {
      setLoading(false);
    }
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    document.body.style.cursor = 'col-resize';
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    // Add class to prevent text selection while resizing
    document.body.classList.add('resizing');
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const container = document.querySelector('.flex.w-full.h-\\[800px\\]');
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const newPosition = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    
    // Limit the split position between 20% and 80%
    if (newPosition >= 20 && newPosition <= 80) {
      setSplitPosition(newPosition);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.body.style.cursor = 'default';
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    // Remove the class preventing text selection
    document.body.classList.remove('resizing');
  };
  const highlightText = (text) => {
    if (!text || !submission?._text) return submission?.file_text;
    
    const parts = submission.file_text.split(text);
    console.log(`parts: ${parts}`);
    return parts.map((part, index) => {
      if (index === parts.length - 1) return part;
      return (
        <>
          {part}
          <span className="bg-red-500/30 px-1 rounded">{text}</span>
        </>
      );
    });
  };
  const handleFeedbackClick = (id, questionLines) => {
    setExpandedFeedback((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
    setSelectedText(questionLines);
  };


  const toggleFeedback = (id) => {
    setExpandedFeedback((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen themed-bg flex items-center justify-center">
        <div className="themed-text">Loading assignment details...</div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen themed-bg flex items-center justify-center">
        <div className="themed-text">Assignment not found</div>
      </div>
    );
  }
  
  if (!assignment.submissions?.[0]) {
    return (
      <div className="min-h-screen themed-bg flex items-center justify-center">
        <div className="themed-text">You haven't submitted this assignment yet</div>
      </div>
    );
  }

  const submission = assignment.submissions[0];

  return (
    <div className="min-h-screen themed-bg p-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate( `/student/${userId}/dashboard/assignments`)}
          className="flex items-center gap-2 themed-button mb-6"
        >
           <FaArrowLeft />
          Back to Assignments
        </button>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg mb-6">
            {error}
          </div>
        )}
        <div className="mb-6">
          <h2 className="text-3xl font-bold themed-text">{assignment.title}</h2>
          <div className="flex items-center gap-4 mt-2 themed-text-secondary">
            <span>{assignment.class.name}</span>
            <span>•</span>
            <span>Teacher: {assignment.class.teacher.name}</span>
            <span>•</span>
            <span className="flex items-center gap-2">
              <FaClock />
              Submitted: {new Date(submission.submitted_at).toLocaleString()}
            </span>
          </div>
        </div>
        <div className="mb-6 flex gap-4">
            <button
                onClick={() => setActiveView('assignment')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeView === 'assignment' 
                    ? 'themed-bg-paper themed-text font-bold' 
                    : 'themed-text-secondary hover:themed-bg-paper'
                }`}
            >
                <FaFileAlt />
                Assignment
            </button>
            {assignment.rubric_url && (
                <button
                onClick={() => setActiveView('rubric')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    activeView === 'rubric' 
                    ? 'themed-bg-paper themed-text font-bold' 
                    : 'themed-text-secondary hover:themed-bg-paper'
                }`}
                >
                <FaBook />
                Rubric
                </button>
            )}
            </div>
            {activeView === 'assignment' ? (
        
        <div className="flex w-full h-[800px] relative" onMouseMove={handleMouseMove}>
          {/* Left Container - Text Display */}
          <div 
            className="themed-card overflow-hidden"
            style={{ width: `${splitPosition}%` }}
          >
            <div className="p-6 h-full">
              <div className="w-full h-[calc(100%-4rem)] overflow-y-auto themed-text-secondary">
                {selectedText ? highlightText(selectedText) : submission.file_text}
              </div>
            </div>
          </div>

          {/* Resizer Handle */}
          <div
            className="w-1 hover:w-2 h-full cursor-col-resize bg-gray-600 hover:bg-yellow-400 transition-all duration-200 opacity-50 hover:opacity-100"
            onMouseDown={handleMouseDown}
          />
            
          {/* Right Container - Feedback */}
          <div 
            className="themed-card overflow-y-auto"
            style={{ width: `${100 - splitPosition}%` }}
          >
            <div className="p-6 space-y-6">
            {submission.teacher_grade && (
                <div className="themed-card p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FaUserTie className="text-2xl themed-text" />
                    <h2 className="text-xl font-bold themed-text">Teacher's Feedback</h2>
                  </div>
                  <div className="mb-4">
                    <div className="text-lg font-semibold themed-text">
                      Grade: {submission.teacher_grade != null ? submission.teacher_grade : "N/A"}
                    </div>
                    <div className="mt-4">
                      <h3 className="font-semibold themed-text mb-2">Feedback:</h3>
                      <p className="themed-text-secondary whitespace-pre-line">
                        {submission.teacher_feedback != null ? submission.teacher_feedback : "Waiting for feedback..."}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {/* AI Feedback Section */}
              <div className="themed-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FaRobot className="text-2xl themed-text" />
                  <h2 className="text-xl font-bold themed-text">Athena's Feedback</h2>
                </div>
                <div className="mb-4">
                  <div className="text-lg font-semibold themed-text">
                    Grade: {submission.ai_grade}
                  </div>

                  {/* Strengths Container */}
                  {parsedStrengths.length > 0 && (
                    <div className="mt-4">
                      <h3 className="font-semibold themed-text mb-2">Strengths</h3>
                      {parsedStrengths.map((strength, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-lg bg-green-100/10 border border-green-200/20 mb-4 cursor-pointer hover:bg-green-100/20 transition-colors"
                          onClick={() => handleFeedbackClick(`strength-${index}`, strength.questionLines)}
                        >
                          <div className="flex items-start gap-2">
                            <div className="mt-1 w-2 h-2 rounded-full bg-green-400" />
                            <div>
                              <p className="themed-text-secondary">
                                <strong>Question/Lines:</strong> {strength.questionLines}
                              </p>
                              {expandedFeedback[`strength-${index}`] && (
                                <>
                                  <p className="themed-text-secondary">
                                    <strong>Rubric Lines:</strong> {strength.rubricLines}
                                  </p>
                                  <p className="themed-text-secondary">
                                    <strong>Feedback:</strong> {strength.feedback}
                                  </p>
                                </>
                              )}
                            </div>
                            <div className="ml-auto">
                              {expandedFeedback[`strength-${index}`] ? <FaChevronUp /> : <FaChevronDown />}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Weaknesses Container */}
                  {parsedWeaknesses.length > 0 && (
                    <div className="mt-4">
                      <h3 className="font-semibold themed-text mb-2">Areas for Improvement</h3>
                      {parsedWeaknesses.map((weakness, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-lg bg-yellow-100/10 border border-yellow-200/20 mb-4 cursor-pointer hover:bg-yellow-100/20 transition-colors"
                          onClick={() => handleFeedbackClick(`weakness-${index}`, weakness.questionLines)}
                        >
                          <div className="flex items-start gap-2">
                            <div className="mt-1 w-2 h-2 rounded-full bg-yellow-400" />
                            <div>
                              <p className="themed-text-secondary">
                                <strong>Question/Lines:</strong> {weakness.questionLines}
                              </p>
                              {expandedFeedback[`weakness-${index}`] && (
                                <>
                                  <p className="themed-text-secondary">
                                    <strong>Rubric Lines:</strong> {weakness.rubricLines}
                                  </p>
                                  <p className="themed-text-secondary">
                                    <strong>Feedback:</strong> {weakness.feedback}
                                  </p>
                                </>
                              )}
                            </div>
                            <div className="ml-auto">
                              {expandedFeedback[`weakness-${index}`] ? <FaChevronUp /> : <FaChevronDown />}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Overview Container */}
                  {submission.ai_overview && (
                    <div className="mt-4">
                      <h3 className="font-semibold themed-text mb-2">Overall Feedback</h3>
                      <div className="p-4 rounded-lg bg-blue-100/10 border border-blue-200/20">
                        <div className="flex items-start gap-2">
                          <div className="mt-1 w-2 h-2 rounded-full bg-blue-400" />
                          <div>
                            <p className="themed-text-secondary">
                              {submission.ai_overview}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Rubric Evaluation */}
                  {submission.ai_rubric_grades && (
                    <div className="mt-4">
                      <h3 className="font-semibold themed-text mb-2">Rubric Evaluation:</h3>
                      <div className="space-y-2">
                        {Object.entries(submission.ai_rubric_grades).map(([criterion, grade]) => (
                          <div key={criterion} className="flex justify-between items-center">
                            <span className="themed-text-secondary">{criterion}</span>
                            <span className="themed-text">{grade}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Teacher Feedback Section (if available) */}
             
            </div>
          </div>
        </div>
        ) : (
            // Rubric View
            <div className="themed-card p-6 h-[800px]">
              <div className="w-full h-full">
                {assignment.rubric_url.toLowerCase().endsWith('.pdf') ? (
                  <iframe
                    src={assignment.rubric_url}
                    className="w-full h-full border-0"
                    title="Assignment Rubric"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <a
                      href={assignment.rubric_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="themed-button flex items-center gap-2"
                    >
                      <FaDownload />
                      Download Rubric
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  export default StudentAssignmentView;