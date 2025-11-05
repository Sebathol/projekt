const cryptoService = require('../encryption/crypto');
const { ApiKey } = require('../../database/models');
const axios = require('axios');

class ApiProxyService {
  constructor() {
    this.proxyCache = new Map();
    this.rateLimitCache = new Map();
  }

  /**
   * Create a new API key entry with proxy
   * @param {object} data - API key data
   * @returns {object} - Created API key with proxy
   */
  async createApiKeyWithProxy(data) {
    const { userId, apiName, apiProvider, originalKey, testKey, apiEndpoint, apiVersion, metadata } = data;

    // Encrypt original key
    const encryptedOriginal = cryptoService.encryptApiKey(originalKey);

    // Generate proxy key
    const proxyKey = cryptoService.generateProxyKey(userId, apiName);

    // Encrypt test key if provided
    let encryptedTest = null;
    if (testKey) {
      encryptedTest = cryptoService.encrypt(testKey);
    }

    // Create database entry
    const apiKeyEntry = await ApiKey.create({
      userId,
      apiName,
      apiProvider,
      originalKeyEncrypted: encryptedOriginal.encrypted,
      originalKeyIV: encryptedOriginal.iv,
      originalKeyAuthTag: encryptedOriginal.authTag,
      originalKeyHash: encryptedOriginal.hash,
      proxyKey,
      testKey: encryptedTest?.encrypted || null,
      testKeyIV: encryptedTest?.iv || null,
      testKeyAuthTag: encryptedTest?.authTag || null,
      apiEndpoint,
      apiVersion,
      metadata: metadata || {}
    });

    // Cache the mapping
    this.proxyCache.set(proxyKey, {
      id: apiKeyEntry.id,
      userId,
      environment: apiKeyEntry.environment
    });

    return {
      id: apiKeyEntry.id,
      proxyKey,
      apiName,
      apiProvider,
      environment: apiKeyEntry.environment,
      createdAt: apiKeyEntry.createdAt
    };
  }

  /**
   * Get original API key from proxy key
   * @param {string} proxyKey - Proxy key
   * @returns {string} - Original API key (decrypted)
   */
  async getOriginalKey(proxyKey) {
    // Verify format
    if (!cryptoService.verifyProxyKeyFormat(proxyKey)) {
      throw new Error('Invalid proxy key format');
    }

    // Check cache first
    let cachedData = this.proxyCache.get(proxyKey);

    if (!cachedData) {
      // Fetch from database
      const apiKeyEntry = await ApiKey.findOne({ where: { proxyKey, isActive: true } });

      if (!apiKeyEntry) {
        throw new Error('Proxy key not found or inactive');
      }

      if (apiKeyEntry.isExpired()) {
        throw new Error('API key has expired');
      }

      cachedData = {
        id: apiKeyEntry.id,
        userId: apiKeyEntry.userId,
        environment: apiKeyEntry.environment
      };

      this.proxyCache.set(proxyKey, cachedData);
    }

    // Fetch full data from database
    const apiKeyEntry = await ApiKey.findByPk(cachedData.id);

    // Determine which key to use based on environment
    let originalKey;
    if (apiKeyEntry.environment === 'test' && apiKeyEntry.testKey) {
      originalKey = cryptoService.decrypt({
        encrypted: apiKeyEntry.testKey,
        iv: apiKeyEntry.testKeyIV,
        authTag: apiKeyEntry.testKeyAuthTag
      });
    } else {
      originalKey = cryptoService.decrypt({
        encrypted: apiKeyEntry.originalKeyEncrypted,
        iv: apiKeyEntry.originalKeyIV,
        authTag: apiKeyEntry.originalKeyAuthTag
      });
    }

    // Update usage statistics
    await apiKeyEntry.incrementUsage();

    return {
      originalKey,
      apiEndpoint: apiKeyEntry.apiEndpoint,
      apiVersion: apiKeyEntry.apiVersion,
      metadata: apiKeyEntry.metadata
    };
  }

  /**
   * Switch between test and production environment
   * @param {string} proxyKey - Proxy key
   * @param {string} environment - 'test' or 'production'
   */
  async switchEnvironment(proxyKey, environment) {
    const apiKeyEntry = await ApiKey.findOne({ where: { proxyKey } });

    if (!apiKeyEntry) {
      throw new Error('Proxy key not found');
    }

    if (environment === 'test' && !apiKeyEntry.testKey) {
      throw new Error('No test key configured');
    }

    apiKeyEntry.environment = environment;
    await apiKeyEntry.save();

    // Clear cache
    this.proxyCache.delete(proxyKey);

    return { success: true, environment };
  }

