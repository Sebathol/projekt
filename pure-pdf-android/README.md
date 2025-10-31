# Pure PDF Viewer - Android App

Einfache, schnelle und datenschutzfreundliche PDF-Viewer-App für Android.

## 🎯 Über diese App

Pure PDF Viewer ist eine minimalistische Android-App zum Öffnen und Lesen von PDF-Dateien.

**Features:**
- ✅ PDF-Dateien öffnen
- ✅ Seiten durchblättern (Wischen & Buttons)
- ✅ Zoom In/Out
- ✅ Fit-to-Width
- ✅ Dunkles Theme
- ✅ Keine Werbung
- ✅ 100% kostenlos
- ✅ Datenschutzfreundlich (keine Datensammlung)

## 📱 Screenshots

*(Screenshots sollten in `store-assets/screenshots/` gespeichert werden)*

## 🚀 Installation & Build

### Quick Start:

```bash
# Dependencies installieren
npm install

# Android-Plattform hinzufügen
cordova platform add android

# Debug-Build
cordova build android

# Auf Gerät testen
cordova run android --device

# Release-Build
cordova build android --release -- --packageType=bundle
```

**Ausführliche Anleitung:** Siehe `BUILD_GUIDE.md`

## 📦 Projekt-Struktur

```
pure-pdf-android/
├── www/                          # Web-App Dateien
│   ├── index.html               # Haupt-HTML
│   ├── css/style.css            # Styling
│   └── js/app.js                # App-Logik mit PDF.js
├── assets/                       # Android Assets
│   ├── icon-*.png               # App-Icons
│   ├── splash-*.png             # Splash Screens
│   └── file_provider_paths.xml  # File Provider Config
├── store-assets/                 # Play Store Assets
│   ├── PLAY_STORE_LISTING_DE.md # Deutsche Store-Beschreibung
│   ├── PLAY_STORE_LISTING_EN.md # Englische Store-Beschreibung
│   └── screenshots/             # Screenshots für Store
├── config.xml                    # Cordova Konfiguration
├── package.json                  # NPM Dependencies
├── BUILD_GUIDE.md                # Vollständige Build-Anleitung
├── PRIVACY_POLICY.md             # Datenschutzerklärung
└── README.md                     # Diese Datei
```

## 🛠️ Technologien

- **Framework:** Apache Cordova 12
- **PDF-Rendering:** PDF.js 3.11.174 (Mozilla)
- **Target SDK:** Android 13 (API 33)
- **Min SDK:** Android 7.0 (API 24)
- **Sprache:** HTML, CSS, JavaScript

## 🔧 Voraussetzungen

- Node.js 16+
- Java JDK 11 oder 17
- Android Studio & Android SDK
- Cordova CLI

Siehe `BUILD_GUIDE.md` für detaillierte Setup-Anleitung.

## 📤 Google Play Store

### Veröffentlichung:

1. **Release AAB bauen:**
   ```bash
   cordova build android --release -- --packageType=bundle
   ```

2. **AAB-Datei:** `platforms/android/app/build/outputs/bundle/release/app-release.aab`

3. **Im Play Console hochladen**

4. **Store-Listing ausfüllen** (siehe `store-assets/PLAY_STORE_LISTING_*.md`)

**Vollständige Anleitung:** Siehe `BUILD_GUIDE.md` → "Google Play Store Upload"

## 🔐 Datenschutz

Diese App:
- ❌ Sammelt KEINE Daten
- ❌ Nutzt KEIN Tracking
- ❌ Zeigt KEINE Werbung
- ❌ Benötigt KEIN Internet
- ✅ Alle Dateien bleiben lokal

**Privacy Policy:** Siehe `PRIVACY_POLICY.md`

## 📄 Lizenz

MIT License - Du kannst diese App frei nutzen, modifizieren und verkaufen.

Siehe `LICENSE` für Details.

## 🐛 Bug Reports & Feature Requests

**Email:** support@purepdf.app

Oder erstelle ein Issue im Repository.

## 🎨 Anpassungen

### App-Name ändern:

In `config.xml`:
```xml
<name>Dein App Name</name>
```

### Package-ID ändern:

In `config.xml`:
```xml
<widget id="com.deinefirma.appname" ...>
```

### Farben ändern:

In `www/css/style.css`:
```css
/* Primärfarbe */
background: #1abc9c;  /* Ändere zu deiner Farbe */

/* Hintergrund */
background: #2c3e50;
```

### Icons ersetzen:

- Erstelle Icons in verschiedenen Größen
- Platziere in `assets/`
- Pfade in `config.xml` sind bereits gesetzt

## 🔄 Updates

### Version erhöhen:

In `config.xml`:
```xml
<widget ... version="1.0.1" ...>
```

### Neu bauen & hochladen:
```bash
cordova build android --release -- --packageType=bundle
```

Dann in Play Console hochladen.

## 💡 Tipps

1. **Teste auf echtem Gerät** vor Release
2. **Nutze Beta-Testing** in Play Console
3. **Antworte auf Reviews** schnell & freundlich
4. **Regelmäßige Updates** verbessern Rankings
5. **ASO (App Store Optimization)** beachten

## 📊 Statistiken (nach Veröffentlichung)

- Downloads
- Aktive Nutzer
- Bewertungen
- Absturzberichte

Alles in Play Console verfügbar.

## ❓ FAQ

**Q: Wie groß ist die App?**
A: Ca. 5-8 MB (sehr klein!)

**Q: Funktioniert offline?**
A: Ja, komplett offline nutzbar.

**Q: Kostet die App etwas?**
A: Nein, 100% kostenlos.

**Q: Gibt es In-App-Käufe?**
A: Nein, keine In-App-Käufe.

**Q: Warum braucht die App Storage-Permission?**
A: Nur um PDF-Dateien zu öffnen, die du auswählst.

**Q: Werden meine Dateien hochgeladen?**
A: Nein! Alle Dateien bleiben auf deinem Gerät.

## 🚀 Nächste Schritte

1. ✅ `BUILD_GUIDE.md` lesen
2. ✅ Entwicklungsumgebung einrichten
3. ✅ App testen
4. ✅ Release-Build erstellen
5. ✅ Play Store Listing vorbereiten
6. ✅ App hochladen
7. ✅ Warten auf Freigabe (1-7 Tage)
8. ✅ Veröffentlichen! 🎉

---

**Viel Erfolg mit deiner App! 💪**

Bei Fragen: support@purepdf.app
