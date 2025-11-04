# 🚀 API Setup Guide - Gemini & Claude APIs

**Letzte Aktualisierung:** 4. November 2025
**Für:** Von der Idee zum Prototyp - Hybrid API System

---

## 📋 Übersicht

Diese Anleitung zeigt dir **Schritt für Schritt**, wie du die APIs für dein Projekt einrichtest:

1. ✅ **Gemini API** (Google) - KOSTENLOS für FREE-User
2. ✅ **Claude API** (Anthropic) - Premium-Qualität für Paid-User
3. ✅ **Lokale Testumgebung** einrichten
4. ✅ **Google Play Store** Deployment vorbereiten

---

## 1️⃣ GEMINI API EINRICHTEN (KOSTENLOS!)

### Schritt 1: Google AI Studio Account erstellen

1. Gehe zu: **https://aistudio.google.com/**
2. Klicke auf **"Get started"** oder **"Sign in"**
3. Melde dich mit deinem **Google Account** an (Gmail)
4. Akzeptiere die Terms of Service

### Schritt 2: API Key generieren

1. In Google AI Studio, klicke links auf **"Get API key"**
2. Klicke auf **"Create API key"**
3. Wähle ein Google Cloud Projekt aus (oder erstelle ein neues):
   - Klicke auf **"Create API key in new project"**
   - Projektname: z.B. `von-der-idee-zum-prototyp`
4. **WICHTIG:** Kopiere den API Key sofort und speichere ihn sicher!
   ```
   Beispiel: AIzaSyB1234567890abcdefghijklmnopqrstuvw
   ```

### Schritt 3: API-Einstellungen prüfen

1. Gehe zu **Google Cloud Console**: https://console.cloud.google.com/
2. Wähle dein Projekt aus (oben in der Leiste)
3. Navigiere zu **"APIs & Services" → "Enabled APIs"**
4. Stelle sicher, dass folgende API aktiviert ist:
   - ✅ **Generative Language API**

   Falls nicht aktiviert:
   - Gehe zu **"APIs & Services" → "Library"**
   - Suche nach **"Generative Language API"**
   - Klicke auf **"Enable"**

### Schritt 4: Modell-Einstellungen (bereits korrekt konfiguriert)

Das Projekt nutzt bereits das richtige Modell:
```javascript
// In backend/gemini-api.js (Zeile 29)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
```

**Verfügbare Gemini Modelle:**
- ✅ `gemini-1.5-pro` - **EMPFOHLEN** (beste Balance aus Qualität & Geschwindigkeit)
- `gemini-1.5-flash` - Schneller, aber etwas weniger präzise
- `gemini-1.0-pro` - Älteres Modell (nicht empfohlen)

### Schritt 5: Kostenlose Limits prüfen

**Gemini API Free Tier:**
- ✅ **1,500 Requests pro Tag** (KOSTENLOS!)
- ✅ **60 Requests pro Minute**
- ✅ **32,000 Tokens pro Request**
- ✅ Keine Kreditkarte erforderlich!

**Für dein Projekt:**
- FREE-User: 3 Workflows = ca. 12 API Calls
- Bei 100 FREE-Usern pro Tag: 1,200 Calls → **Passt perfekt ins Free Tier!**

Limits anzeigen:
1. Google Cloud Console → **"APIs & Services" → "Quotas"**
2. Suche nach **"Generative Language API"**
3. Prüfe: "Requests per minute" und "Requests per day"

---

## 2️⃣ CLAUDE API EINRICHTEN (KOSTENPFLICHTIG)

### Schritt 1: Anthropic Account erstellen

1. Gehe zu: **https://console.anthropic.com/**
2. Klicke auf **"Sign Up"**
3. Registriere dich mit E-Mail oder Google Account
4. Bestätige deine E-Mail-Adresse

### Schritt 2: Zahlungsmethode hinzufügen

