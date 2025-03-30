const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const { OpenAI } = require('openai');
const { getUploadData, saveOpenAiData } = require('./fileHandler');

// OpenAI API Setup
const openai = new OpenAI({
    apiKey: 'YOUR_OPENAI_API_KEY' // Replace with actual API key
});

// Function to process the latest resume and send it to OpenAI
const processResume = async () => {
    const uploads = getUploadData();

    if (!uploads || uploads.length === 0) {
        throw new Error('No resume found in uploads.json');
    }

    const { resumeName, jobDescription } = uploads[0];
    const resumePath = path.join(__dirname, 'resumeFolder', resumeName);

    if (!fs.existsSync(resumePath)) {
        throw new Error('Resume file not found');
    }

    // Read and extract text from PDF
    const pdfData = fs.readFileSync(resumePath);
    const pdfText = (await pdfParse(pdfData)).text;

    // Send extracted text to OpenAI API
    const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
            { role: 'system', content: 'You are a helpful assistant that analyzes resumes.' },
            { role: 'user', content: `Analyze this resume:\n\n${pdfText}\n\nFor the job: ${jobDescription}` }
        ]
    });

    const openAiResponse = completion.choices[0].message.content;

    // Save response to openAI.json
    await saveOpenAiData({ resumeAnalysis: openAiResponse });

    return openAiResponse;
};

module.exports = { processResume };
