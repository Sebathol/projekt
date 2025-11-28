import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Anthropic } from '@anthropic-ai/sdk';
import { PrismaClient } from '@prisma/client';

// Route imports
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';

// Middleware imports
import { globalLimiter, authLimiter, apiLimiter, aiLimiter } from './middleware/rateLimiter.js';
import { authenticateToken, optionalAuth, requireAuth } from './middleware/auth.js';

// Utility imports
import {
  extractTokenUsage,
  calculateCost,
  getRemainingQuota,
  isQuotaExceeded,
} from './utils/costTracking.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Initialize Prisma and Claude
const prisma = new PrismaClient();
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());
app.use(globalLimiter); // Apply global rate limiter

// ===== ROUTES =====

/**
 * Health Check
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/**
 * Authentication Routes
 */
app.use('/api/auth', authRoutes);

/**
 * Project Routes (requires authentication)
 */
app.use('/api/projects', projectRoutes);

/**
 * Cost/Quota Endpoints
 */

// GET /api/quota
// Get user's current quota and usage
app.get('/api/quota', authenticateToken, requireAuth, async (req, res) => {
  try {
    const quota = await prisma.userQuota.findUnique({
      where: { userId: req.userId },
    });

    if (!quota) {
      return res.status(404).json({ error: 'Quota not found' });
    }

    const remaining = getRemainingQuota(quota);

    res.json({
      quota: {
        monthlyTokenLimit: quota.monthlyTokenLimit,
        tokensUsedThisMonth: quota.tokensUsedThisMonth,
        tokensRemaining: remaining.tokensRemaining,
        monthlyBudgetLimit: quota.monthlyBudgetLimit,
        spentThisMonth: quota.spentThisMonth,
        budgetRemaining: remaining.budgetRemaining,
        resetDate: quota.resetDate,
        percentTokensUsed: remaining.percentTokensUsed,
        percentBudgetUsed: remaining.percentBudgetUsed,
      },
    });
  } catch (error) {
    console.error('Get quota error:', error);
    res.status(500).json({ error: 'Failed to fetch quota' });
  }
});

/**
 * AI Generation Endpoints
 */

/**
 * 1. Brainstorming Chat Endpoint
 */
app.post('/api/brainstorm/chat', authenticateToken, requireAuth, aiLimiter, async (req, res) => {
  try {
    const { message, chatHistory = [], topic, projectId } = req.body;

    // Check quota
    const quota = await prisma.userQuota.findUnique({
      where: { userId: req.userId },
    });

    // Estimate cost before calling API
    const estimatedInputTokens = Math.ceil(message.length / 4) + Math.ceil(topic.length / 4);
    const estimatedOutputTokens = 500; // Rough estimate
    const estimatedCost = calculateCost(estimatedInputTokens, estimatedOutputTokens);

    const quotaCheck = isQuotaExceeded(quota, estimatedInputTokens + estimatedOutputTokens, estimatedCost.totalCost);
    if (quotaCheck.exceeded) {
      return res.status(429).json({
        error: quotaCheck.budgetExceeded ? 'Budget exceeded' : 'Token limit exceeded',
        quota: {
          tokensRemaining: quota.monthlyTokenLimit - quota.tokensUsedThisMonth,
          budgetRemaining: quota.monthlyBudgetLimit - quota.spentThisMonth,
        },
      });
    }

    // Build conversation history for Claude
    const messages = chatHistory.map((msg) => ({
      role: msg.sender === 'ai' ? 'assistant' : 'user',
      content: msg.message,
    }));

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
      messages,
    });

    const aiResponse = response.content[0].text;
    const usage = extractTokenUsage(response);
    const cost = calculateCost(usage.inputTokens, usage.outputTokens);

    // Update quota
    await prisma.userQuota.update({
      where: { userId: req.userId },
      data: {
        tokensUsedThisMonth: { increment: usage.totalTokens },
        spentThisMonth: { increment: cost.totalCost },
      },
    });

    // Log session if projectId provided
    if (projectId) {
      await prisma.session.create({
        data: {
          userId: req.userId,
          projectId,
          sessionType: 'brainstorm-chat',
          inputTokens: usage.inputTokens,
          outputTokens: usage.outputTokens,
          totalTokens: usage.totalTokens,
          estimatedCost: cost.totalCost,
        },
      });

      await prisma.costLog.create({
        data: {
          userId: req.userId,
          sessionId: (await prisma.session.findFirst({
            where: { projectId, userId: req.userId },
            orderBy: { createdAt: 'desc' },
          })).id,
          inputTokens: usage.inputTokens,
          outputTokens: usage.outputTokens,
          totalTokens: usage.totalTokens,
          inputCost: cost.inputCost,
          outputCost: cost.outputCost,
          totalCost: cost.totalCost,
        },
      });
    }

    res.json({
      reply: aiResponse,
      tokensUsed: usage.totalTokens,
      cost: cost.totalCost,
      quotaRemaining: {
        tokens: quota.monthlyTokenLimit - quota.tokensUsedThisMonth - usage.totalTokens,
        budget: quota.monthlyBudgetLimit - quota.spentThisMonth - cost.totalCost,
      },
    });
  } catch (error) {
    console.error('Brainstorm chat error:', error);
    res.status(500).json({ error: 'Failed to process request', details: error.message });
  }
});

