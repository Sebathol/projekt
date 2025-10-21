# Lizenz-System Dokumentation

Dieser Guide erklärt das Lizenz-Verwaltungssystem von Pure PDF Viewer.

## 🔐 Übersicht

Das Lizenz-System ermöglicht es dir:
- Eindeutige Lizenz-Keys für Kunden zu generieren
- Verschiedene Lizenz-Levels zu verwalten
- Lizenzen zu tracken und zu verwalten
- Premium-Features freizuschalten

## 🛠️ Setup-Tool nutzen

### Login

1. Öffne `setup-tool.html` im Browser
2. Standard-Passwort: `JoHanna268219$`
3. Passwort ändern in `setup-tool.js` (Zeile 2)

### Lizenz generieren

1. **Gehe zu Tab "Lizenz-Verwaltung"**
2. **Gib Kundeninformationen ein:**
   - Kundenname (optional): "Max Mustermann"
   - Lizenz-Level: Basic / Professional / Enterprise
3. **Klicke "Lizenz generieren"**
4. **Kopiere den generierten Key**

### Lizenz-Key Format

```
PDF-[LEVEL]-[TIMESTAMP]-[RANDOM]
```

**Beispiele:**
```
PDF-BASIC-L8K9M2N4-abc123def456
PDF-PRO-M3N5P7Q9-xyz789ghi012
PDF-ENTERPRISE-R2S4T6U8-mno345pqr678
```

**Komponenten:**
- `PDF` - Produkt-Prefix
- `BASIC/PRO/ENTERPRISE` - Lizenz-Level
- Timestamp - Eindeutige Zeitstempel (Base36)
- Random - Zufällige Zeichenkette

## 📊 Lizenz-Levels

### Basic (€29.99)

**Features:**
- ✅ PDF Viewer
- ✅ Zoom & Navigation
- ✅ Tastenkürzel
- ✅ Email-Support
- ❌ Annotation
- ❌ Konvertierung

**Key-Prefix:** `PDF-BASIC-`

### Professional (€49.99)

**Features:**
- ✅ Alle Basic Features
- ✅ PDF-Annotation
- ✅ PDF-Konvertierung
- ✅ Erweiterte Suche
- ✅ Priority Support
- ✅ Updates für 1 Jahr

**Key-Prefix:** `PDF-PRO-`

### Enterprise (€99.99)

**Features:**
- ✅ Alle Pro Features
- ✅ Unbegrenzte Lizenzen (5-10 PCs)
- ✅ Custom Branding
- ✅ Telefon-Support
- ✅ Lebenslange Updates
- ✅ SLA-Garantie

**Key-Prefix:** `PDF-ENTERPRISE-`

## 💾 Lizenz-Speicherung

### LocalStorage (Browser)

Lizenzen werden im Browser gespeichert:
```javascript
localStorage.getItem('pdf_licenses')
```

**Struktur:**
```json
[
  {
    "key": "PDF-PRO-L8K9M2N4-abc123def456",
    "customer": "Max Mustermann",
    "level": "pro",
    "generated": "2025-10-21T12:00:00.000Z",
    "status": "active"
  }
]
```

### Export/Import

**Export (Backup):**
1. Browser-Konsole öffnen (F12)
2. Ausführen:
```javascript
exportLicenses()
```
3. Datei wird heruntergeladen: `pdf-licenses-[timestamp].json`

**Import (Restore):**
1. Erstelle ein File-Input in `setup-tool.html`
2. Oder manuell:
```javascript
const licenses = [...]; // Deine gespeicherten Lizenzen
localStorage.setItem('pdf_licenses', JSON.stringify(licenses));
```

## 🔧 Lizenz-Validierung implementieren

### In der App (Electron)

**1. Lizenz-Check bei Start:**

