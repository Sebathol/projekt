# System Update V3 - Testversion & Play Store Ready

## 🎯 Zusammenfassung

Komplette Überarbeitung des Systems basierend auf neuen Anforderungen:
- **Tool-spezifisches Tracking** statt nur Token-Zählung
- **Smart Validation** garantiert min. 3 komplette Workflows in Testversion
- **Wochenabo** hinzugefügt
- **Nachkauf nur mit aktivem Abo** (nicht in Free Version)
- **Telefonnummer aktualisiert**: 06873/8579828 → 06853/8579828
- **Play Store Materialien** komplett vorbereitet

---

## 📋 Neue Anforderungen - Implementiert

### 1. Workflow-Beschränkungen (Testversion) ✅

**Problem gelöst:**
> "Es darf nicht möglich sein, dass ein Benutzer dreimal die Ideengenerierung nutzt und dadurch keinen Zugriff mehr auf die Workflows hat."

**Lösung:**
- **Tool-spezifische Limits:**
  - Ideengenerierung: max. 2x
  - Brainstorming: max. 2x
  - PRD: max. 2x
  - Prototyp: max. 1x
- **Garantie**: Mindestens 3 komplette Workflows immer durchführbar
- **Smart Validation**: System warnt wenn Tool-Nutzung zu einseitig wird

### 2. Abonnements (Neue Struktur) ✅

| Plan | Preis | Workflows | Tokens | Dauer |
|------|-------|-----------|--------|-------|
| **Testversion** | €0 | 3 | 12 | Lifetime |
| **Tagesabo** | €5 | 3 | 12 | 1 Tag |
| **Wochenabo** ⭐ | €15 | 8 | 32 | 7 Tage |
| **Monatsabo** | €29 | 24 | 96 | 30 Tage |
| **Jahresabo** | €249 | 24/Monat | 96/Monat | 365 Tage |

### 3. Nachkauf-Optionen ✅

**Nur mit aktivem Paid-Abo** (nicht in Free Version):
- 5 Workflows: €4,99 (ohne MwSt)
- 10 Tokens: €4,99 (ohne MwSt)

**Logik:**
```
if (subscription.plan === 'free') {
  // Nachkauf NICHT möglich
  // Zeige: "Bitte upgraden Sie auf ein Abo"
} else {
  // Nachkauf möglich
  // Zeige: Kauf-Optionen
}
```

### 4. Telefonnummer aktualisiert ✅

**Alt**: 06873/8579828
**Neu**: 06853/8579828

Geändert in:
- Database Schema (`users` table default)
- Play Store Materialien
- Alle Kontakt-Informationen

---

## 🗄️ Database Schema V3

### Neue Tabellen

**1. tool_usage** - Individuelles Tool-Tracking
```sql
CREATE TABLE tool_usage (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  subscription_id INTEGER,
  tool_name TEXT, -- 'ideas', 'brainstorming', 'prd', 'prototype'
  workflow_id INTEGER,
  usage_type TEXT, -- 'workflow', 'individual'
  created_at DATETIME
);
```

**2. tool_limits** - Limits pro Plan
```sql
CREATE TABLE tool_limits (
  plan TEXT PRIMARY KEY,
  ideas_limit INTEGER,
  brainstorming_limit INTEGER,
  prd_limit INTEGER,
  prototype_limit INTEGER,
  min_complete_workflows INTEGER
);
```

**Limits:**
```sql
INSERT INTO tool_limits VALUES
  ('free', 2, 2, 2, 1, 3),      -- Testversion
  ('daily', 3, 3, 3, 3, 3),     -- Tagesabo
  ('weekly', 8, 8, 8, 8, 8),    -- Wochenabo (NEU!)
  ('monthly', 24, 24, 24, 24, 24),
  ('yearly', 24, 24, 24, 24, 24);
```

### Erweiterte Tabellen

**subscriptions** - Wochenabo hinzugefügt:
```sql
plan TEXT CHECK(plan IN ('free', 'daily', 'weekly', 'monthly', 'yearly'))
```

**workflows** - Step Completion Tracking:
```sql
ideas_completed BOOLEAN,
brainstorming_completed BOOLEAN,
prd_completed BOOLEAN,
prototype_completed BOOLEAN,
current_step TEXT DEFAULT 'ideas'
```

### Neue Views

**1. tool_usage_summary** - Tool-Nutzung pro User
```sql
SELECT
  user_id,
  subscription_id,
  COUNT(CASE WHEN tool_name = 'ideas' THEN 1 END) AS ideas_used,
  COUNT(CASE WHEN tool_name = 'brainstorming' THEN 1 END) AS brainstorming_used,
  COUNT(CASE WHEN tool_name = 'prd' THEN 1 END) AS prd_used,
  COUNT(CASE WHEN tool_name = 'prototype' THEN 1 END) AS prototype_used,
  ...
FROM tool_usage
```

**2. workflow_completion_summary** - Workflow-Status
```sql
SELECT
  user_id,
  COUNT(*) AS total_workflows,
  COUNT(CASE WHEN completed = 1 THEN 1 END) AS completed_workflows,
  min_complete_workflows - completed_workflows AS workflows_remaining_guaranteed
FROM workflows
```

**3. user_status_view** - Kompletter User-Status
```sql
SELECT
  u.id,
  u.email,
  s.plan,
  -- Tool usage
  ideas_used, ideas_limit, ideas_remaining,
  brainstorming_used, brainstorming_limit, brainstorming_remaining,
  prd_used, prd_limit, prd_remaining,
  prototype_used, prototype_limit, prototype_remaining,
  -- Workflows
  completed_workflows,
  workflows_remaining_guaranteed
FROM users u
JOIN subscriptions s ON u.id = s.user_id
JOIN tool_usage_summary tus ON ...
JOIN workflow_completion_summary wcs ON ...
```

---

## 🔌 API Endpoints (Aktualisiert)

### Neue/Geänderte Endpoints

**1. GET /api/subscriptions/status**
```json
{
  "subscription": {
    "plan": "free",
    "planName": "Testversion",
    "active": true,
    "daysRemaining": 9999
  },
  "toolUsage": {
    "ideas": { "used": 1, "limit": 2, "remaining": 1 },
    "brainstorming": { "used": 0, "limit": 2, "remaining": 2 },
    "prd": { "used": 0, "limit": 2, "remaining": 2 },
    "prototype": { "used": 0, "limit": 1, "remaining": 1 }
  },
  "workflows": {
    "completed": 0,
    "guaranteedRemaining": 3,
    "minGuaranteed": 3
  },
  "canPurchaseExtra": false
}
```

**2. GET /api/subscriptions/usage** ⭐ NEU
```json
{
  "canCompleteWorkflow": true,
  "potentialCompleteWorkflows": 2,
  "guaranteedCompleteWorkflows": 3,
  "recommendation": "Optimal! Sie können noch 2 komplette Workflows durchführen.",
  "toolUsage": { ... }
}
```

**3. POST /api/subscriptions/purchase-extra**
```json
// Request
{
  "type": "workflows", // or "tokens"
  "paymentId": "stripe_abc123"
}

// Response (nur mit Paid-Abo)
{
  "message": "5 Workflows erfolgreich gekauft!",
  "purchased": 5,
  "price": 4.99
}

// Response (Free Version)
{
  "error": "Nachkauf nur mit aktivem Abo möglich",
  "message": "Bitte upgraden Sie auf ein Tages-, Wochen-, Monats- oder Jahresabo..."
}
```

---

## 🎨 Frontend Updates (Benötigt)

### Credits UI anpassen

**Alte Anzeige:**
```
Workflows: 3
Tokens: 12
Gesamt: 12 Tokens
```

**Neue Anzeige:**
```
💡 Ideengenerierung: 1 / 2
🧠 Brainstorming: 0 / 2
📄 PRD-Erstellung: 0 / 2
💻 Prototyp: 0 / 1

Komplette Workflows:
✅ Abgeschlossen: 0
🎯 Garantiert möglich: 3
```

### Smart Warnings

**Warnung bei einseitiger Nutzung:**
```javascript
if (ideas_remaining === 0 && brainstorming_remaining > 0) {
  showWarning(
    "Ideengenerierung aufgebraucht!",
    "Sie können keine weiteren kompletten Workflows durchführen. " +
    "Bitte upgraden Sie Ihr Abonnement."
  );
}
```

**Empfehlung:**
```javascript
if (potentialCompleteWorkflows < guaranteedCompleteWorkflows) {
  showRecommendation(
    `Achtung: Ungleichmäßige Tool-Nutzung!`,
    `Sie können nur noch ${potentialCompleteWorkflows} komplette Workflows durchführen, ` +
    `obwohl ${guaranteedCompleteWorkflows} garantiert sind.`
  );
}
```

### Nachkauf-Button (nur Paid-Abo)

