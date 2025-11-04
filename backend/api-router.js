/**
 * API Router - Hybrid System
 * FREE Plan → Gemini API (kostenlos!)
 * Paid Plans (Day, Month, Year) → Claude API (beste Qualität!)
 */

const claudeApi = require('./claude-api');
const geminiApi = require('./gemini-api');

/**
 * Select API based on subscription plan
 *
 * @param {string} plan - 'free', 'day', 'month', 'year'
 * @returns {object} - Selected API module
 */
function selectApi(plan) {
  // FREE → Gemini (kostenlos!)
  if (plan === 'free') {
    console.log('🟢 Using GEMINI API (FREE plan)');
    return {
      api: geminiApi,
      name: 'Gemini',
      provider: 'Google',
      costPerWorkflow: 0
    };
  }

  // All paid plans → Claude (beste Qualität!)
  console.log(`🔵 Using CLAUDE API (${plan.toUpperCase()} plan)`);
  return {
    api: claudeApi,
    name: 'Claude Sonnet 4',
    provider: 'Anthropic',
    costPerWorkflow: 0.16
  };
}

/**
 * Call API with automatic error handling and fallback
 *
 * @param {string} plan - Subscription plan
 * @param {string} method - API method name ('generateIdeas', 'createPRD', etc.)
 * @param  {...any} args - Arguments to pass to the method
 * @returns {Promise<object>} - API response with usedApi metadata
 */
async function callWithFallback(plan, method, ...args) {
  const selectedApi = selectApi(plan);

  try {
    // Try primary API
    const result = await selectedApi.api[method](...args);

    return {
      ...result,
      usedApi: selectedApi.name,
      provider: selectedApi.provider,
      estimatedCost: selectedApi.costPerWorkflow
    };

  } catch (primaryError) {
    console.error(`❌ ${selectedApi.name} API failed:`, primaryError.message);

    // Fallback logic: If Claude fails, try Gemini (for paid users)
    if (plan !== 'free') {
      console.log('🔄 Attempting fallback to Gemini API...');

      try {
        const result = await geminiApi[method](...args);

        console.log('✅ Fallback successful - using Gemini');
        return {
          ...result,
          usedApi: 'Gemini (Fallback)',
          provider: 'Google',
          estimatedCost: 0,
          fallbackUsed: true
        };

      } catch (fallbackError) {
        console.error('❌ Fallback to Gemini also failed:', fallbackError.message);
        throw new Error('All APIs failed. Please try again later.');
      }
    }

    // For free users, no fallback available
    throw primaryError;
  }
}

/**
 * Get API info for a plan (without calling it)
 *
 * @param {string} plan - Subscription plan
 * @returns {object} - API metadata
 */
function getApiInfo(plan) {
  const selectedApi = selectApi(plan);

  return {
    name: selectedApi.name,
    provider: selectedApi.provider,
    costPerWorkflow: selectedApi.costPerWorkflow,
    isFree: plan === 'free'
  };
}

/**
 * Validate API availability
 *
 * @returns {Promise<object>} - Status of available APIs
 */
async function checkApiAvailability() {
  const status = {
    claude: { available: false, error: null },
    gemini: { available: false, error: null }
  };

  // Check Claude
  try {
    await claudeApi.callClaude([{ role: 'user', content: 'test' }], 10);
    status.claude.available = true;
  } catch (error) {
    status.claude.error = error.message;
  }

  // Check Gemini
  try {
    await geminiApi.callGemini('test', 10);
    status.gemini.available = true;
  } catch (error) {
    status.gemini.error = error.message;
  }

  return status;
}

module.exports = {
  selectApi,
  callWithFallback,
  getApiInfo,
  checkApiAvailability
};
