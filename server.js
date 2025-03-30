const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Initialize Express app
const app = express();

// Ensure resumeFolder exists
const uploadDir = path.join(__dirname, 'resumeFolder');
// Ensure resumeFolder exists BEFORE multer is used
try {
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log('Created resumeFolder directory.');
    }
} catch (err) {
    console.error('Error creating resumeFolder:', err);
}

// Set up storage engine for Multer
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadDir); // Save to resumeFolder
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

const upload = multer({ storage: storage });

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to handle file upload
app.post('/upload', upload.single('resume'), (req, res) => {
    if (req.file) {
        res.json({ success: true, message: 'File uploaded successfully.' });
    } else {
        res.status(400).json({ success: false, message: 'File upload failed.' });
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
