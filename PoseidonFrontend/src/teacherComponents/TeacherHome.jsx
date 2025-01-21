import React, { useState } from 'react';
import { useClass } from '../contexts/ClassContext';
import AthenaImage from '../images/PerfectAthenaPhotoUpdated2.png';
import { 
  FaSearch, 
  FaBell,
  FaChevronRight,
  FaChevronLeft,
  FaChevronDown,
  FaMapMarkerAlt,
  FaClock,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const TeacherHome = () => {
  const { userClasses, loading } = useClass();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('JULY 2021');
  const [profileImage, setProfileImage] = useState(null);
  const [welcomeImage, setWelcomeImage] = useState(null);
  const profileInputRef = React.useRef({AthenaImage});
  const welcomeInputRef = React.useRef({AthenaImage});

  const handleProfileImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWelcomeImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setWelcomeImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const calendar = {
    days: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    dates: [
      [null, null, null, 1, 2, 3, 4],
      [5, 6, 7, 8, 9, 10, 11],
      [12, 13, 14, 15, 16, 17, 18],
      [19, 20, 21, 22, 23, 24, 25],
      [26, 27, 28, 29, 30, 31, null]
    ],
    events: {
      8: { type: 'tutorial', color: 'bg-blue-500' },
      13: { type: 'test', color: 'bg-pink-500' },
      18: { type: 'assignment', color: 'bg-green-500' },
      23: { type: 'tutorial', color: 'bg-orange-500' }
    }
  };

  const upcomingActivities = [
    {
      date: 8,
      month: 'July',
      year: '2021',
      time: '8.A.M - 9.A.M',
      title: 'Life Contingency Tutorials',
      location: 'Edulog Tutorial College, Blk 56, Lagos State.',
      color: 'bg-blue-500'
    },
    {
      date: 13,
      month: 'July',
      year: '2021',
      time: '8.A.M - 9.A.M',
      title: 'Social Insurance Test',
      location: 'School Hall, University Road, Lagos State',
      color: 'bg-pink-500'
    },
    {
      date: 18,
      month: 'July',
      year: '2021',
      time: '8.A.M - 9.A.M',
      title: 'Adv. Maths Assignment Due',
      location: '**To be submitted via Email',
      color: 'bg-green-500'
    },
    {
      date: 23,
      month: 'July',
      year: '2021',
      time: '10.A.M - 1.P.M',
      title: "Dr. Dipo's Tutorial Class",
      location: 'Edulog Tutorial College, Blk 56, Lagos State.',
      color: 'bg-orange-500'
    }
  ];

  const topStudents = [
    { id: 'JA', name: 'Joshua Ashiru', points: '9.6/10', color: 'bg-yellow-400' },
    { id: 'AA', name: 'Adeola Ayo', points: '9/10', color: 'bg-blue-500' },
    { id: 'OT', name: 'Olawuyi Tobi', points: '8.5/10', color: 'bg-orange-400' },
    { id: 'MA', name: 'Mayowa Ade', points: '7/10', color: 'bg-red-400' }
  ];

  const studentProgress = {
    percentage: 72,
    assignment: 'Trigonometric Homework 3'
  };

  const performanceData = {
    labels: ['1', '2', '3', '4'],
    datasets: [
      {
        label: 'Student Average',
        data: [2.8, 1.9, 2.0, 3.5, 2.0],
        fill: true,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        min: 0,
        max: 8,
        ticks: {
          stepSize: 1
        }
      }
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6,
      }
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black" style={{ height: '100%', width: '105%' }}>
      {/* Top Search Bar */}
      <div className="bg-gray-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-2xl">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-400" />
              <input
                type="text"
                placeholder="Search Courses, Documents, Activities..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-black border border-gray-800 text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent placeholder-gray-600"
              />
            </div>
            <div className="flex items-center gap-6">
              <button className="p-2 relative hover:bg-gray-800 rounded-full transition-colors duration-200">
                <FaBell className="text-yellow-400 text-xl" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
              </button>
              <button 
                className="w-14 h-7 rounded-full bg-gray-200 flex items-center transition-all duration-300 focus:outline-none shadow-inner p-1"
                onClick={() => setIsDarkMode(!isDarkMode)}
              >
                <span className={`w-5 h-5 rounded-full transform transition-transform duration-300 shadow-md ${isDarkMode ? 'translate-x-7 bg-blue-500' : 'translate-x-0 bg-white'}`}></span>
              </button>
              <div className="flex items-center gap-3 border-l border-gray-800 pl-6">
                <input
                  type="file"
                  ref={profileInputRef}
                  onChange={handleProfileImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button 
                  onClick={() => profileInputRef.current.click()}
                  className="relative group"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-yellow-400 ring-offset-2 ring-offset-black">
                    {profileImage ? (
                      <img src={profileImage} alt="User Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center text-black text-lg font-semibold">
                        AT
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 rounded-full bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-200 flex items-center justify-center">
                    <span className="text-white text-xs opacity-0 group-hover:opacity-100">Edit</span>
                  </div>
                </button>
                <div>
                  <span className="font-semibold text-yellow-400">Athena</span>
                  <p className="text-xs text-yellow-400/70">Professor</p>
                </div>
                <FaChevronDown className="text-yellow-400 ml-2 cursor-pointer hover:text-yellow-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="col-span-9">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl p-6 mb-6 text-black relative overflow-hidden shadow-lg">
              <div className="relative z-10 flex items-center gap-6">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold mb-2">Welcome back, Athena 👋</h1>
                  <p className="text-black/80">
                    The students have a <span className="font-semibold text-black">{studentProgress.percentage}%</span> mastery on {studentProgress.assignment}
                  </p>
                </div>
                <div className="relative">
                  <input
                    type="file"
                    ref={welcomeInputRef}
                    onChange={handleWelcomeImageUpload}
                    accept="image/*"
                    className="hidden"
                    id="welcome-image-upload"
                  />
                  <label 
                    htmlFor="welcome-image-upload"
                    className="cursor-pointer group block"
                  >
                    <div className="w-24 h-24 rounded-xl overflow-hidden ring-2 ring-white/30 hover:ring-white/50 transition-all duration-200">
                      {welcomeImage ? (
                        <img 
                          src={welcomeImage} 
                          alt="Welcome" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-white/10 backdrop-blur-sm flex flex-col items-center justify-center">
                          <svg className="w-8 h-8 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-xs text-white/70 mt-1">Upload Photo</span>
                        </div>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl flex items-center justify-center">
                      <span className="text-white text-xs">Change Photo</span>
                    </div>
                  </label>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            </div>

            {/* Student Averages and Student Mastery side by side */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Performance Graph */}
              <div className="bg-gray-900 rounded-xl p-4" style={{ height: '350px' }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-yellow-400">Student Averages</h2>
                  <select className="text-sm border rounded-lg px-2 py-1 bg-black text-yellow-400 border-gray-800">
                    <option>Average</option>
                  </select>
                </div>
                <div style={{ height: '250px' }}>
                  <Line data={performanceData} options={chartOptions} />
                </div>
              </div>

              {/* Student Mastery */}
              <div className="bg-gray-900 rounded-2xl p-4" style={{ height: '350px' }}>
                <h2 className="text-lg font-semibold mb-3 text-yellow-400">Student Mastery</h2>
                <div className="max-h-60 overflow-y-auto pr-2">
                  <div className="space-y-2">
                    {[
                      { title: 'Homework 3', subtitle: 'Trigonometric', percentage: 73 },
                      { title: 'Social Insurance', subtitle: 'Chapter 4', percentage: 91 },
                      { title: 'Advanced Maths', subtitle: 'Module 2', percentage: 25 },
                      { title: 'Statistics', subtitle: 'Chapter 2', percentage: 85 },
                      { title: 'Calculus', subtitle: 'Module 1', percentage: 68 }
                    ].map((item, index) => (
                      <div key={index} className="bg-black p-3 rounded-lg flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-sm text-yellow-400">{item.title}</h3>
                          <p className="text-xs text-yellow-400/70">{item.subtitle}</p>
                        </div>
                        <div className="w-12 h-12 relative flex-shrink-0">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="24" cy="24" r="20" stroke="#1F2937" strokeWidth="6" fill="none" />
                            <circle
                              cx="24"
                              cy="24"
                              r="20"
                              stroke="#FBBF24"
                              strokeWidth="6"
                              fill="none"
                              strokeDasharray={`${2 * Math.PI * 20}`}
                              strokeDashoffset={`${2 * Math.PI * 20 * (1 - item.percentage / 100)}`}
                            />
                          </svg>
                          <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-yellow-400">
                            {item.percentage}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Messages and Top Performing Students side by side */}
            <div className="grid grid-cols-2 gap-4">
              {/* Messages Section */}
              <div className="bg-gray-900 rounded-xl p-6 shadow-lg" style={{ height: '350px' }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">Messages</h2>
                  <button className="text-yellow-400 hover:text-yellow-500 text-sm font-medium transition-colors duration-200">View All</button>
                </div>
                <div className="max-h-[270px] overflow-y-auto pr-2 custom-scrollbar">
                  <div className="space-y-3">
                    {[
                      { 
                        sender: 'John Smith', 
                        message: 'Submitted the assignment for review. Please check when you have time.', 
                        time: '2 hours ago',
                        avatar: 'JS',
                        status: 'online',
                        isUnread: true
                      },
                      { 
                        sender: 'Sarah Johnson', 
                        message: 'I have a question about the homework problem #3. Can we discuss?', 
                        time: '3 hours ago',
                        avatar: 'SJ',
                        status: 'offline',
                        isUnread: true
                      },
                      { 
                        sender: 'Mike Williams', 
                        message: 'Class has been rescheduled to next Monday due to the conference.', 
                        time: '5 hours ago',
                        avatar: 'MW',
                        status: 'online',
                        isUnread: false
                      },
                      { 
                        sender: 'Emma Davis', 
                        message: 'Project update: Team 3 has completed their presentation slides.', 
                        time: 'Yesterday',
                        avatar: 'ED',
                        status: 'offline',
                        isUnread: false
                      }
                    ].map((msg, index) => (
                      <div 
                        key={index} 
                        className={`bg-black p-4 rounded-xl hover:shadow-md transition-all duration-200 border-l-4 ${msg.isUnread ? 'border-yellow-400' : 'border-transparent'}`}
                      >
                        <div className="flex gap-3">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center text-black font-medium flex-shrink-0">
                              {msg.avatar}
                            </div>
                            <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 border-2 border-black rounded-full ${msg.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-yellow-400 truncate">{msg.sender}</span>
                                {msg.isUnread && (
                                  <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                                )}
                              </div>
                              <span className="text-xs text-yellow-400/70 whitespace-nowrap ml-2">{msg.time}</span>
                            </div>
                            <p className="text-sm text-yellow-400/80 line-clamp-2">{msg.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top Performing Students */}
              <div className="bg-gray-900 rounded-xl p-4" style={{ height: '350px' }}>
                <h2 className="text-lg font-semibold mb-3 text-yellow-400">Top Performing Students</h2>
                <div className="max-h-60 overflow-y-auto pr-2">
                  <div className="space-y-2">
                    {topStudents.map((student, index) => (
                      <div
                        key={student.id}
                        className="flex items-center justify-between p-3 bg-black rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center text-black text-sm font-medium">
                            {student.id}
                          </div>
                          <span className="font-medium text-sm text-yellow-400">{student.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium text-yellow-400">{student.points}</span>
                          {index === 0 && <span className="text-lg">🏆</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-span-3">
            <div className="bg-gray-900 rounded-xl p-6" style={{ minHeight: '855px', width: '115%'}}>
              <div className="space-y-6" style={{ minHeight: '550px'}}>
                {/* Calendar - Made Smaller */}
                <div className="pb-6 border-b border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-yellow-400">Calendar</h2>
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-black rounded">
                        <FaChevronLeft className="text-yellow-400 text-sm" />
                      </button>
                      <span className="text-sm font-medium text-yellow-400">{selectedMonth}</span>
                      <button className="p-1 hover:bg-black rounded">
                        <FaChevronRight className="text-yellow-400 text-sm" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="grid grid-cols-7 gap-1 mb-1">
                      {calendar.days.map(day => (
                        <div key={day} className="text-center text-xs font-medium text-yellow-400/70">
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {calendar.dates.flat().map((date, index) => (
                        <div key={index} className="aspect-w-1 aspect-h-1">
                          {date && (
                            <button
                              className={`w-full h-full flex items-center justify-center rounded-lg text-xs relative
                                ${calendar.events[date] ? calendar.events[date].color : 'hover:bg-black text-yellow-400'}`}
                            >
                              {date}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Upcoming Activities */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-yellow-400">Upcoming Activities</h2>
                    <button className="text-yellow-400 text-xs hover:text-yellow-500">See all</button>
                  </div>
                  <div className="space-y-3">
                    {upcomingActivities.map((activity, index) => (
                      <div key={index} className="relative bg-black rounded-lg p-3">
                        <div className={`absolute left-0 top-0 w-1 h-full ${activity.color} rounded-full`}></div>
                        <div className="pl-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-yellow-400">{activity.title}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-yellow-400/70 mb-1">
                            <FaClock size={10} className="text-yellow-400" />
                            <span>{activity.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-yellow-400/70">
                            <FaMapMarkerAlt size={10} className="text-yellow-400" />
                            <span>{activity.location}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherHome; 