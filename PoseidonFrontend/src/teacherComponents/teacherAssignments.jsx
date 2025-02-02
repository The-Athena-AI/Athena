import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import { supabase } from '../supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaUpload, FaTrash, FaGraduationCap, FaEye, FaClock, FaFileAlt, FaRobot, FaTimes } from 'react-icons/fa';

const TeacherAssignments = ({ userId }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [userClasses, setUserClasses] = useState([]);
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState(''); 
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState('');
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    dueDate: '',
    points: 0,
    classId: '',
    rubric: []
  });
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    try {
      // Get current user session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!session) {
        navigate('/');
        return;
      }

      // Fetch classes
      const { data: classes, error: classError } = await supabase
        .from('classes')
        .select('*')
        .eq('teacherid', session.user.id);

      if (classError) throw classError;
      setUserClasses(classes);

      // Fetch assignments with class details
      const { data: assignmentsData, error: assignError } = await supabase
        .from('CreateAssignments')
        .select(`
          *,
          class:classes(
            id,
            name,
            description
          )
        `)
        .order('created_at', { ascending: false });

      if (assignError) throw assignError;

      // Fetch submissions for each assignment
      const assignmentsWithSubmissions = await Promise.all(
        assignmentsData.map(async (assignment) => {
          const { data: submissions, error: submissionsError } = await supabase
            .from('SubmittedAssignment')
            .select(`
              *,
              student:UserInfo(
                id,
                name,
                email
              )
            `)
            .eq('assignment_id', assignment.id);

          if (submissionsError) throw submissionsError;

          return {
            ...assignment,
            submissions: submissions || []
          };
        })
      );

      setAssignments(assignmentsWithSubmissions);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleCreateAssignment = async () => {
    try {
      if (!newAssignment.classId) {
        setError("Please select a class");
        return;
      }
  
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
  
      if (!session) {
        navigate('/');
        return;
      }
  
      setUploading(true);
  
      // Initialize variables for URLs
      let publicURL = null;
  
      // Only handle file upload if a file was selected
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('rubrics')
          .upload(fileName, selectedFile);
  
        if (uploadError) {
          throw uploadError;
        }
  
        // Get the public URL after successful upload
        const { data: urlData } = await supabase.storage
          .from('rubrics')
          .getPublicUrl(fileName);
  
        if (!urlData || !urlData.publicUrl) {
          throw new Error('Failed to get public URL for uploaded file');
        }
  
        publicURL = urlData.publicUrl;
      }
  
      // Create the assignment with or without the rubric URL
      const { data, error } = await supabase
        .from('CreateAssignments')
        .insert([
          {
            title: newAssignment.title,
            description: newAssignment.description,
            class_id: newAssignment.classId,
            due_date: new Date(newAssignment.dueDate).toISOString(),
            points: parseInt(newAssignment.points),
            rubric_url: publicURL, // Will be null if no file was uploaded
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            file_url: publicURL, // Will be null if no file was uploaded
            rubric: selectedFile,
            file: selectedFile
          }
        ])
        .select();
  
      if (error) throw error;
  
      // Update assignments list
      await fetchData();
      
      // Reset form and close modal
      setNewAssignment({
        title: '',
        description: '',
        classId: '',
        dueDate: '',
        points: '',
        rubric_url: '',
        file_url: null,
        rubric: null,
        file: null
      });
      setSelectedFile(null);
      setFilePreviewUrl('');
      setShowCreateModal(false);
      setUploading(false);
  
    } catch (err) {
      console.error('Error creating assignment:', err);
      setError(err.message);
      setUploading(false);
    }
  };
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setSelectedFile(file);
    setFilePreviewUrl(URL.createObjectURL(file));
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) return;

    try {
      const { error } = await supabase
        .from('CreateAssignments')
        .delete()
        .eq('id', assignmentId);

      if (error) throw error;

      setAssignments(assignments.filter(a => a.id !== assignmentId));
    } catch (err) {
      console.error('Error deleting assignment:', err);
      setError(err.message);
    }
  };

  const handleViewAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setShowSubmissionsModal(true);
  };

  const handleGradeSubmission = async (submission, grade, feedback) => {
    try {
      // Call your friend's backend endpoint for grading
      const response = await fetch('https://95f6-2620-8d-8000-1070-49fa-a74a-6673-20ee.ngrok-free.app/grade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        
        },
        body: JSON.stringify({
          assignment_id: "1352a4b8-1323-4b63-ad29-656c5e367a28",
          completed_assignment_url: "https://wtgulmijdydgulpqhrfb.supabase.co/storage/v1/object/public/assignments/1737950739841_tobe175zf1k.pdf",
          student_id: "d70e1c6d-64fd-41d5-abaf-95ee04ba74a2",
        }),
      });
      console.log(`response: ${response}`);
      const dataJson = await response.json(); // Parse the response body as JSON
      console.log('Response dataJson:', dataJson);
      
    
  
      if (!response.ok) {
        throw new Error('Failed to submit grade to the backend');
      }
  
      const result = await response.json();
  
      // Update the ai_grade and ai_feedback in the database
      const { error } = await supabase
        .from('SubmittedAssignment')
        .update({
          ai_grade: result.grade,
          ai_feedback: result.feedback,
          updated_at: new Date().toISOString(),
        })
        .eq('id', submission.id);
  
      if (error) throw error;
  
      // Refresh assignments to get updated data
      await fetchData();
    } catch (err) {     
      console.error('Error grading submission:', err);
      setError(err.message);
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold themed-text">Assignments</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="themed-button flex items-center gap-2"
          >
            <FaPlus /> Create Assignment
          </button>
        </div>

        {error && (
          <div className="themed-error px-4 py-2 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
          {assignments.map((assignment) => (
            <motion.div
              key={assignment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="themed-card p-6 cursor-pointer"
              onClick={() => handleViewAssignment(assignment)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold themed-text mb-2">{assignment.title}</h2>
                  <p className="themed-text-secondary mb-4">{assignment.description}</p>
                  <div className="flex items-center gap-4 text-sm themed-text-secondary">
                    <span className="flex items-center gap-2">
                      <FaGraduationCap className="themed-text" />
                      {assignment.class?.name}
                    </span>
                    <span className="flex items-center gap-2">
                      <FaClock className="themed-text" />
                      Due: {new Date(assignment.due_date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-2">
                      <FaFileAlt className="themed-text" />
                      Points: {assignment.points}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteAssignment(assignment.id);
                    }}
                    className="themed-error-text hover:themed-error-text-hover transition-colors"
                    title="Delete Assignment"
                  >
                    <FaTrash size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Assignment View Modal */}
        <AnimatePresence>
          {showSubmissionsModal && selectedAssignment && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1}}
              exit={{ opacity: 0 }}
              className="fixed inset-0 flex backdrop-blur-sm items-center justify-center p-4"
            >
              <div className="flex gap-6 max-w-6xl themed-bg-paper w-full rounded-lg">
                {/* Left Container - Assignment Details */}
                <motion.div
                  initial={{ scale: 0.95, opacity: 1 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="flex-1 themed-card p-6"
                >
                  <div className="flex justify-between themed-bg-paper items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold themed-text">{selectedAssignment.title}</h2>
                      <p className="themed-text-secondary mt-2">{selectedAssignment.description}</p>
                    </div>
                    <button
                      onClick={() => setShowSubmissionsModal(false)}
                      className="themed-button-outline"
                    >
                      Close
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6 themed-bg-paper">
                    <div className="themed-card p-4">
                      <h3 className="font-semibold themed-text mb-2">Due Date</h3>
                      <p className="themed-text-secondary">
                        {new Date(selectedAssignment.due_date).toLocaleString()}
                      </p>
                    </div>
                    <div className="themed-card p-4">
                      <h3 className="font-semibold themed-text mb-2">Points</h3>
                      <p className="themed-text-secondary">{selectedAssignment.points}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Right Container - Student Submissions */}
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="w-[600px] themed-card p-6"
                >
                  <h2 className="text-2xl font-bold themed-text mb-6">Assignment Submissions</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full themed-table">
                      <thead>
                        <tr>
                          <th className="pb-2">Student Name</th>
                          <th className="pb-2">Assignment Title</th>
                          <th className="pb-2">Status</th>
                          <th className="pb-2">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assignments.flatMap(assignment =>
                          assignment.submissions.map(submission => (
                            <tr key={`${assignment.id}-${submission.student.id}`}>
                              <td className="py-3">{submission.student.name}</td>
                              <td className="py-3">{assignment.title}</td>
                              <td className="py-3">
                                {submission.status}
                              </td>
                              <td className="py-3">
                              <button
                                onClick={() => navigate(`view/${assignment.id}`)}
                                className="themed-button-outline"
                              >
                                View
                              </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Create Assignment Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 themed-bg-paper bg-opacity-50 flex items-center justify-center p-4">
            <div className="themed-card p-6 w-full h-[calc(100%-4rem)] overflow-y-auto themed-text-secondary max-w-md">
              <h2 className="text-2xl font-bold themed-text mb-4">Create New Assignment</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block themed-text mb-1">Title</label>
                  <input
                    type="text"
                    value={newAssignment.title}
                    onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
                    className="themed-input w-full"
                  />
                </div>

                <div>
                  <label className="block themed-text mb-1">Description</label>
                  <textarea
                    value={newAssignment.description}
                    onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})}
                    className="themed-input w-full h-32"
                  />
                </div>
                <div>
                    <h3 className="font-semibold mb-2">Rubric (Optional)</h3>
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
                      <span>{selectedFile ? 'Change File' : 'Upload Rubric (Optional)'}</span>
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
                    
                    <p className="text-sm text-gray-500 mt-2">
                      Accepted file types: PDF, DOC, DOCX
                    </p>
                  </div>

                <div>
                  <label className="block themed-text mb-1">Class</label>
                  <select
                    value={newAssignment.classId}
                    onChange={(e) => setNewAssignment({...newAssignment, classId: e.target.value})}
                    className="themed-input w-full"
                  >
                    <option value="">Select a class</option>
                    {userClasses.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block themed-text mb-1">Due Date</label>
                  <input
                    type="datetime-local"
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment({...newAssignment, dueDate: e.target.value})}
                    className="themed-input w-full"
                  />
                </div>

                <div>
                  <label className="block themed-text mb-1">Points</label>
                  <input
                    type="number"
                    value={newAssignment.points}
                    onChange={(e) => setNewAssignment({...newAssignment, points: parseInt(e.target.value)})}
                    className="themed-input w-full"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="themed-button-outline"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateAssignment}
                  className="themed-button"
                >
                  Create Assignment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherAssignments;