# Product Requirements Document (PRD)
## API Master - Sichere API-Verwaltungsplattform

---

## 📋 Projektübersicht

### Projektname
**API Master** - Revolutionary API Implementation & Management Tool

### Entwickler
**Ai Storm Create**
Sebastian Beyer
Bahnhofstraße 71, 66636 Tholey, Deutschland
Klein- und Nebengewerbe (Kleinunternehmer gemäß §19 UStG)
Telefon: 06873 8579828
Email: aistormcreate.service@gmail.com
Steuernummer: 060/206/00215

### Zielsetzung
Entwicklung einer innovativen Multi-API-Management-Plattform, die es Entwicklern und Unternehmen ermöglicht, 20-100 APIs sicher zu verwalten, mit integriertem Compliance-Agent für internationalen Verkauf (EU, USA, UK) und automatischer Steuerberechnung gemäß Kleinunternehmer-Regelung.

### Zielgruppe
- **Primär**: B2B (Entwickler, Startups, Agenturen, DevOps-Teams)
- **Sekundär**: Freelancer, Einzelunternehmer
- **Geografisch**: Deutschland, EU, UK, USA

### Kerninnovation
**Proxy-API-Key-System**: Anstatt echte API-Keys im Code zu verwenden, generiert API Master sichere Proxy-Keys (APM_xxx Format), die jederzeit rotiert werden können ohne Code-Änderungen.

---

## 🎯 Geschäftsziele

### Monetarisierung
**Subscription-Modell** mit 3 Stufen:
1. **Individual**: €19.99/Monat (20 APIs, 1 User)
2. **Ultimate**: €99.99/Monat (50 APIs, 5 Users, Team-Features)
3. **Enterprise**: €299.99/Monat (100 APIs, 10 Users, SLA, Custom Branding)

**Kleinunternehmer-Regelung beachten**:
- Umsatzgrenze: €22.000/Jahr
- Keine Umsatzsteuer bei B2C-Verkäufen in Deutschland
- B2B EU: Reverse-Charge-Verfahren
- Automatische Überwachung durch Compliance-Agent

### Launch-Strategie
**4-Plattform-Start**:
1. **Vercel** (Web-App, kostenlos, 0% Gebühren)
2. **GitHub Marketplace** (25% → 0% nach $25k)
3. **Microsoft Store** (Desktop, 15% Gebühren, $19 Setup)
4. **Google Play Store** (Mobile, 15% Gebühren, $25 Setup)

**Finanzprognose**:
- Konservativ: €22.500/Jahr
- Realistisch: €45.000/Jahr
- Optimistisch: €90.000/Jahr

---

## ✨ Kernfunktionen

### 1. Sichere Proxy-Key-Verwaltung
**Problem**: API-Keys werden oft in Git-Repositories committed oder im Code exponiert.

**Lösung**:
```javascript
// ❌ Vorher: Original Key im Code
const apiKey = "sk-live-1234567890abcdef";

// ✅ Nachher: Sicherer Proxy-Key
const apiKey = "APM_abc123def456ghi789...";
```

**Features**:
- AES-256-GCM Verschlüsselung für Original-Keys
- Proxy-Keys generieren und jederzeit rotieren
- Original-Key ändern ohne Code-Update
- Environment-spezifische Keys (Test/Production)

**Technische Umsetzung**:
```javascript
// Backend: Proxy-Key-Generator
class ApiProxy {
  generateProxyKey(userId, apiId) {
    const timestamp = Date.now();
    const randomData = crypto.randomBytes(16).toString('hex');
    const data = `${userId}_${apiId}_${timestamp}_${randomData}`;
    const hash = crypto.createHash('sha256').update(data).digest('hex');
    return `APM_${hash.substring(0, 48)}`;
  }

  async resolveProxyKey(proxyKey, environment) {
    const mapping = await ProxyKeyMapping.findOne({
      where: { proxyKey, environment }
    });
    const decrypted = this.cryptoService.decrypt(mapping.encryptedApiKey);
    return decrypted;
  }
}
```

### 2. Environment Switching
**Use Case**: Entwickler wechselt häufig zwischen Test- und Production-APIs.

**Features**:
- Ein-Klick-Wechsel zwischen Test/Production
- Separate API-Keys pro Environment
- Keine Code-Änderung notwendig
- Automatische Synchronisation

**UI/UX**:
```
[Test] ●────────○ [Production]
        Toggle Switch
```

