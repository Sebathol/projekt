/**
 * Promo Code UI Module
 * Handles promo code redemption and display
 */

const PromoCodeUI = {
  // Show promo code modal
  showPromoCodeModal() {
    const modal = document.createElement('div');
    modal.id = 'promo-code-modal';
    modal.className = 'modal-overlay-promo';

    modal.innerHTML = `
      <div class="modal-content-promo">
        <div class="modal-header-promo">
          <h2 class="modal-title-promo">
            <lucide-icon icon-name="gift" class="w-6 h-6"></lucide-icon>
            Promo-Code einlösen
          </h2>
          <button onclick="PromoCodeUI.closePromoCodeModal()" class="modal-close-promo">
            <lucide-icon icon-name="x" class="w-6 h-6"></lucide-icon>
          </button>
        </div>

        <div class="modal-body-promo">
          <p class="promo-description">
            Hast du einen Influencer- oder Partner-Code? Löse ihn hier ein und erhalte
            exklusiven Zugang zu zusätzlichen Workflows und Tokens!
          </p>

          <div class="promo-code-input-container">
            <label for="promo-code-input" class="promo-label">Promo-Code</label>
            <input
              type="text"
              id="promo-code-input"
              class="promo-code-input"
              placeholder="z.B. INFLUENCER-2025-FREE"
              autocomplete="off"
              spellcheck="false"
            />
            <div id="promo-error" class="promo-error" style="display: none;"></div>
            <div id="promo-success" class="promo-success" style="display: none;"></div>
          </div>

          <div class="promo-examples">
            <strong>Beispiel-Codes:</strong>
            <ul>
              <li><code>INFLUENCER-2025-FREE</code> - 2 Wochen Influencer Test</li>
              <li><code>CREATOR-2025-TRIAL</code> - YouTube/TikTok Creator Bonus</li>
              <li><code>PARTNER-XXXX-XXXX</code> - Exklusiver Partner-Code</li>
            </ul>
          </div>

          <div class="promo-info-box">
            <lucide-icon icon-name="info" class="w-5 h-5"></lucide-icon>
            <div>
              <strong>Hinweis:</strong> Die Testphase beginnt automatisch mit deiner ersten
              Generierung und läuft dann für die angegebene Dauer.
            </div>
          </div>

          <button onclick="PromoCodeUI.redeemCode()" class="btn-redeem-code" id="redeem-btn">
            <lucide-icon icon-name="check-circle" class="w-5 h-5"></lucide-icon>
            Code einlösen
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    lucide.createIcons();

    // Focus input
    document.getElementById('promo-code-input').focus();

    // Enter key to submit
    document.getElementById('promo-code-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        PromoCodeUI.redeemCode();
      }
    });

    // Close on outside click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        PromoCodeUI.closePromoCodeModal();
      }
    });
  },

  // Close modal
  closePromoCodeModal() {
    const modal = document.getElementById('promo-code-modal');
    if (modal) {
      modal.remove();
    }
  },

  // Redeem code
  async redeemCode() {
    const input = document.getElementById('promo-code-input');
    const errorDiv = document.getElementById('promo-error');
    const successDiv = document.getElementById('promo-success');
    const btn = document.getElementById('redeem-btn');

    const code = input.value.trim();

    // Reset messages
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';

    // Validation
    if (!code) {
      errorDiv.textContent = 'Bitte gib einen Code ein.';
      errorDiv.style.display = 'block';
      return;
    }

    // Disable button
    btn.disabled = true;
    btn.innerHTML = '<lucide-icon icon-name="loader" class="w-5 h-5 animate-spin"></lucide-icon> Wird eingelöst...';
    lucide.createIcons();

    try {
      const data = await Auth.apiRequest('/api/promo/redeem', {
        method: 'POST',
        body: JSON.stringify({ code })
      });

      // Success
      successDiv.innerHTML = `
        <strong>✅ ${data.message}</strong><br>
        <div style="margin-top: 10px;">
          ${data.bonus.workflows > 0 ? `<div>🎨 Workflows: +${data.bonus.workflows}</div>` : ''}
          ${data.bonus.tokens > 0 ? `<div>🎫 Tokens: +${data.bonus.tokens}</div>` : ''}
          ${data.bonus.durationDays > 0 ? `<div>⏱️ Dauer: ${data.bonus.durationDays} Tage</div>` : ''}
          ${data.bonus.description ? `<div style="margin-top: 8px; font-size: 13px; color: #6b7280;">${data.bonus.description}</div>` : ''}
        </div>
        ${data.note ? `<div style="margin-top: 12px; padding: 10px; background: #fef3c7; border-radius: 6px; font-size: 13px;">${data.note}</div>` : ''}
      `;
      successDiv.style.display = 'block';

      // Clear input
      input.value = '';

      // Refresh credits UI after 2 seconds
      setTimeout(() => {
        if (typeof CreditsUI !== 'undefined' && CreditsUI.displayStatus) {
          CreditsUI.displayStatus();
        }
        // Auto-close after 5 seconds
        setTimeout(() => {
          PromoCodeUI.closePromoCodeModal();
        }, 3000);
      }, 2000);

    } catch (error) {
      console.error('Redeem code error:', error);

      let errorMessage = 'Fehler beim Einlösen des Codes.';

      if (error.message.includes('Code ungültig')) {
        errorMessage = '❌ Dieser Code ist ungültig, abgelaufen oder bereits vollständig verwendet.';
      } else if (error.message.includes('Bereits eingelöst')) {
        errorMessage = '⚠️ Du hast diesen Code bereits eingelöst.';
      } else if (error.message.includes('Zu viele Versuche')) {
        errorMessage = '⏱️ ' + error.message;
      } else {
        errorMessage = '❌ ' + (error.message || errorMessage);
      }

      errorDiv.textContent = errorMessage;
      errorDiv.style.display = 'block';

    } finally {
      // Re-enable button
      btn.disabled = false;
      btn.innerHTML = '<lucide-icon icon-name="check-circle" class="w-5 h-5"></lucide-icon> Code einlösen';
      lucide.createIcons();
    }
  },

  // Show "Have a code?" banner in UI
  showPromoCodeBanner(containerId = 'promo-banner-container') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const html = `
      <div class="promo-code-banner">
        <div class="promo-banner-content">
          <div class="promo-banner-icon">
            <lucide-icon icon-name="gift" class="w-8 h-8"></lucide-icon>
          </div>
          <div class="promo-banner-text">
            <strong>Hast du einen Promo-Code?</strong>
            <p>Löse deinen Influencer- oder Partner-Code ein und erhalte bis zu 30 Workflows kostenlos!</p>
          </div>
        </div>
        <button onclick="PromoCodeUI.showPromoCodeModal()" class="btn-promo-banner">
          <lucide-icon icon-name="tag" class="w-5 h-5"></lucide-icon>
          Code einlösen
        </button>
      </div>
    `;

    container.innerHTML = html;
    lucide.createIcons();
  }
};

// Styles for promo code UI
const promoCodeStyles = `
  .modal-overlay-promo {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10001;
    animation: fadeIn 0.2s;
  }

  .modal-content-promo {
    background: white;
    border-radius: 16px;
    max-width: 550px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    animation: slideUp 0.3s;
  }

  .modal-header-promo {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    border-bottom: 1px solid #e5e7eb;
  }

  .modal-title-promo {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 24px;
    font-weight: bold;
    color: #1f2937;
    margin: 0;
  }

  .modal-close-promo {
    background: none;
    border: none;
    cursor: pointer;
    color: #6b7280;
    transition: color 0.2s;
  }

  .modal-close-promo:hover {
    color: #1f2937;
  }

  .modal-body-promo {
    padding: 24px;
  }

  .promo-description {
    color: #6b7280;
    margin-bottom: 24px;
    line-height: 1.6;
  }

  .promo-code-input-container {
    margin-bottom: 20px;
  }

  .promo-label {
    display: block;
    font-weight: 600;
    color: #374151;
    margin-bottom: 8px;
  }

  .promo-code-input {
    width: 100%;
    padding: 14px 16px;
    font-size: 16px;
    font-family: 'Courier New', monospace;
    font-weight: bold;
    text-transform: uppercase;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    transition: border-color 0.2s;
    letter-spacing: 1px;
  }

  .promo-code-input:focus {
    outline: none;
    border-color: #f59e0b;
  }

  .promo-error {
    margin-top: 12px;
    padding: 12px;
    background: #fee2e2;
    border-left: 4px solid #ef4444;
    border-radius: 4px;
    color: #991b1b;
    font-size: 14px;
  }

  .promo-success {
    margin-top: 12px;
    padding: 12px;
    background: #d1fae5;
    border-left: 4px solid #10b981;
    border-radius: 4px;
    color: #065f46;
    font-size: 14px;
  }

  .promo-examples {
    background: #f9fafb;
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 20px;
    font-size: 14px;
  }

  .promo-examples strong {
    color: #374151;
    display: block;
    margin-bottom: 8px;
  }

  .promo-examples ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .promo-examples li {
    padding: 6px 0;
    color: #6b7280;
  }

  .promo-examples code {
    background: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    font-weight: bold;
    color: #f59e0b;
    font-size: 13px;
  }

  .promo-info-box {
    background: #eff6ff;
    border-left: 4px solid #3b82f6;
    padding: 14px;
    border-radius: 4px;
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
    font-size: 14px;
    color: #1e40af;
  }

  .btn-redeem-code {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .btn-redeem-code:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-2px);
  }

  .btn-redeem-code:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .promo-code-banner {
    background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%);
    border: 2px solid #f59e0b;
    border-radius: 12px;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    margin-bottom: 24px;
  }

  .promo-banner-content {
    display: flex;
    align-items: center;
    gap: 16px;
    flex: 1;
  }

  .promo-banner-icon {
    color: #f59e0b;
    flex-shrink: 0;
  }

  .promo-banner-text strong {
    display: block;
    color: #78350f;
    font-size: 16px;
    margin-bottom: 4px;
  }

  .promo-banner-text p {
    margin: 0;
    color: #92400e;
    font-size: 14px;
  }

  .btn-promo-banner {
    padding: 10px 20px;
    background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
  }

  .btn-promo-banner:hover {
    opacity: 0.9;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
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

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .animate-spin {
    animation: spin 1s linear infinite;
  }

  @media (max-width: 640px) {
    .promo-code-banner {
      flex-direction: column;
      text-align: center;
    }

    .promo-banner-content {
      flex-direction: column;
    }

    .btn-promo-banner {
      width: 100%;
      justify-content: center;
    }
  }
`;

// Add styles to page
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = promoCodeStyles;
  document.head.appendChild(style);
}
