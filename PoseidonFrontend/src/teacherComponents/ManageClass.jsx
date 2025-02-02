import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGraduationCap, FaClock, FaCheckCircle, FaRobot, FaEye, FaPencilAlt } from 'react-icons/fa';
import { supabase } from '../supabase';

const ManageClass = ({ classData, onClose }) => {
  const [activeTab, setActiveTab] = useState('submissions');
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState({
    visibilityMode: 'immediate',
    releaseDate: null,
    enableAIGrading: true,
    showAISuggestions: false
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubmissions();
    setupRealtimeSubscription();
  }, [classData.id]);

  const fetchSubmissions = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('AssignmentSubmissions')
        .select(`
          id,
          submitted_at,
          status,
          ai_graded,
          teacher_graded,
          visible,
          grade,
          student:UserInfo (
            id,
            name,
            email
          ),
          assignment:Assignments (
            id,
            title,
            due_date
          )
        `)
        .eq('assignment.class_id', classData.id);

      if (error) throw error;
      setSubmissions(data || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const subscription = supabase
      .channel('assignment-submissions')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'AssignmentSubmissions',
          filter: `assignment.class_id=eq.${classData.id}`
        }, 
        (payload) => {
          fetchSubmissions();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const handleGradeSubmission = async (submissionId) => {
    try {
      // Update submission status
      const { error } = await supabase
        .from('AssignmentSubmissions')
        .update({
          status: 'grading',
          teacher_grading_started_at: new Date().toISOString()
        })
        .eq('id', submissionId);

      if (error) throw error;

      // Navigate to grading interface
      navigate(`/teacher-dashboard/assignments/2/submissions/${submissionId}/grade`);
    } catch (err) {
      console.error('Error updating submission:', err);
      setError(err.message);
    }
  };

  const updateVisibilitySettings = async (newSettings) => {
    try {
      const { error } = await supabase
        .from('Classes')
        .update({
          grade_visibility_settings: newSettings
        })
        .eq('id', classData.id);

      if (error) throw error;
      setSettings(newSettings);
    } catch (err) {
      console.error('Error updating settings:', err);
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="text-yellow-400">Loading submissions...</div>;
  }

  if (error) {
    return <div className="text-red-400">Error: {error}</div>;
  }

  return (
    <div className="bg-gray-900 rounded-xl shadow-sm p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-yellow-400">{classData.name}</h2>
        <button onClick={onClose} className="text-yellow-400 hover:text-yellow-500">×</button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-800 mb-6">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab('submissions')}
            className={`py-2 px-4 ${
              activeTab === 'submissions'
                ? 'border-b-2 border-yellow-400 text-yellow-400'
                : 'text-yellow-400/70'
            }`}
          >
            Submissions
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-2 px-4 ${
              activeTab === 'settings'
                ? 'border-b-2 border-yellow-400 text-yellow-400'
                : 'text-yellow-400/70'
            }`}
          >
            Grade Settings
          </button>
        </nav>
      </div>

      {/* Submissions Content */}
      {activeTab === 'submissions' && (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <div 
              key={submission.id}
              className="bg-black p-4 rounded-lg border border-gray-800 hover:border-yellow-400/50 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-yellow-400">
                    {submission.student.name}
                  </h3>
                  <p className="text-sm text-yellow-400/70">
                    Submitted: {new Date(submission.submitted_at).toLocaleString()}
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Status Indicators */}
                  <div className="flex items-center gap-2">
                    <FaRobot className={submission.ai_graded ? "text-green-400" : "text-yellow-400/50"} />
                    <FaCheckCircle className={submission.teacher_graded ? "text-green-400" : "text-yellow-400/50"} />
                    {submission.visible && <FaEye className="text-green-400" />}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {submission.teacher_graded ? (
                      <button
                        onClick={() => navigate(`/teacher-dashboard/assignments/2/submissions/${submission.id}`)}
                        className="flex items-center gap-2 px-4 py-2 bg-yellow-400/10 text-yellow-400 rounded-lg hover:bg-yellow-400/20 transition-colors"
                      >
                        <FaEye size={14} />
                        View
                      </button>
                    ) : (
                      <button
                        onClick={() => handleGradeSubmission(submission.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors"
                      >
                        <FaPencilAlt size={14} />
                        Grade
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Grade Settings Content */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="bg-black p-6 rounded-lg border border-gray-800">
            <h3 className="text-lg font-medium text-yellow-400 mb-4">Grade Visibility</h3>
            <div className="space-y-4">
              <label className="flex items-center gap-2">
                <input 
                  type="radio" 
                  name="visibility" 
                  checked={settings.visibilityMode === 'immediate'}
                  onChange={() => updateVisibilitySettings({
                    ...settings,
                    visibilityMode: 'immediate'
                  })}
                  className="text-yellow-400" 
                />
                <span className="text-yellow-400">Show grades immediately after marking</span>
              </label>
              <label className="flex items-center gap-2">
                <input 
                  type="radio" 
                  name="visibility"
                  checked={settings.visibilityMode === 'batch'}
                  onChange={() => updateVisibilitySettings({
                    ...settings,
                    visibilityMode: 'batch'
                  })}
                  className="text-yellow-400" 
                />
                <span className="text-yellow-400">Show all grades at once when complete</span>
              </label>
              <label className="flex items-center gap-2">
                <input 
                  type="radio" 
                  name="visibility"
                  checked={settings.visibilityMode === 'scheduled'}
                  onChange={() => updateVisibilitySettings({
                    ...settings,
                    visibilityMode: 'scheduled'
                  })}
                  className="text-yellow-400" 
                />
                <span className="text-yellow-400">Show grades on specific date</span>
              </label>
            </div>
          </div>

          <div className="bg-black p-6 rounded-lg border border-gray-800">
            <h3 className="text-lg font-medium text-yellow-400 mb-4">AI Grading Settings</h3>
            <div className="space-y-4">
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  checked={settings.enableAIGrading}
                  onChange={(e) => updateVisibilitySettings({
                    ...settings,
                    enableAIGrading: e.target.checked
                  })}
                  className="text-yellow-400" 
                />
                <span className="text-yellow-400">Enable AI pre-grading</span>
              </label>
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  checked={settings.showAISuggestions}
                  onChange={(e) => updateVisibilitySettings({
                    ...settings,
                    showAISuggestions: e.target.checked
                  })}
                  className="text-yellow-400" 
                />
                <span className="text-yellow-400">Show AI suggestions to students</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageClass;