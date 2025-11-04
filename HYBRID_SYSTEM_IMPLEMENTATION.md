# HYBRID API SYSTEM - Implementierungs-Status

**Ai Storm Create - Sebastian Beyer**
**Datum:** 4. November 2025

---

## ✅ ABGESCHLOSSEN: Backend (Hybrid API System)

### Neue Dateien:

#### 1. `backend/gemini-api.js`
- ✅ Vollständige Gemini API Integration
- ✅ Für FREE-Nutzer (kostenlos!)
- ✅ Gleiche Funktionen wie Claude:
  - `generateIdeas()`
  - `chatIteration()`
  - `createPRD()`
  - `generatePrototype()`

#### 2. `backend/api-router.js`
- ✅ Intelligente API-Auswahl basierend auf Plan
- ✅ `selectApi()` - wählt Gemini oder Claude
- ✅ `callWithFallback()` - mit automatischem Fallback
- ✅ `getApiInfo()` - API-Metadaten
- ✅ `checkApiAvailability()` - API-Status prüfen

### Aktualisierte Dateien:

#### 3. `backend/subscriptions_v2.js`
- ✅ Neues PLANS-Objekt:
  ```javascript
  free: {
    price: 0,
    workflows: 3,
    api: 'gemini'
  }
  day: {
    price: 4.99,
    workflows: 6,
    api: 'claude',
    canPurchaseExtra: true,
    extraWorkflowPrice: 1.99
  }
  month: {
    price: 29.99,
    workflows: 30,
    api: 'claude',
    canPurchaseExtra: true,
    extraWorkflowPrice: 1.99,
    popular: true
  }
  year: {
    price: 249.99,
    workflows: 360,
    api: 'claude',
    canPurchaseExtra: true,
    extraWorkflowPrice: 1.99,
    savings: 'Spare €109,89!'
  }
  ```

- ✅ EXTRA_PURCHASES aktualisiert:
  - single_workflow: €1.99
  - workflow_pack_5: €9.00 (10% discount)
  - workflow_pack_10: €16.00 (20% discount)

#### 4. `backend/workflows.js`
- ✅ Import geändert von `claudeApi` zu `apiRouter`
- ✅ Alle Workflow-Funktionen nutzen jetzt `apiRouter.callWithFallback()`
- ✅ `generateIdeas()` - Hybrid API
- ✅ `chatIteration()` - Hybrid API
- ✅ `createPRD()` - Hybrid API
- ✅ `generatePrototype()` - Hybrid API
- ✅ Plan-Info wird aus Subscription geladen
- ✅ API-Nutzung wird zurückgegeben (usedApi, provider)

#### 5. `package.json`
- ✅ Dependency hinzugefügt: `"@google/generative-ai": "^0.21.0"`

---

## ⏳ IN ARBEIT: Frontend

###  landing.html (Teilweise fertig)

**✅ Bereits geändert:**
- Header-Text: "Hybrid-System: FREE nutzt Gemini API (Google), Paid-Pläne nutzen Claude API (Anthropic)"
- Grid geändert von 3 auf 4 Spalten: `md:grid-cols-2 lg:grid-cols-4`

**❌ Noch zu tun:**
- FREE Plan Card aktualisieren (3 Workflows, Gemini AI Badge)
- DAY Plan Card NEU erstellen (€4,99, 6 Workflows)
- MONTH Plan Card aktualisieren (€29,99, 30 Workflows, "Beliebtester Plan")
- YEAR Plan Card aktualisieren (€249,99, 360 Workflows)
- Meta-Description aktualisieren (Hero-Section)
- FAQ aktualisieren (neue Preise)

### 📝 Komplett neu zu machen:

#### landing.html - Pricing Cards HTML:

