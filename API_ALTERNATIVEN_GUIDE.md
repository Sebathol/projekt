# API-Alternativen zu Claude - Vergleich & Integration

**Von der Idee zum Prototyp**
Ai Storm Create - Sebastian Beyer

---

## 📋 Übersicht verfügbarer KI-APIs

Aktuell nutzt Ihre App die **Claude API (Anthropic)**. Sie können aber auch folgende Alternativen nutzen:

### 1. **OpenAI API** (ChatGPT, GPT-4)
- ✅ Sehr populär und weit verbreitet
- ✅ Gute Code-Generierung
- ✅ Große Community
- ⚠️ Ähnliche Kosten wie Claude

### 2. **Google Gemini API**
- ✅ Kostenloser Tier verfügbar!
- ✅ Gute Performance
- ✅ Multimodal (Bilder + Text)
- ⚠️ Weniger Erfahrung mit Code-Generierung

### 3. **Mistral AI**
- ✅ Europäisch (Frankreich)
- ✅ Günstiger als OpenAI/Claude
- ✅ DSGVO-freundlich
- ⚠️ Kleineres Modell

### 4. **Llama (Meta) via Replicate/Hugging Face**
- ✅ Open Source
- ✅ Sehr günstig
- ⚠️ Selbst hosten oder API-Wrapper nutzen

---

## 💰 Kostenvergleich (Stand November 2025)

| API | Modell | Input (1M Tokens) | Output (1M Tokens) | Workflow-Kosten* |
|-----|--------|-------------------|-------------------|------------------|
| **Claude** | Sonnet 4 | $3.00 | $15.00 | ~€0.16 |
| **OpenAI** | GPT-4o | $2.50 | $10.00 | ~€0.13 |
| **Gemini** | Pro 1.5 | $0.00** | $0.00** | ~€0.00 |
| **Mistral** | Large | $2.00 | $6.00 | ~€0.08 |

*Durchschnittlich für Idee → Prototyp Workflow
**Gemini Free Tier: 60 Requests/Minute, 1500/Tag

---

## 🚀 Empfehlung für Ihre App

### **Option 1: Google Gemini API (EMPFOHLEN für Start!)**

**Warum?**
- ✅ **KOSTENLOS** bis zu 1.500 Requests/Tag
- ✅ Perfekt für Testing und erste Nutzer
- ✅ Einfache Integration
- ✅ Bei Erfolg später auf bezahlte Version upgraden

**Einschränkungen:**
- 60 Requests/Minute (ausreichend für kleine App)
- 1.500 Requests/Tag (= ca. 150-300 Workflows/Tag)

### **Option 2: OpenAI API (Alternative)**

**Warum?**
- ✅ Sehr gute Code-Generierung
- ✅ Etwas günstiger als Claude (~€0.13 vs €0.16)
- ✅ Riesige Community und viele Beispiele

**Nachteil:**
- ⚠️ Keine kostenlose Version

### **Option 3: Hybrid-Ansatz (BESTE LÖSUNG!)**

```
FREE-Nutzer → Gemini API (kostenlos)
PRO-Nutzer → Claude API (beste Qualität)
```

**Vorteile:**
- ✅ Keine API-Kosten für FREE-Nutzer
- ✅ Beste Qualität für zahlende Kunden
- ✅ Skalierbar

---

## 📝 Code-Integration: Google Gemini API

### Schritt 1: Gemini API-Key besorgen

1. Gehen Sie zu: **https://makersuite.google.com/app/apikey**
2. Klicken Sie auf **"Get API Key"** oder **"Create API Key"**
3. Wählen Sie ein Google Cloud Projekt (oder erstellen Sie eins)
4. Kopieren Sie den API-Key

**Format:** `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`

**Kosten:**
- ✅ **FREE Tier:** Bis zu 60 Requests/Minute, 1.500/Tag - **KOSTENLOS!**
- 💰 **Paid Tier:** Erst ab 1.501+ Requests/Tag