/**
 * 2. Ideafinder Generate Ideas
 */
app.post('/api/ideafinder/generate', authenticateToken, requireAuth, aiLimiter, async (req, res) => {
  try {
    const { topic, projectId } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic required' });
    }

    // Check quota
    const quota = await prisma.userQuota.findUnique({
      where: { userId: req.userId },
    });

    const estimatedTokens = 3000; // Rough estimate for idea generation
    const estimatedCost = calculateCost(estimatedTokens * 0.3, estimatedTokens * 0.7);

    const quotaCheck = isQuotaExceeded(quota, estimatedTokens, estimatedCost.totalCost);
    if (quotaCheck.exceeded) {
      return res.status(429).json({
        error: quotaCheck.budgetExceeded ? 'Budget exceeded' : 'Token limit exceeded',
      });
    }

    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      system: `You are an expert business innovator and strategist.
Generate 3 innovative, realistic business ideas based on the given topic/market segment.
Return ONLY valid JSON (no markdown, no extra text) with this exact structure:
[
  {
    "id": 1,
    "title": "Idea Title",
    "description": "2-3 sentence description",
    "scores": {
      "marketPotential": 8,
      "complexity": 5,
      "relevance": 9,
      "risk": 6,
      "value": 8
    },
    "highlights": ["highlight1", "highlight2", "highlight3"]
  }
]
Each score should be 1-10. Be realistic and balanced.`,
      messages: [
        {
          role: 'user',
          content: `Generate 3 business ideas for: ${topic}`,
        },
      ],
    });

    const responseText = response.content[0].text;
    let ideas;

    try {
      ideas = JSON.parse(responseText);
    } catch (parseError) {
      // Try to extract JSON from response
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        ideas = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Could not parse ideas from response');
      }
    }

    const usage = extractTokenUsage(response);
    const cost = calculateCost(usage.inputTokens, usage.outputTokens);

    // Update quota
    await prisma.userQuota.update({
      where: { userId: req.userId },
      data: {
        tokensUsedThisMonth: { increment: usage.totalTokens },
        spentThisMonth: { increment: cost.totalCost },
      },
    });

    // Log session
    if (projectId) {
      const session = await prisma.session.create({
        data: {
          userId: req.userId,
          projectId,
          sessionType: 'ideafinder-generate',
          inputTokens: usage.inputTokens,
          outputTokens: usage.outputTokens,
          totalTokens: usage.totalTokens,
          estimatedCost: cost.totalCost,
        },
      });

      await prisma.costLog.create({
        data: {
          userId: req.userId,
          sessionId: session.id,
          inputTokens: usage.inputTokens,
          outputTokens: usage.outputTokens,
          totalTokens: usage.totalTokens,
          inputCost: cost.inputCost,
          outputCost: cost.outputCost,
          totalCost: cost.totalCost,
        },
      });
    }

    res.json({
      ideas,
      tokensUsed: usage.totalTokens,
      cost: cost.totalCost,
    });
  } catch (error) {
    console.error('Ideas generation error:', error);
    res.status(500).json({ error: 'Failed to generate ideas', details: error.message });
  }
});

/**
 * 3. PRD Generation
 */
