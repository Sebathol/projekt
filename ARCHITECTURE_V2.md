# Architecture V2 - Multi-Page with Subscriptions & AdMob

## Überblick

Umgestaltung von einer Single-Page-App zu einer Multi-Page-Architektur mit:
- Einzeln nutzbare Workflow-Seiten
- Google AdMob Integration (Banner + Videos)
- Subscription-Modell (Free/Daily/Monthly/Yearly)
- Cloud-Synchronisation
- Operator zahlt API-Kosten

---

## Dateistruktur

```
projekt/
├── index.html                    # Hauptseite mit Workflow-Auswahl
├── auth.html                     # Login & Subscription
├── ideengenerierung.html         # Seite 1: Ideen-Generator
├── brainstorming.html            # Seite 2: Brainstorming/Framestorming
├── prd.html                      # Seite 3: PRD/PAD Erstellung
├── prototyp.html                 # Seite 4: Prototyp-Generator
├── landing.html                  # Sales/Marketing Seite (behalten)
│
├── js/
│   ├── admob-integration.js      # Google AdMob SDK & Banner Handling
│   ├── auth.js                   # Authentication & Subscription
│   ├── workflow-state.js         # Workflow State Management
│   ├── cloud-sync.js             # Cloud Synchronisation
│   └── usage-tracker.js          # Usage Limits & Tracking
│
├── backend/
│   ├── server.js                 # Node.js Backend (Express)
│   ├── auth.js                   # User Authentication
│   ├── subscriptions.js          # Subscription Management
│   ├── workflows.js              # Workflow CRUD Operations
│   ├── usage.js                  # Usage Tracking & Limits
│   ├── claude-api.js             # Claude API Wrapper (Operator API Key)
│   └── database.js               # SQLite/PostgreSQL Connection
│
├── database/
│   └── schema.sql                # Database Schema
│
└── config/
    ├── admob-config.json         # AdMob Unit IDs
    └── api-config.json           # Claude API Key (Server-side)
```

---

## Page Flows

### 1. Hauptseite (index.html)

**Funktionen:**
- Workflow-Auswahl: Einzelne Seite ODER Kompletter Workflow
- Subscription Status anzeigen
- Workflow-Limit anzeigen (z.B. "2 / 3 Workflows übrig")
- Navigation zu allen Seiten

**Design:**
```
┌─────────────────────────────────────────┐
│  🎨 Von der Idee zum Prototyp          │
│  Workflows übrig: 2/3 (Free Plan)      │
│  [Upgrade auf €29/Monat]               │
├─────────────────────────────────────────┤
│                                         │
│  Einzelne Tools:                        │
│  ┌───────┐ ┌───────┐ ┌───────┐ ┌────┐ │
│  │💡Idee │ │🧠Brain│ │📄PRD  │ │💻Pro│ │
│  └───────┘ └───────┘ └───────┘ └────┘ │
│                                         │
│  Kompletter Workflow:                   │
│  [🚀 Workflow starten (1 Credit)]      │
│                                         │
│  [AdMob Banner]                         │
└─────────────────────────────────────────┘
```

---

### 2. Ideengenerierung (ideengenerierung.html)

**Funktionen:**
- Brainstorming Modus (mit Thema-Input)
- Ideen-Funke Modus (ohne Input)
- Chat für 15 Iterationen
- Speichern & Zur nächsten Seite
- **AdMob Banner oben/unten**

**Workflow:**
```
1. User wählt Modus (Brainstorming/Funke)
2. [Optional] Input eingeben
3. Ideen generieren (Backend Call → Claude API)
4. Ideen anzeigen + Chat öffnen
5. [Button] Idee auswählen & Weiter zu Brainstorming
   → ODER Download JSON
```

---

### 3. Brainstorming (brainstorming.html)

**Funktionen:**
- Idee aus vorheriger Seite laden (oder manuell eingeben)
- Framestorming-Framework anwenden
- Mind-Map Visualisierung (optional)
- Notizen hinzufügen
- **AdMob Banner + Video AD (30-60s) beim Start**

