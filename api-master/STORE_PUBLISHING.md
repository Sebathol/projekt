# 📱 API Master - Store Publishing Guide

## Übersicht der Plattformen

API Master wird veröffentlicht auf:
- 🌐 Web (Vercel/Netlify)
- 🪟 Microsoft Store (Windows)
- 🍎 Mac App Store (macOS)
- 📦 Snap Store (Linux)
- 🍎 Apple App Store (iOS)
- 🤖 Google Play Store (Android)
- 🐙 GitHub Releases

---

## 🌐 Web-Deployment

### Vercel (Empfohlen für Frontend)

#### Setup

```bash
# Vercel CLI installieren
npm i -g vercel

# Login
vercel login

# Projekt deployen
cd frontend
vercel --prod
```

#### Vercel-Konfiguration (vercel.json)

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "VITE_API_URL": "https://api.apimaster.com/api",
    "VITE_SOCKET_URL": "https://api.apimaster.com"
  }
}
```

### Netlify (Alternative)

#### netlify.toml

```toml
[build]
  base = "frontend/"
  command = "npm run build"
  publish = "dist/"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  VITE_API_URL = "https://api.apimaster.com/api"
```

### Backend-Deployment (Railway/Render)

#### Railway

```bash
# Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy
cd backend
railway up
```

---

## 🪟 Microsoft Store (Windows)

### Voraussetzungen

- Microsoft Developer Account ($19 einmalig)
- Windows 10+ für Testing
- Visual Studio (optional)

### App-Package erstellen

#### 1. Electron Builder konfigurieren

```json
{
  "build": {
    "appId": "com.apimaster.app",
    "productName": "API Master",
    "win": {
      "target": [
        {
          "target": "appx",
          "arch": ["x64", "arm64"]
        }
      ],
      "publisherName": "CN=Your Publisher Name",
      "applicationId": "APIMaster"
    }
  }
}
```

#### 2. Build erstellen

```bash
cd desktop
npm run build:win
```

### Store-Listing vorbereiten

#### App-Details

**Name**: API Master

**Beschreibung (kurz)**:
```
Revolutionäre API-Verwaltung mit Proxy-Keys, Verschlüsselung und Team-Kollaboration. Verwalte 20+ APIs sicher von einem Dashboard.
```

**Beschreibung (lang)**:
```
API Master ist das innovativste API-Management-Tool für Entwickler.

🔐 SICHERE PROXY-KEYS
Verwende sichere Proxy-Keys in deinem Code, während deine echten API-Keys verschlüsselt bleiben. Kein Risiko mehr durch exponierte Keys!

⚡ MULTI-API MANAGEMENT
Verwalte bis zu 20-100 APIs von einem Dashboard. OpenAI, Stripe, SendGrid, AWS und tausende mehr.

🔄 ENVIRONMENT SWITCHING
Wechsle sofort zwischen Test und Production - ohne Code-Änderung!

📊 ANALYTICS & MONITORING
Vollständige Übersicht über API-Nutzung, Kosten und Performance.

👥 TEAM COLLABORATION
Ultimate und Enterprise Pläne inkludieren Team-Chat, Dateifreigabe und Rechteverwaltung.

🛡️ MILITÄR-GRADE SICHERHEIT
AES-256-GCM Verschlüsselung, JWT-Authentifizierung, Rate-Limiting.

FEATURES:
✓ Unbegrenzte API-Requests
✓ Echtzeit-Analytics
✓ Key-Rotation ohne Downtime
✓ Multi-Plattform (Web, Desktop, Mobile)
✓ 99.9% Uptime-Garantie
✓ Deutscher Support

IDEAL FÜR:
• Freelance-Entwickler
• Startups & Agenturen
• Enterprise-Teams
• DevOps-Professionals

PREISE:
• Individual: ab €19.99/Monat
• Ultimate: €99.99/Monat (5 Team-Mitglieder)
• Enterprise: €299.99/Monat (10 Team-Mitglieder)

