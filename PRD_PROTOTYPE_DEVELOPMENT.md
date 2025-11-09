# Product Requirements Document (PRD)
## Simple Weather App - Prototype Development

**Version:** 1.0
**Datum:** 2025-11-09
**Erstellt für:** Prototype Development Phase
**Projektname:** Simple Weather App
**Entwickler:** Ai Storm Create

---

## 1. Executive Summary

### 1.1 Produkt-Vision

Simple Weather App ist eine minimalistische, werbefreie Progressive Web App (PWA), die aktuelle Wetterdaten für beliebige Städte weltweit anzeigt. Die App verfolgt einen "ehrlichen" Ansatz: keine Werbung, keine Abos, nur eine einmalige Zahlung von €1,99.

**Vision Statement:**
> "Das Wetter zeigen - einfach, ehrlich, ohne Ablenkung. Die anti-thesis zu überladenen, abo-basierten Wetter-Apps."

### 1.2 Geschäftsziele

**Primärziele:**
- Sofortige Monetarisierung durch einmalige Zahlung (€1,99)
- Minimaler Entwicklungs- und Wartungsaufwand
- Maximale Reichweite durch PWA + App Store Distribution

**Sekundärziele:**
- Aufbau einer Nutzerbasis für zukünftige Apps
- Etablierung der Marke "Ai Storm Create"
- Proof-of-Concept für "ehrliche App"-Strategie

**Erfolgsmetriken:**
- Monat 1: 50 Verkäufe (€100 Umsatz)
- Monat 3: 500 Verkäufe (€1.000 Umsatz)
- Monat 12: 5.000 Verkäufe (€10.000 Umsatz)

---

## 2. Zielgruppe

### 2.1 Primäre Zielgruppe

**User Persona 1: "Der Minimaliste"**
- Alter: 25-45 Jahre
- Technik-affin
- Schätzt einfache, fokussierte Apps
- Zahlt gerne für werbefreie Erfahrungen
- Frustriert von überladenen Standard-Apps

**User Persona 2: "Der Privacy-Bewusste"**
- Alter: 30-55 Jahre
- Sorgt sich um Datenschutz
- Vermeidet kostenlose Apps mit Trackern
- Bevorzugt einmalige Zahlung statt Abo
- DSGVO-bewusst

**User Persona 3: "Der Abo-Müde"**
- Alter: 20-60 Jahre
- Hat viele Abo-Dienste, sucht Alternativen
- Schätzt Transparenz
- Frustriert von versteckten Kosten
- Bereit für Einmalzahlung

### 2.2 Sekundäre Zielgruppe

- Reisende (benötigen Wetter für verschiedene Städte)
- Senioren (schätzen Einfachheit)
- Eltern (suchen kindersichere Apps ohne Werbung)

### 2.3 Anti-Persona (Nicht-Zielgruppe)

- Nutzer, die erweiterte Features wollen (Radar, Stundenverlauf, etc.)
- Nutzer, die nur kostenlose Apps nutzen
- Power-User, die detaillierte Wettermodelle brauchen

---

## 3. Problem Statement

### 3.1 Kernprobleme

**Problem 1: Werbung überall**
- Standard-Wetter-Apps sind voll mit nerviger Werbung
- Unterbricht User Experience
- Lenkt von Hauptfunktion ab

**Problem 2: Abo-Modelle**
- Viele Apps verlangen €9,99/Monat für werbefreie Version
- Jährliche Kosten: €100+
- Nutzer fühlen sich "abgezockt"

**Problem 3: Überladene Interfaces**
- Zu viele Features, die niemand braucht
- Komplizierte Navigation
- Langsame Apps (50-200 MB)

**Problem 4: Datenschutz-Bedenken**
- Apps sammeln unnötig viele Daten
- Tracker und Analytics überall
- DSGVO-Unsicherheit

### 3.2 Unsere Lösung

