# Tokens & Workflows System - Implementierungsübersicht

## 🎯 Überblick

Das System wurde komplett überarbeitet um **Workflows und Tokens klar zu trennen** und maximale Flexibilität zu bieten.

### Kernlogik

- **1 Workflow = 4 Tokens** (Ideengenerierung, Brainstorming, PRD, Prototyp)
- **1 Token = 1 Tool** (einzeln nutzbar)
- **Nachkauf jederzeit möglich** (unabhängig von Abo oder Restguthaben)

---

## 📦 Neue Dateien

### Backend

1. **database/schema_v2.sql** - Neues Database Schema
   - `credits` Tabelle (availableWorkflows, availableTokens)
   - `purchases` Tabelle (Kaufhistorie)
   - `token_usage` Tabelle (Token-Verbrauch Tracking)
   - Views: `user_credits_view`, `purchase_history`
   - Triggers: Auto-Create Credits, Timestamps

2. **backend/credits.js** - Credits Management Modul
   - `GET /api/credits/status` - Credits-Status abrufen
   - `POST /api/credits/use-token` - Einzelnen Token verwenden
   - `POST /api/credits/use-workflow` - Workflow starten (4 Tokens)
   - `POST /api/credits/purchase-workflows` - 5 Workflows kaufen (€5)
   - `POST /api/credits/purchase-tokens` - 10 Tokens kaufen (€5)
   - `GET /api/credits/pricing` - Preise abrufen
   - `GET /api/credits/history` - Kaufhistorie

### Frontend

3. **js/credits-ui.js** - Credits UI Komponente
   - `displayStatus()` - Credits-Anzeige
   - `showPurchaseModal()` - Kauf-Modal
   - `purchaseWorkflows()` - Workflows kaufen
   - `purchaseTokens()` - Tokens kaufen
   - `checkCredits()` - Credits vor Aktion prüfen
   - Inkl. kompletten CSS-Styles

4. **tokens-explanation.html** - Erklärungsseite
   - Was sind Workflows?
   - Was sind Tokens?
   - Nachkaufoptionen
   - FAQ
   - Beispiele

---

## 🔧 Geänderte Dateien

### Backend

1. **backend/auth.js**
   - Neuer Parameter `creditsModuleInstance` in `init()`
   - `register()` - Gibt Free Signup Bonus (3 Workflows = 12 Tokens)
   - `login()` - Returned Credits statt Subscription Workflows
   - `getCurrentUser()` - Returned Credits

2. **backend/server.js**
   - Import `creditsModule`
   - Schema V2 (`schema_v2.sql`)
   - Modul-Initialisierung mit `creditsModule` zuerst

### Frontend

3. **js/auth.js**
   - `getCreditsData()` / `setCreditsData()` - Credits caching
   - `refreshCredits()` - Credits vom Server abrufen
   - `register()` / `login()` - Credits speichern
   - `getCurrentUser()` - Credits speichern
   - Auto-Refresh Credits on page load

---

## 💾 Database Schema V2

### Neue Tabellen

```sql
-- Credits (Pro User)
CREATE TABLE credits (
  id INTEGER PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL,
  available_workflows INTEGER DEFAULT 0,
  available_tokens INTEGER DEFAULT 0,
  total_workflows_purchased INTEGER DEFAULT 0,
  total_tokens_purchased INTEGER DEFAULT 0,
  created_at DATETIME,
  updated_at DATETIME
);

-- Purchases (Kaufhistorie)
CREATE TABLE purchases (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  purchase_type TEXT, -- 'workflows', 'tokens', 'subscription'
  amount INTEGER,     -- Anzahl gekaufter Items
  price_eur REAL,
  payment_id TEXT,
  payment_status TEXT,
  created_at DATETIME
);

-- Token Usage (Verbrauch-Tracking)
CREATE TABLE token_usage (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  workflow_id INTEGER,
  tool_name TEXT,  -- 'ideas', 'brainstorming', 'prd', 'prototype'
  tokens_consumed INTEGER DEFAULT 1,
  usage_type TEXT, -- 'workflow', 'individual'
  created_at DATETIME
);
```

### Geänderte Tabellen

```sql
-- Subscriptions (vereinfacht)
CREATE TABLE subscriptions (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  plan TEXT NOT NULL, -- 'free', 'daily', 'monthly', 'yearly'
  start_date DATETIME,
  end_date DATETIME,
  active BOOLEAN DEFAULT 1
  -- workflows_limit und workflows_used ENTFERNT
);

-- Workflows (erweitert)
CREATE TABLE workflows (
  ...
  tokens_used INTEGER DEFAULT 0,      -- NEU: Verbrauchte Tokens
  tokens_allocated INTEGER DEFAULT 0,  -- NEU: Zugewiesene Tokens
  ...
);
```

---

## 🔌 API Endpoints

### Credits Management

```bash
# Credits Status abrufen
GET /api/credits/status
Authorization: Bearer <token>

Response:
{
  "availableWorkflows": 3,
  "availableTokens": 2,
  "totalAvailableTokens": 14,  // (3*4) + 2
  "canStartFullWorkflow": true,
  "tokensPerWorkflow": 4
}

# Token verwenden (einzeln)
POST /api/credits/use-token
{
  "tool": "ideas",  // 'ideas', 'brainstorming', 'prd', 'prototype'
  "workflowId": 123  // optional
}

# Workflow starten (4 Tokens)
POST /api/credits/use-workflow

# Workflows kaufen
POST /api/credits/purchase-workflows
{
  "paymentId": "stripe_xyz",
  "paymentStatus": "completed"
}

# Tokens kaufen
POST /api/credits/purchase-tokens
{
  "paymentId": "stripe_xyz",
  "paymentStatus": "completed"
}

# Preise abrufen
GET /api/credits/pricing

# Kaufhistorie
GET /api/credits/history
```

---

## 💰 Preisgestaltung

| Paket | Preis | Inhalt | Pro Token |
|-------|-------|--------|-----------|
| **5 Workflows** | €5,00 | 20 Tokens (5×4) | €0,25 |
| **10 Tokens** | €5,00 | 10 Tokens | €0,50 |
| **Free Bonus** | €0,00 | 3 Workflows (12 Tokens) | - |

**Empfehlung:**
- Workflows kaufen → Bester Preis (€0,25/Token)
- Tokens kaufen → Maximale Flexibilität (€0,50/Token)

---

## 🎨 Frontend Integration

### Credits anzeigen

```html
<!-- HTML -->
<div id="credits-status"></div>

<!-- JavaScript -->
<script src="/js/auth.js"></script>
<script src="/js/credits-ui.js"></script>
<script>
  // Credits-Status anzeigen
  CreditsUI.displayStatus('credits-status');
</script>
```

### Vor Aktion prüfen

```javascript
// Prüfe ob genug Credits vorhanden
const hasEnough = await CreditsUI.checkCredits(4, 'Workflow');
if (!hasEnough) {
  // User wird automatisch gefragt ob er kaufen möchte
  return;
}

// Aktion durchführen...
```

### Kauf-Modal öffnen

```javascript
// Kauf-Modal anzeigen
CreditsUI.showPurchaseModal();
```

---

## 🔄 Migration von altem System

### Alte Datenstruktur
```
subscription.workflowsLimit = 3
subscription.workflowsUsed = 0
subscription.workflowsRemaining = 3
```

### Neue Datenstruktur
```
credits.availableWorkflows = 3  (äquivalent zu workflowsRemaining)
credits.availableTokens = 0
credits.totalAvailableTokens = 12  (3 Workflows × 4 Tokens)
```

### Breaking Changes

**Backend:**
- ❌ `GET /api/subscriptions/status` - Gibt jetzt nur noch Plan info (keine Workflows)
- ✅ `GET /api/credits/status` - NEU: Für Credits-Info
- ❌ `subscriptions.workflows_limit` - Feld entfernt
- ❌ `subscriptions.workflows_used` - Feld entfernt

**Frontend:**
- ❌ `Auth.getSubscriptionData().workflowsRemaining` - Nicht mehr verfügbar
- ✅ `Auth.getCreditsData().availableWorkflows` - NEU
- ✅ `Auth.getCreditsData().totalAvailableTokens` - NEU

---

## 📋 Checklist - Was ist zu tun?

### Backend Setup

- [x] Neue Database Schema (`schema_v2.sql`)
- [x] Credits Modul (`backend/credits.js`)
- [x] Auth Modul aktualisiert
- [x] Server.js aktualisiert
- [ ] **Alte Datenbank löschen** (`database/app.db`) wenn vorhanden
- [ ] **Neue Datenbank initialisieren** (wird automatisch erstellt)