  /**
   * Proxy an API request
   * @param {string} proxyKey - Proxy key
   * @param {object} requestConfig - Axios request configuration
   * @returns {object} - API response
   */
  async proxyRequest(proxyKey, requestConfig) {
    // Check rate limit
    if (await this.isRateLimited(proxyKey)) {
      throw new Error('Rate limit exceeded');
    }

    // Get original key and config
    const { originalKey, apiEndpoint, metadata } = await this.getOriginalKey(proxyKey);

    // Build request configuration
    const config = {
      ...requestConfig,
      baseURL: apiEndpoint || requestConfig.baseURL,
      headers: {
        ...requestConfig.headers,
        'Authorization': this.formatAuthHeader(originalKey, metadata.authType || 'Bearer'),
        'User-Agent': 'API-Master-Proxy/1.0'
      }
    };

    try {
      // Make the proxied request
      const response = await axios(config);

      // Track rate limit
      this.trackRateLimit(proxyKey);

      return {
        success: true,
        data: response.data,
        status: response.status,
        headers: response.headers
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        status: error.response?.status || 500,
        data: error.response?.data || null
      };
    }
  }

  /**
   * Format authorization header based on auth type
   * @param {string} apiKey - API key
   * @param {string} authType - Type of auth (Bearer, ApiKey, Basic, etc.)
   * @returns {string} - Formatted auth header
   */
  formatAuthHeader(apiKey, authType = 'Bearer') {
    switch (authType.toLowerCase()) {
      case 'bearer':
        return `Bearer ${apiKey}`;
      case 'apikey':
        return apiKey;
      case 'basic':
        return `Basic ${Buffer.from(apiKey).toString('base64')}`;
      default:
        return apiKey;
    }
  }

  /**
   * Check if proxy key is rate limited
   * @param {string} proxyKey - Proxy key
   * @returns {boolean} - True if rate limited
   */
  async isRateLimited(proxyKey) {
    const apiKeyEntry = await ApiKey.findOne({ where: { proxyKey } });

    if (!apiKeyEntry) {
      return true;
    }

    // Check daily limit
    if (apiKeyEntry.requestsToday >= apiKeyEntry.rateLimitPerDay) {
      return true;
    }

    // Check per-minute limit (using cache)
    const cacheKey = `rate_${proxyKey}`;
    const cached = this.rateLimitCache.get(cacheKey) || { count: 0, timestamp: Date.now() };

    const now = Date.now();
    const oneMinute = 60 * 1000;

    if (now - cached.timestamp < oneMinute) {
      if (cached.count >= apiKeyEntry.rateLimitPerMinute) {
        return true;
      }
    }

    return false;
  }

  /**
   * Track rate limit
   * @param {string} proxyKey - Proxy key
   */
  trackRateLimit(proxyKey) {
    const cacheKey = `rate_${proxyKey}`;
    const cached = this.rateLimitCache.get(cacheKey) || { count: 0, timestamp: Date.now() };

    const now = Date.now();
    const oneMinute = 60 * 1000;

    if (now - cached.timestamp < oneMinute) {
      cached.count++;
    } else {
      cached.count = 1;
      cached.timestamp = now;
    }

    this.rateLimitCache.set(cacheKey, cached);
  }

  /**
   * Rotate API key (generate new proxy key)
   * @param {string} oldProxyKey - Old proxy key
   * @returns {object} - New proxy key
   */
  async rotateProxyKey(oldProxyKey) {
    const apiKeyEntry = await ApiKey.findOne({ where: { proxyKey: oldProxyKey } });

    if (!apiKeyEntry) {
      throw new Error('Proxy key not found');
    }

    // Generate new proxy key
    const newProxyKey = cryptoService.generateProxyKey(apiKeyEntry.userId, apiKeyEntry.apiName);

    // Update database
    apiKeyEntry.proxyKey = newProxyKey;
    await apiKeyEntry.save();

    // Clear caches
    this.proxyCache.delete(oldProxyKey);

    return {
      oldProxyKey,
      newProxyKey,
      rotatedAt: new Date()
    };
  }

  /**
   * Get API usage statistics
   * @param {string} proxyKey - Proxy key
   * @returns {object} - Usage statistics
   */
  async getUsageStats(proxyKey) {
    const apiKeyEntry = await ApiKey.findOne({ where: { proxyKey } });

    if (!apiKeyEntry) {
      throw new Error('Proxy key not found');
    }

    return {
      apiName: apiKeyEntry.apiName,
      requestsToday: apiKeyEntry.requestsToday,
      totalRequests: apiKeyEntry.totalRequests,
      rateLimitPerDay: apiKeyEntry.rateLimitPerDay,
      rateLimitPerMinute: apiKeyEntry.rateLimitPerMinute,
      remainingToday: Math.max(0, apiKeyEntry.rateLimitPerDay - apiKeyEntry.requestsToday),
      lastUsedAt: apiKeyEntry.lastUsedAt,
      environment: apiKeyEntry.environment
    };
  }
}

module.exports = new ApiProxyService();
