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
const langBtn = document.getElementById('langBtn');
const langModal = document.getElementById('langModal');
const langList = document.getElementById('langList');
const closeLangModal = document.getElementById('closeLangModal');

// Wait for Cordova
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    console.log('Device is ready');
    isReady = true;

    // Initialize language system
    if (typeof LanguageManager !== 'undefined') {
        LanguageManager.init();
        populateLanguageList();
    }

    // Event Listeners
    openBtn.addEventListener('click', openPDF);
    welcomeOpenBtn.addEventListener('click', openPDF);
    prevPageBtn.addEventListener('click', () => goToPage(currentPage - 1));
    nextPageBtn.addEventListener('click', () => goToPage(currentPage + 1));
    zoomInBtn.addEventListener('click', () => changeZoom(0.2));
    zoomOutBtn.addEventListener('click', () => changeZoom(-0.2));
    fitWidthBtn.addEventListener('click', fitToWidth);
    langBtn.addEventListener('click', openLanguageModal);
    closeLangModal.addEventListener('click', closeLanguageModal);

    // Close modal on background click
    langModal.addEventListener('click', (e) => {
        if (e.target === langModal) {
            closeLanguageModal();
        }
    });

    // Status bar
    if (window.StatusBar) {
        StatusBar.styleDefault();
        StatusBar.backgroundColorByHexString('#34495e');
    }
}

// Open PDF File
function openPDF() {
    if (!isReady) {
        const msg = typeof LanguageManager !== 'undefined' ? LanguageManager.t('loading') : 'App wird noch geladen...';
        alert(msg);
        return;
    }

    // Use Chooser plugin to pick PDF
    chooser.getFile('application/pdf').then(function(file) {
        console.log('Selected file:', file);
        loadPDFFromFile(file);
    }).catch(function(error) {
        console.error('Error selecting file:', error);
        const msg = typeof LanguageManager !== 'undefined' ? LanguageManager.t('errorOpening') : 'Fehler beim Öffnen der Datei';
        alert(msg);
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
        const msg = typeof LanguageManager !== 'undefined' ? LanguageManager.t('errorOpening') : 'Fehler beim Lesen der Datei';
        alert(msg);
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
        const msg = typeof LanguageManager !== 'undefined' ? LanguageManager.t('errorOpening') : 'Ungültiges Dateiformat';
        alert(msg);
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
                const msg = typeof LanguageManager !== 'undefined' ? LanguageManager.t('errorOpening') : 'Fehler beim Lesen der Datei';
                alert(msg);
            };

            reader.readAsArrayBuffer(file);
        });
    }, function(error) {
        console.error('Error resolving file:', error);
        showLoading(false);
        const msg = typeof LanguageManager !== 'undefined' ? LanguageManager.t('errorOpening') : 'Datei konnte nicht gefunden werden';
        alert(msg);
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
        const msg = typeof LanguageManager !== 'undefined' ? LanguageManager.t('errorLoading') : 'Fehler beim Laden der PDF';
        alert(msg + ': ' + error.message);
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

// Language Management
function populateLanguageList() {
    if (typeof LanguageManager === 'undefined') return;

    const languages = [
        { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'es', name: 'Español', flag: '🇪🇸' },
        { code: 'it', name: 'Italiano', flag: '🇮🇹' },
        { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
        { code: 'pl', name: 'Polski', flag: '🇵🇱' }
    ];

    langList.innerHTML = '';

    languages.forEach(lang => {
        const item = document.createElement('div');
        item.className = 'lang-item';
        if (lang.code === LanguageManager.currentLanguage) {
            item.classList.add('active');
        }

        item.innerHTML = `
            <span class="flag">${lang.flag}</span>
            <div class="lang-info">
                <span class="lang-name">${lang.name}</span>
                <span class="lang-code">${lang.code.toUpperCase()}</span>
            </div>
        `;

        item.addEventListener('click', () => changeLanguage(lang.code));
        langList.appendChild(item);
    });
}

function openLanguageModal() {
    langModal.style.display = 'flex';
    populateLanguageList(); // Refresh to show active language
}

function closeLanguageModal() {
    langModal.style.display = 'none';
}

function changeLanguage(langCode) {
    if (typeof LanguageManager === 'undefined') return;

    LanguageManager.setLanguage(langCode);
    populateLanguageList(); // Update active state

    // Update UI with new translations
    if (pdfDoc) {
        updateUI();
    }

    // Close modal after short delay
    setTimeout(() => {
        closeLanguageModal();
    }, 200);
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
