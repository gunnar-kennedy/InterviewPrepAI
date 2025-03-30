const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Add this line

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

// Ensure uploads.json exists
const uploadsFilePath = path.join(__dirname, 'uploads.json');
if (!fs.existsSync(uploadsFilePath)) {
    fs.writeFileSync(uploadsFilePath, '[]'); // Initialize with empty JSON array
}

// Serve static files (for frontend access)
app.use(express.static('public')); 
// console.log('Serving static files from:', path.join(__dirname, 'public'));

// API endpoint to handle file upload **and update uploads.json**
app.post('/upload', upload.single('resume'), (req, res) => {
    if (!req.file || !req.body.jobDescription) {
        return res.status(400).json({ success: false, message: 'Missing resume or job description.' });
    }

    // Prepare the data to be stored in uploads.json
    const newEntry = {
        resumeName: req.file.filename,
        jobDescription: req.body.jobDescription
    };
    
        // Overwrite uploads.json with only the latest entry
        fs.writeFile(uploadsFilePath, JSON.stringify(newEntry, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Error saving data to file.' });
            }
            res.json({ success: true, message: 'Resume uploaded and data stored successfully.' });
        });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
