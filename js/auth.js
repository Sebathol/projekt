/**
 * Authentication Module (Client-Side)
 * Handles login, registration, and token management
 */

const Auth = {
  // Get token from localStorage
  getToken() {
    return localStorage.getItem('auth_token');
  },

  // Save token to localStorage
  setToken(token) {
    localStorage.setItem('auth_token', token);
  },

  // Remove token
  removeToken() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('subscription_data');
  },

  // Get user data
  getUserData() {
    const data = localStorage.getItem('user_data');
    return data ? JSON.parse(data) : null;
  },

  // Save user data
  setUserData(user) {
    localStorage.setItem('user_data', JSON.stringify(user));
  },

  // Get subscription data
  getSubscriptionData() {
    const data = localStorage.getItem('subscription_data');
    return data ? JSON.parse(data) : null;
  },

  // Save subscription data
  setSubscriptionData(subscription) {
    localStorage.setItem('subscription_data', JSON.stringify(subscription));
  },

  // Check if user is logged in
  isLoggedIn() {
    return !!this.getToken();
  },

  // Register new user
  async register(email, password) {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registrierung fehlgeschlagen');
      }

      // Save token and user data
      this.setToken(data.token);
      this.setUserData({
        id: data.userId,
        email: data.email
      });
      this.setSubscriptionData(data.subscription);

      return data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  // Login user
  async login(email, password) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login fehlgeschlagen');
      }

      // Save token and user data
      this.setToken(data.token);
      this.setUserData({
        id: data.userId,
        email: data.email
      });
      this.setSubscriptionData(data.subscription);

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Logout user
  async logout() {
    try {
      const token = this.getToken();
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.removeToken();
      window.location.href = '/auth.html';
    }
  },

  // Get current user from server
  async getCurrentUser() {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Fehler beim Abrufen der Benutzerdaten');
      }

      // Update cached data
      this.setUserData(data.user);
      this.setSubscriptionData(data.subscription);

      return data;
    } catch (error) {
      console.error('Get current user error:', error);
      // If token is invalid, logout
      if (error.message.includes('Ungültiger') || error.message.includes('Invalid')) {
        this.removeToken();
        window.location.href = '/auth.html';
      }
      throw error;
    }
  },

  // Refresh subscription data
  async refreshSubscription() {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('/api/subscriptions/status', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Fehler beim Abrufen des Abonnements');
      }

      this.setSubscriptionData(data);
      return data;
    } catch (error) {
      console.error('Refresh subscription error:', error);
      throw error;
    }
  },

  // Require authentication (redirect if not logged in)
  requireAuth() {
    if (!this.isLoggedIn()) {
      window.location.href = '/auth.html';
      return false;
    }
    return true;
  },

  // Make authenticated API request
  async apiRequest(url, options = {}) {
    const token = this.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers
    };

    const response = await fetch(url, {
      ...options,
      headers
    });

    const data = await response.json();

    if (!response.ok) {
      // If unauthorized, redirect to login
      if (response.status === 401 || response.status === 403) {
        this.removeToken();
        window.location.href = '/auth.html';
      }
      throw new Error(data.error || 'API request failed');
    }

    return data;
  }
};

// Auto-refresh subscription data on page load (if logged in)
if (Auth.isLoggedIn()) {
  Auth.refreshSubscription().catch(err => {
    console.warn('Failed to refresh subscription:', err);
  });
}
