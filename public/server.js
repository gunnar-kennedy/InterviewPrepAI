const express = require('express');
const multer = require('multer');
const path = require('path');

// Initialize Express app
const app = express();

// Set up storage engine for Multer to store files in 'resumeFolder'
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './resumeFolder'); // Specify the folder where you want to store the file
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Save file with a unique name
    }
});

const upload = multer({ storage: storage });

// Serve static files (for frontend access)
app.use(express.static('public')); 

// API endpoint to handle file upload
app.post('/upload', upload.single('resume'), (req, res) => {
    if (req.file) {
        // Respond with success if the file is uploaded
        res.json({ success: true, message: 'File uploaded successfully.' });
    } else {
        // Respond with an error if no file is uploaded
        res.json({ success: false, message: 'File upload failed.' });
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
