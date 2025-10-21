# Build Scripts Documentation

Komplette Anleitung für das Kompilieren der Pure PDF Viewer App.

## 📦 Verfügbare Build-Scripts

In `package.json` sind folgende Scripts definiert:

```json
{
  "scripts": {
    "start": "electron .",
    "build": "electron-builder",
    "build:win": "electron-builder --win",
    "build:mac": "electron-builder --mac",
    "build:linux": "electron-builder --linux",
    "pack": "electron-builder --dir",
    "dist": "electron-builder"
  }
}
```

## 🚀 Build-Befehle

### Development (Testen)

```bash
npm start
```

**Was passiert:**
- Startet die App im Development-Modus
- Lädt `main.js`
- Hot-reload bei Änderungen
- DevTools verfügbar

**Nutze dies für:**
- Entwicklung
- Testing
- Debugging

---

### Windows Build

```bash
npm run build:win
```

**Output:**
```
dist/
├── Pure PDF Viewer Setup 1.0.0.exe   (Installer, ~80MB)
└── Pure PDF Viewer 1.0.0.exe         (Portable, ~120MB)
```

**Installer-Optionen:**
- NSIS Installer (Nutzer kann Installationsort wählen)
- Desktop-Shortcut wird erstellt
- Startmenü-Eintrag wird erstellt
- Deinstallation möglich

**Portable Version:**
- Keine Installation nötig
- Direkt ausführbar
- Perfekt für USB-Sticks
- Nutzer-Einstellungen in `%APPDATA%`

**Build-Zeit:** 3-5 Minuten

**Requirements:**
- Windows 7 oder höher
- Node.js installiert
- Ausreichend Festplattenspeicher (~500MB für Build)

---

### Mac Build

```bash
npm run build:mac
```

**Output:**
```
dist/
└── Pure PDF Viewer-1.0.0.dmg   (~100MB)
```

**DMG-Datei:**
- Drag-and-drop Installation
- Standard macOS Format
- Code-signing (optional, für Distribution)

**Build-Zeit:** 4-6 Minuten

**Requirements:**
- macOS 10.13 oder höher
- Xcode Command Line Tools
- Für Code-Signing: Apple Developer Account

**Code-Signing (optional):**
```bash
export CSC_LINK=/path/to/certificate.p12
export CSC_KEY_PASSWORD=your_password
npm run build:mac
```

---

### Linux Build

```bash
npm run build:linux
```

**Output:**
```
dist/
├── Pure-PDF-Viewer-1.0.0.AppImage   (~100MB)
└── pure-pdf-viewer_1.0.0_amd64.deb  (~80MB)
```

**AppImage:**
- Universelles Linux-Format
- Keine Installation nötig
- Läuft auf allen Distributionen
- Ausführbar machen: `chmod +x *.AppImage`

**DEB-Paket:**
- Für Debian/Ubuntu
- Installation: `sudo dpkg -i *.deb`
- Integriert in System-Menü
- Deinstallation: `sudo apt remove pure-pdf-viewer`

**Build-Zeit:** 3-5 Minuten

**Requirements:**
- Ubuntu 16.04+ / Debian 9+ / Fedora 28+
- Build-Tools: `sudo apt-get install build-essential`

---

### Alle Plattformen (Cross-Platform)

```bash
npm run build
```

**Hinweis:** Cross-Platform Build funktioniert nur vollständig auf macOS!

**Auf Windows:**
- Baut nur Windows-Version

**Auf Linux:**
- Baut nur Linux-Version

**Auf macOS:**
- Baut Windows, Mac UND Linux

**Für echte Cross-Platform Builds:**
- Nutze CI/CD (GitHub Actions, Travis)
- Oder separate VMs/Docker Container

---

### Pack (Development Build)

```bash
npm run pack
```

**Output:**
```
dist/
└── win-unpacked/    (oder mac/ oder linux-unpacked/)
```

**Was ist das:**
- Ungepackte Build ohne Installer
- Schneller als vollständiger Build
- Gut für Testing
- Nicht für Distribution

**Build-Zeit:** 1-2 Minuten

---

## 🛠️ Build-Konfiguration

In `package.json` unter `"build"`:

```json
{
  "build": {
    "appId": "com.yourcompany.purepdf",
    "productName": "Pure PDF Viewer",
    "directories": {
      "output": "dist"
    },
    "files": [
      "**/*",
      "!**/*.md",
      "!.git",
      "!dist",
      "!node_modules"
    ],
    "win": {
      "target": [
        {"target": "nsis", "arch": ["x64"]},
        {"target": "portable", "arch": ["x64"]}
      ],
      "icon": "assets/icon.ico"
    },
    "mac": {
      "target": "dmg",
      "icon": "assets/icon.icns",
      "category": "public.app-category.productivity"
    },
    "linux": {
      "target": ["AppImage", "deb"],
      "icon": "assets/icon.png",
      "category": "Office"
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true,
      "createDesktopShortcut": true,
      "createStartMenuShortcut": true
    }
  }
}
```

