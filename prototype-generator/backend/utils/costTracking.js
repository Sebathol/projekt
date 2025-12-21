/**
 * Cost Tracking Service
 * Tracks API usage and costs for rate limiting and billing
 */

const CLAUDE_INPUT_COST = parseFloat(process.env.CLAUDE_INPUT_COST || 3) / 1000000; // per token
const CLAUDE_OUTPUT_COST = parseFloat(process.env.CLAUDE_OUTPUT_COST || 15) / 1000000; // per token

/**
 * Calculate cost for tokens
 */
export const calculateCost = (inputTokens, outputTokens) => {
  const inputCost = inputTokens * CLAUDE_INPUT_COST;
  const outputCost = outputTokens * CLAUDE_OUTPUT_COST;
  return {
    inputCost: parseFloat(inputCost.toFixed(6)),
    outputCost: parseFloat(outputCost.toFixed(6)),
    totalCost: parseFloat((inputCost + outputCost).toFixed(6)),
  };
};

/**
 * Extract token usage from Claude API response
 * Claude returns usage info in the response metadata
 */
export const extractTokenUsage = (response) => {
  if (response.usage) {
    return {
      inputTokens: response.usage.input_tokens || 0,
      outputTokens: response.usage.output_tokens || 0,
      totalTokens: (response.usage.input_tokens || 0) + (response.usage.output_tokens || 0),
    };
  }
  return {
    inputTokens: 0,
    outputTokens: 0,
    totalTokens: 0,
  };
};

/**
 * Estimate tokens for a message (rough estimate)
 * Typically 1 token ≈ 4 characters in English
 */
export const estimateTokens = (text) => {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
};

/**
 * Format cost for display
 */
export const formatCost = (cost) => {
  return `$${cost.toFixed(6)}`;
};

/**
 * Check if user can afford the operation
 */
export const canAfford = (userQuota, estimatedCost) => {
  const availableBudget = userQuota.monthlyBudgetLimit - userQuota.spentThisMonth;
  return availableBudget >= estimatedCost;
};

/**
 * Get user's remaining quota
 */
export const getRemainingQuota = (userQuota) => {
  return {
    tokensRemaining: userQuota.monthlyTokenLimit - userQuota.tokensUsedThisMonth,
    budgetRemaining: userQuota.monthlyBudgetLimit - userQuota.spentThisMonth,
    percentTokensUsed: (userQuota.tokensUsedThisMonth / userQuota.monthlyTokenLimit) * 100,
    percentBudgetUsed: (userQuota.spentThisMonth / userQuota.monthlyBudgetLimit) * 100,
  };
};

/**
 * Check if quota exceeded
 */
export const isQuotaExceeded = (userQuota, additionalTokens = 0, additionalCost = 0) => {
  const tokensWillExceed =
    (userQuota.tokensUsedThisMonth + additionalTokens) > userQuota.monthlyTokenLimit;
  const budgetWillExceed =
    (userQuota.spentThisMonth + additionalCost) > userQuota.monthlyBudgetLimit;

  return {
    tokensExceeded: tokensWillExceed,
    budgetExceeded: budgetWillExceed,
    exceeded: tokensWillExceed || budgetWillExceed,
  };
};
