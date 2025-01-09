import React, { useState, useEffect } from 'react';
import { useClass } from '../contexts/ClassContext';
import { FaChalkboardTeacher, FaUserGraduate } from 'react-icons/fa';

const StudentClasses = () => {
  const [classCode, setClassCode] = useState('');
  const { enrolledClasses, joinClass, loading, fetchUserClasses } = useClass();

  // Add useEffect to fetch classes when component mounts
  useEffect(() => {
    fetchUserClasses();
  }, []);

  const handleJoinClass = async (e) => {
    e.preventDefault();
    try {
      await joinClass(classCode.toUpperCase());
      setClassCode('');
      alert('Successfully joined the class!');
      // Fetch classes again after joining
      await fetchUserClasses();
    } catch (error) {
      alert('Error joining class: ' + error.message);
    }
  };

  console.log('Enrolled Classes:', enrolledClasses); // Add this for debugging

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Classes</h1>

      {/* Join Class Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <FaChalkboardTeacher className="text-blue-600 text-xl" />
          </div>
          <h2 className="text-xl font-semibold">Join a Class</h2>
        </div>
        <form onSubmit={handleJoinClass} className="flex gap-4">
          <input
            type="text"
            value={classCode}
            onChange={(e) => setClassCode(e.target.value)}
            placeholder="Enter class code"
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Join Class
          </button>
        </form>
      </div>

      {/* Enrolled Classes Section */}
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : enrolledClasses && enrolledClasses.length > 0 ? (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <FaUserGraduate className="text-gray-600 text-xl" />
            <h2 className="text-xl font-semibold">Enrolled Classes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledClasses.map((classItem) => (
              <div
                key={classItem.id}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold mb-3">{classItem.name}</h3>
                <div className="text-sm text-gray-600">
                  <p>Teacher: {classItem.teacherEmail}</p>
                  <p className="mt-2">
                    Students: {Object.keys(classItem.students || {}).length}
                  </p>
                </div>
                <button 
                  className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  onClick={() => {/* Add navigation to class detail view */}}
                >
                  View Class →
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-600">
          You haven't joined any classes yet.
        </div>
      )}
    </div>
  );
};

export default StudentClasses; 