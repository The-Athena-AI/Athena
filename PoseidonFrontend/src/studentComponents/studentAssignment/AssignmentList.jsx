import React, { useState, useEffect } from "react";
import { fetchAssignments } from "./BackendAPI";

const AssignmentList = ({ onSelectAssignment, filterStatus, searchTerm }) => {
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAssignments = async () => {
      try {
        setIsLoading(true);
        const data = await fetchAssignments();
        setAssignments(data);
      } catch (err) {
        setError('Failed to load assignments');
      } finally {
        setIsLoading(false);
      }
    };
    loadAssignments();
  }, []);

  // Filter assignments based on search term and status
  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || assignment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) return <div>Loading assignments...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: "20px", backgroundColor: "#f9f9f9", borderRadius: "10px" }}>
      <h2 style={{ color: "#2C3E50", marginBottom: "20px" }}>Assignments</h2>
      {filteredAssignments.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#7f8c8d' }}>
          No assignments found
        </p>
      ) : (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {filteredAssignments.map((assignment) => (
            <li
              key={assignment.id}
              style={{
                padding: "10px",
                margin: "10px 0",
                backgroundColor: "#fff",
                border: "1px solid #ddd",
                borderRadius: "5px",
                cursor: "pointer",
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
              onClick={() => onSelectAssignment(assignment)}
            >
              <div>
                <span style={{ fontWeight: 'bold' }}>{assignment.title}</span>
                <span style={{ 
                  marginLeft: '10px', 
                  fontSize: '0.9em', 
                  color: assignment.status === 'completed' ? '#27ae60' : '#e74c3c' 
                }}>
                  ({assignment.status})
                </span>
              </div>
              <span style={{ fontSize: '0.9em', color: '#7f8c8d' }}>
                Due: {new Date(assignment.dueDate).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AssignmentList;