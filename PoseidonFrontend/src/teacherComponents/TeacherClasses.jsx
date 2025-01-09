import React, { useState } from 'react';
import { useClass } from '../contexts/ClassContext';
import { FaChalkboard, FaCopy, FaPlus } from 'react-icons/fa';
import ManageClass from './ManageClass';

const TeacherClasses = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [className, setClassName] = useState('');
  const { userClasses, createClass, loading } = useClass();

  const handleCreateClass = async (e) => {
    e.preventDefault();
    try {
      const classCode = await createClass(className);
      alert(`Class created successfully! Class code: ${classCode}`);
      setClassName('');
      setShowCreateModal(false);
    } catch (error) {
      alert('Error creating class: ' + error.message);
    }
  };

  const copyClassCode = (code) => {
    navigator.clipboard.writeText(code);
    alert('Class code copied to clipboard!');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Classes</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaPlus />
          Create New Class
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : userClasses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userClasses.map((classItem) => (
            <div
              key={classItem.id}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{classItem.name}</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Students: {Object.keys(classItem.students || {}).length}
                  </p>
                </div>
                <button
                  onClick={() => copyClassCode(classItem.code)}
                  className="text-gray-500 hover:text-blue-600 p-2"
                  title="Copy class code"
                >
                  <FaCopy />
                </button>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <p className="text-sm text-gray-600">Class Code:</p>
                <p className="text-lg font-mono font-semibold">{classItem.code}</p>
              </div>

              <button 
                className="w-full mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                onClick={() => setSelectedClass(classItem)}
              >
                Manage Class →
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl">
          <FaChalkboard className="mx-auto text-4xl text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-600 mb-2">No Classes Yet</h3>
          <p className="text-gray-500">Create your first class to get started</p>
        </div>
      )}

      {/* Create Class Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Class</h2>
            <form onSubmit={handleCreateClass}>
              <input
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="Enter class name"
                className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Create Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage Class Modal */}
      {selectedClass && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-4xl m-4 max-h-[90vh] overflow-y-auto">
            <ManageClass 
              classData={selectedClass} 
              onClose={() => setSelectedClass(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherClasses; 