app.post('/api/prd/generate', authenticateToken, requireAuth, aiLimiter, async (req, res) => {
  try {
    const { topic, chatHistory = [], selectedIdea, projectId } = req.body;

    const quota = await prisma.userQuota.findUnique({
      where: { userId: req.userId },
    });

    const estimatedTokens = 4000;
    const estimatedCost = calculateCost(estimatedTokens * 0.3, estimatedTokens * 0.7);

    const quotaCheck = isQuotaExceeded(quota, estimatedTokens, estimatedCost.totalCost);
    if (quotaCheck.exceeded) {
      return res.status(429).json({ error: 'Quota exceeded' });
    }

    const context = selectedIdea
      ? `Selected Idea: ${selectedIdea.title}\n${selectedIdea.description}`
      : `Topic: ${topic}`;

    const chatContext = chatHistory.map((msg) => `${msg.sender}: ${msg.message}`).join('\n');

    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 3000,
      system: `You are an expert product manager and business strategist.
Create a comprehensive Product Requirements Document (PRD) in markdown format.
Include these 10 sections:
1. Executive Summary
2. Vision & Goals
3. Target Personas
4. Feature List (prioritized)
5. Technical Requirements
6. Architecture Overview
7. Success Metrics & KPIs
8. Risk Analysis & Mitigation
9. Implementation Timeline
10. Monetization Strategy

Be detailed, practical, and use proper markdown formatting.`,
      messages: [
        {
          role: 'user',
          content: `Context:\n${context}\n\nChat History:\n${chatContext}\n\nCreate a detailed PRD for this business idea.`,
        },
      ],
    });

    const prdContent = response.content[0].text;
    const usage = extractTokenUsage(response);
    const cost = calculateCost(usage.inputTokens, usage.outputTokens);

    await prisma.userQuota.update({
      where: { userId: req.userId },
      data: {
        tokensUsedThisMonth: { increment: usage.totalTokens },
        spentThisMonth: { increment: cost.totalCost },
      },
    });

    if (projectId) {
      const session = await prisma.session.create({
        data: {
          userId: req.userId,
          projectId,
          sessionType: 'prd-generate',
          inputTokens: usage.inputTokens,
          outputTokens: usage.outputTokens,
          totalTokens: usage.totalTokens,
          estimatedCost: cost.totalCost,
        },
      });

      await prisma.costLog.create({
        data: {
          userId: req.userId,
          sessionId: session.id,
          inputTokens: usage.inputTokens,
          outputTokens: usage.outputTokens,
          totalTokens: usage.totalTokens,
          inputCost: cost.inputCost,
          outputCost: cost.outputCost,
          totalCost: cost.totalCost,
        },
      });
    }

    res.json({ prdContent, tokensUsed: usage.totalTokens, cost: cost.totalCost });
  } catch (error) {
    console.error('PRD generation error:', error);
    res.status(500).json({ error: 'Failed to generate PRD' });
  }
});

/**
 * 4. PRD Optimization
 */
app.post('/api/prd/optimize', authenticateToken, requireAuth, aiLimiter, async (req, res) => {
  try {
    const { prdContent, feedback, projectId } = req.body;

    if (!prdContent || !feedback) {
      return res.status(400).json({ error: 'PRD content and feedback required' });
    }

    const quota = await prisma.userQuota.findUnique({
      where: { userId: req.userId },
    });

    const estimatedTokens = 3000;
    const estimatedCost = calculateCost(estimatedTokens * 0.3, estimatedTokens * 0.7);

    const quotaCheck = isQuotaExceeded(quota, estimatedTokens, estimatedCost.totalCost);
    if (quotaCheck.exceeded) {
      return res.status(429).json({ error: 'Quota exceeded' });
    }

    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 3000,
      messages: [
        {
          role: 'user',
          content: `Here's a PRD:\n${prdContent}\n\nUser feedback:\n${feedback}\n\nPlease update the PRD based on this feedback. Return only the updated PRD in markdown format.`,
        },
      ],
    });

    const updatedPRD = response.content[0].text;
    const usage = extractTokenUsage(response);
    const cost = calculateCost(usage.inputTokens, usage.outputTokens);

    await prisma.userQuota.update({
      where: { userId: req.userId },
      data: {
        tokensUsedThisMonth: { increment: usage.totalTokens },
        spentThisMonth: { increment: cost.totalCost },
      },
    });

    if (projectId) {
      await prisma.session.create({
        data: {
          userId: req.userId,
          projectId,
          sessionType: 'prd-optimize',
          inputTokens: usage.inputTokens,
          outputTokens: usage.outputTokens,
          totalTokens: usage.totalTokens,
          estimatedCost: cost.totalCost,
        },
      });
    }

    res.json({ prdContent: updatedPRD, tokensUsed: usage.totalTokens, cost: cost.totalCost });
  } catch (error) {
    console.error('PRD optimization error:', error);
    res.status(500).json({ error: 'Failed to optimize PRD' });
  }
});

/**
 * 5. Prototype Generation
 */