### Anpassungen:

**App-ID ändern:**
```json
"appId": "com.deinefirma.pdfviewer"
```

**Produkt-Name ändern:**
```json
"productName": "Deine PDF App"
```

**Icon ändern:**
1. Erstelle Icon-Dateien:
   - `icon.ico` (Windows, 256x256)
   - `icon.icns` (Mac, 512x512)
   - `icon.png` (Linux, 512x512)
2. Platziere in `assets/` Ordner
3. Pfade sind bereits korrekt in `package.json`

**Output-Verzeichnis ändern:**
```json
"directories": {
  "output": "releases"
}
```

---

## 🔧 Erweiterte Build-Optionen

### Nur Installer (kein Portable)

```bash
electron-builder --win --config.win.target=nsis
```

### Nur Portable (kein Installer)

```bash
electron-builder --win --config.win.target=portable
```

### Spezifische Architektur

```bash
# Nur 64-bit
electron-builder --win --x64

# Nur 32-bit (nicht empfohlen)
electron-builder --win --ia32

# Beide
electron-builder --win --x64 --ia32
```

### Publish zu GitHub Releases

1. **GitHub Token generieren:**
   - GitHub → Settings → Developer Settings → Personal Access Tokens
   - Scope: `repo`

2. **Environment Variable setzen:**
   ```bash
   export GH_TOKEN=your_github_token
   ```

3. **Build & Publish:**
   ```bash
   npm run dist
   ```

4. **package.json erweitern:**
   ```json
   {
     "build": {
       "publish": {
         "provider": "github",
         "owner": "yourname",
         "repo": "pure-pdf-viewer"
       }
     }
   }
   ```

---

## 🐛 Troubleshooting

### Problem: Build schlägt fehl mit "Cannot find module"

**Lösung:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build:win
```

### Problem: "Access denied" beim Windows Build

**Lösung:**
- Als Administrator ausführen
- Oder: Antivirus temporär deaktivieren
- Oder: `dist/` Ordner löschen und neu builden

### Problem: Icons werden nicht angezeigt

**Lösung:**
1. Prüfe dass Icons existieren:
   ```bash
   ls -la assets/
   ```
2. Prüfe Pfade in `package.json`
3. Icons neu generieren (siehe `INSTALLATION.md`)

### Problem: Build dauert sehr lange

**Normal:**
- Erster Build: 5-10 Minuten
- Weitere Builds: 3-5 Minuten

**Beschleunigen:**
- Nutze `npm run pack` für Testing
- Deaktiviere Antivirus (während Build)
- SSD statt HDD nutzen

### Problem: "Electron failed to install correctly"

**Lösung:**
```bash
# Electron neu installieren
npm uninstall electron
npm install electron --save-dev

# Oder mit Rebuild
npm install
npm rebuild electron
```

---

## 📊 Build-Größen

Typische Dateigrößen:

| Plattform | Format | Größe | Komprimiert |
|-----------|--------|-------|-------------|
| Windows | Installer (NSIS) | ~80MB | ~50MB zip |
| Windows | Portable | ~120MB | ~70MB zip |
| Mac | DMG | ~100MB | ~60MB zip |
| Linux | AppImage | ~100MB | ~60MB zip |
| Linux | DEB | ~80MB | ~50MB zip |

**Warum so groß?**
- Electron beinhaltet Chromium (~50MB)
- Node.js Runtime (~20MB)
- Deine App (~5-10MB)
- Dependencies (~10-20MB)

**Größe reduzieren:**
- Entferne ungenutzte Dependencies
- Nutze `electron-builder` Compression
- Nur notwendige `node_modules` inkludieren

---

## 🚀 CI/CD Integration

### GitHub Actions

Erstelle `.github/workflows/build.yml`:

```yaml
name: Build

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [windows-latest, macos-latest, ubuntu-latest]

    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build

      - name: Upload artifacts
        uses: actions/upload-artifact@v2
        with:
          name: ${{ matrix.os }}-build
          path: dist/
```

**Trigger:**
```bash
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

---

## 📝 Zusammenfassung

**Für Entwicklung:**
```bash
npm start
```

**Für Verkauf (Windows):**
```bash
npm run build:win
```

**Für USB-Sticks:**
1. `npm run build:win`
2. `KOPIERE_APP_AUF_USB.bat`

**Für alle Plattformen:**
- Nutze macOS oder CI/CD

---

**Bei Problemen:** Siehe Troubleshooting-Sektion oder `INSTALLATION.md`

**Viel Erfolg! 🚀**
