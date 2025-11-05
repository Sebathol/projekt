import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '../services/api';
import socketService from '../services/socket';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      // Login
      login: async (credentials) => {
        set({ loading: true, error: null });
        try {
          const response = await authAPI.login(credentials);
          const { user, accessToken, refreshToken } = response.data.data;

          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);

          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            loading: false,
          });

          // Connect socket
          socketService.connect(accessToken);

          return { success: true };
        } catch (error) {
          set({
            error: error.response?.data?.message || 'Login failed',
            loading: false,
          });
          return { success: false, error: error.response?.data?.message };
        }
      },

      // Register
      register: async (userData) => {
        set({ loading: true, error: null });
        try {
          const response = await authAPI.register(userData);
          const { user, accessToken, refreshToken } = response.data.data;

          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);

          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            loading: false,
          });

          // Connect socket
          socketService.connect(accessToken);

          return { success: true };
        } catch (error) {
          set({
            error: error.response?.data?.message || 'Registration failed',
            loading: false,
          });
          return { success: false, error: error.response?.data?.message };
        }
      },

      // Logout
      logout: async () => {
        try {
          await authAPI.logout();
        } catch (error) {
          console.error('Logout error:', error);
        }

        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        socketService.disconnect();

        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      // Get current user
      getCurrentUser: async () => {
        set({ loading: true });
        try {
          const response = await authAPI.getCurrentUser();
          const { user } = response.data.data;

          set({
            user,
            isAuthenticated: true,
            loading: false,
          });

          return { success: true };
        } catch (error) {
          set({
            error: error.response?.data?.message || 'Failed to get user',
            loading: false,
          });
          return { success: false };
        }
      },

      // Initialize auth from storage
      initAuth: async () => {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        if (accessToken && refreshToken) {
          set({ accessToken, refreshToken });
          const result = await get().getCurrentUser();

          if (result.success) {
            socketService.connect(accessToken);
          }
        }
      },

      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);

export default useAuthStore;
