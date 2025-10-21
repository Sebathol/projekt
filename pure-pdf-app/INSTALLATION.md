# Installation & Setup Guide

Dieser Guide erklärt, wie du Pure PDF Viewer installierst, kompilierst und für den Verkauf vorbereitest.

## 📋 Voraussetzungen

### Entwicklung:

- **Node.js** (v16 oder höher) - [Download](https://nodejs.org/)
- **npm** (kommt mit Node.js)
- **Git** (optional) - [Download](https://git-scm.com/)

### Kompilierung:

#### Windows Build:
- Windows 7 oder höher
- **Visual Studio Build Tools** (optional, für native Module)

#### Mac Build:
- macOS 10.13 oder höher
- **Xcode Command Line Tools**: `xcode-select --install`

#### Linux Build:
- Ubuntu 16.04+ / Debian 9+ / Fedora 28+
- Build-Tools: `sudo apt-get install build-essential`

## 🚀 Installation

### Schritt 1: Projekt einrichten

```bash
# Navigiere in den Projektordner
cd pure-pdf-app

# Installiere Dependencies
npm install
```

### Schritt 2: App testen

```bash
# Starte die App im Development-Modus
npm start
```

Die App sollte sich öffnen. Teste das Öffnen einer PDF-Datei.

### Schritt 3: App kompilieren

#### Windows:
```bash
npm run build:win
```

**Output:** `dist/Pure PDF Viewer Setup.exe` und `dist/Pure PDF Viewer.exe` (portable)

#### Mac:
```bash
npm run build:mac
```

**Output:** `dist/Pure PDF Viewer.dmg`

#### Linux:
```bash
npm run build:linux
```

**Output:** `dist/Pure-PDF-Viewer.AppImage` und `dist/pure-pdf-viewer.deb`

#### Alle Plattformen:
```bash
npm run build
```

**Hinweis:** Cross-Platform Build kann nur auf macOS vollständig funktionieren. Windows baut nur für Windows, Linux nur für Linux.

## 🛠️ Setup-Tool konfigurieren

### Schritt 1: Setup-Tool öffnen

Öffne `setup-tool.html` in einem Browser (Chrome, Firefox, Edge empfohlen).

### Schritt 2: Login

**Standard-Passwort:** `JoHanna268219$`

**Passwort ändern:**
1. Öffne `setup-tool.js` in einem Text-Editor
2. Ändere Zeile 2: `const MASTER_PASSWORD = 'DeinNeuesPasswort';`
3. Speichern

### Schritt 3: Lizenz generieren

1. Gehe zum Tab **"Lizenz-Verwaltung"**
2. Gib einen Kundennamen ein (optional)
3. Wähle ein Lizenz-Level:
   - **Basic** - Grundfunktionen
   - **Professional** - Erweiterte Features
   - **Enterprise** - Alle Features + Support
4. Klicke **"Lizenz generieren"**
5. Kopiere den generierten Key

### Schritt 4: Lizenz an Kunden senden

Sende den Lizenz-Key per Email an deinen Kunden:

```
Hallo [Kunde],

vielen Dank für deinen Kauf von Pure PDF Viewer [Level]!

Dein Lizenz-Key:
PDF-PRO-XXXXXXXX-YYYYYYYY

Installation:
1. Führe die heruntergeladene .exe Datei aus
2. Folge den Installationsanweisungen
3. Gib den Lizenz-Key bei der ersten Nutzung ein

Support: support@yourcompany.com

Viel Erfolg!
```

## 📀 USB-Stick Vertrieb

### Windows:

1. **Kompiliere die App:**
   ```bash
   npm run build:win
   ```

2. **USB-Stick einstecken**

3. **Kopier-Tool ausführen:**
   ```batch
   KOPIERE_APP_AUF_USB.bat
   ```

4. **Laufwerksbuchstaben eingeben** (z.B. `E`)

5. **Bestätigen** mit `J`

6. **Fertig!** Der USB-Stick enthält jetzt:
   - `Pure PDF Viewer Setup.exe`
   - `setup-tool.html`
   - `README.txt`
   - Dokumentation

### Linux/Mac:

1. **Kompiliere die App:**
   ```bash
   npm run build:linux  # oder build:mac
   ```

2. **USB-Stick einstecken und mounten**

3. **Kopier-Tool ausführen:**
   ```bash
   ./kopiere-app-auf-usb.sh
   ```

4. **Mount-Punkt eingeben** (z.B. `/media/usb`)

5. **Bestätigen** mit `j`

6. **Fertig!**

## 🎨 Anpassungen

### App-Name & Branding

**package.json:**
```json
{
  "name": "deine-app",
  "productName": "Deine PDF App",
  "description": "Die beste PDF-App der Welt",
  "author": "Deine Firma",
  "build": {
    "appId": "com.deinefirma.pdfapp"
  }
}
```

### Icons ändern

1. **Erstelle Icons in verschiedenen Größen:**
   - Windows: `icon.ico` (256x256)
   - Mac: `icon.icns` (512x512 und andere)
   - Linux: `icon.png` (512x512)

2. **Platziere sie in `assets/`:**
   ```
   assets/
   ├── icon.ico
   ├── icon.icns
   └── icon.png
   ```

3. **Icons referenzieren in `package.json`:**
   ```json
   "build": {
     "win": {
       "icon": "assets/icon.ico"
     },
     "mac": {
       "icon": "assets/icon.icns"
     },
     "linux": {
       "icon": "assets/icon.png"
     }
   }
   ```

### Farben anpassen

**style.css:**
```css
/* Primärfarbe ändern */
background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);

/* Akzentfarbe */
background: #YOUR_ACCENT_COLOR;
```

## 🔧 Fehlerbehebung

### Problem: `npm install` schlägt fehl

**Lösung:**
```bash
# Cache löschen
npm cache clean --force

# Neu installieren
rm -rf node_modules package-lock.json
npm install
```

### Problem: Build schlägt fehl (Windows)

**Lösung:**
```bash
# Als Administrator ausführen
# Oder Visual Studio Build Tools installieren
npm install --global windows-build-tools
```

### Problem: Icons werden nicht angezeigt

**Lösung:**
- Prüfe dass die Icon-Dateien in `assets/` vorhanden sind
- Prüfe die Pfade in `package.json`
- Rebuild: `npm run build`

### Problem: App startet nicht auf anderen PCs

**Lösung:**
- Stelle sicher dass du als **portable** oder **installer** buildest
- Prüfe dass alle Dependencies gebundelt sind
- Teste auf einer frischen Windows-Installation / VM

## 📦 Distribution

### Online-Verkauf:

#### 1. Eigene Website
- Hoste die .exe Datei auf deinem Server
- Nutze ein Payment-Gateway (Stripe, PayPal)
- Sende Download-Link nach Kauf

#### 2. Gumroad
1. Registriere dich auf [Gumroad](https://gumroad.com/)
2. Erstelle ein neues Produkt
3. Lade die .exe Datei hoch
4. Setze Preis (z.B. €29.99)
5. Teile deinen Gumroad-Link

#### 3. Microsoft Store
1. Registriere dich als Publisher
2. Erstelle eine MSIX-Package
3. Reiche die App ein
4. Microsoft übernimmt Zahlungsabwicklung

### Offline-Verkauf:

#### USB-Sticks auf Messen/Events:
1. Kaufe USB-Sticks in Bulk (z.B. 50 Stück)
2. Nutze `KOPIERE_APP_AUF_USB.bat` für jeden Stick
3. Verkaufe direkt (z.B. €39.99 pro Stick)
4. Gib Lizenz-Keys mündlich oder auf Karte

#### Retail-Boxen:
1. Designe Box/Verpackung
2. Drucke Anleitung
3. Inkludiere USB-Stick oder Download-Code
4. Verkaufe über Einzelhandel

## 💡 Tipps für erfolgreichen Verkauf

### Marketing:
- ✅ Erstelle eine Landing-Page
- ✅ Nutze SEO für "PDF Viewer kaufen"
- ✅ Biete kostenlose Testversion (7 Tage)
- ✅ Sammle Email-Adressen für Newsletter
- ✅ Nutze Social Media (Twitter, LinkedIn)

### Support:
- ✅ Erstelle FAQ-Seite
- ✅ Biete Email-Support
- ✅ Antworte innerhalb 24h
- ✅ Sammle Feature-Requests

### Updates:
- ✅ Plane regelmäßige Updates (monatlich/quartalsweise)
- ✅ Informiere Kunden über neue Features
- ✅ Biete kostenlose Updates für 1 Jahr

## 📊 Preisgestaltung

### Empfohlene Strategie:

**Einführungsangebot:**
- Basic: ~~€34.99~~ **€24.99** (30% Rabatt)
- Pro: ~~€59.99~~ **€39.99** (33% Rabatt)

**Reguläre Preise:**
- Basic: €29.99
- Professional: €49.99
- Enterprise: €99.99

**Bundle-Angebote:**
- 5 Lizenzen: 20% Rabatt
- 10 Lizenzen: 30% Rabatt
- 25+ Lizenzen: Individuelles Angebot

## 🎯 Nächste Schritte

1. ✅ App testen (`npm start`)
2. ✅ Kompilieren (`npm run build:win`)
3. ✅ Setup-Tool konfigurieren
4. ✅ Erste Lizenz generieren
5. ✅ USB-Stick vorbereiten
6. ✅ Verkaufs-Plattform wählen
7. ✅ Marketing starten
8. ✅ Ersten Verkauf machen! 🎉

---

**Bei Fragen:** support@yourcompany.com

**Viel Erfolg! 🚀**