app.post('/api/prototype/generate', authenticateToken, requireAuth, aiLimiter, async (req, res) => {
  try {
    const { prd, stylePreferences = {}, projectId } = req.body;

    if (!prd) {
      return res.status(400).json({ error: 'PRD required' });
    }

    const quota = await prisma.userQuota.findUnique({
      where: { userId: req.userId },
    });

    const estimatedTokens = 5000;
    const estimatedCost = calculateCost(estimatedTokens * 0.3, estimatedTokens * 0.7);

    const quotaCheck = isQuotaExceeded(quota, estimatedTokens, estimatedCost.totalCost);
    if (quotaCheck.exceeded) {
      return res.status(429).json({ error: 'Quota exceeded' });
    }

    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      system: `You are an expert frontend developer and UI designer.
Create a single, production-ready HTML file with embedded CSS and JavaScript.
Requirements:
- Single HTML file only (no external files)
- Responsive design (320px to 1920px+)
- Modern, professional styling with gradients
- Clean, semantic HTML5
- Accessible (WCAG AA standard)
- No console errors
- Self-contained (no CDN dependencies if possible, use HTML5 features)
- Code comments explaining key sections

Return ONLY the complete HTML code in a code block (```html...```).
No explanations or markdown outside the code block.`,
      messages: [
        {
          role: 'user',
          content: `Based on this PRD, create a landing/demo page HTML prototype:\n\n${prd}${
            Object.keys(stylePreferences).length > 0
              ? `\n\nStyle preferences: ${JSON.stringify(stylePreferences)}`
              : ''
          }`,
        },
      ],
    });

    const responseText = response.content[0].text;
    const htmlMatch = responseText.match(/```html\s*([\s\S]*?)\s*```/);
    const html = htmlMatch ? htmlMatch[1] : responseText;

    const usage = extractTokenUsage(response);
    const cost = calculateCost(usage.inputTokens, usage.outputTokens);

    await prisma.userQuota.update({
      where: { userId: req.userId },
      data: {
        tokensUsedThisMonth: { increment: usage.totalTokens },
        spentThisMonth: { increment: cost.totalCost },
      },
    });

    if (projectId) {
      await prisma.session.create({
        data: {
          userId: req.userId,
          projectId,
          sessionType: 'prototype-generate',
          inputTokens: usage.inputTokens,
          outputTokens: usage.outputTokens,
          totalTokens: usage.totalTokens,
          estimatedCost: cost.totalCost,
        },
      });
    }

    res.json({ html, tokensUsed: usage.totalTokens, cost: cost.totalCost });
  } catch (error) {
    console.error('Prototype generation error:', error);
    res.status(500).json({ error: 'Failed to generate prototype' });
  }
});

/**
 * 6. Prototype Customization
 */
app.post('/api/prototype/customize', authenticateToken, requireAuth, aiLimiter, async (req, res) => {
  try {
    const { prototypeCode, feedback, projectId } = req.body;

    if (!prototypeCode || !feedback) {
      return res.status(400).json({ error: 'Prototype code and feedback required' });
    }

    const quota = await prisma.userQuota.findUnique({
      where: { userId: req.userId },
    });

    const estimatedTokens = 3000;
    const estimatedCost = calculateCost(estimatedTokens * 0.3, estimatedTokens * 0.7);

    const quotaCheck = isQuotaExceeded(quota, estimatedTokens, estimatedCost.totalCost);
    if (quotaCheck.exceeded) {
      return res.status(429).json({ error: 'Quota exceeded' });
    }

    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      system: `You are an expert frontend developer.
Update the HTML prototype based on the user's feedback.
Return ONLY the complete updated HTML code in a code block (```html...```).
No explanations outside the code block.`,
      messages: [
        {
          role: 'user',
          content: `Here's the current prototype:\n\`\`\`html\n${prototypeCode}\n\`\`\`\n\nFeedback: ${feedback}\n\nPlease update the prototype accordingly.`,
        },
      ],
    });

    const responseText = response.content[0].text;
    const htmlMatch = responseText.match(/```html\s*([\s\S]*?)\s*```/);
    const updatedHtml = htmlMatch ? htmlMatch[1] : responseText;

    const usage = extractTokenUsage(response);
    const cost = calculateCost(usage.inputTokens, usage.outputTokens);

    await prisma.userQuota.update({
      where: { userId: req.userId },
      data: {
        tokensUsedThisMonth: { increment: usage.totalTokens },
        spentThisMonth: { increment: cost.totalCost },
      },
    });

    if (projectId) {
      await prisma.session.create({
        data: {
          userId: req.userId,
          projectId,
          sessionType: 'prototype-customize',
          inputTokens: usage.inputTokens,
          outputTokens: usage.outputTokens,
          totalTokens: usage.totalTokens,
          estimatedCost: cost.totalCost,
        },
      });
    }

    res.json({ html: updatedHtml, tokensUsed: usage.totalTokens, cost: cost.totalCost });
  } catch (error) {
    console.error('Prototype customization error:', error);
    res.status(500).json({ error: 'Failed to customize prototype' });
  }
});

// ===== ERROR HANDLING =====
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// ===== START SERVER =====
app.listen(port, () => {
  console.log(`🚀 Prototype Generator Backend running on http://localhost:${port}`);
  console.log(`📊 API docs at http://localhost:${port}/api/health`);
  console.log(`🔐 Auth endpoints: /api/auth/*`);
  console.log(`📁 Project endpoints: /api/projects/*`);
  console.log(`🤖 AI endpoints: /api/brainstorm/*, /api/ideafinder/*, /api/prd/*, /api/prototype/*`);
});

// ===== GRACEFUL SHUTDOWN =====
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

export default app;