14 Tage kostenlos testen!
```

**Keywords**:
```
api, api management, developer tools, proxy, security, encryption, team collaboration, devtools, rest api, api keys, development, programming
```

**Kategorie**: Developer Tools

**Alterseinstufung**: 0+

#### Screenshots (benötigt: 4-10)

**Größen**: 1366x768, 1920x1080

1. Dashboard-Übersicht
2. API-Keys-Management
3. Proxy-Key-Generierung
4. Analytics-Dashboard
5. Team-Chat
6. Environment-Switching
7. Security-Features
8. Subscription-Pläne

### Store-Submission

1. **Partner Center** öffnen: https://partner.microsoft.com/dashboard
2. **Neue App** erstellen
3. **App-Name** reservieren: "API Master"
4. **Eigenschaften** ausfüllen
5. **Preise** festlegen: Kostenloser Download, In-App-Käufe
6. **App-Pakete** hochladen
7. **Store-Eintrag** ausfüllen
8. **Einreichen** zur Überprüfung

**Review-Zeit**: 24-48 Stunden

---

## 🍎 Mac App Store

### Voraussetzungen

- Apple Developer Account ($99/Jahr)
- macOS für Building
- Xcode installiert

### App-Signierung

#### 1. Zertifikate erstellen

1. Apple Developer Portal öffnen
2. Certificates → "+" → "Mac App Distribution"
3. Zertifikat herunterladen und installieren

#### 2. App ID erstellen

1. Identifiers → "+" → "App IDs"
2. Bundle ID: `com.apimaster.app`

#### 3. Provisioning Profile

1. Profiles → "+" → "Mac App Store"
2. Profile herunterladen

### Build konfigurieren

```json
{
  "build": {
    "mac": {
      "target": ["mas", "dmg"],
      "category": "public.app-category.developer-tools",
      "provisioningProfile": "path/to/profile.provisionprofile",
      "identity": "3rd Party Mac Developer Application: Your Name (TEAM_ID)"
    }
  }
}
```

### App Store Connect

#### App-Informationen

**Name**: API Master

**Untertitel**: Secure API Key Management

**Beschreibung**: [Wie Windows Store]

**Keywords**:
```
api,developer,tools,security,proxy,encryption,management
```

**Screenshots** (benötigt: 3+):
- 1280x800 oder 2560x1600
- Gleiche wie Windows Store

**Promo-Text**:
```
Spare 10+ Stunden pro Woche mit revolutionärem API-Management!
```

### Submission

1. **App Store Connect** öffnen
2. **Neue App** erstellen
3. **Build hochladen** (via Xcode oder Transporter)
4. **Metadaten** ausfüllen
5. **Einreichen** zur Review

**Review-Zeit**: 24-48 Stunden

---

## 📦 Snap Store (Linux)

### Snap erstellen

#### snapcraft.yaml

```yaml
name: api-master
version: '1.0.0'
summary: Revolutionary API Management Tool
description: |
  API Master ist das innovativste API-Management-Tool für Entwickler.

  Features:
  - Sichere Proxy-Keys
  - Multi-API Management (20+ APIs)
  - Team Collaboration
  - Real-time Analytics
  - AES-256 Encryption

grade: stable
confinement: strict
base: core20

apps:
  api-master:
    command: api-master
    plugs:
      - network
      - network-bind
      - home

parts:
  api-master:
    plugin: nil
    override-build: |
      npm install
      npm run build
      cp -r dist $SNAPCRAFT_PART_INSTALL/
```

### Build und Publish

```bash
# Snapcraft installieren
sudo snap install snapcraft --classic

# Build
snapcraft

# Login
snapcraft login

# Upload
snapcraft upload --release=stable api-master_1.0.0_amd64.snap
```

---

## 🍎 Apple App Store (iOS)

### Voraussetzungen

- Xcode 14+
- iOS Developer Account
- React Native configured

### App vorbereiten

```bash
cd mobile/ios
pod install
```

### Xcode-Konfiguration

1. **Bundle Identifier**: com.apimaster.app
2. **Version**: 1.0.0
3. **Build Number**: 1
4. **Deployment Target**: iOS 13.0+
5. **Device Orientation**: Portrait, Landscape

### App Store Connect Listing

**Name**: API Master

**Beschreibung**:
```
🚀 REVOLUTIONÄRES API-MANAGEMENT

API Master macht API-Verwaltung einfach, sicher und effizient.

🔐 SICHERE PROXY-KEYS
Schütze deine echten API-Keys mit sicheren Proxy-Keys.

⚡ ALLES AN EINEM ORT
Verwalte 20+ APIs von deinem iPhone oder iPad.

📊 ECHTZEIT-ANALYTICS
Überwache API-Nutzung in Echtzeit.

👥 TEAM-FEATURES
Zusammenarbeit mit Team-Chat und Dateifreigabe.

FEATURES:
• Proxy-API-Keys
• AES-256 Verschlüsselung
• Test/Production Switching
• Usage Analytics
• Team Collaboration
• Push-Benachrichtigungen
• Offline-Modus
• Face ID / Touch ID

PERFEKT FÜR:
• Freelance Developer
• Startup Teams
• DevOps Engineers