1. In der Anthropic Console, gehe zu **"Settings" → "Billing"**
2. Klicke auf **"Add payment method"**
3. Füge Kreditkarte hinzu
4. **Optional:** Setze ein Ausgabenlimit (z.B. €50/Monat zur Sicherheit)
   - Settings → Billing → **"Usage Limits"**
   - Setze: **"Monthly spending limit"** auf €50

### Schritt 3: API Key generieren

1. Gehe zu **"API Keys"** (links im Menü)
2. Klicke auf **"Create Key"**
3. Name: `von-der-idee-zum-prototyp-production`
4. **Permissions:** "All" (Standard)
5. Klicke **"Create Key"**
6. **WICHTIG:** Kopiere den API Key sofort!
   ```
   Beispiel: sk-ant-api03-1234567890abcdefghijklmnopqrstuvwxyz...
   ```
7. Speichere ihn sicher (du siehst ihn nur EINMAL!)

### Schritt 4: Modell-Einstellungen prüfen

Das Projekt nutzt bereits das neueste Modell:
```javascript
// In backend/claude-api.js (Zeile 31)
const MODEL = 'claude-sonnet-4-20250514';
```

**Claude Modelle (Stand 2025):**
- ✅ `claude-sonnet-4-20250514` - **EMPFOHLEN** (beste Qualität für Prototypen)
- `claude-opus-4-20250514` - Noch besser, aber teurer (nicht nötig für dieses Projekt)
- `claude-haiku-4-20250514` - Schneller & günstiger (aber weniger kreativ)

### Schritt 5: Kosten kalkulieren

**Claude Sonnet 4 Preise (per 1M Tokens):**
- Input: $3.00 (ca. €3.30)
- Output: $15.00 (ca. €16.50)

**Für dein Projekt (pro Workflow):**
- Input: ~3,000 Tokens (PRD-Erstellung)
- Output: ~5,000 Tokens (PRD + Prototyp)
- **Kosten pro Workflow: ~€0.16**

**Monatliche Kalkulation:**
- 100 Paid-User × 30 Workflows/Monat = 3,000 Workflows
- 3,000 × €0.16 = **€480/Monat**
- **Einnahmen:** 100 × €29.99 = **€2,999/Monat**
- **Profit:** €2,999 - €480 = **€2,519/Monat** ✅

Budget-Alarm einrichten:
1. Anthropic Console → **Settings → Billing → Notifications**
2. Aktiviere **"Email alerts at"**: €400 (80% des Limits)

---

## 3️⃣ APIS LOKAL FÜR TESTS EINRICHTEN

### Schritt 1: config/api-config.json erstellen

1. Öffne ein Terminal und navigiere zu deinem Projekt:
   ```bash
   cd /home/user/projekt
   ```

2. Erstelle das config-Verzeichnis (falls nicht vorhanden):
   ```bash
   mkdir -p config
   ```

3. Erstelle die Datei `config/api-config.json`:
   ```bash
   nano config/api-config.json
   ```

4. Füge BEIDE API Keys ein:
   ```json
   {
     "geminiApiKey": "AIzaSyB_DEIN_GEMINI_API_KEY_HIER",
     "claudeApiKey": "sk-ant-api03-DEIN_CLAUDE_API_KEY_HIER"
   }
   ```

   **Beispiel mit echten Keys:**
   ```json
   {
     "geminiApiKey": "AIzaSyB1234567890abcdefghijklmnopqrstuvw",
     "claudeApiKey": "sk-ant-api03-1234567890abcdefghijklmnopqrstuvwxyz..."
   }
   ```

5. Speichern: `CTRL+O` → `Enter` → `CTRL+X`

6. **WICHTIG:** Schütze diese Datei vor Git-Commits!
   ```bash
   echo "config/api-config.json" >> .gitignore
   ```

### Schritt 2: Dependencies installieren

