const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors'); // Import CORS
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb+srv://naziya:wvUfuGUHt26GYPd@cluster0.oswlq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Ensure this directory exists
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Use original file name
    }
});

const upload = multer({ storage: storage });

// Define Mongoose schema
const fileSchema = new mongoose.Schema({
    filename: String,
    path: String,
});

const File = mongoose.model('File', fileSchema);

// Upload route
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const newFile = new File({
        filename: req.file.filename,
        path: req.file.path
    });

    newFile.save()
        .then(() => res.status(201).json({ message: 'File uploaded successfully' }))
        .catch(err => res.status(500).json({ error: err.message }));
});

// Retrieve files route
app.get('/files', (req, res) => {
    File.find()
        .then(files => res.json(files))
        .catch(err => res.status(500).json({ error: err.message }));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});