/**
 * Werbe-Links UI Module
 * Displays advertising links in various locations (sidebar, footer, dashboard)
 */

const WerbeLinksUI = {
  links: [],
  config: {},
  rotationIndex: 0,
  rotationTimer: null,

  /**
   * Initialize werbe-links UI
   */
  async init() {
    try {
      await this.loadLinks();
      console.log(`Werbe-Links UI initialized with ${this.links.length} links`);
    } catch (error) {
      console.error('Error initializing werbe-links UI:', error);
    }
  },

  /**
   * Load werbe-links from API
   */
  async loadLinks() {
    try {
      const response = await fetch('/api/werbe-links');

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      this.links = data.links || [];
      this.config = data.config || {};

      console.log(`Loaded ${this.links.length} werbe-links`);

      return this.links;

    } catch (error) {
      console.error('Error loading werbe-links:', error);
      return [];
    }
  },

  /**
   * Render werbe-links in sidebar
   */
  renderSidebar(containerId = 'werbe-links-sidebar') {
    const container = document.getElementById(containerId);

    if (!container) {
      console.warn(`Container #${containerId} not found for sidebar werbe-links`);
      return;
    }

    if (this.links.length === 0) {
      container.innerHTML = '<p style="color: #999; font-size: 12px;">Keine Werbe-Links verfügbar</p>';
      return;
    }

    const html = `
      <div class="werbe-links-sidebar">
        <h3 class="werbe-links-title">Weitere Apps</h3>
        <div class="werbe-links-list">
          ${this.links.map(link => this.createLinkCard(link, 'sidebar')).join('')}
        </div>
      </div>
    `;

    container.innerHTML = html;

    // Setup rotation if enabled
    if (this.config.enableRotation) {
      this.startRotation(containerId);
    }
  },

  /**
   * Render werbe-links in footer
   */
  renderFooter(containerId = 'werbe-links-footer') {
    const container = document.getElementById(containerId);

    if (!container) {
      console.warn(`Container #${containerId} not found for footer werbe-links`);
      return;
    }

    if (this.links.length === 0) {
      container.style.display = 'none';
      return;
    }

    const html = `
      <div class="werbe-links-footer">
        <h4 class="werbe-links-footer-title">Weitere Empfehlungen</h4>
        <div class="werbe-links-footer-list">
          ${this.links.slice(0, 5).map(link => this.createLinkBadge(link)).join('')}
        </div>
      </div>
    `;

    container.innerHTML = html;
  },

  /**
   * Render werbe-links in dashboard
   */
  renderDashboard(containerId = 'werbe-links-dashboard') {
    const container = document.getElementById(containerId);

    if (!container) {
      console.warn(`Container #${containerId} not found for dashboard werbe-links`);
      return;
    }

    if (this.links.length === 0) {
      container.style.display = 'none';
      return;
    }

    const html = `
      <div class="werbe-links-dashboard">
        <h3 class="werbe-links-dashboard-title">🎯 Entdecke mehr</h3>
        <div class="werbe-links-grid">
          ${this.links.slice(0, 6).map(link => this.createLinkCard(link, 'dashboard')).join('')}
        </div>
      </div>
    `;

    container.innerHTML = html;
  },

  /**
   * Create link card HTML
   */
  createLinkCard(link, location = 'sidebar') {
    const hasImage = link.image && link.image !== '';

    return `
      <a href="${this.escapeHtml(link.url)}"
         class="werbe-link-card werbe-link-${location}"
         target="${link.target}"
         rel="noopener noreferrer"
         data-link-id="${link.id}">
        ${hasImage ? `
          <div class="werbe-link-image">
            <img src="${this.escapeHtml(link.image)}"
                 alt="${this.escapeHtml(link.title)}"
                 loading="lazy"
                 onerror="this.parentElement.style.display='none'">
          </div>
        ` : ''}
        <div class="werbe-link-content">
          <h4 class="werbe-link-title">${this.escapeHtml(link.title)}</h4>
          ${link.description ? `
            <p class="werbe-link-description">${this.escapeHtml(link.description)}</p>
          ` : ''}
          <span class="werbe-link-arrow">→</span>
        </div>
      </a>
    `;
  },

  /**
   * Create link badge HTML (compact version for footer)
   */
  createLinkBadge(link) {
    return `
      <a href="${this.escapeHtml(link.url)}"
         class="werbe-link-badge"
         target="${link.target}"
         rel="noopener noreferrer"
         data-link-id="${link.id}"
         title="${this.escapeHtml(link.description || link.title)}">
        ${this.escapeHtml(link.title)}
      </a>
    `;
  },

  /**
   * Start rotation timer
   */
  startRotation(containerId) {
    if (this.rotationTimer) {
      clearInterval(this.rotationTimer);
    }

    this.rotationTimer = setInterval(() => {
      this.rotateLinks(containerId);
    }, this.config.rotationInterval || 5000);
  },

  /**
   * Rotate links display
   */
  rotateLinks(containerId) {
    if (this.links.length <= 1) return;

    this.rotationIndex = (this.rotationIndex + 1) % this.links.length;

    const container = document.getElementById(containerId);
    if (!container) return;

    const cards = container.querySelectorAll('.werbe-link-card');
    cards.forEach((card, index) => {
      if (index === this.rotationIndex) {
        card.classList.add('werbe-link-active');
      } else {
        card.classList.remove('werbe-link-active');
      }
    });
  },

  /**
   * Track link click (for analytics)
   */
  trackClick(linkId) {
    console.log(`Werbe-Link clicked: ${linkId}`);

    // Optional: Send analytics to backend
    // fetch('/api/werbe-links/track-click', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ linkId })
    // });
  },

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  /**
   * Reload werbe-links
   */
  async reload() {
    await this.loadLinks();

    // Re-render all locations
    if (document.getElementById('werbe-links-sidebar')) {
      this.renderSidebar();
    }
    if (document.getElementById('werbe-links-footer')) {
      this.renderFooter();
    }
    if (document.getElementById('werbe-links-dashboard')) {
      this.renderDashboard();
    }

    console.log('Werbe-Links reloaded and re-rendered');
  }
};

// Auto-initialize on DOM load
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', async () => {
    await WerbeLinksUI.init();

    // Auto-render if containers exist
    if (document.getElementById('werbe-links-sidebar')) {
      WerbeLinksUI.renderSidebar();
    }
    if (document.getElementById('werbe-links-footer')) {
      WerbeLinksUI.renderFooter();
    }
    if (document.getElementById('werbe-links-dashboard')) {
      WerbeLinksUI.renderDashboard();
    }
  });
}

// Expose globally
if (typeof window !== 'undefined') {
  window.WerbeLinksUI = WerbeLinksUI;
}
