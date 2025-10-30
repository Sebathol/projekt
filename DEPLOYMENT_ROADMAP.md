# 🚀 Deployment Roadmap - Von der Idee zum Prototyp

## Übersicht aller Versionen

| Version | Status | Beschreibung | Deployment-Ziel |
|---------|--------|--------------|-----------------|
| V1 | ✅ Deprecated | Originale Version ohne Subscription | - |
| V2 | ✅ Produktiv | Workflows/Tokens Trennung | `D:\claudeapps\von der idee zum prototyp` |
| V3 | 🚧 In Entwicklung | Tool-spezifisches Tracking + Weekly Plan | `D:\claudeapps\von der idee zum prototyp v3` |
| Play Store | 📅 Geplant | Android AAB für Google Play | Google Play Console |

---

## 📦 Version 2 (V2) - Produktiv

### Beschreibung
- Workflows/Tokens Trennung (1 Workflow = 4 Tokens)
- 4 Subscription-Pläne: Free, Daily, Monthly, Yearly
- Generisches Token-System
- Credits-System mit Nachkauf-Optionen

### Features
✅ 4 Workflow-Schritte (Idee, Brainstorming, PRD, Prototyp)
✅ Workflows = 4 Tokens fest
✅ Einzelne Tokens nachkaufbar
✅ Subscription-Verwaltung
✅ Claude Sonnet 4 Integration

### Deployment

#### WSL-Befehl zum Kopieren
```bash
# Alte Version löschen (falls vorhanden)
rm -rf /mnt/d/claudeapps/von\ der\ idee\ zum\ prototyp/*

# V2 nach D:\ kopieren
cp -r /home/user/projekt/* /mnt/d/claudeapps/von\ der\ idee\ zum\ prototyp/

# Bestätigung
echo "✅ V2 deployed to D:\claudeapps\von der idee zum prototyp"
ls -la /mnt/d/claudeapps/von\ der\ idee\ zum\ prototyp/
```

#### Alternative: Nur Backend + Frontend kopieren (ohne Git-History)
```bash
# Ordner erstellen
mkdir -p /mnt/d/claudeapps/von\ der\ idee\ zum\ prototyp

# Nur relevante Dateien kopieren
cd /home/user/projekt
cp -r backend /mnt/d/claudeapps/von\ der\ idee\ zum\ prototyp/
cp -r database /mnt/d/claudeapps/von\ der\ idee\ zum\ prototyp/
cp -r js /mnt/d/claudeapps/von\ der\ idee\ zum\ prototyp/
cp -r css /mnt/d/claudeapps/von\ der\ idee\ zum\ prototyp/
cp -r icons /mnt/d/claudeapps/von\ der\ idee\ zum\ prototyp/
cp *.html /mnt/d/claudeapps/von\ der\ idee\ zum\ prototyp/
cp *.json /mnt/d/claudeapps/von\ der\ idee\ zum\ prototyp/
cp *.md /mnt/d/claudeapps/von\ der\ idee\ zum\ prototyp/ 2>/dev/null || true

echo "✅ V2 deployed (ohne .git)"
```

### Git: V2 Tag erstellen
```bash
cd /home/user/projekt
git tag -a v2.0.0 f8d76ba -m "Version 2.0.0: Workflows/Tokens Separation System"
git push origin v2.0.0
```

### Testanleitung V2

#### 1. Server starten
```bash
cd /mnt/d/claudeapps/von\ der\ idee\ zum\ prototyp
npm install
node backend/server.js
```

**Erwartete Ausgabe:**
```
✅ Connected to SQLite database
✅ Database schema V2 initialized (Tokens/Workflows system)
╔════════════════════════════════════════════════╗
║  🎨 Von der Idee zum Prototyp - Backend       ║
║  🚀 Server running on http://localhost:3000   ║
║  📚 API Docs: http://localhost:3000/api/docs  ║
╚════════════════════════════════════════════════╝
```

#### 2. Test: Registrierung
**Browser:** http://localhost:3000/auth.html

**Schritte:**
1. Klicke auf "Registrieren"
2. Email: `test@example.com`
3. Passwort: `test123`
4. Klicke "Registrieren"

**Erwartetes Ergebnis:**
```json
{
  "message": "Registrierung erfolgreich",
  "credits": {
    "availableWorkflows": 3,
    "availableTokens": 0,
    "totalAvailableTokens": 12
  },
  "subscription": {
    "plan": "free"
  }
}
```

#### 3. Test: Credits-Anzeige
**Browser:** http://localhost:3000/index.html

**Nach Login sollte angezeigt werden:**
- Workflows: 3
- Einzelne Tokens: 0
- Gesamt verfügbar: 12 Tokens

#### 4. Test: Workflow durchführen
1. Klicke "Neue Idee generieren"
2. Gib ein Thema ein (z.B. "Restaurant-App")
3. Warte auf Ergebnis

**Erwartetes Ergebnis:**
- Credits reduzieren sich: Workflows: 2
- 1 Workflow = 4 Tokens wurden abgezogen

#### 5. Test: Nachkauf-Modal
1. Klicke auf "Nachkaufen" Button
2. Modal sollte sich öffnen
3. Zwei Optionen:
   - 5 Workflows für €5,00
   - 10 Tokens für €5,00

---

## 📦 Version 3 (V3) - In Entwicklung

### Beschreibung
- Tool-spezifisches Tracking (keine generischen Tokens mehr)
- Smart Validation für garantierte Workflows
- Nachkauf nur mit aktivem Paid-Abo
- **Neuer Plan: Weekly (€15, 8 Workflows, 7 Tage)**
- Telefonnummer: 06853/8579828

### Features
✅ Tool-spezifische Limits (Ideas: 2, Brainstorming: 2, PRD: 2, Prototype: 1 in Free)
✅ Garantierte komplette Workflows (Testversion: 3)
✅ Smart Recommendations bei einseitiger Nutzung
✅ Nachkauf-Restriktion (nur Paid-Abos)
✅ Weekly Plan (€15, 8 Workflows, 7 Tage)
✅ Ungleichmäßige Tool-Nutzung Warnung

### Deployment

#### WSL-Befehl zum Kopieren
```bash
# V3 in separaten Ordner deployen (parallel zu V2 testen)
mkdir -p /mnt/d/claudeapps/von\ der\ idee\ zum\ prototyp\ v3

# Komplettes Projekt kopieren
cp -r /home/user/projekt/* /mnt/d/claudeapps/von\ der\ idee\ zum\ prototyp\ v3/

echo "✅ V3 deployed to D:\claudeapps\von der idee zum prototyp v3"
```

#### Alternative: Nur V3-Dateien kopieren
```bash
# Ordner erstellen
mkdir -p /mnt/d/claudeapps/von\ der\ idee\ zum\ prototyp\ v3

# V3 spezifische Dateien
cd /home/user/projekt
cp -r backend /mnt/d/claudeapps/von\ der\ idee\ zum\ prototyp\ v3/
cp -r database /mnt/d/claudeapps/von\ der\ idee\ zum\ prototyp\ v3/
cp -r js /mnt/d/claudeapps/von\ der\ idee\ zum\ prototyp\ v3/
cp -r css /mnt/d/claudeapps/von\ der\ idee\ zum\ prototyp\ v3/
cp -r icons /mnt/d/claudeapps/von\ der\ idee\ zum\ prototyp\ v3/
cp *.html /mnt/d/claudeapps/von\ der\ idee\ zum\ prototyp\ v3/
cp *.json /mnt/d/claudeapps/von\ der\ idee\ zum\ prototyp\ v3/
cp PLAY_STORE_MATERIALS.md /mnt/d/claudeapps/von\ der\ idee\ zum\ prototyp\ v3/
cp UPDATE_SUMMARY_V3.md /mnt/d/claudeapps/von\ der\ idee\ zum\ prototyp\ v3/
cp DEPLOYMENT_ROADMAP.md /mnt/d/claudeapps/von\ der\ idee\ zum\ prototyp\ v3/

echo "✅ V3 deployed"
```

### Git: V3 Tag erstellen
```bash
cd /home/user/projekt
git tag -a v3.0.0 81b2229 -m "Version 3.0.0: Tool-specific tracking + Weekly plan + Play Store ready"
git push origin v3.0.0
```

### Testanleitung V3

#### 1. Server starten
```bash
cd /mnt/d/claudeapps/von\ der\ idee\ zum\ prototyp\ v3
npm install
node backend/server.js
```

