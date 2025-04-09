import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function FileUpload() {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');
  const [apiUrl, setApiUrl] = useState('');

  useEffect(() => {
    const envUrl = process.env.VITE_API_URL;
    if (envUrl) {
      setApiUrl(envUrl);
    } else {
      setApiUrl('http://localhost:5000');
    }
  }, []);

  const fetchFiles = useCallback(async () => {
    if (!apiUrl) {
      setMessage('API URL not configured');
      return;
    }
    try {
      const response = await axios.get(`${apiUrl}/files`);
      setFiles(response.data);
    } catch (error) {
      console.error('Error fetching files:', error);
      setMessage('Error fetching files: ' + error.message);
    }
  }, [apiUrl, setMessage, setFiles]);

  const handleFileUpload = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    const fileInput = event.target.querySelector('input[type="file"]');
    
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      setMessage('Please select a file first');
      return;
    }

    formData.append('file', fileInput.files[0]);

    if (!apiUrl) {
      setMessage('API URL not configured');
      return;
    }

    try {
      await axios.post(`${apiUrl}/upload`, formData);
      setMessage('File uploaded successfully!');
      fetchFiles();
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('Error uploading file: ' + error.message);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  return (
    <div className="file-upload-container">
      <h1>File Upload</h1>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleFileUpload} className="upload-form">
        <input 
          type="file" 
          name="file" 
          required 
          className="file-input"
        />
        <button type="submit" className="upload-button">Upload</button>
      </form>
      <h2>Uploaded Files</h2>
      <ul className="files-list">
        {files.map(file => (
          <li key={file._id} className="file-item">{file.filename}</li>
        ))}
      </ul>
    </div>
  );
}

export default FileUpload;