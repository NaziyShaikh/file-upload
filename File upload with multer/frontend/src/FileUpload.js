import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

  return (
    <div className="container mt-5">
      <h2>File Upload</h2>
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleFileUpload}>
            <div className="mb-3">
              <input
                type="file"
                className="form-control"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={!selectedFile}>
              Upload File
            </button>
          </form>
          {message && <div className="alert alert-info mt-3">{message}</div>}
          
          <hr />
          <h4>Uploaded Files</h4>
          <div className="list-group">
            {files.map((file) => (
              <a
                key={file._id}
                href={`${process.env.REACT_APP_API_URL}/files/${file.filename}`}
                className="list-group-item list-group-item-action"
                target="_blank"
                rel="noopener noreferrer"
              >
                {file.filename}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FileUpload;