### Schritt 2: Gemini SDK installieren

```bash
cd D:\Claudeapps\projekt
npm install @google/generative-ai
```

### Schritt 3: Neue Datei erstellen

**Datei:** `backend/gemini-api.js`

```javascript
/**
 * Google Gemini API Wrapper
 * Alternative zu Claude API - KOSTENLOS für FREE-Nutzer!
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

// Load API key from config
const configPath = path.join(__dirname, '../config/api-config.json');
let GEMINI_API_KEY = 'DEIN_GEMINI_API_KEY_HIER';

if (fs.existsSync(configPath)) {
  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    GEMINI_API_KEY = config.geminiApiKey || GEMINI_API_KEY;
  } catch (error) {
    console.error('❌ Error loading API config:', error);
  }
}

// Initialize Gemini
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

// Gemini API pricing (FREE tier: 0, Paid tier similar to Claude)
const PRICING = {
  'gemini-1.5-pro': {
    input: 0,    // FREE tier
    output: 0    // FREE tier
  }
};

/**
 * Call Gemini API
 */
async function callGemini(prompt, maxTokens = 4000) {
  if (GEMINI_API_KEY === 'DEIN_GEMINI_API_KEY_HIER') {
    throw new Error('Gemini API Key nicht konfiguriert. Bitte config/api-config.json aktualisieren.');
  }

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: maxTokens,
        temperature: 0.7,
      }
    });

    const response = await result.response;
    const text = response.text();

    // Gemini doesn't provide detailed token usage in free tier
    // We estimate based on text length
    const estimatedTokens = Math.ceil(text.length / 4);

    return {
      content: text,
      usage: {
        inputTokens: Math.ceil(prompt.length / 4),
        outputTokens: estimatedTokens,
        totalTokens: Math.ceil(prompt.length / 4) + estimatedTokens,
        costEUR: 0  // FREE!
      }
    };

  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
}

/**
 * Generate ideas
 */
async function generateIdeas(db, workflowId, mode, input, lang = 'de') {
  let prompt = '';

  if (mode === 'brainstorming') {
    prompt = lang === 'de'
      ? `Generiere 5 innovative Geschäftsideen zum Thema: "${input}".

Für jede Idee gib an:
- Titel (kurz und prägnant)
- Beschreibung (2-3 Sätze)
- Priorität (Hoch/Mittel/Niedrig)
- Aufwand (Hoch/Mittel/Niedrig)
- Marktrelevanz (Hoch/Mittel/Niedrig)

Format als JSON Array:
[
  {
    "title": "...",
    "description": "...",
    "priority": "Hoch",
    "effort": "Mittel",
    "market": "Hoch"
  }
]

WICHTIG: Antworte NUR mit dem JSON Array, ohne weitere Erklärungen oder Markdown.`
      : `Generate 5 innovative business ideas for: "${input}".

For each idea provide:
- Title (short and catchy)
- Description (2-3 sentences)
- Priority (High/Medium/Low)
- Effort (High/Medium/Low)
- Market Relevance (High/Medium/Low)

Format as JSON Array:
[
  {
    "title": "...",
    "description": "...",
    "priority": "High",
    "effort": "Medium",
    "market": "High"
  }
]

IMPORTANT: Respond ONLY with the JSON array, no additional explanations or markdown.`;
  } else {
    // Ideen-Funke Modus
    prompt = lang === 'de'
      ? `Erstelle einen kreativen "Ideen-Funken" - eine unerwartete Kombination oder einen überraschenden Ansatz für ein Produkt oder Service. Sei innovativ und inspirierend!

Generiere 3 außergewöhnliche Ideen mit Funken-Charakter.

