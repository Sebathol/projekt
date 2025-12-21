import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireAuth } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /api/projects
 * Get all projects for authenticated user
 */
router.get('/', authenticateToken, requireAuth, async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: {
        userId: req.userId,
        isArchived: false,
      },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        mode: true,
        topic: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({ projects });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

/**
 * GET /api/projects/:id
 * Get specific project
 */
router.get('/:id', authenticateToken, requireAuth, async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: {
        brainstormingData: true,
        ideafinderData: true,
        sessions: true,
      },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check authorization
    if (project.userId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Parse JSON fields
    const parsed = {
      ...project,
      brainstormingData: project.brainstormingData ? {
        ...project.brainstormingData,
        chatHistory: JSON.parse(project.brainstormingData.chatHistory || '[]'),
        prdData: project.brainstormingData.prdData ? JSON.parse(project.brainstormingData.prdData) : null,
        prototypeData: project.brainstormingData.prototypeData ? JSON.parse(project.brainstormingData.prototypeData) : null,
      } : null,
      ideafinderData: project.ideafinderData ? {
        ...project.ideafinderData,
        generatedIdeas: JSON.parse(project.ideafinderData.generatedIdeas || '[]'),
        selectedIdea: project.ideafinderData.selectedIdea ? JSON.parse(project.ideafinderData.selectedIdea) : null,
        chatHistory: JSON.parse(project.ideafinderData.chatHistory || '[]'),
        prdData: project.ideafinderData.prdData ? JSON.parse(project.ideafinderData.prdData) : null,
        prototypeData: project.ideafinderData.prototypeData ? JSON.parse(project.ideafinderData.prototypeData) : null,
      } : null,
    };

    res.json({ project: parsed });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

/**
 * POST /api/projects
 * Create new project
 */
router.post('/', authenticateToken, requireAuth, apiLimiter, async (req, res) => {
  try {
    const { title, description, mode, topic } = req.body;

    if (!title || !mode || !topic) {
      return res.status(400).json({ error: 'Title, mode, and topic required' });
    }

    const project = await prisma.project.create({
      data: {
        userId: req.userId,
        title,
        description: description || '',
        mode,
        topic,
      },
    });

    res.status(201).json({ project });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

/**
 * PUT /api/projects/:id
 * Update project
 */
router.put('/:id', authenticateToken, requireAuth, async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.userId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { title, description, prdContent, prototypeHtml } = req.body;

    const updated = await prisma.project.update({
      where: { id: req.params.id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(prdContent && { prdContent }),
        ...(prototypeHtml && { prototypeHtml }),
      },
    });

    res.json({ project: updated });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

/**
 * POST /api/projects/:id/save-brainstorming
 * Save brainstorming session data
 */
router.post('/:id/save-brainstorming', authenticateToken, requireAuth, async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.userId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const {
      topic,
      chatHistory,
      prdData,
      prototypeData,
    } = req.body;

    // Upsert brainstorming data
    const data = await prisma.brainstormingData.upsert({
      where: { projectId: req.params.id },
      create: {
        projectId: req.params.id,
        topic,
        chatHistory: JSON.stringify(chatHistory || []),
        prdData: prdData ? JSON.stringify(prdData) : null,
        prototypeData: prototypeData ? JSON.stringify(prototypeData) : null,
      },
      update: {
        topic,
        chatHistory: JSON.stringify(chatHistory || []),
        prdData: prdData ? JSON.stringify(prdData) : null,
        prototypeData: prototypeData ? JSON.stringify(prototypeData) : null,
      },
    });

    res.json({ brainstormingData: data });
  } catch (error) {
    console.error('Save brainstorming error:', error);
    res.status(500).json({ error: 'Failed to save brainstorming data' });
  }
});

/**
 * POST /api/projects/:id/save-ideafinder
 * Save ideafinder session data
 */
router.post('/:id/save-ideafinder', authenticateToken, requireAuth, async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.userId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const {
      topic,
      generatedIdeas,
      selectedIdea,
      chatHistory,
      prdData,
      prototypeData,
    } = req.body;

    // Upsert ideafinder data
    const data = await prisma.ideafinderData.upsert({
      where: { projectId: req.params.id },
      create: {
        projectId: req.params.id,
        topic,
        generatedIdeas: JSON.stringify(generatedIdeas || []),
        selectedIdea: selectedIdea ? JSON.stringify(selectedIdea) : null,
        chatHistory: JSON.stringify(chatHistory || []),
        prdData: prdData ? JSON.stringify(prdData) : null,
        prototypeData: prototypeData ? JSON.stringify(prototypeData) : null,
      },
      update: {
        topic,
        generatedIdeas: JSON.stringify(generatedIdeas || []),
        selectedIdea: selectedIdea ? JSON.stringify(selectedIdea) : null,
        chatHistory: JSON.stringify(chatHistory || []),
        prdData: prdData ? JSON.stringify(prdData) : null,
        prototypeData: prototypeData ? JSON.stringify(prototypeData) : null,
      },
    });

    res.json({ ideafinderData: data });
  } catch (error) {
    console.error('Save ideafinder error:', error);
    res.status(500).json({ error: 'Failed to save ideafinder data' });
  }
});

/**
 * DELETE /api/projects/:id
 * Delete (archive) project
 */
router.delete('/:id', authenticateToken, requireAuth, async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.userId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updated = await prisma.project.update({
      where: { id: req.params.id },
      data: { isArchived: true },
    });

    res.json({ message: 'Project archived', project: updated });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

export default router;