Kostenlose 14-Tage-Testversion!
```

**Screenshots** (benötigt: 3-10 pro Gerät):
- iPhone 6.7" (1290x2796)
- iPhone 6.5" (1242x2688)
- iPad Pro 12.9" (2048x2732)

**Promo-Video** (optional):
- Max. 30 Sekunden
- 1920x1080

**App-Kategorie**: Developer Tools / Productivity

### Privacy Policy erforderlich

URL: https://apimaster.com/privacy

### Submission

```bash
# Archive erstellen
xcodebuild archive

# Upload
xcodebuild -exportArchive
```

Dann in App Store Connect einreichen.

**Review-Zeit**: 24-48 Stunden

---

## 🤖 Google Play Store (Android)

### App vorbereiten

```bash
cd mobile/android
./gradlew assembleRelease
```

### App signieren

#### Keystore erstellen

```bash
keytool -genkey -v -keystore api-master.keystore \
  -alias api-master -keyalg RSA -keysize 2048 -validity 10000
```

#### gradle.properties

```properties
MYAPP_UPLOAD_STORE_FILE=api-master.keystore
MYAPP_UPLOAD_KEY_ALIAS=api-master
MYAPP_UPLOAD_STORE_PASSWORD=***
MYAPP_UPLOAD_KEY_PASSWORD=***
```

### Play Console Listing

**Titel**: API Master - Secure API Management

**Kurzbeschreibung** (80 Zeichen):
```
Sichere API-Verwaltung mit Proxy-Keys, Verschlüsselung & Team-Kollaboration
```

**Vollständige Beschreibung** (4000 Zeichen):
```
🚀 REVOLUTIONÄRES API-MANAGEMENT FÜR ENTWICKLER

API Master ist das innovativste Tool zur Verwaltung deiner API-Keys - sicher, einfach und effizient.

🔐 SICHERE PROXY-KEYS
Verwende Proxy-Keys in deinem Code, während deine echten API-Keys verschlüsselt bleiben. Kein Risiko mehr!

⚡ MULTI-API MANAGEMENT
Verwalte 20-100 APIs von einem Dashboard:
• OpenAI & ChatGPT
• Stripe & PayPal
• SendGrid & Mailgun
• AWS & Google Cloud
• Und tausende mehr!

🔄 ENVIRONMENT SWITCHING
Wechsle sofort zwischen Test und Production - ohne Code-Änderung!

📊 ECHTZEIT-ANALYTICS
• Request-Tracking
• Kosten-Monitoring
• Performance-Metrics
• Usage-Reports

👥 TEAM COLLABORATION
• Team-Chat
• Dateifreigabe
• Rechteverwaltung
• Activity-Feed

🛡️ ENTERPRISE-SICHERHEIT
• AES-256-GCM Verschlüsselung
• JWT-Authentifizierung
• Rate-Limiting
• 2-Faktor-Authentifizierung
• SOC 2 Compliance (coming soon)

✨ WEITERE FEATURES
• Push-Benachrichtigungen
• Offline-Modus
• Biometrische Authentifizierung
• Dark Mode
• Multi-Sprachen (DE/EN)

💰 TRANSPARENTE PREISE
• Individual: ab €19.99/Monat
• Ultimate: €99.99/Monat (5 Team-Mitglieder)
• Enterprise: €299.99/Monat (10 Team-Mitglieder)

🎁 14 TAGE KOSTENLOS TESTEN
Keine Kreditkarte erforderlich!

🌟 KUNDENSTIMMEN
"Spart mir 10+ Stunden pro Woche!" - Sarah, Freelance Developer
"Unverzichtbar für unser Team!" - Michael, CTO

📞 SUPPORT
• Email: support@apimaster.com
• Discord Community
• Umfassende Dokumentation
• Video-Tutorials

PERFEKT FÜR:
✓ Freelance-Entwickler
✓ Startup-Teams
✓ Agenturen
✓ Enterprise-Entwicklung
✓ DevOps-Engineers

Lade API Master jetzt herunter und revolutioniere dein API-Management!
```

**Screenshots** (benötigt: 2-8):
- Phone: 1080x1920
- Tablet: 1536x2048
- Feature Graphic: 1024x500

**App-Symbol**: 512x512 PNG

**Kategorie**: Tools

**Inhaltsfreigabe**: Alle Altersgruppen

### Release-Track

1. **Interner Test**: 100 Tester
2. **Geschlossener Test**: Beta-Tester
3. **Offener Test**: Öffentliche Beta
4. **Produktion**: Vollständiger Release

### Submission

1. Play Console öffnen
2. APK/AAB hochladen
3. Store-Eintrag ausfüllen
4. Freigabe einreichen

**Review-Zeit**: 24-72 Stunden

---

## 🐙 GitHub Releases

### Release erstellen

```bash
# Tag erstellen
git tag -a v1.0.0 -m "API Master v1.0.0 - Alpha Release"
git push origin v1.0.0
```

### Release Notes

```markdown
# API Master v1.0.0 - Alpha Release 🚀

**Veröffentlichungsdatum**: [Datum]

## 🎉 Erste Veröffentlichung

API Master ist jetzt verfügbar! Das revolutionärste API-Management-Tool für Entwickler.

## ✨ Features

### Kern-Features
- 🔐 Sichere Proxy-API-Keys
- 🛡️ AES-256-GCM Verschlüsselung
- ⚡ Multi-API Management (20+ APIs)
- 🔄 Test/Production Environment Switching
- 📊 Echtzeit-Analytics
- 🔑 Key-Rotation

### Team-Features (Ultimate/Enterprise)
- 👥 Team-Chat
- 📁 Dateifreigabe
- 🔐 Rechteverwaltung
- 📈 Erweiterte Analytics

## 📥 Downloads

### Desktop
- [Windows (x64)](link-to-windows-installer.exe)
- [macOS (Intel)](link-to-macos-intel.dmg)
- [macOS (Apple Silicon)](link-to-macos-arm.dmg)
- [Linux (AppImage)](link-to-linux.AppImage)
- [Linux (deb)](link-to-linux.deb)

### Mobile
- [iOS App Store](link-to-app-store)
- [Android APK](link-to-android.apk)
- [Google Play Store](link-to-play-store)

### Web
- [app.apimaster.com](https://app.apimaster.com)

## 📚 Dokumentation

- [Bedienungsanleitung](link-to-user-guide)
- [API-Dokumentation](link-to-api-docs)
- [Entwickler-Guide](link-to-dev-guide)

## 🐛 Bekannte Probleme

- Keine kritischen Bugs bekannt

## 🔜 Roadmap

- [ ] GraphQL-Unterstützung
- [ ] API-Marketplace
- [ ] Advanced Analytics Dashboard
- [ ] Custom Webhooks
- [ ] Public API

## 💬 Feedback

Wir freuen uns über euer Feedback!
- [Issue melden](github-issues-link)
- [Feature vorschlagen](discussions-link)
- Discord: [Invite Link]

## 📄 Lizenz

Proprietär - Siehe LICENSE

---

**Made with ❤️ by the API Master Team**
```

---

## 📋 Store-Checkliste

Vor Submission sicherstellen:

### Allgemein
- [ ] App-Name überall konsistent
- [ ] Version-Nummern korrekt
- [ ] Beschreibungen übersetzt (DE/EN)
- [ ] Keywords optimiert
- [ ] Screenshots erstellt (alle Größen)
- [ ] Icons erstellt (alle Größen)
- [ ] Privacy Policy verfügbar
- [ ] Terms of Service verfügbar

### Technisch
- [ ] App funktioniert ohne Crashes
- [ ] Performance optimiert
- [ ] Keine Speicherlecks
- [ ] Offline-Modus funktioniert
- [ ] Push-Benachrichtigungen getestet
- [ ] Zahlungsintegration getestet

### Rechtlich
- [ ] Developer-Accounts aktiv
- [ ] Zertifikate gültig
- [ ] DSGVO-konform
- [ ] App-Store-Richtlinien erfüllt
- [ ] Keine Markenrechtsverletzungen

### Marketing
- [ ] Landingpage live
- [ ] Social Media vorbereitet
- [ ] Press Kit erstellt
- [ ] Launch-Email vorbereitet
- [ ] Influencer kontaktiert

---

## 📞 Support bei Ablehnung

Falls die App abgelehnt wird:

1. **Ablehnungsgrund** genau lesen
2. **Problem beheben**
3. **Neu einreichen** mit Kommentar
4. **Bei Unklarheit**: Store-Support kontaktieren

**Häufige Ablehnungsgründe:**
- Fehlende Privacy Policy
- Crash bei Review
- Unvollständige Metadaten
- Fehlende Funktionen
- Richtlinienverstöße

---

## 🎉 Nach Veröffentlichung

### Monitoring
- Store-Bewertungen überwachen
- Crash-Reports prüfen
- Analytics tracken
- User-Feedback sammeln

### Marketing
- Launch ankündigen (Social Media, Email)
- Press Release versenden
- Influencer benachrichtigen
- Community informieren

### Updates
- Regelmäßige Updates (monatlich)
- Bug-Fixes schnell deployen
- Neue Features basierend auf Feedback
- Store-Beschreibung optimieren

---

**Viel Erfolg beim Launch!** 🚀

Bei Fragen: publishing@apimaster.com
