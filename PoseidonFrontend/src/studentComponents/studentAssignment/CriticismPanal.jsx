import React from "react";

const CriticismsPanel = ({ criticisms }) => {
  if (!criticisms || criticisms.length === 0) {
    return <div style={{ padding: "20px" }}>No feedback available</div>;
  }

  return (
    <div style={{ padding: "20px", backgroundColor: "#f9f9f9", borderRadius: "10px" }}>
      <h2 style={{ color: "#2C3E50", marginBottom: "20px" }}>Criticisms/Feedback</h2>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {criticisms.map((criticism, index) => (
          <li
            key={index}
            style={{
              padding: "10px",
              margin: "10px 0",
              backgroundColor: "#fff",
              border: "1px solid #ddd",
              borderRadius: "5px",
            }}
          >
            {criticism}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CriticismsPanel;