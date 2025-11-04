# 🎁 Influencer Code System

**Letzte Aktualisierung:** 4. November 2025
**Version:** 1.0

---

## 📋 Übersicht

Das Influencer Code System ermöglicht es Influencern und Partnern, ihren Followern kostenlose Workflows zu schenken. Dies ist perfekt für Marketing-Kampagnen, Produktlaunches und Partnerschaften.

### Vorteile:
- ✅ **Schnelle Kundenakquise** - Influencer bringen neue User
- ✅ **Virales Marketing** - User teilen Codes mit Freunden
- ✅ **Tracking** - Sehe genau, welcher Influencer wie viele User bringt
- ✅ **Flexibel** - Erstelle unbegrenzt viele Codes mit verschiedenen Konditionen

---

## 🚀 Standard Influencer Code

Ein Standard-Code wurde bereits für dich erstellt:

```
Code: INFLUENCER20
Workflows: 20
Max Uses: 100
Status: Aktiv
```

Dieser Code gibt jedem User **20 kostenlose Workflows** (zusätzlich zu den 3 FREE Workflows).

---

## 💻 Code einlösen

### Während der Registrierung

User können den Code direkt bei der Registrierung eingeben:

```json
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "influencerCode": "INFLUENCER20"
}
```

**Response:**
```json
{
  "message": "Registrierung erfolgreich",
  "userId": 123,
  "token": "jwt_token_here",
  "codeRedeemed": {
    "success": true,
    "workflowsGranted": 20,
    "message": "Code erfolgreich eingelöst! Du hast 20 Workflows erhalten."
  }
}
```

### Nach der Registrierung

Bestehende User können Codes einlösen:

```json
POST /api/auth/redeem-code
Authorization: Bearer JWT_TOKEN
{
  "code": "INFLUENCER20"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Code erfolgreich eingelöst! Du hast 20 Workflows erhalten.",
  "workflowsGranted": 20,
  "subscriptionId": 456
}
```

---

## 🛠️ Neue Codes erstellen

### Methode 1: Via Node.js Script

```bash
cd backend
node create-influencer-code.js
```

Das erstellt einen neuen zufälligen Code (z.B. `INFLUENCERX7K2`).

**Mit Custom Code:**
```bash
node create-influencer-code.js --code MYCODE2025 --workflows 30
```

**Parameter:**
- `--code CODE` - Eigener Code-Name (optional)
- `--workflows NUMBER` - Anzahl Workflows (Standard: 20)

### Methode 2: Programmatisch

```javascript
const influencerCodes = require('./backend/influencer-codes');

const code = await influencerCodes.createInfluencerCode(db, {
  code: 'SUMMER2025',           // Code (optional, wird generiert)
  workflowsAmount: 30,           // Workflows pro Einlösung
  maxUses: 500,                  // Max. 500 Einlösungen
  expiresAt: '2025-12-31',       // Ablaufdatum (optional)
  description: 'Sommer Kampagne' // Beschreibung
});

console.log(`Code erstellt: ${code.code}`);
```

---

## 📊 Code-Tracking & Analytics

### Code-Status abrufen

```javascript
const stats = await influencerCodes.getCodeStats(db, codeId);

console.log(`
  Code: ${stats.code}
  Eingelöst: ${stats.total_redemptions}/${stats.max_uses}
  Gesamt Workflows: ${stats.total_workflows_granted}
`);
```

### Alle Codes auflisten

```javascript
const allCodes = await influencerCodes.listAllCodes(db);

allCodes.forEach(code => {
  console.log(`
    ${code.code}
    - ${code.workflows_amount} Workflows
    - ${code.redemptions || 0} / ${code.max_uses || '∞'} Einlösungen
    - Status: ${code.active ? 'Aktiv' : 'Deaktiviert'}
  `);
});
```

### User Codes anzeigen

```javascript
const userCodes = await influencerCodes.getUserRedeemedCodes(db, userId);

userCodes.forEach(redemption => {
  console.log(`
    Code: ${redemption.code}
    Workflows: ${redemption.workflows_granted}
    Eingelöst: ${redemption.redeemed_at}
  `);
});
```

---

## 🔒 Code-Management

