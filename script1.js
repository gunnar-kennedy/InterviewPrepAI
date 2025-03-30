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