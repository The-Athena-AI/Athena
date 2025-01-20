import React from "react";
import { FaClock, FaBookReader, FaClipboardCheck, FaChalkboardTeacher } from 'react-icons/fa';

const UpcomingActivities = () => {
  const activities = [
    { icon: <FaBookReader />, name: 'Life Contingency Tutorials', time: '2:00 PM' },
    { icon: <FaClipboardCheck />, name: 'Social Insurance Test', time: '4:30 PM' },
    { icon: <FaBookReader />, name: 'Advanced Maths Assignment', time: 'Tomorrow' },
    { icon: <FaChalkboardTeacher />, name: "Dr. Dipo's Tutorial Class", time: 'Friday' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Upcoming Activities</h2>
        <FaClock className="text-gray-400" />
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div 
            key={activity.name}
            className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              {activity.icon}
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-sm font-medium text-gray-800">{activity.name}</h3>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingActivities;