import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useClass } from '../contexts/ClassContext';
import AssignmentList from './studentAssignment/AssignmentList';
import AssignmentDetails from './studentAssignment/AssignmentDetails';
import GradingForm from './studentAssignment/GradingForm';
import CriticismsPanel from './studentAssignment/CriticismPanal';
import LectureNotes from './studentAssignment/LectureNotes';

const StudentAssignmentList = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [assignments, setAssignments] = useState([]);
  const { enrolledClasses, getClassAssignments } = useClass();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllAssignments = async () => {
      try {
        // Add demo assignment
        const demoAssignment = {
          id: 2,
          title: "Essay: Impact of AI in Education",
          description: "Write a 500-word essay discussing the potential impacts of Artificial Intelligence on modern education. Consider both positive and negative aspects, and provide specific examples.",
          dueDate: "2025-03-28T23:59",
          className: "Technology & Society",
          status: "pending",
          isDemo: true
        };

        const allAssignments = await Promise.all(
          enrolledClasses.map(async (classItem) => {
            const classAssignments = await getClassAssignments(classItem.id);
            return classAssignments.map(assignment => ({
              ...assignment,
              className: classItem.name,
              classId: classItem.id
            }));
          })
        );
        setAssignments([demoAssignment, ...allAssignments.flat()]);
      } catch (error) {
        console.error('Error fetching assignments:', error);
      }
    };

    fetchAllAssignments();
  }, [enrolledClasses, getClassAssignments]);

  const renderFilters = () => (
    <div className="mb-6 flex gap-4 items-center">
      <input
        type="text"
        placeholder="Search assignments..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-1 p-2 border rounded-lg"
      />
      <select 
        value={filterStatus} 
        onChange={(e) => setFilterStatus(e.target.value)}
        className="p-2 border rounded-lg"
      >
        <option value="all">All Assignments</option>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
      </select>
    </div>
  );

  return (
    <div className="p-6">
      {renderFilters()}
      <AssignmentList 
        assignments={assignments}
        onSelectAssignment={(assignment) => navigate(`${assignment.id}`)}
        filterStatus={filterStatus}
        searchTerm={searchTerm}
      />
    </div>
  );
};

const StudentAssignmentDetails = () => {
  const [gradingMode, setGradingMode] = useState(false);
  const navigate = useNavigate();

  const handleGradeSubmit = () => {
    setGradingMode(false);
    navigate('..');
  };

  return (
    <div className="p-6">
      <button
        onClick={() => navigate('..')}
        className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
      >
        <span>← Back to Assignments</span>
      </button>

      {!gradingMode ? (
        <AssignmentDetails
          assignment={{
            id: 2,
            title: "Essay: Impact of AI in Education",
            description: "Write a 500-word essay discussing the potential impacts of Artificial Intelligence on modern education. Consider both positive and negative aspects, and provide specific examples.",
            dueDate: "2025-03-28T23:59",
            className: "Technology & Society",
            status: "pending",
            isDemo: true
          }}
          onGrade={() => setGradingMode(true)}
        />
      ) : (
        <GradingForm
          assignment={{
            id: 2,
            title: "Essay: Impact of AI in Education",
            description: "Write a 500-word essay discussing the potential impacts of Artificial Intelligence on modern education. Consider both positive and negative aspects, and provide specific examples.",
            dueDate: "2024-03-28T23:59",
            className: "Technology & Society",
            status: "pending",
            isDemo: true
          }}
          onSubmit={handleGradeSubmit}
        />
      )}
    </div>
  );
};

const StudentAssignment = () => {
  return (
    <Routes>
      <Route path="" element={<StudentAssignmentList />} />
      <Route path=":id" element={<StudentAssignmentDetails />} />
    </Routes>
  );
};

export default StudentAssignment;