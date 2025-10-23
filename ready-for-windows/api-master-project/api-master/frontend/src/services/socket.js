import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.listeners = new Map();
  }

  connect(token) {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
      this.connected = true;

      // Authenticate
      this.socket.emit('authenticate', { token });
    });

    this.socket.on('authenticated', (data) => {
      console.log('Socket authenticated:', data);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      this.connected = false;
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  // Team Chat Methods
  joinTeam(teamId) {
    if (!this.socket) return;
    this.socket.emit('join_team', { teamId });
  }

  leaveTeam(teamId) {
    if (!this.socket) return;
    this.socket.emit('leave_team', { teamId });
  }

  sendMessage(teamId, message, messageType = 'text', fileData = {}) {
    if (!this.socket) return;
    this.socket.emit('send_message', {
      teamId,
      message,
      messageType,
      ...fileData,
    });
  }

  markAsRead(messageIds) {
    if (!this.socket) return;
    this.socket.emit('mark_read', { messageIds });
  }

  startTyping(teamId) {
    if (!this.socket) return;
    this.socket.emit('typing_start', { teamId });
  }

  stopTyping(teamId) {
    if (!this.socket) return;
    this.socket.emit('typing_stop', { teamId });
  }

  // Event listeners
  on(event, callback) {
    if (!this.socket) return;

    this.socket.on(event, callback);

    // Store listener for cleanup
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (!this.socket) return;

    this.socket.off(event, callback);

    // Remove from stored listeners
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  removeAllListeners(event) {
    if (!this.socket) return;

    if (event) {
      this.socket.removeAllListeners(event);
      this.listeners.delete(event);
    } else {
      this.socket.removeAllListeners();
      this.listeners.clear();
    }
  }
}

export default new SocketService();
