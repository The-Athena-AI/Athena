import React, { useState } from 'react';

const AssignmentCreate = ({ onComplete }) => {
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
    { id: 1, name: 'Web Development 101' },
    { id: 2, name: 'Advanced Programming' },
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Submit to backend
    console.log('Submitting assignment:', formData);
    onComplete();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Assignment</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Class</label>
          <select
            name="classId"
            value={formData.classId}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select a class</option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>{cls.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="4"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Due Date</label>
          <input
            type="datetime-local"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Points</label>
          <input
            type="number"
            name="points"
            value={formData.points}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            min="0"
            required
          />
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="aiGradingEnabled"
              checked={formData.aiGradingEnabled}
              onChange={handleChange}
            />
            <span className="text-sm font-medium">Enable AI Grading</span>
          </label>
        </div>

        {formData.aiGradingEnabled && (
          <div>
            <label className="block text-sm font-medium mb-1">
              AI Grading Instructions
            </label>
            <textarea
              name="aiGradingInstructions"
              value={formData.aiGradingInstructions}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows="3"
              placeholder="Provide instructions for AI grading..."
            />
          </div>
        )}

        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create Assignment
          </button>
          <button
            type="button"
            onClick={onComplete}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssignmentCreate; 