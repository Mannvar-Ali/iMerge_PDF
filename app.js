document.getElementById('mergeBtn').addEventListener('click', async function() {
    const input = document.getElementById('pdfFiles');
    const status = document.getElementById('status');
    const downloadLink = document.getElementById('downloadLink');
    status.textContent = '';
    downloadLink.style.display = 'none';

    if (!input.files.length) {
        status.textContent = 'Please select at least two PDF files.';
        return;
    }
    if (input.files.length < 2) {
        status.textContent = 'Select at least two PDFs to merge.';
        return;
    }

    try {
        // Read all PDFs as ArrayBuffers
        const pdfBuffers = await Promise.all(Array.from(input.files).map(file => file.arrayBuffer()));
        // Create a new PDF document
        const mergedPdf = await PDFLib.PDFDocument.create();
        for (const pdfBytes of pdfBuffers) {
            const pdf = await PDFLib.PDFDocument.load(pdfBytes);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach(page => mergedPdf.addPage(page));
        }
        const mergedBytes = await mergedPdf.save();
        // Create a blob and download link
        const blob = new Blob([mergedBytes], { type: 'application/pdf' });
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.style.display = 'block';
        status.textContent = 'PDFs merged successfully!';
    } catch (err) {
        status.textContent = 'Error merging PDFs: ' + err.message;
    }
});