Für jede Idee gib an:
- Titel (kreativ und einprägsam)
- Beschreibung (2-3 Sätze, beschreibe den innovativen Funken)
- Priorität (Hoch/Mittel/Niedrig)
- Aufwand (Hoch/Mittel/Niedrig)
- Marktrelevanz (Hoch/Mittel/Niedrig)

Format als JSON Array:
[
  {
    "title": "...",
    "description": "...",
    "priority": "Hoch",
    "effort": "Mittel",
    "market": "Hoch"
  }
]

WICHTIG: Antworte NUR mit dem JSON Array, ohne weitere Erklärungen oder Markdown.`
      : `Create a creative "idea spark" - an unexpected combination or surprising approach for a product or service. Be innovative and inspiring!

Generate 3 extraordinary ideas with spark character.

For each idea provide:
- Title (creative and memorable)
- Description (2-3 sentences, describe the innovative spark)
- Priority (High/Medium/Low)
- Effort (High/Medium/Low)
- Market Relevance (High/Medium/Low)

Format as JSON Array:
[
  {
    "title": "...",
    "description": "...",
    "priority": "High",
    "effort": "Medium",
    "market": "High"
  }
]

IMPORTANT: Respond ONLY with the JSON array, no additional explanations or markdown.`;
  }

  const result = await callGemini(prompt);

  // Save usage
  await saveApiUsage(db, workflowId, 'ideas', result.usage);

  // Clean and parse JSON
  const cleanedResponse = result.content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  const ideas = JSON.parse(cleanedResponse);

  return { ideas, cost: result.usage.costEUR };
}

/**
 * Create PRD
 */
async function createPRD(db, workflowId, idea, lang = 'de') {
  const prompt = lang === 'de'
    ? `Erstelle ein ausführliches Product Requirements Document (PRD) für folgende Idee:

Titel: ${idea.title}
Beschreibung: ${idea.description}

Das PRD sollte folgende Abschnitte enthalten:
1. Executive Summary
2. Produktvision und Ziele
3. Zielgruppe
4. Funktionale Anforderungen
5. User Stories
6. Technische Anforderungen
7. Design-Anforderungen
8. Erfolgsmetriken
9. Risiken und Abhängigkeiten
10. Zeitplan und Meilensteine

Schreibe in professionellem, aber verständlichem Deutsch.`
    : `Create a comprehensive Product Requirements Document (PRD) for this idea:

Title: ${idea.title}
Description: ${idea.description}

The PRD should include these sections:
1. Executive Summary
2. Product Vision and Goals
3. Target Audience
4. Functional Requirements
5. User Stories
6. Technical Requirements
7. Design Requirements
8. Success Metrics
9. Risks and Dependencies
10. Timeline and Milestones

Write in professional but understandable English.`;

  const result = await callGemini(prompt, 6000);

  // Save usage
  await saveApiUsage(db, workflowId, 'prd', result.usage);

  return { prd: result.content, cost: result.usage.costEUR };
}

/**
 * Generate prototype
 */
async function generatePrototype(db, workflowId, prd, lang = 'de') {
  const prompt = lang === 'de'
    ? `Basierend auf diesem PRD, erstelle einen vollständigen, funktionsfähigen HTML-Prototyp:

${prd}

Anforderungen:
- Erstelle eine VOLLSTÄNDIGE, selbstständige HTML-Datei
- Nutze Tailwind CSS (via CDN)
- Implementiere die Kern-Features
- Modernes, ansprechendes Design
- Mobile-responsive
- Interaktive Elemente mit JavaScript
- Erdtöne (Amber, Orange, Stone) als Farbschema

WICHTIG:
- Antworte NUR mit dem kompletten HTML-Code
- Keine Erklärungen oder Markdown
- Der Code muss sofort lauffähig sein
- Beginne direkt mit <!DOCTYPE html>`
    : `Based on this PRD, create a complete, functional HTML prototype:

${prd}

