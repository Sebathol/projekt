# API Integration Anleitung - Claude API für Testing & Google Play Store

**Von der Idee zum Prototyp**
Ai Storm Create - Sebastian Beyer

---

## 📋 Inhaltsverzeichnis

1. [Überblick](#überblick)
2. [Claude API Key besorgen](#claude-api-key-besorgen)
3. [Testing/Entwicklung Setup](#testingentwicklung-setup)
4. [Google Play Store Production Setup](#google-play-store-production-setup)
5. [Sicherheitshinweise](#sicherheitshinweise)
6. [Kostenüberwachung](#kostenüberwachung)

---

## Überblick

Ihre Anwendung nutzt die **Claude API von Anthropic** für die KI-gestützten Funktionen:
- Ideengenerierung
- Brainstorming
- PRD-Erstellung
- Prototyp-Generierung

**Wichtig:**
- ✅ **Testing:** API-Key kann in Config-Datei eingetragen werden
- ✅ **Production (Play Store):** API-Key MUSS über Backend laufen (niemals im Frontend!)
- ⚠️ **Kosten:** Sie tragen die API-Kosten (nicht die Nutzer)

**Aktuelles Modell:** `claude-sonnet-4-20250514`
**Kosten:**
- Input: $3 per 1M Tokens
- Output: $15 per 1M Tokens

---

## Claude API Key besorgen

### Schritt 1: Anthropic Account erstellen

1. Gehen Sie zu: **https://console.anthropic.com/**
2. Klicken Sie auf **"Sign Up"** (oben rechts)
3. Registrieren Sie sich mit:
   - Ihrer E-Mail: `aistormcreate.service@gmail.com` (empfohlen)
   - Oder einer anderen Business-E-Mail
4. Bestätigen Sie Ihre E-Mail-Adresse

### Schritt 2: Zahlungsmethode hinzufügen

⚠️ **Wichtig:** Die Claude API ist **kostenpflichtig** (Pay-as-you-go)

1. Gehen Sie zu **Settings** → **Billing**
2. Fügen Sie eine Zahlungsmethode hinzu (Kreditkarte/Debitkarte)
3. Setzen Sie ein **monatliches Limit** (empfohlen: Start mit $50/Monat)
4. Aktivieren Sie **E-Mail-Benachrichtigungen** bei 50%, 80%, 100% des Limits

### Schritt 3: API Key erstellen

1. Gehen Sie zu **API Keys** im Menü
2. Klicken Sie auf **"Create Key"**
3. Geben Sie einen Namen ein: `"Ai Storm Create - Production"`
4. **Kopieren Sie den Key SOFORT** (wird nur einmal angezeigt!)
5. Speichern Sie ihn sicher (z.B. in einem Passwort-Manager)

**Format des Keys:** `sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

⚠️ **WICHTIG:** Dieser Key gibt direkten Zugriff auf Ihre Anthropic-Rechnung. Behandeln Sie ihn wie ein Passwort!

---

## Testing/Entwicklung Setup

Für lokales Testen auf Ihrem Computer können Sie den API-Key direkt in eine Config-Datei eintragen.

### Variante A: Config-Datei (Empfohlen für Testing)

1. **Öffnen Sie die Datei:** `config/api-config.json`

2. **Tragen Sie Ihren API-Key ein:**
   ```json
   {
     "claudeApiKey": "sk-ant-api03-IHR_ECHTER_API_KEY_HIER",
     "model": "claude-sonnet-4-20250514",
     "environment": "development"
   }
   ```

3. **Speichern Sie die Datei**

4. **Starten Sie den Server:**
   ```bash
   cd D:\Claudeapps\projekt
   node backend\server.js
   ```

5. **Testen Sie die Anwendung:**
   - Öffnen Sie: `http://localhost:3000`
   - Registrieren Sie einen Test-Account
   - Erstellen Sie einen Test-Workflow

### Variante B: Umgebungsvariable (Alternative)

1. **Erstellen Sie eine `.env` Datei** im Projektordner:
   ```
   CLAUDE_API_KEY=sk-ant-api03-IHR_ECHTER_API_KEY_HIER
   PORT=3000
   ```

2. **Installieren Sie dotenv:**
   ```bash
   npm install dotenv
   ```

3. **Aktualisieren Sie `backend/claude-api.js`** (oben einfügen):
   ```javascript
   require('dotenv').config();

   const API_KEY = process.env.CLAUDE_API_KEY || 'DEIN_API_KEY_HIER';
   ```

⚠️ **Wichtig für Testing:**
- ✅ Fügen Sie `config/api-config.json` zu `.gitignore` hinzu
- ✅ Fügen Sie `.env` zu `.gitignore` hinzu
- ❌ Committen Sie NIEMALS Ihren API-Key zu Git!

### .gitignore prüfen

Stellen Sie sicher, dass Ihre `.gitignore` Datei enthält:
```
# API Keys und Secrets
config/api-config.json
.env
*.env

# Datenbank (optional für Testing)
database/*.db
database/*.db-journal
```

---

## Google Play Store Production Setup

Für die Veröffentlichung im Google Play Store **DARF** der API-Key **NIEMALS** im Frontend-Code stehen!

### ✅ Richtige Architektur (Backend-basiert)

Ihre App ist bereits korrekt aufgebaut:

```
Frontend (Android App)
    ↓ HTTPS Anfrage
Backend (Node.js Server auf Ihrem Server)
    ↓ API Call mit Key
Claude API (Anthropic)
```

### Schritt-für-Schritt Production Deployment

#### 1. Server vorbereiten

Sie benötigen einen **Server mit öffentlicher IP-Adresse**. Optionen:

**Option A: VPS/Cloud Server (Empfohlen)**
- Hetzner Cloud (ab €4,51/Monat)
- DigitalOcean (ab $6/Monat)
- AWS EC2 (Free Tier für 12 Monate)
- Google Cloud Compute Engine

**Option B: Eigener Server mit DynDNS**
- Router Port-Forwarding (Port 3000 oder 443)
- DynDNS Service (z.B. No-IP, DynDNS)
- ⚠️ Nicht empfohlen für Production

#### 2. Server einrichten (Ubuntu/Debian Beispiel)

```bash
# SSH zum Server verbinden
ssh root@IHR_SERVER_IP

# Node.js installieren
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Git installieren
sudo apt-get install git

# Repository klonen
git clone https://github.com/Sebathol/projekt.git
cd projekt
git checkout claude/prototype-development-011CUM2gdVhY7b55QBd8CrpC

# Dependencies installieren
npm install

# PM2 installieren (Process Manager)
sudo npm install -g pm2
```

#### 3. API-Key sicher speichern

**Auf dem Server:**

```bash
cd /root/projekt

# Config-Datei erstellen
nano config/api-config.json
```

Inhalt:
```json
{
  "claudeApiKey": "sk-ant-api03-IHR_ECHTER_API_KEY_HIER",
  "model": "claude-sonnet-4-20250514",
  "environment": "production"
}
```

**Datei schützen:**
```bash
# Nur root kann lesen
chmod 600 config/api-config.json

# Überprüfen
ls -la config/api-config.json
# Sollte zeigen: -rw------- 1 root root
```

#### 4. Server starten mit PM2

```bash
# Server mit PM2 starten
pm2 start backend/server.js --name "ai-storm-create"

# Autostart bei Server-Neustart
pm2 startup
pm2 save

# Status prüfen
pm2 status
pm2 logs ai-storm-create
```

#### 5. SSL/HTTPS einrichten (WICHTIG!)

⚠️ **Ohne SSL lehnt Google Play Store Ihre App ab!**

**Mit Certbot (Let's Encrypt - kostenlos):**

```bash
# Nginx installieren (als Reverse Proxy)
sudo apt-get install nginx certbot python3-certbot-nginx

# Nginx konfigurieren
sudo nano /etc/nginx/sites-available/aistormcreate
```

Inhalt:
```nginx
server {
    server_name api.aistormcreate.de;  # Ihre Domain!

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Nginx aktivieren
sudo ln -s /etc/nginx/sites-available/aistormcreate /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# SSL-Zertifikat installieren
sudo certbot --nginx -d api.aistormcreate.de
```

**Jetzt läuft Ihr Backend auf:**
- ✅ `https://api.aistormcreate.de` (sicher mit SSL)
- ❌ NICHT MEHR: `http://IHRE_IP:3000` (unsicher)

#### 6. Frontend/App anpassen

In Ihrer Android-App (oder Web-App) müssen Sie die **Backend-URL** eintragen:

**Datei:** `index.html` oder in Ihrer App-Konfiguration

**Ersetzen Sie:**
```javascript
// ❌ ALT (Testing):
const API_URL = 'http://localhost:3000';

// ✅ NEU (Production):
const API_URL = 'https://api.aistormcreate.de';
```

**Alle API-Aufrufe gehen dann über Ihr Backend:**

```javascript
// Login
const response = await fetch(`${API_URL}/api/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

// Ideen generieren
const response = await fetch(`${API_URL}/api/workflows/generate-ideas`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${userToken}`
  },
  body: JSON.stringify({ mode: 'brainstorming', input: 'Smart Home' })
});
```

⚠️ **WICHTIG:** Der API-Key wird **NIEMALS** an die App geschickt. Das Backend nutzt ihn intern!

#### 7. Domain registrieren (falls noch nicht vorhanden)

Sie benötigen eine **Domain** für SSL:

**Empfohlene Anbieter:**
- Namecheap (ab $8/Jahr für .de Domain)
- IONOS (ab €1/Jahr im ersten Jahr)
- Cloudflare (kostenlose DNS)

**Beispiel-Domain:**
- `aistormcreate.de`
- API läuft auf: `api.aistormcreate.de`
- Web-App läuft auf: `app.aistormcreate.de`

**DNS-Einträge setzen:**
```
A    api.aistormcreate.de    →  IHR_SERVER_IP
A    app.aistormcreate.de    →  IHR_SERVER_IP
```

---

## Sicherheitshinweise

### ✅ DO (Machen)

1. **API-Key NIEMALS im Frontend/App-Code:**
   ```javascript
   // ❌ FALSCH - Jeder kann den Key sehen!
   const API_KEY = 'sk-ant-api03-xxxxx';
   fetch('https://api.anthropic.com/v1/messages', {
     headers: { 'x-api-key': API_KEY }
   });
   ```

2. **Immer über Backend:**
   ```javascript
   // ✅ RICHTIG - Key bleibt auf Server
   fetch('https://api.aistormcreate.de/api/workflows/generate-ideas', {
     headers: { 'Authorization': `Bearer ${userToken}` }
   });
   ```

3. **Rate Limiting aktivieren:**

   Fügen Sie zu `backend/server.js` hinzu:
   ```javascript
   const rateLimit = require('express-rate-limit');

   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 Minuten
     max: 100, // Max 100 Requests pro IP
     message: 'Zu viele Anfragen, bitte später erneut versuchen.'
   });

   app.use('/api/', limiter);
   ```

4. **HTTPS erzwingen:**
   ```javascript
   // In backend/server.js (wenn hinter Nginx)
   app.use((req, res, next) => {
     if (req.headers['x-forwarded-proto'] !== 'https' && process.env.NODE_ENV === 'production') {
       return res.redirect('https://' + req.headers.host + req.url);
     }
     next();
   });
   ```

5. **Umgebungsvariablen nutzen:**
   ```bash
   # Auf dem Server
   export NODE_ENV=production
   export CLAUDE_API_KEY=sk-ant-api03-xxxxx
   ```

### ❌ DON'T (Nicht machen)

1. ❌ API-Key in Git committen
2. ❌ API-Key in App/Frontend hart codieren
3. ❌ API-Key in Screenshots/Videos zeigen
4. ❌ API-Key per E-Mail/Chat teilen
5. ❌ Unverschlüsselte HTTP-Verbindungen (Play Store lehnt ab!)
6. ❌ API ohne Authentication öffnen

---

## Kostenüberwachung

### Typische Kosten pro Workflow

Basierend auf `claude-sonnet-4-20250514`:

**Ein kompletter Workflow (Idee → Prototyp):**
- Ideengenerierung: ~500 Tokens Input, ~800 Tokens Output = $0.013
- PRD-Erstellung: ~1000 Tokens Input, ~3000 Tokens Output = $0.048
- Prototyp: ~2000 Tokens Input, ~5000 Tokens Output = $0.081
- **Total pro Workflow: ~$0.142 (≈ €0.16)**

**Bei 100 Nutzern mit FREE Plan (je 3 Workflows):**
- 100 × 3 × €0.16 = **€48 API-Kosten**

**Bei 50 PRO Nutzern (unbegrenzt, Durchschnitt 20 Workflows/Monat):**
- 50 × 20 × €0.16 = **€160 API-Kosten**

### Limits setzen bei Anthropic

1. Gehen Sie zu **https://console.anthropic.com/settings/limits**
2. Setzen Sie **Monthly Spend Limit**: z.B. $200 (≈ €220)
3. Aktivieren Sie **Email Alerts** bei:
   - 50% ($100)
   - 80% ($160)
   - 100% ($200)

### Kostenoptimierung

**Tipp 1: Caching nutzen** (falls Anthropic es anbietet)
```javascript
// In backend/claude-api.js
const response = await fetch('https://api.anthropic.com/v1/messages', {
  headers: {
    'x-api-key': API_KEY,
    'anthropic-version': '2023-06-01',
    'anthropic-cache': 'enabled'  // Falls verfügbar
  },
  body: JSON.stringify({
    model: MODEL,
    max_tokens: maxTokens,
    messages: messages,
    system_cache: true  // System-Prompts cachen
  })
});
```

**Tipp 2: Token-Limits pro Plan**
```javascript
// In backend/subscriptions_v2.js
const PLANS = {
  free: {
    maxTokensPerWorkflow: 8000,  // Begrenzt auf kleiner
    maxComplexity: 'basic'
  },
  pro_monthly: {
    maxTokensPerWorkflow: 16000,
    maxComplexity: 'advanced'
  }
};
```

**Tipp 3: Usage-Überwachung in App**
```javascript
// Dashboard für sich selbst
app.get('/api/admin/usage-stats', authenticateAdmin, (req, res) => {
  db.all(`
    SELECT
      DATE(created_at) as date,
      COUNT(*) as workflows,
      SUM(total_tokens) as total_tokens,
      SUM(cost_eur) as total_cost_eur
    FROM api_usage
    WHERE created_at >= DATE('now', '-30 days')
    GROUP BY DATE(created_at)
    ORDER BY date DESC
  `, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});
```

---

## Checkliste für Google Play Store

Vor der Veröffentlichung im Play Store:

### Backend/Server
- [ ] Server mit öffentlicher IP läuft
- [ ] Domain registriert und DNS konfiguriert
- [ ] SSL-Zertifikat installiert (HTTPS)
- [ ] API-Key sicher auf Server gespeichert (nicht in Git!)
- [ ] PM2 oder ähnlicher Process Manager läuft
- [ ] Firewall konfiguriert (nur Port 80, 443 offen)
- [ ] Rate Limiting aktiviert
- [ ] Monitoring/Logs eingerichtet

### Frontend/App
- [ ] API_URL auf Production-Server geändert (`https://api.aistormcreate.de`)
- [ ] Kein API-Key im App-Code
- [ ] Alle API-Calls nutzen Backend-Endpunkte
- [ ] Error Handling für Offline-Modus
- [ ] Token-basierte Authentication funktioniert

### Sicherheit
- [ ] HTTPS erzwungen (kein HTTP!)
- [ ] Authentication für alle API-Endpunkte
- [ ] Input-Validierung aktiv
- [ ] SQL-Injection Schutz
- [ ] XSS-Schutz
- [ ] CORS korrekt konfiguriert

### Rechtliches (bereits erledigt ✅)
- [x] Impressum mit echten Daten
- [x] Datenschutzerklärung DSGVO-konform
- [x] AGB für Abo-Modell
- [x] Play Store Data Safety ausgefüllt

### Testing
- [ ] Registrierung funktioniert
- [ ] Login funktioniert
- [ ] Workflows erstellen funktioniert
- [ ] Abo-Wechsel funktioniert
- [ ] Zahlungs-Flow getestet (Stripe/PayPal)
- [ ] Kündigung funktioniert

---

## Schnellstart für Testing (TL;DR)

```bash
# 1. API-Key besorgen
# → https://console.anthropic.com/

# 2. In Config eintragen
# Datei: config/api-config.json
{
  "claudeApiKey": "sk-ant-api03-IHR_KEY_HIER",
  "model": "claude-sonnet-4-20250514"
}

# 3. Server starten
cd D:\Claudeapps\projekt
node backend\server.js

# 4. Testen
# → http://localhost:3000
```

---

## Schnellstart für Production (TL;DR)

```bash
# 1. Server mieten (Hetzner, DigitalOcean, etc.)

# 2. Auf Server einloggen
ssh root@IHR_SERVER_IP

# 3. Setup
git clone https://github.com/Sebathol/projekt.git
cd projekt
npm install
nano config/api-config.json  # API-Key eintragen

# 4. SSL Setup
sudo apt install nginx certbot python3-certbot-nginx
sudo certbot --nginx -d api.aistormcreate.de

# 5. Server starten
npm install -g pm2
pm2 start backend/server.js --name ai-storm-create
pm2 startup
pm2 save

# 6. In App: API_URL = 'https://api.aistormcreate.de'
```

---

## Support & Fragen

Bei Fragen zur API-Integration:

📧 **E-Mail:** aistormcreate.service@gmail.com
📞 **Telefon:** +49 6853 8579828

**Hilfreiche Links:**
- Anthropic Docs: https://docs.anthropic.com/
- Claude API Pricing: https://www.anthropic.com/pricing
- Node.js Deployment: https://nodejs.org/en/docs/guides/

---

**Erstellt am:** 4. November 2025
**Version:** 1.0
**Für:** Ai Storm Create - Sebastian Beyer
**Projekt:** Von der Idee zum Prototyp V3
