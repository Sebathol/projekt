# Pure PDF Viewer

Eine moderne, schlanke Desktop-Anwendung zum Anzeigen und Verwalten von PDF-Dateien. Perfekt für den Verkauf und Vertrieb als kommerzielle Software!

## 🌟 Features

- **📄 PDF-Anzeige** - Hochwertige Darstellung von PDF-Dokumenten
- **🔍 Navigation** - Einfaches Blättern durch Seiten
- **🔎 Zoom** - Flexibles Zoomen und Anpassen der Ansicht
- **⌨️ Tastenkürzel** - Schnelle Navigation mit Keyboard Shortcuts
- **🎨 Modernes Design** - Elegante, benutzerfreundliche Oberfläche
- **💰 Monetarisierungs-Ready** - Vollständige Verkaufs-Infrastruktur

## 💼 Monetarisierungs-Features

Diese App ist komplett vorbereitet für den kommerziellen Vertrieb:

- ✅ **Setup-Tool** - Passwort-geschütztes Tool für Lizenz-Verwaltung
- ✅ **Lizenz-System** - Generierung von eindeutigen Lizenz-Keys
- ✅ **USB-Vertrieb** - Automatisierte Scripts für USB-Stick-Verkauf
- ✅ **Build-System** - Kompilierung für Windows, Mac und Linux
- ✅ **Dokumentation** - Komplette Anleitungen für Verkauf und Support

## 🚀 Quick Start

### Entwicklung

```bash
# Dependencies installieren
cd pure-pdf-app
npm install

# App starten
npm start
```

### Kompilieren

```bash
# Windows Build
npm run build:win

# Mac Build
npm run build:mac

# Linux Build
npm run build:linux

# Alle Plattformen
npm run build
```

## 🛠️ Setup-Tool verwenden

Das Setup-Tool ist dein zentrales Werkzeug für Lizenz-Verwaltung und Verkauf:

1. **Öffne `setup-tool.html` im Browser**
2. **Login mit Passwort:** `JoHanna268219$`
3. **Nutze die folgenden Funktionen:**
   - Dashboard - Übersicht und Status
   - Lizenz-Verwaltung - Keys generieren und verwalten
   - Premium-Features - Feature-Planung
   - Build & Deploy - Kompilierungs-Anleitungen

## 📀 USB-Stick Vertrieb

Nutze die automatisierten Scripts um die App auf USB-Sticks zu kopieren:

### Windows:
```batch
KOPIERE_APP_AUF_USB.bat
```

### Linux/Mac:
```bash
./kopiere-app-auf-usb.sh
```

Die Scripts kopieren automatisch:
- Kompilierte App
- Setup-Tool
- Dokumentation
- README-Dateien
- Autorun-Konfiguration (Windows)

## 💰 Verkaufs-Strategie

### Empfohlene Preise:

1. **Basic** - €29.99
   - PDF-Anzeige
   - Zoom & Navigation
   - Tastenkürzel

2. **Professional** - €49.99
   - Alle Basic Features
   - PDF-Annotation
   - PDF-Konvertierung
   - Erweiterte Suche

3. **Enterprise** - €99.99
   - Alle Pro Features
   - Unbegrenzte Lizenzen
   - Premium Support
   - Custom Branding

### Verkaufs-Kanäle:

- **Eigene Website** - Direktverkauf mit maximaler Marge
- **Gumroad** - Einfache Plattform mit 10% Gebühr
- **USB-Sticks** - Direktverkauf auf Messen, Events
- **Amazon** - Großer Marktplatz, höhere Reichweite
- **Microsoft Store** - Windows-Nutzer erreichen

## 📋 Lizenz-System

### Lizenz generieren:

1. Öffne `setup-tool.html`
2. Gehe zu "Lizenz-Verwaltung"
3. Gib Kundennamen ein (optional)
4. Wähle Lizenz-Level
5. Klicke "Lizenz generieren"
6. Kopiere den Key und sende ihn an den Kunden

### Lizenz-Key Format:

```
PDF-BASIC-TIMESTAMP-RANDOM
PDF-PRO-TIMESTAMP-RANDOM
PDF-ENTERPRISE-TIMESTAMP-RANDOM
```

Beispiel: `PDF-PRO-L8K9M2N4-abc123def456`

## 🎯 Premium-Features implementieren

Um zusätzliche Features hinzuzufügen, kannst du diese Bibliotheken nutzen:

### PDF-Annotation:
```bash
npm install pdf-annotate
```

### PDF-Konvertierung:
```bash
npm install pdf-lib
```

### Erweiterte PDF-Funktionen:
```bash
npm install @pdfme/generator
npm install pdf-parse
```

## 📁 Projekt-Struktur

```
pure-pdf-app/
├── main.js              # Electron Hauptprozess
├── preload.js           # Preload Script (IPC Bridge)
├── index.html           # App UI
├── renderer.js          # Renderer Prozess (UI Logik)
├── style.css            # Styling
├── package.json         # Dependencies & Build Config
├── setup-tool.html      # Setup & Lizenz-Tool
├── setup-tool.js        # Setup-Tool Logik
├── assets/              # Icons & Ressourcen
├── KOPIERE_APP_AUF_USB.bat  # Windows USB-Tool
└── kopiere-app-auf-usb.sh   # Linux/Mac USB-Tool
```

## ⌨️ Tastenkürzel

- `Ctrl/Cmd + O` - PDF öffnen
- `Ctrl/Cmd + W` - PDF schließen
- `Ctrl/Cmd + Q` - App beenden
- `Ctrl/Cmd + Plus` - Zoom vergrößern
- `Ctrl/Cmd + Minus` - Zoom verkleinern
- `Ctrl/Cmd + 0` - Zoom zurücksetzen
- `F11` - Vollbild
- `Arrow Left / PageUp` - Vorherige Seite
- `Arrow Right / PageDown` - Nächste Seite
- `Home` - Erste Seite
- `End` - Letzte Seite

## 🔧 Anpassung

### App-Name ändern:

In `package.json`:
```json
{
  "name": "dein-app-name",
  "productName": "Deine App",
  "description": "Deine Beschreibung"
}
```

### Icons ändern:

Ersetze die Dateien in `assets/`:
- `icon.png` (Linux)
- `icon.ico` (Windows)
- `icon.icns` (Mac)

### Passwort ändern:

In `setup-tool.js`:
```javascript
const MASTER_PASSWORD = 'DeinNeuesPasswort123!';
```

## 📞 Support

Für Support und Fragen:
- Email: support@yourcompany.com
- Website: www.yourcompany.com
- Dokumentation: Siehe `INSTALLATION.md` und andere Docs

## 📄 Lizenz

Diese Software ist kommerziell nutzbar. Du kannst sie anpassen und verkaufen.

## 🎉 Los geht's!

1. **Entwicklung**: Starte mit `npm start`
2. **Kompilieren**: Nutze `npm run build:win` (oder :mac, :linux)
3. **Lizenzen erstellen**: Öffne `setup-tool.html`
4. **Auf USB kopieren**: Nutze `KOPIERE_APP_AUF_USB.bat`
5. **Verkaufen**: Nutze deine bevorzugte Plattform

---

**Viel Erfolg beim Verkauf deiner Pure PDF Viewer App! 🚀**

© 2025 Your Company. Alle Rechte vorbehalten.
