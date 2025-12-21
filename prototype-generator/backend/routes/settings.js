/**
 * Settings Routes - Account settings, API keys, notifications
 */

import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireAuth } from '../middleware/auth.js';
import { hashPassword, comparePassword } from '../utils/auth.js';
import crypto from 'crypto';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * PUT /api/settings/profile
 * Update user profile (avatar, bio)
 */
router.put('/profile', authenticateToken, requireAuth, async (req, res) => {
  try {
    const { avatar, bio, name } = req.body;

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: {
        ...(avatar && { avatar }),
        ...(bio && { bio }),
        ...(name && { name }),
      },
    });

    res.json({ user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

/**
 * PUT /api/settings/password
 * Change user password
 */
router.put('/password', authenticateToken, requireAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Old and new password required' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    const passwordMatch = await comparePassword(oldPassword, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const hashedPassword = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: req.userId },
      data: { password: hashedPassword },
    });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

/**
 * GET /api/settings/notifications
 * Get notification settings
 */
router.get('/notifications', authenticateToken, requireAuth, async (req, res) => {
  try {
    const settings = await prisma.notificationSettings.findUnique({
      where: { userId: req.userId },
    });

    res.json({ settings });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

/**
 * PUT /api/settings/notifications
 * Update notification settings
 */
router.put('/notifications', authenticateToken, requireAuth, async (req, res) => {
  try {
    const {
      emailOnComplete,
      emailOnQuotaWarning,
      emailOnBilling,
      emailWeeklyDigest,
    } = req.body;

    const settings = await prisma.notificationSettings.upsert({
      where: { userId: req.userId },
      create: {
        userId: req.userId,
        emailOnComplete: emailOnComplete ?? true,
        emailOnQuotaWarning: emailOnQuotaWarning ?? true,
        emailOnBilling: emailOnBilling ?? true,
        emailWeeklyDigest: emailWeeklyDigest ?? false,
      },
      update: {
        ...(emailOnComplete !== undefined && { emailOnComplete }),
        ...(emailOnQuotaWarning !== undefined && { emailOnQuotaWarning }),
        ...(emailOnBilling !== undefined && { emailOnBilling }),
        ...(emailWeeklyDigest !== undefined && { emailWeeklyDigest }),
      },
    });

    res.json({ settings });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

/**
 * POST /api/settings/api-keys
 * Generate new API key
 */
router.post('/api-keys', authenticateToken, requireAuth, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'API key name required' });
    }

    const rawKey = crypto.randomBytes(32).toString('hex');
    const hashedKey = crypto.createHash('sha256').update(rawKey).digest('hex');

    const apiKey = await prisma.aPIKey.create({
      data: {
        userId: req.userId,
        name,
        key: hashedKey,
      },
    });

    res.status(201).json({
      apiKey: {
        id: apiKey.id,
        name: apiKey.name,
        key: rawKey, // Send unhashed key only once
        isActive: apiKey.isActive,
        createdAt: apiKey.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create API key' });
  }
});

/**
 * GET /api/settings/api-keys
 * Get all API keys for user
 */
router.get('/api-keys', authenticateToken, requireAuth, async (req, res) => {
  try {
    const apiKeys = await prisma.aPIKey.findMany({
      where: { userId: req.userId },
      select: {
        id: true,
        name: true,
        isActive: true,
        lastUsed: true,
        createdAt: true,
      },
    });

    res.json({ apiKeys });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch API keys' });
  }
});

/**
 * DELETE /api/settings/api-keys/:id
 * Revoke API key
 */
router.delete('/api-keys/:id', authenticateToken, requireAuth, async (req, res) => {
  try {
    await prisma.aPIKey.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'API key revoked' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to revoke API key' });
  }
});

export default router;
