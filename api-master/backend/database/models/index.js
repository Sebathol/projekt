const User = require('./User');
const Subscription = require('./Subscription');
const ApiKey = require('./ApiKey');
const Team = require('./Team');
const TeamMember = require('./TeamMember');
const TeamMessage = require('./TeamMessage');

// Define relationships

// User - Subscription (One-to-Many)
User.hasMany(Subscription, { foreignKey: 'userId', as: 'subscriptions' });
Subscription.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User - ApiKey (One-to-Many)
User.hasMany(ApiKey, { foreignKey: 'userId', as: 'apiKeys' });
ApiKey.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User - Team (One-to-Many as owner)
User.hasMany(Team, { foreignKey: 'ownerId', as: 'ownedTeams' });
Team.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

// Team - Subscription (One-to-One)
Team.belongsTo(Subscription, { foreignKey: 'subscriptionId', as: 'subscription' });
Subscription.hasOne(Team, { foreignKey: 'subscriptionId', as: 'team' });

// Team - TeamMember (One-to-Many)
Team.hasMany(TeamMember, { foreignKey: 'teamId', as: 'members' });
TeamMember.belongsTo(Team, { foreignKey: 'teamId', as: 'team' });

// User - TeamMember (One-to-Many)
User.hasMany(TeamMember, { foreignKey: 'userId', as: 'teamMemberships' });
TeamMember.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Team - TeamMessage (One-to-Many)
Team.hasMany(TeamMessage, { foreignKey: 'teamId', as: 'messages' });
TeamMessage.belongsTo(Team, { foreignKey: 'teamId', as: 'team' });

// User - TeamMessage (One-to-Many)
User.hasMany(TeamMessage, { foreignKey: 'senderId', as: 'sentMessages' });
TeamMessage.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });

// TeamMessage - TeamMessage (Self-referencing for replies)
TeamMessage.belongsTo(TeamMessage, { foreignKey: 'replyToId', as: 'replyTo' });
TeamMessage.hasMany(TeamMessage, { foreignKey: 'replyToId', as: 'replies' });

module.exports = {
  User,
  Subscription,
  ApiKey,
  Team,
  TeamMember,
  TeamMessage
};
