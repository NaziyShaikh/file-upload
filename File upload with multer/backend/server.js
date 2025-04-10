require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs'); // Add this line to import fs module

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// MongoDB connection
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
    console.error('MongoDB URI not configured in environment variables');
    process.exit(1);
}

mongoose.connect(mongoURI)
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

// Serve static files from the uploads directory
app.use('/uploads', express.static('uploads'));

// Routes
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const file = new File({
            filename: req.file.filename,
            path: req.file.path
        });
        await file.save();
        res.json({ message: 'File uploaded successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.delete('/files/:filename', async (req, res) => {
    try {
        const filename = req.params.filename;
        
        // First delete from database
        const file = await File.findOneAndDelete({ filename });
        
        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }

        // Delete file from uploads directory
        const filePath = path.join(__dirname, 'uploads', filename);
        
        try {
            // Check if file exists and delete it
            if (fs.existsSync(filePath)) {
                await fs.promises.unlink(filePath);
            }
        } catch (fileError) {
            console.error(`Error deleting file from disk: ${fileError.message}`);
            // Continue even if file deletion fails - we want to remove it from database
        }

        res.json({ message: 'File deleted successfully' });
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/files', async (req, res) => {
    try {
        const files = await File.find();
        res.json(files);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



app.get('/files/:filename', (req, res) => {
    res.sendFile(path.join(__dirname, 'uploads', req.params.filename));
});
// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the file uploading of multer'
        
     });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