### Frontend Integration

- [x] Auth.js aktualisiert (Credits Support)
- [x] Credits-UI Komponente (`js/credits-ui.js`)
- [x] Erklärungsseite (`tokens-explanation.html`)
- [ ] **Index.html aktualisieren** - Credits-Anzeige hinzufügen
- [ ] **Auth.html aktualisieren** - Credits-Info bei Registrierung
- [ ] **Workflow-Pages erstellen** - Mit Credits-Check

### Testing

- [ ] Registrierung testen (3 Free Workflows)
- [ ] Login testen (Credits werden geladen)
- [ ] Token-Nutzung testen (einzeln)
- [ ] Workflow-Start testen (4 Tokens)
- [ ] Kauf testen (Workflows & Tokens)
- [ ] Credits-Anzeige testen

### Deployment

- [ ] Alte Datenbank sichern (falls vorhanden)
- [ ] Server neu starten mit Schema V2
- [ ] Payment Integration (Stripe/PayPal)
- [ ] Production Testing

---

## 🎯 Beispiel-Flows

### Flow 1: Neuer User registriert sich

1. User registriert sich
2. **3 Free Workflows** werden automatisch gutgeschrieben (= 12 Tokens)
3. User sieht: "Workflows: 3 / Tokens: 0 / Gesamt: 12 Tokens"
4. User kann wählen:
   - 3× kompletter Workflow (je 4 Tokens) ODER
   - 12× einzelne Tool-Nutzung ODER
   - Mix: 1 Workflow (4 Tokens) + 8× einzeln

### Flow 2: User will nur Ideengenerierung

1. User hat: Workflows: 0 / Tokens: 5
2. User klickt "Ideen generieren"
3. System prüft: `checkCredits(1, 'Ideengenerierung')`
4. Genug Tokens! → **1 Token wird verbraucht**
5. User hat jetzt: Workflows: 0 / Tokens: 4

### Flow 3: User will vollständigen Workflow

1. User hat: Workflows: 2 / Tokens: 0
2. User klickt "Workflow starten"
3. System prüft: `checkCredits(4, 'Workflow')`
4. Genug Credits! → **1 Workflow wird verbraucht** (= 4 Tokens)
5. User hat jetzt: Workflows: 1 / Tokens: 0

### Flow 4: User hat nicht genug Credits

1. User hat: Workflows: 0 / Tokens: 2
2. User will Workflow starten (braucht 4 Tokens)
3. System zeigt: "Nicht genügend Tokens! Jetzt kaufen?"
4. User klickt "Ja" → Kauf-Modal öffnet sich
5. User kauft 10 Tokens für €5
6. User hat jetzt: Workflows: 0 / Tokens: 12
7. Workflow kann gestartet werden

---

## 💡 Vorteile des neuen Systems

### Für Kunden

✅ **Maximale Flexibilität** - Einzelne Tools oder komplette Workflows<br>
✅ **Transparenz** - Klare Anzeige was verfügbar ist<br>
✅ **Kein Zwang** - Nicht immer kompletten Workflow durchlaufen<br>
✅ **Jederzeit nachkaufen** - Unabhängig von Abo<br>
✅ **Keine Verschwendung** - Nutze nur was du brauchst

### Für Operator

✅ **Flexible Preise** - 2 Kaufoptionen (Workflows €0,25/Token, Tokens €0,50/Token)<br>
✅ **Bessere Conversion** - Kunden kaufen eher kleine Pakete<br>
✅ **Tracking** - Genau sehen welche Tools genutzt werden<br>
✅ **Upselling** - Von Tokens zu Workflows leicht möglich

---

## 🚀 Next Steps

1. **Testen** - Alle Flows durchspielen
2. **Payment Integration** - Stripe/PayPal einbinden
3. **Workflow Pages** - Mit Credits-Check erweitern
4. **Index.html** - Credits-Anzeige hinzufügen
5. **Analytics** - Usage Tracking einbauen

---

**Status:** ✅ Tokens/Workflows System vollständig implementiert<br>
**Version:** 2.0.0<br>
**Datum:** 2025-10-29<br>
**Autor:** Claude Code
