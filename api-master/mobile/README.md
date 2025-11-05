# 🚀 API Master - Mobile App (Android)

> Professionelles Multi-API Management mit Claude KI-Integration

Die mobile Android-App für API Master - Verwalten Sie 20+ APIs sicher, nutzen Sie Claude für intelligente Analysen und bleiben Sie compliance-konform mit der Kleinunternehmer-Regelung.

---

## ✨ Features

### 🔐 Sicheres API Management
- **AES-256-GCM Verschlüsselung** für alle API Keys
- **Proxy-API-Key System** - Keine direkten Keys im Code
- **Biometrische Authentifizierung** (Face ID / Fingerabdruck)
- **Automatische Key-Rotation**

### 🤖 Claude KI-Integration
- **Integrierter Chat** mit Anthropic Claude
- **API-Sicherheitsanalyse** durch KI
- **Code-Snippet Generierung**
- **Intelligente Optimierungsvorschläge**
- **Kostenanalyse und Compliance-Checks**

### 📊 Professionelles Dashboard
- **Echtzeit-Überwachung** aller APIs
- **Nutzungsstatistiken** mit Charts
- **Performance-Monitoring**
- **Kosten-Tracking**

### 💼 Kleinunternehmer-Compliance (Deutschland)
- **§19 UStG Überwachung** automatisch
- **€22.000 Jahresumsatz-Tracking**
- **Digitale Rechnungserstellung**
- **EU-konforme Invoices**

---

## 🚀 Quick Start

### Voraussetzungen

```bash
Node.js 18+
npm oder yarn
Expo CLI
```

### Installation

```bash
# Repository clonen (falls noch nicht vorhanden)
cd "D:\claudeapps\API Master\mobile"

# Dependencies installieren
npm install

# Expo CLI installieren (global)
npm install -g expo-cli eas-cli
```

### Development Server starten

```bash
# Server starten
npm start

# Oder direkt:
expo start
```

### Auf Gerät testen

1. **Expo Go App** auf Android-Gerät installieren (Google Play Store)
2. **QR-Code scannen** der im Terminal angezeigt wird
3. **App testet** mit Demo-Login:
   - E-Mail: `demo@apimaster.com`
   - Passwort: `demo123`

---

## 🏗️ Production Build

### Preview Build (APK zum Testen)

```bash
# APK erstellen
eas build --platform android --profile preview

# Build herunterladen und auf Gerät installieren
```

### Production Build (AAB für Google Play)

```bash
# Bei Expo anmelden
expo login

# Production Build erstellen
eas build --platform android --profile production

# Build-Status prüfen
eas build:list
```

**Detaillierte Anleitung:** Siehe [BUILD_GUIDE.md](./BUILD_GUIDE.md)

---

## 📁 Projekt-Struktur

```
mobile/
├── App.js                          # Haupt-App-Komponente
├── app.json                        # Expo Konfiguration
├── eas.json                        # EAS Build Konfiguration
├── package.json                    # Dependencies
├── babel.config.js                 # Babel Konfiguration
├── assets/                         # App-Icons, Splash Screen
│   ├── icon.png
│   ├── adaptive-icon.png
│   └── splash.png
├── src/
│   ├── screens/                    # App-Screens
│   │   ├── LoginScreen.js
│   │   ├── DashboardScreen.js
│   │   ├── ChatScreen.js
│   │   ├── APIKeysScreen.js
│   │   ├── ComplianceScreen.js
│   │   ├── SettingsScreen.js
│   │   └── WerbelinksScreen.js
│   ├── services/                   # API Services
│   │   └── anthropicService.js    # Claude Integration
│   ├── components/                 # Wiederverwendbare Komponenten
│   └── utils/                      # Helper-Funktionen
├── google-play-assets/             # Store Assets
│   ├── store-listing.md
│   ├── ASSET_REQUIREMENTS.md
│   └── screenshots/
└── BUILD_GUIDE.md                  # Detaillierte Build-Anleitung
```

---

## 🎨 Screens Übersicht

### 1. Login Screen
- E-Mail/Passwort Authentifizierung
- Demo-Zugang verfügbar
- Clean, professionelles Design

### 2. Dashboard
- API-Nutzung Übersicht
- Charts (letzte 7 Tage)
- Compliance-Status
- Schnellzugriff-Buttons

### 3. API Keys
- Liste aller API Keys
- Proxy-Key Anzeige
- Copy-to-Clipboard
- Status-Badges
- Analytics pro Key

### 4. Chat (Claude Integration)
- Conversation mit Claude
- Schnellaktionen:
  - API Sicherheit analysieren
  - Code-Snippet generieren
  - Compliance prüfen
  - Kosten optimieren
- Token-Usage Tracking

### 5. Compliance
- Kleinunternehmer-Status
- Jahresumsatz-Tracker
- Progress Bar (€/€22.000)
- Wichtige Hinweise (§19 UStG)
- Claude-Analyse Button

### 6. Einstellungen
- Biometrische Authentifizierung
- Dark Mode Toggle
- Benachrichtigungen
- Abo-Verwaltung
- Support & Hilfe