✅ **100% werbefrei** - für immer
✅ **Einmalige Zahlung** - €1,99, kein Abo
✅ **Minimalistisches Design** - nur das Nötigste
✅ **Kleine App-Größe** - < 1 MB (vs. 50-200 MB)
✅ **Datenschutz** - minimale Datenerhebung, DSGVO-konform
✅ **Plattformübergreifend** - PWA läuft überall

---

## 4. Prototype Scope (MVP Features)

### 4.1 Must-Have Features (P0)

#### Feature 1: Städte-Suche
**User Story:** Als Nutzer möchte ich nach beliebigen Städten weltweit suchen können.

**Akzeptanzkriterien:**
- Suchfeld nimmt Stadtnamen entgegen
- Unterstützt internationale Städte
- Auto-complete nicht erforderlich (MVP)
- Fehlerbehandlung bei ungültigen Eingaben

**Technische Details:**
- Input-Feld mit Validation
- API-Call an Wetter-Service
- Error Handling & User Feedback

#### Feature 2: Aktuelle Wetterdaten anzeigen
**User Story:** Als Nutzer möchte ich die aktuellen Wetterdaten für eine Stadt sehen.

**Akzeptanzkriterien:**
- Temperatur in °C (Celsius)
- Gefühlte Temperatur
- Wetterbeschreibung (z.B. "Sonnig", "Bewölkt")
- Luftfeuchtigkeit in %
- Windgeschwindigkeit in km/h
- Visuelle Darstellung (Icons optional für MVP)

**Technische Details:**
- API: wttr.in (Demo) oder WeatherAPI.com
- Daten-Parsing und Anzeige
- Responsive Layout

#### Feature 3: PWA-Funktionalität
**User Story:** Als Nutzer möchte ich die App auf meinem Smartphone installieren können.

**Akzeptanzkriterien:**
- Manifest.json korrekt konfiguriert
- Service Worker für Offline-Support
- Installierbar auf Android (Chrome/Edge)
- Installierbar auf iOS (Safari)
- App-Icons in erforderlichen Größen

**Technische Details:**
- ✅ Bereits implementiert: manifest.json
- ✅ Service Worker vorhanden
- Icons: 192x192, 512x512 (vorhanden)

#### Feature 4: Offline-Modus
**User Story:** Als Nutzer möchte ich die zuletzt geladenen Daten auch offline sehen können.

**Akzeptanzkriterien:**
- Letzte Wetterdaten werden gecacht
- Cache-Dauer: 15 Minuten
- Hinweis, wenn Daten veraltet sind
- App funktioniert grundsätzlich auch ohne Internet

**Technische Details:**
- Service Worker Cache API
- LocalStorage für letzte Suchanfrage
- Timestamp für Cache-Validierung

#### Feature 5: Responsive Design
**User Story:** Als Nutzer möchte ich die App auf allen Geräten nutzen können.

**Akzeptanzkriterien:**
- Funktioniert auf Smartphone (320px - 480px)
- Funktioniert auf Tablet (768px - 1024px)
- Funktioniert auf Desktop (1024px+)
- Touch-optimierte Bedienung
- Keine horizontalen Scrollbalken

**Technische Details:**
- CSS Media Queries
- Flexible Layouts
- Touch-friendly Buttons (min. 44px)

### 4.2 Should-Have Features (P1)

#### Feature 6: Letzte Suche speichern
**User Story:** Als Nutzer möchte ich beim nächsten App-Start meine letzte Suche sehen.

**Akzeptanzkriterien:**
- Letzte Stadt wird in LocalStorage gespeichert
- Beim App-Start automatisch geladen
- Nutzer kann neue Suche starten

#### Feature 7: Setup-Tool für API-Key
**User Story:** Als App-Betreiber möchte ich einfach API-Keys konfigurieren können.

**Akzeptanzkriterien:**
- ✅ Bereits implementiert: setup-tool.html
- Passwort-geschützt (JoHanna268219$)
- Unterstützt mehrere Wetter-APIs
- Code-Generierung automatisch