Requirements:
- Create a COMPLETE, standalone HTML file
- Use Tailwind CSS (via CDN)
- Implement core features
- Modern, appealing design
- Mobile-responsive
- Interactive elements with JavaScript
- Earth tones (Amber, Orange, Stone) as color scheme

IMPORTANT:
- Respond ONLY with the complete HTML code
- No explanations or markdown
- Code must be immediately runnable
- Start directly with <!DOCTYPE html>`;

  const result = await callGemini(prompt, 8000);

  // Save usage
  await saveApiUsage(db, workflowId, 'prototype', result.usage);

  // Clean HTML
  const cleanedHtml = result.content.replace(/```html\n?/g, '').replace(/```\n?/g, '').trim();

  return { prototype: cleanedHtml, cost: result.usage.costEUR };
}

/**
 * Save API usage to database
 */
async function saveApiUsage(db, workflowId, step, usage) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO api_usage (workflow_id, step, input_tokens, output_tokens, total_tokens, cost_eur)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [workflowId, step, usage.inputTokens, usage.outputTokens, usage.totalTokens, usage.costEUR],
      function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      }
    );
  });
}

module.exports = {
  callGemini,
  generateIdeas,
  createPRD,
  generatePrototype,
  saveApiUsage
};
```

### Schritt 4: Config-Datei aktualisieren

**Datei:** `config/api-config.json`

```json
{
  "claudeApiKey": "sk-ant-api03-XXXXXXXX",
  "geminiApiKey": "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "useApi": "gemini",
  "model": "gemini-1.5-pro",
  "environment": "development"
}
```

### Schritt 5: Workflows anpassen

**Datei:** `backend/workflows.js`

```javascript
/**
 * Workflows Module - MULTI-API Support
 */

const { authenticateToken } = require('./auth');
const { hasWorkflowsRemaining, decrementWorkflowCount } = require('./subscriptions');
const claudeApi = require('./claude-api');
const geminiApi = require('./gemini-api');  // NEU!
const fs = require('fs');
const path = require('path');

// Load config to determine which API to use
const configPath = path.join(__dirname, '../config/api-config.json');
let useApi = 'claude';  // default

if (fs.existsSync(configPath)) {
  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    useApi = config.useApi || 'claude';
  } catch (error) {
    console.error('Error loading config:', error);
  }
}

// Select API based on config
const api = useApi === 'gemini' ? geminiApi : claudeApi;

console.log(`✅ Using ${useApi.toUpperCase()} API for workflows`);

let db;

/**
 * Initialize workflows module
 */
function init(app, database) {
  db = database;

  // Register routes (unchanged)
  app.post('/api/workflows/generate-ideas', authenticateToken, generateIdeas);
  app.post('/api/workflows/chat', authenticateToken, chatIteration);
  app.post('/api/workflows/create-prd', authenticateToken, createPRD);
  app.post('/api/workflows/generate-prototype', authenticateToken, generatePrototype);
  app.get('/api/workflows/list', authenticateToken, listWorkflows);
  app.get('/api/workflows/:id', authenticateToken, getWorkflow);
  app.delete('/api/workflows/:id', authenticateToken, deleteWorkflow);
  app.post('/api/workflows/:id/update', authenticateToken, updateWorkflow);
}

/**
 * Generate ideas (Step 1) - NOW USES SELECTED API
 */
async function generateIdeas(req, res) {
  const { mode, input, lang = 'de' } = req.body;
  const userId = req.user.userId;

  // Validation
  if (!mode || (mode === 'brainstorming' && !input)) {
    return res.status(400).json({ error: 'Mode und Input sind erforderlich' });
  }

  try {
    // Check if user has workflows remaining
    const hasRemaining = await hasWorkflowsRemaining(userId);
    if (!hasRemaining) {
      return res.status(403).json({
        error: 'Workflow-Limit erreicht. Bitte upgraden Sie Ihr Abonnement.',
        upgrade: true
      });
    }

    // Get active subscription
    const subscription = await new Promise((resolve, reject) => {
      db.get(
        `SELECT subscription_id FROM active_subscriptions WHERE user_id = ? AND active = 1`,
        [userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!subscription) {
      return res.status(404).json({ error: 'Kein aktives Abonnement gefunden' });
    }

    // Create new workflow
    const result = await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO workflows (user_id, subscription_id, workflow_type, current_step)
         VALUES (?, ?, 'partial', 'ideas')`,
        [userId, subscription.subscription_id],
        function(err) {
          if (err) reject(err);
          else resolve({ workflowId: this.lastID });
        }
      );
    });

    const workflowId = result.workflowId;

    // Call selected API (Gemini or Claude)
    const { ideas, cost } = await api.generateIdeas(db, workflowId, mode, input, lang);

    // Update workflow
    await new Promise((resolve, reject) => {
      db.run(
        `UPDATE workflows SET ideas_json = ?, updated_at = CURRENT_TIMESTAMP WHERE workflow_id = ?`,
        [JSON.stringify(ideas), workflowId],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    res.json({
      success: true,
      workflowId,
      ideas,
      cost,
      api: useApi  // Tell frontend which API was used
    });

  } catch (error) {
    console.error('Error generating ideas:', error);
    res.status(500).json({
      error: 'Fehler beim Generieren der Ideen',
      details: error.message
    });
  }
}

// Rest of the file remains the same, but uses `api` instead of `claudeApi`
// ...

module.exports = { init };
```

---

## 🔀 HYBRID-Lösung: Gemini für FREE, Claude für PRO

**Beste Kosten-Nutzen-Verhältnis!**

### Code-Anpassung für Hybrid

**Datei:** `backend/workflows.js` (erweitert)

```javascript
/**
 * Select API based on user subscription
 */
function selectApi(subscriptionPlan) {
  // FREE users → Gemini (kostenlos!)
  // PRO users → Claude (beste Qualität)

  if (subscriptionPlan === 'free') {
    return geminiApi;
  } else {
    return claudeApi;
  }
}

/**
 * Generate ideas - HYBRID API Selection
 */
async function generateIdeas(req, res) {
  const { mode, input, lang = 'de' } = req.body;
  const userId = req.user.userId;

  try {
    // Get subscription to determine which API to use
    const subscription = await new Promise((resolve, reject) => {
      db.get(
        `SELECT s.plan
         FROM active_subscriptions a
         JOIN subscriptions s ON a.subscription_id = s.subscription_id
         WHERE a.user_id = ? AND a.active = 1`,
        [userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    // Select API based on plan
    const api = selectApi(subscription.plan);
    const apiName = subscription.plan === 'free' ? 'Gemini' : 'Claude';

    console.log(`🤖 Using ${apiName} API for user ${userId} (${subscription.plan})`);

    // ... rest of code uses `api` ...

    const { ideas, cost } = await api.generateIdeas(db, workflowId, mode, input, lang);

    res.json({
      success: true,
      workflowId,
      ideas,
      cost,
      api: apiName
    });

  } catch (error) {
    console.error('Error generating ideas:', error);
    res.status(500).json({
      error: 'Fehler beim Generieren der Ideen',
      details: error.message
    });
  }
}
```

### Vorteil der Hybrid-Lösung

**Kostenersparnis-Beispiel:**

Ohne Hybrid (nur Claude):
```
100 FREE-Nutzer × 3 Workflows × €0.16 = €48
50 PRO-Nutzer × 20 Workflows × €0.16 = €160
TOTAL: €208/Monat
```

Mit Hybrid (Gemini für FREE, Claude für PRO):
```
100 FREE-Nutzer × 3 Workflows × €0.00 = €0
50 PRO-Nutzer × 20 Workflows × €0.16 = €160
TOTAL: €160/Monat
```

**Ersparnis: €48/Monat = €576/Jahr! 🎉**

---

## 📝 OpenAI API Integration (falls gewünscht)

Falls Sie stattdessen **OpenAI (ChatGPT)** nutzen möchten:

### Installation

```bash
npm install openai
```

### Code-Beispiel

**Datei:** `backend/openai-api.js`

```javascript
const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');

// Load API key
const configPath = path.join(__dirname, '../config/api-config.json');
let OPENAI_API_KEY = 'sk-proj-XXXXX';

if (fs.existsSync(configPath)) {
  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    OPENAI_API_KEY = config.openaiApiKey || OPENAI_API_KEY;
  } catch (error) {
    console.error('Error loading config:', error);
  }
}

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY
});

/**
 * Call OpenAI API
 */
async function callOpenAI(messages, maxTokens = 4000) {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',  // or 'gpt-4-turbo', 'gpt-3.5-turbo'
      messages: messages,
      max_tokens: maxTokens,
      temperature: 0.7
    });

    const usage = completion.usage;
    const inputCost = (usage.prompt_tokens / 1000000) * 2.50;
    const outputCost = (usage.completion_tokens / 1000000) * 10.00;
    const totalCostEUR = (inputCost + outputCost) * 1.10;

    return {
      content: completion.choices[0].message.content,
      usage: {
        inputTokens: usage.prompt_tokens,
        outputTokens: usage.completion_tokens,
        totalTokens: usage.total_tokens,
        costEUR: totalCostEUR
      }
    };

  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}

