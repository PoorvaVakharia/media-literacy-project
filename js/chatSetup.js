const pdfInput = document.getElementById('pdfInput');
const pdfPreview = document.getElementById('pdfPreview');

pdfInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  
  if (file) {
    // Create a temporary local URL pointing to the file in browser memory
    const fileUrl = URL.createObjectURL(file);
    
    // Load that local URL into the iframe and make it visible
    pdfPreview.src = fileUrl;
    pdfPreview.style.display = 'block';
  }
});