**Workflow:**
```
1. [AdMob Video 30-60s abspielen]
2. Idee anzeigen (aus Step 1 oder manuell)
3. Framestorming durchführen
4. Ergebnisse speichern
5. [Button] Weiter zu PRD
```

---

### 4. PRD Erstellung (prd.html)

**Funktionen:**
- PRD aus Brainstorming generieren
- PRD Editor (Textarea)
- Download PRD (TXT/MD)
- **AdMob Banner + Video AD (30-60s) beim Start**

**Workflow:**
```
1. [AdMob Video 30-60s abspielen]
2. PRD generieren (Backend → Claude API)
3. PRD im Editor anzeigen
4. Editieren möglich
5. [Button] Weiter zu Prototyp
```

---

### 5. Prototyp-Generator (prototyp.html)

**Funktionen:**
- Prototyp aus PRD generieren
- Live Preview (iframe)
- Code Editor
- Download HTML
- **AdMob Banner + Video AD (30-60s) beim Start**
- **Bonus: 2 Videos ansehen → +1 gratis Workflow**

**Workflow:**
```
1. [AdMob Video 30-60s abspielen]
2. Prototyp generieren (Backend → Claude API)
3. Preview + Code anzeigen
4. Download HTML
5. [Optional] Zurück zu Schritt 1 (neuer Workflow)
6. [BONUS] 2 Videos ansehen → +1 Workflow Credit
```

---

## AdMob Integration

### Banner Ads

**Platzierung:**
- Oben auf jeder Seite (unter Header)
- Unten auf jeder Seite (über Footer)
- Wechselnde Banner (Rotation alle 30s)

**Implementation:**
```javascript
// admob-integration.js
const AdMobBanner = {
  init: function() {
    // Initialize AdMob SDK
    admob.banner.config({
      id: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY',
      isTesting: false,
      autoShow: true
    });
  },

  showTopBanner: function() {
    admob.banner.show();
  },

  showBottomBanner: function() {
    admob.banner.show({ position: 'bottom' });
  },

  rotateBanner: function() {
    // Rotate banner every 30 seconds
    setInterval(() => {
      admob.banner.hide();
      setTimeout(() => admob.banner.show(), 500);
    }, 30000);
  }
};
```

### Video Ads (Interstitial/Rewarded)

**Wann:**
- Zwischen Workflow-Schritten (30-60s)
- Optional: 2 Videos für Bonus-Workflow

**Implementation:**
```javascript
// admob-integration.js
const AdMobVideo = {
  showInterstitial: async function() {
    return new Promise((resolve, reject) => {
      admob.interstitial.config({
        id: 'ca-app-pub-XXXXXXXXXXXXXXXX/ZZZZZZZZZZ'
      });

      admob.interstitial.load();

      admob.on('interstitial.close', () => {
        resolve(true);
      });

      admob.on('interstitial.load', () => {
        admob.interstitial.show();
      });
    });
  },

  showRewardedVideo: async function() {
    return new Promise((resolve, reject) => {
      admob.rewardedVideo.config({
        id: 'ca-app-pub-XXXXXXXXXXXXXXXX/WWWWWWWWWW'
      });

      admob.rewardedVideo.load();

      admob.on('rewardedVideo.reward', (reward) => {
        // User earned bonus workflow
        resolve(true);
      });

      admob.on('rewardedVideo.load', () => {
        admob.rewardedVideo.show();
      });
    });
  }
};
```

---

## Subscription System

### Plans

| Plan | Preis | Workflows | Dauer |
|------|-------|-----------|-------|
| **Free** | €0 | 3 gesamt | Lifetime |
| **Täglich** | €5 | 3 | 1 Tag |
| **Monatlich** | €29 | 20 | 30 Tage |
| **Jährlich** | €249 | 20/Monat | 365 Tage |

### Database Schema