Erstelle `license-validator.js`:
```javascript
const fs = require('fs');
const path = require('path');

const LICENSE_FILE = path.join(app.getPath('userData'), 'license.key');

function validateLicense(licenseKey) {
  // Format-Check
  const regex = /^PDF-(BASIC|PRO|ENTERPRISE)-[A-Z0-9]+-[a-z0-9]+$/;
  if (!regex.test(licenseKey)) {
    return { valid: false, error: 'Invalid format' };
  }

  // Level extrahieren
  const parts = licenseKey.split('-');
  const level = parts[1].toLowerCase();

  // Validierung (einfach)
  return {
    valid: true,
    level: level,
    features: getFeaturesByLevel(level)
  };
}

function getFeaturesByLevel(level) {
  const features = {
    basic: ['viewer', 'zoom', 'navigation'],
    pro: ['viewer', 'zoom', 'navigation', 'annotation', 'export'],
    enterprise: ['viewer', 'zoom', 'navigation', 'annotation', 'export', 'cloud', 'branding']
  };
  return features[level] || features.basic;
}

function saveLicense(licenseKey) {
  fs.writeFileSync(LICENSE_FILE, licenseKey, 'utf8');
}

function loadLicense() {
  try {
    return fs.readFileSync(LICENSE_FILE, 'utf8');
  } catch {
    return null;
  }
}

module.exports = {
  validateLicense,
  saveLicense,
  loadLicense
};
```

**2. Lizenz-Dialog beim ersten Start:**

In `main.js`:
```javascript
const { validateLicense, saveLicense, loadLicense } = require('./license-validator');

app.whenReady().then(() => {
  const license = loadLicense();

  if (!license) {
    // Zeige Lizenz-Dialog
    showLicenseDialog();
  } else {
    const result = validateLicense(license);
    if (result.valid) {
      createWindow(result.features);
    } else {
      showLicenseDialog();
    }
  }
});

function showLicenseDialog() {
  // Erstelle ein Dialog-Fenster für Lizenz-Eingabe
  // ...
}
```

**3. Feature-Gates:**

In `renderer.js`:
```javascript
// Features basierend auf Lizenz aktivieren/deaktivieren
window.electronAPI.getFeatures().then(features => {
  if (!features.includes('annotation')) {
    document.getElementById('annotationBtn').disabled = true;
    document.getElementById('annotationBtn').title = 'Upgrade to Pro';
  }

  if (!features.includes('export')) {
    document.getElementById('exportBtn').disabled = true;
  }
});
```

## 🌐 Online-Validierung (Optional)

Für erweiterte Sicherheit kannst du eine Online-Validierung implementieren:

### Backend API

**Node.js/Express Beispiel:**
```javascript
const express = require('express');
const app = express();

// Datenbank mit Lizenzen
const licenses = new Map();

app.post('/api/validate', (req, res) => {
  const { key } = req.body;

  const license = licenses.get(key);

  if (!license) {
    return res.json({ valid: false, error: 'License not found' });
  }

  if (license.status !== 'active') {
    return res.json({ valid: false, error: 'License inactive' });
  }

  // Update last-seen
  license.lastSeen = new Date();
  licenses.set(key, license);

  res.json({
    valid: true,
    level: license.level,
    expires: license.expires
  });
});

app.listen(3000);
```

### In der App

```javascript
async function validateOnline(licenseKey) {
  try {
    const response = await fetch('https://yourapi.com/api/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: licenseKey })
    });

    const result = await response.json();
    return result;
  } catch (error) {
    // Offline - nutze lokale Validierung
    return validateOffline(licenseKey);
  }
}
```

## 🛡️ Sicherheits-Hinweise

### Grundlegende Sicherheit

1. **Lizenz-Keys sind nicht unknackbar**
   - Jemand könnte den Code reverse-engineeren
   - Akzeptabel für Low-Price Software (€30-50)

2. **Für höhere Sicherheit:**
   - Online-Validierung implementieren
   - Code-Obfuscation nutzen
   - Server-seitige Checks

3. **Realistische Erwartungen:**
   - 95% der Nutzer zahlen
   - 5% könnten cracken (akzeptable Verlustrate)
   - Fokus auf ehrliche Kunden

### Erweiterte Sicherheit

**Code-Obfuscation:**
```bash
npm install javascript-obfuscator
```

```javascript
const JavaScriptObfuscator = require('javascript-obfuscator');

const obfuscatedCode = JavaScriptObfuscator.obfuscate(`
  function validateLicense(key) {
    // Your code
  }
