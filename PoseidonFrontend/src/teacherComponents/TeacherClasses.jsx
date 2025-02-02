import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaChalkboard, 
  FaChalkboardTeacher,
  FaUserGraduate,
  FaPlus,
  FaTimes,
  FaImage,
  FaEdit,
  FaTrash,
  FaUserPlus,
  FaRobot
} from 'react-icons/fa';
import { supabase } from '../supabase';
import bookImage from '../images/BookImage.jpg';
import GradeViewButton from '../components/GradeViewButton';

const TeacherClasses = ({ userId }) => {
  // State management
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userClasses, setUserClasses] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    className: '',
    subject: '',
    studentEmail: '',
    image: null,
    imagePreview: null
  });
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    due_date: '',
    points: '',
    rubric: [],
    class_id: ''
  });
  const [studentEmail, setStudentEmail] = useState('');
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('details');
  const [assignments, setAssignments] = useState([]);
  const [showCreateAssignmentOptions, setShowCreateAssignmentOptions] = useState(true);
  const [showCreateAssignmentForm, setShowCreateAssignmentForm] = useState(false);
  const navigate = useNavigate();

  // Fetch initial data
  useEffect(() => {
    fetchClasses();
  }, []);

  // Fetch class assignments when a class is selected
  useEffect(() => {
    if (selectedClass) {
      fetchAssignments(selectedClass.id);
    }
  }, [selectedClass]);

  // Fetch all classes for the teacher
  const fetchClasses = async () => {
    try {
      setLoading(true);
      // Get current user session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
  
      if (!session) {
        navigate('/');
        return;
      }
  
      // Fetch classes with enrolled students and assignments
      const { data, error } = await supabase
        .from('classes')
        .select(`
          *,
          enrollments:classenrollments(
            id,
            student_email,
            joined_at,
            student:UserInfo(
              id,
              name,
              email
            )
          ),
          assignments:CreateAssignments(
            id,
            title,
            due_date,
            points,
            submissions:SubmittedAssignment(
              id,
              status
            )
          )
        `)
        .eq('teacherid', userId);
  
      if (error) throw error;
  
      // Process and format the data
      const processedClasses = data.map(cls => ({
        ...cls,
        studentCount: cls.enrollments?.length || 0, // Safeguard enrollments
        assignmentCount: cls.assignments?.length || 0, // Safeguard assignments
        completionRate: calculateCompletionRate(cls.assignments || []) // Safeguard assignments
      }));
  
      setUserClasses(processedClasses);
    } catch (err) {
      console.error('Error fetching classes:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Calculate assignment completion rate
  const calculateCompletionRate = (assignments) => {
    if (!assignments || !assignments.length) return 0; // Handle undefined or empty assignments
  
    const totalSubmissions = assignments.reduce((acc, assignment) => 
      acc + (assignment.submissions?.length || 0), 0); // Handle undefined submissions
    const totalPossible = assignments.length;
  
    return (totalSubmissions / totalPossible) * 100;
  };
  // Fetch assignments for a specific class
  const fetchAssignments = async (classId) => {
    try {
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('CreateAssignments')
        .select(`
          *,
          class:classes!class_id(
            id,
            name
          )
        `)
        .eq('class_id', classId)
        .order('created_at', { ascending: false });

      if (assignmentsError) throw assignmentsError;

      // Fetch submissions for each assignment
      const assignmentsWithSubmissions = await Promise.all(
        assignmentsData.map(async (assignment) => {
          const { data: submissions, error: submissionsError } = await supabase
            .from('SubmittedAssignment')
            .select(`
              id,
              status,
              ai_grade,
              teacher_grade,
              submitted_at,
              teacher_feedback,
              file,
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
    } catch (err) {
      console.error('Error fetching assignments:', err);
      setError(err.message);
    }
  };

  // Create a new class
  const handleCreateClass = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      
      if (!formData.name.trim()) {
        setError('Class name is required');
        return;
      }
  
      // Get current user session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        setError('Authentication required');
        return;
      }
  
      // Upload image if exists
      let imageUrl = null;
      if (formData.image) {
        const fileExt = formData.image.name.split('.').pop();
        const filePath = `class_images/${session.user.id}_${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, formData.image);
  
        if (uploadError) throw uploadError;
  
        const { data } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);
        
        imageUrl = data.publicUrl;
      }
  
      // Create class with image URL
      const { data: newClass, error: classError } = await supabase
        .from('classes')
        .insert([{
          name: formData.name,
          description: formData.description,
          teacherid: session.user.id,
          class_image: imageUrl,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      window.location.reload();
      // ... rest of the existing code ...
    } catch (err) {
      console.error('Error creating class:', err);
      setError(err.message);
    }
  };


  // Add a student to a class
  const handleAddStudent = async () => {
    try {
      if (!selectedClass) return;

      // Normalize the email (trim whitespace and convert to lowercase)
      const normalizedEmail = studentEmail.trim().toLowerCase();
      
      console.log('Attempting to find student with email:', normalizedEmail);

      // First, let's check all users to debug
      const { data: allUsers, error: allUsersError } = await supabase
        .from('UserInfo')
        .select('*');

      console.log('All users in UserInfo:', allUsers);

      // Now try to find the specific student - without role filter first
      const { data: studentData, error: studentError } = await supabase
        .from('UserInfo')
        .select('id, email, role, name')
        .ilike('email', normalizedEmail)
        .single();

      console.log('Student search result:', { studentData, studentError });

      if (studentError) {
        if (studentError.code === 'PGRST116') { // No rows returned
          const { data: emailCheck } = await supabase
            .from('UserInfo')
            .select('email')
            .ilike('email', `%${normalizedEmail}%`);
          
          console.log('Similar emails found:', emailCheck);
          
          setError(`No user found with email: ${normalizedEmail}`);
        } else {
          setError('Error finding student: ' + studentError.message);
        }
        return;
      }

      // Verify the user is a student
      if (studentData.role !== 'Student') {
        setError('This email belongs to a non-student account');
        return;
      }

      // Check if student is already enrolled
      const { data: existingEnrollment, error: enrollmentError } = await supabase
        .from('classenrollments')
        .select('id')
        .eq('classid', selectedClass.id)
        .eq('studentid', studentData.id)
        .single();

      if (existingEnrollment) {
        setError('Student is already enrolled in this class');
        return;
      }

      // Add enrollment
      const { error: addError } = await supabase
        .from('classenrollments')
        .insert([
          {
            classid: selectedClass.id,
            studentid: studentData.id,
            student_email: studentData.email,
            joined_at: new Date().toISOString()
          }
        ]);

      if (addError) throw addError;

      // Refresh class data
      await fetchClasses();
      setStudentEmail('');
      setError(''); // Clear any existing errors

    } catch (err) {
      console.error('Error adding student:', err);
      setError(err.message);
    }
  };

  // Update class details
  const handleUpdateClass = async (updates) => {
    try {
      if (!selectedClass) return;

      const { error } = await supabase
        .from('classes')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedClass.id);

      if (error) throw error;

      // Update local state
      setSelectedClass(prev => ({
        ...prev,
        ...updates
      }));

      // Refresh classes to get updated data
      await fetchClasses();

    } catch (err) {
      console.error('Error updating class:', err);
      setError(err.message);
    }
  };

  // Handle removing a student
  const handleRemoveStudent = async (studentId) => {
    try {
      if (!selectedClass) return;

      const { error } = await supabase
        .from('classenrollments')
        .delete()
        .eq('classid', selectedClass.id)
        .eq('studentid', studentId);

      if (error) throw error;

      // Refresh class data
      await fetchClasses();

    } catch (err) {
      console.error('Error removing student:', err);
      setError(err.message);
    }
  };

  const handleCreateAssignment = async () => {
    try {
      if (!selectedClass) {
        setError("Please select a class first");
        return;
      }
  
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
  
      if (!session) {
        navigate('/');
        return;
      }
  
      const { data, error } = await supabase
        .from('CreateAssignments')
        .insert([
          {
            title: newAssignment.title,
            description: newAssignment.description,
            class_id: selectedClass.id,
            due_date: new Date(newAssignment.due_date).toISOString(),
            points: parseInt(newAssignment.points),
            rubric: newAssignment.rubric
            // Do not include `id` or `created_at`/`updated_at` if they have DEFAULT values
          }
        ])
        .select();
  
      if (error) throw error;
  
      // Update assignments list
      await fetchAssignments(selectedClass.id);
  
      // Reset form and close modal
      setNewAssignment({
        title: '',
        description: '',
        due_date: '',
        points: '',
        rubric: [],
        class_id: ''
      });
      setShowAssignmentModal(false);
      
  
    } catch (err) {
      console.error('Error creating assignment:', err);
      setError(err.message);
    }
  };

  // Delete a class
  const handleDeleteClass = async (classId) => {
    try {
      // First confirm with the user
      if (!window.confirm('Are you sure you want to delete this class? This action cannot be undone.')) {
        return;
      }

      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', classId);

      if (error) throw error;

      // Update local state
      setUserClasses(prev => prev.filter(cls => cls.id !== classId));
      setSelectedClass(null);
      setShowManageModal(false);

    } catch (err) {
      console.error('Error deleting class:', err);
      setError(err.message);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen themed-bg flex items-center justify-center">
        <div className="themed-text">Loading classes...</div>
      </div>
    );
  }
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: file,
          imagePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="themed-bg p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold themed-text">My Classes</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="themed-button flex items-center px-4 py-2 rounded-lg"
          >
            <FaPlus className="mr-2" />
            New Class
          </button>
        </div>

        {/* Error display */}
        {error && (
          <div className="themed-error mb-4 p-4 rounded-lg">
            {error}
          </div>
        )}

        {/* Classes grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userClasses.map((classData) => (
            <motion.div
              key={classData.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="themed-card rounded-lg overflow-hidden"
            >
              <div className="flex flex-col md:flex-row h-36">
                {/* Image Section (1/3 on desktop) */}
                <div className="w-full h-36 md:h-auto bg-gray-100 dark:bg-gray-800 relative group">
                  {classData.class_image ? (
                    <img
                      src={classData.class_image}
                      alt="Class cover"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Image load error:', e);
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <FaChalkboardTeacher className="text-3xl" />
                    </div>
                  )}
                </div>
              </div>

                {/* Content Section (2/3 on desktop) */}
                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold themed-text mb-2">
                        {classData.name}
                      </h3>
                      <p className="themed-text-secondary line-clamp-2">
                        {classData.description}
                      </p>
                    </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedClass(classData);
                      setShowManageModal(true);
                    }}
                    className="themed-button-outline p-2 rounded-lg"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteClass(classData.id)}
                    className="themed-button-outline p-2 rounded-lg text-red-500"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 ml-4">
                <span className="themed-text-secondary">
                  {classData.studentCount} students
                </span>
                <button
                  onClick={() => {
                    setSelectedClass(classData);
                    setShowManageModal(true);
                  }}
                  className="themed-button-outline flex items-center px-2 py-1 rounded-lg mb-2 mr-2"
                >
                  <FaUserPlus className="mr-2" />
                  Add Student
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      
        {/* Create Class Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="themed-modal rounded-lg p-6 w-full max-w-md"
              >
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="themed-button-outline absolute top-4 right-4"
                >
                  <FaTimes size={20} />
                </button>

                <h2 className="text-2xl font-bold themed-text mb-6">Create New Class</h2>

                <form onSubmit={handleCreateClass}>
                  <div className="space-y-4">
                  <div>
                      <label className="block themed-text mb-2">Class Cover Image</label>
                      <div className="relative group aspect-video rounded-lg overflow-hidden transition-all">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="classImageUpload"
                        />
                        <label 
                          htmlFor="classImageUpload"
                          className="w-full h-full flex items-center justify-center cursor-pointer"
                        >
                          {formData.imagePreview ? (
                            <img 
                              src={formData.imagePreview} 
                              alt="Class preview" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-center p-4">
                              <FaImage className="text-3xl themed-icon mb-2 mx-auto" />
                              <p className="themed-text-secondary text-sm">
                                Click to upload a cover image (Recommended: 16:9 ratio)
                              </p>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block themed-text mb-2">Class Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="themed-input w-full px-4 py-2 rounded-lg"
                        placeholder="Enter class name"
                      />
                    </div>

                    <div>
                      <label className="block themed-text mb-2">Subject</label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="themed-input w-full px-4 py-2 rounded-lg"
                        placeholder="Enter class subject"
                      />
                    </div>

                    <div>
                      <label className="block themed-text mb-2">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="themed-input w-full px-4 py-2 rounded-lg"
                        placeholder="Enter class description"
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="themed-button-outline px-4 py-2 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="themed-button px-4 py-2 rounded-lg"
                    >
                      Create Class
                    </button>
                    </div>
                  
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Manage Class Modal */}
        <AnimatePresence>
          {showManageModal && selectedClass && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <div className="themed-modal rounded-lg p-6 w-full max-w-6xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold themed-text">{selectedClass.name}</h2>
                  <button
                    onClick={() => setShowManageModal(false)}
                    className="themed-button-outline p-2 rounded-lg"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>

                {/* Main content container with flex layout */}
                <div className="flex gap-8">
                  {/* Left container */}
                  <div className="flex-1 space-y-8">
                    {/* Add Student Section */}
                    <div>
                      <h3 className="text-lg font-semibold themed-text mb-4">Add Student</h3>
                      <div className="flex gap-2">
                        <input
                          type="email"
                          name="studentEmail"
                          value={studentEmail}
                          onChange={(e) => setStudentEmail(e.target.value)}
                          placeholder="Enter student email"
                          className="themed-input flex-1 px-4 py-2 rounded-lg"
                        />
                        <button
                          onClick={handleAddStudent}
                          className="themed-button px-4 py-2 rounded-lg"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {/* Student List */}
                    <div>
                      <h3 className="text-lg font-semibold themed-text mb-4">Enrolled Students</h3>
                      <div className="space-y-2">
                        {selectedClass.enrollments?.map((enrollment) => (
                          <div
                            key={enrollment.student.id}
                            className="flex items-center justify-between themed-text-secondary p-4 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <FaUserGraduate className="themed-text-secondary" />
                              <div>
                                <div className="themed-text">{enrollment.student.name}</div>
                                <div className="text-sm themed-text-secondary">{enrollment.student.email}</div>
                              </div>
                            </div>
                            <button
                              onClick={() => handleRemoveStudent(enrollment.student.id)}
                              className="themed-button-outline text-red-500"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Assignment Submissions */}
                    <div>
                      <h3 className="text-lg font-semibold themed-text mb-4">Assignment Submissions</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full themed-table">
                          <thead>
                            <tr className="themed-table-header">
                              <th className="pb-2 themed-table-header-cell">Student Name</th>
                              <th className="pb-2 themed-table-header-cell">Assignment Title</th>
                              <th className="pb-2 themed-table-header-cell">Status</th>
                              <th className="pb-2 themed-table-header-cell">Action</th>
                            </tr>
                          </thead>
                          <tbody className="themed-table-body">
                            {assignments.flatMap(assignment =>
                              assignment.submissions.map(submission => (
                                <tr key={`${assignment.id}-${submission.student.id}`} className="themed-table-row">
                                  <td className="py-3 themed-table-cell">{submission.student.name}</td>
                                  <td className="py-3 themed-table-cell">{assignment.title}</td>
                                  <td className="py-3 themed-table-cell">
                                    {submission.status === 'Athena Graded' ? (
                                      <span className="themed-text-success">Athena Graded</span>
                                    ) : (
                                      <span className="themed-text-error">Not Submitted</span>
                                    )}
                                  </td>
                                  <td className="py-3 themed-table-cell">
                                    <GradeViewButton
                                      userId={userId}
                                      assignmentId={assignment.id}
                                      submissionId={submission.id}
                                      status={submission.status}
                                    />
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Right container - Create Assignment */}
                  <div className="w-96 themed-card p-6 rounded-lg h-fit">
                    {showCreateAssignmentOptions ? (
                      <div className="flex flex-col gap-4">
                        <h3 className="text-lg font-semibold themed-text mb-2">Create Assignment</h3>
                        <button
                          onClick={() => {
                            setShowCreateAssignmentOptions(false);
                            setShowCreateAssignmentForm(true);
                          }}
                          className="themed-button px-4 py-3 rounded-lg flex items-center justify-center gap-2"
                        >
                          <FaPlus className="text-sm" />
                          Create Assignment
                        </button>
                        <button
                          onClick={() => {
                            // Handle Athena generation
                            setShowCreateAssignmentOptions(false);
                            setShowCreateAssignmentForm(true);
                          }}
                          className="themed-button-outline px-4 py-3 rounded-lg flex items-center justify-center gap-2"
                        >
                          <FaRobot className="text-sm" />
                          Generate with Athena
                        </button>
                      </div>
                    ) : showCreateAssignmentForm && (
                      <div className="w-full">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold themed-text">Create New Assignment</h3>
                          <button
                            onClick={() => {
                              setShowCreateAssignmentOptions(true);
                              setShowCreateAssignmentForm(false);
                            }}
                            className="themed-button-outline p-2 rounded-lg"
                          >
                            <FaTimes />
                          </button>
                        </div>

                        <form className="space-y-4">
                          <div>
                            <label className="block themed-text mb-2">Title</label>
                            <input
                              type="text"
                              value={newAssignment.title}
                              onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                              className="themed-input w-full px-4 py-2 rounded-lg"
                              placeholder="Assignment title"
                            />
                          </div>

                          <div>
                            <label className="block themed-text mb-2">Description</label>
                            <textarea
                              value={newAssignment.description}
                              onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                              className="themed-input w-full px-4 py-2 rounded-lg"
                              rows={4}
                              placeholder="Assignment description"
                            />
                          </div>

                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <label className="block themed-text mb-2">Due Date</label>
                              <input
                                type="datetime-local"
                                value={newAssignment.due_date}
                                onChange={(e) => setNewAssignment({ ...newAssignment, due_date: e.target.value })}
                                className="themed-input w-full px-4 py-2 rounded-lg"
                              />
                            </div>
                            <div>
                              <label className="block themed-text mb-2">Points</label>
                              <input
                                type="number"
                                value={newAssignment.points}
                                onChange={(e) => setNewAssignment({ ...newAssignment, points: e.target.value })}
                                className="themed-input w-full px-4 py-2 rounded-lg"
                                placeholder="100"
                                min="0"
                              />
                            </div>
                          </div>

                          <div className="flex justify-end space-x-4 mt-6">
                            <button
                              type="button"
                              onClick={() => {
                                setShowCreateAssignmentOptions(true);
                                setShowCreateAssignmentForm(false);
                              }}
                              className="themed-button-outline px-4 py-2 rounded-lg"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleCreateAssignment}
                              className="themed-button px-4 py-2 rounded-lg"
                            >
                              Create Assignment
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TeacherClasses; 