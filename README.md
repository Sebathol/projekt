# 🔐 API Master

Ein professioneller API-Key Manager mit Claude AI Integration. Verwalte alle deine API-Keys sicher an einem Ort und nutze die Kraft von Claude AI!

## ✨ Features

- 🔑 **API-Key Management** - Sichere Verwaltung aller API-Keys
- 📁 **Kategorisierung** - Organisiere Keys nach AI, Payment, Maps, Social, etc.
- 🤖 **Claude AI Assistant** - Direkte Claude API Integration
- 💾 **LocalStorage** - Alle Daten bleiben lokal auf deinem Gerät
- 🎨 **Modernes Design** - Professionelle Sidebar-Navigation
- 📱 **PWA-ready** - Installierbar als App auf Smartphone & Desktop
- 🏪 **Play Store ready** - Vorbereitet für Google Play Store

## 🚀 SCHNELLSTART

### Methode 1: Lokal starten (Entwicklung)

```bash
# Repository klonen
git clone https://github.com/Sebathol/projekt.git api-master
cd api-master

# Server starten
python3 -m http.server 8000

# Im Browser öffnen
open http://localhost:8000/api-master.html
```

### Methode 2: Windows CMD

```cmd
cd /d D:\projekt
python -m http.server 8000
```

Dann öffne: `http://localhost:8000/api-master.html`

### Methode 3: WSL

```bash
cd /home/user/projekt
python3 -m http.server 8000
```

## 🔐 Claude API Setup

1. **API-Key besorgen:**
   - Gehe zu [console.anthropic.com](https://console.anthropic.com/)
   - Erstelle einen neuen API-Key

2. **In API Master einrichten:**
   - Öffne API Master
   - Klicke auf "Key hinzufügen"
   - Service: "Claude" oder "Anthropic"
   - Name: z.B. "Claude AI"
   - API-Key einfügen
   - Speichern

3. **Claude AI Assistant nutzen:**
   - Navigiere zum Tab "Claude AI Assistant"
   - Wähle deinen API-Key aus
   - Wähle ein Modell (empfohlen: Claude 3.5 Sonnet)
   - Starte den Chat!

## 📱 Als App installieren

### Android (Chrome/Edge):
1. Öffne API Master im Browser
2. Menü (⋮) → "App installieren"
3. Fertig! App ist auf dem Homescreen

### iOS (Safari):
1. Öffne API Master in Safari
2. Teilen-Symbol → "Zum Home-Bildschirm"
3. Fertig!

### Desktop (Chrome/Edge):
1. Öffne API Master
2. Adressleiste → Install-Icon klicken
3. Fertig!

## 🏗️ Projekt-Struktur

```
api-master/
├── api-master.html          # Haupt-HTML
├── api-master.css           # Styling
├── api-master.js            # App-Logik & Claude API
├── api-master-sw.js         # Service Worker (PWA)
├── manifest-api-master.json # PWA Manifest
├── generate-api-master-icons.html # Icon Generator
├── twa-manifest.json        # Google Play Config
├── assetlinks.json          # Digital Asset Links
├── GOOGLE_PLAY_STORE_SETUP.md # Play Store Anleitung
└── build-for-playstore.sh   # Build Script
```

## 🔧 Verfügbare Claude Modelle

- **Claude 3.5 Sonnet** (Empfohlen) - Beste Balance
- **Claude 3 Opus** - Höchste Intelligenz
- **Claude 3 Sonnet** - Schnell & effizient
- **Claude 3 Haiku** - Ultraschnell & günstig

## 📚 Weitere Features

### API-Key Management
- Sicheres Speichern von API-Keys
- Kategorisierung nach Services
- Quick-Copy Funktion
- Status-Tracking (Aktiv/Inaktiv)
- Export/Import Funktion

### Claude AI Assistant
- Chat-Interface mit Verlauf
- Markdown-Unterstützung
- Typing-Indikatoren
- Modell-Auswahl
- Chat-Export
- API-Key Verwaltung

### PWA Features
- Offline-Unterstützung
- Install-Prompt
- App-Icon & Splash Screen
- Vollbild-Modus

## 🏪 Google Play Store

Siehe [GOOGLE_PLAY_STORE_SETUP.md](GOOGLE_PLAY_STORE_SETUP.md) für detaillierte Anleitung.

**Kurzversion:**
1. Icons generieren: `generate-api-master-icons.html`
2. Build erstellen: `./build-for-playstore.sh`
3. Android Studio öffnen und signieren
4. In Play Console hochladen

## 🔒 Sicherheit

- Alle API-Keys werden nur lokal gespeichert (localStorage)
- Keine Server-Übertragung
- HTTPS empfohlen für Produktion
- Service Worker für sichere Offline-Funktionalität

## 🛠️ Technologien

- HTML5 / CSS3 / JavaScript (Vanilla)
- Claude API (Anthropic)
- Service Workers (PWA)
- LocalStorage (Persistenz)
- Trusted Web Activity (Android)

## 📄 Lizenz

MIT

## 👨‍💻 Entwickelt von

Ai Storm Create

## 🆘 Support

Bei Fragen oder Problemen:
- Issues: [GitHub Issues](https://github.com/Sebathol/projekt/issues)
- Dokumentation: Siehe API_MASTER_README.md
