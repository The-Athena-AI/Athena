import React, { useState } from 'react';
import { useClass } from '../contexts/ClassContext';

const ManageClass = ({ classData, onClose }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    dueDate: '',
    points: 100
  });

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    try {
      // Add assignment creation logic here
      // This will be connected to the assignments collection in Firestore
      console.log('Creating assignment for class:', classData.id);
    } catch (error) {
      console.error('Error creating assignment:', error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{classData.name}</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ×
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b mb-6">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-2 px-4 ${
              activeTab === 'details'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500'
            }`}
          >
            Class Details
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`py-2 px-4 ${
              activeTab === 'students'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500'
            }`}
          >
            Students
          </button>
          <button
            onClick={() => setActiveTab('assignments')}
            className={`py-2 px-4 ${
              activeTab === 'assignments'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500'
            }`}
          >
            Assignments
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'details' && (
        <div>
          <p className="mb-4">
            <span className="font-semibold">Class Code:</span> {classData.code}
          </p>
          <p className="mb-4">
            <span className="font-semibold">Created:</span>{' '}
            {new Date(classData.createdAt).toLocaleDateString()}
          </p>
        </div>
      )}

      {activeTab === 'students' && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Enrolled Students</h3>
          {Object.entries(classData.students || {}).map(([studentId, student]) => (
            <div
              key={studentId}
              className="p-3 border-b last:border-b-0 flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{student.email}</p>
                <p className="text-sm text-gray-500">
                  Joined: {new Date(student.joinedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'assignments' && (
        <div>
          <form onSubmit={handleCreateAssignment} className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Create New Assignment</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  value={newAssignment.title}
                  onChange={(e) =>
                    setNewAssignment({ ...newAssignment, title: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={newAssignment.description}
                  onChange={(e) =>
                    setNewAssignment({
                      ...newAssignment,
                      description: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows="3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Due Date
                </label>
                <input
                  type="datetime-local"
                  value={newAssignment.dueDate}
                  onChange={(e) =>
                    setNewAssignment({ ...newAssignment, dueDate: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Create Assignment
              </button>
            </div>
          </form>

          {/* List of existing assignments */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Existing Assignments</h3>
            {/* Add assignment list here */}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageClass; 