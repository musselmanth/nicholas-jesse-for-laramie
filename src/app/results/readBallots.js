// Reads the "Ballots Cast - Total" number from page 1 of a county results report.
// The county's PDFs are scans, so this renders the page and OCRs it. pdf.js and
// tesseract.js are only loaded once a report is actually posted.

let ocrWorker;

// "Ballots Cast - Total 8,215" (OCR sometimes reads the dash as a period, or a 0 as an O).
export function parseBallotsCast(text) {
  const m = text.match(/Ballots\W*Cast\W{0,4}Total\W{0,6}([\dO][\d,.O]*)/i);
  return m ? Number(m[1].replace(/O/gi, '0').replace(/[,.]/g, '')) : null;
}

export async function readBallotsCast(pdfBytes) {
  const [pdfjs, tesseract] = await Promise.all([import('pdfjs-dist'), import('tesseract.js')]);
  const cdn = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}`;
  pdfjs.GlobalWorkerOptions.workerSrc = `${cdn}/build/pdf.worker.min.mjs`;

  // wasmUrl is where pdf.js finds its decoder for the scanner's JBIG2 images.
  const pdf = await pdfjs.getDocument({ data: pdfBytes, wasmUrl: `${cdn}/wasm/` }).promise;
  try {
    const page = await pdf.getPage(1);
    // Render at roughly the 300 dpi the page was scanned at.
    const viewport = page.getViewport({ scale: 300 / 72 });
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(viewport.width);
    canvas.height = Math.round(viewport.height);
    const canvasContext = canvas.getContext('2d');
    // The scan is black ink on a transparent page, which OCR would read as all black.
    canvasContext.fillStyle = '#fff';
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvas, canvasContext, viewport }).promise;

    const createWorker = tesseract.createWorker ?? tesseract.default.createWorker;
    ocrWorker ??= createWorker('eng');
    // The ballots line is in the statistics block at the top of the page, so only OCR that.
    const top = document.createElement('canvas');
    top.width = canvas.width;
    top.height = Math.round(canvas.height * 0.35);
    top.getContext('2d').drawImage(canvas, 0, 0);
    const { data } = await (await ocrWorker).recognize(top);
    return parseBallotsCast(data.text);
  } finally {
    pdf.destroy();
  }
}
