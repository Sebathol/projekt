import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Centralized API Service
 */
class APIService {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Brainstorming Chat
   */
  async brainstormChat(sessionId, message, chatHistory, topic) {
    try {
      const response = await this.client.post('/brainstorm/chat', {
        sessionId,
        message,
        chatHistory,
        topic,
      });
      return response.data;
    } catch (error) {
      console.error('Brainstorm chat error:', error);
      throw error;
    }
  }

  /**
   * Generate Ideas (Ideafinder)
   */
  async generateIdeas(topic) {
    try {
      const response = await this.client.post('/ideafinder/generate', {
        topic,
      });
      return response.data;
    } catch (error) {
      console.error('Generate ideas error:', error);
      throw error;
    }
  }

  /**
   * Generate PRD
   */
  async generatePRD(topic, chatHistory, selectedIdea = null) {
    try {
      const response = await this.client.post('/prd/generate', {
        topic,
        chatHistory,
        selectedIdea,
      });
      return response.data;
    } catch (error) {
      console.error('Generate PRD error:', error);
      throw error;
    }
  }

  /**
   * Optimize PRD
   */
  async optimizePRD(prdContent, feedback) {
    try {
      const response = await this.client.post('/prd/optimize', {
        prdContent,
        feedback,
      });
      return response.data;
    } catch (error) {
      console.error('Optimize PRD error:', error);
      throw error;
    }
  }

  /**
   * Generate Prototype
   */
  async generatePrototype(prd, stylePreferences = {}) {
    try {
      const response = await this.client.post('/prototype/generate', {
        prd,
        stylePreferences,
      });
      return response.data;
    } catch (error) {
      console.error('Generate prototype error:', error);
      throw error;
    }
  }

  /**
   * Customize Prototype
   */
  async customizePrototype(prototypeCode, feedback) {
    try {
      const response = await this.client.post('/prototype/customize', {
        prototypeCode,
        feedback,
      });
      return response.data;
    } catch (error) {
      console.error('Customize prototype error:', error);
      throw error;
    }
  }

  /**
   * Save Session
   */
  async saveSession(sessionData) {
    try {
      const response = await this.client.post('/session/save', sessionData);
      return response.data;
    } catch (error) {
      console.error('Save session error:', error);
      throw error;
    }
  }

  /**
   * Export Session
   */
  async exportSession(sessionId, format = 'json') {
    try {
      const response = await this.client.get(`/export/${sessionId}`, {
        params: { format },
        responseType: format === 'json' ? 'json' : 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Export session error:', error);
      throw error;
    }
  }
}

export default new APIService();