1. Installiere alle Node-Pakete (inklusive Gemini):
   ```bash
   npm install
   ```

   Dies installiert:
   - `@google/generative-ai` (Gemini)
   - `express`, `cors`, `sqlite3`, `bcryptjs`, `jsonwebtoken`

2. Prüfe die Installation:
   ```bash
   npm list @google/generative-ai
   ```

   Sollte zeigen:
   ```
   von-der-idee-zum-prototyp@3.0.0
   └── @google/generative-ai@0.21.0
   ```

### Schritt 3: Backend starten und testen

1. Starte den Server:
   ```bash
   node backend/server.js
   ```

   Du solltest sehen:
   ```
   🌐 Server läuft auf Port 3000
   📁 Datenbank initialisiert
   ✅ Server bereit für Anfragen
   ```

2. In einem anderen Terminal-Fenster, teste die API:
   ```bash
   curl http://localhost:3000/api/health
   ```

   Erwartete Antwort:
   ```json
   {"status":"healthy","timestamp":"2025-11-04T..."}
   ```

### Schritt 4: API-Funktionalität testen

#### Test 1: Gemini API (FREE-User)

1. Erstelle einen Test-User mit FREE-Plan:
   ```bash
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User Free",
       "email": "testfree@example.com",
       "password": "TestPass123!"
     }'
   ```

