import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FileUpload() {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');

  const API_URL = process.env.VITE_API_URL || 'http://localhost:5000';

  const fetchFiles = async () => {
    try {
      const response = await axios.get(`${API_URL}/files`);
      setFiles(response.data);
    } catch (error) {
      console.error('Error fetching files:', error);
      setMessage('Error fetching files');
    }
  };

  const handleFileUpload = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', event.target.file.files[0]);

    try {
      const response = await axios.post(`${API_URL}/upload`, formData);
      setMessage('File uploaded successfully!');
      fetchFiles();
    } catch (error) {
      console.error('Error:', error);
      setMessage(error.response ? error.response.data : 'Error uploading file.');
    }
  };

  return (
    <div>
      <h1>File Upload</h1>
      <form onSubmit={handleFileUpload}>
        <input type="file" name="file" required />
        <button type="submit">Upload</button>
      </form>
      {message && <p>{message}</p>}
      <h2>Uploaded Files</h2>
      <ul>
        {files.map(file => (
          <li key={file._id}>{file.filename}</li>
        ))}
      </ul>
    </div>
  );
}

export default FileUpload;