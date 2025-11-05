# ⚡ API Master Mobile - Quick Start Guide

## 🎯 In 5 Minuten zur laufenden App!

### Schritt 1: WSL Terminal öffnen

```bash
# Navigiere zum Projekt
cd /mnt/d/claudeapps/"API Master"/mobile
```

### Schritt 2: Dependencies installieren

```bash
# Installiere alle Pakete
npm install

# Installiere Expo CLI global (falls noch nicht vorhanden)
npm install -g expo-cli
```

### Schritt 3: Development Server starten

```bash
# Starte Expo Development Server
npm start
```

**Was passiert:**
- Metro Bundler startet
- QR-Code wird angezeigt
- Terminal zeigt Optionen (a=Android, i=iOS, w=Web)

### Schritt 4: App auf Gerät testen

**Option A: Mit Expo Go (Empfohlen für schnellen Test)**

1. **Expo Go App** auf Android-Gerät installieren:
   - Google Play Store öffnen
   - "Expo Go" suchen
   - Installieren

2. **QR-Code scannen:**
   - Expo Go App öffnen
   - "Scan QR Code" antippen
   - QR-Code aus Terminal scannen

3. **App lädt automatisch!**

**Option B: Android Studio Emulator**

```bash
# Emulator starten (falls Android Studio installiert)
emulator -avd Pixel_5_API_33

# Dann in neuem Terminal:
npm start
# Drücke 'a' für Android
```

### Schritt 5: App testen

**Demo-Login verwenden:**
- E-Mail: `demo@apimaster.com`
- Passwort: `demo123`

**Features testen:**
- ✅ Dashboard mit Stats
- ✅ Chat mit Claude KI
- ✅ API Keys Management
- ✅ Compliance Tracker
- ✅ Werbelinks

---

## 🚀 Production Build erstellen

### Vorbereitung

```bash
# Expo Account erstellen (einmalig)
expo register

# Oder einloggen
expo login

# EAS CLI installieren
npm install -g eas-cli

# EAS konfigurieren
eas build:configure
```

### Preview Build (APK zum Testen)

```bash
# APK erstellen
eas build --platform android --profile preview

# Dauer: ~15-20 Minuten
# Download-Link wird im Terminal angezeigt
```

### Production Build (AAB für Google Play)

```bash
# Production Build
eas build --platform android --profile production

# Build-Status prüfen
eas build:list
```

---

## 📱 Alle wichtigen Befehle

### Development

```bash
# Server starten
npm start

# Nur Android
expo start --android

# Cache löschen
expo start -c

# Tunnel-Modus (für Firewall-Probleme)
expo start --tunnel
```

### Build & Deploy

```bash
# Preview APK
eas build -p android --profile preview

# Production AAB
eas build -p android --profile production

# Build-History
eas build:list

# Build abbrechen
eas build:cancel <build-id>
```

### Debugging

```bash
# Logs anzeigen
npx react-native log-android

# Dependencies prüfen
npm audit

# Expo Doctor (Probleme finden)
expo doctor
```

---

## 🛠️ Troubleshooting

### Problem: "command not found: expo"

```bash
# Global installieren
npm install -g expo-cli

# PATH prüfen
echo $PATH
```

### Problem: "Unable to resolve module"

```bash
# Cache löschen und neu installieren
rm -rf node_modules
npm install
expo start -c
```

### Problem: "Network response timed out"

```bash
# Tunnel-Modus verwenden
expo start --tunnel
```

### Problem: Build schlägt fehl

```bash
# Cache löschen
eas build --platform android --clear-cache

# Logs prüfen
eas build:view <build-id>
```

---

## 📋 Checkliste vor Google Play Upload

- [ ] App vollständig getestet
- [ ] Alle Features funktionieren
- [ ] Claude API Key funktioniert
- [ ] Screenshots erstellt (mind. 2)
- [ ] Icon 512x512 erstellt
- [ ] Feature Graphic 1024x500 erstellt
- [ ] Store Listing Text bereit
- [ ] Privacy Policy online
- [ ] Google Play Developer Account ($25)
- [ ] Production Build erstellt (AAB)

---

## 🎨 Next Steps

1. **Teste lokal** mit Expo Go
2. **Erstelle Preview Build** zum Testen
3. **Sammle Feedback** von Beta-Testern
4. **Erstelle Screenshots** in der App
5. **Bereite Store Assets vor**
6. **Erstelle Production Build**
7. **Upload zu Google Play**
8. **Marketing starten!**

---

## 💡 Pro-Tipps

### Schneller entwickeln:
```bash
# Hot Reload aktiviert (Standard)
# Änderungen werden automatisch übernommen
# Einfach Code editieren und speichern!
```

### Screenshots erstellen:
```bash
# Auf Android-Gerät:
# Volume Down + Power Button

# Im Emulator:
# Camera-Button in Toolbar
```

### Expo Go Alternativen:
```bash
# Development Build (mehr Kontrolle)
eas build --profile development --platform android
```

---

## 📞 Hilfe benötigt?

**Dokumentation:**
- Expo Docs: https://docs.expo.dev
- React Navigation: https://reactnavigation.org
- Anthropic API: https://docs.anthropic.com

**Support:**
- E-Mail: support@apimaster.com
- GitHub: github.com/apimaster/mobile

---

## ✅ Zusammenfassung: Die 3 wichtigsten Befehle

```bash
# 1. Installieren
npm install

# 2. Starten (Development)
npm start

# 3. Bauen (Production)
eas build -p android --profile production
```

**Das war's! 🎉**

Die App läuft jetzt lokal und kann auf Expo Go getestet werden.

---

**Viel Erfolg! 🚀**