### Code deaktivieren

```javascript
await influencerCodes.deactivateCode(db, codeId);
```

Deaktivierte Codes können nicht mehr eingelöst werden, aber bereits eingelöste Workflows bleiben erhalten.

### Code-Sicherheit

Codes sind:
- ✅ **Case-insensitive** - `INFLUENCER20` = `influencer20`
- ✅ **Unique** - Jeder Code kann nur einmal existieren
- ✅ **Rate-limited** - Verhindert Brute-Force Attacks
- ✅ **Trackbar** - Alle Einlösungen werden geloggt

---

## 🎯 Use Cases

### 1. YouTube Video Launch

```javascript
await influencerCodes.createInfluencerCode(db, {
  code: 'YOUTUBE50',
  workflowsAmount: 50,
  maxUses: 1000,
  expiresAt: '2025-12-31',
  description: 'YouTube Video Launch - 50 Workflows'
});
```

Teile `YOUTUBE50` in deinem Video → Bis zu 1.000 User können es einlösen.

### 2. Instagram Story Kampagne

```javascript
await influencerCodes.createInfluencerCode(db, {
  code: 'INSTA20',
  workflowsAmount: 20,
  maxUses: 500,
  expiresAt: '2025-06-30',
  description: 'Instagram Story Juni 2025'
});
```

### 3. Partner-Kooperation

```javascript
await influencerCodes.createInfluencerCode(db, {
  code: 'PARTNER100',
  workflowsAmount: 100,
  maxUses: 50,  // Nur für erste 50 Premium-Kunden
  description: 'Premium Partner Deal'
});
```

### 4. Limited Time Offer

```javascript
await influencerCodes.createInfluencerCode(db, {
  code: 'WEEKEND30',
  workflowsAmount: 30,
  maxUses: 200,
  expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 Tage
  description: 'Weekend Special'
});
```

---

## 📱 Frontend Integration

### Registrierungs-Formular

Füge ein optionales Code-Feld hinzu:

```html
<form id="registerForm">
  <input type="email" name="email" required placeholder="E-Mail">
  <input type="password" name="password" required placeholder="Passwort">

  <!-- NEU: Influencer Code Feld -->
  <input type="text"
         name="influencerCode"
         placeholder="Influencer Code (optional)"
         style="text-transform: uppercase;">

  <button type="submit">Registrieren</button>
</form>

<script>
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
    influencerCode: formData.get('influencerCode') // Optional
  };

  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const result = await response.json();

  if (result.codeRedeemed) {
    alert(`✅ ${result.codeRedeemed.message}`);
  }
});
</script>
```

### Code-Einlösung für bestehende User

```html
<form id="redeemForm">
  <input type="text" name="code" required placeholder="Influencer Code">
  <button type="submit">Einlösen</button>
</form>

<script>
document.getElementById('redeemForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const code = new FormData(e.target).get('code');
  const token = localStorage.getItem('authToken');

  const response = await fetch('/api/auth/redeem-code', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ code })
  });

  const result = await response.json();

  if (result.success) {
    alert(`✅ ${result.message}`);
  } else {
    alert(`❌ ${result.message || result.error}`);
  }
});
</script>
```

---

## 🧪 Testing

### Test 1: Code erstellen

```bash
cd backend
node create-influencer-code.js --code TEST20 --workflows 20
```

**Erwartete Ausgabe:**
```
✅ Code erfolgreich erstellt!
═══════════════════════════════════
   CODE: TEST20
═══════════════════════════════════
   Workflows: 20
   Max Uses: 100
```

### Test 2: Code einlösen (Neue Registrierung)

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "TestPass123!",
    "influencerCode": "TEST20"
  }'
```

**Erwartete Response:**
```json
{
  "message": "Registrierung erfolgreich",
  "codeRedeemed": {
    "success": true,
    "workflowsGranted": 20,
    "message": "Code erfolgreich eingelöst! Du hast 20 Workflows erhalten."
  }
}
```

### Test 3: Code einlösen (Bestehender User)

```bash
# 1. Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "existinguser@example.com",
    "password": "Pass123!"
  }'

# 2. Copy token from response

