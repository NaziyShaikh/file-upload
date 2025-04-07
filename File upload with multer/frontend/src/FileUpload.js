import React, { useEffect, useState } from 'react';
import axios from 'axios';
import   './FileUpload.css';

const FileUpload = () => {
    const [files, setFiles] = useState([]);
    const [message, setMessage] = useState('');

    const fetchFiles = async () => {
        try {
            const response = await axios.get('http://localhost:5000/files');
            setFiles(response.data);
        } catch (error) {
            console.error('Error fetching files:', error);
        }
    };

    const handleFileUpload = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        const fileInput = document.querySelector('input[type="file"]'); // Adjust selector as needed
        formData.append('file', fileInput.files[0]);

        try {
            const response = await fetch('http://localhost:5000/upload', {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                throw new Error('Error uploading file');
            }
            const data = await response.json();
            console.log(data);
            setMessage('File uploaded successfully!');
            fetchFiles(); // Refresh file list after upload
        } catch (error) {
            console.error('Error:', error);
            setMessage(error.response ? error.response.data : 'Error uploading file.');
        }
    };

    useEffect(() => {
        fetchFiles(); // Fetch files on component mount
    }, []);

    return (
        <div>
            <h1>File Upload</h1>
            <form onSubmit={handleFileUpload}>
                <input type="file" required />
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
};

export default FileUpload;