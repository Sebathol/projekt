const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const TeamMember = sequelize.define('TeamMember', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  teamId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'teams',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  role: {
    type: DataTypes.ENUM('owner', 'admin', 'member', 'viewer'),
    defaultValue: 'member'
  },
  permissions: {
    type: DataTypes.JSONB,
    defaultValue: {
      canManageApis: true,
      canInviteMembers: false,
      canRemoveMembers: false,
      canViewAnalytics: true,
      canEditTeamSettings: false
    }
  },
  invitedBy: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  invitedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  joinedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('invited', 'active', 'suspended', 'removed'),
    defaultValue: 'active'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

module.exports = TeamMember;
