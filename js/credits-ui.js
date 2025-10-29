/**
 * Credits UI Module
 * Displays credits status and handles purchases
 */

const CreditsUI = {
  // Display credits status
  displayStatus(containerId = 'credits-status') {
    const credits = Auth.getCreditsData();
    const container = document.getElementById(containerId);

    if (!container || !credits) return;

    const html = `
      <div class="credits-status-card">
        <div class="credits-header">
          <h3 class="credits-title">💳 Deine Credits</h3>
          <button onclick="CreditsUI.showPurchaseModal()" class="btn-purchase-small">
            <lucide-icon icon-name="plus-circle" class="w-4 h-4"></lucide-icon>
            Nachkaufen
          </button>
        </div>

        <div class="credits-grid">
          <div class="credit-item">
            <div class="credit-label">Workflows</div>
            <div class="credit-value">${credits.availableWorkflows || 0}</div>
            <div class="credit-subtitle">${credits.availableWorkflows || 0} × 4 Tokens</div>
          </div>

          <div class="credit-item">
            <div class="credit-label">Einzelne Tokens</div>
            <div class="credit-value">${credits.availableTokens || 0}</div>
            <div class="credit-subtitle">Für einzelne Tools</div>
          </div>

          <div class="credit-item credit-item-total">
            <div class="credit-label">Gesamt verfügbar</div>
            <div class="credit-value-large">${credits.totalAvailableTokens || 0}</div>
            <div class="credit-subtitle">Tokens</div>
          </div>
        </div>

        ${!credits.canStartFullWorkflow ? `
          <div class="credits-warning">
            <lucide-icon icon-name="alert-circle" class="w-5 h-5"></lucide-icon>
            <span>Nicht genügend Tokens für einen vollständigen Workflow (4 Tokens benötigt)</span>
          </div>
        ` : ''}

        <button onclick="CreditsUI.showExplanation()" class="btn-info-link">
          <lucide-icon icon-name="info" class="w-4 h-4"></lucide-icon>
          Wie funktionieren Workflows & Tokens?
        </button>
      </div>
    `;

    container.innerHTML = html;
    lucide.createIcons();
  },

  // Show purchase modal
  showPurchaseModal() {
    const modal = document.createElement('div');
    modal.id = 'purchase-modal';
    modal.className = 'modal-overlay';

    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">
            <lucide-icon icon-name="shopping-cart" class="w-6 h-6"></lucide-icon>
            Workflows & Tokens kaufen
          </h2>
          <button onclick="CreditsUI.closePurchaseModal()" class="modal-close">
            <lucide-icon icon-name="x" class="w-6 h-6"></lucide-icon>
          </button>
        </div>

        <div class="modal-body">
          <p class="modal-description">
            Wähle zwischen Workflow-Paketen (für vollständige Durchläufe) oder einzelnen Tokens (für flexible Nutzung).
          </p>

          <div class="purchase-options">
            <!-- Workflows Package -->
            <div class="purchase-option">
              <div class="purchase-badge">Empfohlen</div>
              <div class="purchase-icon">🎨</div>
              <h3 class="purchase-title">5 Workflows</h3>
              <div class="purchase-price">€5,00</div>
              <ul class="purchase-features">
                <li>✓ 20 Tokens (5 × 4)</li>
                <li>✓ Ideal für komplette Projekte</li>
                <li>✓ Idee → Brainstorming → PRD → Prototyp</li>
              </ul>
              <button onclick="CreditsUI.purchaseWorkflows()" class="btn-purchase">
                Workflows kaufen
              </button>
            </div>

            <!-- Tokens Package -->
            <div class="purchase-option">
              <div class="purchase-icon">🎫</div>
              <h3 class="purchase-title">10 Tokens</h3>
              <div class="purchase-price">€5,00</div>
              <ul class="purchase-features">
                <li>✓ Flexibel einsetzbar</li>
                <li>✓ Für einzelne Tools</li>
                <li>✓ Kombinierbar mit Workflows</li>
              </ul>
              <button onclick="CreditsUI.purchaseTokens()" class="btn-purchase">
                Tokens kaufen
              </button>
            </div>
          </div>

          <div class="purchase-info">
            <lucide-icon icon-name="info" class="w-4 h-4"></lucide-icon>
            <p>
              <strong>1 Workflow = 4 Tokens</strong> (Ideengenerierung, Brainstorming, PRD, Prototyp)<br>
              <strong>1 Token = 1 Tool</strong> einzeln nutzbar
            </p>
          </div>

          <div class="purchase-note">
            💡 <strong>Tipp:</strong> Kaufe Workflows für komplette Projekte, Tokens für einzelne Tools oder zum Auffüllen.
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
    const modal = document.getElementById('purchase-modal');
    if (modal) {
      modal.remove();
    }
  },

  // Purchase workflows
  async purchaseWorkflows() {
    try {
      const confirmPurchase = confirm(
        '5 Workflows (20 Tokens) für €5,00 kaufen?\n\n' +
        'Du wirst zu einer sicheren Zahlungsseite weitergeleitet.'
      );

      if (!confirmPurchase) return;

      // In production: redirect to payment gateway (Stripe, PayPal, etc.)
      // For now: simulate purchase
      const paymentId = `test_workflow_${Date.now()}`;

      const data = await Auth.apiRequest('/api/credits/purchase-workflows', {
        method: 'POST',
        body: JSON.stringify({
          paymentId,
          paymentStatus: 'completed'
        })
      });

      // Refresh credits
      await Auth.refreshCredits();

      // Close modal
      CreditsUI.closePurchaseModal();

      // Show success
      alert(
        `✅ ${data.message}\n\n` +
        `Verfügbare Workflows: ${data.workflowsRemaining}\n` +
        `Verfügbare Tokens: ${data.tokensRemaining}\n` +
        `Gesamt: ${data.totalAvailableTokens} Tokens`
      );

      // Update display
      CreditsUI.displayStatus();

    } catch (error) {
      console.error('Purchase workflows error:', error);
      alert('❌ Fehler beim Kauf: ' + error.message);
    }
  },

  // Purchase tokens
  async purchaseTokens() {
    try {
      const confirmPurchase = confirm(
        '10 Tokens für €5,00 kaufen?\n\n' +
        'Du wirst zu einer sicheren Zahlungsseite weitergeleitet.'
      );

      if (!confirmPurchase) return;

      // In production: redirect to payment gateway (Stripe, PayPal, etc.)
      // For now: simulate purchase
      const paymentId = `test_tokens_${Date.now()}`;

      const data = await Auth.apiRequest('/api/credits/purchase-tokens', {
        method: 'POST',
        body: JSON.stringify({
          paymentId,
          paymentStatus: 'completed'
        })
      });

      // Refresh credits
      await Auth.refreshCredits();

      // Close modal
      CreditsUI.closePurchaseModal();

      // Show success
      alert(
        `✅ ${data.message}\n\n` +
        `Verfügbare Workflows: ${data.workflowsRemaining}\n` +
        `Verfügbare Tokens: ${data.tokensRemaining}\n` +
        `Gesamt: ${data.totalAvailableTokens} Tokens`
      );

      // Update display
      CreditsUI.displayStatus();

    } catch (error) {
      console.error('Purchase tokens error:', error);
      alert('❌ Fehler beim Kauf: ' + error.message);
    }
  },

  // Show explanation
  showExplanation() {
    window.location.href = '/tokens-explanation.html';
  },

  // Check if user has enough credits for action
  async checkCredits(requiredTokens = 4, action = 'Workflow') {
    const credits = Auth.getCreditsData();

    if (!credits) {
      alert('Fehler: Credits-Daten nicht verfügbar');
      return false;
    }

    const totalTokens = (credits.availableWorkflows * 4) + credits.availableTokens;

    if (totalTokens < requiredTokens) {
      const buyNow = confirm(
        `Nicht genügend Tokens für ${action}!\n\n` +
        `Benötigt: ${requiredTokens} Tokens\n` +
        `Verfügbar: ${totalTokens} Tokens\n\n` +
        `Möchtest du jetzt Tokens kaufen?`
      );

      if (buyNow) {
        CreditsUI.showPurchaseModal();
      }

      return false;
    }

    return true;
  }
};