### 3. Multi-API-Support
**Unterstützte APIs** (100+):
- **AI/ML**: OpenAI, Anthropic Claude, Google AI, Hugging Face
- **Payment**: Stripe, PayPal, Square, Mollie
- **Cloud**: AWS, Google Cloud, Azure, DigitalOcean
- **Email**: SendGrid, Mailgun, Postmark
- **DevOps**: GitHub, GitLab, Vercel, Netlify
- **Database**: MongoDB Atlas, Supabase, Firebase
- **Social**: Twitter, Facebook, LinkedIn
- Und 90+ weitere

**Dashboard-Übersicht**:
```
┌─────────────────────────────────────┐
│ Total APIs: 12/20                   │
│ Requests Today: 2,547               │
│ Monthly Cost: €45.23                │
│ Uptime: 99.9%                       │
├─────────────────────────────────────┤
│ [OpenAI]     Active  1,234 req      │
│ [Stripe]     Active    456 req      │
│ [SendGrid]   Active    789 req      │
└─────────────────────────────────────┘
```

### 4. Echtzeit-Analytics
**Metriken**:
- Request-Tracking (live)
- Kosten-Monitoring pro API
- Performance-Analyse (Latency, Response Time)
- Error-Tracking & Alerting
- Rate-Limit-Überwachung
- Usage-Trends (täglich, wöchentlich, monatlich)

**Dashboard-Visualisierung**:
- Line Charts (Requests over Time)
- Pie Charts (Cost Breakdown)
- Heat Maps (Peak Usage Times)
- Real-time Event Stream

### 5. Team Collaboration (Ultimate/Enterprise)
**Features**:
- Echtzeit-Chat (Socket.IO)
- Dateifreigabe (Bilder, Dokumente, Code-Snippets)
- Rechteverwaltung (Admin, Member, Viewer)
- Activity-Feed & Audit-Log
- Gemeinsame API-Verwaltung
- Team-Dashboard mit Aggregated Stats

**Rollen-Matrix**:
```
Admin:   Alle Rechte + Team-Verwaltung
Member:  API CRUD, Proxy-Keys generieren
Viewer:  Nur Lesen, keine Änderungen
```

### 6. Compliance-Agent (KRITISCH für Sebastian Beyers Geschäft)
**Hauptfunktion**: Automatische Überwachung und Einhaltung aller steuerlichen und rechtlichen Vorschriften für Klein- und Nebengewerbe.

**Komponenten**:

#### A) Kleinunternehmer-Regelung (§19 UStG)
```javascript
class ComplianceAgent {
  async checkKleinunternehmerLimit() {
    const yearStart = new Date(2025, 0, 1);
    const yearEnd = new Date(2025, 11, 31);
    const totalRevenue = await this.calculateYearlyRevenue(yearStart, yearEnd);

    const limit = 22000; // €22.000
    const remaining = limit - totalRevenue;
    const percentage = (totalRevenue / limit) * 100;

    if (percentage >= 95) {
      this.sendCriticalAlert('Umsatzgrenze fast erreicht!');
    } else if (percentage >= 80) {
      this.sendWarning('80% der Kleinunternehmer-Grenze erreicht');
    }

    return { totalRevenue, remaining, percentage };
  }
}
```

**Alerts**:
- ⚠️ Bei 80% der Grenze (€17.600)
- 🚨 Bei 95% der Grenze (€20.900)
- 🔴 Bei Überschreitung → Umstellung auf Regelbesteuerung empfehlen

#### B) Internationale Steuerberechnung
**Länder-Matrix**:

| Land | B2C-Steuersatz | B2B (EU) | B2B (Non-EU) |
|------|----------------|----------|--------------|
| 🇩🇪 Deutschland | 0% (§19 UStG) | Reverse-Charge | 0% |
| 🇫🇷 Frankreich | TVA 20% | Reverse-Charge | 0% |
| 🇵🇱 Polen | VAT 23% | Reverse-Charge | 0% |
| 🇬🇧 UK | VAT 20% | 0% (Post-Brexit) | 0% |
| 🇺🇸 USA | State Tax varies | 0% | 0% |

**Steuer-Rechner**:
```javascript
function calculateTax(amount, country, customerType, isKleinunternehmer) {
  // Deutschland B2C + Kleinunternehmer
  if (country === 'de' && customerType === 'b2c' && isKleinunternehmer) {
    return {
      net: amount,
      tax: 0,
      gross: amount,
      note: 'Gemäß §19 UStG wird keine Umsatzsteuer berechnet.'
    };
  }

  // EU B2B Reverse-Charge
  if (isEU(country) && customerType === 'b2b') {
    return {
      net: amount,
      tax: 0,
      gross: amount,
      note: 'Reverse-Charge: Kunde versteuert selbst. USt-IdNr. erforderlich.'
    };
  }

  // Standard-Besteuerung
  const rate = getTaxRate(country);
  return {
    net: amount,
    tax: amount * rate,
    gross: amount * (1 + rate),
    note: `Standard-Steuersatz ${(rate * 100).toFixed(0)}%`
  };
}
```

