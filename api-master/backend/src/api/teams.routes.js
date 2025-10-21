const express = require('express');
const router = express.Router();
const { Team, TeamMember, User, TeamMessage } = require('../../database/models');
const { authenticate, requireSubscription, requirePlan } = require('../auth/middleware');
const { body, validationResult } = require('express-validator');

/**
 * @route   POST /api/teams
 * @desc    Create a new team
 * @access  Private (Ultimate/Enterprise only)
 */
router.post('/',
  authenticate,
  requireSubscription,
  requirePlan('ultimate', 'enterprise'),
  [
    body('name').trim().notEmpty(),
    body('description').optional().trim()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { name, description } = req.body;

      // Create team
      const team = await Team.create({
        ownerId: req.userId,
        name,
        description,
        subscriptionId: req.subscription.id,
        maxMembers: req.subscription.maxTeamMembers
      });

      // Add owner as team member
      await TeamMember.create({
        teamId: team.id,
        userId: req.userId,
        role: 'owner',
        status: 'active',
        joinedAt: new Date(),
        permissions: {
          canManageApis: true,
          canInviteMembers: true,
          canRemoveMembers: true,
          canViewAnalytics: true,
          canEditTeamSettings: true
        }
      });

      res.status(201).json({
        success: true,
        message: 'Team created successfully',
        data: { team }
      });
    } catch (error) {
      console.error('Create team error:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating team'
      });
    }
  }
);

/**
 * @route   GET /api/teams
 * @desc    Get user's teams
 * @access  Private
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const teams = await Team.findAll({
      include: [
        {
          model: TeamMember,
          as: 'members',
          where: { userId: req.userId, status: 'active' }
        }
      ]
    });

    res.json({
      success: true,
      data: { teams }
    });
  } catch (error) {
    console.error('Get teams error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching teams'
    });
  }
});

/**
 * @route   GET /api/teams/:id
 * @desc    Get team details
 * @access  Private
 */
router.get('/:id', authenticate, async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.id, {
      include: [
        {
          model: TeamMember,
          as: 'members',
          include: [{ model: User, as: 'user', attributes: ['id', 'email', 'firstName', 'lastName'] }]
        }
      ]
    });

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    // Check if user is a member
    const isMember = team.members.some(m => m.userId === req.userId);
    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: { team }
    });
  } catch (error) {
    console.error('Get team error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching team'
    });
  }
});

/**
 * @route   POST /api/teams/:id/invite
 * @desc    Invite user to team
 * @access  Private
 */
router.post('/:id/invite',
  authenticate,
  [body('email').isEmail().normalizeEmail()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const team = await Team.findByPk(req.params.id);

      if (!team) {
        return res.status(404).json({
          success: false,
          message: 'Team not found'
        });
      }

      // Check if user has permission to invite
      const inviterMember = await TeamMember.findOne({
        where: { teamId: team.id, userId: req.userId, status: 'active' }
      });

      if (!inviterMember || !inviterMember.permissions.canInviteMembers) {
        return res.status(403).json({
          success: false,
          message: 'No permission to invite members'
        });
      }

      // Check team capacity
      if (team.currentMembers >= team.maxMembers) {
        return res.status(403).json({
          success: false,
          message: 'Team is at maximum capacity'
        });
      }

      const { email } = req.body;

      // Find user by email
      const invitedUser = await User.findOne({ where: { email } });

      if (!invitedUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Check if already a member
      const existingMember = await TeamMember.findOne({
        where: { teamId: team.id, userId: invitedUser.id }
      });

      if (existingMember) {
        return res.status(400).json({
          success: false,
          message: 'User is already a member or has pending invitation'
        });
      }

      // Create invitation
      const teamMember = await TeamMember.create({
        teamId: team.id,
        userId: invitedUser.id,
        role: 'member',
        status: 'invited',
        invitedBy: req.userId,
        invitedAt: new Date()
      });

      // TODO: Send invitation email

      res.status(201).json({
        success: true,
        message: 'Invitation sent successfully',
        data: { teamMember }
      });
    } catch (error) {
      console.error('Invite member error:', error);
      res.status(500).json({
        success: false,
        message: 'Error inviting member'
      });
    }
  }
);

/**
 * @route   POST /api/teams/:id/join
 * @desc    Accept team invitation
 * @access  Private
 */
router.post('/:id/join', authenticate, async (req, res) => {
  try {
    const teamMember = await TeamMember.findOne({
      where: {
        teamId: req.params.id,
        userId: req.userId,
        status: 'invited'
      }
    });

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'No pending invitation found'
      });
    }

    teamMember.status = 'active';
    teamMember.joinedAt = new Date();
    await teamMember.save();

    // Update team member count
    const team = await Team.findByPk(req.params.id);
    team.currentMembers += 1;
    await team.save();

    res.json({
      success: true,
      message: 'Successfully joined team',
      data: { teamMember }
    });
  } catch (error) {
    console.error('Join team error:', error);
    res.status(500).json({
      success: false,
      message: 'Error joining team'
    });
  }
});

/**
 * @route   DELETE /api/teams/:teamId/members/:memberId
 * @desc    Remove team member
 * @access  Private
 */
router.delete('/:teamId/members/:memberId', authenticate, async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.teamId);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    // Check permissions
    const requesterMember = await TeamMember.findOne({
      where: { teamId: team.id, userId: req.userId, status: 'active' }
    });

    if (!requesterMember || !requesterMember.permissions.canRemoveMembers) {
      return res.status(403).json({
        success: false,
        message: 'No permission to remove members'
      });
    }

    // Find member to remove
    const memberToRemove = await TeamMember.findByPk(req.params.memberId);

    if (!memberToRemove || memberToRemove.teamId !== team.id) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    // Can't remove owner
    if (memberToRemove.role === 'owner') {
      return res.status(403).json({
        success: false,
        message: 'Cannot remove team owner'
      });
    }

    memberToRemove.status = 'removed';
    memberToRemove.isActive = false;
    await memberToRemove.save();

    // Update team member count
    team.currentMembers = Math.max(0, team.currentMembers - 1);
    await team.save();

    res.json({
      success: true,
      message: 'Member removed successfully'
    });
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing member'
    });
  }
});

module.exports = router;
