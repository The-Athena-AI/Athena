import React from 'react';

const TopPerformingStudents = () => {
  return (
    <div className="top-performing-students" style={{ backgroundColor: '#ECF0F1', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
      <h2>Top Performing Students</h2>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {['Joshua Ashiru: 9.6/10', 'Adeola Ayo: 9/10', 'Olawuyi Tobi: 8.5/10', 'Mayowa Ade: 7/10'].map((student) => (
          <li key={student} style={{ margin: '10px 0' }}>{student}</li>
        ))}
      </ul>
    </div>
  );
};

export default TopPerformingStudents;