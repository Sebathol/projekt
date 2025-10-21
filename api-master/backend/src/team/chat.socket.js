const { TeamMessage, TeamMember, User } = require('../../database/models');
const jwtService = require('../auth/jwt');

class ChatSocketService {
  constructor(io) {
    this.io = io;
    this.connectedUsers = new Map(); // userId -> socketId mapping
    this.setupSocketHandlers();
  }

  setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      console.log('New socket connection:', socket.id);

      // Authenticate socket connection
      socket.on('authenticate', async (data) => {
        try {
          const { token } = data;
          const decoded = jwtService.verifyToken(token);

          socket.userId = decoded.userId;
          this.connectedUsers.set(decoded.userId, socket.id);

          socket.emit('authenticated', { success: true });
          console.log(`User ${decoded.userId} authenticated on socket ${socket.id}`);
        } catch (error) {
          socket.emit('auth_error', { message: 'Authentication failed' });
          socket.disconnect();
        }
      });

      // Join team room
      socket.on('join_team', async (data) => {
        try {
          const { teamId } = data;

          // Verify user is member of team
          const membership = await TeamMember.findOne({
            where: {
              teamId,
              userId: socket.userId,
              status: 'active'
            }
          });

          if (!membership) {
            socket.emit('error', { message: 'Not a member of this team' });
            return;
          }

          socket.join(`team_${teamId}`);
          socket.currentTeam = teamId;

          // Load recent messages
          const recentMessages = await TeamMessage.findAll({
            where: { teamId },
            include: [
              {
                model: User,
                as: 'sender',
                attributes: ['id', 'firstName', 'lastName', 'email']
              }
            ],
            limit: 50,
            order: [['createdAt', 'DESC']]
          });

          socket.emit('joined_team', {
            teamId,
            messages: recentMessages.reverse()
          });

          // Notify other team members
          socket.to(`team_${teamId}`).emit('user_joined', {
            userId: socket.userId,
            timestamp: new Date()
          });

          console.log(`User ${socket.userId} joined team ${teamId}`);
        } catch (error) {
          console.error('Join team error:', error);
          socket.emit('error', { message: 'Failed to join team' });
        }
      });

      // Leave team room
      socket.on('leave_team', (data) => {
        const { teamId } = data;
        socket.leave(`team_${teamId}`);
        socket.to(`team_${teamId}`).emit('user_left', {
          userId: socket.userId,
          timestamp: new Date()
        });
      });

      // Send message
      socket.on('send_message', async (data) => {
        try {
          const { teamId, message, messageType, fileUrl, fileName, fileSize, mimeType, replyToId } = data;

          // Verify membership
          const membership = await TeamMember.findOne({
            where: {
              teamId,
              userId: socket.userId,
              status: 'active'
            }
          });

          if (!membership) {
            socket.emit('error', { message: 'Not authorized to send messages' });
            return;
          }

          // Create message
          const teamMessage = await TeamMessage.create({
            teamId,
            senderId: socket.userId,
            message,
            messageType: messageType || 'text',
            fileUrl,
            fileName,
            fileSize,
            mimeType,
            replyToId
          });

          // Load sender info
          const messageWithSender = await TeamMessage.findByPk(teamMessage.id, {
            include: [
              {
                model: User,
                as: 'sender',
                attributes: ['id', 'firstName', 'lastName', 'email']
              }
            ]
          });

          // Broadcast to team
          this.io.to(`team_${teamId}`).emit('new_message', messageWithSender);

          console.log(`Message sent to team ${teamId} by user ${socket.userId}`);
        } catch (error) {
          console.error('Send message error:', error);
          socket.emit('error', { message: 'Failed to send message' });
        }
      });

      // Mark messages as read
      socket.on('mark_read', async (data) => {
        try {
          const { messageIds } = data;

          for (const messageId of messageIds) {
            const message = await TeamMessage.findByPk(messageId);
            if (message && !message.readBy.includes(socket.userId)) {
              message.readBy.push(socket.userId);
              await message.save();
            }
          }

          socket.emit('marked_read', { messageIds });
        } catch (error) {
          console.error('Mark read error:', error);
        }
      });

      // Typing indicator
      socket.on('typing_start', (data) => {
        const { teamId } = data;
        socket.to(`team_${teamId}`).emit('user_typing', {
          userId: socket.userId,
          timestamp: new Date()
        });
      });

      socket.on('typing_stop', (data) => {
        const { teamId } = data;
        socket.to(`team_${teamId}`).emit('user_stopped_typing', {
          userId: socket.userId
        });
      });

      // Disconnect
      socket.on('disconnect', () => {
        this.connectedUsers.delete(socket.userId);
        console.log('Socket disconnected:', socket.id);
      });
    });
  }

  /**
   * Send notification to specific user
   */
  sendToUser(userId, event, data) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.io.to(socketId).emit(event, data);
    }
  }

  /**
   * Send notification to team
   */
  sendToTeam(teamId, event, data) {
    this.io.to(`team_${teamId}`).emit(event, data);
  }
}

module.exports = ChatSocketService;
