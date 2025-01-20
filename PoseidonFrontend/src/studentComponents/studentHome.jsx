import React from 'react';
import { useUserAuth } from '../context/UserAuthContext';
import { useClass } from '../contexts/ClassContext';
import Calendar from './studentHomeComponents/Calendar';
import MasteryProgress from './studentHomeComponents/MasteryProgress';
import MessagesPanel from './studentHomeComponents/MessagesPanel';

const StudentHome = () => {

  const { user } = useUserAuth();
  const { enrolledClasses, loading } = useClass();

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back, {user?.displayName || 'Student'}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's an overview of your academic progress
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Enrolled Classes Overview */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Your Classes</h2>
            {loading ? (
              <p>Loading classes...</p>
            ) : enrolledClasses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {enrolledClasses.map((classItem) => (
                  <div
                    key={classItem.id}
                    className="border rounded-lg p-4 hover:border-blue-500 transition-colors"
                  >
                    <h3 className="font-medium text-lg">{classItem.name}</h3>
                    <p className="text-sm text-gray-600">
                      Teacher: {classItem.teacherEmail}
                    </p>
                    <div className="mt-2 text-sm text-gray-500">
                      {Object.keys(classItem.students || {}).length} Students
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                You haven't joined any classes yet.
              </p>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {/* Add recent activities here */}
              <p className="text-gray-500">No recent activity</p>
            </div>
          </div>
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          {/* Calendar Component */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <Calendar />
          </div>

          {/* Progress Component */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <MasteryProgress />
          </div>

          {/* Messages Component */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <MessagesPanel />
          </div>
        </div>
      </div>
    </div>
  );
};


export default StudentHome;