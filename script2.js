let isRecording = false;
let recognition = new webkitSpeechRecognition();
recognition.continuous = true; // Keep recognizing speech continuously
recognition.interimResults = true; // Enable interim results
transcript = ""; // Initialize transcript string
oldTranscript = ""; // Store previous transcript when stopping

recognition.lang = 'en-US';

recognition.onresult = (event) => {
    let finalTranscript = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
        // Only consider final results
        if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' ';
        }
    }
    transcript += finalTranscript;
    document.getElementById('output').textContent = transcript; // Display the updated transcript
    };

recognition.onerror = (event) => {
    console.error('Error occurred in recognition: ' + event.error);
    document.getElementById('output').textContent = "Error occurred during recognition.";
};

document.getElementById('record-btn').addEventListener('click', () => {
    if (!isRecording) {
        recognition.start(); // Start recording
        document.getElementById('record-btn').textContent = "Stop Recording";
        isRecording = true;
    } else {
        recognition.stop(); // Stop recording
        document.getElementById('record-btn').textContent = "Start Recording";
        isRecording = false;

        oldTranscript += transcript + '\n'; // Save the final transcript when stopping
        transcript = ''; // Reset the current transcript after stopping
    }
});