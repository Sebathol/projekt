// Simple Weather App - Landing Page JavaScript

// Configuration - UPDATE THESE WITH ACTUAL VALUES
const CONFIG = {
    companyWebsite: '[IHRE-DOMAIN]', // TODO: Add your website
    moreAppsUrl: '[IHRE-DOMAIN]/apps', // TODO: Add apps page URL
    stripePublishableKey: 'pk_test_...', // TODO: Add Stripe key
    currency: 'EUR',
    workflowPrice: 1.90
};

// Subscription Plans
const SUBSCRIPTION_PLANS = {
    daily: {
        name: 'Tagesabo',
        price: 4.90,
        workflows: 6,
        period: 'Tag',
        description: '6 Workflows pro Tag'
    },
    weekly: {
        name: 'Wochenabo',
        price: 9.90,
        workflows: 12,
        period: 'Woche',
        description: '12 Workflows pro Woche'
    },
    monthly: {
        name: 'Monatsabo',
        price: 29.90,
        workflows: 35,
        period: 'Monat',
        description: '35 Workflows pro Monat'
    },
    yearly: {
        name: 'Jahresabo',
        price: 249.90,
        workflows: 35,
        period: 'Jahr',
        description: '35 Workflows pro Monat'
    }
};

// Current selected plan
let selectedPlan = null;

// Modal Functions
function selectPlan(planType) {
    selectedPlan = SUBSCRIPTION_PLANS[planType];

    if (!selectedPlan) {
        console.error('Invalid plan type:', planType);
        return;
    }

    // Update modal content
    document.getElementById('modal-plan-title').textContent = selectedPlan.name + ' abschließen';
    document.getElementById('modal-plan-name').textContent = selectedPlan.name;
    document.getElementById('modal-plan-price').textContent = '€' + selectedPlan.price.toFixed(2);
    document.getElementById('modal-plan-workflows').textContent = selectedPlan.workflows + ' Workflows';
    document.getElementById('modal-total-price').textContent = '€' + selectedPlan.price.toFixed(2);

    // Show modal
    document.getElementById('subscription-modal').style.display = 'block';
    document.body.style.overflow = 'hidden';

    // Track event
    trackEvent('subscription_plan_selected', { plan: planType, price: selectedPlan.price });
}

function closeSubscription() {
    document.getElementById('subscription-modal').style.display = 'none';
    document.body.style.overflow = 'auto';
    selectedPlan = null;
}

function showPricing() {
    document.getElementById('pricing').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

function showWorkflowPurchase() {
    document.getElementById('workflow-modal').style.display = 'block';
    document.body.style.overflow = 'hidden';
    updateWorkflowPrice();
    trackEvent('workflow_purchase_modal_opened');
}

function closeWorkflowModal() {
    document.getElementById('workflow-modal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function updateWorkflowPrice() {
    const quantity = parseInt(document.getElementById('workflow-quantity').value) || 1;
    const total = (quantity * CONFIG.workflowPrice).toFixed(2);
    document.getElementById('workflow-total-price').textContent = '€' + total;
}

// Close modal on outside click
window.onclick = function(event) {
    const subscriptionModal = document.getElementById('subscription-modal');
    const workflowModal = document.getElementById('workflow-modal');

    if (event.target === subscriptionModal) {
        closeSubscription();
    } else if (event.target === workflowModal) {
        closeWorkflowModal();
    }
};

// Close modal on ESC key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeSubscription();
        closeWorkflowModal();
    }
});

