import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaClock, 
  FaFileAlt,
  FaUpload,
  FaTimes,
  FaEye,
  FaDownload
} from 'react-icons/fa';
import { supabase } from '../supabase';

const StudentAssignmentList = ({ userId }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState('');

  useEffect(() => {
    fetchAssignments();
  }, [userId]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);

      if (!userId) {
        throw new Error('User ID is not available');
      }

      // Get student's enrolled classes
      const { data: enrollments, error: enrollmentError } = await supabase
        .from('classenrollments')
        .select('classid')
        .eq('studentid', userId);

      if (enrollmentError) throw enrollmentError;

      const classIds = enrollments.map(e => e.classid).filter(Boolean);

      if (classIds.length === 0) {
        setAssignments([]);
        return;
      }

      // Get assignments for enrolled classes with submissions
      const { data: assignmentsData, error: assignmentsError } = await supabase
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
            status,
            submitted_at,
            file,
            teacher_grade,
            teacher_feedback,
            ai_grade,
            ai_feedback_strengths,
            ai_feedback_weaknesses,
            ai_overview
          )
        `)
        .in('class_id', classIds)
        .order('due_date', { ascending: false });

      if (assignmentsError) throw assignmentsError;

      setAssignments(assignmentsData || []);
    } catch (err) {
      console.error('Error fetching assignments:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setSelectedFile(file);
    setFilePreviewUrl(URL.createObjectURL(file));
  };
  
  // Add new handleSubmit function
  const handleSubmit = async () => {
    try {
      if (!selectedFile) return;
      setUploading(true);
  
      // Upload file to Supabase storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('assignments')
        .upload(fileName, selectedFile);
  
      if (uploadError) throw uploadError;
  
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('assignments')
        .getPublicUrl(fileName);
        
      // Get AI grading
      const response = await fetch('https://1d46-2620-8d-8000-1070-49fa-a74a-6673-20ee.ngrok-free.app/grade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          assignment_id: selectedAssignment.id,
          completed_assignment_path: fileName,
          student_id: userId,
          submission_id: null
        }),
      });
  
      if (!response.ok) throw new Error('Failed to get AI grading');

      const aiResult = await response.json();
      console.log(`FileNameURL: ${fileName}`);
  
      // Create submission record
    //   const { error: submissionError } = await supabase
    //     .from('SubmittedAssignment')
    //     .insert([
    //       {
    //         assignment_id: selectedAssignment.id,
    //         student_id: userId,
    //         status: 'submitted',
    //         file: publicUrl,
    //         submitted_at: new Date().toISOString(),
    //         ai_grade: aiResult.grade,
    //         ai_feedback: aiResult.feedback
    //       }
    //     ]);
  
    //   if (submissionError) throw submissionError;
  
      // Refresh assignments and close modal
      await fetchAssignments();
      setShowSubmitModal(false);
      setSelectedAssignment(null);
      setSelectedFile(null);
      setFilePreviewUrl('');
  
    } catch (err) {
      console.error('Error uploading submission:', err);
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const getAssignmentStatus = (assignment) => {
    const submissions = assignment.submissions?.[0];
    if (!submissions) return 'Not Submitted';
    if (submissions.teacher_grade) return 'Teacher Graded';
    if (submissions.ai_grade) return 'Athena Graded';
    return 'Submitted';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Teacher Graded':
        return 'text-green-500';
      case 'Athena Graded':
        return 'text-blue-500';
      case 'Submitted':
        return 'text-yellow-500';
      default:
        return 'text-red-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen themed-bg flex items-center justify-center">
        <div className="themed-text">Loading assignments...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen themed-bg p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold themed-text mb-6">My Assignments</h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
          {assignments.map((assignment) => {
            const status = getAssignmentStatus(assignment);
            const statusColor = getStatusColor(status);
            const submission = assignment.submissions?.[0];

            return (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="themed-bg-paper rounded-lg p-6"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold themed-text">{assignment.title}</h2>
                    <p className="themed-text-secondary mt-2">{assignment.description}</p>
                    <div className="flex items-center gap-4 mt-4 text-sm themed-text-secondary">
                      <span>{assignment.class.name}</span>
                      <span>•</span>
                      <span>Teacher: {assignment.class.teacher.name}</span>
                      <span>•</span>
                      <span className="flex items-center gap-2">
                        <FaClock />
                        Due: {new Date(assignment.due_date).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-lg font-bold themed-text">{submission?.teacher_grade != null ? submission.teacher_grade : assignment.grading_system || "N/A"}</div>
                    <div className={`flex items-center gap-2 ${statusColor} mt-2`}>
                      <span>{status}</span>
                    </div>
                    {submission ? (
                      <button
                        onClick={() => navigate(`view/${assignment.id}`)}
                        className="mt-4 flex items-center gap-2 themed-button"
                      >
                        <FaEye />
                        View Submission
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedAssignment(assignment);
                          setShowSubmitModal(true);
                        }}
                        className="mt-4 flex items-center gap-2 themed-button hover:bg-theme-primary cursor-pointer"
                      >
                        <FaUpload />
                        Submit
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Submit Assignment Modal */}
        <AnimatePresence>
          {showSubmitModal && selectedAssignment && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 overflow-y-auto"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white rounded-lg p-6 max-w-2xl w-full my-4 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold">{selectedAssignment.title}</h2>
                  <button
                    onClick={() => {
                      setShowSubmitModal(false);
                      setSelectedAssignment(null);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes size={24} />
                  </button>
                </div>
                <div>

                  </div>

                      <div className="mb-6">
                        <h3 className="font-semibold mb-2">Assignment Details</h3>
                        <p className="text-gray-600">{selectedAssignment.description}</p>
                        <div className="mt-4 text-sm text-gray-500">
                          <div>Due: {new Date(selectedAssignment.due_date).toLocaleString()}</div>
                          <div>Points: {selectedAssignment.points}</div>
                          <div>Class: {selectedAssignment.class.name}</div>
                          <div>Teacher: {selectedAssignment.class.teacher.name}</div>
                        </div>
                      </div>
                    {selectedAssignment.rubric_url && (
                        <div className="mb-6">
                            <h3 className="font-semibold mb-2">Rubric</h3>
                            <div className="border rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <FaFileAlt className="text-gray-500" />
                                        <span>Assignment Rubric</span>
                    </div>
                                    <a href={selectedAssignment.rubric_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="themed-button flex items-center gap-2">

                                        <FaDownload />
                                        <span>Download Rubric</span>
                                    </a>
                                </div>
                                {selectedAssignment.rubric_url.toLowerCase().endsWith('.pdf') && (
                                    <div className="mt-4">
                                        <iframe
                                            src={selectedAssignment.rubric_url}
                                            className="w-full h-72 border rounded"
                                            title="Rubric PDF"
                    />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    <div>
                        <h3 className="font-semibold mb-2">Submit Your Work</h3>
                        <input
                          type="file"
                          onChange={handleFileUpload}
                          disabled={uploading}
                          className="hidden"
                          id="file-upload"
                          accept=".pdf,.doc,.docx"
                        />
                        <label
                          htmlFor="file-upload"
                          className="flex items-center justify-center gap-2 themed-button w-full hover:bg-theme-primary cursor-pointer mb-4"
                        >
                          <FaUpload />
                          <span>Choose File</span>
                        </label>

                        {selectedFile && (
                          <div className="mb-4">
                            <div className="p-4 border rounded-lg">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <FaFileAlt className="text-gray-500" />
                                  <span className="font-medium">{selectedFile.name}</span>
                                </div>
                                <button
                                  onClick={() => {
                                    setSelectedFile(null);
                                    setFilePreviewUrl('');
                                  }}
                                  className="text-gray-500 hover:text-gray-700"
                                >
                                  <FaTimes />
                                </button>
                              </div>
                              {filePreviewUrl && (
                                <div className="mt-2">
                                  {selectedFile.type === 'application/pdf' ? (
                                    <iframe
                                      src={filePreviewUrl}
                                      className="w-full h-64 border rounded"
                                      title="PDF preview"
                                    />
                                  ) : (
                                    <div className="text-sm text-gray-500">
                                      Preview not available for this file type
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        <button
                          onClick={handleSubmit}
                          disabled={!selectedFile || uploading}
                          className={`flex items-center justify-center gap-2 themed-button w-full ${
                            !selectedFile || uploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-theme-primary cursor-pointer'
                          }`}
                        >
                          {uploading ? 'Submitting...' : 'Submit Assignment'}
                        </button>
                        
                        <p className="text-sm text-gray-500 mt-2">
                          Accepted file types: PDF, DOC, DOCX
                        </p>
                      </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StudentAssignmentList;