#### Feature 8: Landing Page
**User Story:** Als potentieller Kunde möchte ich mehr über die App erfahren, bevor ich kaufe.

**Akzeptanzkriterien:**
- ✅ Bereits vorhanden: landing.html
- Features klar dargestellt
- Preisgestaltung transparent
- Call-to-Action Button
- Screenshots/Preview

### 4.3 Could-Have Features (P2 - Post-MVP)

- Favoritenliste für mehrere Städte
- Wetter-Icons statt Text
- Einheit-Umschaltung (°C / °F)
- Mehrsprachigkeit (DE/EN)
- Dark Mode
- Widgets

### 4.4 Won't-Have Features (Scope Out)

- Stündliche Vorhersage
- 7-Tage-Vorhersage
- Wetter-Radar
- Wetter-Warnungen
- Push-Benachrichtigungen
- Standort-Automatik (GPS)
- Social-Media-Integration
- Wetter-Historie

---

## 5. Technische Anforderungen

### 5.1 Technologie-Stack

**Frontend:**
- HTML5
- CSS3 (Vanilla, kein Framework)
- JavaScript (Vanilla, kein Framework)
- Service Worker API
- Cache API
- LocalStorage API

**APIs:**
- Primär: wttr.in (Demo-Modus, kostenlos)
- Alternativ: WeatherAPI.com (1M calls/Monat kostenlos)
- Fallback: Open-Meteo (kein API-Key nötig)

**Hosting:**
- Netlify (Empfohlen - kostenlos)
- Alternativen: Vercel, GitHub Pages
- HTTPS erforderlich (für PWA)

**Payment:**
- Stripe (Checkout oder Payment Links)
- Einmalige Zahlung: €1,99

### 5.2 Browser-Kompatibilität

**Mindestanforderungen:**
- Chrome 60+
- Safari 12+
- Firefox 55+
- Edge 79+

**PWA-Support:**
- Android: Chrome 58+, Edge 79+
- iOS: Safari 12.2+
- Desktop: Chrome 73+, Edge 79+

### 5.3 Performance-Anforderungen

**Ladezeiten:**
- Erste Seitenladezeit: < 2 Sekunden
- Wetter-Abfrage: < 1 Sekunde
- Offline-Laden: < 0.5 Sekunden

**App-Größe:**
- Gesamt: < 1 MB
- Initial Bundle: < 500 KB
- Cache: < 100 KB

**Datenverbrauch:**
- Pro Wetterabfrage: ~10 KB
- Erstes Laden: ~500 KB

### 5.4 Sicherheitsanforderungen

**HTTPS:**
- Alle Seiten über HTTPS
- Kein Mixed Content

**API-Keys:**
- Nicht im Frontend-Code hardcoded
- Verwendung von Environment Variables oder Backend-Proxy

**Datenschutz:**
- Keine Tracker (Google Analytics optional mit Consent)
- Keine Cookies außer technisch notwendige
- DSGVO-konform
- Privacy Policy vorhanden

**Input-Validation:**
- SQL-Injection-Schutz (N/A - kein Backend)
- XSS-Protection
- CSRF-Protection (N/A - keine Formulare)

### 5.5 Barrierefreiheit (a11y)

**WCAG 2.1 Level AA:**
- Semantisches HTML
- ARIA-Labels wo nötig
- Keyboard-Navigation
- Farbkontrast mindestens 4.5:1
- Screen-Reader-freundlich
- Focus-Indikatoren sichtbar

---

## 6. User Experience (UX)

### 6.1 User Flow - Primärer Workflow

```
1. Nutzer öffnet App
   ↓
2. Startseite mit Suchfeld
   ↓
3. Nutzer gibt Stadtnamen ein
   ↓
4. Nutzer klickt "Suchen"
   ↓
5. API-Call lädt Wetterdaten
   ↓
6. Daten werden angezeigt:
   - Temperatur
   - Gefühlte Temperatur
   - Beschreibung
   - Luftfeuchtigkeit
   - Windgeschwindigkeit
   ↓
7. Nutzer kann neue Stadt suchen (zurück zu Schritt 3)
```

