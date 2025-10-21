# Pure PDF Viewer - Projekt-Struktur

Komplette Übersicht aller Dateien und deren Zweck.

## 📁 Verzeichnis-Struktur

```
pure-pdf-app/
│
├── 📄 App-Dateien (Electron)
│   ├── main.js              ⚙️ Electron Hauptprozess
│   ├── preload.js           🔌 IPC Bridge (Main ↔ Renderer)
│   ├── index.html           🎨 App UI (HTML)
│   ├── renderer.js          💻 UI Logik (PDF Rendering)
│   ├── style.css            🎨 Styling
│   └── package.json         📦 Dependencies & Build Config
│
├── 🔧 Setup & Tools
│   ├── setup-tool.html      🔐 Lizenz-Verwaltungs-Tool
│   └── setup-tool.js        💼 Setup-Tool Logik
│
├── 📀 USB-Vertrieb
│   ├── KOPIERE_APP_AUF_USB.bat   🪟 Windows USB-Kopiertool
│   └── kopiere-app-auf-usb.sh    🐧 Linux/Mac USB-Kopiertool
│
├── 🖼️ Assets
│   └── icon.png             🎨 App Icon (512x512)
│
├── 📚 Dokumentation
│   ├── START_HERE.md        👋 Einstiegs-Guide (START HIER!)
│   ├── QUICK_START.md       ⚡ Schnellstart (5 Min)
│   ├── README.md            📖 Vollständige Übersicht
│   ├── INSTALLATION.md      🛠️ Setup-Anleitung
│   ├── MONETIZATION_GUIDE.md 💰 Verkaufs-Strategien
│   ├── LICENSE_SYSTEM.md    🔐 Lizenz-Verwaltung
│   ├── BUILD_SCRIPTS.md     📦 Build-Dokumentation
│   ├── CHANGELOG.md         📝 Version History
│   └── PROJECT_STRUCTURE.md 📁 Diese Datei
│
├── ⚙️ Konfiguration
│   ├── .gitignore           🚫 Git Ignore-Liste
│   └── LICENSE.txt          📄 Software-Lizenz
│
└── 🔨 Hilfsmittel
    └── ÖFFNE_ORDNER.bat     📂 Windows Explorer öffnen
```

## 📄 Datei-Beschreibungen

### Electron App-Dateien

#### `main.js` (301 Zeilen)
**Zweck:** Electron Hauptprozess
**Verantwortlich für:**
- App-Fenster erstellen
- Menü-System
- PDF-Dateien öffnen (Dialog)
- IPC-Handler für Renderer-Kommunikation
- File-System-Operationen

**Wichtige Funktionen:**
- `createWindow()` - Erstellt Hauptfenster
- `openPDFDialog()` - Öffnet Datei-Auswahl
- `loadPDF(filePath)` - Lädt PDF in App

#### `preload.js` (25 Zeilen)
**Zweck:** Sicherer IPC-Bridge
**Verantwortlich für:**
- Context Isolation zwischen Main & Renderer
- Exponiert sichere API ans Frontend
- Event-Listener für IPC-Messages

**Exponierte APIs:**
- `electronAPI.openPDF()` - PDF öffnen
- `electronAPI.onLoadPDF()` - PDF empfangen
- `electronAPI.onZoomIn/Out/Reset()` - Zoom-Events

#### `index.html` (130 Zeilen)
**Zweck:** App User Interface
**Enthält:**
- Toolbar mit Controls
- Welcome Screen
- PDF Viewer Container
- Loading Spinner

**UI-Bereiche:**
- Toolbar (Open, Zoom, Navigation)
- Welcome Screen (beim Start)
- PDF Viewer (Canvas-basiert)
- Loading Indicator

#### `renderer.js` (220 Zeilen)
**Zweck:** Frontend-Logik & PDF-Rendering
**Verantwortlich für:**
- PDF.js Integration
- PDF-Rendering auf Canvas
- Zoom & Navigation
- Tastenkürzel
- UI-Updates

**Wichtige Funktionen:**
- `loadPDFFromBuffer()` - PDF laden
- `renderAllPages()` - Alle Seiten rendern
- `changeZoom()` - Zoom ändern
- `goToPage()` - Navigation

