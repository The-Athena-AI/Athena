import React from 'react';

const MessagesPanel = () => {
  return (
    <div className="messages-panel" style={{ backgroundColor: '#ECF0F1', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
      <h2>Messages</h2>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {['Mayowa Ade: First Chapter of Project.doc', 'Olawuyi Tobi: Can you check the formulas in these images?', 'Joshua Ashiru: You are yet to submit your assignment.'].map((message) => (
          <li key={message} style={{ margin: '10px 0' }}>{message}</li>
        ))}
      </ul>
    </div>
  );
};

export default MessagesPanel;