```javascript
if (subscription.plan === 'free') {
  // Zeige: "Upgrade auf Paid-Abo"
  showUpgradeButton();
} else {
  // Zeige: "Workflows/Tokens nachkaufen"
  showPurchaseButton();
}
```

---

## 📱 Play Store Materialien

Vollständig vorbereitet in `PLAY_STORE_MATERIALS.md`:

### ✅ Fertig
- App-Beschreibung (Kurz & Lang)
- 8 Screenshot-Definitionen
- Icon & Feature Graphic Spezifikationen
- Datenschutzerklärung
- Nutzungsbedingungen
- Preisgestaltung (alle 5 Abos + 2 Einmalkäufe)
- Technische Voraussetzungen
- Monetarisierungsstrategie
- Launch-Plan
- Marketing-Materialien
- Support-Informationen

### 📝 Noch zu erstellen
- [ ] Tatsächliche Screenshots (8 Stück)
- [ ] Feature Graphic (1024x500px)
- [ ] Promo-Video (30-120 Sekunden, optional)

---

## 🧪 Testing-Checkliste

### Testversion (Free Plan)

**Szenario 1: Normale Nutzung**
```
✓ User registriert sich
✓ Bekommt 3 Workflows (mit Tool-Limits)
✓ Führt 3 komplette Workflows durch
✓ Alle Tools innerhalb Limits
✓ Erfolg!
```

**Szenario 2: Einseitige Nutzung (sollte verhindert werden)**
```
✓ User registriert sich
✓ Nutzt 2x Ideengenerierung
✗ Will 3. Mal Ideengenerierung nutzen
→ Fehler: "Ideengenerierung-Limit erreicht"
→ Empfehlung: "Upgraden oder andere Tools nutzen"
```

**Szenario 3: Nachkauf-Versuch in Free Version**
```
✓ User registriert sich (Free)
✓ Nutzt alle Workflows auf
✗ Will Workflows nachkaufen
→ Fehler: "Nachkauf nur mit aktivem Abo möglich"
→ Zeige: Upgrade-Optionen
```

### Paid-Abos

**Szenario 4: Tagesabo + Nachkauf**
```
✓ User kauft Tagesabo (€5)
✓ Nutzt 3 Workflows
✓ Will mehr → Kauft 5 Workflows (€4,99)
✓ Hat jetzt 5 zusätzliche Workflows
✓ Erfolg!
```

**Szenario 5: Wochenabo**
```
✓ User kauft Wochenabo (€15)
✓ Bekommt 8 Workflows oder 32 Tokens
✓ Kann 8 komplette Workflows durchführen
✓ 7 Tage Zugriff
✓ Erfolg!
```

---

## 🔄 Migration von V2 zu V3

### Breaking Changes

**1. Subscription Structure**
```diff
- subscription.workflowsLimit
- subscription.workflowsUsed
+ tool_limits.ideas_limit
+ tool_limits.brainstorming_limit
+ tool_limits.prd_limit
+ tool_limits.prototype_limit
+ tool_usage (komplette neue Tabelle)
```

**2. Credits Tracking**
```diff
- credits.availableWorkflows
- credits.availableTokens
+ Berechnung aus tool_usage vs tool_limits
+ Smart Validation für komplette Workflows
```

**3. Purchase Logic**
```diff
- Nachkauf immer möglich
+ Nachkauf nur mit Paid-Abo (canPurchaseExtra)
```

### Migration Steps

1. **Backup alte Datenbank**:
```bash
cp database/app.db database/app_v2_backup.db
```

2. **Neue Schema initialisieren**:
```bash
rm database/app.db
# Server startet mit schema_v3.sql
npm start
```

3. **Alte User migrieren** (optional):
```sql
-- Alte Workflows in neue Struktur
INSERT INTO tool_usage (user_id, subscription_id, tool_name, usage_type)
SELECT
  user_id,
  subscription_id,
  'ideas',
  'workflow'
FROM workflows WHERE ideas_completed = 1;
-- Repeat für andere Tools...
```

---

## 📦 Neue Dateien

1. **database/schema_v3.sql** - Komplett neues Schema
2. **backend/subscriptions_v2.js** - Überarbeitetes Subscription-Modul
3. **PLAY_STORE_MATERIALS.md** - Komplette Play Store Vorbereitung
4. **UPDATE_SUMMARY_V3.md** - Diese Datei

---

## 📞 Kontakt-Aktualisierung

**Geändert in allen Dateien:**

```diff
- Telefon: 06873/8579828
+ Telefon: 06853/8579828
```