#### C) Digitale Rechnungserstellung
**EU-Richtlinien-konform**:

**Pflichtangaben**:
1. ✅ Vollständiger Name und Anschrift des Unternehmers
2. ✅ Vollständiger Name und Anschrift des Kunden
3. ✅ Steuernummer (Kleinunternehmer)
4. ✅ Rechnungsnummer (fortlaufend, eindeutig)
5. ✅ Rechnungsdatum
6. ✅ Lieferdatum / Leistungszeitraum
7. ✅ Produktbezeichnung & Menge
8. ✅ Nettobetrag
9. ✅ **Hinweis auf Kleinunternehmer-Regelung**:
   - "Gemäß §19 UStG wird keine Umsatzsteuer berechnet."
10. ✅ Bruttobetrag (= Nettobetrag bei Kleinunternehmer)

**Template**:
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Rechnung</title>
</head>
<body>
  <div class="invoice">
    <header>
      <h1>RECHNUNG</h1>
      <div class="seller">
        <strong>Ai Storm Create</strong><br>
        Sebastian Beyer<br>
        Bahnhofstraße 71<br>
        66636 Tholey, Deutschland<br>
        Tel: 06873 8579828<br>
        Email: aistormcreate.service@gmail.com<br>
        Steuernummer: 060/206/00215
      </div>
    </header>

    <div class="buyer">
      <strong>Rechnungsempfänger:</strong><br>
      {{customerName}}<br>
      {{customerAddress}}<br>
      {{customerCity}}, {{customerCountry}}
    </div>

    <div class="meta">
      Rechnungsnummer: {{invoiceNumber}}<br>
      Rechnungsdatum: {{invoiceDate}}<br>
      Leistungszeitraum: {{serviceDate}}
    </div>

    <table class="items">
      <thead>
        <tr>
          <th>Position</th>
          <th>Beschreibung</th>
          <th>Menge</th>
          <th>Einzelpreis</th>
          <th>Gesamtpreis</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>API Master - {{planName}}</td>
          <td>1</td>
          <td>{{price}} EUR</td>
          <td>{{price}} EUR</td>
        </tr>
      </tbody>
    </table>

    <div class="totals">
      <div class="row">
        <span>Nettobetrag:</span>
        <span>{{netAmount}} EUR</span>
      </div>
      <div class="row tax-exempt">
        <span>Umsatzsteuer:</span>
        <span>Gemäß §19 UStG wird keine Umsatzsteuer berechnet.</span>
      </div>
      <div class="row total">
        <span><strong>Rechnungsbetrag:</strong></span>
        <span><strong>{{grossAmount}} EUR</strong></span>
      </div>
    </div>

    <div class="payment">
      <strong>Zahlungsinformationen:</strong><br>
      Zahlungsart: {{paymentMethod}}<br>
      Zahlungsdatum: {{paymentDate}}<br>
      Transaktions-ID: {{transactionId}}
    </div>

    <footer>
      <p>Vielen Dank für Ihr Vertrauen!</p>
      <p style="font-size: 0.9em; color: #666;">
        Diese Rechnung wurde automatisch erstellt und ist ohne Unterschrift gültig.
      </p>
    </footer>
  </div>
