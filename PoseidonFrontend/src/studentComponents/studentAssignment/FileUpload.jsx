import React, { useState, useRef } from 'react';

const FileUpload = ({ onFileSelect, acceptedFileTypes = '.pdf,.doc,.docx,.txt', maxFileSizeMB = 10 }) => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const validateFile = (file) => {
    // Size validation
    if (file.size > maxFileSizeMB * 1024 * 1024) {
      setError(`File size must be less than ${maxFileSizeMB}MB`);
      return false;
    }

    // Type validation
    const fileType = file.name.split('.').pop().toLowerCase();
    const acceptedTypes = acceptedFileTypes
      .split(',')
      .map(type => type.replace('.', '').trim());
    
    if (!acceptedTypes.includes(fileType)) {
      setError(`Accepted file types: ${acceptedFileTypes}`);
      return false;
    }

    return true;
  };

  const handleFiles = (newFiles) => {
    setError('');
    const validFiles = Array.from(newFiles).filter(validateFile);
    
    if (validFiles.length > 0) {
      const updatedFiles = [...files, ...validFiles];
      setFiles(updatedFiles);
      onFileSelect(updatedFiles); // Pass files to parent component
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (fileToRemove) => {
    const updatedFiles = files.filter(file => file !== fileToRemove);
    setFiles(updatedFiles);
    onFileSelect(updatedFiles);
  };

  return (
    <div className="file-upload-container">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragActive ? '#3498DB' : '#ccc'}`,
          borderRadius: '10px',
          padding: '20px',
          textAlign: 'center',
          backgroundColor: dragActive ? '#f7f9fc' : '#fff',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        onClick={() => inputRef.current.click()}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={acceptedFileTypes}
          onChange={(e) => handleFiles(e.target.files)}
          style={{ display: 'none' }}
        />
        <div style={{ marginBottom: '10px' }}>
          <i className="fas fa-cloud-upload-alt" style={{ fontSize: '48px', color: '#3498DB' }}></i>
        </div>
        <p style={{ margin: '0', color: '#2C3E50' }}>
          Drag and drop files here or click to select
        </p>
        <p style={{ fontSize: '0.8em', color: '#7F8C8D', margin: '5px 0 0' }}>
          Accepted files: {acceptedFileTypes} (Max {maxFileSizeMB}MB)
        </p>
      </div>

      {error && (
        <div style={{ 
          color: '#E74C3C', 
          marginTop: '10px', 
          padding: '10px', 
          backgroundColor: '#FADBD8', 
          borderRadius: '5px' 
        }}>
          {error}
        </div>
      )}

      {files.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h4 style={{ color: '#2C3E50', marginBottom: '10px' }}>Selected Files:</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {files.map((file, index) => (
              <li
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px',
                  margin: '5px 0',
                  backgroundColor: '#F8F9F9',
                  borderRadius: '5px',
                  border: '1px solid #E5E7E9'
                }}
              >
                <div style={{ flex: 1 }}>
                  <span style={{ color: '#2C3E50' }}>{file.name}</span>
                  <span style={{ 
                    color: '#7F8C8D', 
                    fontSize: '0.8em', 
                    marginLeft: '10px' 
                  }}>
                    ({(file.size / 1024 / 1024).toFixed(2)}MB)
                  </span>
                </div>
                <button
                  onClick={() => removeFile(file)}
                  style={{
                    border: 'none',
                    background: 'none',
                    color: '#E74C3C',
                    cursor: 'pointer',
                    padding: '5px 10px',
                    fontSize: '1.2em',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseOver={(e) => e.target.style.color = '#C0392B'}
                  onMouseOut={(e) => e.target.style.color = '#E74C3C'}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload; 