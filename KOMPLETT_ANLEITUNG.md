# 🚀 Komplette Anleitung: Von der Idee zum Prototyp

**Version**: 3.0.0
**Datum**: 2025-11-03
**Status**: ✅ Bereit für Tests

---

## 📋 Inhaltsverzeichnis

1. [Auf D:\ kopieren](#schritt-1-auf-d-kopieren)
2. [Installieren](#schritt-2-installieren)
3. [Server starten](#schritt-3-server-starten)
4. [Im Browser testen](#schritt-4-im-browser-testen)
5. [Alle Features testen](#schritt-5-alle-features-testen)
6. [Troubleshooting](#troubleshooting)

---

## SCHRITT 1: Auf D:\ kopieren

### WSL-Befehle (alle kopieren und ausführen):

```bash
# 1. Verzeichnis erstellen
mkdir -p "/mnt/d/claudeapps/von der idee zum prototyp"

# 2. Alle Dateien kopieren
cp -r /home/user/projekt/* "/mnt/d/claudeapps/von der idee zum prototyp/"

# 3. Unnötige Dateien löschen
rm -rf "/mnt/d/claudeapps/von der idee zum prototyp/node_modules"
rm -rf "/mnt/d/claudeapps/von der idee zum prototyp/.git"
rm -f "/mnt/d/claudeapps/von der idee zum prototyp/database/app.db"
rm -f "/mnt/d/claudeapps/von der idee zum prototyp"/*.log

# 4. Prüfen - sollte ~800KB zeigen
du -sh "/mnt/d/claudeapps/von der idee zum prototyp"

# 5. Dateien anzeigen
ls -la "/mnt/d/claudeapps/von der idee zum prototyp"
```

### ✅ Erfolgreich wenn:
- Größe: ~800 KB (ohne node_modules)
- Ordner sichtbar: backend, js, css, database, etc.
- Keine Fehlermeldungen

---

## SCHRITT 2: Installieren

### ⚠️ WICHTIG: Von Linux installieren (NICHT von D:\)!

Warum? SQLite kompiliert auf Linux schneller und zuverlässiger.

```bash
# Zu Projekt-Verzeichnis wechseln
cd /home/user/projekt

# Dependencies installieren (dauert 1-2 Minuten)
npm install

# Prüfen ob node_modules existiert
ls -d node_modules
```

### ✅ Erfolgreich wenn:
- `node_modules` Ordner existiert (~200 MB)
- Keine Fehler beim `npm install`
- Meldung: "added XXX packages"

---

## SCHRITT 3: Server starten

### Option A: Mit Start-Script (EMPFOHLEN)

```bash
cd /home/user/projekt
./start-server.sh
```

Du siehst dann:
```
🚀 Starte Server: Von der Idee zum Prototyp v3.0.0

✅ Starte Server auf Port 3000...

📍 URLs:
   - Hauptseite: http://localhost:3000/index.html
   - Landing Page: http://localhost:3000/landing.html
   - Dashboard: http://localhost:3000/dashboard.html
   - API Docs: http://localhost:3000/api/docs
   - Health Check: http://localhost:3000/api/health

╔════════════════════════════════════════════════╗
║  🎨 Von der Idee zum Prototyp - Backend       ║
║  🚀 Server running on http://localhost:3000  ║
╚════════════════════════════════════════════════╝

✅ Connected to SQLite database
✅ Database schema V3 initialized
```

### Option B: Manuell

```bash
cd /home/user/projekt

# Alte Prozesse beenden
pkill -f "node backend/server.js"

# Server starten
node backend/server.js
```

### ✅ Erfolgreich wenn:
- "Server running on http://localhost:3000" erscheint
- "Connected to SQLite database" erscheint
- Keine Fehlermeldungen

### ❌ Bei Fehler:

**Port bereits belegt?**
```bash
# Prozesse anzeigen
ps aux | grep node

# Beenden
pkill -f "node"

# Neu starten
./start-server.sh
```

---

## SCHRITT 4: Im Browser testen

### A) Health Check (API-Test)

**Im Browser öffnen:**
```
http://localhost:3000/api/health
```

**Erwartetes Ergebnis:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-03T...",
  "version": "3.0.0"
}
```

✅ Status = "ok"
✅ Version = "3.0.0"

---

### B) Landing Page öffnen

**Im Browser öffnen:**
```
http://localhost:3000/landing.html
```

**Was du sehen solltest:**
- Orange/Gelbe Farbgebung (#f59e0b)
- Überschrift: "Von der Idee zum Prototyp"
- "Jetzt starten" Button
- Preise: €2.99/Woche, €9.99/Monat, €99.99/Jahr
- 4-Schritte-Prozess (Idee → Brainstorming → PRD → Prototyp)

---

### C) Hauptseite öffnen

**Im Browser öffnen:**
```
http://localhost:3000/index.html
```

**Was du sehen solltest:**
- Login/Registrierung Buttons (falls nicht eingeloggt)
- Oder: Dashboard (falls eingeloggt)

---

### D) API Dokumentation

**Im Browser öffnen:**
```
http://localhost:3000/api/docs
```

**Was du sehen solltest:**
```json
{
  "endpoints": {
    "auth": { ... },
    "subscriptions": { ... },
    "workflows": { ... },
    "usage": { ... },
    "promo": { ... }
  }
}
```

✅ 5 Endpoint-Gruppen
✅ Keine Fehler

---

## SCHRITT 5: Alle Features testen

### Test 1: Registrierung

1. **Öffne:** http://localhost:3000/auth.html
2. **Klicke:** "Registrieren"
3. **Fülle aus:**
   - E-Mail: test@example.com
   - Passwort: test123456
   - (optional) Telefon: +49123456789
4. **Klicke:** "Registrieren"

**✅ Erfolgreich wenn:**
- Weiterleitung zum Dashboard
- Nachricht: "Registrierung erfolgreich"

---

### Test 2: Subscription Plan anzeigen

1. **Im Dashboard:** Schaue oben rechts
2. **Du solltest sehen:**
   - Plan: "Free"
   - Workflows: 0 / 0
   - Oder: Nach Registrierung "Daily Plan" mit 1 Workflow

**✅ Erfolgreich wenn:**
- Plan wird angezeigt
- Remaining workflows sichtbar

---

### Test 3: Idee generieren (Workflow Schritt 1)

1. **Auf der Hauptseite:** Klicke "Neue Idee"
2. **Eingabefeld:** Schreibe z.B.
   ```
   Eine App zum Organisieren von Rezepten mit KI-Vorschlägen
   ```
3. **Klicke:** "Ideen generieren"
4. **Warte:** 10-30 Sekunden (KI generiert Text)

**✅ Erfolgreich wenn:**
- Ideen werden generiert (3-5 Vorschläge)
- Text erscheint im Textfeld
- Keine Fehler

**❌ Falls Fehler:**
- API-Key fehlt? (Prüfe `config/api-config.json`)
- Keine Workflows übrig? (Upgrade zu Weekly Plan)

---

### Test 4: Brainstorming (Workflow Schritt 2)

1. **Nach Ideen-Generierung:** Klicke "Weiter zu Brainstorming"
2. **Warte:** KI analysiert deine Idee
3. **Ergebnis:** Detailliertes Brainstorming mit:
   - Zielgruppe
   - Features
   - Marktanalyse
   - USPs

**✅ Erfolgreich wenn:**
- Brainstorming-Text erscheint
- Gut strukturiert (Überschriften, Bullet Points)

---

### Test 5: PRD erstellen (Workflow Schritt 3)

1. **Nach Brainstorming:** Klicke "Weiter zu PRD"
2. **Warte:** KI erstellt PRD
3. **Ergebnis:** Professionelles Product Requirements Document mit:
   - Executive Summary
   - User Stories
   - Features
   - Technical Stack
   - Timeline

**✅ Erfolgreich wenn:**
- PRD ist detailliert und professionell
- Mehrere Abschnitte vorhanden

---

### Test 6: Prototyp generieren (Workflow Schritt 4)

1. **Nach PRD:** Klicke "Prototyp generieren"
2. **Warte:** KI generiert HTML/CSS/JavaScript Code
3. **Ergebnis:** Funktionierender Prototyp-Code

**✅ Erfolgreich wenn:**
- Code wird generiert (HTML, CSS, JS)
- Download-Button erscheint
- Code kann heruntergeladen werden

---

### Test 7: Promo-Code einlösen

1. **Im Dashboard:** Suche "Promo-Code einlösen" Button
2. **Oder öffne:** http://localhost:3000/dashboard.html
3. **Eingabefeld:** Gib ein:
   ```
   INFLUENCER-2025-FREE
   ```
4. **Klicke:** "Code einlösen"

**✅ Erfolgreich wenn:**
- Meldung: "Code erfolgreich eingelöst"
- +30 Workflows hinzugefügt
- +120 Tokens hinzugefügt
- Testphase: 14 Tage

---

### Test 8: Subscription Plans ansehen

1. **Öffne:** http://localhost:3000/index.html
2. **Scrolle zu:** "Preise" oder "Abonnements"
3. **Du solltest sehen:**
   - **Free**: 0 Workflows
   - **Daily**: 1 Workflow/Tag (€0.99)
   - **Weekly**: 8 Workflows/Woche (€2.99)
   - **Monthly**: 30 Workflows/Monat (€9.99)
   - **Yearly**: 365 Workflows/Jahr (€99.99)

**✅ Erfolgreich wenn:**
- Alle 5 Pläne werden angezeigt
- Preise korrekt
- "Beste Wahl" Badge bei Monthly

---

### Test 9: Usage Statistics

1. **Im Dashboard:** Klicke "Nutzungsstatistik"
2. **Du solltest sehen:**
   - Tool-spezifische Nutzung:
     - Ideas: X verwendet
     - Brainstorming: X verwendet
     - PRD: X verwendet
     - Prototype: X verwendet
   - Verbleibende Workflows
   - Verbleibende Tokens

**✅ Erfolgreich wenn:**
- Statistiken werden angezeigt
- Zahlen aktualisieren sich nach Workflow-Nutzung

---

### Test 10: Privacy Policy

1. **Öffne:** http://localhost:3000/privacy-policy.html
2. **Du solltest sehen:**
   - Vollständige Datenschutzerklärung (Deutsch)
   - DSGVO-konform
   - Kontaktdaten
   - Nutzerrechte

**✅ Erfolgreich wenn:**
- Seite lädt ohne Fehler
- Text ist vollständig formatiert
- Alle Abschnitte vorhanden

---

## WSL Test-Befehle (Alternative zu Browser)

Falls du lieber mit WSL testen willst:

### Quick Health Check
```bash
curl -s http://localhost:3000/api/health | python3 -m json.tool
```

### Alle Subscription Plans
```bash
curl -s http://localhost:3000/api/subscriptions/plans | python3 -m json.tool
```

### Registrierung testen
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456"
  }' | python3 -m json.tool
```

### Promo-Code testen (benötigt Token)
```bash
# Erst Login
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123456"}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")

# Dann Promo-Code einlösen
curl -X POST http://localhost:3000/api/promo/redeem \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"code":"INFLUENCER-2025-FREE"}' | python3 -m json.tool
```

### Workflows auflisten
```bash
curl -s http://localhost:3000/api/workflows/list \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
```

---

## Troubleshooting

### Problem: Server startet nicht

**Lösung 1: Port bereits belegt**
```bash
# Alle node-Prozesse anzeigen
ps aux | grep node

# Alle beenden
pkill -f node

# Neu starten
cd /home/user/projekt
./start-server.sh
```

**Lösung 2: node_modules fehlen**
```bash
cd /home/user/projekt
npm install
./start-server.sh
```

---

### Problem: Browser zeigt "Cannot GET /"

**Lösung: Richtige URL verwenden**
```
❌ FALSCH: http://localhost:3000/
✅ RICHTIG: http://localhost:3000/index.html
```

---

### Problem: "Failed to fetch" bei Workflows

**Ursache:** API-Key fehlt oder ungültig

**Lösung:**
```bash
# API-Config prüfen
cat config/api-config.json

# Falls leer, OpenAI API-Key hinzufügen:
{
  "openai": {
    "apiKey": "sk-..."
  }
}
```

---

### Problem: Keine Workflows übrig

**Lösung: Promo-Code einlösen**
```
Code: INFLUENCER-2025-FREE
Bonus: 30 Workflows + 120 Tokens
Dauer: 14 Tage
```

**Oder: Plan upgraden**
- Weekly: €2.99/Woche (8 Workflows)
- Monthly: €9.99/Monat (30 Workflows)

---

### Problem: Database error

**Lösung: Schema neu initialisieren**
```bash
cd /home/user/projekt

# Alte Datenbank löschen
rm database/app.db

# Server neu starten (erstellt neue DB)
./start-server.sh
```

---

### Problem: Port 3000 bereits belegt

**Lösung: Anderen Port verwenden**
```bash
PORT=3001 node backend/server.js
```

Dann öffnen: http://localhost:3001/index.html

---

## 📊 Checkliste: Ist alles bereit?

### Kopieren
- [ ] Dateien auf D:\ kopiert (~800 KB)
- [ ] backend/ Ordner vorhanden
- [ ] js/ Ordner vorhanden
- [ ] play-store-assets/ vorhanden

### Installation
- [ ] node_modules installiert (npm install)
- [ ] Keine Fehler beim Install
- [ ] node_modules Ordner ~200 MB

### Server
- [ ] Server läuft (http://localhost:3000)
- [ ] Health Check: ✅ Status "ok"
- [ ] Version: 3.0.0

### Browser-Tests
- [ ] Landing Page lädt
- [ ] Index.html lädt
- [ ] Registrierung funktioniert
- [ ] Login funktioniert
- [ ] Dashboard wird angezeigt

### Features
- [ ] Subscription Plans sichtbar (5 Pläne)
- [ ] Promo-Code einlösbar (INFLUENCER-2025-FREE)
- [ ] Workflow: Idee generieren
- [ ] Workflow: Brainstorming
- [ ] Workflow: PRD erstellen
- [ ] Workflow: Prototyp generieren

### Play Store Vorbereitung
- [ ] Privacy Policy öffnet sich
- [ ] Dokumentation vorhanden (PLAY_STORE_README.md)
- [ ] Asset-Struktur erstellt

---

## 🎯 Zusammenfassung

### Was du hast:
✅ Vollständige App (V3 System)
✅ Server läuft lokal
✅ Alle Features funktionieren
✅ Promo-Code System aktiv
✅ Play Store Dokumentation komplett

### Was als Nächstes:
1. **Icons erstellen** (512x512px)
2. **Screenshots aufnehmen** (8 Stück)
3. **Google Play Account** ($25)
4. **AAB bauen** (Android App Bundle)
5. **Launch** in 2-3 Monaten 🚀

---

## 📞 Hilfe & Support

### Dokumentation:
- `README.md` - Projekt-Übersicht
- `PLAY_STORE_README.md` - Play Store Guide
- `BUILD_AND_DEPLOY.md` - Deployment
- `V3_TEST_RESULTS.md` - Test-Ergebnisse

### Logs prüfen:
```bash
# Server-Output anzeigen
tail -f /tmp/server-startup.log

# Oder direkt im Terminal sehen (ohne &)
cd /home/user/projekt
node backend/server.js
```

### Bei Fragen:
- Prüfe `TROUBLESHOOTING.md` (falls vorhanden)
- Lies die Dokumentation in `play-store-assets/`
- Teste mit WSL-Befehlen (siehe oben)

---

**Viel Erfolg beim Testen! 🚀**

*Erstellt: 2025-11-03*
*Version: 1.0*
*Status: ✅ Komplett und bereit*
