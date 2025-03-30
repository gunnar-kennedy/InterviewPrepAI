document.getElementById("uploadedPDF").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
        const fileURL = URL.createObjectURL(file);
        const pdfPreview = document.getElementById("pdf-preview");
        pdfPreview.src = fileURL;
        pdfPreview.style.display = "block";
    } else {
        console.log("No file selected.");
    }
});

document.getElementById("StartInterviewButton").addEventListener("click", function(event) {
    event.preventDefault();

    const fileInput = document.getElementById("uploadedPDF");
    const jobDescription = document.querySelector("textarea").value.trim();
    const file = fileInput.files[0];

    if (!file) {
        alert("Please upload your resume before proceeding.");
        window.location.href = 'screen1.html';
        return;
    }

    if (!jobDescription) {
        alert("Please enter a job description before proceeding.");
        window.location.href = 'screen1.html';
        return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Resume uploaded successfully! Redirecting...");
            window.location.href = 'screen2.html';
        } else {
            alert("Error uploading resume. Please try again 1.");
            window.location.href = 'screen1.html';
        }
    })
    .catch(error => {
        console.error('Error uploading file:', error);
        alert("Error uploading resume. Please try again 2.");
        window.location.href = 'screen1.html';
    });
});
