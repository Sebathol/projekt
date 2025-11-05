import Anthropic from '@anthropic-ai/sdk';
import * as SecureStore from 'expo-secure-store';

// Anthropic API Configuration
// TODO: Replace with your actual API key or use environment variables
// For production, store in .env file and use expo-constants
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || 'YOUR_ANTHROPIC_API_KEY_HERE';

class AnthropicService {
  constructor() {
    this.client = new Anthropic({
      apiKey: ANTHROPIC_API_KEY,
    });
    this.conversationHistory = [];
  }

  /**
   * Send a message to Claude and get a response
   * @param {string} message - User's message
   * @param {string} systemPrompt - Optional system prompt
   * @returns {Promise<string>} - Claude's response
   */
  async sendMessage(message, systemPrompt = null) {
    try {
      this.conversationHistory.push({
        role: 'user',
        content: message,
      });

      const requestPayload = {
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        messages: this.conversationHistory,
      };

      if (systemPrompt) {
        requestPayload.system = systemPrompt;
      }

      const response = await this.client.messages.create(requestPayload);

      const assistantMessage = response.content[0].text;

      this.conversationHistory.push({
        role: 'assistant',
        content: assistantMessage,
      });

      return {
        success: true,
        message: assistantMessage,
        usage: response.usage,
      };
    } catch (error) {
      console.error('Anthropic API Error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Analyze API usage and provide recommendations
   * @param {Array} apiUsageData - Array of API usage statistics
   * @returns {Promise<Object>} - Analysis results
   */
  async analyzeAPIUsage(apiUsageData) {
    const prompt = `Analyze the following API usage data and provide recommendations for optimization:

${JSON.stringify(apiUsageData, null, 2)}

Please provide:
1. Usage patterns and trends
2. Cost optimization recommendations
3. Security recommendations
4. Performance improvements
5. API key rotation suggestions`;

    return await this.sendMessage(prompt, 'You are an expert API management consultant specializing in optimization and security.');
  }

  /**
   * Compliance check for Kleinunternehmer (German small business regulation)
   * @param {number} currentRevenue - Current annual revenue
   * @param {Array} invoices - Array of invoice data
   * @returns {Promise<Object>} - Compliance analysis
   */
  async checkCompliance(currentRevenue, invoices) {
    const prompt = `As a German tax compliance expert, analyze the following business data:

Current Annual Revenue: €${currentRevenue}
Number of Invoices: ${invoices.length}
Kleinunternehmer Limit: €22,000

Invoices:
${JSON.stringify(invoices, null, 2)}

Please provide:
1. Compliance status with §19 UStG (Kleinunternehmer-Regelung)
2. Remaining revenue allowance
3. Tax obligations
4. Recommendations for staying compliant
5. Warning if approaching the €22,000 limit`;

    return await this.sendMessage(prompt, 'You are a German tax compliance expert specializing in Kleinunternehmer regulations (§19 UStG).');
  }

  /**
   * Generate API key security recommendations
   * @param {Array} apiKeys - Array of API key objects
   * @returns {Promise<Object>} - Security recommendations
   */
  async analyzeAPIKeySecurity(apiKeys) {
    const keysInfo = apiKeys.map(key => ({
      name: key.name,
      provider: key.provider,
      createdAt: key.createdAt,
      lastUsed: key.lastUsed,
      permissions: key.permissions,
    }));

    const prompt = `Analyze the security of the following API keys and provide recommendations:

${JSON.stringify(keysInfo, null, 2)}

Please provide:
1. Security risk assessment for each key
2. Rotation recommendations
3. Permission optimization
4. Best practices for API key management
5. Potential security vulnerabilities`;

    return await this.sendMessage(prompt, 'You are a cybersecurity expert specializing in API security and key management.');
  }

  /**
   * Help generate code snippets for API integration
   * @param {string} apiProvider - API provider name
   * @param {string} language - Programming language
   * @param {string} task - Specific task to accomplish
   * @returns {Promise<Object>} - Code snippet and explanation
   */
  async generateCodeSnippet(apiProvider, language, task) {
    const prompt = `Generate a ${language} code snippet for integrating with ${apiProvider} API to ${task}.

Requirements:
1. Use best practices and error handling
2. Include comments explaining the code
3. Show how to securely handle API keys
4. Provide usage examples
5. Include necessary imports/dependencies`;

    return await this.sendMessage(prompt, `You are an expert software developer specializing in API integrations.`);
  }

  /**
   * Clear conversation history
   */
  clearHistory() {
    this.conversationHistory = [];
  }

  /**
   * Get conversation history
   * @returns {Array} - Conversation history
   */
  getHistory() {
    return this.conversationHistory;
  }

  /**
   * Save conversation to secure storage
   * @param {string} conversationId - Unique conversation ID
   */
  async saveConversation(conversationId) {
    try {
      await SecureStore.setItemAsync(
        `conversation_${conversationId}`,
        JSON.stringify(this.conversationHistory)
      );
      return { success: true };
    } catch (error) {
      console.error('Error saving conversation:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Load conversation from secure storage
   * @param {string} conversationId - Unique conversation ID
   */
  async loadConversation(conversationId) {
    try {
      const data = await SecureStore.getItemAsync(`conversation_${conversationId}`);
      if (data) {
        this.conversationHistory = JSON.parse(data);
        return { success: true };
      }
      return { success: false, error: 'Conversation not found' };
    } catch (error) {
      console.error('Error loading conversation:', error);
      return { success: false, error: error.message };
    }
  }
}

// Export singleton instance
export default new AnthropicService();
