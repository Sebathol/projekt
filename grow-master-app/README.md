# 🌱 Grow Master - Dein KI-Pflanzen-Experte

Eine intelligente Pflanzen-Pflege-App mit KI-Chatbot, Bildanalyse und verschiebbarem Begleiter. Jetzt als Progressive Web App (PWA) - installierbar auf Smartphone und Desktop!

![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android%20%7C%20Web-lightgrey.svg)

## ✨ Features

### 🤖 KI-Chatbot Assistent
- **Verschiebbarer Begleiter**: Zieh den Chatbot-Avatar überall auf dem Bildschirm hin!
- **Eye-Tracking**: Die Augen des Avatars folgen deinem Finger/Mauszeiger
- **Unbegrenzte Fragen**: Stelle so viele Fragen wie du möchtest (Premium)
- **Intelligente Antworten**: Sofortige Hilfe bei Pflanzenproblemen

### 📸 Pflanzenanalyse per Foto
- Lade Bilder deiner Pflanzen hoch
- KI analysiert Gesundheitszustand
- Erkennt Krankheiten, Schädlinge, Mangelerscheinungen
- Sofortige Diagnosen und Behandlungsempfehlungen

### 🌿 Umfassende Pflanzenpflege
- Gießempfehlungen für über 10.000 Pflanzenarten
- Licht- und Standortberatung
- Düngepläne und Zeitpläne
- Umtopf-Anleitungen
- Schädlingsbekämpfung

### 💰 Monetarisierung
- **€1,99 einmalig** - keine Abos!
- 3 kostenlose Nachrichten zum Testen
- Premium-Paywall nach Trial
- Stripe-Integration für sichere Zahlung
- 30 Tage Geld-zurück-Garantie

### 📱 Progressive Web App (PWA)
- Installierbar wie eine native App
- Offline-Funktionalität
- Push-Benachrichtigungen (Gieß-Erinnerungen)
- Native App-Feeling ohne App Store

### 🎨 Design Features
- Responsive Design (Mobile, Tablet, Desktop)
- Animierter Chatbot mit Persönlichkeit
- Drag & Drop Funktionalität
- Smooth Animations
- Dark Mode Support (geplant)

## 🚀 Installation & Entwicklung

### Methode 1: PWA lokal testen

**WICHTIG:** PWAs benötigen HTTPS oder localhost.

```bash
# Mit Python 3
cd grow-master-app/www
python3 -m http.server 8000

# Oder mit Node.js
npx http-server -p 8000

# Oder npm script
npm run serve
```

Dann öffne `http://localhost:8000` in deinem Browser.

### Methode 2: Direkt im Browser öffnen

Für einfaches Testen (ohne PWA-Features):
1. Öffne die Datei `grow-master-app/www/index.html` in deinem Browser
2. Klicke auf "Chat starten"
3. Stelle Fragen oder lade Bilder hoch (Premium)

### Methode 3: Als native App bauen (Cordova)

#### Voraussetzungen
- Node.js & npm installiert
- Cordova CLI: `npm install -g cordova`
- Für Android: Android Studio & SDK
- Für iOS: Xcode (nur macOS)

#### Android Build
```bash
cd grow-master-app

# Abhängigkeiten installieren
npm install

# Android-Plattform hinzufügen
cordova platform add android

# App bauen
cordova build android

# Auf Gerät installieren (USB-Debugging aktiviert)
cordova run android

# Release-Build erstellen
cordova build android --release
```

#### iOS Build (nur macOS)
```bash
cd grow-master-app

# iOS-Plattform hinzufügen
cordova platform add ios

# App bauen
cordova build ios

# In Xcode öffnen
open platforms/ios/Grow\ Master.xcworkspace

# Dann in Xcode signieren und auf Gerät deployen
```

## 🌍 Online Deployment

### GitHub Pages (Kostenlos & Einfach)
```bash
# 1. Repository erstellen auf GitHub
# 2. Code pushen
git add .
git commit -m "Grow Master App"
git push origin main

# 3. GitHub Pages aktivieren (Settings → Pages → Branch: main → /www)
# 4. App verfügbar unter: https://USERNAME.github.io/REPO-NAME
```