2. Logge dich ein:
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "testfree@example.com",
       "password": "TestPass123!"
     }'
   ```

   Kopiere das `token` aus der Response.

3. Generiere Ideen (nutzt Gemini API):
   ```bash
   curl -X POST http://localhost:3000/api/workflows/generate-ideas \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer DEIN_TOKEN_HIER" \
     -d '{
       "mode": "brainstorming",
       "input": "KI-gestützte Fitness-App",
       "lang": "de"
     }'
   ```

   **Erwartete Response:**
   ```json
   {
     "message": "Ideen erfolgreich generiert",
     "ideas": [...],
     "api": {
       "name": "Gemini",
       "provider": "Google",
       "plan": "free"
     },
     "cost": "0.00"
   }
   ```

   ✅ **Erfolg!** Gemini API wird für FREE-User genutzt!

#### Test 2: Claude API (Paid-User)

1. Erstelle einen Test-User:
   ```bash
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User Paid",
       "email": "testpaid@example.com",
       "password": "TestPass123!"
     }'
   ```

2. Upgrade den User auf MONATS-ABO:
   ```bash
   sqlite3 database.db <<EOF
   INSERT INTO subscriptions (user_id, plan, start_date, workflows_used)
   VALUES (
     (SELECT user_id FROM users WHERE email='testpaid@example.com'),
     'month',
     datetime('now'),
     0
   );

   INSERT INTO active_subscriptions (user_id, subscription_id, active)
   VALUES (
     (SELECT user_id FROM users WHERE email='testpaid@example.com'),
     (SELECT subscription_id FROM subscriptions WHERE user_id=(SELECT user_id FROM users WHERE email='testpaid@example.com') ORDER BY subscription_id DESC LIMIT 1),
     1
   );
   EOF
   ```

3. Logge dich ein und teste:
   ```bash
   # Login
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "testpaid@example.com",
       "password": "TestPass123!"
     }'

   # Kopiere Token und teste Ideengenerierung
   curl -X POST http://localhost:3000/api/workflows/generate-ideas \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer DEIN_TOKEN_HIER" \
     -d '{
       "mode": "brainstorming",
       "input": "Nachhaltige E-Commerce Plattform",
       "lang": "de"
     }'
   ```

   **Erwartete Response:**
   ```json
   {
     "message": "Ideen erfolgreich generiert",
     "ideas": [...],
     "api": {
       "name": "Claude Sonnet 4",
       "provider": "Anthropic",
       "plan": "month"
     },
     "cost": "0.1234"
   }
   ```

   ✅ **Erfolg!** Claude API wird für Paid-User genutzt!

---

## 4️⃣ GOOGLE PLAY STORE DEPLOYMENT

### Schritt 1: Umgebungsvariablen für Production

**WICHTIG:** API Keys NIEMALS direkt in den Code schreiben!

#### Option A: Environment Variables (EMPFOHLEN)

1. Auf dem Server erstelle `.env.production`:
   ```bash
   GEMINI_API_KEY=AIzaSyB_DEIN_GEMINI_KEY
   CLAUDE_API_KEY=sk-ant-api03-DEIN_CLAUDE_KEY
   NODE_ENV=production
   PORT=3000
   ```

2. Installiere dotenv:
   ```bash
   npm install dotenv --save
   ```

3. Update `backend/server.js` (erste Zeile hinzufügen):
   ```javascript
   require('dotenv').config();

   const express = require('express');
   // ... rest of code
   ```

4. Update `backend/gemini-api.js` und `backend/claude-api.js`:
   ```javascript
   // Zeile 12-21 in beiden Dateien ersetzen:
   let API_KEY = process.env.GEMINI_API_KEY; // bzw. CLAUDE_API_KEY

   // Fallback zu config-Datei für lokale Entwicklung
   if (!API_KEY && fs.existsSync(configPath)) {
     const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
     API_KEY = config.geminiApiKey; // bzw. claudeApiKey
   }

   if (!API_KEY) {
     throw new Error('❌ API Key nicht konfiguriert!');
   }
   ```

### Schritt 2: Backend deployen

#### Option A: Google Cloud App Engine (EMPFOHLEN)

1. Installiere Google Cloud SDK:
   ```bash
   curl https://sdk.cloud.google.com | bash
   exec -l $SHELL
   gcloud init
   ```

2. Erstelle `app.yaml`:
   ```yaml
   runtime: nodejs20

   env_variables:
     NODE_ENV: "production"

   automatic_scaling:
     min_instances: 1
     max_instances: 10
     target_cpu_utilization: 0.65

   handlers:
   - url: /.*
     script: auto
     secure: always
   ```

3. Deploye Backend:
   ```bash
   gcloud app deploy
   ```

4. Setze Environment Variables:
   ```bash
   gcloud app deploy --set-env-vars="GEMINI_API_KEY=AIzaSyB...,CLAUDE_API_KEY=sk-ant..."
   ```

5. Prüfe Deployment:
   ```bash
   gcloud app browse
   ```

#### Option B: Heroku (Alternative)

1. Erstelle `Procfile`:
   ```
   web: node backend/server.js
   ```

2. Deploye zu Heroku:
   ```bash
   heroku create von-der-idee-zum-prototyp
   heroku config:set GEMINI_API_KEY=AIzaSyB...
   heroku config:set CLAUDE_API_KEY=sk-ant-api03-...
   git push heroku main
   ```

### Schritt 3: Frontend für Production konfigurieren

1. Erstelle `frontend/config.js`:
   ```javascript
   const API_BASE_URL = process.env.NODE_ENV === 'production'
     ? 'https://von-der-idee-zum-prototyp.appspot.com/api'  // Deine Production URL
     : 'http://localhost:3000/api';

   export default {
     apiUrl: API_BASE_URL
   };
   ```

2. In `index.html`, verwende die Config:
   ```javascript
   import config from './frontend/config.js';

   // API calls nutzen:
   fetch(`${config.apiUrl}/workflows/generate-ideas`, { ... });
   ```

### Schritt 4: Android App Bundle erstellen

1. Für React Native oder WebView-App, erstelle Production Build:
   ```bash
   # React Native:
   cd android
   ./gradlew bundleRelease

   # Output: android/app/build/outputs/bundle/release/app-release.aab
   ```

2. Signiere die App (falls nicht automatisch):
   ```bash
   jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 \
     -keystore my-release-key.keystore \
     app-release.aab \
     my-key-alias
   ```

3. Upload zu Google Play Console:
   - URL: https://play.google.com/console
   - **Production → Create new release**
   - Lade `app-release.aab` hoch

---

## 5️⃣ SICHERHEIT & MONITORING

### API Key Sicherheit

1. **IP Restrictions** (optional):
   - Google Cloud Console → Credentials → API Key → **IP addresses**
   - Füge Server-IPs hinzu

2. **Rate Limiting:**
   - Bereits implementiert in `backend/middleware/rate-limiter.js`
   - 100 Requests pro 15 Minuten pro IP

3. **API Key Rotation:**
   - Gemini: Alle 90 Tage neuen Key generieren
   - Claude: Alle 90 Tage neuen Key generieren
   - Update Environment Variables

### Monitoring einrichten

1. **Gemini API Monitoring:**
   ```
   https://console.cloud.google.com/apis/dashboard
   ```
   - Prüfe: Requests/day, Errors, Latency

2. **Claude API Monitoring:**
   ```
   https://console.anthropic.com/settings/usage
   ```
   - Prüfe: Tokens used, Cost

3. **Budget Alerts:**
   - Google Cloud: Console → Billing → Budgets & Alerts
   - Anthropic: Settings → Billing → Notifications

---

## 6️⃣ TROUBLESHOOTING

### Problem 1: "Gemini API Key nicht konfiguriert"

**Lösung:**
```bash
# Prüfe Datei:
cat config/api-config.json

