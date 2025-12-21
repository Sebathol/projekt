/**
 * Input Validators
 */

export const validators = {
  /**
   * Validate topic input
   */
  isValidTopic: (topic) => {
    if (!topic || typeof topic !== 'string') return false;
    const trimmed = topic.trim();
    return trimmed.length >= 10 && trimmed.length <= 500;
  },

  /**
   * Validate email
   */
  isValidEmail: (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  /**
   * Validate URL
   */
  isValidUrl: (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Validate chat message
   */
  isValidMessage: (message) => {
    if (!message || typeof message !== 'string') return false;
    return message.trim().length > 0 && message.length < 2000;
  },
};

export default validators;