# 3. Redeem code
curl -X POST http://localhost:3000/api/auth/redeem-code \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"code": "TEST20"}'
```

### Test 4: Code doppelt einlösen (sollte fehlschlagen)

```bash
curl -X POST http://localhost:3000/api/auth/redeem-code \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"code": "TEST20"}'
```

**Erwartete Response:**
```json
{
  "error": "Code-Einlösung fehlgeschlagen",
  "message": "Code bereits eingelöst"
}
```

---

## 📈 ROI Tracking

### Beispiel-Rechnung

**Kampagne:** YouTube Influencer mit 10K Subscribers

```
Code: YOUTUBE30
Workflows: 30
Max Uses: 1.000
Eingelöst: 487 User
```

**Metriken:**
- **Neue User:** 487
- **Conversion zu Paid:** 5% = 24 User
- **Durchschnittlicher Plan:** MONATS-ABO (€29.99)
- **Monatliche Einnahmen:** 24 × €29.99 = **€719.76**
- **Jährliche Einnahmen:** **€8,637**

**Kosten:**
- Influencer Payment: €500
- API Kosten (487 × 30 Workflows × €0.00): **€0** (nutzen Gemini API = FREE!)

**ROI:** ∞ (Profit ohne zusätzliche API-Kosten dank Hybrid-System!)

---

## 🚨 Troubleshooting

### Problem: "Code ungültig oder deaktiviert"

**Lösung:**
```bash
# Prüfe ob Code existiert:
sqlite3 database.db "SELECT * FROM influencer_codes WHERE code='DEIN_CODE'"

# Falls nicht gefunden, erstelle den Code neu
```

### Problem: "Code bereits eingelöst"

**Antwort:** Das ist korrekt! Jeder User kann jeden Code nur einmal einlösen.

### Problem: "Code-Limit erreicht"

```bash
# Prüfe aktuelle Nutzung:
sqlite3 database.db "SELECT current_uses, max_uses FROM influencer_codes WHERE code='DEIN_CODE'"

# Erhöhe Limit:
sqlite3 database.db "UPDATE influencer_codes SET max_uses=500 WHERE code='DEIN_CODE'"
```

---

## 📚 API Referenz

### `createInfluencerCode(db, options)`

Erstellt einen neuen Influencer Code.

**Parameter:**
- `code` (string, optional) - Code-Name
- `workflowsAmount` (number) - Workflows pro Einlösung (Standard: 20)
- `maxUses` (number, optional) - Max. Einlösungen (null = unbegrenzt)
- `expiresAt` (string/Date, optional) - Ablaufdatum
- `description` (string, optional) - Beschreibung

**Returns:** Promise<Object>

### `validateCode(db, code, userId)`

Prüft ob ein Code gültig ist.

**Returns:** Promise<{valid: boolean, reason?: string, codeId?: number, workflowsAmount?: number}>

### `redeemCode(db, userId, code)`

Löst einen Code für einen User ein.

**Returns:** Promise<{success: boolean, workflowsGranted: number, message: string}>

### `getCodeStats(db, codeId)`

Ruft Statistiken für einen Code ab.

**Returns:** Promise<Object>

### `listAllCodes(db)`

Listet alle Codes auf.

**Returns:** Promise<Array>

### `deactivateCode(db, codeId)`

Deaktiviert einen Code.

**Returns:** Promise<{success: boolean}>

---

## 💡 Best Practices

1. **Unique Codes:** Verwende prägnante, einzigartige Codes (z.B. `TECHYOUTUBE25` statt `CODE1`)
2. **Limits setzen:** Verhindere Missbrauch durch `maxUses` Limits
3. **Ablaufdaten:** Setze Deadlines für zeitlich begrenzte Kampagnen
4. **Tracking:** Monitore regelmäßig welche Codes am besten performen
5. **A/B Testing:** Teste verschiedene Workflow-Mengen (20 vs. 30 vs. 50)

---

## 📧 Support

Bei Fragen zum Influencer Code System:
- E-Mail: aistormcreate.service@gmail.com
- Dokumentation: [INFLUENCER_CODE_SYSTEM.md](./INFLUENCER_CODE_SYSTEM.md)

---

**© 2025 AI Storm Create - Sebastian Beyer**