### 6.2 UI-Design-Prinzipien

**Minimalismus:**
- Nur essenzielle Elemente
- Viel Whitespace
- Klare Hierarchie
- Keine Ablenkungen

**Klarheit:**
- Große, lesbare Schriftarten
- Klare Labels
- Eindeutige Call-to-Actions
- Sofortiges Feedback

**Konsistenz:**
- Einheitliches Farbschema
- Konsistente Abstände
- Gleiches Verhalten überall

### 6.3 Design-System

**Farbpalette:**
- Primärfarbe: #667eea (Blau-Lila Gradient)
- Sekundärfarbe: #764ba2 (Lila)
- Text: #333333 (Dunkelgrau)
- Hintergrund: #ffffff (Weiß)
- Akzente: #f093fb (Rosa)

**Typografie:**
- Basis: 16px (1rem)
- Überschriften: 2rem, 1.5rem, 1.25rem
- Schriftart: System-Schrift (San Francisco, Roboto, Segoe UI)
- Line-Height: 1.6

**Spacing:**
- XS: 0.25rem (4px)
- S: 0.5rem (8px)
- M: 1rem (16px)
- L: 1.5rem (24px)
- XL: 2rem (32px)

**Komponenten:**
- Buttons: Min. 44px Höhe (Touch-friendly)
- Input-Felder: 48px Höhe
- Border-Radius: 12px
- Box-Shadow: Subtil

### 6.4 Error Handling & User Feedback

**Fehlerszenarien:**

1. **Stadt nicht gefunden**
   - Nachricht: "Stadt nicht gefunden. Bitte überprüfe die Schreibweise."
   - Action: Fokus zurück auf Input-Feld

2. **Netzwerkfehler**
   - Nachricht: "Keine Internetverbindung. Zeige letzte Daten."
   - Action: Gecachte Daten anzeigen

3. **API-Fehler**
   - Nachricht: "Wetterdaten können nicht geladen werden. Bitte später versuchen."
   - Action: Retry-Button anzeigen

4. **Leere Eingabe**
   - Nachricht: "Bitte gib einen Stadtnamen ein."
   - Action: Input-Feld hervorheben

**Loading-States:**
- Spinner während API-Call
- Skeleton-Screen (optional)
- "Lade Wetterdaten..." Text

---

## 7. Entwicklungsphasen

### Phase 1: Prototype Foundation (Woche 1-2)

**Ziele:**
- ✅ Basis-HTML/CSS/JS-Struktur (ERLEDIGT)
- ✅ PWA-Manifest & Service Worker (ERLEDIGT)
- ✅ Grundlegendes Responsive Design (ERLEDIGT)

**Deliverables:**
- Funktionierende PWA
- Installierbar auf Geräten
- Basis-UI vorhanden

### Phase 2: Core Features (Woche 2-3)

**Ziele:**
- Städte-Suche implementieren
- API-Integration (wttr.in oder WeatherAPI)
- Wetterdaten-Anzeige
- Error Handling

**Deliverables:**
- Voll funktionsfähige Wetter-App
- Alle P0-Features implementiert
- Testing auf verschiedenen Geräten

### Phase 3: Polish & Optimization (Woche 3-4)

**Ziele:**
- Offline-Modus verfeinern
- Performance-Optimierung
- UI-Polish
- Accessibility-Verbesserungen

**Deliverables:**
- Performance-optimierte App
- Barrierefreie Bedienung
- Browser-Testing abgeschlossen

### Phase 4: Launch Preparation (Woche 4-5)

**Ziele:**
- Landing Page fertigstellen
- Stripe-Integration
- Rechtliche Dokumente vervollständigen
- Marketing-Material erstellen