### Netlify (Kostenlos & Einfach)
1. Gehe zu [netlify.com](https://netlify.com)
2. Ziehe den `www` Ordner per Drag & Drop
3. Fertig! URL wie `https://grow-master.netlify.app`

### Vercel
```bash
cd grow-master-app/www
npx vercel
```

## 📱 Installation auf dem Smartphone

### Android (Chrome/Edge)
1. Öffne die App in Chrome/Edge (deployte Version)
2. Gehe zur URL der App
3. Tippe auf das Menü (⋮) oben rechts
4. Wähle **"App installieren"** oder **"Zum Startbildschirm hinzufügen"**
5. Die App erscheint auf deinem Homescreen!

### iOS (Safari)
1. Öffne die App in Safari
2. Tippe auf das Teilen-Symbol (□↑)
3. Wähle **"Zum Home-Bildschirm"**
4. Tippe auf "Hinzufügen"
5. Die App erscheint auf deinem Homescreen!

## 🎯 Features im Detail

### Verschiebbarer Chatbot-Begleiter

Der Chatbot-Begleiter ist ein einzigartiges Feature:
- **Ziehbar**: Drücken & ziehen, um ihn überall zu platzieren
- **Eye-Tracking**: Die Augen folgen dem Mauszeiger/Finger
- **Animiert**: Reagiert auf Nachrichten mit Animationen
- **Tooltip**: Zeigt hilfreiche Tipps an
- **Touch & Mouse**: Funktioniert auf Desktop und Mobile

### Bild-Upload & Analyse

```javascript
// Beispiel: Wie die Bildanalyse funktioniert
1. User klickt auf Kamera-Symbol
2. Wählt Foto aus Galerie oder nimmt neues auf
3. Bild wird angezeigt im Chat
4. KI analysiert das Bild
5. Diagnose + Behandlungsempfehlung wird angezeigt
```

### Premium-System

```javascript
// Free Trial
- 3 kostenlose Nachrichten
- Eingeschränkte Features
- Keine Bildanalyse

// Premium (€1,99 einmalig)
- Unbegrenzte Nachrichten
- Bildanalyse & Diagnose
- Alle Pflanzendatenbank-Einträge
- Gieß-Erinnerungen
- Wetter-Integration
- Keine Werbung
```

## 🔧 Technologien

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **PWA**: Service Worker, Web App Manifest
- **Mobile**: Apache Cordova
- **Icons**: SVG mit Gradient
- **Animations**: CSS Animations & Transitions
- **Storage**: LocalStorage für Chat-Historie
- **Payment**: Stripe Integration (geplant)

## 📂 Projektstruktur

```
grow-master-app/
├── www/
│   ├── index.html          # Haupt-HTML mit Chatbot UI
│   ├── style.css           # Vollständiges Styling
│   ├── script.js           # JavaScript-Logik & Drag&Drop
│   ├── manifest.json       # PWA Manifest
│   └── service-worker.js   # Offline-Funktionalität
├── store-listings/
│   ├── GOOGLE_PLAY_LISTING.md
│   └── APPLE_APPSTORE_LISTING.md
├── icon.svg                # App Icon (SVG)
├── icon-192.png            # App Icon 192x192
├── icon-512.png            # App Icon 512x512
├── config.xml              # Cordova Konfiguration
├── package.json            # NPM Abhängigkeiten
└── README.md               # Diese Datei
```

## 🎨 Anpassungen

### Farben ändern
In `www/style.css`:
```css
:root {
    --primary-color: #4CAF50;     /* Hauptfarbe */
    --primary-dark: #388E3C;      /* Dunkler */
    --primary-light: #81C784;     /* Heller */
    --accent-color: #FF9800;      /* Akzent */
    --bg-color: #F1F8E9;          /* Hintergrund */
}
```

### Chatbot-Antworten anpassen
In `www/script.js`:
```javascript
const plantResponses = {
    greeting: "Deine Begrüßung...",
    watering: "Deine Gieß-Tipps...",
    // Weitere Antworten hinzufügen
};
```

### Premium-Preis ändern
In `www/index.html` und Store-Listings:
```html
<div class="new-price">€1,99 <span>einmalig</span></div>
```

## 💳 Zahlungsintegration (TODO)

Für die finale Version mit echter Zahlung:

### Stripe Integration
```javascript
// In script.js - purchasePremium() Funktion
const stripe = Stripe('YOUR_PUBLISHABLE_KEY');

async function purchasePremium() {
    const response = await fetch('/create-checkout-session', {
        method: 'POST',
    });
    const session = await response.json();
    await stripe.redirectToCheckout({ sessionId: session.id });
}
```

### Apple In-App Purchase
```javascript
// Cordova Plugin: cordova-plugin-purchase
cordova plugin add cordova-plugin-purchase
```

### Google Play Billing
```javascript
// Cordova Plugin: cordova-plugin-purchase
cordova plugin add cordova-plugin-purchase
```

## 📊 Analytics (Optional)

Für Tracking (datenschutzkonform):

```javascript
// Google Analytics 4 (DSGVO-konform)
// In index.html <head>
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>

// Privacy-friendly alternatives:
// - Plausible Analytics
// - Fathom Analytics
// - Simple Analytics
```

## 🔒 Datenschutz

- **Keine Tracker**: Keine Google Analytics, Facebook Pixel, etc.
- **Keine Werbung**: 100% werbefrei
- **Lokale Speicherung**: Chat-Historie nur auf Gerät
- **Bildanalyse**: Bilder nicht dauerhaft gespeichert
- **DSGVO-konform**: Server in der EU
- **Minimale Daten**: Nur notwendige Daten werden verarbeitet

## 🐛 Bekannte Probleme / TODOs

- [ ] Icons in PNG-Format generieren (icon-192.png, icon-512.png)
- [ ] Screenshots für Store-Listings erstellen
- [ ] Echte KI-Integration (aktuell simulierte Antworten)
- [ ] Stripe/In-App-Purchase Integration
- [ ] Push-Benachrichtigungen implementieren
- [ ] Wetter-API Integration
- [ ] Pflanzendatenbank aufbauen
- [ ] Dark Mode implementieren
- [ ] Mehrsprachigkeit (EN, ES, FR)

## 📞 Support

- **Email**: support@aistormcreate.com
- **Website**: https://aistormcreate.com
- **Antwortzeit**: < 24 Stunden

## 📄 Lizenz

MIT License - siehe LICENSE Datei

## 👨‍💻 Entwickelt von

**Ai Storm Create**
- Website: https://aistormcreate.com
- GitHub: https://github.com/aistormcreate

---

Entwickelt mit ❤️ für Menschen, die ihre Pflanzen lieben!

🌱 Happy Growing! 🌱
