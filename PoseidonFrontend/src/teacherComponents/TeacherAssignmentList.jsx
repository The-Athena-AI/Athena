import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlus, 
  FaTrash, 
  FaGraduationCap, 
  FaClock, 
  FaFileAlt,
  FaEye
} from 'react-icons/fa';
import { supabase } from '../supabase';

const TeacherAssignmentList = ({ userId }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [userClasses, setUserClasses] = useState([]);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    dueDate: '',
    points: 0,
    classId: '',
    rubric: []
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    try {
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

      // Fetch assignments with class details and submissions count
      const { data: assignmentsData, error: assignError } = await supabase
        .from('CreateAssignments')
        .select(`
          *,
          class:classes(
            id,
            name,
            description
          ),
          submissions:SubmittedAssignment(count)
        `)
        .order('created_at', { ascending: false });

      if (assignError) throw assignError;
      setAssignments(assignmentsData);
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

      const { data, error } = await supabase
        .from('CreateAssignments')
        .insert([
          {
            title: newAssignment.title,
            description: newAssignment.description,
            class_id: newAssignment.classId,
            due_date: new Date(newAssignment.dueDate).toISOString(),
            points: parseInt(newAssignment.points),
            rubric: newAssignment.rubric || [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select();

      if (error) throw error;

      await fetchData();
      
      setNewAssignment({
        title: '',
        description: '',
        dueDate: '',
        points: 0,
        classId: '',
        rubric: []
      });
      setShowCreateModal(false);

    } catch (err) {
      console.error('Error creating assignment:', err);
      setError(err.message);
    }
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
              className="themed-card p-6"
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
                    onClick={() => navigate(`/assignments/view/${assignment.id}`)}
                    className="themed-button flex items-center gap-2"
                  >
                    <FaEye />
                    View Submissions ({assignment.submissions[0]?.count || 0})
                  </button>
                  <button
                    onClick={() => handleDeleteAssignment(assignment.id)}
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

        {/* Create Assignment Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 themed-bg-paper bg-opacity-50 flex items-center justify-center p-4"
            >
              <div className="themed-card p-6 w-full max-w-md">
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TeacherAssignmentList;