</body>
</html>
```

#### D) DATEV-Export (Enterprise)
**Integration mit Steuerberater-Software**:
```csv
"Belegdatum","Belegnummer","Buchungstext","Sollkonto","Habenkonto","Betrag","USt-Schlüssel"
"2025-01-15","RE-2025-001","API Master Individual Jan 2025","8400","1200","19.99","60"
```

**USt-Schlüssel für Kleinunternehmer**: `60` (Steuerfrei §19 UStG)

#### E) Compliance-Dashboard
**Echtzeit-Überwachung**:
```
┌─────────────────────────────────────────┐
│ COMPLIANCE STATUS                       │
├─────────────────────────────────────────┤
│ ✓ Kleinunternehmer-Regelung aktiv      │
│   Umsatz 2025: €12.450 / €22.000       │
│   Verbleibend: €9.550 (56% genutzt)    │
├─────────────────────────────────────────┤
│ ℹ EU B2B Reverse-Charge               │
│   3 Transaktionen diesen Monat          │
│   Alle USt-IdNr. validiert ✓           │
├─────────────────────────────────────────┤
│ ⚠️ Umsatzgrenze Warnung                │
│   Nächster Meilenstein: €17.600 (80%)  │
│   Voraussichtlich erreicht: Jul 2025   │
└─────────────────────────────────────────┘
```

---

## 🏗️ Technische Architektur

### Tech Stack

#### Backend
```json
{
  "runtime": "Node.js 18+",
  "framework": "Express.js",
  "database": "PostgreSQL (Supabase/Railway)",
  "orm": "Sequelize",
  "authentication": "JWT + bcrypt",
  "encryption": "crypto (AES-256-GCM)",
  "realtime": "Socket.IO",
  "validation": "express-validator",
  "security": "helmet, rate-limit, CORS",
  "payment": "Stripe, @paypal/paypal-server-sdk",
  "email": "nodemailer",
  "logging": "winston, morgan"
}
```

#### Frontend
```json
{
  "framework": "React 18",
  "buildTool": "Vite",
  "styling": "Tailwind CSS",
  "stateManagement": "Zustand",
  "routing": "React Router v6",
  "animations": "Framer Motion",
  "forms": "React Hook Form",
  "http": "Axios",
  "icons": "Lucide React"
}
```

#### Desktop
```json
{
  "framework": "Electron",
  "integration": "React Frontend",
  "features": ["Windows Hello", "System Tray", "Auto-Updates"]
}
```

#### Mobile
```json
{
  "framework": "React Native",
  "navigation": "React Navigation",
  "biometric": "react-native-biometrics"
}
```

### Datenbank-Schema

#### Users
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  company VARCHAR(255),
  country VARCHAR(2),
  is_kleinunternehmer BOOLEAN DEFAULT false,
  subscription_plan VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### ApiKeys
```sql
CREATE TABLE api_keys (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  api_name VARCHAR(100) NOT NULL,
  encrypted_key TEXT NOT NULL,
  iv VARCHAR(32) NOT NULL,
  auth_tag VARCHAR(32) NOT NULL,
  proxy_key_test VARCHAR(100) UNIQUE,
  proxy_key_production VARCHAR(100) UNIQUE,
  environment VARCHAR(20) DEFAULT 'test',
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  last_rotated_at TIMESTAMP
);
```

#### Transactions
```sql
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  customer_name VARCHAR(255),
  customer_country VARCHAR(2),
  customer_type VARCHAR(10), -- 'b2c' or 'b2b'
  product VARCHAR(100),
  net_amount DECIMAL(10,2),
  tax_amount DECIMAL(10,2),
  gross_amount DECIMAL(10,2),
  tax_rate DECIMAL(5,2),
  tax_exempt_reason TEXT,
  payment_method VARCHAR(50),
  payment_status VARCHAR(20),
  transaction_date TIMESTAMP DEFAULT NOW(),
  service_period_start DATE,
  service_period_end DATE
);
```

### API Endpoints

#### Authentication
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
```

#### API Keys
```
GET    /api/apikeys
POST   /api/apikeys
GET    /api/apikeys/:id
PUT    /api/apikeys/:id
DELETE /api/apikeys/:id
POST   /api/apikeys/:id/rotate
POST   /api/apikeys/:id/generate-proxy
POST   /api/apikeys/:id/switch-environment
```

#### Proxy
```
POST /api/proxy/:proxyKey
GET  /api/proxy/resolve/:proxyKey
```

#### Compliance
```
GET  /api/compliance/status
GET  /api/compliance/revenue-check
POST /api/compliance/calculate-tax
POST /api/compliance/generate-invoice
GET  /api/compliance/invoices
GET  /api/compliance/export-datev
```

#### Analytics
```
GET /api/analytics/usage
GET /api/analytics/costs
GET /api/analytics/performance
GET /api/analytics/errors
```

#### Subscriptions
```
GET  /api/subscriptions/plans
POST /api/subscriptions/subscribe
POST /api/subscriptions/cancel
POST /api/subscriptions/webhook/stripe
POST /api/subscriptions/webhook/paypal
```

#### Teams
```
GET    /api/teams
POST   /api/teams
GET    /api/teams/:id
PUT    /api/teams/:id
DELETE /api/teams/:id
POST   /api/teams/:id/members
DELETE /api/teams/:id/members/:userId
GET    /api/teams/:id/activity
```

### Sicherheitskonzept