`, {
  compact: true,
  controlFlowFlattening: true
});
```

**Hardware-Binding (MAC-Adresse):**
```javascript
const { exec } = require('child_process');

function getMacAddress() {
  // Platform-spezifisch MAC-Adresse auslesen
  // Lizenz an diesen PC binden
}
```

## 📧 Lizenz-Emails an Kunden

### Email-Template

**Betreff:** Dein Pure PDF Viewer Lizenz-Key

**Body:**
```
Hallo [Kundenname],

vielen Dank für deinen Kauf von Pure PDF Viewer [Level]!

Dein Lizenz-Key:
┌─────────────────────────────────────────┐
│ PDF-PRO-L8K9M2N4-abc123def456           │
└─────────────────────────────────────────┘

INSTALLATION:
1. Öffne Pure PDF Viewer
2. Gehe zu "Hilfe" → "Lizenz aktivieren"
3. Gib deinen Lizenz-Key ein
4. Klicke "Aktivieren"

SUPPORT:
Bei Fragen oder Problemen:
📧 Email: support@yourcompany.com
🌐 Website: www.yourcompany.com/support
⏰ Antwortzeit: Innerhalb 24h

DEINE FEATURES:
✅ PDF Viewer
✅ Zoom & Navigation
✅ Tastenkürzel
✅ PDF-Annotation
✅ PDF-Konvertierung
✅ Priority Support
✅ 1 Jahr kostenlose Updates

Viel Erfolg mit Pure PDF Viewer!

Dein Team von [Your Company]

---
Diese Email enthält deine Lizenz-Informationen.
Bitte bewahre sie auf für zukünftige Referenz.
```

## 📊 Lizenz-Tracking

### Dashboard erstellen

**Metriken:**
- Anzahl generierter Lizenzen
- Aktive vs. inaktive Lizenzen
- Umsatz pro Level
- Beliebte Lizenz-Levels

**Im Setup-Tool anzeigen:**
```javascript
function getLicenseStats() {
  const stats = {
    total: licenses.length,
    basic: licenses.filter(l => l.level === 'basic').length,
    pro: licenses.filter(l => l.level === 'pro').length,
    enterprise: licenses.filter(l => l.level === 'enterprise').length,
    revenue: calculateRevenue(licenses)
  };
  return stats;
}

function calculateRevenue(licenses) {
  const prices = { basic: 29.99, pro: 49.99, enterprise: 99.99 };
  return licenses.reduce((sum, lic) => sum + prices[lic.level], 0);
}
```

## 🔄 Lizenz-Upgrades

### Upgrade-Pfade

**Basic → Pro:**
- Differenz: €20 (statt €49.99 - €29.99)
- Neuer Key: `PDF-PRO-...`

**Pro → Enterprise:**
- Differenz: €50
- Neuer Key: `PDF-ENTERPRISE-...`

### Im Setup-Tool

```javascript
function createUpgradeOffer(oldKey, newLevel) {
  const oldLicense = licenses.find(l => l.key === oldKey);
  const oldLevel = oldLicense.level;

  const prices = { basic: 29.99, pro: 49.99, enterprise: 99.99 };
  const difference = prices[newLevel] - prices[oldLevel];

  return {
    upgradeCost: difference,
    oldLevel: oldLevel,
    newLevel: newLevel
  };
}
```

## 📝 Zusammenfassung

**Für den Start:**
1. ✅ Setup-Tool öffnen (`setup-tool.html`)
2. ✅ Login mit Passwort
3. ✅ Lizenz generieren für jeden Verkauf
4. ✅ Key an Kunden senden
5. ✅ Support bereitstellen

**Für erweiterte Nutzung:**
1. ✅ Online-Validierung implementieren
2. ✅ Code-Obfuscation nutzen
3. ✅ Lizenz-Dashboard erstellen
4. ✅ Auto-Emails bei Verkauf
5. ✅ Upgrade-System

---

**Bei Fragen:** support@yourcompany.com

**Viel Erfolg! 🔐**