### 7. Werbelinks
- Cross-Promotion eigener Apps
- Weather App, Task Manager, etc.
- Schöne Card-Designs
- Deep Links

---

## 🔧 Konfiguration

### Anthropic API Key

Konfigurieren Sie Ihren API Key:

```javascript
// src/services/anthropicService.js
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || 'YOUR_ANTHROPIC_API_KEY_HERE';

// Oder erstellen Sie eine .env Datei:
// ANTHROPIC_API_KEY=sk-ant-api03-...
```

### App-Identität

```javascript
// app.json
{
  "expo": {
    "name": "API Master",
    "slug": "api-master",
    "android": {
      "package": "com.aistormcreate.apimaster"
    }
  }
}
```

---

## 📱 Google Play Store Veröffentlichung

### Schritt-für-Schritt:

1. **Build erstellen**
   ```bash
   eas build --platform android --profile production
   ```

2. **Google Play Console** aufrufen
   - play.google.com/console
   - $25 Einmalgebühr zahlen

3. **App erstellen**
   - Neue App anlegen
   - Store Listing ausfüllen (siehe `google-play-assets/store-listing.md`)

4. **Assets hochladen**
   - Icon (512x512)
   - Feature Graphic (1024x500)
   - Screenshots (mindestens 2)

5. **AAB hochladen** und Review starten

**Vollständige Anleitung:** [BUILD_GUIDE.md](./BUILD_GUIDE.md)

---

## 🛠️ Development

### Befehle

```bash
# Development starten
npm start

# Android spezifisch
expo start --android

# iOS (falls Mac verfügbar)
expo start --ios

# Web-Version
expo start --web

# Cache löschen
expo start -c
```

### Debugging

```bash
# React Native Debugger
npm install -g react-devtools

# Logcat (Android)
adb logcat *:S ReactNative:V ReactNativeJS:V
```

---

## 📦 Dependencies

### Haupt-Dependencies:
- **expo:** ~49.0.15 - Framework
- **react-native:** 0.72.6 - Core
- **@anthropic-ai/sdk:** ^0.9.1 - Claude Integration
- **react-navigation:** ^6.x - Navigation
- **react-native-paper:** ^5.11.3 - UI Components
- **expo-secure-store:** ^12.3.1 - Sichere Speicherung
- **expo-local-authentication:** ^13.4.1 - Biometrie

### Vollständige Liste:
Siehe [package.json](./package.json)

---

## 🔒 Sicherheit

### Verschlüsselung:
- **AES-256-GCM** für API Keys
- **Expo Secure Store** für Token
- **Biometrische Auth** für App-Zugang

### Best Practices:
- Keine Secrets im Code (außer Anthropic Key)
- HTTPS für alle API-Calls
- Input Validation
- Secure Storage für sensitive Daten

---

## 🎯 Roadmap

### Version 1.1 (Q1 2025)
- [ ] Push Notifications
- [ ] Offline Mode mit Sync
- [ ] Team Chat Integration
- [ ] API Marketplace

### Version 1.2 (Q2 2025)
- [ ] iOS Version
- [ ] Tablet Optimierung
- [ ] Dark/Light Mode Auto-Switch
- [ ] Multi-Language (PL, FR)

### Version 2.0 (Q3 2025)
- [ ] Enterprise Features
- [ ] Advanced Analytics
- [ ] Custom Workflows
- [ ] Webhook Support

---

## 🐛 Bekannte Issues

### Android:
- Screenshots auf manchen Geräten zeigen schwarzen Rand
  - **Fix:** Device-spezifische Anpassungen in Arbeit

### Expo:
- Erste Build dauert lange (~20 Min)
  - **Normal:** Expo baut auf Remote-Servern

---

## 💬 Support & Community

### Hilfe erhalten:
- **E-Mail:** support@apimaster.com
- **GitHub Issues:** github.com/apimaster/mobile/issues
- **Discord:** discord.gg/apimaster
- **Dokumentation:** docs.apimaster.com

### Beitragen:
Pull Requests willkommen! Siehe [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## 📄 Lizenz

© 2024 Ai Storm Create - Sebastian Beyer

**Kleinunternehmer gem. §19 UStG**

Alle Rechte vorbehalten. Dieses Projekt ist proprietär.

---

## 👨‍💻 Autor

**Sebastian Beyer**
- Firma: Ai Storm Create
- E-Mail: sebastian@aistormcreate.com
- Website: https://aistormcreate.com

---

## 🙏 Credits

- **Anthropic** - Claude AI Integration
- **Expo** - React Native Framework
- **Material Community Icons** - Icons
- **React Navigation** - Navigation Library

---

## 📊 Stats

- **Lines of Code:** ~8.500+
- **Screens:** 7
- **Components:** 20+
- **APIs Supported:** 20+
- **Languages:** Deutsch (Primär), English, Polish, French

---

**Viel Erfolg mit API Master! 🚀**

Fragen? → support@apimaster.com