**Deliverables:**
- Komplettes App-Paket
- Deployment auf Netlify
- Payment-System funktioniert
- Screenshots & Assets

### Phase 5: Store Submission (Woche 5-6)

**Ziele:**
- Google Play Store Listing
- Apple App Store (optional)
- Store-Screenshots
- App-Beschreibungen

**Deliverables:**
- Apps eingereicht
- Store-Listings aktiv
- Support-System bereit

### Phase 6: Launch & Marketing (Woche 6+)

**Ziele:**
- Öffentlicher Launch
- Social Media Kampagne
- Press Release
- Community Building

**Deliverables:**
- Öffentlich verfügbare App
- Marketing-Kampagne läuft
- Analytics & Monitoring aktiv

---

## 8. Success Metrics & KPIs

### 8.1 Technische Metriken

**Performance:**
- Lighthouse Score: > 90
- First Contentful Paint: < 1.5s
- Time to Interactive: < 2.5s
- Cumulative Layout Shift: < 0.1

**Verfügbarkeit:**
- Uptime: > 99.9%
- API-Response-Zeit: < 500ms

### 8.2 Business Metriken

**Conversion:**
- Landing Page → Kauf: > 2%
- App-Install → Nutzung: > 60%

**Umsatz:**
- Monat 1: €100 (50 Verkäufe)
- Monat 3: €1.000 (500 Verkäufe)
- Monat 12: €10.000 (5.000 Verkäufe)

**User Engagement:**
- Daily Active Users (DAU): Track
- Monthly Active Users (MAU): Track
- Retention Rate (Tag 7): > 40%
- Retention Rate (Tag 30): > 20%

### 8.3 Qualitäts-Metriken

**Store Ratings:**
- Google Play: > 4.0 Sterne
- App Store: > 4.0 Sterne

**Support:**
- Response-Zeit: < 24 Stunden
- Resolution-Rate: > 90%

**Bugs:**
- Kritische Bugs: 0
- Major Bugs: < 5
- Minor Bugs: < 20

---

## 9. Risiken & Mitigation

### 9.1 Technische Risiken

**Risiko 1: API-Limitierung**
- **Impact:** Hoch
- **Probability:** Mittel
- **Mitigation:**
  - Mehrere API-Anbieter als Fallback
  - Caching implementieren
  - Rate-Limiting im Frontend

**Risiko 2: Browser-Kompatibilität**
- **Impact:** Mittel
- **Probability:** Niedrig
- **Mitigation:**
  - Cross-Browser-Testing
  - Progressive Enhancement
  - Polyfills für ältere Browser

**Risiko 3: PWA-Installation funktioniert nicht**
- **Impact:** Hoch
- **Probability:** Niedrig
- **Mitigation:**
  - Umfassende Tests auf verschiedenen Geräten
  - Fallback: Web-App ohne Installation
  - Klare Installations-Anleitung

### 9.2 Business-Risiken

**Risiko 4: Zu wenig Verkäufe**
- **Impact:** Hoch
- **Probability:** Mittel
- **Mitigation:**
  - Aggressive Marketing-Strategie
  - A/B-Testing für Landing Page
  - Preis-Optimierung (€1,99 vs €2,99)
  - Kostenlose Trial-Version erwägen

**Risiko 5: App Store Ablehnung**
- **Impact:** Mittel
- **Probability:** Niedrig
- **Mitigation:**
  - Store-Guidelines genau befolgen
  - Pre-Submission-Review
  - PWA als Fallback immer verfügbar

**Risiko 6: Konkurrenzdruck**
- **Impact:** Mittel
- **Probability:** Hoch
- **Mitigation:**
  - Klare Differenzierung (werbefrei, kein Abo)
  - Fokus auf Nische (Minimalisten)
  - Schnelle Iteration basierend auf Feedback

### 9.3 Rechtliche Risiken

