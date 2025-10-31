# 🚀 Quick Start - In 5 Schritten zur Play Store App

## ⚡ Schnellstart (für Erfahrene)

```bash
# 1. Dependencies installieren
npm install

# 2. Android hinzufügen
cordova platform add android

# 3. Debug testen
cordova run android

# 4. Release bauen
cordova build android --release -- --packageType=bundle

# 5. AAB hochladen
# → platforms/android/app/build/outputs/bundle/release/app-release.aab
```

---

## 📋 Schritt-für-Schritt (für Anfänger)

### Schritt 1: Software installieren ⏱️ 30 Min

**Windows:**
1. [Node.js](https://nodejs.org/) installieren (LTS Version)
2. [Java JDK 17](https://adoptium.net/) installieren
3. [Android Studio](https://developer.android.com/studio) installieren
4. In Android Studio: SDK Platform 33 installieren

**Dann in CMD:**
```cmd
npm install -g cordova
```

### Schritt 2: Projekt einrichten ⏱️ 5 Min

```bash
cd pure-pdf-android
npm install
cordova platform add android
```

### Schritt 3: App testen ⏱️ 10 Min

**Option A: Mit Emulator**
1. Android Studio öffnen
2. Device Manager → Create Virtual Device
3. Pixel 5 wählen, Android 13
4. Emulator starten

```bash
cordova run android
```

**Option B: Mit echtem Handy**
1. Handy per USB verbinden
2. USB-Debugging aktivieren (7x auf Build-Nummer tippen)

```bash
cordova run android --device
```

### Schritt 4: Release bauen ⏱️ 15 Min

**Keystore erstellen (einmalig):**
```bash
keytool -genkey -v -keystore pure-pdf-release.keystore -alias pure-pdf -keyalg RSA -keysize 2048 -validity 10000
```

Passwort vergeben und merken!

**build.json erstellen:**
```json
{
  "android": {
    "release": {
      "keystore": "pure-pdf-release.keystore",
      "storePassword": "DEIN-PASSWORT",
      "alias": "pure-pdf",
      "password": "DEIN-PASSWORT"
    }
  }
}
```

**AAB bauen:**
```bash
cordova build android --release -- --packageType=bundle
```

**Fertig!** AAB liegt in: `platforms/android/app/build/outputs/bundle/release/app-release.aab`

### Schritt 5: Play Store Upload ⏱️ 30 Min

1. **[Play Console](https://play.google.com/console) Account erstellen** (25$ Gebühr)

2. **"App erstellen"** klicken
   - Name: Pure PDF Viewer
   - Kostenlos
   - Sprache: Deutsch

3. **Store-Listing ausfüllen:**
   - Kopiere Texte aus `store-assets/PLAY_STORE_LISTING_DE.md`
   - Screenshots erstellen (siehe unten)
   - Icon hochladen (512x512 PNG)

4. **AAB hochladen:**
   - Production → Neues Release
   - `app-release.aab` hochladen
   - Release-Hinweise schreiben

5. **"Zur Prüfung senden"** klicken

6. **Warten** (24-48h meist)

7. **Fertig!** 🎉 App ist live!

---

## 📸 Screenshots erstellen

### Mit Android Studio Emulator:

1. App starten im Emulator
2. PDF öffnen
3. Emulator-Toolbar → Kamera-Symbol
4. Speichern unter `store-assets/screenshots/`

**Mindestens 2 Screenshots:**
1. Welcome Screen (vor PDF-Öffnung)
2. PDF geöffnet mit Toolbar

**Empfohlen 4-8 Screenshots:**
3. PDF mit Zoom
4. Seitennavigation
5. Verschiedene PDF-Typen
6. Landscape-Modus

### Mit echtem Gerät:

1. App starten
2. Power + Leiser gleichzeitig drücken
3. Screenshots auf PC kopieren

---

## 🎨 Store Assets Checkliste

Für Play Store brauchst du:

- [ ] **App-Icon:** 512x512 PNG (quadratisch, kein Schatten)
- [ ] **Feature Graphic:** 1024x500 PNG (Banner für Store)
- [ ] **Screenshots:** 2-8 Stück (Handy: 1080x1920 oder ähnlich)
- [ ] **Kurzbeschreibung:** Max 80 Zeichen
- [ ] **Vollständige Beschreibung:** Max 4000 Zeichen
- [ ] **Privacy Policy URL:** Online hochladen (GitHub Pages, eigene Website)

**Texte fertig in:** `store-assets/PLAY_STORE_LISTING_DE.md`

---

## ⚠️ Häufige Probleme

### "Command not found: cordova"
```bash
npm install -g cordova
```

### "SDK not found"
```cmd
# Windows:
setx ANDROID_SDK_ROOT "C:\Users\DEIN-NAME\AppData\Local\Android\Sdk"

# Neu starten CMD
```

### "Build failed"
```bash
cordova clean
cordova platform remove android
cordova platform add android
cordova build android
```

### "APK signing error"
- Prüfe `build.json` Passwörter
- Prüfe dass `pure-pdf-release.keystore` existiert

---

## 💡 Pro-Tipps

### 1. Beta-Test zuerst
- Play Console → Testing → Closed Testing
- Lade 5-10 Freunde als Tester ein
- Teste 1 Woche

### 2. ASO (App Store Optimization)
- Gute Keywords in Beschreibung
- Schöne Screenshots
- Regelmäßige Updates
- Auf Reviews antworten

### 3. Marketing
- Social Media Posts (LinkedIn, Twitter)
- Reddit Posts (r/androidapps, r/productivity)
- Product Hunt Launch
- Blog-Post schreiben

### 4. Monetarisierung (später)
- In-App-Käufe für Premium-Features
- Admob-Werbung (optional)
- Subscription-Modell

---

## 📊 Nach Veröffentlichung

**Play Console Dashboard prüfen:**
- Downloads / Tag
- Aktive Nutzer
- Bewertungen
- Absturzberichte

**Auf Reviews antworten:**
- Positiv: Danke sagen
- Negativ: Problem lösen, Update ankündigen

**Updates planen:**
- Bug-Fixes: Sofort
- Neue Features: Monatlich

---

## 🎯 Ziel

**1000 Downloads im ersten Monat!**

Wie?
- Gute Store-Optimierung (ASO)
- Social Media Marketing
- Auf Reviews antworten
- Features basierend auf Feedback

---

## ✅ Checkliste - Vor Upload

- [ ] App getestet auf echtem Gerät
- [ ] Alle Permissions funktionieren
- [ ] Screenshots erstellt (mind. 2)
- [ ] Store-Listing-Texte vorbereitet
- [ ] Privacy Policy online
- [ ] AAB gebaut und getestet
- [ ] Release-Hinweise geschrieben
- [ ] Icon & Feature Graphic fertig

**Alles gecheckt? → Upload starten! 🚀**

---

**Bei Fragen:** Siehe `BUILD_GUIDE.md` oder `README.md`

**Viel Erfolg! 💪**
