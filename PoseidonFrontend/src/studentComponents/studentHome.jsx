import React, { useState, useEffect, useRef } from 'react';
import Calendar from './studentHomeComponents/Calendar';
import MasteryProgress from './studentHomeComponents/MasteryProgress';
import MessagesPanel from './studentHomeComponents/MessagesPanel';
import { supabase } from '../supabase';
import { motion } from 'framer-motion';
import { 
  FaGraduationCap, 
  FaBook, 
  FaCalendar, 
  FaClock,
  FaUser,
  FaChevronDown,
  FaCamera,
  FaSun,
  FaMoon,
  FaTimes
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { generateCSSVariables, themeV1 } from '../styles/themes';

const StudentHome = ({ userId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [studentInfo, setStudentInfo] = useState(null);
  const [recentAssignments, setRecentAssignments] = useState([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const profileMenuRef = useRef(null);
  const profileInputRef = useRef(null);
  const navigate = useNavigate();

  // Profile menu click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileImageUpload = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file || !file.type.startsWith("image/")) {
        throw new Error("Invalid image file");
      }

      const fileExt = file.name.split('.').pop();
      const filePath = `profile_images/${userId}.${fileExt}`; // Unique path

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, { cacheControl: "3600", upsert: true });

      if (uploadError) throw uploadError;

      // Generate Public URL for the uploaded image
      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      console.log("Uploaded Image URL:", data.publicUrl);

      // Store the Public URL in UserInfo table
      const { error: dbError } = await supabase
        .from("UserInfo")
        .update({ profile_image: data.publicUrl })
        .eq("id", userId);

      if (dbError) throw dbError;

      // Update React state
      setProfileImage(data.publicUrl);

    } catch (error) {
      console.error("Profile image upload error:", error);
      setError("Failed to update profile image");
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    const style = document.getElementById('theme-vars');
    if (style) {
      style.textContent = generateCSSVariables(themeV1, isDarkMode ? 'light' : 'dark');
      document.documentElement.setAttribute('data-theme', isDarkMode ? 'light' : 'dark');
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [userId]);

  const fetchStudentData = async () => {
    try {
      setLoading(true);

      // Get student info
      const { data: studentData, error: studentError } = await supabase
        .from('UserInfo')
        .select('*')
        .eq('id', userId)
        .single();

      if (studentError) throw studentError;
      setStudentInfo(studentData);

      // Get enrolled classes with teacher info
      const { data: enrollments, error: enrollmentError } = await supabase
        .from('classenrollments')
        .select(`
          id,
          class:classes(
            id,
            name,
            description,
            teacherid,
            teacher:UserInfo!classes_teacherid_fkey(
              id,
              name,
              email,
              role
            )
          )
        `)
        .eq('studentid', userId);

      if (enrollmentError) throw enrollmentError;
      setEnrolledClasses(enrollments.map(e => e.class));

      // Get recent assignments
      const { data: assignments, error: assignmentError } = await supabase
        .from('CreateAssignments')
        .select(`
          id,
          title,
          description,
          due_date,
          points,
          class:classes(
            id,
            name,
            description
          ),
          submissions:submittedassignment(
            id,
            status,
            submitted_at,
            teacher_grade,
            ai_grade
          )
        `)
        .in('class_id', enrollments.map(e => e.class.id))
        .order('due_date', { ascending: true })
        .limit(5);

      if (assignmentError) throw assignmentError;
      setRecentAssignments(assignments);

    } catch (err) {
      console.error('Error fetching student data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen themed-bg flex items-center justify-center">
        <div className="themed-text">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen themed-bg p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Welcome and Profile */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold themed-text mb-2">Welcome back, {studentInfo?.name}!</h1>
            <p className="themed-text-secondary">Here's your daily overview</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-3 themed-button-outline rounded-lg px-4 py-2"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden relative group">
                  {profileImage ? (
                    <img 
                      src={profileImage}
                      alt="Profile" 
                      className="w-full h-full object-cover bg-gray-100 dark:bg-gray-700"
                      onError={(e) => {
                        console.error('Image load error:', e);
                        setProfileImage(null);
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                      <FaUser className="text-gray-500 dark:text-gray-300 text-xl" />
                    </div>
                  )}
                </div>
                <span className="themed-text">{studentInfo?.name}</span>
                <FaChevronDown className="themed-icon" />
              </button>
              
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 themed-card rounded-lg shadow-lg z-50 p-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden relative">
                        {profileImage ? (
                          <img 
                            src={profileImage}
                            alt="Profile" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.error("Error loading image:", e);
                              e.target.src = "";
                              setProfileImage(null);
                            }}
                          />
                        ) : (
                          <FaUser className="w-full h-full p-2 themed-icon" />
                        )}
                      </div>
                      <div>
                        <p className="themed-text font-medium">{studentInfo?.name}</p>
                        <p className="text-sm themed-text-secondary">Student</p>
                      </div>
                    </div>
                    
                    <input
                      type="file"
                      ref={profileInputRef}
                      onChange={handleProfileImageUpload}
                      className="hidden"
                      accept="image/*"
                    />
                    
                    <button 
                      onClick={() => profileInputRef.current.click()}
                      className="themed-button-outline w-full text-sm py-2 flex items-center justify-center gap-2"
                    >
                      <FaCamera className="text-sm" />
                      Change Profile Photo
                    </button>
                    
                    <button
                      onClick={toggleDarkMode}
                      className="themed-button-outline w-full text-sm py-2 flex items-center justify-center gap-2"
                    >
                      {isDarkMode ? <FaSun /> : <FaMoon />}
                      Toggle Theme
                    </button>
                    
                    <hr className="my-2 themed-border" />
                    
                    <button
                      onClick={handleSignOut}
                      className="themed-button-outline w-full text-sm py-2 text-red-500 hover:text-red-600"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Enrolled Classes Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="themed-card rounded-lg shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold themed-text mb-4">Your Classes</h2>
              {enrolledClasses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {enrolledClasses.map((classItem) => (
                    <div
                      key={classItem.id}
                      className="themed-bg-elevated rounded-lg p-4 hover:themed-bg-hover transition-colors"
                    >
                      <h3 className="font-medium text-lg themed-text">{classItem.name}</h3>
                      <p className="text-sm themed-text-secondary mt-1">{classItem.description}</p>
                      <div className="mt-2 text-sm themed-text-secondary">
                        Teacher: {classItem.teacher?.name || 'No teacher assigned'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="themed-text-secondary">
                  You haven't joined any classes yet.
                </p>
              )}
            </motion.div>

            {/* Recent Assignments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="themed-card rounded-lg shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold themed-text mb-4">Recent Assignments</h2>
              <div className="space-y-4">
                {recentAssignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="themed-bg-elevated rounded-lg p-4 hover:themed-bg-hover transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium themed-text">{assignment.title}</h3>
                        <p className="text-sm themed-text-secondary mt-1">{assignment.class.name}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm themed-text-secondary">
                          Due: {new Date(assignment.due_date).toLocaleDateString()}
                        </div>
                        <div className="text-sm themed-text-secondary">
                          Points: {assignment.points}
                        </div>
                      </div>
                    </div>
                    {assignment.submissions?.[0] && (
                      <div className="mt-2 text-sm">
                        <span className="themed-text-success">
                          Submitted • Grade: {assignment.submissions[0].teacher_grade || assignment.submissions[0].ai_grade || 'Pending'}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Calendar Component */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="themed-card rounded-lg shadow-lg p-6"
            >
              <Calendar />
            </motion.div>

            {/* Progress Component */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="themed-card rounded-lg shadow-lg p-6"
            >
              <MasteryProgress />
            </motion.div>

            {/* Messages Component */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="themed-card rounded-lg shadow-lg p-6"
            >
              <MessagesPanel />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHome;