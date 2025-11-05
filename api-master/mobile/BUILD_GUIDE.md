# API Master - Android Build & Deployment Guide

## Vollständige Anleitung zum Erstellen und Veröffentlichen der Android App

---

## 📋 Voraussetzungen

### Software Requirements:
- **Node.js:** 18+ (LTS empfohlen)
- **npm oder yarn:** Neueste Version
- **Expo CLI:** `npm install -g expo-cli eas-cli`
- **Android Studio:** Für lokale Builds (optional)
- **Git:** Für Versionskontrolle

### Accounts:
- **Expo Account:** expo.dev (kostenlos)
- **Google Play Console:** play.google.com/console ($25 Einmalgebühr)
- **Anthropic API Key:** Bereits integriert

---

## 🚀 Schritt 1: Projekt-Setup

### 1.1 Dependencies installieren

```bash
# In das mobile Verzeichnis wechseln
cd "/mnt/d/claudeapps/API Master/mobile"

# oder in Windows CMD:
cd "D:\claudeapps\API Master\mobile"

# Dependencies installieren
npm install

# Expo CLI global installieren (falls noch nicht vorhanden)
npm install -g expo-cli eas-cli
```

### 1.2 Expo-Konto einrichten

```bash
# Bei Expo anmelden
expo login

# Oder neues Konto erstellen
expo register
```

### 1.3 Projekt initialisieren

```bash
# EAS (Expo Application Services) konfigurieren
eas build:configure
```

---

## 🔧 Schritt 2: App-Konfiguration

### 2.1 app.json überprüfen

Datei ist bereits erstellt. Wichtige Felder:
- `expo.name`: "API Master"
- `expo.slug`: "api-master"
- `expo.android.package`: "com.aistormcreate.apimaster"
- `expo.version`: "1.0.0"

### 2.2 eas.json überprüfen

Build-Profile sind bereits konfiguriert:
- **development:** Für Testing
- **preview:** APK für manuellen Test
- **production:** AAB für Google Play

### 2.3 Anthropic API Key

Konfigurieren Sie Ihren Anthropic API Key:

**Option 1: Direkt im Code (nur für Development)**
```javascript
// src/services/anthropicService.js
const ANTHROPIC_API_KEY = 'YOUR_ANTHROPIC_API_KEY_HERE';
```

**Option 2: Environment Variables (Empfohlen für Production)**
```bash
# Erstelle .env Datei
echo "ANTHROPIC_API_KEY=sk-ant-api03-..." > .env

# In app.json extra.eas.build einrichten
```

⚠️ **Sicherheitshinweis:** Niemals API Keys in Git committen!

---

## 📱 Schritt 3: Lokaler Test

### 3.1 Expo Go App installieren

**Auf Android-Gerät:**
1. Google Play Store öffnen
2. "Expo Go" suchen und installieren
3. App öffnen

### 3.2 Development Server starten

```bash
# Development Server starten
npm start

# oder
expo start
```

### 3.3 App auf Gerät testen

1. QR-Code scannen mit Expo Go
2. App lädt automatisch
3. Alle Features testen:
   - Login (demo@apimaster.com / demo123)
   - Dashboard
   - Chat mit Claude
   - API Keys
   - Compliance
   - Einstellungen

---

## 🏗️ Schritt 4: Production Build erstellen

### 4.1 Preview Build (APK) - Zum Testen

```bash
# APK erstellen (für manuellen Test)
eas build --platform android --profile preview

# Build-Status verfolgen
eas build:list
```

**Nach Build:**
- Download APK von expo.dev/accounts/[username]/projects/api-master/builds
- Installiere APK auf Test-Gerät
- Teste alle Features gründlich

### 4.2 Production Build (AAB) - Für Google Play

```bash
# Android App Bundle für Play Store erstellen
eas build --platform android --profile production
```

**Build-Dauer:** 10-20 Minuten

**Nach Build:**
- Download AAB Datei
- Speichere in sicherem Verzeichnis
- Notiere Build-Nummer und Version

---

## 📝 Schritt 5: App Signierung

### 5.1 Automatische Signierung (Empfohlen)

Expo EAS handhabt Signierung automatisch:
```bash
# Beim ersten Build wird automatisch ein Keystore erstellt
# Keystore wird sicher in Expo gespeichert
```

### 5.2 Eigener Keystore (Optional)

```bash
# Eigenen Keystore generieren
keytool -genkey -v -keystore api-master.keystore -alias api-master -keyalg RSA -keysize 2048 -validity 10000

# In credentials.json speichern
eas credentials
```

⚠️ **Wichtig:** Keystore-Datei und Passwort sicher aufbewahren!

---

## 🎨 Schritt 6: Store Assets vorbereiten

### 6.1 Erforderliche Assets:

✅ **Icon (512x512 px):**
- Bereits definiert in: `assets/icon.png`
- PNG, 32-bit, transparenter Hintergrund

✅ **Feature Graphic (1024x500 px):**
- Erstellen mit Figma/Canva
- Siehe: `google-play-assets/ASSET_REQUIREMENTS.md`

✅ **Screenshots (mindestens 2):**
- 8 Screenshots empfohlen
- Phone: 1080x2340 px (oder ähnlich)
- Siehe Liste in ASSET_REQUIREMENTS.md

### 6.2 Screenshots erstellen

**Methode 1: Auf echtem Gerät**
```bash
# App mit Expo Go öffnen
# Screenshots machen:
# - Power + Volume Down (Android)
```

**Methode 2: Android Studio Emulator**
```bash
# Emulator starten
# App installieren
# Screenshots über Camera-Button
```

**Methode 3: Online Mock-up**
- Upload Screenshots zu: mockuphone.com
- Device Frame hinzufügen
- Download finales Bild

---

## 🏪 Schritt 7: Google Play Console Setup

### 7.1 Developer Account erstellen

1. Gehe zu: https://play.google.com/console
2. Klicke "Get Started"
3. Zahle $25 Einmalgebühr
4. Fülle Developer-Profil aus:
   - Name: Ai Storm Create
   - E-Mail: support@apimaster.com
   - Website: https://apimaster.com

### 7.2 Neue App erstellen

1. Dashboard → "Create app"
2. App-Details:
   - **App name:** API Master
   - **Default language:** Deutsch (Deutschland)
   - **App or game:** App
   - **Free or paid:** Free (mit In-App-Käufen)
3. Declarations:
   - [ ] Bestätige Developer Program Policies
   - [ ] Bestätige US export laws

### 7.3 Store Listing ausfüllen

**App-Details:**
- **Short description:** (aus store-listing.md kopieren)
- **Full description:** (aus store-listing.md kopieren)

**Graphics:**
- Upload Icon (512x512)
- Upload Feature Graphic (1024x500)
- Upload Screenshots (mindestens 2)

**Categorization:**
- **App category:** Productivity
- **Tags:** API, Developer Tools, Sicherheit

**Contact details:**
- **Email:** support@apimaster.com
- **Phone:** +49... (optional)
- **Website:** https://apimaster.com

**Privacy Policy:**
- URL: https://apimaster.com/privacy
- (Muss erstellt werden)

---

## 📦 Schritt 8: App hochladen

### 8.1 Production Release erstellen

1. Play Console → "Production" → "Create new release"
2. Upload AAB Datei
3. Release notes hinzufügen:

```
Version 1.0.0 - Erste Veröffentlichung

✨ Neue Features:
• Sicheres API Management mit AES-256-GCM Verschlüsselung
• Integrierter Claude KI-Chat für API-Analyse
• Kleinunternehmer-Compliance (§19 UStG)
• 20+ API-Integrationen
• Biometrische Authentifizierung
• Professionelles Dashboard mit Analytics

🔒 Sicherheit:
• Ende-zu-Ende-Verschlüsselung
• Proxy-API-Key System
• Offline-fähig
• DSGVO-konform
```

4. Klicke "Save" → "Review release"

### 8.2 Content Rating

1. Gehe zu "Content rating"
2. Starte Questionnaire
3. Beantworte Fragen:
   - Keine Gewalt
   - Kein Glücksspiel
   - Keine In-App-Käufe für physische Güter
4. Erhalte Rating: "Everyone" (PEGI 3)

### 8.3 Target Audience

1. Gehe zu "Target audience"
2. Wähle:
   - **Target age:** 18+
   - **Primary:** Erwachsene
3. Store Listing Anpassungen

### 8.4 App Content

**Privacy Policy:**
- URL angeben: https://apimaster.com/privacy

**Ads:**
- [ ] Keine Werbung (falls keine AdMob Integration)

**Data Safety:**
1. Erfasste Daten:
   - E-Mail (Account-Zwecke)
   - API Keys (verschlüsselt, lokal)
2. Sicherheit:
   - Daten werden verschlüsselt
   - Nutzer kann Daten löschen
   - Keine Weitergabe an Dritte

---

## 🚦 Schritt 9: Review & Publish

### 9.1 Pre-Launch Report

1. Play Console führt automatisch Tests durch
2. Warte auf Ergebnisse (1-2 Stunden)
3. Behebe eventuelle Fehler

### 9.2 Review-Prozess starten

1. Prüfe alle Sektionen auf grüne Häkchen
2. Klicke "Send for review"
3. Google prüft App (1-7 Tage)

### 9.3 Nach Approval

**App ist live!** 🎉

- URL: https://play.google.com/store/apps/details?id=com.aistormcreate.apimaster
- Teile auf Social Media
- Erstelle Marketing-Kampagne

---

## 🔄 Schritt 10: Updates veröffentlichen

### 10.1 Version erhöhen

```javascript
// app.json
{
  "expo": {
    "version": "1.0.1",  // Erhöhe Version
    "android": {
      "versionCode": 2   // Erhöhe versionCode
    }
  }
}
```

### 10.2 Neuen Build erstellen

```bash
# Neue Production Build
eas build --platform android --profile production
```

### 10.3 Update hochladen

1. Play Console → "Production" → "Create new release"
2. Upload neue AAB
3. Release Notes schreiben
4. "Review release" → "Start rollout to Production"

---

## 🛠️ Troubleshooting

### Problem: Build schlägt fehl

**Lösung:**
```bash
# Cache löschen
expo start -c

# node_modules neu installieren
rm -rf node_modules
npm install

# Build erneut versuchen
eas build --platform android --profile production --clear-cache
```

### Problem: App stürzt bei Start ab

**Lösung:**
- Prüfe Logcat in Android Studio
- Teste mit Preview Build zuerst
- Prüfe alle Dependencies auf Kompatibilität

### Problem: API Key funktioniert nicht

**Lösung:**
- Prüfe Anthropic Dashboard auf Key-Status
- Teste Key in Postman
- Prüfe Netzwerk-Verbindung

### Problem: Google Play Rejection

**Häufige Gründe:**
- Fehlende Privacy Policy
- Falsche Permissions
- Unzureichende Screenshots
- Content Rating nicht vollständig

---

## 📊 Post-Launch Monitoring

### Analytics einrichten

```bash
# Firebase Analytics (optional)
npm install @react-native-firebase/app @react-native-firebase/analytics
```

### Crash Reporting

```bash
# Sentry Integration
npm install @sentry/react-native

# In App.js:
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
});
```

### Play Console Metriken

Überwache täglich:
- Installations
- Crashes & ANRs
- Ratings & Reviews
- User Retention

---

## 💰 Monetarisierung einrichten

### In-App-Käufe (Google Play Billing)

```bash
# React Native IAP
npm install react-native-iap
```

### Subscription-Produkte erstellen

1. Play Console → "Monetize" → "Subscriptions"
2. Erstelle Produkte:
   - **Individual:** €19.99/Monat (api_master_individual_monthly)
   - **Ultimate:** €99.99/Monat (api_master_ultimate_monthly)
   - **Enterprise:** €299.99/Monat (api_master_enterprise_monthly)
3. 7-Tage kostenlose Testversion aktivieren

---

## 🎯 Marketing Checkliste

Nach Launch:

- [ ] Website erstellen (apimaster.com)
- [ ] Social Media Accounts (Twitter, LinkedIn)
- [ ] Product Hunt Launch
- [ ] Reddit Posts (r/androidapps, r/webdev)
- [ ] YouTube Tutorial Video
- [ ] Blog Posts schreiben
- [ ] E-Mail Newsletter
- [ ] Google Ads Kampagne
- [ ] Influencer Outreach

---

## 📞 Support & Hilfe

**Expo Dokumentation:**
- https://docs.expo.dev

**Google Play Console Hilfe:**
- https://support.google.com/googleplay/android-developer

**API Master Support:**
- E-Mail: support@apimaster.com
- GitHub: github.com/apimaster/support

---

## ✅ Finale Checkliste

### Vor dem Build:
- [ ] Alle Features getestet
- [ ] API Key funktioniert
- [ ] Version in app.json erhöht
- [ ] Screenshots erstellt
- [ ] Store Listing Text bereit
- [ ] Privacy Policy online

### Vor dem Launch:
- [ ] AAB erstellt und getestet
- [ ] Store Listing vollständig
- [ ] Content Rating erhalten
- [ ] Data Safety ausgefüllt
- [ ] Pricing konfiguriert
- [ ] Marketing vorbereitet

### Nach dem Launch:
- [ ] URL testen
- [ ] Social Media Posts
- [ ] Analytics monitoring
- [ ] User Feedback sammeln
- [ ] Updates planen

---

**Viel Erfolg mit API Master! 🚀**

© 2024 Ai Storm Create - Sebastian Beyer