```html
<!-- FREE Plan -->
<div class="bg-white rounded-2xl shadow-lg p-6 border-2 border-stone-200">
    <div class="mb-4">
        <h3 class="text-xl font-bold text-stone-900 mb-1">Free</h3>
        <p class="text-sm text-stone-600">Kostenlos testen</p>
        <span class="inline-block mt-2 bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">
            🤖 Gemini AI
        </span>
    </div>
    <div class="mb-4">
        <span class="text-4xl font-bold text-stone-900">€0</span>
        <span class="text-stone-600 text-sm">/für immer</span>
    </div>
    <ul class="space-y-2 mb-6 text-sm">
        <li class="flex items-start gap-2">
            <svg class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span><strong>3 Workflows</strong></span>
        </li>
        <li class="flex items-start gap-2">
            <svg class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Alle Features testen</span>
        </li>
        <li class="flex items-start gap-2">
            <svg class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Keine Kreditkarte nötig</span>
        </li>
    </ul>
    <a href="auth.html" class="block w-full bg-stone-200 text-stone-900 px-4 py-2.5 rounded-lg font-semibold text-center hover:bg-stone-300 transition text-sm">
        Jetzt testen
    </a>
</div>

<!-- DAY Plan -->
<div class="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-300">
    <div class="mb-4">
        <h3 class="text-xl font-bold text-stone-900 mb-1">Tag-Abo</h3>
        <p class="text-sm text-stone-600">Schnelle Projekte</p>
        <span class="inline-block mt-2 bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded">
            ⚡ Claude AI
        </span>
    </div>
    <div class="mb-4">
        <span class="text-4xl font-bold text-stone-900">€4,99</span>
        <span class="text-stone-600 text-sm">/Tag</span>
    </div>
    <ul class="space-y-2 mb-6 text-sm">
        <li class="flex items-start gap-2">
            <svg class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span><strong>6 Workflows</strong></span>
        </li>
        <li class="flex items-start gap-2">
            <svg class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Premium Claude AI</span>
        </li>
        <li class="flex items-start gap-2">
            <svg class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Nachkauf: €1,99/Workflow</span>
        </li>
    </ul>
    <a href="auth.html" class="block w-full bg-purple-600 text-white px-4 py-2.5 rounded-lg font-semibold text-center hover:bg-purple-700 transition text-sm">
        1 Tag kaufen
    </a>
</div>

<!-- MONTH Plan - BELIEBTESTER -->
<div class="bg-gradient-to-br from-amber-600 to-orange-600 rounded-2xl shadow-2xl p-6 border-2 border-amber-400 transform scale-105 relative">
    <div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-amber-600 px-3 py-1 rounded-full text-xs font-bold">
        🔥 Beliebtester Plan
    </div>
    <div class="mb-4">
        <h3 class="text-xl font-bold text-white mb-1">Monats-Abo</h3>
        <p class="text-sm text-amber-100">Regelmäßige Nutzung</p>
        <span class="inline-block mt-2 bg-white/20 text-white text-xs font-semibold px-2 py-1 rounded">
            ⚡ Claude AI
        </span>
    </div>
    <div class="mb-4">
        <span class="text-4xl font-bold text-white">€29,99</span>
        <span class="text-amber-100 text-sm">/Monat</span>
    </div>
    <ul class="space-y-2 mb-6 text-sm">
        <li class="flex items-start gap-2">
            <svg class="w-5 h-5 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span class="text-white"><strong>30 Workflows</strong></span>
        </li>
        <li class="flex items-start gap-2">
            <svg class="w-5 h-5 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span class="text-white">Premium Claude AI</span>
        </li>
        <li class="flex items-start gap-2">
            <svg class="w-5 h-5 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span class="text-white">Nachkauf: €1,99/Workflow</span>
        </li>
        <li class="flex items-start gap-2">
            <svg class="w-5 h-5 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span class="text-white">Jederzeit kündbar</span>
        </li>
    </ul>
    <a href="auth.html" class="block w-full bg-white text-amber-600 px-4 py-2.5 rounded-lg font-semibold text-center hover:bg-amber-50 transition shadow-lg text-sm">
        Jetzt starten
    </a>
</div>

<!-- YEAR Plan -->
<div class="bg-white rounded-2xl shadow-lg p-6 border-2 border-green-300 relative">
    <div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
        💰 Beste Ersparnis
    </div>
    <div class="mb-4">
        <h3 class="text-xl font-bold text-stone-900 mb-1">Jahres-Abo</h3>
        <p class="text-sm text-stone-600">Power-User</p>
        <span class="inline-block mt-2 bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded">
            ⚡ Claude AI
        </span>
    </div>
    <div class="mb-4">
        <span class="text-4xl font-bold text-stone-900">€249,99</span>
        <span class="text-stone-600 text-sm">/Jahr</span>
        <p class="text-xs text-green-600 font-semibold mt-1">Spare €109,89!</p>
    </div>
    <ul class="space-y-2 mb-6 text-sm">
        <li class="flex items-start gap-2">
            <svg class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span><strong>360 Workflows</strong> (30/Monat)</span>
        </li>
        <li class="flex items-start gap-2">
            <svg class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Premium Claude AI</span>
        </li>
        <li class="flex items-start gap-2">
            <svg class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Nachkauf: €1,99/Workflow</span>
        </li>
        <li class="flex items-start gap-2">
            <svg class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Früher Zugang zu Features</span>
        </li>
    </ul>
    <a href="auth.html" class="block w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white px-4 py-2.5 rounded-lg font-semibold text-center hover:from-amber-700 hover:to-orange-700 transition text-sm">
        Jetzt sparen
    </a>
</div>
```

