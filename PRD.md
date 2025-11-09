# Product Requirements Document (PRD)
## Simple Weather App - Entwicklungsprototyp

**Datum:** November 2025
**Version:** 1.0 - Prototyp
**Status:** In Entwicklung
**Projekt:** Sebathol/projekt

---

## 📋 Executive Summary

Die **Simple Weather App** ist eine moderne, benutzerfreundliche Wetter-Anwendung mit Progressive Web App (PWA) Funktionalität. Das Ziel des Prototyps ist die Validierung des Kernkonzepts: schneller Zugriff auf aktuelle Wetterdaten mit nativer App-ähnlichem Erlebnis, ohne dass eine Installation über App-Stores erforderlich ist.

Der Prototyp richtet sich an:
- Gelegenheitsnutzer, die schnell das aktuelle Wetter abfragen möchten
- Mobile-First Nutzer auf Smartphone und Tablet
- Desktop-Nutzer, die die App als installierbare Anwendung verwenden möchten

---

## 🎯 Produktvision & Ziele

### Vision
Ein einfaches, schnelles und zugängliches Wetter-Erlebnis, das offline verfügbar ist und sich wie eine native App anfühlt.

### Ziele für den Prototyp
1. **Validierung der PWA-Technologie** - Kann die App erfolgreich als PWA installiert und verwendet werden?
2. **Benutzerfreundlichkeit testen** - Verstehen Nutzer die Bedienung intuitiv?
3. **Performance verifizieren** - Sind die Ladezeiten und die Reaktionsfähigkeit akzeptabel?
4. **Offline-Funktionalität validieren** - Funktioniert Caching und Offline-Modus?
5. **API-Integration testen** - Funktionieren mehrere Wetter-APIs zuverlässig?

---

## 🎯 Gültigkeitsbereich (Scope)

### Inbegriffen (MVP - Minimum Viable Product)

#### Core Features
- ✅ Wetter für beliebige Städte abrufen
- ✅ Aktuelle Temperatur anzeigen
- ✅ Gefühlte Temperatur
- ✅ Luftfeuchtigkeit
- ✅ Windgeschwindigkeit
- ✅ Wetterbeschreibung (sonnig, bewölkt, Regen, etc.)
- ✅ Responsive Design (Mobile, Tablet, Desktop)
- ✅ PWA-Installation auf Smartphone und Desktop
- ✅ Service Worker für Offline-Unterstützung
- ✅ Manifest für App-Installation
- ✅ Mehrere API-Optionen (Standard: wttr.in, erweitert: WeatherAPI, OpenWeatherMap, etc.)

#### Benutzerinteraktion
- ✅ Suchfeld für Stadtnamen
- ✅ Suchbutton
- ✅ Schnelle Ergebnisanzeige
- ✅ Fehlerbehandlung (Stadt nicht gefunden, API-Fehler)
- ✅ Installationsaufforderung (mobil & desktop)

#### Technische Features
- ✅ Service Worker für Offline-Caching
- ✅ Web Manifest für App-Installation
- ✅ Responsive CSS
- ✅ Vanilla JavaScript (keine Abhängigkeiten)
- ✅ Setup-Tool für API-Konfiguration
- ✅ Passwort-geschützte Konfiguration

### Nicht inbegriffen (Post-MVP)
- ❌ Standortbasierte automatische Wetter-Anzeige
- ❌ 7-Tage-Vorhersage
- ❌ Wetteralarme/Benachrichtigungen
- ❌ Mehrsprachige Oberfläche (derzeit nur Deutsch)
- ❌ Benutzerkonten / Cloud-Synchronisierung
- ❌ Dark Mode
- ❌ Farbliche Wetter-Animationen
- ❌ Social Sharing Features

---

## 👥 Zielbenutzer & Personas

### Persona 1: Schnelle Nutzer (50%)
- **Name:** Alex, 28 Jahre
- **Gerät:** iPhone & MacBook
- **Bedarf:** Schnell das aktuelle Wetter checken ohne App-Store
- **Erwartung:** Sofort einsatzbereit, keine komplexe Konfiguration
- **Zufriedenheit:** Installierbar in 2 Klicks, 1-2 Sekunden Ladezeit

### Persona 2: Tech-Enthusiast (30%)
- **Name:** Jamie, 35 Jahre
- **Gerät:** Android & Windows Desktop
- **Bedarf:** PWA-Funktionalität testen, Offline-Features nutzbar
- **Erwartung:** Technisch interessant, auch ohne Internet funktional
- **Zufriedenheit:** Funktioniert offline, Setup ist nachvollziehbar

### Persona 3: App-Entwickler (20%)
- **Name:** Taylor, 40 Jahre
- **Gerät:** Windows & Linux
- **Bedarf:** Verständnis für PWA-Implementierung gewinnen
- **Erwartung:** Gut dokumentierter Code, nachvollziehbare Struktur
- **Zufriedenheit:** Code ist lesbar, Architektur ist klar

---

## 📋 Detaillierte Anforderungen

### Funktionale Anforderungen

#### F1: Wetter abrufen
- **Beschreibung:** Benutzer kann den Namen einer Stadt eingeben und erhält aktuelle Wetterdaten
- **Akzeptanzkriterien:**
  - Gültige Stadtnamen liefern korrekte Wetterdaten
  - Ungültige Stadtnamen zeigen Fehlermeldung
  - Abfrage dauert max. 3 Sekunden
  - UI bleibt responsiv während Abruf

#### F2: Wetterdaten anzeigen
- **Beschreibung:** Alle abgerufenen Wetterdaten werden verständlich dargestellt
- **Angezeigt werden:**
  - Aktuelle Temperatur (°C oder °F, später konfigurierbar)
  - Gefühlte Temperatur
  - Luftfeuchtigkeit (%)
  - Windgeschwindigkeit (km/h oder m/s)
  - Wetterbeschreibung (Text + Icon)
  - Stadtname

#### F3: PWA Installation
- **Beschreibung:** App ist installierbar auf Smartphone und Desktop
- **Akzeptanzkriterien:**
  - Web Manifest vorhanden und valid
  - Install-Button/Aufforderung erscheint auf Smartphone (Chrome/Edge/Safari)
  - Desktop-Installation möglich
  - Installierte App läuft im Standalone-Modus (kein Browser-UI)

#### F4: Offline-Unterstützung
- **Beschreibung:** App funktioniert teilweise ohne Internetverbindung
- **Akzeptanzkriterien:**
  - Service Worker registriert sich
  - Letzte Abfrage wird gecacht
  - Offline-Modus zeigt gecachte Daten
  - Fehlerhafte Offline-Abfragen werden mit Meldung bestätigt

#### F5: Multi-API-Unterstützung
- **Beschreibung:** App unterstützt mehrere Wetter-APIs zur Auswahl
- **Unterstützte APIs:**
  - wttr.in (Standard, kostenlos, ohne API-Key)
  - WeatherAPI.com (kostenlos mit API-Key)
  - OpenWeatherMap (kostenlos mit API-Key)
  - Visual Crossing (kostenlos mit API-Key)
  - Open-Meteo (kostenlos, ohne API-Key)

#### F6: API-Konfiguration
- **Beschreibung:** Benutzer/Admin können API wechseln und Keys speichern
- **Methoden:**
  - Setup-Tool (setup-tool.html) mit Passwortschutz
  - Update-Script (update-api.js)
  - Direkte Code-Bearbeitung (für Entwickler)

#### F7: Responsive Design
- **Beschreibung:** App funktioniert auf allen Geräten
- **Breakpoints:**
  - Mobile: 320px - 767px (Smartphone)
  - Tablet: 768px - 1024px (iPad)
  - Desktop: 1025px+ (Laptop, PC, Desktop)
- **Anforderungen:**
  - Touch-friendly auf mobilen Geräten
  - Lesbar ohne Zoom
  - Vertikale und horizontale Orientierung unterstützt

### Nicht-funktionale Anforderungen

#### Performance (NF1)
- **Seiten-Ladezeit:** ≤ 2 Sekunden (initial load)
- **API-Response:** ≤ 3 Sekunden
- **Bundle-Größe:** ≤ 200 KB
- **Rendering:** 60 FPS scrolling

#### Sicherheit (NF2)
- API-Keys werden nicht in öffentlichem Code gespeichert
- Setup-Tool mit Passwortschutz (default: JoHanna268219$)
- HTTPS-Anforderung für PWA (oder localhost)
- XSS-Protection durch DOM-Sanitation
- CSRF-Protection (falls nötig)

#### Zuverlässigkeit (NF3)
- API-Fehler werden elegant behandelt
- Fallback auf gecachte Daten bei API-Fehler
- App sollte nicht abstürzen bei ungültigem JSON
- Error-Logging für Debugging

#### Browser-Kompatibilität (NF4)
- ✅ Chrome/Edge (Mobile & Desktop)
- ✅ Firefox (Desktop)
- ✅ Safari (iOS & macOS)
- ✅ Moderne Browser (2020+)
- ⚠️ IE11+ wird nicht unterstützt

#### Barrierefreiheit (NF5)
- Semantisches HTML
- Alt-Text für Icons
- Keyboard-Navigation möglich
- Ausreichende Farbkontraste (WCAG AA)
- Text-Größe skalierbar

---

## 🏗️ Technische Architektur

### Stack
```
Frontend:
├── HTML5 (Struktur)
├── CSS3 (Styling, Responsive)
├── Vanilla JavaScript ES6+ (Logik)
└── Web APIs
    ├── Fetch API (HTTP Requests)
    ├── Service Worker API (Offline)
    ├── Web Manifest (Installation)
    ├── Local Storage (Persistenz)
    └── Geolocation API (optional)

Backend:
├── Externe APIs
│   ├── wttr.in (Standard)
│   ├── WeatherAPI.com
│   ├── OpenWeatherMap
│   └── ...

Hosting:
├── GitHub Pages (Kostenlos)
├── Netlify (Kostenlos)
├── Vercel (Kostenlos)
└── Eigener Server (HTTPS erforderlich)
```

### Dateistruktur
```
projekt/
├── index.html              # Hauptseite
├── manifest.json           # PWA Manifest
├── sw.js                   # Service Worker
├── script.js               # Hauptlogik
├── style.css               # Styling
├── setup-tool.html         # Admin-Konfiguration
├── update-api.js           # Node.js API-Update
├── README.md               # Nutzer-Dokumentation
├── DEVELOPER_GUIDE.md      # Entwickler-Dokumentation
├── API_DOCUMENTATION.md    # API-Details
├── INSTALLATION.md         # Installations-Anleitung
└── assets/
    ├── icons/              # App Icons (verschiedene Größen)
    ├── screenshots/        # Screenshots für PWA
    └── ...
```

### Datenfluss
```
User Input (Stadt)
    ↓
JavaScript (script.js)
    ↓
API-Request (Fetch)
    ↓
Externe API (wttr.in, WeatherAPI, etc.)
    ↓
JSON Response
    ↓
Daten-Verarbeitung
    ↓
DOM-Update
    ↓
Service Worker Cache
    ↓
Browser anzeigen
```

---

## 📊 Success Metrics & KPIs

### Prototype-Phase Metriken
| Metrik | Ziel | Messung |
|--------|------|---------|
| **Installation Erfolgsrate** | >90% | Nutzer können App erfolgreich installieren |
| **Erste Wetter-Abfrage** | <3s | Zeitstempel erfassen |
| **Offline-Funktionalität** | 100% | Service Worker testet Cache-Hit |
| **API-Zuverlässigkeit** | >99% | Erfolgreiche Anfragen / Gesamtanfragen |
| **Browser-Kompatibilität** | 100% für moderne Browser | Manuelles Testen auf Chrome, Firefox, Safari, Edge |
| **Mobile Usability** | Fehlerfrei | Google Mobile Friendly Test |
| **Fehlerrate** | <1% | JavaScript Fehler in Console |

---

## 🎬 Entwicklungsplan

### Phase 1: Setup & Grundstruktur (Woche 1)
- [ ] Repository erstellen/organisieren
- [ ] HTML5 Basis-Template
- [ ] CSS Responsive Framework
- [ ] Service Worker Grundgerüst
- [ ] Web Manifest erstellen

### Phase 2: Core Features (Woche 2-3)
- [ ] API-Integration (wttr.in Standard)
- [ ] Wetter-Abruf-Funktionalität
- [ ] UI-Rendering für Wetterdaten
- [ ] Fehlerbehandlung
- [ ] Service Worker Caching

### Phase 3: PWA & Installation (Woche 3-4)
- [ ] Web Manifest optimieren
- [ ] PWA-Icons generieren
- [ ] Installation testen (Chrome, Firefox, Safari, Edge)
- [ ] Standalone-Modus verifizieren
- [ ] Splash Screen konfigurieren

