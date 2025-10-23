const jwt = require('jsonwebtoken');
require('dotenv').config();

class JWTService {
  /**
   * Generate access token
   * @param {object} payload - Token payload
   * @returns {string} - JWT token
   */
  generateAccessToken(payload) {
    return jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
  }

  /**
   * Generate refresh token
   * @param {object} payload - Token payload
   * @returns {string} - JWT refresh token
   */
  generateRefreshToken(payload) {
    return jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d' }
    );
  }

  /**
   * Verify token
   * @param {string} token - JWT token
   * @returns {object} - Decoded token
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Decode token without verification
   * @param {string} token - JWT token
   * @returns {object} - Decoded token
   */
  decodeToken(token) {
    return jwt.decode(token);
  }
}

module.exports = new JWTService();
