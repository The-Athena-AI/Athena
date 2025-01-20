import React from 'react';

const ProgressTracker = ({ assignments }) => {
  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter(a => a.status === 'completed').length;
  const progressPercentage = (completedAssignments / totalAssignments) * 100;

  return (
    <div style={{ marginBottom: '20px', padding: '20px', backgroundColor: '#fff', borderRadius: '10px' }}>
      <h3>Your Progress</h3>
      <div style={{ 
        width: '100%', 
        height: '20px', 
        backgroundColor: '#eee',
        borderRadius: '10px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${progressPercentage}%`,
          height: '100%',
          backgroundColor: '#3498DB',
          transition: 'width 0.3s ease'
        }} />
      </div>
      <p>{completedAssignments} of {totalAssignments} assignments completed</p>
    </div>
  );
};

export default ProgressTracker; 