**Erwartete Ausgabe:**
```
✅ Connected to SQLite database
✅ Database schema V3 initialized (Tool-specific tracking system)
╔════════════════════════════════════════════════╗
║  🎨 Von der Idee zum Prototyp - Backend       ║
║  🚀 Server running on http://localhost:3000   ║
║  📚 API Docs: http://localhost:3000/api/docs  ║
╚════════════════════════════════════════════════╝
```

#### 2. Test: Registrierung (V3 Response)
**Browser:** http://localhost:3000/auth.html

**Schritte:**
1. Registrieren mit neuer Email
2. Email: `v3test@example.com`
3. Passwort: `test123`

**Erwartetes Ergebnis (V3 Format):**
```json
{
  "message": "Registrierung erfolgreich",
  "toolUsage": {
    "ideas": { "used": 0, "limit": 2, "remaining": 2 },
    "brainstorming": { "used": 0, "limit": 2, "remaining": 2 },
    "prd": { "used": 0, "limit": 2, "remaining": 2 },
    "prototype": { "used": 0, "limit": 1, "remaining": 1 }
  },
  "workflows": {
    "completed": 0,
    "guaranteedRemaining": 3
  },
  "subscription": {
    "plan": "free",
    "active": true
  }
}
```

#### 3. Test: V3 Credits-UI
**Browser:** http://localhost:3000/index.html

**Nach Login sollte V3 UI anzeigen:**

```
📊 Dein Testversion Plan
Unbegrenzt gültig

[Tool-spezifische Karten:]

💡 Ideengenerierung          🧠 Brainstorming
█████░░░░░ 0 / 2            █████░░░░░ 0 / 2

📄 PRD/PAD Erstellung        💻 Prototyp-Generierung
█████░░░░░ 0 / 2            █████░░░░░ 0 / 1

[Workflow Summary:]
✅ Abgeschlossene Workflows: 0
🎯 Noch möglich: 1 von 3 garantiert

[Upgrade Prompt für Free User:]
⭐ Upgrade für mehr Workflows!
Nachkauf nur mit aktivem Tages-, Wochen-, Monats- oder Jahresabo möglich.
[Jetzt upgraden]
```

#### 4. Test: Tool-spezifische Limits
**Szenario: Testversion-Limits testen**

1. **Idee generieren** (2x möglich)
   - Erste Nutzung: Ideas 1/2
   - Zweite Nutzung: Ideas 2/2
   - Dritte Nutzung: ❌ Sollte blockieren

2. **Ungleichmäßige Nutzung testen**
   - Nutze Ideas 2x
   - Nutze Brainstorming 0x
   - Nutze PRD 0x
   - Nutze Prototype 0x

   **Erwartete Warnung:**
   ```
   ⚠️ Achtung: Ungleichmäßige Tool-Nutzung!
   Sie können nur noch 0 komplette Workflows durchführen.
   ```

#### 5. Test: Smart Validation API
```bash
curl http://localhost:3000/api/subscriptions/usage \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Erwartete Response:**
```json
{
  "canCompleteWorkflow": true,
  "potentialCompleteWorkflows": 1,
  "guaranteedCompleteWorkflows": 3,
  "recommendation": ""
}
```

**Nach 2x Ideas ohne andere Tools:**
```json
{
  "canCompleteWorkflow": false,
  "potentialCompleteWorkflows": 0,
  "recommendation": "Achtung: Ungleichmäßige Tool-Nutzung! Sie können nur noch 0 komplette Workflows durchführen."
}
```

#### 6. Test: Nachkauf-Restriktion (Free User)
1. Klicke auf "Nachkaufen" Button
2. **Button sollte NICHT erscheinen** (nur bei Free-Plan)

**Stattdessen Upgrade-Prompt:**
```
⭐ Upgrade für mehr Workflows!
Nachkauf nur mit aktivem Tages-, Wochen-, Monats- oder Jahresabo möglich.
[Jetzt upgraden]
```

3. Klicke "Jetzt upgraden"
4. Alert: "Abo-Verwaltung wird noch implementiert. Bitte kontaktiere support@aistormcreate.com oder rufe an: 06853/8579828"

#### 7. Test: Weekly Plan (Datenbank direkt)
```bash
# SQLite öffnen
cd /mnt/d/claudeapps/von\ der\ idee\ zum\ prototyp\ v3
sqlite3 database/app.db

