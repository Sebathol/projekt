/**
 * Project Service
 * Handles project CRUD operations and persistence
 */

import authService from './authService.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class ProjectService {
  /**
   * Get all user projects
   */
  async getProjects() {
    try {
      const response = await fetch(`${API_URL}/api/projects`, {
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      return await response.json();
    } catch (error) {
      console.error('Get projects error:', error);
      throw error;
    }
  }

  /**
   * Get specific project
   */
  async getProject(projectId) {
    try {
      const response = await fetch(`${API_URL}/api/projects/${projectId}`, {
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch project');
      }

      return await response.json();
    } catch (error) {
      console.error('Get project error:', error);
      throw error;
    }
  }

  /**
   * Create new project
   */
  async createProject(title, description, mode, topic) {
    try {
      const response = await fetch(`${API_URL}/api/projects`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, mode, topic }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create project');
      }

      return await response.json();
    } catch (error) {
      console.error('Create project error:', error);
      throw error;
    }
  }

  /**
   * Update project
   */
  async updateProject(projectId, updates) {
    try {
      const response = await fetch(`${API_URL}/api/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update project');
      }

      return await response.json();
    } catch (error) {
      console.error('Update project error:', error);
      throw error;
    }
  }

  /**
   * Save brainstorming session
   */
  async saveBrainstormingSession(projectId, topic, chatHistory, prdData, prototypeData) {
    try {
      const response = await fetch(`${API_URL}/api/projects/${projectId}/save-brainstorming`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          chatHistory,
          prdData,
          prototypeData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save brainstorming session');
      }

      return await response.json();
    } catch (error) {
      console.error('Save brainstorming error:', error);
      throw error;
    }
  }

  /**
   * Save ideafinder session
   */
  async saveIdeafinderSession(
    projectId,
    topic,
    generatedIdeas,
    selectedIdea,
    chatHistory,
    prdData,
    prototypeData
  ) {
    try {
      const response = await fetch(`${API_URL}/api/projects/${projectId}/save-ideafinder`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          generatedIdeas,
          selectedIdea,
          chatHistory,
          prdData,
          prototypeData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save ideafinder session');
      }

      return await response.json();
    } catch (error) {
      console.error('Save ideafinder error:', error);
      throw error;
    }
  }

  /**
   * Delete (archive) project
   */
  async deleteProject(projectId) {
    try {
      const response = await fetch(`${API_URL}/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete project');
      }

      return await response.json();
    } catch (error) {
      console.error('Delete project error:', error);
      throw error;
    }
  }
}

export default new ProjectService();