### Phase 4: Multi-API Support (Woche 4-5)
- [ ] WeatherAPI Integration
- [ ] OpenWeatherMap Integration
- [ ] Setup-Tool erstellen
- [ ] API-Key Management
- [ ] Fallback-Logik

### Phase 5: Testing & Dokumentation (Woche 5-6)
- [ ] Cross-browser Testing
- [ ] Mobile Device Testing
- [ ] Offline-Szenarios testen
- [ ] Performance-Optimierung
- [ ] Benutzer-Dokumentation
- [ ] Entwickler-Dokumentation

### Phase 6: Deployment (Woche 6-7)
- [ ] GitHub Pages Setup
- [ ] Netlify Deployment
- [ ] Vercel Deployment (optional)
- [ ] HTTPS Verifizierung
- [ ] Abschließendes Testing

---

## 🚀 Deployment & Auslieferung

### Lokale Entwicklung
```bash
# Mit Python
python3 -m http.server 8000

# Mit Node.js
npx http-server -p 8000
```
URL: `http://localhost:8000`

### Produktion
- **GitHub Pages** (Empfohlen für Start)
  - Repository URL: https://github.com/Sebathol/projekt
  - URL nach Deployment: https://Sebathol.github.io/projekt

- **Netlify**
  - Drag & Drop Deployment
  - URL: https://projekt.netlify.app (example)

- **Vercel**
  - `npx vercel`
  - URL: https://projekt.vercel.app (example)

---

## 📝 Dokumentation

### Für Endbenutzer
- `README.md` - Übersicht und Schnellstart
- `SCHNELLSTART.md` - Schritt-für-Schritt Anleitung
- `INSTALLATION.md` - Detaillierte Installation
- `SYSTEM_REQUIREMENTS.md` - Systemanforderungen
- `USB_KOPIER_ANLEITUNG.md` - Offline-Installation

### Für Entwickler
- `DEVELOPER_GUIDE.md` - Code-Struktur und Architektur
- `API_DOCUMENTATION.md` - API-Integration Details
- `SETUP_TOOL_GUIDE.md` - Setup-Tool Dokumentation
- Inline-Code Kommentare
- GitHub Issues/Wiki (später)

---

## ⚠️ Risiken & Mitigationstrategien

| Risiko | Wahrscheinlichkeit | Impact | Mitigation |
|--------|-------------------|--------|-----------|
| **API-Ausfallrate hoch** | Mittel | Hoch | Multiple API-Optionen, Fallback-Caching |
| **HTTPS nicht verfügbar** | Niedrig | Hoch | Localhost/GitHub Pages nutzen |
| **Browserkompatibilität** | Niedrig | Mittel | Early Testing auf allen Browsern |
| **Performance-Probleme** | Niedrig | Mittel | Code-Splitting, Bundle-Optimierung |
| **Service Worker Fehler** | Mittel | Mittel | Gründliches Testing, Error-Handling |
| **API-Limits erreicht** | Mittel | Mittel | Rate-Limiting implementieren, User warnen |

---

## 🎯 Akzeptanzkriterien (DoD - Definition of Done)

Prototype wird als abgeschlossen betrachtet, wenn:

- ✅ Alle MVP-Features implementiert und getestet
- ✅ App auf Chrome, Firefox, Safari und Edge funktioniert
- ✅ Mobile Installation auf mind. 1 iOS und 1 Android Gerät funktioniert
- ✅ Service Worker und Offline-Modus funktionieren
- ✅ API-Integration auf mind. 2 APIs getestet
- ✅ Performance >90 auf Google Lighthouse
- ✅ Setup-Tool funktioniert und ist dokumentiert
- ✅ Alle Dokumentationen aktuell
- ✅ Code ist kommentiert und lesbar
- ✅ Repository auf Branch `claude/write-develop-prd-011CUxbahkFQHjUYCq8SH8jf` committed

---

## 📞 Kontakt & Support

**Projekt-Owner:** Sebathol
**Repository:** https://github.com/Sebathol/projekt
**Branch:** `claude/write-develop-prd-011CUxbahkFQHjUYCq8SH8jf`

---

**Version History:**
- v1.0 (2025-11-09): Initial PRD für Prototyp-Phase

