import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retried, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken } = response.data.data;
          localStorage.setItem('accessToken', accessToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed, logout user
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
  refreshToken: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
};

// API Keys API
export const apiKeysAPI = {
  getAll: () => api.get('/keys'),
  getById: (id) => api.get(`/keys/${id}`),
  create: (data) => api.post('/keys', data),
  update: (id, data) => api.put(`/keys/${id}`, data),
  delete: (id) => api.delete(`/keys/${id}`),
  switchEnvironment: (id, environment) =>
    api.put(`/keys/${id}/environment`, { environment }),
  rotateProxy: (id) => api.post(`/keys/${id}/rotate`),
  getUsage: (id) => api.get(`/keys/${id}/usage`),
};

// Subscriptions API
export const subscriptionsAPI = {
  getAll: () => api.get('/subscriptions'),
  getActive: () => api.get('/subscriptions/active'),
  getPlans: () => api.get('/subscriptions/plans'),
  create: (data) => api.post('/subscriptions/create', data),
  cancel: (id) => api.post(`/subscriptions/${id}/cancel`),
  upgrade: (id, newPlan) => api.post(`/subscriptions/${id}/upgrade`, { newPlan }),
};

// Teams API
export const teamsAPI = {
  getAll: () => api.get('/teams'),
  getById: (id) => api.get(`/teams/${id}`),
  create: (data) => api.post('/teams', data),
  update: (id, data) => api.put(`/teams/${id}`, data),
  delete: (id) => api.delete(`/teams/${id}`),
  invite: (id, email) => api.post(`/teams/${id}/invite`, { email }),
  join: (id) => api.post(`/teams/${id}/join`),
  removeMember: (teamId, memberId) =>
    api.delete(`/teams/${teamId}/members/${memberId}`),
};

export default api;
