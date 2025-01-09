import React, { useState, useEffect } from 'react';
import { useClass } from '../contexts/ClassContext';
import AssignmentList from './studentAssignment/AssignmentList';
import AssignmentDetails from './studentAssignment/AssignmentDetails';
import GradingForm from './studentAssignment/GradingForm';
import CriticismsPanel from './studentAssignment/CriticismPanal';
import LectureNotes from './studentAssignment/LectureNotes';

const StudentAssignment = () => {
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [gradingMode, setGradingMode] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [assignments, setAssignments] = useState([]);
  const { enrolledClasses, getClassAssignments } = useClass();

  useEffect(() => {
    const fetchAllAssignments = async () => {
      try {
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
        setAssignments(allAssignments.flat());
      } catch (error) {
        console.error('Error fetching assignments:', error);
      }
    };

    if (enrolledClasses.length > 0) {
      fetchAllAssignments();
    }
  }, [enrolledClasses]);

  const handleGradeSubmit = () => {
    setGradingMode(false);
    // Refresh data or show success message
  };

  const handleBack = () => {
    setSelectedAssignment(null);
    setGradingMode(false);
  };

  const renderFilters = () => (
    <div style={{ 
      marginBottom: '20px',
      display: 'flex',
      gap: '10px',
      alignItems: 'center'
    }}>
      <input
        type="text"
        placeholder="Search assignments..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ 
          padding: '8px',
          borderRadius: '5px',
          border: '1px solid #ddd',
          flex: 1
        }}
      />
      <select 
        value={filterStatus} 
        onChange={(e) => setFilterStatus(e.target.value)}
        style={{
          padding: '8px',
          borderRadius: '5px',
          border: '1px solid #ddd'
        }}
      >
        <option value="all">All Assignments</option>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
      </select>
    </div>
  );

  return (
    <div className="p-6">
      {selectedAssignment && (
        <button
          onClick={handleBack}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
        >
          <span>← Back to Assignments</span>
        </button>
      )}

      {!selectedAssignment ? (
        <>
          {renderFilters()}
          <AssignmentList 
            assignments={assignments}
            onSelectAssignment={setSelectedAssignment} 
            filterStatus={filterStatus}
            searchTerm={searchTerm}
          />
        </>
      ) : (
        <div>
          {!gradingMode ? (
            <AssignmentDetails
              assignment={selectedAssignment}
              onGrade={() => setGradingMode(true)}
            />
          ) : (
            <GradingForm
              assignment={selectedAssignment}
              onSubmit={handleGradeSubmit}
            />
          )}
          <CriticismsPanel criticisms={selectedAssignment.criticisms} />
          <LectureNotes notes={selectedAssignment.lectureNotes} />
        </div>
      )}
    </div>
  );
};

export default StudentAssignment;