```sql
-- users table
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- subscriptions table
CREATE TABLE subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  plan TEXT NOT NULL, -- 'free', 'daily', 'monthly', 'yearly'
  workflows_limit INTEGER NOT NULL,
  workflows_used INTEGER DEFAULT 0,
  start_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  end_date DATETIME,
  active BOOLEAN DEFAULT 1,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- workflows table
CREATE TABLE workflows (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  subscription_id INTEGER NOT NULL,
  workflow_type TEXT NOT NULL, -- 'full' or 'partial'
  ideas_json TEXT,
  brainstorming_json TEXT,
  prd_text TEXT,
  prototype_html TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(id)
);

-- api_usage table (track costs)
CREATE TABLE api_usage (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  workflow_id INTEGER NOT NULL,
  step TEXT NOT NULL, -- 'ideas', 'brainstorming', 'prd', 'prototype'
  tokens_used INTEGER NOT NULL,
  cost_eur REAL NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (workflow_id) REFERENCES workflows(id)
);
```

---

## Backend API Endpoints

### Authentication

```
POST /api/auth/register
  Body: { email, password }
  Returns: { userId, token }

POST /api/auth/login
  Body: { email, password }
  Returns: { userId, token, subscription }

GET /api/auth/me
  Headers: { Authorization: Bearer <token> }
  Returns: { user, subscription }
```

### Subscriptions

```
POST /api/subscriptions/create
  Body: { userId, plan } // 'daily', 'monthly', 'yearly'
  Returns: { subscriptionId, paymentUrl }

GET /api/subscriptions/status
  Headers: { Authorization: Bearer <token> }
  Returns: { plan, workflowsLimit, workflowsUsed, daysLeft }

POST /api/subscriptions/cancel
  Headers: { Authorization: Bearer <token> }
  Returns: { success }
```

### Workflows

```
POST /api/workflows/generate-ideas
  Headers: { Authorization: Bearer <token> }
  Body: { mode, input, lang }
  Returns: { ideas, workflowId }

POST /api/workflows/brainstorm
  Headers: { Authorization: Bearer <token> }
  Body: { workflowId, selectedIdea, chatMessages }
  Returns: { brainstormingResult }

POST /api/workflows/create-prd
  Headers: { Authorization: Bearer <token> }
  Body: { workflowId, idea, brainstorming }
  Returns: { prd }

POST /api/workflows/generate-prototype
  Headers: { Authorization: Bearer <token> }
  Body: { workflowId, prd }
  Returns: { prototypeHtml }

GET /api/workflows/list
  Headers: { Authorization: Bearer <token> }
  Returns: { workflows: [...] }

GET /api/workflows/:id
  Headers: { Authorization: Bearer <token> }
  Returns: { workflow }
```

### Usage Tracking

```
GET /api/usage/stats
  Headers: { Authorization: Bearer <token> }
  Returns: {
    totalWorkflows,
    workflowsRemaining,
    totalCost,
    avgCostPerWorkflow
  }

GET /api/usage/cost-tracking
  Headers: { Authorization: Bearer <token> }
  Returns: {
    dailyCosts: [...],
    monthlyCosts: [...],
    totalCost
  }
```

---

## Cloud Synchronization

### Workflow State Management

```javascript
// workflow-state.js
const WorkflowState = {
  // Save state to backend
  save: async function(workflowId, step, data) {
    const response = await fetch('/api/workflows/update', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        workflowId,
        step,
        data
      })
    });
    return response.json();
  },

  // Load state from backend
  load: async function(workflowId) {
    const response = await fetch(`/api/workflows/${workflowId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  },

  // Pass data to next page
  passToNextPage: function(nextPage, data) {
    sessionStorage.setItem('workflow_data', JSON.stringify(data));
    window.location.href = nextPage;
  },

  // Get data from previous page
  getFromPreviousPage: function() {
    const data = sessionStorage.getItem('workflow_data');
    return data ? JSON.parse(data) : null;
  }
};
```

---

## Orange Button Design

Alle Buttons behalten das orange Design:

```css
/* Orange Gradient Buttons */
.btn-primary {
  background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
}

.btn-primary:active {
  transform: translateY(0);
}

