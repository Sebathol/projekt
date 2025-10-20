// Simple Weather App - Landing Page JavaScript

// Configuration - UPDATE THESE WITH ACTUAL VALUES
const CONFIG = {
    companyWebsite: '[IHRE-DOMAIN]', // TODO: Add your website
    moreAppsUrl: '[IHRE-DOMAIN]/apps', // TODO: Add apps page URL
    stripePublishableKey: 'pk_test_...', // TODO: Add Stripe key
    productPrice: 1.99,
    currency: 'EUR'
};

// Modal Functions
function showPurchase() {
    document.getElementById('purchase-modal').style.display = 'block';
    document.body.style.overflow = 'hidden';

    // Track event (add analytics here if needed)
    trackEvent('purchase_modal_opened');
}

function closePurchase() {
    document.getElementById('purchase-modal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal on outside click
window.onclick = function(event) {
    const modal = document.getElementById('purchase-modal');
    if (event.target === modal) {
        closePurchase();
    }
};

// Close modal on ESC key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closePurchase();
    }
});

// Smooth scroll to features
function scrollToFeatures() {
    document.getElementById('features').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Payment Processing
async function processPayment(method) {
    console.log(`Processing payment with ${method}...`);

    trackEvent('payment_initiated', { method: method });

    switch(method) {
        case 'stripe':
            await processStripePayment();
            break;
        case 'paypal':
            await processPayPalPayment();
            break;
        case 'google':
            await processGooglePayment();
            break;
        default:
            showError('Zahlungsmethode nicht verfügbar');
    }
}

// Stripe Payment Integration
async function processStripePayment() {
    // TODO: Replace with actual Stripe integration
    alert('Stripe-Zahlung wird vorbereitet...\n\nHinweis für Entwickler:\n1. Stripe Account erstellen: https://stripe.com\n2. Publishable Key in CONFIG eintragen\n3. Backend für Payment Intent erstellen\n4. Diese Funktion mit echtem Stripe-Code ersetzen');

    // Example Stripe integration (commented out):
    /*
    const stripe = Stripe(CONFIG.stripePublishableKey);

    const response = await fetch('/create-checkout-session', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            product: 'simple-weather-app',
            price: CONFIG.productPrice
        })
    });

    const session = await response.json();

    const result = await stripe.redirectToCheckout({
        sessionId: session.id
    });

    if (result.error) {
        showError(result.error.message);
    }
    */
}

// PayPal Payment Integration
async function processPayPalPayment() {
    // TODO: Replace with actual PayPal integration
    alert('PayPal-Zahlung wird vorbereitet...\n\nHinweis für Entwickler:\n1. PayPal Business Account erstellen\n2. PayPal SDK einbinden\n3. Diese Funktion mit echtem PayPal-Code ersetzen');

    // Example redirect to PayPal:
    // window.location.href = 'https://www.paypal.com/...';
}

// Google Pay Integration
async function processGooglePayment() {
    // TODO: Replace with actual Google Pay integration
    alert('Google Pay wird vorbereitet...\n\nHinweis für Entwickler:\n1. Google Pay API Setup\n2. Merchant Account konfigurieren\n3. Diese Funktion mit echtem Code ersetzen');
}

// Error Display
function showError(message) {
    alert('Fehler: ' + message);
    // TODO: Replace with nicer error display
}

// Success Handler
function handlePaymentSuccess() {
    closePurchase();

    // Show success message
    const successHTML = `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                    background: white; padding: 40px; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    text-align: center; z-index: 2000; max-width: 500px;">
            <h2 style="color: #44ff44; margin-bottom: 20px;">🎉 Zahlung erfolgreich!</h2>
            <p style="margin-bottom: 20px;">Vielen Dank für deinen Kauf!</p>
            <p style="margin-bottom: 30px;">Du erhältst in Kürze eine E-Mail mit dem Download-Link und deiner Rechnung.</p>
            <button onclick="window.location.href='index.html'"
                    style="padding: 15px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                           color: white; border: none; border-radius: 10px; font-size: 16px; cursor: pointer;">
                Zur App
            </button>
        </div>
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0,0,0,0.7); z-index: 1999;"></div>
    `;

    document.body.insertAdjacentHTML('beforeend', successHTML);

    trackEvent('purchase_completed');
}

// Analytics Tracking
function trackEvent(eventName, properties = {}) {
    // TODO: Add your analytics provider here (Google Analytics, Plausible, etc.)
    console.log('Event:', eventName, properties);

    // Example for Google Analytics:
    /*
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, properties);
    }
    */

    // Example for Plausible:
    /*
    if (typeof plausible !== 'undefined') {
        plausible(eventName, { props: properties });
    }
    */
}

// Update Links with actual URLs
function updateLinks() {
    // Company link
    const companyLink = document.getElementById('company-link');
    if (companyLink && CONFIG.companyWebsite !== '[IHRE-DOMAIN]') {
        companyLink.href = CONFIG.companyWebsite;
    }

    // More apps link
    const moreAppsLinks = document.querySelectorAll('#more-apps-link');
    moreAppsLinks.forEach(link => {
        if (CONFIG.moreAppsUrl !== '[IHRE-DOMAIN]/apps') {
            link.href = CONFIG.moreAppsUrl;
        }
    });

    // Ai Storm Create link
    const aiStormLinks = document.querySelectorAll('#ai-storm-link');
    aiStormLinks.forEach(link => {
        if (CONFIG.companyWebsite !== '[IHRE-DOMAIN]') {
            link.href = CONFIG.companyWebsite;
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updateLinks();
    trackEvent('landing_page_view');

    // Add scroll animations
    observeElements();
});

// Intersection Observer for scroll animations
function observeElements() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe feature cards and other elements
    document.querySelectorAll('.feature-card, .faq-item, .comparison-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// Social Share Functions
function shareOnTwitter() {
    const text = 'Schau dir diese coole Wetter-App an! Nur €1,99, werbefrei und ohne Abo! 🌤️';
    const url = window.location.href;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    trackEvent('share_twitter');
}

function shareOnFacebook() {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    trackEvent('share_facebook');
}

function shareViaEmail() {
    const subject = 'Simple Weather App - Einfach, günstig, werbefrei!';
    const body = 'Hey, ich habe diese coole Wetter-App gefunden! Nur €1,99 einmalig, keine Werbung, kein Abo. Schau mal: ' + window.location.href;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    trackEvent('share_email');
}

// Countdown Timer (Optional - for limited offers)
function startCountdown(endDate) {
    const timer = setInterval(function() {
        const now = new Date().getTime();
        const distance = endDate - now;

        if (distance < 0) {
            clearInterval(timer);
            return;
        }

        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Update countdown display (if you add one to the HTML)
        console.log(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);
}

// Newsletter Signup (Optional)
async function subscribeNewsletter(email) {
    trackEvent('newsletter_signup_attempt');

    // TODO: Implement newsletter subscription
    console.log('Newsletter signup:', email);

    // Example API call:
    /*
    const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email })
    });

    if (response.ok) {
        trackEvent('newsletter_signup_success');
        alert('Danke! Du hast dich erfolgreich angemeldet.');
    } else {
        showError('Anmeldung fehlgeschlagen. Bitte versuche es später erneut.');
    }
    */
}

// A/B Testing Helper (Optional)
function getVariant() {
    // Simple A/B test variant assignment
    const variant = Math.random() < 0.5 ? 'A' : 'B';
    localStorage.setItem('ab_variant', variant);
    return variant;
}

// Get or create variant
function getUserVariant() {
    let variant = localStorage.getItem('ab_variant');
    if (!variant) {
        variant = getVariant();
    }
    return variant;
}

console.log('Simple Weather App Landing Page loaded ✅');
console.log('User variant:', getUserVariant());
