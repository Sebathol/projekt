/**
 * Google AdMob Integration (Client-Side)
 * Handles banner ads, interstitial ads, and rewarded videos
 */

const AdMob = {
  config: null,
  bannerElement: null,
  videosWatched: 0,

  // Initialize AdMob
  async init() {
    try {
      // Load AdMob config
      const response = await fetch('/config/admob-config.json');
      this.config = await response.json();

      console.log('✅ AdMob initialized', this.config.testMode ? '(Test Mode)' : '');

      // Create banner containers if not exist
      this.createBannerContainers();

      // Show banners by default
      this.showBanners();
    } catch (error) {
      console.error('❌ AdMob init error:', error);
    }
  },

  // Create banner ad containers
  createBannerContainers() {
    // Top banner
    if (!document.getElementById('admob-banner-top')) {
      const topBanner = document.createElement('div');
      topBanner.id = 'admob-banner-top';
      topBanner.className = 'admob-banner-top';
      topBanner.innerHTML = `
        <div class="ad-container">
          <div class="ad-label">Werbung</div>
          <div id="ad-banner-top" class="ad-content">
            ${this.config && this.config.testMode ? this.getMockBanner() : ''}
          </div>
        </div>
      `;
      document.body.prepend(topBanner);
    }

    // Bottom banner
    if (!document.getElementById('admob-banner-bottom')) {
      const bottomBanner = document.createElement('div');
      bottomBanner.id = 'admob-banner-bottom';
      bottomBanner.className = 'admob-banner-bottom';
      bottomBanner.innerHTML = `
        <div class="ad-container">
          <div class="ad-label">Werbung</div>
          <div id="ad-banner-bottom" class="ad-content">
            ${this.config && this.config.testMode ? this.getMockBanner() : ''}
          </div>
        </div>
      `;
      document.body.append(bottomBanner);
    }

    // Add styles
    this.addBannerStyles();
  },

  // Add banner styles
  addBannerStyles() {
    if (document.getElementById('admob-styles')) return;

    const style = document.createElement('style');
    style.id = 'admob-styles';
    style.textContent = `
      .admob-banner-top,
      .admob-banner-bottom {
        position: sticky;
        z-index: 1000;
        width: 100%;
        background: #f5f5f5;
        border-bottom: 1px solid #ddd;
      }

      .admob-banner-top {
        top: 0;
      }

      .admob-banner-bottom {
        bottom: 0;
        border-top: 1px solid #ddd;
        border-bottom: none;
      }

      .ad-container {
        max-width: 728px;
        margin: 0 auto;
        padding: 8px;
        text-align: center;
      }

      .ad-label {
        font-size: 10px;
        color: #999;
        text-transform: uppercase;
        margin-bottom: 4px;
      }

      .ad-content {
        min-height: 90px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: white;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
      }

      .mock-ad {
        padding: 20px;
        color: #666;
        font-size: 14px;
      }

      @media (max-width: 768px) {
        .ad-content {
          min-height: 50px;
        }
      }
    `;
    document.head.appendChild(style);
  },

  // Get mock banner HTML (for testing)
  getMockBanner() {
    return `<div class="mock-ad">🎨 Werbung (Test Mode)</div>`;
  },

  // Show banner ads
  showBanners() {
    const topBanner = document.getElementById('admob-banner-top');
    const bottomBanner = document.getElementById('admob-banner-bottom');

    if (topBanner) topBanner.style.display = 'block';
    if (bottomBanner) bottomBanner.style.display = 'block';

    // In production, load real AdMob banners
    if (this.config && !this.config.testMode) {
      this.loadGoogleAdSense();
    }

    // Rotate banners every 30 seconds
    this.startBannerRotation();
  },

  // Hide banner ads
  hideBanners() {
    const topBanner = document.getElementById('admob-banner-top');
    const bottomBanner = document.getElementById('admob-banner-bottom');

    if (topBanner) topBanner.style.display = 'none';
    if (bottomBanner) bottomBanner.style.display = 'none';
  },

  // Start banner rotation
  startBannerRotation() {
    setInterval(() => {
      // Refresh ads (in real implementation, this would reload the ad units)
      console.log('🔄 Rotating banner ads...');

      if (this.config && this.config.testMode) {
        // Update mock ads
        const topAd = document.getElementById('ad-banner-top');
        const bottomAd = document.getElementById('ad-banner-bottom');

        if (topAd) {
          topAd.innerHTML = `<div class="mock-ad">🎨 Werbung (Rotiert ${new Date().toLocaleTimeString()})</div>`;
        }
        if (bottomAd) {
          bottomAd.innerHTML = `<div class="mock-ad">🎨 Werbung (Rotiert ${new Date().toLocaleTimeString()})</div>`;
        }
      }
    }, 30000); // Every 30 seconds
  },

  // Load Google AdSense (for real ads)
  loadGoogleAdSense() {
    if (document.getElementById('google-adsense-script')) return;

    const script = document.createElement('script');
    script.id = 'google-adsense-script';
    script.async = true;
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
    script.setAttribute('data-ad-client', this.config.bannerAdUnitId.split('/')[0]);

    script.onerror = () => {
      console.warn('⚠️ AdSense script failed to load (ad blocker?)');
    };

    document.head.appendChild(script);
  },

  // Show interstitial ad (between workflow steps)
  async showInterstitial() {
    return new Promise((resolve, reject) => {
      console.log('📺 Showing interstitial ad...');

      if (this.config && this.config.testMode) {
        // Mock interstitial
        this.showMockInterstitial().then(resolve).catch(reject);
      } else {
        // Real AdMob interstitial
        // TODO: Implement real AdMob SDK when converting to mobile app
        this.showMockInterstitial().then(resolve).catch(reject);
      }
    });
  },

  // Show mock interstitial (for testing)
  showMockInterstitial() {
    return new Promise((resolve) => {
      // Create modal overlay
      const modal = document.createElement('div');
      modal.id = 'interstitial-modal';
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.9);
        z-index: 10000;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: white;
      `;

      const content = `
        <div style="text-align: center; max-width: 500px; padding: 20px;">
          <h2 style="margin-bottom: 20px;">📺 Interstitial Ad</h2>
          <div style="background: #333; padding: 60px 40px; border-radius: 8px; margin: 20px 0;">
            <p style="font-size: 18px; margin: 0;">🎬 Video Ad (30-60 Sekunden)</p>
            <p style="margin-top: 10px; color: #999; font-size: 14px;">Test Mode</p>
          </div>
          <div style="margin-top: 20px;">
            <p style="color: #999; font-size: 14px;">Schließt automatisch in <span id="countdown">5</span> Sekunden...</p>
          </div>
          <button id="skip-ad-btn" style="
            margin-top: 20px;
            padding: 12px 24px;
            background: #f59e0b;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            display: none;
          ">
            Werbung überspringen
          </button>
        </div>
      `;

      modal.innerHTML = content;
      document.body.appendChild(modal);

      // Countdown timer
      let seconds = 5;
      const countdownEl = document.getElementById('countdown');
      const skipBtn = document.getElementById('skip-ad-btn');

      const timer = setInterval(() => {
        seconds--;
        if (countdownEl) countdownEl.textContent = seconds;

        if (seconds <= 0) {
          clearInterval(timer);
          document.body.removeChild(modal);
          resolve(true);
        } else if (seconds === 3 && skipBtn) {
          skipBtn.style.display = 'block';
        }
      }, 1000);

      // Skip button
      if (skipBtn) {
        skipBtn.onclick = () => {
          clearInterval(timer);
          document.body.removeChild(modal);
          resolve(true);
        };
      }
    });
  },

  // Show rewarded video ad (for bonus workflows)
  async showRewardedVideo() {
    return new Promise((resolve, reject) => {
      console.log('🎁 Showing rewarded video ad...');

      if (this.config && this.config.testMode) {
        // Mock rewarded video
        this.showMockRewardedVideo().then((watched) => {
          if (watched) {
            this.videosWatched++;
            resolve({ watched: true, totalWatched: this.videosWatched });
          } else {
            resolve({ watched: false, totalWatched: this.videosWatched });
          }
        });
      } else {
        // Real AdMob rewarded video
        // TODO: Implement real AdMob SDK when converting to mobile app
        this.showMockRewardedVideo().then((watched) => {
          if (watched) {
            this.videosWatched++;
            resolve({ watched: true, totalWatched: this.videosWatched });
          } else {
            resolve({ watched: false, totalWatched: this.videosWatched });
          }
        });
      }
    });
  },

  // Show mock rewarded video (for testing)
  showMockRewardedVideo() {
    return new Promise((resolve) => {
      // Create modal overlay
      const modal = document.createElement('div');
      modal.id = 'rewarded-video-modal';
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.95);
        z-index: 10000;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: white;
      `;

      const content = `
        <div style="text-align: center; max-width: 500px; padding: 20px;">
          <h2 style="margin-bottom: 10px;">🎁 Bonus-Workflow freischalten</h2>
          <p style="color: #fbbf24; margin-bottom: 30px;">Schaue 2 Videos = 1 gratis Workflow!</p>

          <div style="background: #1f2937; padding: 60px 40px; border-radius: 8px; margin: 20px 0;">
            <p style="font-size: 24px; margin: 0;">🎬 Video Ad</p>
            <p style="margin-top: 10px; color: #999; font-size: 14px;">Test Mode</p>
            <div style="margin-top: 20px;">
              <div style="color: #fbbf24; font-size: 18px; font-weight: bold;">
                <span id="video-countdown">30</span> Sekunden
              </div>
              <div style="width: 100%; height: 4px; background: #374151; border-radius: 2px; margin-top: 10px;">
                <div id="video-progress" style="width: 0%; height: 100%; background: #fbbf24; border-radius: 2px; transition: width 0.3s;"></div>
              </div>
            </div>
          </div>

          <div style="display: flex; gap: 10px; justify-content: center;">
            <button id="cancel-video-btn" style="
              padding: 12px 24px;
              background: #6b7280;
              color: white;
              border: none;
              border-radius: 8px;
              cursor: pointer;
              font-size: 16px;
            ">
              Abbrechen
            </button>
            <button id="complete-video-btn" style="
              padding: 12px 24px;
              background: #10b981;
              color: white;
              border: none;
              border-radius: 8px;
              cursor: pointer;
              font-size: 16px;
              display: none;
            ">
              ✓ Video beendet
            </button>
          </div>

          <p style="margin-top: 20px; color: #9ca3af; font-size: 12px;">
            Videos geschaut: ${this.videosWatched} / 2
          </p>
        </div>
      `;

      modal.innerHTML = content;
      document.body.appendChild(modal);

      // Video countdown
      let seconds = 30;
      const countdownEl = document.getElementById('video-countdown');
      const progressEl = document.getElementById('video-progress');
      const completeBtn = document.getElementById('complete-video-btn');
      const cancelBtn = document.getElementById('cancel-video-btn');

      const timer = setInterval(() => {
        seconds--;
        if (countdownEl) countdownEl.textContent = seconds;
        if (progressEl) {
          const progress = ((30 - seconds) / 30) * 100;
          progressEl.style.width = `${progress}%`;
        }

        if (seconds <= 0) {
          clearInterval(timer);
          if (completeBtn) completeBtn.style.display = 'block';
          if (cancelBtn) cancelBtn.style.display = 'none';
        }
      }, 1000);

      // Cancel button
      if (cancelBtn) {
        cancelBtn.onclick = () => {
          clearInterval(timer);
          document.body.removeChild(modal);
          resolve(false);
        };
      }

      // Complete button
      if (completeBtn) {
        completeBtn.onclick = () => {
          document.body.removeChild(modal);
          resolve(true);
        };
      }
    });
  },

  // Claim ad reward on backend
  async claimAdReward(adType = 'rewarded_video') {
    try {
      const data = await Auth.apiRequest('/api/usage/ad-reward', {
        method: 'POST',
        body: JSON.stringify({
          adType,
          videosWatched: this.videosWatched
        })
      });

      if (data.workflowsEarned > 0) {
        this.videosWatched = 0; // Reset counter
      }

      return data;
    } catch (error) {
      console.error('Claim ad reward error:', error);
      throw error;
    }
  }
};

// Auto-initialize AdMob when script loads
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    AdMob.init();
  });
}