#### Verschlüsselung
```javascript
const crypto = require('crypto');

class CryptoService {
  constructor() {
    this.algorithm = 'aes-256-gcm';
    this.encryptionKey = process.env.ENCRYPTION_KEY; // 64 hex chars (32 bytes)
  }

  encrypt(data) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      this.algorithm,
      Buffer.from(this.encryptionKey, 'hex'),
      iv
    );

    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();

    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  }

  decrypt(encrypted, iv, authTag) {
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      Buffer.from(this.encryptionKey, 'hex'),
      Buffer.from(iv, 'hex')
    );

    decipher.setAuthTag(Buffer.from(authTag, 'hex'));

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}
```

#### Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minuten
  max: 100, // 100 Requests pro IP
  message: 'Zu viele Anfragen, bitte später erneut versuchen.'
});

app.use('/api/', apiLimiter);
```

#### JWT-Authentifizierung
```javascript
const jwt = require('jsonwebtoken');

function generateTokens(user) {
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
}
```

---

## 🎨 UI/UX Design

### Design-Prinzipien
1. **Clean & Modern**: Minimalistisches Design, Fokus auf Funktionalität
2. **Dark Mode First**: Dunkles Theme als Standard (Developer-Präferenz)
3. **Responsive**: Mobile-First Ansatz
4. **Accessibility**: WCAG 2.1 AA konform
5. **Performance**: Schnelle Ladezeiten, optimierte Animationen

### Farbschema
```css
:root {
  --color-primary: #0ea5e9;      /* Sky Blue */
  --color-primary-dark: #0284c7; /* Darker Blue */
  --color-bg-dark: #0f172a;      /* Slate 900 */
  --color-bg-light: #1e293b;     /* Slate 800 */
  --color-success: #10b981;      /* Green */
  --color-warning: #f59e0b;      /* Amber */
  --color-error: #ef4444;        /* Red */
  --color-text-primary: #f8fafc; /* Slate 50 */
  --color-text-secondary: #cbd5e1; /* Slate 300 */
}
```

### Hauptseiten

#### 1. Landing Page
- Hero Section mit CTA
- Features-Übersicht (6 Karten)
- Compliance-Agent Demo
- Pricing-Tabelle (3 Pläne)
- Testimonials
- FAQ
- Footer

#### 2. Dashboard
```
┌────────────────────────────────────────┐
│ Header: Logo, Navigation, User Menu   │
├────────────────────────────────────────┤
│ Stats Cards (4):                       │
│ [Total APIs] [Requests] [Cost] [Uptime]│
├────────────────────────────────────────┤
│ Quick Actions:                          │
│ [+ Add API] [Generate Proxy] [Switch Env]│
├────────────────────────────────────────┤
│ API Cards (Grid):                      │
│ ┌──────┐ ┌──────┐ ┌──────┐           │
│ │OpenAI│ │Stripe│ │Email │ ...       │
│ └──────┘ └──────┘ └──────┘           │
├────────────────────────────────────────┤
│ Recent Activity Feed                   │
└────────────────────────────────────────┘
```

#### 3. API Keys Management
- Liste aller APIs
- Suche & Filter
- Add/Edit/Delete Modals
- Proxy-Key-Generator
- Environment-Toggle
- Rotation-History

#### 4. Analytics
- Zeit-basierte Charts
- Cost Breakdown
- Performance-Metriken
- Error-Reports
- Export-Funktionen (CSV, PDF)

#### 5. Compliance Dashboard
- Kleinunternehmer-Status
- Umsatz-Tracker (Fortschrittsbalken)
- Steuer-Rechner
- Rechnungs-Generator
- Compliance-Alerts
- DATEV-Export (Enterprise)

#### 6. Settings
- Profil-Einstellungen
- Subscription-Verwaltung
- Sicherheits-Einstellungen (2FA)
- Benachrichtigungen
- API-Token (für CLI)
- Gefährliche Aktionen (Account löschen)

---

## 📱 Plattform-spezifische Anforderungen

### Vercel (Web)
**Deployment-Konfiguration**:
```json
{
  "frontend": {
    "buildCommand": "npm run build",
    "outputDirectory": "dist",
    "framework": "vite",
    "env": {
      "VITE_API_URL": "https://api-master-backend.vercel.app"
    }
  },
  "backend": {
    "buildCommand": "npm install",
    "startCommand": "node src/server.js",
    "env": {
      "DATABASE_URL": "@database_url",
      "JWT_SECRET": "@jwt_secret",
      "ENCRYPTION_KEY": "@encryption_key",
      "STRIPE_SECRET_KEY": "@stripe_secret",
      "NODE_ENV": "production"
    }
  }
}
```

### Microsoft Store (Windows Desktop)
**Anforderungen**:
- MSIX-Package
- Code-Signing-Zertifikat
- Store-Listing (Deutsch + Englisch)
- Screenshots: 8x (1920x1080)
- Icon: 1024x1024
- Age Rating: E (Everyone)
- Privacy Policy URL
- Partner Center Account ($19)

### Google Play Store (Android)
**Anforderungen**:
- APK/AAB Bundle
- Store-Listing (Deutsch + Englisch + Polnisch + Französisch)
- Screenshots: 8x Phone (1080x1920)
- Icon: 512x512
- Feature Graphic: 1024x500
- In-App-Produkte konfigurieren (6 Subscriptions)
- Content Rating
- Developer Account ($25)

### GitHub Marketplace
**Anforderungen**:
- GitHub OAuth App
- Marketplace-Listing (Englisch)
- Logo: 200x200
- Screenshots: 5x (1920x1080)
- Pricing-Plans konfigurieren
- Webhook-Endpoint
- GitHub Actions Integration

---

## 🚀 Entwicklungs-Roadmap

### Phase 1: MVP (Wochen 1-4) ✅ ABGESCHLOSSEN
- [x] Backend-Architektur (Express + PostgreSQL)
- [x] Frontend-Grundgerüst (React + Vite)
- [x] Authentifizierung (JWT)
- [x] API-Key-Verwaltung (CRUD)
- [x] Proxy-Key-System
- [x] Environment-Switching
- [x] Compliance-Agent (Kleinunternehmer-Logik)
- [x] Steuer-Rechner
- [x] Digitale Rechnungserstellung
- [x] Deployment auf Vercel

### Phase 2: Features & Polish (Wochen 5-8)
- [ ] Team-Collaboration (Socket.IO)
- [ ] Analytics-Dashboard
- [ ] Desktop-App (Electron)
- [ ] Mobile-App (React Native)
- [ ] Store-Assets erstellen (Screenshots, Icons)
- [ ] Marketing-Materialien
- [ ] Beta-Testing

### Phase 3: Launch (Wochen 9-12)
- [ ] Vercel: Live gehen
- [ ] GitHub Marketplace: Submission
- [ ] Microsoft Store: Submission
- [ ] Google Play Store: Submission
- [ ] Marketing-Kampagne starten
- [ ] Influencer-Outreach
- [ ] Product Hunt Launch

### Phase 4: Post-Launch (Monate 4-6)
- [ ] User-Feedback sammeln
- [ ] Performance-Optimierungen
- [ ] Feature-Requests umsetzen
- [ ] Weitere APIs hinzufügen
- [ ] Enterprise-Features
- [ ] On-Premise-Version

---

## 📊 Success Metrics (KPIs)

### Wachstumsziele
**Monat 1**:
- 100 Sign-ups
- 20 zahlende Kunden
- €500 MRR (Monthly Recurring Revenue)

**Monat 3**:
- 500 Sign-ups
- 100 zahlende Kunden
- €2.500 MRR

**Monat 6**:
- 1.500 Sign-ups
- 300 zahlende Kunden
- €7.500 MRR

**Jahr 1**:
- 5.000 Sign-ups
- 1.000 zahlende Kunden
- €25.000 MRR → €300.000 ARR

### Qualitäts-Metriken
- Uptime: ≥ 99.9%
- Response Time: < 200ms (p95)
- Error Rate: < 0.5%
- Customer Satisfaction (CSAT): ≥ 4.5/5
- Net Promoter Score (NPS): ≥ 50

### Compliance-Metriken
- Kleinunternehmer-Grenze: < €22.000 (kritisch!)
- Rechnungs-Fehlerrate: 0% (automatisch validiert)
- DSGVO-Konformität: 100%
- Audit-Log-Vollständigkeit: 100%

---

## 🔒 Rechtliche Anforderungen

### Impressum
**Pflichtangaben gemäß §5 TMG**:
```
Ai Storm Create
Inhaber: Sebastian Beyer
Bahnhofstraße 71
66636 Tholey
Deutschland

