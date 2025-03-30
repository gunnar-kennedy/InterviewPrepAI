let mediaRecorder;
let audioChunks = [];
let isRecording = false;

const recordButton = document.getElementById("recordButton");
const statusText = document.getElementById("status");
const transcriptionText = document.getElementById("transcription");

recordButton.addEventListener("click", async () => {
    if (!isRecording) {
        startRecording();
    } else {
        stopRecording();
    }
});

async function startRecording() {
    let stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];

    mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
        await sendToOpenAI(audioBlob);
    };

    mediaRecorder.start();
    recordButton.textContent = "⏹ Stop Recording";
    statusText.textContent = "Recording...";
    isRecording = true;
}

function stopRecording() {
    mediaRecorder.stop();
    recordButton.textContent = "🎤 Start Recording";
    statusText.textContent = "Processing...";
    isRecording = false;
}

async function sendToOpenAI(audioBlob) {
    const formData = new FormData();
    formData.append("file", audioBlob, "audio.webm");
    formData.append("model", "whisper-1");

    try {
        const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
            method: "POST",
            headers: { "Authorization": "Bearer YOUR_OPENAI_API_KEY" },
            body: formData
        });

        const result = await response.json();
        transcriptionText.textContent = result.text || "Transcription failed.";
        statusText.textContent = "Transcription Complete.";
    } catch (error) {
        console.error("Error:", error);
        transcriptionText.textContent = "Error transcribing audio.";
        statusText.textContent = "Error.";
    }
}
