const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const TeamMessage = sequelize.define('TeamMessage', {
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
  senderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  messageType: {
    type: DataTypes.ENUM('text', 'file', 'image', 'code', 'system'),
    defaultValue: 'text'
  },
  fileUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fileName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fileSize: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  mimeType: {
    type: DataTypes.STRING,
    allowNull: true
  },
  replyToId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'team_messages',
      key: 'id'
    }
  },
  isEdited: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  editedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  readBy: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    defaultValue: []
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {}
  }
});

module.exports = TeamMessage;
