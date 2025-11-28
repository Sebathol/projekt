import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Anthropic } from '@anthropic-ai/sdk';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Claude Client
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * 1. Brainstorming Chat Endpoint
 */
app.post('/api/brainstorm/chat', async (req, res) => {
  try {
    const { message, chatHistory = [], topic } = req.body;

    // Build conversation history for Claude
    const messages = chatHistory.map((msg) => ({
      role: msg.sender === 'ai' ? 'assistant' : 'user',
      content: msg.message,
    }));

    // Add current user message
    messages.push({ role: 'user', content: message });

    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: `You are an expert business mentor helping entrepreneurs expand and structure their business ideas.
      The user has the following initial idea: "${topic}"
      Ask thoughtful, probing questions about:
      - Target audience and use cases
      - Competitive landscape
      - Business model and monetization
      - MVP features and prioritization
      - Go-to-market strategy
      Be supportive but challenging. Keep responses focused and concise (150-200 words).`,
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    });

    const reply = response.content[0].type === 'text' ? response.content[0].text : '';

    res.json({
      reply,
      tokensUsed: response.usage?.input_tokens + response.usage?.output_tokens || 0,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Brainstorm chat error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * 2. Ideafinder Generate Endpoint
 */
app.post('/api/ideafinder/generate', async (req, res) => {
  try {
    const { topic } = req.body;

    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: `Generate 3 innovative business ideas based on this topic: "${topic}"

For each idea, provide a JSON object with:
{
  "id": 1,
  "title": "Idea Title",
  "description": "2-3 sentence description",
  "scores": {
    "marketPotential": 8,
    "complexity": 6,
    "relevance": 8,
    "risk": 7,
    "value": 8
  },
  "highlights": ["Key insight 1", "Key insight 2"]
}

Return a valid JSON array with 3 ideas. Focus on practicality and innovation.`,
        },
      ],
    });

    let ideasText = response.content[0].text;
    // Extract JSON from markdown code blocks if present
    const jsonMatch = ideasText.match(/```json\n?([\s\S]*?)\n?```/);
    if (jsonMatch) {
      ideasText = jsonMatch[1];
    }

    const ideas = JSON.parse(ideasText);

    res.json({
      ideas: Array.isArray(ideas) ? ideas : [ideas],
      tokensUsed: response.usage?.input_tokens + response.usage?.output_tokens || 0,
    });
  } catch (error) {
    console.error('Generate ideas error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * 3. PRD Generate Endpoint
 */
app.post('/api/prd/generate', async (req, res) => {
  try {
    const { topic, chatHistory = [], selectedIdea = null } = req.body;

    const context = selectedIdea
      ? `Based on this business idea: ${selectedIdea.title}. ${selectedIdea.description}`
      : `Based on this topic/brainstorming: ${topic}`;

    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: `${context}

Create a comprehensive Product Requirements Document (PRD) with these sections:
1. Executive Summary
2. Vision & Goals
3. Target Users & Personas (2-3 personas)
4. Core Features (MVP - 5 main features)
5. Non-Functional Requirements (Performance, Security, Accessibility)
6. Technical Architecture (High-level overview)
7. Success Metrics & KPIs
8. Risk Analysis (3-5 risks + mitigation)
9. Development Timeline (4 phases)
10. Monetization Strategy

Format the response in clean Markdown. Make it specific and actionable.`,
        },
      ],
    });

    const prdContent = response.content[0].text;

    res.json({
      prdContent,
      tokensUsed: response.usage?.input_tokens + response.usage?.output_tokens || 0,
    });
  } catch (error) {
    console.error('Generate PRD error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * 4. PRD Optimize Endpoint
 */
app.post('/api/prd/optimize', async (req, res) => {
  try {
    const { prdContent, feedback } = req.body;

    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 3000,
      messages: [
        {
          role: 'user',
          content: `Here's the current PRD:

${prdContent}

User feedback: "${feedback}"

Update the PRD based on this feedback. Return the complete updated PRD in Markdown format.`,
        },
      ],
    });

    const updatedPRD = response.content[0].text;

    res.json({
      prdContent: updatedPRD,
      tokensUsed: response.usage?.input_tokens + response.usage?.output_tokens || 0,
    });
  } catch (error) {
    console.error('Optimize PRD error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * 5. Prototype Generate Endpoint
 */
app.post('/api/prototype/generate', async (req, res) => {
  try {
    const { prd, stylePreferences = {} } = req.body;

    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 8000,
      messages: [
        {
          role: 'user',
          content: `Based on this PRD, create a complete, production-ready HTML5 + CSS3 + JavaScript prototype.

PRD:
${prd}

Requirements:
1. Single HTML file with embedded CSS and JavaScript
2. Responsive design (Mobile 320px, Tablet 768px, Desktop 1024px+)
3. Modern, professional styling with gradient accents (#667eea → #764ba2)
4. Zero console errors
5. Accessibility (WCAG AA)
6. Best practices in HTML5 semantic structure
7. Include comments in code

Return ONLY the complete HTML code wrapped in \`\`\`html and \`\`\` blocks.`,
        },
      ],
    });

    let htmlCode = response.content[0].text;
    // Extract HTML from code blocks
    const htmlMatch = htmlCode.match(/```html\n?([\s\S]*?)\n?```/);
    if (htmlMatch) {
      htmlCode = htmlMatch[1];
    }

    res.json({
      html: htmlCode,
      tokensUsed: response.usage?.input_tokens + response.usage?.output_tokens || 0,
    });
  } catch (error) {
    console.error('Generate prototype error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * 6. Prototype Customize Endpoint
 */
app.post('/api/prototype/customize', async (req, res) => {
  try {
    const { prototypeCode, feedback } = req.body;

    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 6000,
      messages: [
        {
          role: 'user',
          content: `Here's the current HTML prototype:

\`\`\`html
${prototypeCode}
\`\`\`

User feedback: "${feedback}"

Update the prototype based on this feedback. Return ONLY the updated complete HTML code wrapped in \`\`\`html and \`\`\` blocks.`,
        },
      ],
    });

    let updatedCode = response.content[0].text;
    const htmlMatch = updatedCode.match(/```html\n?([\s\S]*?)\n?```/);
    if (htmlMatch) {
      updatedCode = htmlMatch[1];
    }

    res.json({
      html: updatedCode,
      tokensUsed: response.usage?.input_tokens + response.usage?.output_tokens || 0,
    });
  } catch (error) {
    console.error('Customize prototype error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Health Check
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Prototype Generator Backend running on http://localhost:${port}`);
  console.log(`API docs at http://localhost:${port}/api/health`);
});