#### `style.css` (240 Zeilen)
**Zweck:** App Styling
**Design:**
- Dunkles Theme (#2c3e50)
- Moderne Buttons
- Smooth Animations
- Responsive Layout

**Features:**
- Custom Scrollbars
- Hover-Effekte
- Loading Animations
- Gradient Buttons

#### `package.json` (65 Zeilen)
**Zweck:** Projekt-Konfiguration
**Enthält:**
- Dependencies (Electron, PDF.js)
- Build Scripts
- Electron-Builder Config
- App-Metadaten

**Build-Targets:**
- Windows (NSIS + Portable)
- Mac (DMG)
- Linux (AppImage + DEB)

---

### Setup & Lizenz-Tools

#### `setup-tool.html` (380 Zeilen)
**Zweck:** Lizenz-Verwaltungs-Interface
**Passwort:** `JoHanna268219$`

**Features:**
- 🔐 Passwort-Schutz
- 📊 Dashboard mit Statistiken
- 🎫 Lizenz-Key Generierung
- 💰 3 Lizenz-Levels (Basic, Pro, Enterprise)
- 📋 Lizenz-Liste & Management
- 🚀 Build & Deploy Anleitungen

**Tabs:**
1. Dashboard - Übersicht
2. Lizenz-Verwaltung - Keys generieren
3. Premium-Features - Feature-Liste
4. Build & Deploy - Kompilierungs-Guides

#### `setup-tool.js` (180 Zeilen)
**Zweck:** Setup-Tool Logik
**Funktionen:**
- Login/Authentifizierung
- Lizenz-Key Generierung
- LocalStorage Verwaltung
- Export/Import Funktionen

**Key-Format:**
```
PDF-[LEVEL]-[TIMESTAMP]-[RANDOM]
Beispiel: PDF-PRO-L8K9M2N4-abc123def456
```

---

### USB-Vertriebstools

#### `KOPIERE_APP_AUF_USB.bat` (Windows)
**Zweck:** Automatisiertes Kopieren auf USB-Sticks
**Funktionen:**
- Laufwerk-Auswahl
- Build-Validierung
- Datei-Kopierung
- Autorun-Erstellung
- README-Generierung

**Kopiert:**
- Windows Installer (.exe)
- Setup-Tool
- Dokumentation
- README für USB

#### `kopiere-app-auf-usb.sh` (Linux/Mac)
**Zweck:** USB-Kopiertool für Unix-Systeme
**Identische Funktionen wie .bat**

**Platform-Detection:**
- Linux (lsblk)
- macOS (diskutil)

---

### Dokumentation

#### `START_HERE.md` ⭐
**Zweck:** Erster Einstiegspunkt
**Zielgruppe:** Neue Nutzer
**Inhalt:**
- 3-Schritte Schnellstart
- Wichtige Dateien
- FAQ
- Nächste Schritte

#### `QUICK_START.md`
**Zweck:** 5-Minuten Quick Guide
**Inhalt:**
- npm install & start
- Build-Befehle
- Setup-Tool Nutzung
- Verkaufs-Basics

#### `README.md`
**Zweck:** Vollständige Feature-Übersicht
**Inhalt:**
- Features-Liste
- Monetarisierungs-Features
- Tastenkürzel
- Projekt-Struktur
- Anpassungs-Optionen

#### `INSTALLATION.md`
**Zweck:** Detaillierte Setup-Anleitung
**Inhalt:**
- Voraussetzungen
- Schritt-für-Schritt Installation
- Build für alle Plattformen
- USB-Stick Vorbereitung
- Troubleshooting
- Anpassungen

#### `MONETIZATION_GUIDE.md` 💰
**Zweck:** Verkaufs-Strategien & Marketing
**Inhalt:**
- 4 Verkaufs-Strategien
- Preisgestaltung (€29.99 - €99.99)
- Marketing-Tipps
- SEO-Keywords
- Rabatt-Strategien
- Realistische Umsatz-Prognosen
- Premium Features Roadmap

#### `LICENSE_SYSTEM.md`
**Zweck:** Lizenz-Verwaltung Doku
**Inhalt:**
- Setup-Tool Nutzung
- Lizenz-Key Format
- Validierung implementieren
- Online-Validierung (Optional)
- Sicherheits-Tipps
- Email-Templates

#### `BUILD_SCRIPTS.md`
**Zweck:** Build-Prozess Dokumentation
**Inhalt:**
- Alle npm Scripts erklärt
- Build für Win/Mac/Linux
- Build-Konfiguration
- Troubleshooting
- CI/CD Integration
- Cross-Platform Builds

#### `CHANGELOG.md`
**Zweck:** Version History
**Inhalt:**
- v1.0.0 Release Notes
- Geplante Features (v1.1, v1.2, v2.0)
- Feature Requests

---

### Konfiguration

#### `.gitignore`
**Zweck:** Git Ignore-Liste
**Ignoriert:**
- node_modules/
- dist/
- *.log
- .env
- *.pdf (Test-Dateien)

#### `LICENSE.txt`
**Zweck:** Software-Lizenz
**Typ:** MIT + Commercial Use License
**Erlaubt:**
- Modifikation
- Distribution
- Verkauf
- Rebranding

---

## 📊 Datei-Statistiken

### Zeilen-Code

| Datei | Zeilen | Typ |
|-------|--------|-----|
| main.js | ~300 | JavaScript |
| renderer.js | ~220 | JavaScript |
| setup-tool.html | ~380 | HTML/CSS |
| setup-tool.js | ~180 | JavaScript |
| index.html | ~130 | HTML |
| style.css | ~240 | CSS |
| MONETIZATION_GUIDE.md | ~800 | Markdown |
| LICENSE_SYSTEM.md | ~600 | Markdown |
| BUILD_SCRIPTS.md | ~600 | Markdown |
| **Total** | **~3500** | |

### Datei-Größen (ungefähr)

| Kategorie | Anzahl | Größe |
|-----------|--------|-------|
| JavaScript | 4 | ~50 KB |
| HTML | 2 | ~30 KB |
| CSS | 1 | ~10 KB |
| Markdown | 9 | ~150 KB |
| Scripts | 3 | ~15 KB |
| **Total** | **19** | **~255 KB** |

**Mit node_modules:** ~150 MB
**Nach Build (dist/):** ~80-120 MB pro Plattform

---

## 🎯 Wichtige Dateien für verschiedene Aufgaben

### 🚀 Zum Starten:
1. `START_HERE.md` - Einstieg
2. `QUICK_START.md` - Schnellstart
3. `package.json` - npm install/start

### 💰 Zum Verkaufen:
1. `MONETIZATION_GUIDE.md` - Strategien
2. `setup-tool.html` - Lizenzen generieren
3. `KOPIERE_APP_AUF_USB.bat` - USB-Sticks

### 🛠️ Zum Entwickeln:
1. `main.js` - Backend-Logik
2. `renderer.js` - Frontend-Logik
3. `style.css` - Design anpassen

### 📦 Zum Kompilieren:
1. `BUILD_SCRIPTS.md` - Build-Guide
2. `package.json` - Build-Config
3. `npm run build:win` - Ausführen

### 🔧 Zum Anpassen:
1. `package.json` - App-Name, Metadaten
2. `style.css` - Farben, Design
3. `assets/` - Icons ersetzen

---

## 🗂️ Nach dem Build

Nach `npm run build:win` entsteht:

```
dist/
├── Pure PDF Viewer Setup 1.0.0.exe   (Installer)
├── Pure PDF Viewer 1.0.0.exe         (Portable)
├── win-unpacked/                      (Unpacked Files)
└── builder-*.yaml                     (Build Logs)
```

**Für Verkauf nutzen:**
- `Pure PDF Viewer Setup 1.0.0.exe` (Installer)
- Oder: `Pure PDF Viewer 1.0.0.exe` (Portable, für USB)

---

## 📌 Zusammenfassung

**Gesamt-Dateien:** 19 Haupt-Dateien + Assets
**Gesamt-Zeilen:** ~3500 Zeilen Code/Doku
**Sprachen:** JavaScript, HTML, CSS, Markdown, Batch, Shell

**Zweck:** Vollständige, verkaufsfertige PDF-Viewer Desktop-App mit kompletter Monetarisierungs-Infrastruktur.

---

**Letzte Aktualisierung:** 2025-10-21
