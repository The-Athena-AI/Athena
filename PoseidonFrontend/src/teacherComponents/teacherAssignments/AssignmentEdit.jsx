import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const AssignmentEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
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
    { id: 2, name: 'Technology & Society' },
  ]);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        // Mock data for demo assignment
        if (id === '2') {
          const demoAssignment = {
            title: 'Essay: Impact of AI in Education',
            description: 'Write a 500-word essay discussing the potential impacts of Artificial Intelligence on modern education. Consider both positive and negative aspects, and provide specific examples.',
            dueDate: '2024-03-28T23:59',
            classId: '2',
            points: 100,
            aiGradingEnabled: true,
            aiGradingInstructions: 'Grade based on: 1) Understanding of AI concepts 2) Critical analysis 3) Clear examples 4) Writing quality'
          };
          setFormData(demoAssignment);
        } else {
          // Regular mock assignment
          const mockAssignment = {
            title: 'Example Assignment',
            description: 'This is an example assignment',
            dueDate: '2024-04-01T23:59',
            classId: '1',
            points: 100,
            aiGradingEnabled: true,
            aiGradingInstructions: 'Grade based on clarity and completeness'
          };
          setFormData(mockAssignment);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching assignment:', error);
        setLoading(false);
      }
    };

    fetchAssignment();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Submit updates to backend
    console.log('Updating assignment:', formData);
    navigate('..');  // Navigate back to assignment detail
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-2xl mx-auto bg-gray-900 rounded-lg border border-gray-800 p-8">
        <h1 className="text-2xl font-bold mb-6 text-yellow-400">Edit Assignment</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-yellow-400">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 bg-black border border-gray-800 rounded-lg text-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-yellow-400">Class</label>
            <select
              name="classId"
              value={formData.classId}
              onChange={handleChange}
              className="w-full p-3 bg-black border border-gray-800 rounded-lg text-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              required
            >
              <option value="" className="bg-black">Select a class</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id} className="bg-black">{cls.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-yellow-400">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 bg-black border border-gray-800 rounded-lg text-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              rows="4"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-yellow-400">Due Date</label>
            <input
              type="datetime-local"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full p-3 bg-black border border-gray-800 rounded-lg text-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-yellow-400">Points</label>
            <input
              type="number"
              name="points"
              value={formData.points}
              onChange={handleChange}
              className="w-full p-3 bg-black border border-gray-800 rounded-lg text-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
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
                className="w-4 h-4 text-yellow-400 border-gray-800 rounded focus:ring-yellow-400 focus:ring-offset-black"
              />
              <span className="text-sm font-medium text-yellow-400">Enable Athena Grading</span>
            </label>
          </div>

          {formData.aiGradingEnabled && (
            <div>
              <label className="block text-sm font-medium mb-2 text-yellow-400">
                Athena Grading Instructions
              </label>
              <textarea
                name="aiGradingInstructions"
                value={formData.aiGradingInstructions}
                onChange={handleChange}
                className="w-full p-3 bg-black border border-gray-800 rounded-lg text-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                rows="3"
                placeholder="Provide instructions for AI grading..."
              />
            </div>
          )}

          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-yellow-400 text-black px-6 py-2 rounded-lg hover:bg-yellow-500 transition-colors"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => navigate('..')}
              className="bg-gray-800 text-yellow-400 px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignmentEdit; 