import React from "react";

const AssignmentDetails = ({ assignment, onGrade }) => {
  if (!assignment)
    return <div style={{ padding: "20px" }}>Select an assignment to view details</div>;
  const getDueStatusColor = () => {
    if (assignment.status === 'completed') return '#27AE60';
    const dueDate = new Date(assignment.dueDate);
    const now = new Date();
    return dueDate < now ? '#E74C3C' : '#F1C40F';
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#f4f4f4", borderRadius: "10px" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: "#34495E" }}>{assignment.title}</h2>
        <span style={{ 
          padding: '5px 10px', 
          borderRadius: '15px', 
          backgroundColor: getDueStatusColor(),
          color: 'white' 
        }}>
          {assignment.status === 'completed' ? 'Completed' : `Due: ${new Date(assignment.dueDate).toLocaleDateString()}`}
        </span>
      </div>
      <p style={{ marginBottom: "20px" }}>{assignment.description}</p>
      {assignment.attachments && (
        <div style={{ marginBottom: "20px" }}>
          <h3>Attachments</h3>
          <ul>
            {assignment.attachments.map((attachment, index) => (
              <li key={index}>
                <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                  {attachment.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <button
        style={{
          padding: "10px 20px",
          backgroundColor: "#3498DB",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        onClick={onGrade}
      >
        Grade Assignment
      </button>
    </div>
  );
};

export default AssignmentDetails;