Kontakt:
Telefon: 06873 8579828
E-Mail: aistormcreate.service@gmail.com

Steuernummer: 060/206/00215

Hinweis gemäß §19 UStG:
Als Kleinunternehmer im Sinne von §19 Abs. 1 UStG wird keine
Umsatzsteuer berechnet.
```

### Datenschutzerklärung (DSGVO)
**Muss enthalten**:
- Art der erhobenen Daten
- Zweck der Datenverarbeitung
- Rechtsgrundlage (Art. 6 DSGVO)
- Speicherdauer
- Empfänger/Weitergabe
- Rechte der Betroffenen (Auskunft, Löschung, etc.)
- Widerruf der Einwilligung
- Beschwerderecht bei Aufsichtsbehörde
- SSL-Verschlüsselung
- Cookies & Tracking

**Hosting**: Vercel (USA) → **Standardvertragsklauseln** erforderlich!

### AGB (Allgemeine Geschäftsbedingungen)
**Muss regeln**:
- Vertragsschluss
- Widerrufsrecht (14 Tage bei Verbrauchern)
- Zahlungsbedingungen
- Laufzeit & Kündigung
- Haftungsbeschränkungen
- Streitbeilegung
- Gerichtsstand

### Weitere Dokumente
- **Cookie-Policy**
- **Terms of Service** (Englisch für internationale Kunden)
- **Privacy Policy** (Englisch)
- **Subscription Terms** (Abo-Bedingungen)

---

## 💰 Preiskalkulation & Breakeven

### Kostenstruktur (monatlich)

**Fixkosten**:
- Vercel Pro: €20 (ab 1.000 Users notwendig)
- Supabase Pro: €25 (ab Production)
- Domain: €1
- SSL-Zertifikat: €0 (Vercel inkl.)
- Stripe/PayPal Fees: ~3% vom Umsatz
- **Total Fixkosten**: ~€50/Monat

**Variable Kosten**:
- Pro Nutzer: ~€0.10 (Database, Bandwidth)
- Email-Versand (SendGrid): €0.01 pro Email

**Setup-Kosten (einmalig)**:
- Microsoft Store: $19
- Google Play: $25
- GitHub Marketplace: €0
- Vercel: €0
- **Total Setup**: ~€40

### Breakeven-Analyse

**Szenario: Individual Plan (€19.99/Monat)**
```
Fixkosten: €50
Variable Kosten pro Kunde: €0.10
Deckungsbeitrag: €19.99 - €0.10 = €19.89

