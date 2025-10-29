/**
 * Claude API Wrapper
 * Handles all Claude API calls and cost tracking
 * Operator pays for API costs (not the user)
 */

const fs = require('fs');
const path = require('path');

// Load API key from config
const configPath = path.join(__dirname, '../config/api-config.json');
let API_KEY = 'DEIN_API_KEY_HIER';

if (fs.existsSync(configPath)) {
  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    API_KEY = config.claudeApiKey || API_KEY;
  } catch (error) {
    console.error('❌ Error loading API config:', error);
  }
}

// Claude API pricing (per 1M tokens)
const PRICING = {
  'claude-sonnet-4-20250514': {
    input: 3.00,  // $3 per 1M input tokens
    output: 15.00 // $15 per 1M output tokens
  }
};

const MODEL = 'claude-sonnet-4-20250514';

/**
 * Call Claude API
 */
async function callClaude(messages, maxTokens = 4000) {
  if (API_KEY === 'DEIN_API_KEY_HIER') {
    throw new Error('Claude API Key nicht konfiguriert. Bitte config/api-config.json erstellen.');
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: maxTokens,
        messages: messages
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Claude API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();

    // Calculate cost
    const inputTokens = data.usage?.input_tokens || 0;
    const outputTokens = data.usage?.output_tokens || 0;
    const totalTokens = inputTokens + outputTokens;

    const inputCost = (inputTokens / 1000000) * PRICING[MODEL].input;
    const outputCost = (outputTokens / 1000000) * PRICING[MODEL].output;
    const totalCostUSD = inputCost + outputCost;
    const totalCostEUR = totalCostUSD * 1.10; // Approximate USD to EUR conversion

    return {
      content: data.content[0].text,
      usage: {
        inputTokens,
        outputTokens,
        totalTokens,
        costEUR: totalCostEUR
      }
    };

  } catch (error) {
    console.error('Claude API error:', error);
    throw error;
  }
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

  const result = await callClaude([{ role: 'user', content: prompt }]);

  // Save usage
  await saveApiUsage(db, workflowId, 'ideas', result.usage);

  // Clean and parse JSON
  const cleanedResponse = result.content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  const ideas = JSON.parse(cleanedResponse);

  return { ideas, cost: result.usage.costEUR };
}

/**
 * Chat iteration (refine ideas)
 */
async function chatIteration(db, workflowId, chatMessages, ideas, lang = 'de') {
  // Build conversation with context
  const contextPrompt = lang === 'de'
    ? `Kontext: Wir entwickeln Geschäftsideen weiter. Hier sind die aktuellen Ideen:\n\n${JSON.stringify(ideas, null, 2)}\n\nBitte hilf dabei, die Ideen zu verbessern oder zu erweitern. Wenn du neue/geänderte Ideen generierst, nutze IMMER das gleiche JSON-Format wie zuvor.`
    : `Context: We are developing business ideas further. Here are the current ideas:\n\n${JSON.stringify(ideas, null, 2)}\n\nPlease help improve or expand the ideas. If you generate new/changed ideas, ALWAYS use the same JSON format as before.`;

  const messages = [
    { role: 'user', content: contextPrompt },
    ...chatMessages
  ];

  const result = await callClaude(messages);

  // Save usage
  await saveApiUsage(db, workflowId, 'chat', result.usage);

  return { response: result.content, cost: result.usage.costEUR };
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

  const result = await callClaude([{ role: 'user', content: prompt }], 6000);

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

  const result = await callClaude([{ role: 'user', content: prompt }], 8000);

  // Save usage
  await saveApiUsage(db, workflowId, 'prototype', result.usage);

  // Clean HTML
  const cleanedHtml = result.content.replace(/```html\n?/g, '').replace(/```\n?/g, '').trim();

  return { prototype: cleanedHtml, cost: result.usage.costEUR };
}

module.exports = {
  callClaude,
  generateIdeas,
  chatIteration,
  createPRD,
  generatePrototype,
  saveApiUsage
};
