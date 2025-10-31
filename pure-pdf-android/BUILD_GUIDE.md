# Build Guide - Pure PDF Viewer für Android

Komplette Anleitung zum Bauen und Veröffentlichen der App im Google Play Store.

## 📋 Voraussetzungen

### Software installieren:

1. **Node.js** (v16+)
   ```bash
   node --version
   npm --version
   ```

2. **Java JDK** (v11 oder v17)
   ```bash
   java -version
   javac -version
   ```
   Download: https://adoptium.net/

3. **Android Studio**
   Download: https://developer.android.com/studio

   Nach Installation:
   - SDK Manager öffnen
   - Android SDK Platform 33 installieren
   - Android SDK Build-Tools 33.0.0 installieren
   - Android SDK Platform-Tools installieren

4. **Gradle** (wird mit Android Studio installiert)

5. **Cordova CLI**
   ```bash
   npm install -g cordova
   ```

### Umgebungsvariablen setzen:

**Windows:**
```cmd
setx ANDROID_SDK_ROOT "C:\Users\DEIN-USERNAME\AppData\Local\Android\Sdk"
setx JAVA_HOME "C:\Program Files\Eclipse Adoptium\jdk-17.0.x-hotspot"
```

**Linux/Mac:**
```bash
export ANDROID_SDK_ROOT=$HOME/Android/Sdk
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk
export PATH=$PATH:$ANDROID_SDK_ROOT/platform-tools
export PATH=$PATH:$ANDROID_SDK_ROOT/tools
```

## 🚀 Projekt einrichten

### 1. Dependencies installieren

```bash
cd pure-pdf-android
npm install
```

### 2. Android-Plattform hinzufügen

```bash
cordova platform add android
```

### 3. Plugins überprüfen

```bash
cordova plugin list
```

Sollte zeigen:
- cordova-plugin-file
- cordova-plugin-file-opener2
- cordova-plugin-chooser
- cordova-plugin-splashscreen
- cordova-plugin-statusbar
- cordova-plugin-whitelist

## 🧪 Testen (Debug Build)

### Mit Emulator:

1. **Android Studio öffnen**
2. **AVD Manager** öffnen (Tools → Device Manager)
3. **Virtuelles Gerät erstellen** (z.B. Pixel 5, Android 13)
4. **Emulator starten**

Dann:
```bash
cordova run android
```

### Mit echtem Gerät:

1. **USB-Debugging aktivieren** auf dem Handy:
   - Einstellungen → Über das Telefon
   - 7x auf "Build-Nummer" tippen
   - Zurück → Entwickleroptionen
   - USB-Debugging aktivieren

2. **Gerät per USB verbinden**

3. **Überprüfen:**
   ```bash
   adb devices
   ```

4. **App ausführen:**
   ```bash
   cordova run android --device
   ```

## 📦 Release Build erstellen

### Schritt 1: Keystore generieren (einmalig)

**WICHTIG:** Diesen Keystore gut aufbewahren! Ohne ihn kannst du keine Updates veröffentlichen!

```bash
keytool -genkey -v -keystore pure-pdf-release.keystore -alias pure-pdf -keyalg RSA -keysize 2048 -validity 10000
```

Fragen beantworten:
- Passwort: **[DEIN-SICHERES-PASSWORT]** (gut merken!)
- Name: Dein Name
- Organisation: Deine Firma
- Stadt, Bundesland, Land ausfüllen

**Keystore-Datei sichern:**
- Kopiere `pure-pdf-release.keystore` an sicheren Ort
- Notiere das Passwort

### Schritt 2: build.json erstellen

Erstelle Datei `build.json` im Projekt-Root:

```json
{
  "android": {
    "release": {
      "keystore": "pure-pdf-release.keystore",
      "storePassword": "DEIN-KEYSTORE-PASSWORT",
      "alias": "pure-pdf",
      "password": "DEIN-KEYSTORE-PASSWORT",
      "keystoreType": ""
    }
  }
}
```

**WICHTIG:** `build.json` NICHT in Git committen! Steht in `.gitignore`.

### Schritt 3: Release APK bauen

```bash
cordova build android --release
```

**Output:** `platforms/android/app/build/outputs/apk/release/app-release.apk`

### Schritt 4: AAB (Android App Bundle) bauen

**Empfohlen für Play Store ab 2021!**

```bash
cordova build android --release -- --packageType=bundle
```

**Output:** `platforms/android/app/build/outputs/bundle/release/app-release.aab`

## ✅ APK/AAB überprüfen

### APK-Größe prüfen:

```bash
ls -lh platforms/android/app/build/outputs/apk/release/app-release.apk
```

Sollte ca. 5-8 MB sein.

### AAB-Größe prüfen:

```bash
ls -lh platforms/android/app/build/outputs/bundle/release/app-release.aab
```

Sollte ca. 4-6 MB sein.

### APK testen (vor Upload):

```bash
adb install platforms/android/app/build/outputs/apk/release/app-release.apk
```

## 📤 Google Play Store Upload

### Schritt 1: Play Console Account

