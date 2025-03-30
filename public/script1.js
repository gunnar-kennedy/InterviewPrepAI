document.getElementById("uploadedPDF").addEventListener("change", function(event) {

    const file = event.target.files[0];
    if (file) {
        // prevoew the file
        const fileURL = URL.createObjectURL(file);
        const pdfPreview = document.getElementById("pdf-preview");
        pdfPreview.src = fileURL; // Set the source of the iframe to the file URL
        pdfPreview.style.display = "block"; // Show the iframe
    } else {
        console.log("No file selected.");
    }
});

document.getElementById("resume-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the form from reloading the page

    const formData = new FormData();
    const fileInput = document.getElementById("uploadedPDF");
    const file = fileInput.files[0];
    
    if (file) {
        formData.append("resume", file); // Append the resume to the form data

        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Resume uploaded successfully!");
            } else {
                alert("Error uploading resume.");
            }
        })
        .catch(error => {
            console.error('Error uploading file:', error);
        });
    } else {
        alert("Please select a resume to upload.");
    }
});