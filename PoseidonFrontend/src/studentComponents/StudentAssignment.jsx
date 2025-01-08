import React, { useState } from 'react'
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
    <div style={{ padding: '20px' }}>
      {selectedAssignment && (
        <button
          onClick={handleBack}
          style={{
            marginBottom: '20px',
            padding: '8px 16px',
            borderRadius: '5px',
            border: 'none',
            backgroundColor: '#34495e',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          ← Back to Assignments
        </button>
      )}

      {!selectedAssignment ? (
        <>
          {renderFilters()}
          <AssignmentList 
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