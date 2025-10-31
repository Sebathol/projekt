// PDF.js Configuration
const pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

let pdfDoc = null;
let currentPage = 1;
let totalPages = 0;
let currentZoom = 1.0;
let isReady = false;

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
const welcomeScreen = document.getElementById('welcomeScreen');
const viewerContainer = document.getElementById('viewerContainer');
const pdfViewer = document.getElementById('pdfViewer');
const loading = document.getElementById('loading');
const toolbar = document.getElementById('toolbar');

// Wait for Cordova
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    console.log('Device is ready');
    isReady = true;

    // Event Listeners
    openBtn.addEventListener('click', openPDF);
    welcomeOpenBtn.addEventListener('click', openPDF);
    prevPageBtn.addEventListener('click', () => goToPage(currentPage - 1));
    nextPageBtn.addEventListener('click', () => goToPage(currentPage + 1));
    zoomInBtn.addEventListener('click', () => changeZoom(0.2));
    zoomOutBtn.addEventListener('click', () => changeZoom(-0.2));
    fitWidthBtn.addEventListener('click', fitToWidth);

    // Status bar
    if (window.StatusBar) {
        StatusBar.styleDefault();
        StatusBar.backgroundColorByHexString('#34495e');
    }
}

// Open PDF File
function openPDF() {
    if (!isReady) {
        alert('App wird noch geladen...');
        return;
    }

    // Use Chooser plugin to pick PDF
    chooser.getFile('application/pdf').then(function(file) {
        console.log('Selected file:', file);
        loadPDFFromFile(file);
    }).catch(function(error) {
        console.error('Error selecting file:', error);
        alert('Fehler beim Öffnen der Datei');
    });
}

// Load PDF from File
function loadPDFFromFile(file) {
    showLoading(true);

    // Read file as array buffer
    const reader = new FileReader();

    reader.onload = function(e) {
        const arrayBuffer = e.target.result;
        loadPDFFromBuffer(arrayBuffer);
    };

    reader.onerror = function(e) {
        console.error('FileReader error:', e);
        showLoading(false);
        alert('Fehler beim Lesen der Datei');
    };

    // Read the file
    if (file.data) {
        // Chooser plugin returns base64
        const binaryString = atob(file.data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        loadPDFFromBuffer(bytes.buffer);
    } else if (file.uri) {
        // Try to read from URI
        readFileFromURI(file.uri);
    } else {
        showLoading(false);
        alert('Ungültiges Dateiformat');
    }
}

// Read file from URI
function readFileFromURI(uri) {
    window.resolveLocalFileSystemURL(uri, function(fileEntry) {
        fileEntry.file(function(file) {
            const reader = new FileReader();

            reader.onload = function(e) {
                loadPDFFromBuffer(e.target.result);
            };

            reader.onerror = function(e) {
                console.error('FileReader error:', e);
                showLoading(false);
                alert('Fehler beim Lesen der Datei');
            };

            reader.readAsArrayBuffer(file);
        });
    }, function(error) {
        console.error('Error resolving file:', error);
        showLoading(false);
        alert('Datei konnte nicht gefunden werden');
    });
}

// Load PDF from ArrayBuffer
async function loadPDFFromBuffer(arrayBuffer) {
    try {
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        pdfDoc = await loadingTask.promise;
        totalPages = pdfDoc.numPages;

        currentPage = 1;
        await renderAllPages();

        // Show PDF viewer
        welcomeScreen.style.display = 'none';
        viewerContainer.style.display = 'block';
        toolbar.style.display = 'block';

        updateUI();
        showLoading(false);
    } catch (error) {
        console.error('Error loading PDF:', error);
        showLoading(false);
        alert('Fehler beim Laden der PDF: ' + error.message);
    }
}

// Render all pages
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

// Navigation
function goToPage(pageNum) {
    if (pageNum < 1 || pageNum > totalPages) return;

    currentPage = pageNum;
    updateUI();

    // Scroll to page
    const pageElement = document.getElementById(`page-${pageNum}`);
    if (pageElement) {
        pageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Zoom functions
function changeZoom(delta) {
    currentZoom = Math.max(0.5, Math.min(3.0, currentZoom + delta));
    renderAllPages();
    updateUI();
}

function fitToWidth() {
    const containerWidth = viewerContainer.clientWidth - 32;
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

// UI Updates
function updateUI() {
    pageInfo.textContent = `${currentPage} / ${totalPages}`;
    zoomLevel.textContent = `${Math.round(currentZoom * 100)}%`;

    prevPageBtn.disabled = currentPage <= 1;
    nextPageBtn.disabled = currentPage >= totalPages;
}

function showLoading(show) {
    loading.style.display = show ? 'block' : 'none';
}

// Handle back button
document.addEventListener('backbutton', function(e) {
    if (pdfDoc) {
        // Close PDF
        e.preventDefault();
        pdfDoc = null;
        currentPage = 1;
        totalPages = 0;
        currentZoom = 1.0;
        pdfViewer.innerHTML = '';
        welcomeScreen.style.display = 'flex';
        viewerContainer.style.display = 'none';
        toolbar.style.display = 'none';
    } else {
        // Exit app
        navigator.app.exitApp();
    }
}, false);

// Touch gestures for page navigation
let touchStartX = 0;
let touchEndX = 0;

pdfViewer.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
}, false);

pdfViewer.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, false);

function handleSwipe() {
    const threshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > threshold) {
        if (diff > 0) {
            // Swipe left - next page
            goToPage(currentPage + 1);
        } else {
            // Swipe right - previous page
            goToPage(currentPage - 1);
        }
    }
}