Breakeven = €50 / €19.89 = 2.5 Kunden
→ Ab 3 zahlenden Kunden profitabel!
```

**Profit-Prognose**:
```
10 Kunden:  €199.90 - €51 = €148.90/Monat
50 Kunden:  €999.50 - €55 = €944.50/Monat
100 Kunden: €1.999 - €60 = €1.939/Monat
```

**Wichtig**: Kleinunternehmer-Grenze €22.000/Jahr = €1.833/Monat!
→ Bei ~90 Kunden wird Grenze erreicht
→ Dann Umstellung auf Regelbesteuerung (19% MwSt.)

---

## 🎯 Marketing-Strategie

### Zielgruppen-Personas

#### Persona 1: "Developer Dave"
- 28 Jahre, Full-Stack Developer
- Arbeitet für Startup
- Nutzt 10-15 verschiedene APIs
- Schmerzpunkt: API-Keys im Code vergessen → GitHub-Leak
- Kaufmotivation: Sicherheit, Zeit sparen
- Budget: €20-50/Monat

#### Persona 2: "Freelancer Fiona"
- 35 Jahre, Freelance Webentwicklerin
- Mehrere Kunden gleichzeitig
- Nutzt verschiedene APIs pro Projekt
- Schmerzpunkt: Unübersichtlich, manuelles Tracking
- Kaufmotivation: Organisation, Professionelles Tool
- Budget: €20-100/Monat

#### Persona 3: "Startup Stefan"
- 40 Jahre, CTO eines Scale-ups
- 5-köpfiges Dev-Team
- Nutzt 30+ APIs
- Schmerzpunkt: Team-Koordination, Kostenkontrolle
- Kaufmotivation: Team-Features, Compliance, Support
- Budget: €100-300/Monat

### Marketing-Kanäle

#### 1. Content Marketing
**Blog-Themen**:
- "API-Sicherheit: 10 häufige Fehler"
- "Kleinunternehmer verkauft international: Steuer-Guide"
- "Proxy-Keys vs. Original-Keys: Was ist sicherer?"
- "DSGVO-konform APIs nutzen"

#### 2. Social Media
- **Twitter/X**: Developer-Community, Tech-Threads
- **LinkedIn**: B2B, Professional Content
- **Reddit**: r/webdev, r/programming, r/selfhosted
- **Dev.to**: Technische Tutorials

#### 3. SEO
**Keywords**:
- "API Key Management"
- "Sichere API-Verwaltung"
- "Proxy API Keys"
- "Environment Switching API"
- "API Security Tool"

#### 4. Influencer-Marketing
**Ziel-Influencer**:
- Tech-YouTuber (Coding-Tutorials)
- Developer-Podcasts
- Newsletter (TLDR, ByteByteGo)

**Affiliate-Programm**:
- 25-35% Commission
- 90-Tage-Cookie
- Custom Referral-Links

#### 5. Product Hunt
**Launch-Plan**:
- Maker: Sebastian Beyer
- Tagline: "Secure API Management with Compliance Agent"
- Thumbnail-Video (30s Demo)
- Early-Bird Discount (50% off first month)

---

## 🔧 Entwicklungswerkzeuge

### Development
```json
{
  "IDE": "VS Code",
  "Extensions": [
    "ESLint",
    "Prettier",
    "GitLens",
    "Tailwind CSS IntelliSense",
    "Thunder Client (API Testing)"
  ],
  "VersionControl": "Git + GitHub",
  "ProjectManagement": "Linear / GitHub Projects",
  "Design": "Figma",
  "APITesting": "Postman / Thunder Client",
  "DatabaseGUI": "pgAdmin / TablePlus"
}
```

### Testing
```json
{
  "unit": "Jest",
  "integration": "Supertest",
  "e2e": "Cypress / Playwright",
  "coverage": "Istanbul",
  "ci": "GitHub Actions"
}
```

### Deployment
```json
{
  "web": "Vercel",
  "database": "Supabase",
  "monitoring": "Sentry",
  "analytics": "Plausible Analytics (DSGVO-konform)",
  "logs": "Winston + Vercel Logs",
  "backups": "Supabase Daily Backups"
}
```

---

## 📞 Support & Dokumentation

### Support-Stufen
**Individual**:
- Email-Support (48h Response)
- Knowledge Base
- Community-Forum

**Ultimate**:
- Priority Email (24h Response)
- Live-Chat (Office Hours)
- Onboarding-Call

**Enterprise**:
- Dedicated Support (4h Response)
- 24/7 Emergency-Hotline
- Custom Training
- SLA-Garantie (99.9% Uptime)

### Dokumentation
- **Getting Started Guide**
- **API Reference**
- **CLI Documentation**
- **SDK Guides** (JS, Python, Go)
- **Video-Tutorials**
- **FAQ**
- **Troubleshooting**

---

## ✅ Checkliste für Google AI Studio Integration

Wenn Sie dieses PRD in **Google AI Studio** verwenden:

### Prompt-Vorschläge:

**1. Code-Generierung**:
```
Basierend auf dem PRD für API Master, generiere den Code für:
- ComplianceAgent.js mit Kleinunternehmer-Logik
- Steuer-Rechner für internationale Verkäufe
- Digitale Rechnungserstellung (HTML-Template)
```

**2. Feature-Erweiterung**:
```
Erweitere das Compliance-Dashboard um:
- Prognose-Funktion für Umsatzgrenze
- Automatische Alerts bei kritischen Schwellenwerten
- Export-Funktion für DATEV (CSV)
```

**3. UI-Design**:
```
Erstelle React-Komponenten für:
- Tax Calculator Component
- Invoice Generator Component
- Compliance Status Widget
Mit Tailwind CSS Styling gemäß dem definierten Farbschema.
```

**4. Testing**:
```
Erstelle Jest-Tests für:
- Kleinunternehmer-Grenze-Berechnung
- Steuer-Berechnung (alle Länder)
- Proxy-Key-Generierung
```

**5. Dokumentation**:
```
Erstelle User-Dokumentation für:
- Compliance-Agent Setup
- Internationale Verkäufe
- Rechnungserstellung
In Deutsch, Englisch, Polnisch und Französisch.
```

---

## 📋 Zusammenfassung

**API Master** ist eine innovative SaaS-Plattform für sichere API-Verwaltung mit integriertem Compliance-Agent, speziell entwickelt für Sebastian Beyers Kleinunternehmen **Ai Storm Create**.

**Kernvorteile**:
✅ Proxy-Key-System für maximale Sicherheit
✅ Automatische Compliance für internationale Verkäufe
✅ Kleinunternehmer-konform (§19 UStG)
✅ 4-Plattform-Launch-Strategie
✅ B2B-fokussiert mit hohen Margen
✅ Vollständige Steuer- & Rechnungs-Automatisierung

**Status**: MVP deployed auf Vercel, bereit für Beta-Testing

**Nächste Schritte**:
1. Store-Assets finalisieren (Screenshots, Icons)
2. Beta-Testing mit ersten Kunden
3. Submission an 4 Plattformen
4. Marketing-Kampagne starten

---

**Entwickelt für Google AI Studio**
Verwenden Sie dieses Dokument als Kontext für Code-Generierung, Feature-Requests und technische Fragen.

**Version**: 1.0.0
**Letzte Aktualisierung**: {{CURRENT_DATE}}
**Kontakt**: aistormcreate.service@gmail.com