**Risiko 7: DSGVO-Compliance**
- **Impact:** Hoch
- **Probability:** Niedrig
- **Mitigation:**
  - Minimale Datenerhebung
  - Privacy Policy klar formuliert
  - Rechtliche Beratung einholen
  - Cookie-Banner implementieren

**Risiko 8: Zahlungsabwicklung**
- **Impact:** Hoch
- **Probability:** Niedrig
- **Mitigation:**
  - Stripe als etablierter Anbieter
  - PCI-Compliance durch Stripe
  - Test-Zahlungen durchführen

---

## 10. Constraints & Assumptions

### 10.1 Constraints (Einschränkungen)

**Zeitliche Einschränkungen:**
- MVP soll in 6 Wochen fertig sein
- Launch-Termin nicht verschiebbar

**Budgetäre Einschränkungen:**
- Minimales Marketing-Budget
- Keine bezahlten Tools (nur kostenlose Tier)
- Developer-Accounts: $25 (Google) + $99 (Apple)

**Ressourcen-Einschränkungen:**
- Solo-Developer (kein Team)
- Kein dedizierter Designer
- Kein dedizierter Marketing-Experte

**Technische Einschränkungen:**
- Kein Backend (nur statisches Hosting)
- Keine Datenbank
- API-Limitierungen (free tier)

### 10.2 Assumptions (Annahmen)

**Markt-Annahmen:**
- Es gibt einen Markt für einfache, werbefreie Apps
- Nutzer sind bereit, €1,99 zu zahlen
- Kein Abo-Modell ist ein Verkaufsargument

**Technische Annahmen:**
- PWA wird von Nutzern akzeptiert
- Wetter-APIs bleiben verfügbar
- Hosting bleibt kostenlos/günstig

**User-Annahmen:**
- Nutzer verstehen PWA-Installation
- Nutzer benötigen nur Basis-Wetterdaten
- Nutzer schätzen Minimalismus

---

## 11. Dependencies & Integrations

### 11.1 Externe Dependencies

**Wetter-APIs:**
- wttr.in (Demo-Modus)
- WeatherAPI.com (Production)
- Open-Meteo (Fallback)

**Payment:**
- Stripe Checkout
- Stripe Payment Links

**Hosting:**
- Netlify / Vercel
- CDN für statische Assets

**Tools:**
- Git / GitHub (Version Control)
- Browser DevTools (Testing)
- Lighthouse (Performance)

### 11.2 Optional Integrations

**Analytics (mit Consent):**
- Plausible Analytics (DSGVO-konform)
- ODER Google Analytics 4

**Error Tracking:**
- Sentry (kostenloser Tier)

**Marketing:**
- Social Media (manuell)
- Email (später)

---

## 12. Dokumentation & Support

### 12.1 Erforderliche Dokumentation

**Technische Dokumentation:**
- ✅ README.md (vorhanden)
- ✅ DEVELOPER_GUIDE.md (vorhanden)
- ✅ API_DOCUMENTATION.md (vorhanden)
- ✅ SETUP_TOOL_GUIDE.md (vorhanden)

**User-Dokumentation:**
- ✅ SCHNELLSTART.md (vorhanden)
- ✅ help.html (vorhanden)
- FAQ (zu erstellen)

**Rechtliche Dokumentation:**
- ✅ privacy-policy.html (Platzhalter vorhanden)
- ✅ terms-and-conditions.html (Platzhalter vorhanden)
- ✅ impressum.html (Platzhalter vorhanden)

**Store-Dokumentation:**
- ✅ STORE_REQUIREMENTS.md (vorhanden)
- ✅ Store-Listings (vorhanden)

### 12.2 Support-Strategie

**Support-Kanäle:**
- E-Mail: [WIRD ERGÄNZT]
- FAQ auf Website
- GitHub Issues (optional)

**Response-Zeiten:**
- Kritische Bugs: < 4 Stunden
- Support-Anfragen: < 24 Stunden
- Feature-Requests: Best Effort