1. Gehe zu [Google Play Console](https://play.google.com/console)
2. Erstelle Account (25$ einmalige Gebühr)
3. Verifiziere Identität

### Schritt 2: Neue App erstellen

1. **"App erstellen"** klicken
2. **App-Details:**
   - Name: `Pure PDF Viewer`
   - Standardsprache: Deutsch
   - App/Spiel: App
   - Kostenlos/Kostenpflichtig: Kostenlos

3. **Erklärungen:**
   - Datenschutzrichtlinie: URL hochladen (siehe unten)
   - App-Zugriffsbestimmungen: Keine speziellen

### Schritt 3: Store-Eintrag erstellen

#### App-Details:
- **Name:** Pure PDF Viewer
- **Kurzbeschreibung:** (siehe `PLAY_STORE_LISTING_DE.md`)
- **Vollständige Beschreibung:** (siehe `PLAY_STORE_LISTING_DE.md`)

#### Grafiken:
- **App-Symbol:** 512x512 PNG (quadratisch)
- **Feature Graphic:** 1024x500 PNG (siehe `store-assets/feature-graphic.png`)
- **Screenshots:** Mindestens 2, empfohlen 4-8
  - Handy: 1080x1920 oder ähnlich
  - 7" Tablet (optional)
  - 10" Tablet (optional)

#### Kategorisierung:
- **Kategorie:** Produktivität
- **Tags:** PDF, Dokumente, Reader

#### Kontaktdaten:
- **E-Mail:** support@purepdf.app
- **Datenschutzrichtlinie:** URL zu `PRIVACY_POLICY.md`

### Schritt 4: Inhaltsfreigabe

1. **Alterseinstufung:**
   - Fragebogen ausfüllen
   - Sollte "USK ab 0" / "Everyone" ergeben

2. **Zielgruppenauswahl:**
   - Hauptzielgruppe: 16+ oder Allgemein
   - Enthält Werbung: **NEIN**

3. **Datenschutz & Sicherheit:**
   - Datenerfassung: **NEIN** (wir sammeln nichts)
   - Datenschutzrichtlinie: URL angeben

### Schritt 5: App-Releases

1. **Production Track** wählen
2. **"Release erstellen"** klicken
3. **AAB hochladen:**
   - `app-release.aab` hochladen
   - Version prüfen (sollte 1.0.0 sein)

4. **Release-Namen:** "Version 1.0.0 - Initiale Veröffentlichung"
5. **Release-Hinweise:**
   ```
   🎉 Erste Version von Pure PDF Viewer!

   Features:
   • PDF-Dateien öffnen und lesen
   • Zoom & Navigation
   • Dunkles Theme
   • Keine Werbung
   • 100% kostenlos
   ```

6. **"Prüfung starten"** klicken

### Schritt 6: Warten auf Freigabe

- Google prüft die App (1-7 Tage, meist 24-48h)
- Du bekommst Email bei:
  - Genehmigung (App ist live!)
  - Ablehnung (mit Gründen, kannst korrigieren und neu einreichen)

## 🔄 Updates veröffentlichen

### Version erhöhen:

In `config.xml`:
```xml
<widget id="com.purepdf.viewer" version="1.0.1" ...>
```

### Neu bauen:
```bash
cordova build android --release -- --packageType=bundle
```

### In Play Console hochladen:
1. **Production** → **Neues Release erstellen**
2. Neue AAB hochladen
3. Release-Hinweise schreiben
4. Veröffentlichen

## ⚠️ Häufige Fehler

### Build schlägt fehl:

```bash
# Cache löschen
cordova clean

# Plattform neu hinzufügen
cordova platform remove android
cordova platform add android

# Neu bauen
cordova build android --release
```

### "SDK not found":
```bash
# ANDROID_SDK_ROOT setzen (siehe oben)
echo $ANDROID_SDK_ROOT  # Linux/Mac
echo %ANDROID_SDK_ROOT%  # Windows
```

### "Keystore not found":
- Stelle sicher dass `pure-pdf-release.keystore` im Projekt-Root liegt
- Prüfe Pfad in `build.json`

### "APK zu groß" (>150MB):
- PDF.js von CDN wird genutzt (kein Problem)
- Sollte nur 5-8 MB sein

## 📊 Nach Veröffentlichung

### Statistiken prüfen:
- Play Console → Statistiken
- Downloads, Absturzberichte, Bewertungen

### Auf Reviews antworten:
- Play Console → Bewertungen
- Schnell & freundlich antworten

### Updates planen:
- Bug-Fixes: Sofort
- Neue Features: Monatlich/Quartalsweise

## 💡 Tipps

1. **Beta-Test vor Production:**
   - Erstelle "Closed Testing" Track
   - Lade Freunde als Tester ein
   - Teste ausgiebig

2. **Screenshots professionell:**
   - Nutze echtes Gerät oder Emulator
   - Zeige App in Aktion
   - Füge beschreibenden Text hinzu

3. **ASO (App Store Optimization):**
   - Gute Keywords in Beschreibung
   - Regelmäßig Updates
   - Auf Reviews antworten
   - Screenshots aktuell halten

---

**Viel Erfolg mit deiner App! 🚀**