# Weekly Plan testen
UPDATE subscriptions
SET plan = 'weekly',
    workflows_limit = 8,
    tokens_limit = 32,
    valid_until = datetime('now', '+7 days')
WHERE user_id = 1;

# Limits überprüfen
SELECT * FROM tool_limits WHERE plan = 'weekly';

# Exit
.exit
```

**Seite neu laden - sollte zeigen:**
- Plan: "Wochenabo"
- Ideas: 0/8
- Brainstorming: 0/8
- PRD: 0/8
- Prototype: 0/8
- "Nachkaufen" Button SICHTBAR (weil paid plan)

#### 8. Test: Nachkauf mit Paid-Abo
1. Mit Weekly-Plan eingeloggt
2. "Nachkaufen" Button klicken
3. Modal sollte öffnen mit:
   - 5 Workflows für €4,99
   - 10 Tokens für €4,99

4. "Workflows kaufen" klicken
5. Test-Kauf sollte durchgehen (paymentId: test_workflow_xxx)

---

## 📦 Play Store Version - Android AAB

### Beschreibung
- Basiert auf V3
- Android App Bundle für Google Play Store
- Trusted Web Activity (TWA)
- In-App Purchases konfiguriert

### Vorbereitung

#### Dokumentation vorhanden
✅ `PLAY_STORE_MATERIALS.md` - Komplette Play Store Materialien
✅ App-Beschreibungen (Deutsch)
✅ 8 Screenshot-Definitionen
✅ Privacy Policy & Terms of Service
✅ Pricing: 5 Subscriptions + 2 IAPs

#### Nächste Schritte
1. Android Studio installieren
2. TWA-Projekt erstellen mit Bubblewrap
3. AAB bauen
4. Google Play Console einrichten
5. In-App Products konfigurieren

### Build-Prozess (geplant)

```bash
# Bubblewrap installieren
npm install -g @bubblewrap/cli

# TWA initialisieren
bubblewrap init --manifest https://aistormcreate.com/manifest.json

# AAB bauen
bubblewrap build

# Output: app-release.aab
```

### Play Store Setup

#### 1. App-Informationen
- **App-Name:** Von der Idee zum Prototyp
- **Kurzbeschreibung:** siehe `PLAY_STORE_MATERIALS.md`
- **Kategorie:** Produktivität
- **Zielgruppe:** 18+
- **Telefon:** 06853/8579828

#### 2. In-App Products
```
Subscriptions:
- com.aistormcreate.prototype.free (€0 - lifetime)
- com.aistormcreate.prototype.daily (€5 - 1 day)
- com.aistormcreate.prototype.weekly (€15 - 7 days)
- com.aistormcreate.prototype.monthly (€29 - 30 days)
- com.aistormcreate.prototype.yearly (€249 - 365 days)

Consumables:
- com.aistormcreate.prototype.workflows_5 (€4,99)
- com.aistormcreate.prototype.tokens_10 (€4,99)
```

---

## 🗺️ Migrations-Pfad

### Von V2 zu V3 migrieren

#### Datenbank-Migration
```bash
# Backup V2 Database
cp /mnt/d/claudeapps/von\ der\ idee\ zum\ prototyp/database/app.db \
   /mnt/d/claudeapps/von\ der\ idee\ zum\ prototyp/database/app.db.v2.backup

# V3 Schema anwenden
cd /mnt/d/claudeapps/von\ der\ idee\ zum\ prototyp\ v3
sqlite3 database/app.db < database/schema_v3.sql
```

#### Benutzer-Daten migrieren (optional)
```sql
-- Alte V2 Users in V3 importieren
ATTACH DATABASE '/mnt/d/claudeapps/von der idee zum prototyp/database/app.db' AS v2db;

-- Users kopieren
INSERT INTO users (id, email, password_hash, created_at, last_login)
SELECT id, email, password_hash, created_at, last_login FROM v2db.users;