**Sprachen:**
- Deutsch (Primär)
- Englisch (Sekundär)

---

## 13. Launch-Checkliste

### 13.1 Pre-Launch

**Technisch:**
- [ ] Alle P0-Features implementiert und getestet
- [ ] Cross-Browser-Testing abgeschlossen
- [ ] PWA-Installation getestet (Android, iOS, Desktop)
- [ ] Performance-Optimierung (Lighthouse > 90)
- [ ] Security-Audit durchgeführt
- [ ] Offline-Modus funktioniert
- [ ] Error Handling implementiert

**Content:**
- [ ] Alle Platzhalter ersetzt
- [ ] Privacy Policy ausgefüllt
- [ ] Impressum ausgefüllt
- [ ] AGB ausgefüllt
- [ ] Landing Page fertig
- [ ] Help-Seite fertig

**Business:**
- [ ] Stripe-Integration getestet
- [ ] Test-Zahlungen durchgeführt
- [ ] Preisgestaltung finalisiert
- [ ] Support-E-Mail eingerichtet
- [ ] Monitoring eingerichtet

**Marketing:**
- [ ] Screenshots erstellt (alle Plattformen)
- [ ] Store-Listings vorbereitet
- [ ] Icons in allen Größen
- [ ] Social Media Posts vorbereitet
- [ ] Press Release geschrieben

### 13.2 Launch Day

- [ ] PWA auf Netlify deployed
- [ ] DNS/Domain konfiguriert
- [ ] HTTPS verifiziert
- [ ] Payment-System LIVE geschaltet
- [ ] Google Play eingereicht
- [ ] Social Media Posts veröffentlicht
- [ ] Monitoring aktiv

### 13.3 Post-Launch

- [ ] User-Feedback sammeln
- [ ] Bugs priorisieren & fixen
- [ ] Analytics auswerten
- [ ] Marketing optimieren
- [ ] Updates planen

---

## 14. Anhänge

### 14.1 Links zu vorhandenen Dokumenten

- [README.md](./README.md) - Projekt-Übersicht
- [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) - Entwickler-Leitfaden
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API-Details
- [STORE_REQUIREMENTS.md](./STORE_REQUIREMENTS.md) - Store-Anforderungen
- [SYSTEM_REQUIREMENTS.md](./SYSTEM_REQUIREMENTS.md) - System-Anforderungen

### 14.2 Wichtige Dateien

- `index.html` - Haupt-App
- `landing.html` - Marketing Landing Page
- `setup-tool.html` - API-Key-Setup
- `manifest.json` - PWA-Konfiguration
- `service-worker.js` - Offline-Funktionalität

### 14.3 Externe Ressourcen

**Wetter-APIs:**
- https://wttr.in - Demo-API
- https://www.weatherapi.com - Production-API
- https://open-meteo.com - Fallback-API

**Hosting:**
- https://netlify.com - Empfohlenes Hosting
- https://vercel.com - Alternative

**Payment:**
- https://stripe.com/docs - Stripe-Dokumentation

**Stores:**
- https://play.google.com/console - Google Play Console
- https://appstoreconnect.apple.com - App Store Connect

---

## 15. Version History

| Version | Datum | Autor | Änderungen |
|---------|-------|-------|------------|
| 1.0 | 2025-11-09 | Claude/Anthropic | Initial PRD erstellt |

---

## 16. Approval & Sign-off

**Erstellt von:** Claude (Anthropic)
**Projekt:** Simple Weather App Prototype
**Status:** Draft → Ready for Development

**Nächste Schritte:**
1. PRD reviewen und genehmigen
2. Sprint-Planning für Phase 2 durchführen
3. Entwicklung der Core-Features starten
4. Testing-Strategie ausarbeiten

---

**Dokument-Ende**

*Dieses PRD dient als Blueprint für die Prototype-Entwicklung der Simple Weather App. Es definiert Scope, Features, technische Anforderungen und Success-Metriken für das MVP.*
