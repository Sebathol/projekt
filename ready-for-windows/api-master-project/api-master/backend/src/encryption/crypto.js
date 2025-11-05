const CryptoJS = require('crypto-js');
const crypto = require('crypto');
require('dotenv').config();

class CryptoService {
  constructor() {
    this.encryptionKey = process.env.ENCRYPTION_KEY || this.generateKey();
    this.algorithm = 'aes-256-gcm';
  }

  /**
   * Generate a secure encryption key
   */
  generateKey() {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Generate a secure IV (Initialization Vector)
   */
  generateIV() {
    return crypto.randomBytes(16);
  }

  /**
   * Encrypt data using AES-256-GCM
   * @param {string} data - Data to encrypt
   * @returns {object} - Encrypted data with IV and auth tag
   */
  encrypt(data) {
    try {
      const iv = this.generateIV();
      const cipher = crypto.createCipheriv(
        this.algorithm,
        Buffer.from(this.encryptionKey, 'hex'),
        iv
      );

      let encrypted = cipher.update(data, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      const authTag = cipher.getAuthTag();

      return {
        encrypted: encrypted,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex')
      };
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  /**
   * Decrypt data using AES-256-GCM
   * @param {object} encryptedData - Object containing encrypted data, IV, and auth tag
   * @returns {string} - Decrypted data
   */
  decrypt(encryptedData) {
    try {
      const { encrypted, iv, authTag } = encryptedData;

      const decipher = crypto.createDecipheriv(
        this.algorithm,
        Buffer.from(this.encryptionKey, 'hex'),
        Buffer.from(iv, 'hex')
      );

      decipher.setAuthTag(Buffer.from(authTag, 'hex'));

      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  /**
   * Hash data using SHA-256
   * @param {string} data - Data to hash
   * @returns {string} - Hashed data
   */
  hash(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Generate a secure random token
   * @param {number} length - Length of token in bytes
   * @returns {string} - Random token
   */
  generateToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Encrypt API Key for storage
   * @param {string} apiKey - Original API key
   * @returns {object} - Encrypted API key data
   */
  encryptApiKey(apiKey) {
    const encrypted = this.encrypt(apiKey);
    const hash = this.hash(apiKey);

    return {
      ...encrypted,
      hash
    };
  }

  /**
   * Decrypt API Key from storage
   * @param {object} encryptedData - Encrypted API key data
   * @returns {string} - Original API key
   */
  decryptApiKey(encryptedData) {
    return this.decrypt(encryptedData);
  }

  /**
   * Generate a proxy API key (customer-facing)
   * @param {string} userId - User ID
   * @param {string} apiId - API ID
   * @returns {string} - Proxy API key
   */
  generateProxyKey(userId, apiId) {
    const timestamp = Date.now();
    const randomData = crypto.randomBytes(16).toString('hex');
    const data = `${userId}_${apiId}_${timestamp}_${randomData}`;
    const hash = this.hash(data);

    return `${process.env.PROXY_KEY_PREFIX || 'APM_'}${hash.substring(0, 48)}`;
  }

  /**
   * Verify proxy API key format
   * @param {string} proxyKey - Proxy API key to verify
   * @returns {boolean} - True if valid format
   */
  verifyProxyKeyFormat(proxyKey) {
    const prefix = process.env.PROXY_KEY_PREFIX || 'APM_';
    const regex = new RegExp(`^${prefix}[a-f0-9]{48}$`);
    return regex.test(proxyKey);
  }
}

module.exports = new CryptoService();