// Smooth scroll to features
function scrollToFeatures() {
    document.getElementById('features').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Subscription Processing
async function processSubscription(method) {
    if (!selectedPlan) {
        showError('Bitte wähle zuerst ein Abo-Modell');
        return;
    }

    console.log(`Processing subscription with ${method}...`, selectedPlan);

    trackEvent('subscription_initiated', {
        method: method,
        plan: selectedPlan.name,
        price: selectedPlan.price
    });

    switch(method) {
        case 'stripe':
            await processStripeSubscription();
            break;
        case 'paypal':
            await processPayPalSubscription();
            break;
        case 'google':
            await processGoogleSubscription();
            break;
        default:
            showError('Zahlungsmethode nicht verfügbar');
    }
}

// Workflow Purchase Processing
async function processWorkflowPurchase() {
    const quantity = parseInt(document.getElementById('workflow-quantity').value) || 1;
    const total = (quantity * CONFIG.workflowPrice).toFixed(2);

    console.log(`Purchasing ${quantity} workflows for €${total}...`);

    trackEvent('workflow_purchase_initiated', {
        quantity: quantity,
        total: total
    });

    // TODO: Implement actual workflow purchase logic
    alert(`Workflows werden gekauft...\n\nAnzahl: ${quantity}\nPreis: €${total}\n\nHinweis für Entwickler: Hier muss die echte Zahlungslogik implementiert werden.`);

    // Simulate success
    setTimeout(() => {
        closeWorkflowModal();
        handleWorkflowPurchaseSuccess(quantity);
    }, 1000);
}

// Stripe Subscription Integration
async function processStripeSubscription() {
    // TODO: Replace with actual Stripe Subscription integration
    alert(`Stripe-Abo wird vorbereitet...\n\nAbo: ${selectedPlan.name}\nPreis: €${selectedPlan.price}\nWorkflows: ${selectedPlan.workflows}\n\nHinweis für Entwickler:\n1. Stripe Account erstellen: https://stripe.com\n2. Subscription Products in Stripe anlegen\n3. Backend für Subscription erstellen\n4. Diese Funktion mit echtem Stripe-Code ersetzen`);

    // Example Stripe Subscription integration (commented out):
    /*
    const stripe = Stripe(CONFIG.stripePublishableKey);

    const response = await fetch('/create-subscription-session', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            plan: selectedPlan.name,
            price: selectedPlan.price,
            workflows: selectedPlan.workflows
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

    // Simulate success for demo
    setTimeout(() => {
        handleSubscriptionSuccess();
    }, 1000);
}

// PayPal Subscription Integration
async function processPayPalSubscription() {
    // TODO: Replace with actual PayPal Subscription integration
    alert(`PayPal-Abo wird vorbereitet...\n\nAbo: ${selectedPlan.name}\nPreis: €${selectedPlan.price}\n\nHinweis für Entwickler:\n1. PayPal Business Account erstellen\n2. Subscription Plans in PayPal anlegen\n3. Diese Funktion mit echtem PayPal-Code ersetzen`);

    // Example redirect to PayPal:
    // window.location.href = 'https://www.paypal.com/...';
}

// Google Pay Subscription Integration
async function processGoogleSubscription() {
    // TODO: Replace with actual Google Pay Subscription integration
    alert(`Google Pay-Abo wird vorbereitet...\n\nAbo: ${selectedPlan.name}\nPreis: €${selectedPlan.price}\n\nHinweis für Entwickler:\n1. Google Pay API Setup\n2. Subscription Merchant Account konfigurieren\n3. Diese Funktion mit echtem Code ersetzen`);
}

// Error Display
function showError(message) {
    alert('Fehler: ' + message);
    // TODO: Replace with nicer error display
}

// Success Handlers
function handleSubscriptionSuccess() {
    closeSubscription();

    // Show success message
    const successHTML = `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                    background: white; padding: 40px; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    text-align: center; z-index: 2000; max-width: 500px;">
            <h2 style="color: #44ff44; margin-bottom: 20px;">🎉 Abo erfolgreich abgeschlossen!</h2>
            <p style="margin-bottom: 20px;">Vielen Dank für dein Abo!</p>
            <p style="margin-bottom: 30px;">Du erhältst in Kürze eine E-Mail mit allen Details und deiner Rechnung.<br>
            Deine ${selectedPlan.workflows} Workflows stehen dir jetzt zur Verfügung!</p>
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

    trackEvent('subscription_completed', {
        plan: selectedPlan.name,
        price: selectedPlan.price
    });
}

function handleWorkflowPurchaseSuccess(quantity) {
    // Show success message
    const successHTML = `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                    background: white; padding: 40px; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    text-align: center; z-index: 2000; max-width: 500px;">
            <h2 style="color: #44ff44; margin-bottom: 20px;">🎉 Workflows gekauft!</h2>
            <p style="margin-bottom: 20px;">${quantity} Workflow${quantity > 1 ? 's' : ''} wurden deinem Konto gutgeschrieben!</p>
            <button onclick="this.parentElement.nextElementSibling.remove(); this.parentElement.remove();"
                    style="padding: 15px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                           color: white; border: none; border-radius: 10px; font-size: 16px; cursor: pointer;">
                OK
            </button>
        </div>
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0,0,0,0.7); z-index: 1999;" onclick="this.previousElementSibling.querySelector('button').click();"></div>
    `;

    document.body.insertAdjacentHTML('beforeend', successHTML);

    trackEvent('workflow_purchase_completed', {
        quantity: quantity,
        total: quantity * CONFIG.workflowPrice
    });
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
