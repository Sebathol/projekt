/**
 * Credits UI Module - V3
 * Displays tool-specific usage tracking and subscription status
 */

const CreditsUI = {
  // Display subscription and tool usage status
  async displayStatus(containerId = 'credits-status') {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
      // Fetch current subscription status from V3 API
      const status = await Auth.apiRequest('/api/subscriptions/status');
      const usageStatus = await Auth.apiRequest('/api/subscriptions/usage');

      // Check if user can purchase extra
      const canPurchase = status.canPurchaseExtra;
      const plan = status.subscription.plan;
      const planName = status.subscription.planName;

      const html = `
        <div class="credits-status-card-v3">
          <div class="credits-header-v3">
            <div>
              <h3 class="credits-title-v3">📊 Dein ${planName} Plan</h3>
              <p class="credits-subtitle-v3">
                ${status.subscription.active ?
                  (status.subscription.daysRemaining === 9999 ? 'Unbegrenzt gültig' : `Noch ${status.subscription.daysRemaining} Tage gültig`)
                  : 'Inaktiv'}
              </p>
            </div>
            ${canPurchase ? `
              <button onclick="CreditsUI.showPurchaseModal()" class="btn-purchase-small-v3">
                <lucide-icon icon-name="plus-circle" class="w-4 h-4"></lucide-icon>
                Nachkaufen
              </button>
            ` : ''}
          </div>

          <!-- Tool-specific usage tracking -->
          <div class="tool-usage-grid">
            <div class="tool-usage-item ${status.toolUsage.ideas.remaining === 0 ? 'tool-depleted' : ''}">
              <div class="tool-icon">💡</div>
              <div class="tool-info">
                <div class="tool-name">Ideengenerierung</div>
                <div class="tool-usage-bar">
                  <div class="tool-usage-fill" style="width: ${(status.toolUsage.ideas.used / status.toolUsage.ideas.limit * 100)}%"></div>
                </div>
                <div class="tool-stats">
                  <span class="tool-remaining">${status.toolUsage.ideas.remaining} verfügbar</span>
                  <span class="tool-total">${status.toolUsage.ideas.used} / ${status.toolUsage.ideas.limit}</span>
                </div>
              </div>
            </div>

            <div class="tool-usage-item ${status.toolUsage.brainstorming.remaining === 0 ? 'tool-depleted' : ''}">
              <div class="tool-icon">🧠</div>
              <div class="tool-info">
                <div class="tool-name">Brainstorming</div>
                <div class="tool-usage-bar">
                  <div class="tool-usage-fill" style="width: ${(status.toolUsage.brainstorming.used / status.toolUsage.brainstorming.limit * 100)}%"></div>
                </div>
                <div class="tool-stats">
                  <span class="tool-remaining">${status.toolUsage.brainstorming.remaining} verfügbar</span>
                  <span class="tool-total">${status.toolUsage.brainstorming.used} / ${status.toolUsage.brainstorming.limit}</span>
                </div>
              </div>
            </div>

            <div class="tool-usage-item ${status.toolUsage.prd.remaining === 0 ? 'tool-depleted' : ''}">
              <div class="tool-icon">📄</div>
              <div class="tool-info">
                <div class="tool-name">PRD/PAD Erstellung</div>
                <div class="tool-usage-bar">
                  <div class="tool-usage-fill" style="width: ${(status.toolUsage.prd.used / status.toolUsage.prd.limit * 100)}%"></div>
                </div>
                <div class="tool-stats">
                  <span class="tool-remaining">${status.toolUsage.prd.remaining} verfügbar</span>
                  <span class="tool-total">${status.toolUsage.prd.used} / ${status.toolUsage.prd.limit}</span>
                </div>
              </div>
            </div>

            <div class="tool-usage-item ${status.toolUsage.prototype.remaining === 0 ? 'tool-depleted' : ''}">
              <div class="tool-icon">💻</div>
              <div class="tool-info">
                <div class="tool-name">Prototyp-Generierung</div>
                <div class="tool-usage-bar">
                  <div class="tool-usage-fill" style="width: ${(status.toolUsage.prototype.used / status.toolUsage.prototype.limit * 100)}%"></div>
                </div>
                <div class="tool-stats">
                  <span class="tool-remaining">${status.toolUsage.prototype.remaining} verfügbar</span>
                  <span class="tool-total">${status.toolUsage.prototype.used} / ${status.toolUsage.prototype.limit}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Workflow completion summary -->
          <div class="workflow-summary">
            <div class="workflow-summary-item">
              <div class="workflow-summary-icon">✅</div>
              <div class="workflow-summary-info">
                <div class="workflow-summary-label">Abgeschlossene Workflows</div>
                <div class="workflow-summary-value">${status.workflows.completed}</div>
              </div>
            </div>
            <div class="workflow-summary-item">
              <div class="workflow-summary-icon">🎯</div>
              <div class="workflow-summary-info">
                <div class="workflow-summary-label">Noch möglich</div>
                <div class="workflow-summary-value">${usageStatus.potentialCompleteWorkflows}</div>
                <div class="workflow-summary-note">von ${status.workflows.guaranteedRemaining} garantiert</div>
              </div>
            </div>
          </div>

          <!-- Smart recommendation -->
          ${usageStatus.recommendation ? `
            <div class="usage-recommendation ${!usageStatus.canCompleteWorkflow ? 'usage-warning' : 'usage-info'}">
              <lucide-icon icon-name="${!usageStatus.canCompleteWorkflow ? 'alert-circle' : 'info'}" class="w-5 h-5"></lucide-icon>
              <span>${usageStatus.recommendation}</span>
            </div>
          ` : ''}

          <!-- Upgrade prompt for free users -->
          ${!canPurchase ? `
            <div class="upgrade-prompt">
              <lucide-icon icon-name="star" class="w-5 h-5"></lucide-icon>
              <div>
                <strong>Upgrade für mehr Workflows!</strong>
                <p>Nachkauf nur mit aktivem Tages-, Wochen-, Monats- oder Jahresabo möglich.</p>
              </div>
              <button onclick="CreditsUI.showSubscriptionPlans()" class="btn-upgrade">
                Jetzt upgraden
              </button>
            </div>
          ` : ''}

          <button onclick="CreditsUI.showExplanation()" class="btn-info-link-v3">
            <lucide-icon icon-name="info" class="w-4 h-4"></lucide-icon>
            Wie funktioniert das neue System?
          </button>
        </div>
      `;

      container.innerHTML = html;
      lucide.createIcons();

    } catch (error) {
      console.error('Display status error:', error);
      container.innerHTML = `
        <div class="credits-error">
          <lucide-icon icon-name="alert-circle" class="w-6 h-6"></lucide-icon>
          <p>Fehler beim Laden des Status: ${error.message}</p>
        </div>
      `;
      lucide.createIcons();
    }
  },

  // Show purchase modal (only for paid subscriptions)
  showPurchaseModal() {
    const modal = document.createElement('div');
    modal.id = 'purchase-modal-v3';
    modal.className = 'modal-overlay-v3';

    modal.innerHTML = `
      <div class="modal-content-v3">
        <div class="modal-header-v3">
          <h2 class="modal-title-v3">
            <lucide-icon icon-name="shopping-cart" class="w-6 h-6"></lucide-icon>
            Workflows & Tokens nachkaufen
          </h2>
          <button onclick="CreditsUI.closePurchaseModal()" class="modal-close-v3">
            <lucide-icon icon-name="x" class="w-6 h-6"></lucide-icon>
          </button>
        </div>

        <div class="modal-body-v3">
          <p class="modal-description-v3">
            Kaufe zusätzliche Workflows oder Tokens nach, um deine Kreativität nicht zu unterbrechen.
          </p>

          <div class="purchase-options-v3">
            <!-- 5 Workflows -->
            <div class="purchase-option-v3">
              <div class="purchase-badge-v3">Empfohlen</div>
              <div class="purchase-icon-v3">🎨</div>
              <h3 class="purchase-title-v3">5 Workflows</h3>
              <div class="purchase-price-v3">€4,99</div>
              <ul class="purchase-features-v3">
                <li>✓ 5x komplette Durchläufe</li>
                <li>✓ Idee → Brainstorming → PRD → Prototyp</li>
                <li>✓ Erhöht alle Tool-Limits um 5</li>
              </ul>
              <button onclick="CreditsUI.purchaseWorkflows()" class="btn-purchase-v3">
                Workflows kaufen
              </button>
            </div>

            <!-- 10 Tokens -->
            <div class="purchase-option-v3">
              <div class="purchase-icon-v3">🎫</div>
              <h3 class="purchase-title-v3">10 Tokens</h3>
              <div class="purchase-price-v3">€4,99</div>
              <ul class="purchase-features-v3">
                <li>✓ Flexibel für einzelne Tools</li>
                <li>✓ 1 Token = 1 Tool-Nutzung</li>
                <li>✓ Selbst verteilen nach Bedarf</li>
              </ul>
              <button onclick="CreditsUI.purchaseTokens()" class="btn-purchase-v3">
                Tokens kaufen
              </button>
            </div>
          </div>

          <div class="purchase-info-v3">
            <lucide-icon icon-name="info" class="w-4 h-4"></lucide-icon>
            <p>
              <strong>Nur mit aktivem Abo:</strong> Nachkauf ist nur für Nutzer mit Tages-, Wochen-, Monats- oder Jahresabo verfügbar.
            </p>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    lucide.createIcons();

    // Close on outside click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        CreditsUI.closePurchaseModal();
      }
    });
  },

  // Close purchase modal
  closePurchaseModal() {
    const modal = document.getElementById('purchase-modal-v3');
    if (modal) {
      modal.remove();
    }
  },

  // Purchase workflows
  async purchaseWorkflows() {
    try {
      const confirmPurchase = confirm(
        '5 Workflows für €4,99 kaufen?\n\n' +
        'Dies erhöht alle Tool-Limits um 5.\n\n' +
        'Du wirst zu einer sicheren Zahlungsseite weitergeleitet.'
      );

      if (!confirmPurchase) return;

      // In production: redirect to payment gateway (Stripe, PayPal, etc.)
      const paymentId = `test_workflow_${Date.now()}`;

      const data = await Auth.apiRequest('/api/subscriptions/purchase-extra', {
        method: 'POST',
        body: JSON.stringify({
          type: 'workflows',
          paymentId
        })
      });

      // Close modal
      CreditsUI.closePurchaseModal();

      // Show success
      alert(
        `✅ ${data.message}\n\n` +
        `Gekauft: ${data.purchased} Workflows\n` +
        `Preis: €${data.price}`
      );

      // Refresh display
      await CreditsUI.displayStatus();

    } catch (error) {
      console.error('Purchase workflows error:', error);

      if (error.message.includes('Nachkauf nur mit aktivem Abo')) {
        alert(
          '❌ Nachkauf nicht verfügbar\n\n' +
          'Bitte upgrade zuerst auf ein Tages-, Wochen-, Monats- oder Jahresabo.\n\n' +
          'Die Testversion unterstützt keinen Nachkauf.'
        );
        CreditsUI.closePurchaseModal();
        CreditsUI.showSubscriptionPlans();
      } else {
        alert('❌ Fehler beim Kauf: ' + error.message);
      }
    }
  },

  // Purchase tokens
  async purchaseTokens() {
    try {
      const confirmPurchase = confirm(
        '10 Tokens für €4,99 kaufen?\n\n' +
        'Tokens können flexibel für einzelne Tools eingesetzt werden.\n\n' +
        'Du wirst zu einer sicheren Zahlungsseite weitergeleitet.'
      );

      if (!confirmPurchase) return;

      // In production: redirect to payment gateway (Stripe, PayPal, etc.)
      const paymentId = `test_tokens_${Date.now()}`;

      const data = await Auth.apiRequest('/api/subscriptions/purchase-extra', {
        method: 'POST',
        body: JSON.stringify({
          type: 'tokens',
          paymentId
        })
      });

      // Close modal
      CreditsUI.closePurchaseModal();

      // Show success
      alert(
        `✅ ${data.message}\n\n` +
        `Gekauft: ${data.purchased} Tokens\n` +
        `Preis: €${data.price}`
      );

      // Refresh display
      await CreditsUI.displayStatus();

    } catch (error) {
      console.error('Purchase tokens error:', error);

      if (error.message.includes('Nachkauf nur mit aktivem Abo')) {
        alert(
          '❌ Nachkauf nicht verfügbar\n\n' +
          'Bitte upgrade zuerst auf ein Tages-, Wochen-, Monats- oder Jahresabo.\n\n' +
          'Die Testversion unterstützt keinen Nachkauf.'
        );
        CreditsUI.closePurchaseModal();
        CreditsUI.showSubscriptionPlans();
      } else {
        alert('❌ Fehler beim Kauf: ' + error.message);
      }
    }
  },

  // Show subscription plans
  showSubscriptionPlans() {
    // TODO: Implement subscription plans modal
    alert('Abo-Verwaltung wird noch implementiert. Bitte kontaktiere support@aistormcreate.com oder rufe an: 06853/8579828');
  },

  // Show explanation
  showExplanation() {
    window.location.href = '/tokens-explanation.html';
  },

  // Check if user can use a specific tool
  async checkToolAvailability(toolName) {
    try {
      const status = await Auth.apiRequest('/api/subscriptions/status');
      const toolUsage = status.toolUsage[toolName];

      if (!toolUsage) {
        alert('Fehler: Ungültiges Tool');
        return false;
      }

      if (toolUsage.remaining <= 0) {
        const buyNow = confirm(
          `${this.getToolDisplayName(toolName)} aufgebraucht!\n\n` +
          `Verfügbar: ${toolUsage.remaining} / ${toolUsage.limit}\n\n` +
          `Möchtest du jetzt nachkaufen?`
        );

        if (buyNow) {
          if (status.canPurchaseExtra) {
            CreditsUI.showPurchaseModal();
          } else {
            CreditsUI.showSubscriptionPlans();
          }
        }

        return false;
      }

      return true;

    } catch (error) {
      console.error('Check tool availability error:', error);
      alert('Fehler beim Prüfen der Verfügbarkeit: ' + error.message);
      return false;
    }
  },

  // Get tool display name
  getToolDisplayName(toolName) {
    const names = {
      ideas: 'Ideengenerierung',
      brainstorming: 'Brainstorming',
      prd: 'PRD/PAD Erstellung',
      prototype: 'Prototyp-Generierung'
    };
    return names[toolName] || toolName;
  }
};

// Styles for V3 Credits UI
const creditsUIStylesV3 = `
  .credits-status-card-v3 {
    background: white;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    border: 2px solid #f59e0b;
  }

  .credits-header-v3 {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;
  }

  .credits-title-v3 {
    font-size: 20px;
    font-weight: bold;
    color: #1f2937;
    margin: 0 0 4px 0;
  }

  .credits-subtitle-v3 {
    font-size: 13px;
    color: #6b7280;
    margin: 0;
  }

  .btn-purchase-small-v3 {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 18px;
    background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    font-size: 14px;
  }

  .btn-purchase-small-v3:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }

  .tool-usage-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
  }

  .tool-usage-item {
    background: #fef3c7;
    padding: 16px;
    border-radius: 12px;
    display: flex;
    gap: 12px;
    transition: all 0.3s;
  }

  .tool-usage-item:hover {
    box-shadow: 0 4px 8px rgba(245, 158, 11, 0.2);
  }

  .tool-usage-item.tool-depleted {
    background: #fee2e2;
    opacity: 0.7;
  }

  .tool-icon {
    font-size: 32px;
    line-height: 1;
  }

  .tool-info {
    flex: 1;
  }

  .tool-name {
    font-size: 13px;
    font-weight: 600;
    color: #78350f;
    margin-bottom: 8px;
  }

  .tool-usage-bar {
    height: 8px;
    background: #fde68a;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 8px;
  }

  .tool-usage-fill {
    height: 100%;
    background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
    transition: width 0.3s;
  }

  .tool-depleted .tool-usage-fill {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  }

  .tool-stats {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
  }

  .tool-remaining {
    font-weight: 600;
    color: #f59e0b;
  }

  .tool-depleted .tool-remaining {
    color: #ef4444;
  }

  .tool-total {
    color: #92400e;
  }

  .workflow-summary {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 20px;
    padding: 20px;
    background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%);
    border-radius: 12px;
  }

  .workflow-summary-item {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .workflow-summary-icon {
    font-size: 32px;
  }

  .workflow-summary-label {
    font-size: 12px;
    color: #78350f;
    font-weight: 600;
    text-transform: uppercase;
  }

  .workflow-summary-value {
    font-size: 28px;
    font-weight: bold;
    color: #f59e0b;
  }

  .workflow-summary-note {
    font-size: 11px;
    color: #92400e;
  }

  .usage-recommendation {
    padding: 14px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    margin-bottom: 16px;
  }

  .usage-info {
    background: #eff6ff;
    border-left: 4px solid #3b82f6;
    color: #1e40af;
  }

  .usage-warning {
    background: #fef2f2;
    border-left: 4px solid #ef4444;
    color: #991b1b;
  }

  .upgrade-prompt {
    background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%);
    border: 2px solid #f59e0b;
    border-radius: 12px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }

  .upgrade-prompt strong {
    display: block;
    margin-bottom: 4px;
    color: #78350f;
  }

  .upgrade-prompt p {
    margin: 0;
    font-size: 13px;
    color: #92400e;
  }

  .btn-upgrade {
    padding: 10px 20px;
    background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
  }

  .btn-upgrade:hover {
    opacity: 0.9;
  }

  .btn-info-link-v3 {
    background: none;
    border: none;
    color: #f59e0b;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    padding: 8px 0;
    font-weight: 500;
  }

  .btn-info-link-v3:hover {
    text-decoration: underline;
  }

  .credits-error {
    background: #fef2f2;
    border: 2px solid #ef4444;
    border-radius: 12px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    color: #991b1b;
  }

  .modal-overlay-v3 {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    animation: fadeIn 0.2s;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .modal-content-v3 {
    background: white;
    border-radius: 16px;
    max-width: 800px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    animation: slideUp 0.3s;
  }

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .modal-header-v3 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    border-bottom: 1px solid #e5e7eb;
  }

  .modal-title-v3 {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 24px;
    font-weight: bold;
    color: #1f2937;
    margin: 0;
  }

  .modal-close-v3 {
    background: none;
    border: none;
    cursor: pointer;
    color: #6b7280;
    transition: color 0.2s;
  }

  .modal-close-v3:hover {
    color: #1f2937;
  }

  .modal-body-v3 {
    padding: 24px;
  }

  .modal-description-v3 {
    color: #6b7280;
    margin-bottom: 24px;
  }

  .purchase-options-v3 {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    margin-bottom: 24px;
  }

  .purchase-option-v3 {
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    padding: 24px;
    position: relative;
    transition: all 0.3s;
  }

  .purchase-option-v3:hover {
    border-color: #f59e0b;
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);
  }

  .purchase-badge-v3 {
    position: absolute;
    top: -12px;
    right: 20px;
    background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
    color: white;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
  }

  .purchase-icon-v3 {
    font-size: 48px;
    margin-bottom: 16px;
  }

  .purchase-title-v3 {
    font-size: 20px;
    font-weight: bold;
    color: #1f2937;
    margin-bottom: 8px;
  }

  .purchase-price-v3 {
    font-size: 32px;
    font-weight: bold;
    color: #f59e0b;
    margin-bottom: 16px;
  }

  .purchase-features-v3 {
    list-style: none;
    padding: 0;
    margin: 0 0 20px 0;
  }

  .purchase-features-v3 li {
    padding: 8px 0;
    color: #4b5563;
    font-size: 14px;
  }

  .btn-purchase-v3 {
    width: 100%;
    padding: 12px;
    background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
  }

  .btn-purchase-v3:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }

  .purchase-info-v3 {
    background: #eff6ff;
    border-left: 4px solid #3b82f6;
    padding: 16px;
    border-radius: 4px;
    display: flex;
    gap: 12px;
  }

  .purchase-info-v3 p {
    margin: 0;
    color: #1e40af;
    font-size: 14px;
  }
`;

// Add styles to page
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = creditsUIStylesV3;
  document.head.appendChild(style);
}
