import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AssignmentCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    classId: '',
    points: 100,
    allowedFileTypes: [],
    instructions: '',
    aiGradingEnabled: false,
    aiGradingInstructions: ''
  });

  const [classes] = useState([
    { id: 1, name: 'Writing' }
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Mock submission - in real app this would connect to backend
    console.log('Submitting assignment:', formData);
    navigate('/teacher-dashboard/assignments');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-black min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-yellow-400">Create New Assignment</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-yellow-400">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 bg-gray-900 border border-gray-800 rounded-lg text-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-yellow-400">Class</label>
          <select
            name="classId"
            value={formData.classId}
            onChange={handleChange}
            className="w-full p-2 bg-gray-900 border border-gray-800 rounded-lg text-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            required
          >
            <option value="" className="bg-gray-900">Select a class</option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.id} className="bg-gray-900">{cls.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-yellow-400">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 bg-gray-900 border border-gray-800 rounded-lg text-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            rows="4"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-yellow-400">Due Date</label>
          <input
            type="datetime-local"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="w-full p-2 bg-gray-900 border border-gray-800 rounded-lg text-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-yellow-400">Points</label>
          <input
            type="number"
            name="points"
            value={formData.points}
            onChange={handleChange}
            className="w-full p-2 bg-gray-900 border border-gray-800 rounded-lg text-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            min="0"
            required
          />
        </div>

        <div>
          <label className="flex items-center space-x-2 text-yellow-400">
            <input
              type="checkbox"
              name="aiGradingEnabled"
              checked={formData.aiGradingEnabled}
              onChange={handleChange}
              className="rounded border-gray-800 text-yellow-400 focus:ring-yellow-400"
            />
            <span className="text-sm font-medium">Enable Athena Grading</span>
          </label>
        </div>

        {formData.aiGradingEnabled && (
          <div>
            <label className="block text-sm font-medium mb-1 text-yellow-400">
              Athena Grading Instructions
            </label>
            <textarea
              name="aiGradingInstructions"
              value={formData.aiGradingInstructions}
              onChange={handleChange}
              className="w-full p-2 bg-gray-900 border border-gray-800 rounded-lg text-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              rows="3"
              placeholder="Provide instructions for Athena grading..."
            />
          </div>
        )}

        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-yellow-400 text-black px-6 py-2 rounded-lg hover:bg-yellow-500 transition-colors font-medium"
          >
            Create Assignment
          </button>
          <button
            type="button"
            onClick={() => navigate('/teacher-dashboard/assignments')}
            className="bg-gray-800 text-yellow-400 px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssignmentCreate; 