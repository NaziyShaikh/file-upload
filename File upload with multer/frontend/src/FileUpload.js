import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FileUpload.css';

function FileUpload() {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/files`);
      setFiles(response.data);
      setMessage('');
    } catch (error) {
      console.error('Error fetching files:', error);
      setMessage('Error fetching files: ' + error.message);
    }
  };

  const handleFileUpload = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setMessage('File uploaded successfully');
      setSelectedFile(null);
      fetchFiles();
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('Error uploading file: ' + error.message);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setMessage('');
  };

  return (
    <div className="file-upload-container">
      <div className="file-upload-card">
        <h2>File Upload</h2>
        <div className="file-input-container">
          <label className="custom-file-upload">
            Select File
            <input
              type="file"
              className="file-input"
              onChange={handleFileSelect}
            />
          </label>
        </div>
        <button 
          type="submit" 
          className="upload-button" 
          onClick={handleFileUpload}
          disabled={!selectedFile}
        >
          Upload File
        </button>
        {message && (
          <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}
        
        <div className="files-grid">
          {files.map((file) => (
            <div key={file._id} className="file-card">
              <div className="file-name">{file.filename}</div>
              <a
                href={`${process.env.REACT_APP_API_URL}/files/${file.filename}`}
                className="file-download"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FileUpload;