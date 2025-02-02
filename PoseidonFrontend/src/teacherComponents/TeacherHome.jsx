import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  FaChalkboardTeacher,
  FaBook,
  FaUserGraduate,
  FaChartLine,
  FaClock,
  FaUser,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaCamera,
  FaSun,
  FaMoon
} from 'react-icons/fa';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import { generateCSSVariables, themeV1 } from '../styles/themes';


const TeacherHome = ({ userId }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { icon: FaChalkboardTeacher, label: 'Active Classes', value: '0' },
    { icon: FaBook, label: 'Assignments', value: '0' },
    { icon: FaUserGraduate, label: 'Total Students', value: '0' },
    { icon: FaChartLine, label: 'Completion Rate', value: '0%' },
  ]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [calendar, setCalendar] = useState({
    days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    dates: [],
    events: {}
  });
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [assignmentImage, setAssignmentImage] = useState(null);
  const [userName, setUserName] = useState('');
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const profileMenuRef = useRef(null);
  const profileInputRef = useRef(null);
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [error, setError] = useState(null);


  useEffect(() => {
    fetchDashboardData();
    fetchUserProfile();
    generateCalendar(selectedMonth);
  }, [userId]);

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
            .from('images') // Make sure this bucket exists in Supabase
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

  const generateCalendar = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const dates = [];
    let week = new Array(7).fill(null);
    
    for (let i = 0; i < firstDay; i++) {
      week[i] = null;
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const weekDay = (firstDay + day - 1) % 7;
      week[weekDay] = day;
      
      if (weekDay === 6 || day === daysInMonth) {
        dates.push(week);
        week = new Array(7).fill(null);
      }
    }
    
    setCalendar(prev => ({
      ...prev,
      dates
    }));
  };

  const changeMonth = (increment) => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(newDate.getMonth() + increment);
    setSelectedMonth(newDate);
    generateCalendar(newDate);
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get current user session and info
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;

      if (!session) {
        navigate('/');
        return;
      }

      // Fetch teacher info
      const { data: teacherInfo, error: teacherError } = await supabase
        .from('UserInfo')
        .select('name, profile_image')
        .eq('id', userId)
        .single();

      if (teacherError) throw teacherError;
      
      setUserName(teacherInfo?.name || '');
      setProfileImage(teacherInfo?.profile_image);

      // Fetch classes with enrolled students and assignments
      const { data: classes, error: classError } = await supabase
        .from('classes')
        .select(`
          *,
          enrollments:classenrollments(
            id,
            student:UserInfo(id)
          ),
          assignments:CreateAssignments(
            id,
            submissions:SubmittedAssignment(
              id,
              status
            )
          )
        `)
        .eq('teacherid', userId);

      if (classError) throw classError;

      // Calculate statistics
      const totalClasses = classes.length;
      const totalAssignments = classes.reduce((sum, cls) => 
        sum + (cls.assignments?.length || 0), 0);
      const totalStudents = new Set(
        classes.flatMap(cls => 
          cls.enrollments?.map(e => e.student?.id) || []
        )
      ).size;
      
      // Calculate completion rate
      const totalSubmissions = classes.reduce((sum, cls) => 
        sum + cls.assignments?.reduce((subSum, assignment) => 
          subSum + (assignment.submissions?.filter(s => s.status === 'submitted').length || 0), 0
        ) || 0, 0);
      const totalPossibleSubmissions = classes.reduce((sum, cls) => 
        sum + (cls.assignments?.length || 0) * (cls.enrollments?.length || 0), 0);
      const completionRate = totalPossibleSubmissions > 0 
        ? Math.round((totalSubmissions / totalPossibleSubmissions) * 100)
        : 0;

      setStats([
        { icon: FaChalkboardTeacher, label: 'Active Classes', value: totalClasses.toString() },
        { icon: FaBook, label: 'Assignments', value: totalAssignments.toString() },
        { icon: FaUserGraduate, label: 'Total Students', value: totalStudents.toString() },
        { icon: FaChartLine, label: 'Completion Rate', value: `${completionRate}%` },
      ]);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
        const { data: userInfo, error } = await supabase
            .from("UserInfo")
            .select("name, profile_image")  // Expecting URL, not Base64
            .eq("id", userId)
            .single();

        if (error) throw error;

        setUserName(userInfo?.name || "Teacher");

        // Expecting URL instead of Base64
        if (typeof userInfo?.profile_image === "string" && userInfo.profile_image.startsWith("http")) {
            setProfileImage(userInfo.profile_image);
        } else {
            console.warn("Invalid profile image format detected:", userInfo.profile_image);
            setProfileImage(null);
        }

    } catch (error) {
        console.error("Profile fetch error:", error);
        setProfileImage(null);
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

  return (
    <div className="themed-bg min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Welcome and Profile */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold themed-text mb-2">Welcome back, {userName}!</h1>
            <p className="themed-text-secondary mb-6">Here's your daily overview</p>
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
              <span className="themed-text">{userName}</span>
              <FaChevronDown className="themed-icon" />
            </button>
              
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 themed-card rounded-lg shadow-lg z-50 p-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden relative">
                      {profileImage ? (
                            <>
                              {console.log("Rendering Profile Image:", profileImage)} {/* Debugging log */}
                              <img 
                                src={profileImage}
                                alt="Profile" 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  console.error("Error loading image. ProfileImage state:", profileImage);
                                  e.target.src = "";
                                  setProfileImage(null);
                                }}
                              />
                            </>
                          ) : (
                            <FaUser className="w-full h-full p-2 themed-icon" />
                          )}

                      </div>
                      <div>
                        <p className="themed-text font-medium">{userName}</p>
                        <p className="text-sm themed-text-secondary">Teacher</p>
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
                    
                    <hr className="my-2 " />
                    
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

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Content - Stats and Chart */}
          <div className="lg:col-span-2 space-y-6">
        {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="themed-card p-6 rounded-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="themed-icon-bg">
                  <stat.icon className="text-2xl" />
                </div>
                <span className="text-2xl font-bold themed-text">{stat.value}</span>
              </div>
              <h3 className="text-lg themed-text-secondary">{stat.label}</h3>
            </motion.div>
          ))}
        </div>

            {/* Performance Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="themed-card rounded-lg p-6"
            >
              <h2 className="text-xl font-bold themed-text mb-4">Performance Overview</h2>
              <div className="h-64">
                {/* Add your chart component here */}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Calendar and Events */}
          <div className="space-y-6">
            {/* Calendar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="themed-card rounded-lg p-6"
            >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold themed-text">Calendar</h2>
            <div className="flex items-center space-x-2">
                  <button onClick={() => changeMonth(-1)} className="themed-icon-bg p-2 rounded-full">
                    <FaChevronLeft className="themed-icon" />
              </button>
              <span className="themed-text">
                {selectedMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </span>
                  <button onClick={() => changeMonth(1)} className="themed-icon-bg p-2 rounded-full">
                    <FaChevronRight className="themed-icon" />
              </button>
            </div>
          </div>
              
              <div className="grid grid-cols-7 gap-1 mb-2">
                {calendar.days.map(day => (
                  <div key={day} className="text-center text-sm themed-text-secondary">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {calendar.dates.map((week, weekIndex) => (
                  week.map((date, dateIndex) => (
                    <div
                      key={`${weekIndex}-${dateIndex}`}
                      className={`aspect-square flex items-center justify-center rounded-lg ${
                        date ? 'themed-text hover:themed-bg-elevated cursor-pointer' : ''
                      }`}
                    >
                      {date}
                    </div>
                  ))
                ))}
        </div>
            </motion.div>

            {/* Upcoming Events */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="themed-card rounded-lg p-6"
            >
          <h2 className="text-xl font-bold themed-text mb-4">Upcoming Events</h2>
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2"
                  >
                <div>
                      <p className="themed-text">{event.title}</p>
                  <p className="themed-text-secondary text-sm">{event.type}</p>
                </div>
                <span className="themed-text-secondary text-sm">{event.date}</span>
              </div>
            ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherHome;