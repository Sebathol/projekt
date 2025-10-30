# Ai Storm Create - Company Links & Resources

**Firmenname:** Ai Storm Create

**Letzte Aktualisierung:** 2025-10-30

---

## Offizielle Links

### Hauptwebsite
**URL:** [WIRD ERGÄNZT - Bitte URL angeben]

**Beschreibung:** Offizielle Website von Ai Storm Create mit Informationen über alle Projekte, Services und Kontaktmöglichkeiten.

**Verwendung in Apps:**
- Footer-Link in allen Apps
- "Über uns" Sektion
- Hilfe-Menü

---

## App Portfolio

### 1. API Master (Aktuell)

**Name:** API Master

**Version:** 1.0.0

**Release-Datum:** [TBD]

**Status:** In Entwicklung

**Preis:** Kostenlos (mit optionalen In-App-Käufen geplant)

**Beschreibung:** Professioneller API-Key Manager mit Claude AI Integration. Verwalte alle API-Keys sicher an einem Ort und nutze Claude AI direkt in der App.

**Features:**
- API-Key Management mit Kategorisierung
- Claude AI Assistant Integration
- PWA (Progressive Web App)
- Google Play Store ready
- Offline-fähig
- Moderne Sidebar-Navigation

**Store-Links:**
- Google Play Store: [WIRD ERGÄNZT nach Veröffentlichung]
- Apple App Store: [WIRD ERGÄNZT nach Veröffentlichung]
- Amazon App Store: [WIRD ERGÄNZT nach Veröffentlichung]
- Samsung Galaxy Store: [WIRD ERGÄNZT nach Veröffentlichung]
- Huawei AppGallery: [WIRD ERGÄNZT nach Veröffentlichung]

**Website/Landing Page:** [WIRD ERGÄNZT]

**Support-E-Mail:** [WIRD ERGÄNZT]

---

### 2. [Zukünftige App #1]

**Name:** [TBD]

**Status:** Geplant

**Link:** [WIRD ERGÄNZT]

**Platzhalter-URL für App-Link:**
```
https://[IHRE-DOMAIN]/apps
```

---

### 3. [Zukünftige App #2]

**Name:** [TBD]

**Status:** Geplant

**Link:** [WIRD ERGÄNZT]

---

## App-übergreifende Links

### Portfolio-Seite
**URL:** [WIRD ERGÄNZT]

**Beschreibung:** Übersichtsseite aller Apps von Ai Storm Create.

**Standard-Link für "Weitere Apps":**
```html
<a href="[IHRE-DOMAIN]/apps">Weitere Apps von Ai Storm Create</a>
```

---

## Soziale Medien & Community

### Twitter/X
**URL:** [WIRD ERGÄNZT - falls gewünscht]

### LinkedIn
**URL:** [WIRD ERGÄNZT - falls gewünscht]

### Facebook
**URL:** [WIRD ERGÄNZT - falls gewünscht]

### Instagram
**URL:** [WIRD ERGÄNZT - falls gewünscht]

### GitHub
**URL:** [WIRD ERGÄNZT - falls gewünscht]

### YouTube
**URL:** [WIRD ERGÄNZT - falls gewünscht]

---

## Support & Kontakt

### Support-E-Mail
**E-Mail:** [WIRD ERGÄNZT]

**Verwendung:** Kundensupport, Feedback, Bug-Reports

### Geschäftliche Anfragen
**E-Mail:** [WIRD ERGÄNZT]

**Verwendung:** Partnerschaften, Medienanfragen, B2B

### Datenschutz-Anfragen
**E-Mail:** [WIRD ERGÄNZT]

**Verwendung:** DSGVO-Anfragen, Datenlöschung, Datenschutzfragen

---

## Rechtliche Dokumente

### Datenschutzerklärung
**URL:** [IHRE-DOMAIN]/privacy-policy

**Datei:** `privacy-policy.html`

### Impressum
**URL:** [IHRE-DOMAIN]/impressum

**Datei:** `impressum.html`

### AGB
**URL:** [IHRE-DOMAIN]/terms

**Datei:** `terms-and-conditions.html`

---

## Branding & Assets

### Logo
**Speicherort:** `/assets/branding/logo/`