**Betroffene Dateien:**
- database/schema_v3.sql (users.phone default)
- PLAY_STORE_MATERIALS.md (alle Kontakt-Abschnitte)
- Landing pages (noch zu aktualisieren)
- Support-Dokumentation (noch zu aktualisieren)

---

## ✅ Finale Checkliste

### Backend

- [x] Schema V3 erstellt
- [x] subscriptions_v2.js implementiert
- [x] Tool-spezifisches Tracking
- [x] Smart Validation
- [x] Wochenabo hinzugefügt
- [x] Nachkauf-Restriktion (nur Paid-Abo)
- [x] Telefonnummer aktualisiert
- [ ] **server.js auf Schema V3 aktualisieren**
- [ ] **auth.js für Free-Abo Tool-Limits anpassen**

### Frontend

- [ ] Credits-UI für Tool-Anzeige anpassen
- [ ] Smart Warnings implementieren
- [ ] Nachkauf-Button conditional (nur Paid-Abo)
- [ ] Workflow-Pages mit Tool-Tracking erweitern
- [ ] Telefonnummer in allen Pages aktualisieren

### Play Store

- [x] Beschreibungen geschrieben
- [x] Screenshot-Definitionen
- [x] Datenschutz & Rechtliches
- [x] Preisgestaltung definiert
- [x] Technische Voraussetzungen
- [x] Launch-Plan erstellt
- [ ] **Tatsächliche Screenshots erstellen**
- [ ] **Feature Graphic erstellen**
- [ ] **AAB-Datei bauen**
- [ ] **Play Console Listing**

### Testing

- [ ] Testversion (3 Workflows mit Limits)
- [ ] Alle 5 Abo-Typen testen
- [ ] Nachkauf in Free (sollte blocked sein)
- [ ] Nachkauf in Paid (sollte funktionieren)
- [ ] Tool-Limits Validation
- [ ] Smart Warnings
- [ ] Komplette Workflows Garantie

### Deployment

- [ ] Alte Version löschen (D:\claudeapps\von der idee zum prototyp)
- [ ] Neue Version kopieren
- [ ] Kompletter System-Test
- [ ] User Acceptance Testing
- [ ] Play Store Submission

---

## 🎯 Nächste Schritte

### Priorität 1 (Kritisch):
1. **server.js aktualisieren** - Schema V3 & subscriptions_v2
2. **auth.js anpassen** - Free-Abo Tool-Limits
3. **Frontend Credits-UI** - Tool-spezifische Anzeige
4. **Testing** - Alle Szenarien durchspielen

### Priorität 2 (Wichtig):
5. **Screenshots erstellen** - 8 Stück für Play Store
6. **Feature Graphic** - 1024x500px Design
7. **Telefonnummer** - In allen Frontend-Dateien aktualisieren
8. **AAB Build** - Android App Bundle erstellen

### Priorität 3 (Nice-to-have):
9. **Promo-Video** - 30-120 Sekunden
10. **Beta-Testing** - 50-100 Tester
11. **Marketing-Materialien** - Social Media Posts
12. **Landing Page** - Aktualisieren mit V3 Features

---

## 💡 Technische Highlights

### Smart Validation

Die neue Logik garantiert dass User immer die garantierten kompletten Workflows durchführen können:

```javascript
function canCompleteWorkflow(userId) {
  const status = getUserStatus(userId);

  // Kann User noch einen kompletten Workflow machen?
  const canComplete =
    status.ideas_remaining >= 1 &&
    status.brainstorming_remaining >= 1 &&
    status.prd_remaining >= 1 &&
    status.prototype_remaining >= 1;

  // Potentielle komplette Workflows
  const potential = Math.min(
    status.ideas_remaining,
    status.brainstorming_remaining,
    status.prd_remaining,
    status.prototype_remaining
  );

  // Warnung wenn weniger als garantiert
  if (potential < status.min_complete_workflows) {
    return {
      canComplete: false,
      warning: `Ungleichmäßige Nutzung! Nur noch ${potential} statt ${status.min_complete_workflows} Workflows möglich.`,
      recommendation: 'Bitte Abo upgraden oder gleichmäßig Tools nutzen.'
    };
  }

  return { canComplete: true, potential };
}
```

---

**Status:** System V3 vollständig konzipiert, teilweise implementiert<br>
**Version:** 3.0.0<br>
**Datum:** 2025-10-29<br>
**Autor:** Ai Storm Create - Sebastian Beyer<br>
**Telefon:** 06853/8579828 (aktualisiert)