---

## 📋 TODO: Weitere Dateien

### index.html
- Meta-Description ändern von "€14,99/Monat" zu "€4,99/Tag"
- Header-Link zu Preisen anpassen

### terms-and-conditions.html (AGB)
- Preistabelle komplett neu:
  - FREE: €0, 3 Workflows, Gemini API
  - TAG: €4,99, 6 Workflows, Claude API
  - MONAT: €29,99, 30 Workflows, Claude API
  - JAHR: €249,99, 360 Workflows, Claude API
- Nachkauf-Regelung hinzufügen (€1,99/Workflow)
- Laufzeit und Kündigungsfristen anpassen

### config/api-config.json
NEU erstellen:
```json
{
  "claudeApiKey": "sk-ant-api03-IHR_CLAUDE_KEY_HIER",
  "geminiApiKey": "AIzaSyXXXXXXXXXXXXXXXXXXXXXX",
  "useHybrid": true,
  "environment": "development"
}
```

---

## 🚀 Testing-Schritte

### 1. NPM-Paket installieren:
```bash
cd D:\Claudeapps\projekt
npm install
```

### 2. API-Keys eintragen:
Datei erstellen: `config/api-config.json`
```json
{
  "claudeApiKey": "sk-ant-api03-...",
  "geminiApiKey": "AIzaSy..."
}
```

### 3. Server starten:
```bash
node backend\server.js
```

### 4. Testen:
- FREE-Account registrieren → sollte Gemini nutzen
- DAY-Abo kaufen → sollte Claude nutzen
- Workflows erstellen und API-Nutzung prüfen

---

## 💰 Kosten-Kalkulation

**Pro Workflow:**
- Gemini (FREE): €0.00
- Claude (Paid): ~€0.16

**Beispiel 100 Nutzer:**
```
50 FREE-Nutzer × 3 Workflows = €0
10 DAY-Nutzer × 6 Workflows = €9.60
30 MONTH-Nutzer × 20 Workflows = €96
10 YEAR-Nutzer × 30 Workflows = €48

Total API-Kosten: €153.60/Monat
Total Einnahmen: (10 × €4.99) + (30 × €29.99) + (10 × €20.83) = €1.157,80
GEWINN: €1.004,20/Monat
```

---

## 📞 Support

Bei Fragen:
📧 aistormcreate.service@gmail.com
📞 +49 6853 8579828

---

**Status:** Backend fertig ✅ | Frontend in Arbeit ⏳
**Letztes Update:** 4. November 2025
