# 🌱 Grow Master - Installations-Anleitung

## Schnellstart (Lokales Testen)

### Option 1: Python Web Server (Empfohlen)

```bash
cd grow-master-app/www
python3 -m http.server 8000
```

Öffne dann: http://localhost:8000

### Option 2: Node.js HTTP Server

```bash
cd grow-master-app/www
npx http-server -p 8000
```

Öffne dann: http://localhost:8000

### Option 3: NPM Script

```bash
cd grow-master-app
npm run serve
```

## Installation als Progressive Web App (PWA)

### Auf dem Smartphone installieren

#### Android (Chrome/Edge)
1. Öffne die App im Browser (deployte Version mit HTTPS)
2. Menü (⋮) → **"App installieren"**
3. Fertig! App ist jetzt auf dem Homescreen

#### iOS (Safari)
1. Öffne die App in Safari
2. Teilen-Symbol (□↑) → **"Zum Home-Bildschirm"**
3. Fertig! App ist jetzt auf dem Homescreen

## Native App-Build (Android/iOS)

### Voraussetzungen

**Für alle Plattformen:**
```bash
npm install -g cordova
```

**Für Android:**
- Java JDK 11+
- Android Studio
- Android SDK (API Level 24+)
- Gradle

**Für iOS (nur macOS):**
- Xcode 14+
- CocoaPods

### Android-Build

```bash
# 1. Ins Projekt-Verzeichnis
cd grow-master-app

# 2. Abhängigkeiten installieren
npm install

# 3. Android-Plattform hinzufügen
cordova platform add android

# 4. App bauen (Debug)
cordova build android

# 5. Auf verbundenem Gerät installieren
cordova run android

# 6. Release-Build erstellen
cordova build android --release

# 7. APK signieren (für Play Store)
# Siehe: https://developer.android.com/studio/publish/app-signing
```

Die APK findest du in:
`platforms/android/app/build/outputs/apk/debug/app-debug.apk`

### iOS-Build (nur macOS)

```bash
# 1. Ins Projekt-Verzeichnis
cd grow-master-app

# 2. iOS-Plattform hinzufügen
cordova platform add ios

# 3. App bauen
cordova build ios

# 4. In Xcode öffnen
open platforms/ios/Grow\ Master.xcworkspace

# 5. In Xcode:
# - Signierung konfigurieren (Developer Account nötig)
# - Gerät auswählen
# - Run (⌘R)
```

## Online Deployment

### GitHub Pages

```bash
# 1. GitHub Repository erstellen
# 2. Code committen
git add .
git commit -m "Grow Master App"
git push origin main

# 3. GitHub Pages aktivieren
# Repo Settings → Pages → Source: main branch → /www folder
```

### Netlify

```bash
# 1. Netlify Account erstellen: https://netlify.com
# 2. "New site from Git" oder Drag & Drop
# 3. Deploy Settings:
#    Build command: (leer)
#    Publish directory: www
```

### Vercel

```bash
cd grow-master-app/www
npx vercel

# Folge den Anweisungen im Terminal
```

## Troubleshooting

### "ServiceWorker registration failed"
- PWAs brauchen HTTPS oder localhost
- Teste lokal mit `python3 -m http.server`

### "Cordova not found"
```bash
npm install -g cordova
```

### Android-Build schlägt fehl
```bash
# Android SDK Pfad setzen
export ANDROID_SDK_ROOT=/path/to/android/sdk
export ANDROID_HOME=/path/to/android/sdk

# Gradle Cache löschen
cd platforms/android
./gradlew clean
```

### iOS-Build schlägt fehl
```bash
# CocoaPods installieren
sudo gem install cocoapods

# Pods installieren
cd platforms/ios
pod install
```

## Support

Bei Problemen:
- Email: support@aistormcreate.com
- GitHub Issues: [Repository URL]
- Antwortzeit: < 24h

---

Viel Erfolg! 🌱
