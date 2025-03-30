const express = require('express');
const multer = require('multer');
const path = require('path');
const { saveUploadData } = require('./fileHandler');
const { processResume } = require('./openAIProcessor');

const app = express();

// Multer setup for file storage
const storage = multer.diskStorage({
    destination: './resumeFolder',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Serve static files
app.use(express.static('public'));

// File upload API
app.post('/upload', upload.single('resume'), async (req, res) => {
    if (!req.file || !req.body.jobDescription) {
        return res.status(400).json({ success: false, message: 'Missing resume or job description.' });
    }

    // Save uploaded data
    const newEntry = {
        resumeName: req.file.filename,
        jobDescription: req.body.jobDescription
    };

    try {
        await saveUploadData([newEntry]);
        res.json({ success: true, message: 'Resume uploaded and data stored successfully.' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error saving data to file.' });
    }
});

// Resume processing API
app.get('/process-resume', async (req, res) => {
    try {
        const response = await processResume();
        res.json({ success: true, message: 'Resume processed and saved to openAI.json', analysis: response });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
