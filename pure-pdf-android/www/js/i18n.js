// Language Manager
const LanguageManager = {
    currentLanguage: 'de',
    defaultLanguage: 'de',

    translations: {
        de: {
            appName: 'Pure PDF',
            welcome: 'Willkommen bei Pure PDF',
            welcomeText: 'Tippe auf das Ordner-Symbol um eine PDF-Datei zu öffnen',
            openPDF: 'PDF öffnen',
            openFile: 'Datei öffnen',
            loading: 'PDF wird geladen...',
            page: 'Seite',
            of: 'von',
            zoom: 'Zoom',
            fitWidth: 'Seitenbreite',
            error: 'Fehler',
            errorLoading: 'Fehler beim Laden der PDF',
            errorOpening: 'Fehler beim Öffnen der Datei',
            selectFile: 'Bitte wähle eine Datei aus',
            noFileSelected: 'Keine Datei ausgewählt',
            settings: 'Einstellungen',
            language: 'Sprache',
            about: 'Über',
            close: 'Schließen',
            cancel: 'Abbrechen',
            ok: 'OK'
        },
        en: {
            appName: 'Pure PDF',
            welcome: 'Welcome to Pure PDF',
            welcomeText: 'Tap the folder icon to open a PDF file',
            openPDF: 'Open PDF',
            openFile: 'Open file',
            loading: 'Loading PDF...',
            page: 'Page',
            of: 'of',
            zoom: 'Zoom',
            fitWidth: 'Page width',
            error: 'Error',
            errorLoading: 'Error loading PDF',
            errorOpening: 'Error opening file',
            selectFile: 'Please select a file',
            noFileSelected: 'No file selected',
            settings: 'Settings',
            language: 'Language',
            about: 'About',
            close: 'Close',
            cancel: 'Cancel',
            ok: 'OK'
        },
        fr: {
            appName: 'Pure PDF',
            welcome: 'Bienvenue sur Pure PDF',
            welcomeText: 'Appuyez sur l\'icône dossier pour ouvrir un fichier PDF',
            openPDF: 'Ouvrir PDF',
            openFile: 'Ouvrir fichier',
            loading: 'Chargement du PDF...',
            page: 'Page',
            of: 'sur',
            zoom: 'Zoom',
            fitWidth: 'Largeur de page',
            error: 'Erreur',
            errorLoading: 'Erreur lors du chargement du PDF',
            errorOpening: 'Erreur lors de l\'ouverture du fichier',
            selectFile: 'Veuillez sélectionner un fichier',
            noFileSelected: 'Aucun fichier sélectionné',
            settings: 'Paramètres',
            language: 'Langue',
            about: 'À propos',
            close: 'Fermer',
            cancel: 'Annuler',
            ok: 'OK'
        },
        es: {
            appName: 'Pure PDF',
            welcome: 'Bienvenido a Pure PDF',
            welcomeText: 'Toca el icono de carpeta para abrir un archivo PDF',
            openPDF: 'Abrir PDF',
            openFile: 'Abrir archivo',
            loading: 'Cargando PDF...',
            page: 'Página',
            of: 'de',
            zoom: 'Zoom',
            fitWidth: 'Ancho de página',
            error: 'Error',
            errorLoading: 'Error al cargar el PDF',
            errorOpening: 'Error al abrir el archivo',
            selectFile: 'Por favor selecciona un archivo',
            noFileSelected: 'Ningún archivo seleccionado',
            settings: 'Configuración',
            language: 'Idioma',
            about: 'Acerca de',
            close: 'Cerrar',
            cancel: 'Cancelar',
            ok: 'OK'
        },
        it: {
            appName: 'Pure PDF',
            welcome: 'Benvenuto in Pure PDF',
            welcomeText: 'Tocca l\'icona della cartella per aprire un file PDF',
            openPDF: 'Apri PDF',
            openFile: 'Apri file',
            loading: 'Caricamento PDF...',
            page: 'Pagina',
            of: 'di',
            zoom: 'Zoom',
            fitWidth: 'Larghezza pagina',
            error: 'Errore',
            errorLoading: 'Errore nel caricamento del PDF',
            errorOpening: 'Errore nell\'apertura del file',
            selectFile: 'Seleziona un file',
            noFileSelected: 'Nessun file selezionato',
            settings: 'Impostazioni',
            language: 'Lingua',
            about: 'Info',
            close: 'Chiudi',
            cancel: 'Annulla',
            ok: 'OK'
        },
        tr: {
            appName: 'Pure PDF',
            welcome: 'Pure PDF\'e Hoş Geldiniz',
            welcomeText: 'PDF dosyası açmak için klasör simgesine dokunun',
            openPDF: 'PDF Aç',
            openFile: 'Dosya Aç',
            loading: 'PDF yükleniyor...',
            page: 'Sayfa',
            of: '//',
            zoom: 'Yakınlaştır',
            fitWidth: 'Sayfa genişliği',
            error: 'Hata',
            errorLoading: 'PDF yüklenirken hata oluştu',
            errorOpening: 'Dosya açılırken hata oluştu',
            selectFile: 'Lütfen bir dosya seçin',
            noFileSelected: 'Dosya seçilmedi',
            settings: 'Ayarlar',
            language: 'Dil',
            about: 'Hakkında',
            close: 'Kapat',
            cancel: 'İptal',
            ok: 'Tamam'
        },
        pl: {
            appName: 'Pure PDF',
            welcome: 'Witamy w Pure PDF',
            welcomeText: 'Dotknij ikony folderu, aby otworzyć plik PDF',
            openPDF: 'Otwórz PDF',
            openFile: 'Otwórz plik',
            loading: 'Ładowanie PDF...',
            page: 'Strona',
            of: 'z',
            zoom: 'Powiększenie',
            fitWidth: 'Szerokość strony',
            error: 'Błąd',
            errorLoading: 'Błąd podczas ładowania PDF',
            errorOpening: 'Błąd podczas otwierania pliku',
            selectFile: 'Proszę wybrać plik',
            noFileSelected: 'Nie wybrano pliku',
            settings: 'Ustawienia',
            language: 'Język',
            about: 'O aplikacji',
            close: 'Zamknij',
            cancel: 'Anuluj',
            ok: 'OK'
        }
    },

    // Initialize language
    init: function() {
        // Load saved language or use device language
        const savedLang = localStorage.getItem('appLanguage');
        if (savedLang && this.translations[savedLang]) {
            this.currentLanguage = savedLang;
        } else {
            // Try to detect device language
            const deviceLang = this.getDeviceLanguage();
            this.currentLanguage = deviceLang;
        }

        this.applyLanguage();
    },

    // Get device language
    getDeviceLanguage: function() {
        let lang = 'de'; // Default

        if (navigator.language) {
            const browserLang = navigator.language.toLowerCase().substring(0, 2);
            if (this.translations[browserLang]) {
                lang = browserLang;
            }
        }

        return lang;
    },

    // Get translated text
    t: function(key) {
        return this.translations[this.currentLanguage][key] || this.translations[this.defaultLanguage][key] || key;
    },

    // Change language
    setLanguage: function(lang) {
        if (this.translations[lang]) {
            this.currentLanguage = lang;
            localStorage.setItem('appLanguage', lang);
            this.applyLanguage();
        }
    },

    // Apply language to UI
    applyLanguage: function() {
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.t(key);
        });

        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.t(key);
        });

        // Update title attributes
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            element.title = this.t(key);
        });

        // Update specific elements
        this.updateSpecificElements();
    },

    // Update specific UI elements
    updateSpecificElements: function() {
        // Update page info if PDF is loaded
        if (totalPages > 0) {
            updatePageInfo();
        }
    },

    // Get all available languages
    getAvailableLanguages: function() {
        return [
            { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
            { code: 'fr', name: 'Français', flag: '🇫🇷' },
            { code: 'es', name: 'Español', flag: '🇪🇸' },
            { code: 'it', name: 'Italiano', flag: '🇮🇹' },
            { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
            { code: 'pl', name: 'Polski', flag: '🇵🇱' }
        ];
    }
};

// Shorthand for translation
function t(key) {
    return LanguageManager.t(key);
}