**Dateien:**
- `logo-primary.svg`
- `logo-primary.png` (verschiedene Größen)
- `logo-icon.svg` (nur Icon)
- `logo-icon.png`

### Farben
**Primärfarbe:** #6366f1 (Indigo)

**Sekundärfarbe:** #8b5cf6 (Purple)

**Farbschema:**
```css
--primary-color: #6366f1;
--secondary-color: #8b5cf6;
--accent-color: #10b981;
--background-color: #f9fafb;
--text-color: #1f2937;
--card-bg: #ffffff;
```

### Schriftarten
**Primär:** System Font Stack (Segoe UI, Roboto, Helvetica)

**Sekundär:** Monospace (für API-Keys)

---

## App-Struktur Standard

Alle Apps von Ai Storm Create folgen dieser Link-Struktur:

### Footer-Navigation (Standard)
```
├── Über Ai Storm Create -> [WEBSITE-URL]
├── Weitere Apps -> [WEBSITE-URL]/apps
├── Hilfe -> /help.html (in-app)
├── Datenschutz -> [WEBSITE-URL]/privacy-policy
├── Impressum -> [WEBSITE-URL]/impressum
├── AGB -> [WEBSITE-URL]/terms
└── Kontakt -> mailto:[SUPPORT-EMAIL]
```

### In-App-Menü (Standard)
```
├── Hilfe & FAQ
├── Feedback senden
├── App bewerten
├── Weitere Apps
├── Über Ai Storm Create
├── Datenschutz
└── Version & Lizenzen
```

---

## Developer Notes

### Link-Integration in neue Apps

**1. Config-Datei verwenden:**
```javascript
// config.js
const COMPANY_CONFIG = {
  name: "Ai Storm Create",
  website: "[IHRE-DOMAIN]",
  email: "[SUPPORT-EMAIL]",
  appsUrl: "[IHRE-DOMAIN]/apps",
  privacyUrl: "[IHRE-DOMAIN]/privacy-policy",
  imprintUrl: "[IHRE-DOMAIN]/impressum",
  termsUrl: "[IHRE-DOMAIN]/terms"
};
```

**2. HTML-Template:**
```html
<footer>
  <a href="${COMPANY_CONFIG.website}">Über Ai Storm Create</a>
  <a href="${COMPANY_CONFIG.appsUrl}">Weitere Apps</a>
  <a href="${COMPANY_CONFIG.privacyUrl}">Datenschutz</a>
  <a href="${COMPANY_CONFIG.imprintUrl}">Impressum</a>
</footer>
```

---

## Analytics & Tracking

### Google Analytics
**Tracking ID:** [WIRD ERGÄNZT - falls gewünscht]

### Plausible/Matomo
**URL:** [WIRD ERGÄNZT - falls gewünscht]

**Hinweis:** DSGVO-konforme Alternative zu Google Analytics

---

## Payment & Monetarisierung

### Stripe
**Account:** [WIRD ERGÄNZT]

**Product ID (API Master):** [WIRD ERGÄNZT]

### PayPal
**Business Account:** [WIRD ERGÄNZT]

### Google Play Billing
**Merchant ID:** [WIRD ERGÄNZT nach Store-Setup]

### Apple App Store
**Team ID:** [WIRD ERGÄNZT]

---

## Changelog

### 2025-10-30
- Update auf API Master (vorher: Weather App)
- Struktur für API Master angelegt
- Claude AI Integration dokumentiert
- Entfernung aller Weather App Referenzen

### 2025-10-20
- Initiale Erstellung der Link-Dokumentation

---

## Action Items

**TODO - Bitte ergänzen:**

- [ ] Hauptwebsite-URL
- [ ] Support-E-Mail-Adresse
- [ ] Firmenadresse für Impressum
- [ ] Datenschutz-E-Mail
- [ ] Logo-Dateien hochladen
- [ ] Soziale Medien-Links (optional)
- [ ] Analytics-Setup (optional)
- [ ] Payment-Provider-Accounts einrichten

---

**Verwaltet von:** Ai Storm Create Development Team

**Datei-Location:**
- Repository: `/COMPANY_LINKS.md`
- Claude Documentation: Gespeichert für zukünftige Projekte
