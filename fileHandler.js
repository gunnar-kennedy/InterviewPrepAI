const fs = require('fs');
const path = require('path');

// File paths
const uploadsFilePath = path.join(__dirname, 'uploads.json');
const openAiFilePath = path.join(__dirname, 'openAI.json');

// Ensure necessary JSON files exist
if (!fs.existsSync(uploadsFilePath)) {
    fs.writeFileSync(uploadsFilePath, '[]');
}

if (!fs.existsSync(openAiFilePath)) {
    fs.writeFileSync(openAiFilePath, '{}');
}

// Function to write to uploads.json
const saveUploadData = (data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(uploadsFilePath, JSON.stringify(data, null, 2), (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
};

// Function to read uploads.json
const getUploadData = () => {
    if (!fs.existsSync(uploadsFilePath)) return null;
    return JSON.parse(fs.readFileSync(uploadsFilePath, 'utf-8'));
};

// Function to write OpenAI response
const saveOpenAiData = (data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(openAiFilePath, JSON.stringify(data, null, 2), (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
};

module.exports = { saveUploadData, getUploadData, saveOpenAiData };
