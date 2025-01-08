import React from 'react';
import { useClass } from '../contexts/ClassContext';
import { 
  FaChalkboardTeacher, 
  FaUserGraduate, 
  FaClipboardList,
  FaBell
} from 'react-icons/fa';

const TeacherHome = () => {
  const { userClasses, loading } = useClass();

  // Calculate total students across all classes
  const totalStudents = userClasses.reduce((total, classItem) => {
    return total + Object.keys(classItem.students || {}).length;
  }, 0);

  const stats = [
    {
      title: "Total Classes",
      value: userClasses.length,
      icon: <FaChalkboardTeacher className="text-blue-600" size={24} />,
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Students",
      value: totalStudents,
      icon: <FaUserGraduate className="text-green-600" size={24} />,
      bgColor: "bg-green-50",
    },
    {
      title: "Active Assignments",
      value: "5",
      icon: <FaClipboardList className="text-purple-600" size={24} />,
      bgColor: "bg-purple-50",
    }
  ];

  const recentActivities = [
    { type: "submission", text: "John Doe submitted Assignment 3", time: "2 hours ago" },
    { type: "joined", text: "New student joined Advanced Math", time: "5 hours ago" },
    { type: "deadline", text: "Assignment 2 deadline approaching", time: "1 day ago" },
    { type: "grade", text: "Graded 15 submissions for Quiz 1", time: "2 days ago" },
  ];

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Welcome back, Teacher</h1>
        <p className="text-gray-600">Here's what's happening in your classes</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className={`${stat.bgColor} rounded-xl p-6 flex items-center justify-between`}
          >
            <div>
              <h3 className="text-gray-600 font-medium mb-2">{stat.title}</h3>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Classes */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Your Classes</h2>
          {userClasses.length > 0 ? (
            <div className="space-y-4">
              {userClasses.slice(0, 4).map((classItem) => (
                <div
                  key={classItem.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h3 className="font-medium">{classItem.name}</h3>
                    <p className="text-sm text-gray-600">
                      {Object.keys(classItem.students || {}).length} Students
                    </p>
                  </div>
                  <button className="text-blue-600 text-sm hover:text-blue-800">
                    View Class →
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No classes created yet. Create your first class to get started.
            </p>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="mt-1">
                  <FaBell className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-800">{activity.text}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherHome; 