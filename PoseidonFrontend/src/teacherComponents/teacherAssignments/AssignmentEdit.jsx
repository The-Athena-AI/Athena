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
    { id: 2, name: 'Advanced Programming' },
  ]);

  useEffect(() => {
    // TODO: Fetch assignment data from backend
    // Mock data for now
    const fetchAssignment = async () => {
      try {
        // Simulate API call
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
    navigate('/teacher/assignments');
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
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Assignment</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Same form fields as AssignmentCreate */}
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

        {/* ... Other form fields ... */}
        
        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => navigate('/teacher/assignments')}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssignmentEdit; 