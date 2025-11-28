/**
 * Quota Service
 * Handles user quota and cost tracking
 */

import authService from './authService.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class QuotaService {
  /**
   * Get user quota information
   */
  async getQuota() {
    try {
      const response = await fetch(`${API_URL}/api/quota`, {
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch quota');
      }

      return await response.json();
    } catch (error) {
      console.error('Get quota error:', error);
      throw error;
    }
  }

  /**
   * Format cost for display
   */
  formatCost(cost) {
    return `$${Number(cost).toFixed(4)}`;
  }

  /**
   * Get quota status
   */
  getQuotaStatus(quota) {
    const tokenUsagePercent = quota.quota.percentTokensUsed;
    const budgetUsagePercent = quota.quota.percentBudgetUsed;

    return {
      tokens: {
        used: quota.quota.tokensUsedThisMonth,
        limit: quota.quota.monthlyTokenLimit,
        remaining: quota.quota.tokensRemaining,
        percent: Math.round(tokenUsagePercent),
        status: tokenUsagePercent > 80 ? 'warning' : tokenUsagePercent > 100 ? 'danger' : 'ok',
      },
      budget: {
        spent: quota.quota.spentThisMonth,
        limit: quota.quota.monthlyBudgetLimit,
        remaining: quota.quota.budgetRemaining,
        percent: Math.round(budgetUsagePercent),
        status: budgetUsagePercent > 80 ? 'warning' : budgetUsagePercent > 100 ? 'danger' : 'ok',
      },
      resetDate: new Date(quota.quota.resetDate),
    };
  }

  /**
   * Check if quota available
   */
  isQuotaAvailable(quota) {
    return quota.quota.tokensRemaining > 0 && quota.quota.budgetRemaining > 0;
  }

  /**
   * Get days until reset
   */
  getDaysUntilReset(resetDate) {
    const now = new Date();
    const diffTime = new Date(resetDate) - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }
}

export default new QuotaService();
