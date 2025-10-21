// PDF.js Library (we'll use CDN version for simplicity)
const pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

let pdfDoc = null;
let currentPage = 1;
let totalPages = 0;
let currentZoom = 1.0;
let renderTask = null;

// Elements
const openBtn = document.getElementById('openBtn');
const welcomeOpenBtn = document.getElementById('welcomeOpenBtn');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const zoomInBtn = document.getElementById('zoomIn');
const zoomOutBtn = document.getElementById('zoomOut');
const fitWidthBtn = document.getElementById('fitWidth');
const pageInfo = document.getElementById('pageInfo');
const zoomLevel = document.getElementById('zoomLevel');
const fileName = document.getElementById('fileName');
const welcomeScreen = document.getElementById('welcomeScreen');
const viewerContainer = document.getElementById('viewerContainer');
const pdfViewer = document.getElementById('pdfViewer');
const loadingSpinner = document.getElementById('loadingSpinner');

// Event Listeners
openBtn.addEventListener('click', () => window.electronAPI.openPDF());
welcomeOpenBtn.addEventListener('click', () => window.electronAPI.openPDF());
prevPageBtn.addEventListener('click', () => goToPage(currentPage - 1));
nextPageBtn.addEventListener('click', () => goToPage(currentPage + 1));
zoomInBtn.addEventListener('click', () => changeZoom(0.1));
zoomOutBtn.addEventListener('click', () => changeZoom(-0.1));
fitWidthBtn.addEventListener('click', () => fitToWidth());

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey || e.metaKey) {
    if (e.key === '=' || e.key === '+') {
      e.preventDefault();
      changeZoom(0.1);
    } else if (e.key === '-') {
      e.preventDefault();
      changeZoom(-0.1);
    } else if (e.key === '0') {
      e.preventDefault();
      resetZoom();
    }
  } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
    e.preventDefault();
    goToPage(currentPage - 1);
  } else if (e.key === 'ArrowRight' || e.key === 'PageDown') {
    e.preventDefault();
    goToPage(currentPage + 1);
  } else if (e.key === 'Home') {
    e.preventDefault();
    goToPage(1);
  } else if (e.key === 'End') {
    e.preventDefault();
    goToPage(totalPages);
  }
});

// IPC Listeners
window.electronAPI.onLoadPDF((pdfBuffer) => {
  loadPDFFromBuffer(pdfBuffer);
});

window.electronAPI.onClosePDF(() => {
  closePDF();
});

window.electronAPI.onZoomIn(() => {
  changeZoom(0.1);
});

window.electronAPI.onZoomOut(() => {
  changeZoom(-0.1);
});

window.electronAPI.onZoomReset(() => {
  resetZoom();
});

// PDF Functions
async function loadPDFFromBuffer(base64Buffer) {
  try {
    showLoading(true);
    hideWelcomeScreen();

    // Convert base64 to Uint8Array
    const binaryString = atob(base64Buffer);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const loadingTask = pdfjsLib.getDocument({ data: bytes });
    pdfDoc = await loadingTask.promise;
    totalPages = pdfDoc.numPages;

    currentPage = 1;
    await renderAllPages();

    updateUI();
    showLoading(false);
  } catch (error) {
    console.error('Error loading PDF:', error);
    alert('Failed to load PDF: ' + error.message);
    showLoading(false);
    showWelcomeScreen();
  }
}

async function renderAllPages() {
  pdfViewer.innerHTML = '';

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    const canvas = document.createElement('canvas');
    canvas.className = 'pdf-page';
    canvas.id = `page-${pageNum}`;

    const context = canvas.getContext('2d');
    const viewport = page.getViewport({ scale: currentZoom * 1.5 });

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    pdfViewer.appendChild(canvas);

    const renderContext = {
      canvasContext: context,
      viewport: viewport
    };

    await page.render(renderContext).promise;
  }
}

async function goToPage(pageNum) {
  if (pageNum < 1 || pageNum > totalPages) return;

  currentPage = pageNum;
  updateUI();

  // Scroll to page
  const pageElement = document.getElementById(`page-${pageNum}`);
  if (pageElement) {
    pageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function changeZoom(delta) {
  currentZoom = Math.max(0.5, Math.min(3.0, currentZoom + delta));
  renderAllPages();
  updateUI();
}

function resetZoom() {
  currentZoom = 1.0;
  renderAllPages();
  updateUI();
}

function fitToWidth() {
  const containerWidth = viewerContainer.clientWidth - 40;
  if (pdfDoc) {
    pdfDoc.getPage(1).then(page => {
      const viewport = page.getViewport({ scale: 1 });
      const scale = containerWidth / viewport.width;
      currentZoom = scale / 1.5;
      renderAllPages();
      updateUI();
    });
  }
}

function updateUI() {
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  zoomLevel.textContent = `${Math.round(currentZoom * 100)}%`;

  prevPageBtn.disabled = currentPage <= 1;
  nextPageBtn.disabled = currentPage >= totalPages;
}

function showLoading(show) {
  loadingSpinner.style.display = show ? 'block' : 'none';
}

function showWelcomeScreen() {
  welcomeScreen.style.display = 'flex';
  viewerContainer.style.display = 'none';
  fileName.textContent = 'No file opened';
}

function hideWelcomeScreen() {
  welcomeScreen.style.display = 'none';
  viewerContainer.style.display = 'block';
}

function closePDF() {
  pdfDoc = null;
  currentPage = 1;
  totalPages = 0;
  currentZoom = 1.0;
  pdfViewer.innerHTML = '';
  showWelcomeScreen();
  updateUI();
}

// Update the HTML to include PDF.js
const script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
document.head.appendChild(script);
