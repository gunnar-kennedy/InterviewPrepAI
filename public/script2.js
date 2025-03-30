let isRecording = false;
let recognition = new webkitSpeechRecognition();
recognition.continuous = true; // Keep recognizing speech continuously
recognition.interimResults = true; // Enable interim results
transcript = ""; // Initialize transcript string


recognition.lang = 'en-US';

recognition.onresult = (event) => {
    for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
            transcript += event.results[i][0].transcript + ' ';
        }
    }
    document.getElementById('output').textContent = transcript;
};

recognition.onerror = (event) => {
    console.error('Error occurred in recognition: ' + event.error);
    document.getElementById('output').textContent = "Error occurred during recognition.";
};

window.onload = () => {
    recognition.start(); // Start recording
    isRecording = true;
}

window.onclose = () => {
    if (isRecording) {
        recognition.stop(); // Ensure to stop recognition when the window closes
        oldTranscript += transcript + '\n'; // Save the final transcript when stopping
        transcript = ''; // Reset the current transcript after stopping
    }
    // Optionally handle any cleanup or saving of the transcript here
};


// document.getElementById('record-btn').addEventListener('click', () => {
//     if (!isRecording) {
//         recognition.start(); // Start recording
//         document.getElementById('record-btn').textContent = "Stop Recording";
//         isRecording = true;
//     } else {
//         recognition.stop(); // Stop recording
//         document.getElementById('record-btn').textContent = "Start Recording";
//         isRecording = false;

//         oldTranscript += transcript + '\n'; // Save the final transcript when stopping
//         transcript = ''; // Reset the current transcript after stopping
//     }
// });

function saveTranscriptToFile() {
    if (transcript.trim() !== "") {
        let data = {
            timestamp: new Date().toISOString(),
            transcript: transcript.trim()
        };
        let blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        let a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "transcript.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}

// Start recognition when the window loads
window.onload = () => {
    recognition.start();
    isRecording = true;
};

// Stop recognition and save transcript when the window closes
window.onbeforeunload = () => {
    if (isRecording) {
        recognition.stop();
        saveTranscriptToFile();
    }
};