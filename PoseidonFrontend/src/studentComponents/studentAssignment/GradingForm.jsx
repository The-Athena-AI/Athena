import React, { useState } from "react";
import FileUpload from "./FileUpload";
import axios from "axios";

const GradingForm = ({ onSubmit }) => {
  const [submissionText, setSubmissionText] = useState("");
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("");
  const [aiInstruction, setAiInstruction] = useState("");

  const handleSubmit = async () => {
    try {
      setIsProcessing(true);
      setError(null);

      if (!submissionText && files.length === 0) {
        throw new Error('Please provide either text or file submission');
      }

      const formData = new FormData();
      files.forEach(file => formData.append('file', file));
      formData.append('text', submissionText);
      formData.append('category', category);
      formData.append('instruction', aiInstruction);

      const response = await axios.post('https://0307-2603-7000-b13e-185b-95c1-ff83-ce2e-c671.ngrok-free.app/grade', 
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setAiResponse(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Grading failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ color: '#2C3E50', marginBottom: '20px' }}>
        AI Assignment Grading
      </h2>

      {error && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#FADBD8', 
          color: '#C0392B',
          borderRadius: '5px',
          marginBottom: '20px' 
        }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '10px', color: '#2C3E50' }}>
          Select Subject
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #BDC3C7',
            marginBottom: '20px'
          }}
        >
          <option value="">--Select--</option>
          <option value="essay">Essay</option>
          <option value="chemistry">Chemistry</option>
          <option value="physics">Physics</option>
          <option value="math">Math</option>
          <option value="code">Code</option>
        </select>

        <label style={{ display: 'block', marginBottom: '10px', color: '#2C3E50' }}>
          AI Instructions
        </label>
        <input
          type="text"
          value={aiInstruction}
          onChange={(e) => setAiInstruction(e.target.value)}
          placeholder="Instructions for AI"
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #BDC3C7',
            marginBottom: '20px'
          }}
        />

        <label style={{ display: 'block', marginBottom: '10px', color: '#2C3E50' }}>
          Text Submission
        </label>
        <textarea
          placeholder="Enter or paste the submission text here..."
          value={submissionText}
          onChange={(e) => setSubmissionText(e.target.value)}
          style={{
            width: '100%',
            minHeight: '200px',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #BDC3C7',
            marginBottom: '20px'
          }}
        />

        <label style={{ display: 'block', marginBottom: '10px', color: '#2C3E50' }}>
          File Submission
        </label>
        <FileUpload
          onFileSelect={setFiles}
          acceptedFileTypes=".pdf, .doc, .docx, .txt, .png, .jpg, .jpeg"
          maxFileSizeMB={10}
        />

        <button
          onClick={handleSubmit}
          disabled={isProcessing || (!submissionText && files.length === 0)}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: isProcessing ? '#95A5A6' : '#3498DB',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: isProcessing ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.3s ease'
          }}
        >
          {isProcessing ? 'Processing...' : 'Grade Assignment'}
        </button>
      </div>

      {aiResponse && (
        <div style={{
          backgroundColor: '#F8F9F9',
          padding: '20px',
          borderRadius: '5px',
          border: '1px solid #E5E7E9'
        }}>
          <h3 style={{ color: '#2C3E50', marginBottom: '15px' }}>AI Grading Results</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <p>{aiResponse.grading_result}</p>
          </div>
{/* 
          <button
            onClick={() => onSubmit(aiResponse)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#27AE60',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Accept and Submit Grade
          </button> */}
        </div>
      )}
    </div>
  );
};

export default GradingForm;