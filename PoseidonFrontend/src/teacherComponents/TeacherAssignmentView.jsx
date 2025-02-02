import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    FaArrowLeft, 
    FaClock, 
    FaUserGraduate,
    FaRobot,
    FaChevronDown,
    FaChevronUp,
    FaSave,
    FaCheckCircle,
    FaFileAlt,
    FaBook,
    FaDownload
} from 'react-icons/fa';
import { PdfLoader } from "react-pdf-highlighter";
import { supabase } from '../supabase';

const TeacherAssignmentView = ({ userId }) => {
    const [assignment, setAssignment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [splitPosition, setSplitPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const [teacherGrade, setTeacherGrade] = useState('');
    const [teacherFeedback, setTeacherFeedback] = useState('');
    const [expandedFeedback, setExpandedFeedback] = useState({});
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [activeView, setActiveView] = useState('assignment');
    const [selectedText, setSelectedText] = useState(null);
    const { assignmentId } = useParams();
    const navigate = useNavigate();

  useEffect(() => {
    if (!assignmentId) {
      setError('No assignment ID provided');
      return;
    }
    fetchAssignmentDetails();
  }, [assignmentId]);

  const fetchAssignmentDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch assignment details
      const { data: assignmentData, error: assignmentError } = await supabase
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
            file_text,
            student:UserInfo(
              id,
              name,
              email
            )
          )
        `)
        .eq('id', assignmentId)
        .single();

      if (assignmentError) throw assignmentError;

      setAssignment(assignmentData);
      
      // If there's a submission, select the first one by default
      if (assignmentData.submissions?.length > 0) {
        const submission = assignmentData.submissions[0];
        setSelectedSubmission(submission);
        setTeacherGrade(submission.teacher_grade || '');
        setTeacherFeedback(submission.teacher_feedback || '');
      }
    } catch (err) {
      console.error('Error fetching assignment:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmissionSelect = (submission) => {
    setSelectedSubmission(submission);
    setTeacherGrade(submission.teacher_grade || '');
    setTeacherFeedback(submission.teacher_feedback || '');
    setSaveSuccess(false);
  };

  const handleGradeSave = async () => {
    if (!selectedSubmission) return;

    try {
      setSaving(true);

      const { error } = await supabase
        .from('SubmittedAssignment')
        .update({
          teacher_grade: teacherGrade,
          teacher_feedback: teacherFeedback,
          status: 'graded'
        })
        .eq('id', selectedSubmission.id);

      if (error) throw error;

      setSaveSuccess(true);
      await fetchAssignmentDetails();
    } catch (err) {
      console.error('Error saving grade:', err);
      setError('Failed to save grade: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.classList.add('resizing');
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const container = document.querySelector('.flex.w-full.h-\\[800px\\]');
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const newPosition = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    
    if (newPosition >= 20 && newPosition <= 80) {
      setSplitPosition(newPosition);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.body.classList.remove('resizing');
  };
  const highlightText = (text) => {
    if (!text || !selectedSubmission?.file_text) return selectedSubmission?.file_text;
    
    const parts = selectedSubmission.file_text.split(text);
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
    setExpandedFeedback(prev => ({
      ...prev,
      [id]: !prev[id]
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

  return (
        <div className="min-h-screen themed-bg p-6">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => navigate(`/teacher/${userId}/dashboard/assignments`)}
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
                <span>Due: {new Date(assignment.due_date).toLocaleDateString()}</span>
                <span>•</span>
                <span>Points: {assignment.points}</span>
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
              <div className="flex w-full h-[800px] relative themed-bg-paper rounded-lg shadow-lg" onMouseMove={handleMouseMove}>
                {/* Left Container - Text Display */}
                <div 
                  className="themed-card overflow-hidden rounded-l-lg"
                  style={{ width: `${splitPosition}%` }}
                >
                  <div className="p-6 h-full">
                    <div className="w-full h-[calc(100%-4rem)] overflow-y-auto themed-text-secondary">
                      {selectedText ? highlightText(selectedText) : selectedSubmission?.file_text}
                    </div>
                  </div>
                </div>
      
                {/* Resizer Handle */}
                <div
                  className="w-1 hover:w-2 h-full cursor-col-resize bg-gray-600 hover:bg-yellow-400 transition-all duration-200 opacity-50 hover:opacity-100"
                  onMouseDown={handleMouseDown}
                />
                  
                {/* Right Container - Grading and Feedback */}
                <div 
                  className="themed-card overflow-y-auto rounded-r-lg"
                  style={{ width: `${100 - splitPosition}%` }}
                >
                  {selectedSubmission ? (
                    <div className="p-6 space-y-6">
                      {/* Teacher Grading Section */}
                      <div className="themed-card p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <FaUserGraduate className="text-2xl themed-text" />
                            <h2 className="text-xl font-bold themed-text">Teacher Grading</h2>
                          </div>
                          <div className="flex items-center gap-2">
                            {saveSuccess && (
                              <span className="text-green-500 flex items-center gap-1">
                                <FaCheckCircle /> Saved
                              </span>
                            )}
                            <button
                              onClick={handleGradeSave}
                              disabled={saving}
                              className="themed-button flex items-center gap-2"
                            >
                              <FaSave />
                              {saving ? 'Grading...' : 'Final Grade'}
                            </button>
                          </div>
                        </div>
      
                        <div className="space-y-4">
                          <div>
                            <label className="block themed-text mb-2">Grade (out of {assignment.points})</label>
                            <input
                              type="number"
                              value={teacherGrade}
                              onChange={(e) => setTeacherGrade(e.target.value)}
                              min="0"
                              max={assignment.points}
                              className="themed-input w-full"
                            />
                          </div>
      
                          <div>
                            <label className="block themed-text mb-2">Feedback</label>
                            <textarea
                              value={teacherFeedback}
                              onChange={(e) => setTeacherFeedback(e.target.value)}
                              rows={6}
                              className="themed-input w-full"
                              placeholder="Provide feedback to the student..."
                            />
                          </div>
                        </div>
                      </div>
      
                      {/* AI Feedback Section */}
                      <div className="themed-card p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <FaRobot className="text-2xl themed-text" />
                          <h2 className="text-xl font-bold themed-text">AI Feedback</h2>
                        </div>
      
                        <div className="mb-4">
                          <div className="text-lg font-semibold themed-text">
                            AI Grade: {selectedSubmission.ai_grade}/{assignment.points}
                          </div>
      
                          {/* Overview */}
                          {selectedSubmission.ai_overview && (
                            <div className="mt-4">
                              <h3 className="font-semibold themed-text mb-2">Overall Feedback</h3>
                              <div className="p-4 rounded-lg bg-blue-100/10 border border-blue-200/20">
                                <div className="themed-text-secondary">
                                  {selectedSubmission.ai_overview}
                                </div>
                              </div>
                            </div>
                          )}
      
                          {/* Strengths */}
                          {selectedSubmission.ai_feedback_strengths && (
                            <div className="mt-4">
                              <h3 className="font-semibold themed-text mb-2">Strengths</h3>
                              {Array.isArray(selectedSubmission.ai_feedback_strengths) 
                                ? selectedSubmission.ai_feedback_strengths.map((strength, index) => {
                                    const parsed = typeof strength === 'string' ? JSON.parse(strength) : strength;
                                    return (
                                      <div
                                        key={index}
                                        className="p-4 rounded-lg bg-green-100/10 border border-green-200/20 mb-2 cursor-pointer"
                                        onClick={() => handleFeedbackClick(`strength-${index}`, parsed["questions/lines"])}
                                      >
                                        <div className="flex items-start gap-2">
                                          <div className="mt-1 w-2 h-2 rounded-full bg-green-400" />
                                          <div className="flex-1">
                                            <p className="themed-text-secondary">
                                              <strong>Question/Lines:</strong> {parsed["questions/lines"]}
                                            </p>
                                            {expandedFeedback[`strength-${index}`] && (
                                              <>
                                                <p className="themed-text-secondary mt-2">
                                                  <strong>Rubric Lines:</strong> {parsed["rubric lines"]}
                                                </p>
                                                <p className="themed-text-secondary mt-2">
                                                  <strong>Feedback:</strong> {parsed["feedback"]}
                                                </p>
                                              </>
                                            )}
                                          </div>
                                          <div className="ml-auto">
                                            {expandedFeedback[`strength-${index}`] ? <FaChevronUp /> : <FaChevronDown />}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })
                                : null
                              }
                            </div>
                          )}
      
                          {/* Weaknesses */}
                          {selectedSubmission.ai_feedback_weaknesses && (
                            <div className="mt-4">
                              <h3 className="font-semibold themed-text mb-2">Areas for Improvement</h3>
                              {Array.isArray(selectedSubmission.ai_feedback_weaknesses) 
                                ? selectedSubmission.ai_feedback_weaknesses.map((weakness, index) => {
                                    const parsed = typeof weakness === 'string' ? JSON.parse(weakness) : weakness;
                                    return (
                                      <div
                                        key={index}
                                        className="p-4 rounded-lg bg-yellow-100/10 border border-yellow-200/20 mb-2 cursor-pointer"
                                        onClick={() => handleFeedbackClick(`weakness-${index}`, parsed["questions/lines"])}
                                      >
                                        <div className="flex items-start gap-2">
                                          <div className="mt-1 w-2 h-2 rounded-full bg-yellow-400" />
                                          <div className="flex-1">
                                            <p className="themed-text-secondary">
                                              <strong>Question/Lines:</strong> {parsed["questions/lines"]}
                                            </p>
                                            {expandedFeedback[`weakness-${index}`] && (
                                              <>
                                                <p className="themed-text-secondary mt-2">
                                                  <strong>Rubric Lines:</strong> {parsed["rubric lines"]}
                                                </p>
                                                <p className="themed-text-secondary mt-2">
                                                  <strong>Feedback:</strong> {parsed["feedback"]}
                                                </p>
                                              </>
                                            )}
                                          </div>
                                          <div className="ml-auto">
                                            {expandedFeedback[`weakness-${index}`] ? <FaChevronUp /> : <FaChevronDown />}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })
                                : null
                              }
                            </div>
                          )}
      
                          {/* Rubric Grades */}
                          {selectedSubmission.ai_rubric_grades && (
                            <div className="mt-4">
                              <h3 className="font-semibold themed-text mb-2">Rubric Evaluation</h3>
                              <div className="space-y-2">
                                {Object.entries(selectedSubmission.ai_rubric_grades).map(([criterion, grade]) => (
                                  <div key={criterion} className="flex justify-between items-center p-2 themed-bg rounded-lg">
                                    <span className="themed-text-secondary">{criterion}</span>
                                    <span className="themed-text font-semibold">{grade}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 flex items-center justify-center h-full">
                      <div className="text-center themed-text-secondary">
                        No submission selected
                      </div>
                    </div>
                  )}
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
export default TeacherAssignmentView;