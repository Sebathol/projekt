import { create } from 'zustand';
import { apiKeysAPI } from '../services/api';

const useApiKeysStore = create((set, get) => ({
  apiKeys: [],
  currentApiKey: null,
  loading: false,
  error: null,

  // Fetch all API keys
  fetchApiKeys: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiKeysAPI.getAll();
      set({
        apiKeys: response.data.data.apiKeys,
        loading: false,
      });
      return { success: true };
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch API keys',
        loading: false,
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  // Fetch single API key
  fetchApiKey: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await apiKeysAPI.getById(id);
      set({
        currentApiKey: response.data.data.apiKey,
        loading: false,
      });
      return { success: true, data: response.data.data.apiKey };
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch API key',
        loading: false,
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  // Create API key
  createApiKey: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await apiKeysAPI.create(data);
      const newKey = response.data.data;

      set((state) => ({
        apiKeys: [newKey, ...state.apiKeys],
        loading: false,
      }));

      return { success: true, data: newKey };
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to create API key',
        loading: false,
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  // Switch environment
  switchEnvironment: async (id, environment) => {
    set({ loading: true, error: null });
    try {
      await apiKeysAPI.switchEnvironment(id, environment);

      set((state) => ({
        apiKeys: state.apiKeys.map((key) =>
          key.id === id ? { ...key, environment } : key
        ),
        loading: false,
      }));

      return { success: true };
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to switch environment',
        loading: false,
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  // Rotate proxy key
  rotateProxyKey: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await apiKeysAPI.rotateProxy(id);
      const { newProxyKey } = response.data.data;

      set((state) => ({
        apiKeys: state.apiKeys.map((key) =>
          key.id === id ? { ...key, proxyKey: newProxyKey } : key
        ),
        loading: false,
      }));

      return { success: true, data: response.data.data };
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to rotate proxy key',
        loading: false,
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  // Delete API key
  deleteApiKey: async (id) => {
    set({ loading: true, error: null });
    try {
      await apiKeysAPI.delete(id);

      set((state) => ({
        apiKeys: state.apiKeys.filter((key) => key.id !== id),
        loading: false,
      }));

      return { success: true };
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to delete API key',
        loading: false,
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  // Get usage statistics
  getUsageStats: async (id) => {
    try {
      const response = await apiKeysAPI.getUsage(id);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to get usage stats',
      };
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useApiKeysStore;