/* Orange Border Buttons (Secondary) */
.btn-secondary {
  background: white;
  color: #f59e0b;
  border: 2px solid #f59e0b;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: #fef3c7;
}
```

---

## Deployment Checkliste

### Frontend
- [ ] index.html mit Subscription-Auswahl
- [ ] 4 separate Workflow-Seiten
- [ ] AdMob Integration (Banner + Videos)
- [ ] Workflow State Management
- [ ] Orange Button Design überall

### Backend
- [ ] Node.js Express Server
- [ ] Database Schema erstellt
- [ ] Authentication API
- [ ] Subscriptions API
- [ ] Workflows API
- [ ] Claude API Integration (Server-Side)
- [ ] Usage Tracking

### AdMob
- [ ] Google AdMob Account erstellt
- [ ] App in AdMob registriert
- [ ] Banner Ad Units erstellt
- [ ] Interstitial Ad Units erstellt
- [ ] Rewarded Video Ad Units erstellt
- [ ] Ad Unit IDs in config eingetragen

### Play Store
- [ ] Google Play Developer Account (€25 Einmalgebühr)
- [ ] App als PWA oder React Native bauen
- [ ] APK/AAB erstellen
- [ ] Store Listing (Screenshots, Beschreibung)
- [ ] Privacy Policy & Terms
- [ ] Submission

---

## Kosten-Kalkulation

### API Kosten (Operator zahlt)

**Claude Sonnet 4 Pricing:**
- Input: $3 per 1M tokens
- Output: $15 per 1M tokens

**Durchschnitt pro Workflow:**
- Ideen-Generator: ~1000 tokens = €0.015
- Brainstorming: ~2000 tokens = €0.030
- PRD Erstellung: ~3000 tokens = €0.045
- Prototyp: ~4000 tokens = €0.060
- **TOTAL: ~€0.15 pro Workflow**

**Profit-Kalkulation:**

| Plan | Preis | Workflows | API-Kosten | Profit |
|------|-------|-----------|------------|--------|
| Free | €0 | 3 | €0.45 | -€0.45 |
| Täglich | €5 | 3 | €0.45 | **€4.55** |
| Monatlich | €29 | 20 | €3.00 | **€26.00** |
| Jährlich | €249 | 240 | €36.00 | **€213.00** |

**Break-Even:**
- Free User: Loss Leader (Akquise-Kosten)
- 1 Täglich-User = 91% Profit
- 1 Monatlich-User = 90% Profit
- 1 Jährlich-User = 86% Profit

### AdMob Revenue

**Durchschnittliche CPM (Cost per Mille):**
- Banner Ads: €0.50 - €2.00 CPM
- Interstitial Ads: €2.00 - €5.00 CPM
- Rewarded Videos: €5.00 - €10.00 CPM

**Pro User (Monatlich):**
- Free User (mit vielen Ads): €1-3/Monat
- Paid User (weniger Ads): €0.50-1/Monat

---

## Timeline

### Phase 1: MVP Backend (Woche 1-2)
- [ ] Database Setup
- [ ] Authentication API
- [ ] Basic Subscriptions API
- [ ] Workflows API (ohne Cloud Sync)

### Phase 2: Frontend Redesign (Woche 2-3)
- [ ] index.html mit Subscription-UI
- [ ] 4 separate Workflow-Seiten
- [ ] Orange Button Design
- [ ] Workflow State Management (SessionStorage)

### Phase 3: AdMob Integration (Woche 3-4)
- [ ] Google AdMob Account
- [ ] Banner Ads implementieren
- [ ] Video Ads implementieren
- [ ] Bonus-System für Videos

### Phase 4: Cloud Sync (Woche 4-5)
- [ ] Backend Workflow-Speicherung
- [ ] Frontend Cloud-Sync
- [ ] Cross-Device Testing

### Phase 5: Play Store (Woche 5-6)
- [ ] PWA zu APK konvertieren (TWA)
- [ ] Store Listing erstellen
- [ ] Review & Launch

---

## Nächste Schritte

1. ✅ Architektur dokumentiert
2. ⏳ Backend Setup (Node.js + Express + SQLite)
3. ⏳ Database Schema erstellen
4. ⏳ Frontend-Seiten bauen
5. ⏳ AdMob integrieren
6. ⏳ Testing & Deployment

---

**Status:** Architecture V2 Ready for Implementation
**Autor:** Claude Code
**Datum:** 2025-10-29