// Styles for credits UI
const creditsUIStyles = `
  .credits-status-card {
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    border: 2px solid #f59e0b;
  }

  .credits-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .credits-title {
    font-size: 18px;
    font-weight: bold;
    color: #1f2937;
    margin: 0;
  }

  .btn-purchase-small {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
  }

  .btn-purchase-small:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }

  .credits-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
    margin-bottom: 20px;
  }

  .credit-item {
    background: #fef3c7;
    padding: 15px;
    border-radius: 8px;
    text-align: center;
  }

  .credit-item-total {
    background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%);
  }

  .credit-label {
    font-size: 12px;
    color: #78350f;
    text-transform: uppercase;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .credit-value {
    font-size: 32px;
    font-weight: bold;
    color: #f59e0b;
  }

  .credit-value-large {
    font-size: 42px;
    font-weight: bold;
    color: #ea580c;
  }

  .credit-subtitle {
    font-size: 11px;
    color: #92400e;
    margin-top: 4px;
  }

  .credits-warning {
    background: #fef2f2;
    border-left: 4px solid #ef4444;
    padding: 12px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: 10px;
    color: #991b1b;
    font-size: 14px;
    margin-bottom: 15px;
  }

  .btn-info-link {
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

  .btn-info-link:hover {
    text-decoration: underline;
  }

  .modal-overlay {
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

  .modal-content {
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

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    border-bottom: 1px solid #e5e7eb;
  }

  .modal-title {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 24px;
    font-weight: bold;
    color: #1f2937;
    margin: 0;
  }

  .modal-close {
    background: none;
    border: none;
    cursor: pointer;
    color: #6b7280;
    transition: color 0.2s;
  }

  .modal-close:hover {
    color: #1f2937;
  }

  .modal-body {
    padding: 24px;
  }

  .modal-description {
    color: #6b7280;
    margin-bottom: 24px;
  }

  .purchase-options {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    margin-bottom: 24px;
  }

  .purchase-option {
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    padding: 24px;
    position: relative;
    transition: all 0.3s;
  }

  .purchase-option:hover {
    border-color: #f59e0b;
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);
  }

  .purchase-badge {
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

  .purchase-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }

  .purchase-title {
    font-size: 20px;
    font-weight: bold;
    color: #1f2937;
    margin-bottom: 8px;
  }

  .purchase-price {
    font-size: 32px;
    font-weight: bold;
    color: #f59e0b;
    margin-bottom: 16px;
  }

  .purchase-features {
    list-style: none;
    padding: 0;
    margin: 0 0 20px 0;
  }

  .purchase-features li {
    padding: 8px 0;
    color: #4b5563;
  }

  .btn-purchase {
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

  .btn-purchase:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }

  .purchase-info {
    background: #eff6ff;
    border-left: 4px solid #3b82f6;
    padding: 16px;
    border-radius: 4px;
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
  }

  .purchase-info p {
    margin: 0;
    color: #1e40af;
    font-size: 14px;
  }

  .purchase-note {
    background: #fef3c7;
    border: 1px solid #fbbf24;
    padding: 12px;
    border-radius: 8px;
    color: #78350f;
    font-size: 14px;
  }
`;

// Add styles to page
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = creditsUIStyles;
  document.head.appendChild(style);
}