// Rest ähnlich wie bei Claude/Gemini
// ...

module.exports = {
  callOpenAI,
  generateIdeas,
  createPRD,
  generatePrototype
};
```

---

## 🎯 Schnell-Entscheidungshilfe

### Wählen Sie **Gemini**, wenn:
- ✅ Sie gerade starten (FREE Tier!)
- ✅ Kosten minimieren möchten
- ✅ Weniger als 1.500 Workflows/Tag erwarten

### Wählen Sie **Claude**, wenn:
- ✅ Beste Code-Qualität wichtig ist
- ✅ Sie bereits zahlende Kunden haben
- ✅ Professionelle Ergebnisse garantieren wollen

### Wählen Sie **OpenAI**, wenn:
- ✅ Sie bereits OpenAI-Erfahrung haben
- ✅ Etwas günstiger als Claude (~€0.13 vs €0.16)
- ✅ Große Community wichtig ist

### Wählen Sie **Hybrid**, wenn:
- ✅ **BESTE LÖSUNG!** Kosten sparen + Qualität bieten
- ✅ FREE-Nutzer kostenlos bedienen (Gemini)
- ✅ PRO-Nutzer Premium-Qualität geben (Claude)

---

## ✅ Zusammenfassung

**Meine Empfehlung:**

1. **Start:** Nutzen Sie **Gemini API** (kostenlos!)
2. **Testing:** Alle Funktionen mit Gemini testen
3. **Launch:** Hybrid-System implementieren
   - FREE → Gemini (€0)
   - PRO → Claude (€0.16/Workflow)

**Kosten-Beispiel mit Hybrid:**
```
Monat 1: 100 FREE-Nutzer + 10 PRO
→ API-Kosten: €0 + €32 = €32
→ PRO-Einnahmen: 10 × €14.99 = €149.90
→ GEWINN (nach API): €117.90

Monat 6: 500 FREE-Nutzer + 100 PRO
→ API-Kosten: €0 + €320 = €320
→ PRO-Einnahmen: 100 × €14.99 = €1.499
→ GEWINN (nach API): €1.179
```

---

## 📞 Support

Bei Fragen:
📧 aistormcreate.service@gmail.com
📞 +49 6853 8579828

**Nützliche Links:**
- Gemini API: https://ai.google.dev/
- OpenAI API: https://platform.openai.com/
- Claude API: https://console.anthropic.com/

---

**Erstellt:** 4. November 2025
**Für:** Ai Storm Create - Sebastian Beyer