-- Subscriptions konvertieren
INSERT INTO subscriptions (user_id, plan, workflows_limit, tokens_limit, active, valid_until)
SELECT
  user_id,
  plan,
  CASE plan
    WHEN 'free' THEN 3
    WHEN 'daily' THEN 3
    WHEN 'monthly' THEN 24
    WHEN 'yearly' THEN 24
    ELSE 3
  END as workflows_limit,
  CASE plan
    WHEN 'free' THEN 12
    WHEN 'daily' THEN 12
    WHEN 'monthly' THEN 96
    WHEN 'yearly' THEN 96
    ELSE 12
  END as tokens_limit,
  active,
  valid_until
FROM v2db.subscriptions;

DETACH DATABASE v2db;
```

---

## 📊 Vergleichstabelle

| Feature | V2 | V3 |
|---------|----|----|
| Token-System | ✅ Generisch (1 Workflow = 4 Tokens) | ✅ Tool-spezifisch |
| Workflow-Garantie | ❌ Keine | ✅ Garantierte komplette Workflows |
| Smart Validation | ❌ Nein | ✅ Ja, warnt bei einseitiger Nutzung |
| Nachkauf-Restriktion | ❌ Alle können kaufen | ✅ Nur Paid-Abos |
| Weekly Plan | ❌ Nein | ✅ €15, 8 Workflows, 7 Tage |
| Free Plan Limits | Workflows: 3 | Ideas: 2, Brainstorm: 2, PRD: 2, Prototype: 1 |
| Credits-UI | Token-Zähler | Tool-spezifische Progress Bars |
| Telefonnummer | 06873/8579828 | 06853/8579828 |
| Play Store Ready | ❌ Nein | ✅ Ja, Materialien vorhanden |

---

## 🚦 Deployment-Checkliste

### V2 Produktiv-Deployment
- [ ] Code nach `D:\claudeapps\von der idee zum prototyp` kopieren
- [ ] `npm install` ausführen
- [ ] Server starten und Health-Check
- [ ] Registrierung testen
- [ ] Workflow-Durchlauf testen
- [ ] Nachkauf-Modal testen
- [ ] Subscription-Verwaltung testen

### V3 Test-Deployment
- [ ] Code nach `D:\claudeapps\von der idee zum prototyp v3` kopieren
- [ ] `npm install` ausführen
- [ ] Server starten (Port 3000)
- [ ] V3 Response-Format prüfen (toolUsage)
- [ ] Tool-spezifische UI testen
- [ ] Smart Validation API testen
- [ ] Nachkauf-Restriktion (Free) testen
- [ ] Weekly Plan testen
- [ ] Ungleichmäßige Nutzung testen

### Play Store Vorbereitung
- [ ] Screenshots erstellen (8 Stück)
- [ ] Feature Graphic designen (1024x500px)
- [ ] App Icon finalisieren (512x512px)
- [ ] Privacy Policy hochladen
- [ ] Terms of Service hochladen
- [ ] AAB bauen mit Bubblewrap
- [ ] Google Play Console einrichten
- [ ] In-App Products konfigurieren
- [ ] Test-Release (Internal Testing)
- [ ] Produktiv-Release

---

## 📞 Support & Kontakt

**Bei Fragen zu V2:**
- Email: support@aistormcreate.com
- Telefon: 06873/8579828 (alte Nummer)

**Bei Fragen zu V3 & Play Store:**
- Email: support@aistormcreate.com
- Telefon: **06853/8579828** (neue Nummer)

---

## 🎯 Empfohlener Ablauf

### Woche 1: V3 Testing
1. V3 in separatem Ordner deployen
2. Alle V3 Tests durchführen
3. Bugs fixen
4. Performance-Tests

### Woche 2: V3 Produktiv
1. V2 Backup erstellen
2. V3 nach `D:\claudeapps\von der idee zum prototyp` deployen
3. Datenbank migrieren (optional)
4. Beta-Tester einladen

### Woche 3-4: Play Store
1. Screenshots erstellen
2. AAB bauen
3. Play Console einrichten
4. Internal Testing
5. Closed Beta
6. Open Beta

### Woche 5: Produktiv-Release
1. Play Store Produktiv-Release
2. Marketing starten
3. Monitoring einrichten
4. User-Feedback sammeln

---

**Version:** 3.0.0
**Erstellt:** 2025-10-30
**Autor:** Claude Code
**Status:** 🚀 Ready for Deployment
