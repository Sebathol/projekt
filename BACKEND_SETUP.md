# Backend Setup Guide

## Installation

### 1. Node.js installieren

Falls noch nicht installiert:
```bash
# Windows (mit Chocolatey)
choco install nodejs

# Linux (Ubuntu/Debian)
sudo apt update
sudo apt install nodejs npm

# macOS (mit Homebrew)
brew install node
```

### 2. Dependencies installieren

```bash
cd /home/user/projekt
npm install
```

### 3. API Key konfigurieren

Bearbeite `config/api-config.json`:
```json
{
  "claudeApiKey": "sk-ant-api03-DEIN_ECHTER_KEY_HIER"
}
```

**WICHTIG:** Dieser API Key ist DEIN Key (Operator), nicht der User-Key!

### 4. AdMob konfigurieren (optional)

Bearbeite `config/admob-config.json`:
```json
{
  "bannerAdUnitId": "ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY",
  "interstitialAdUnitId": "ca-app-pub-XXXXXXXXXXXXXXXX/ZZZZZZZZZZ",
  "rewardedVideoAdUnitId": "ca-app-pub-XXXXXXXXXXXXXXXX/WWWWWWWWWW",
  "testMode": false
}
```

Erstelle Google AdMob Account: https://admob.google.com/

---

## Server starten

### Development Mode (mit Auto-Reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

Server läuft auf: **http://localhost:3000**

---

## API Endpoints

### Health Check
```bash
curl http://localhost:3000/api/health
```

### API Documentation
```bash
curl http://localhost:3000/api/docs
```

---

## Database

Die SQLite Datenbank wird automatisch erstellt: `database/app.db`

### Schema anzeigen
```bash
sqlite3 database/app.db ".schema"
```

### Daten anzeigen
```bash
# Alle Users
sqlite3 database/app.db "SELECT * FROM users;"

# Alle Subscriptions
sqlite3 database/app.db "SELECT * FROM subscriptions;"

# Workflows mit Kosten
sqlite3 database/app.db "SELECT * FROM workflows_with_costs;"
```

---

## Testing

### 1. User registrieren
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

**Response:**
```json
{
  "message": "Registrierung erfolgreich",
  "userId": 1,
  "email": "test@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "subscription": {
    "plan": "free",
    "workflowsLimit": 3,
    "workflowsUsed": 0,
    "workflowsRemaining": 3
  }
}
```

**Token speichern:**
```bash
export TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 2. Subscription Status abrufen
```bash
curl http://localhost:3000/api/subscriptions/status \
  -H "Authorization: Bearer $TOKEN"
```

### 3. Ideen generieren
```bash
curl -X POST http://localhost:3000/api/workflows/generate-ideas \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "brainstorming",
    "input": "AI-gestützte Fitness-App",
    "lang": "de"
  }'
```

### 4. PRD erstellen
```bash
curl -X POST http://localhost:3000/api/workflows/create-prd \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "workflowId": 1,
    "idea": {
      "title": "Fitness Tracker Pro",
      "description": "Eine KI-gestützte Fitness-App..."
    },
    "lang": "de"
  }'
```

### 5. Usage Stats abrufen
```bash
curl http://localhost:3000/api/usage/stats \
  -H "Authorization: Bearer $TOKEN"
```

---

## Production Deployment

### Option 1: Heroku

```bash
# Heroku CLI installieren
npm install -g heroku

# Login
heroku login

# App erstellen
heroku create von-der-idee-zum-prototyp

# Environment Variables setzen
heroku config:set JWT_SECRET=dein-geheimer-jwt-secret

# Deployen
git push heroku main

# Logs anzeigen
heroku logs --tail
```

### Option 2: VPS (DigitalOcean, AWS, etc.)

```bash
# PM2 installieren (Process Manager)
npm install -g pm2

# App starten
pm2 start backend/server.js --name idea-to-prototype

# Auto-Restart bei Server-Reboot
pm2 startup
pm2 save

# Logs anzeigen
pm2 logs idea-to-prototype

# Status
pm2 status
```

### Option 3: Docker

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

```bash
# Build
docker build -t idea-to-prototype .

# Run
docker run -p 3000:3000 -v $(pwd)/database:/app/database idea-to-prototype
```

---

## Environment Variables

Für Production sollten folgende Environment Variables gesetzt werden:

```bash
export PORT=3000
export JWT_SECRET="dein-super-geheimer-jwt-secret"
export NODE_ENV=production
```

Oder in `.env` Datei:
```
PORT=3000
JWT_SECRET=dein-super-geheimer-jwt-secret
NODE_ENV=production
```

(Benötigt `dotenv` Package)

---

## Kosten-Übersicht

### Claude API Kosten
- Input: $3 per 1M tokens
- Output: $15 per 1M tokens
- ~€0.15 pro Workflow (durchschnittlich)

### Break-Even Calculation

| Plan | Preis | Workflows | API-Kosten | Profit |
|------|-------|-----------|------------|--------|
| Free | €0 | 3 | €0.45 | **-€0.45** |
| Täglich | €5 | 3 | €0.45 | **€4.55** (91%) |
| Monatlich | €29 | 20 | €3.00 | **€26.00** (90%) |
| Jährlich | €249 | 240 | €36.00 | **€213.00** (86%) |

**Strategie:**
- Free Users: Loss Leader (Marketing-Kosten)
- Paid Users: ~90% Profit-Marge

---

## Monitoring

### 1. Kosten überwachen

```bash
# Tägliche API-Kosten
sqlite3 database/app.db "
  SELECT
    DATE(created_at) as date,
    COUNT(*) as api_calls,
    SUM(cost_eur) as total_cost
  FROM api_usage
  WHERE created_at >= DATE('now', '-30 days')
  GROUP BY DATE(created_at)
  ORDER BY date DESC;
"
```

### 2. User-Activity überwachen

```bash
# Aktive Subscriptions
sqlite3 database/app.db "SELECT * FROM active_subscriptions;"

# User-Registrierungen (letzte 7 Tage)
sqlite3 database/app.db "
  SELECT DATE(created_at) as date, COUNT(*) as new_users
  FROM users
  WHERE created_at >= DATE('now', '-7 days')
  GROUP BY DATE(created_at);
"
```

---

## Troubleshooting

### Error: "Claude API Key nicht konfiguriert"

**Lösung:** Bearbeite `config/api-config.json` und trage deinen API Key ein.

### Error: "EADDRINUSE: address already in use"

**Lösung:** Port 3000 ist bereits belegt. Ändere Port:
```bash
PORT=3001 npm start
```

### Database Locked

**Lösung:** Schließe alle sqlite3 Verbindungen:
```bash
fuser -k database/app.db
```

### JWT Token Invalid

**Lösung:** Token ist abgelaufen oder ungültig. Neu einloggen.

---

## Security Checklist

Production Security:
- [ ] JWT_SECRET als Environment Variable setzen
- [ ] API Key NICHT im Git-Repository
- [ ] HTTPS aktivieren (Let's Encrypt)
- [ ] Rate Limiting implementieren
- [ ] CORS richtig konfigurieren
- [ ] Input Validation verschärfen
- [ ] SQL Injection Prevention (nutzt Prepared Statements)
- [ ] XSS Protection (CSP Headers)

---

## Support

Bei Fragen oder Problemen:
- GitHub Issues: https://github.com/Sebathol/projekt/issues
- E-Mail: support@aistormcreate.com

---

**Version:** 2.0.0
**Autor:** Ai Storm Create - Sebastian Beyer
**Lizenz:** MIT
