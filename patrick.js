let isRecording = false;
let recognition = new webkitSpeechRecognition();
let transcript = ""; // Initialize an empty string to store the transcript
recognition.lang = 'en-US';
recognition.continuous = true;  // Ensure continuous speech recognition
recognition.interimResults = true;  // Get interim results while speaking

let lastTranscript = ""; // Store the last finalized transcript

recognition.onresult = (event) => {
    const lastResult = event.results[event.results.length - 1];

    // Check if the result is final (not interim)
    if (lastResult.isFinal) {
        const newTranscript = lastResult[0].transcript;

        // Append only if the new transcript is different from the previous one
        if (newTranscript !== lastTranscript) {
            transcript += newTranscript + ' ';  // Append the new transcript part
            document.getElementById('output').textContent = transcript;  // Update the displayed transcript
            lastTranscript = newTranscript;  // Update the last transcript for future checks
        }
    }
};

recognition.onerror = (event) => {
    console.error('Error occurred in recognition: ' + event.error);
    // Optionally, you can display an error message to the user
    document.getElementById('output').textContent = "Error occurred during recognition.";
};

document.getElementById('record-btn').addEventListener('click', async () => {
    if (!isRecording) {
        transcript = "";  // Reset the transcript when starting a new recording
        document.getElementById('output').textContent = "";  // Clear the displayed transcript
        recognition.start();
        document.getElementById('record-btn').textContent = "Stop Recording";
        isRecording = true;
    } else {
        recognition.stop();  // Stop recording when clicked again
        document.getElementById('record-btn').textContent = "Start Recording";
        isRecording = false;
    }
});