# Prüfe Format:
node -e "console.log(JSON.parse(require('fs').readFileSync('config/api-config.json')))"
```

### Problem 2: "Google API Error: 400 - API key not valid"

**Mögliche Ursachen:**
1. Key falsch kopiert → Prüfe auf Leerzeichen
2. API nicht aktiviert → Enable "Generative Language API"
3. Quota überschritten → Prüfe Quotas in Console

### Problem 3: "Claude API Error: 401 - Invalid API Key"

**Lösungen:**
```bash
# 1. Key-Format prüfen (muss mit sk-ant-api03- beginnen)
cat config/api-config.json | grep claudeApiKey

# 2. Neuen Key generieren in Console
```

### Problem 4: Fallback wird immer ausgelöst

**Debug:**
```bash
# Backend-Logs prüfen:
tail -f logs/server.log

# Direkter API-Test (Claude):
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $DEIN_CLAUDE_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{"model": "claude-sonnet-4-20250514", "max_tokens": 1024, "messages": [{"role": "user", "content": "Hallo"}]}'
```

---

## 7️⃣ CHECKLISTE FÜR GO-LIVE

### Pre-Launch Checklist

- [ ] **Gemini API:**
  - [ ] Key generiert und getestet
  - [ ] Quotas geprüft (1,500 requests/day)
  - [ ] Monitoring aktiviert

- [ ] **Claude API:**
  - [ ] Key generiert und getestet
  - [ ] Zahlungsmethode hinterlegt
  - [ ] Budget-Alarm gesetzt (€50/Monat)
  - [ ] Monitoring aktiviert

- [ ] **Backend:**
  - [ ] Environment Variables konfiguriert
  - [ ] `.gitignore` enthält `config/api-config.json`
  - [ ] Fallback-Mechanismus getestet
  - [ ] Production-Server deployed

- [ ] **Frontend:**
  - [ ] Production API URL konfiguriert
  - [ ] HTTPS aktiviert
  - [ ] App getestet

- [ ] **Google Play Store:**
  - [ ] App Bundle erstellt
  - [ ] Release Notes vorbereitet
  - [ ] Screenshots hochgeladen

---

## 📧 SUPPORT

**Bei Fragen:**
- E-Mail: aistormcreate.service@gmail.com
- Gemini Support: https://ai.google.dev/gemini-api/docs/support
- Claude Support: https://support.anthropic.com/

---

**© 2025 AI Storm Create - Sebastian Beyer**
