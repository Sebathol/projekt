// Password Protection
const MASTER_PASSWORD = 'JoHanna268219$';
const LAUNCH_DISCOUNT_LIMIT = 100; // Erste 100 Kunden bekommen 50% Rabatt

let isAuthenticated = false;
let licenses = [];
let bundles = [];
let influencers = [];

// Pricing (reguläre Preise)
const PRICING = {
  basic: { regular: 4.99, launch: 2.49 },
  pro: { regular: 9.99, launch: 4.99 },
  business: { regular: 24.99, launch: 12.49 }
};

// Bundle Pricing
const BUNDLE_PRICING = {
  5: 19.99,
  10: 34.99,
  25: 74.99
};

// Load data from localStorage
function loadData() {
  const storedLicenses = localStorage.getItem('pdf_licenses');
  const storedBundles = localStorage.getItem('pdf_bundles');
  const storedInfluencers = localStorage.getItem('pdf_influencers');

  if (storedLicenses) {
    licenses = JSON.parse(storedLicenses);
  }
  if (storedBundles) {
    bundles = JSON.parse(storedBundles);
  }
  if (storedInfluencers) {
    influencers = JSON.parse(storedInfluencers);
  }

  updateDashboard();
  updateLicenseList();
  updateBundleList();
  updateInfluencerList();
}

// Save data to localStorage
function saveLicenses() {
  localStorage.setItem('pdf_licenses', JSON.stringify(licenses));
  updateDashboard();
  updateLicenseList();
}

function saveBundles() {
  localStorage.setItem('pdf_bundles', JSON.stringify(bundles));
  updateDashboard();
  updateBundleList();
}

function saveInfluencers() {
  localStorage.setItem('pdf_influencers', JSON.stringify(influencers));
  updateDashboard();
  updateInfluencerList();
}

// Login function
function login() {
  const password = document.getElementById('password').value;
  const errorDiv = document.getElementById('loginError');

  if (password === MASTER_PASSWORD) {
    isAuthenticated = true;
    document.getElementById('loginContent').classList.remove('active');
    document.getElementById('mainContent').classList.add('active');
    errorDiv.style.display = 'none';
    loadData();
  } else {
    errorDiv.textContent = '❌ Falsches Passwort!';
    errorDiv.style.display = 'block';
  }
}

// Handle Enter key on password field
document.addEventListener('DOMContentLoaded', () => {
  const passwordField = document.getElementById('password');
  if (passwordField) {
    passwordField.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        login();
      }
    });
  }

  // Handle bundle quantity selection
  const bundleQuantity = document.getElementById('bundleQuantity');
  if (bundleQuantity) {
    bundleQuantity.addEventListener('change', (e) => {
      const customGroup = document.getElementById('customQuantityGroup');
      if (e.target.value === 'custom') {
        customGroup.style.display = 'block';
      } else {
        customGroup.style.display = 'none';
      }
    });
  }
});

// Tab switching
function switchTab(tabName) {
  // Update tab buttons
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => tab.classList.remove('active'));
  event.target.classList.add('active');

  // Update tab content
  const contents = document.querySelectorAll('.tab-content');
  contents.forEach(content => content.classList.remove('active'));
  document.getElementById(tabName).classList.add('active');
}

// Generate License Key
function generateLicense() {
  const customerName = document.getElementById('customerName').value || 'Anonymous';
  const level = document.getElementById('licenseLevel').value;
  const source = document.getElementById('licenseSource').value;

  // Generate unique license key
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const licenseKey = `PDF-${level.toUpperCase()}-${timestamp.toString(36).toUpperCase()}-${random.toUpperCase()}`;

  // Determine price (launch discount?)
  const licenseCount = licenses.length;
  const isLaunchPrice = licenseCount < LAUNCH_DISCOUNT_LIMIT;
  const price = isLaunchPrice ? PRICING[level].launch : PRICING[level].regular;

  // Create license object
  const license = {
    key: licenseKey,
    customer: customerName,
    level: level,
    source: source,
    price: price,
    launchDiscount: isLaunchPrice,
    generated: new Date().toISOString(),
    status: 'active'
  };

  // Add to licenses array
  licenses.push(license);
  saveLicenses();

  // Display license
  document.getElementById('licenseKeyDisplay').textContent = licenseKey;
  document.getElementById('generatedLicense').style.display = 'block';

  // Scroll to license
  document.getElementById('generatedLicense').scrollIntoView({ behavior: 'smooth' });
}

// Copy license to clipboard
function copyLicense() {
  const licenseKey = document.getElementById('licenseKeyDisplay').textContent;
  copyToClipboard(licenseKey, 'Lizenz-Key');
}

// Generate Bundle
function generateBundle() {
  const company = document.getElementById('bundleCompany').value || 'Unknown Company';
  const quantitySelect = document.getElementById('bundleQuantity').value;

  let quantity, price;

  if (quantitySelect === 'custom') {
    quantity = parseInt(document.getElementById('customQuantity').value);
    if (!quantity || quantity < 1) {
      alert('Bitte gib eine gültige Anzahl ein!');
      return;
    }
    // Custom pricing: €3.50 per license for custom bundles
    price = (quantity * 3.50).toFixed(2);
  } else {
    quantity = parseInt(quantitySelect);
    price = BUNDLE_PRICING[quantity];
  }

  // Generate bundle code
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 10).toUpperCase();
  const bundleCode = `BUNDLE-${quantity}X-${timestamp.toString(36).toUpperCase()}-${random}`;

  // Create bundle object
  const bundle = {
    code: bundleCode,
    company: company,
    quantity: quantity,
    price: price,
    redeemed: 0,
    generated: new Date().toISOString(),
    status: 'active'
  };

  bundles.push(bundle);
  saveBundles();

  alert(`✅ Bundle erstellt!\n\nCode: ${bundleCode}\nAnzahl: ${quantity} Lizenzen\nPreis: €${price}`);
}

// Create Influencer
function createInfluencer() {
  const name = document.getElementById('influencerName').value;
  const email = document.getElementById('influencerEmail').value;
  const platform = document.getElementById('influencerPlatform').value;
  const followers = document.getElementById('influencerFollowers').value || '0';

  if (!name || !email) {
    alert('Bitte fülle Name und Email aus!');
    return;
  }

  // Generate influencer ID
  const influencerId = Math.random().toString(36).substring(2, 10).toUpperCase();

  // Generate 3-month test license (Pro)
  const timestamp = Date.now();
  const expiryDate = new Date(timestamp + (90 * 24 * 60 * 60 * 1000)); // 90 days
  const testLicenseKey = `PDF-PRO-INFLUENCER-${influencerId}-${timestamp.toString(36).toUpperCase()}`;

  // Generate tracking code
  const trackingCode = `INF-${influencerId}`;

  // Generate affiliate link (35% discount)
  const affiliateLink = `https://yourwebsite.com/buy?ref=${trackingCode}&discount=35`;

  // Create influencer object
  const influencer = {
    id: influencerId,
    name: name,
    email: email,
    platform: platform,
    followers: parseInt(followers),
    testLicense: testLicenseKey,
    trackingCode: trackingCode,
    affiliateLink: affiliateLink,
    expiryDate: expiryDate.toISOString(),
    sales: 0,
    revenue: 0,
    created: new Date().toISOString(),
    status: 'active'
  };

  influencers.push(influencer);
  saveInfluencers();

  // Show influencer info
  document.getElementById('influencerTestKey').textContent = testLicenseKey;
  document.getElementById('influencerAffiliateLink').textContent = affiliateLink;
  document.getElementById('influencerTrackingCode').textContent = trackingCode;
  document.getElementById('influencerCreated').style.display = 'block';

  // Scroll to result
  document.getElementById('influencerCreated').scrollIntoView({ behavior: 'smooth' });
}

// Copy functions for influencer
function copyInfluencerKey() {
  const key = document.getElementById('influencerTestKey').textContent;
  copyToClipboard(key, 'Test-Lizenz');
}

function copyAffiliateLink() {
  const link = document.getElementById('influencerAffiliateLink').textContent;
  copyToClipboard(link, 'Affiliate-Link');
}

// Generic copy to clipboard function
function copyToClipboard(text, label) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      alert(`✅ ${label} in Zwischenablage kopiert!`);
    });
  } else {
    // Fallback
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    alert(`✅ ${label} in Zwischenablage kopiert!`);
  }
}

// Update Dashboard
function updateDashboard() {
  // Calculate total revenue
  const licenseRevenue = licenses.reduce((sum, lic) => sum + (lic.price || 0), 0);
  const bundleRevenue = bundles.reduce((sum, bun) => sum + parseFloat(bun.price || 0), 0);
  const totalRevenue = licenseRevenue + bundleRevenue;

  // Influencer revenue (from their generated sales)
  const influencerRevenue = influencers.reduce((sum, inf) => sum + (inf.revenue || 0), 0);

  // Update dashboard stats
  document.getElementById('totalRevenue').textContent = `€${totalRevenue.toFixed(2)}`;
  document.getElementById('totalLicenses').textContent = licenses.length;
  document.getElementById('totalInfluencers').textContent = influencers.filter(i => i.status === 'active').length;
  document.getElementById('influencerRevenue').textContent = `€${influencerRevenue.toFixed(2)}`;

  // Launch discount counter
  document.getElementById('launchCount').textContent = licenses.length;

  // Also update in pricing tab if exists
  const launchCountElements = document.querySelectorAll('#launchCount');
  launchCountElements.forEach(el => {
    el.textContent = licenses.length;
  });
}

// Update license list display
function updateLicenseList() {
  const listDiv = document.getElementById('licenseList');
  const countSpan = document.getElementById('licenseCount');

  if (countSpan) {
    countSpan.textContent = licenses.length;
  }

  if (licenses.length === 0) {
    listDiv.innerHTML = '<p style="color: #999;">Noch keine Lizenzen generiert.</p>';
    return;
  }

  let html = '<div style="overflow-x: auto;"><table>';
  html += '<thead><tr>';
  html += '<th>Kunde</th>';
  html += '<th>Level</th>';
  html += '<th>Preis</th>';
  html += '<th>Key</th>';
  html += '<th>Datum</th>';
  html += '</tr></thead><tbody>';

  // Show latest 20 licenses
  const recentLicenses = licenses.slice(-20).reverse();

  recentLicenses.forEach((license) => {
    const date = new Date(license.generated).toLocaleDateString('de-DE');
    const discount = license.launchDiscount ? '<span class="badge badge-warning">-50% LAUNCH</span>' : '';

    html += `<tr>`;
    html += `<td>${license.customer}</td>`;
    html += `<td><span class="badge badge-info">${license.level.toUpperCase()}</span></td>`;
    html += `<td>€${license.price} ${discount}</td>`;
    html += `<td style="font-family: monospace; font-size: 12px;">${license.key.substring(0, 30)}...</td>`;
    html += `<td>${date}</td>`;
    html += `</tr>`;
  });

  html += '</tbody></table></div>';

  if (licenses.length > 20) {
    html += `<p style="text-align: center; color: #666; margin-top: 10px;">Zeige neueste 20 von ${licenses.length} Lizenzen</p>`;
  }

  listDiv.innerHTML = html;
}

// Update bundle list display
function updateBundleList() {
  const listDiv = document.getElementById('bundleList');
  const countSpan = document.getElementById('bundleCount');

  if (countSpan) {
    countSpan.textContent = bundles.length;
  }

  if (bundles.length === 0) {
    listDiv.innerHTML = '<p style="color: #999;">Noch keine Bundles erstellt.</p>';
    return;
  }

  let html = '<div style="overflow-x: auto;"><table>';
  html += '<thead><tr>';
  html += '<th>Firma</th>';
  html += '<th>Anzahl</th>';
  html += '<th>Preis</th>';
  html += '<th>Eingelöst</th>';
  html += '<th>Code</th>';
  html += '</tr></thead><tbody>';

  bundles.forEach((bundle) => {
    const progress = `${bundle.redeemed}/${bundle.quantity}`;
    const statusColor = bundle.redeemed >= bundle.quantity ? '#dc3545' : '#28a745';

    html += `<tr>`;
    html += `<td>${bundle.company}</td>`;
    html += `<td><strong>${bundle.quantity}</strong> Lizenzen</td>`;
    html += `<td>€${bundle.price}</td>`;
    html += `<td><span style="color: ${statusColor}; font-weight: bold;">${progress}</span></td>`;
    html += `<td style="font-family: monospace; font-size: 11px;">${bundle.code}</td>`;
    html += `</tr>`;
  });

  html += '</tbody></table></div>';
  listDiv.innerHTML = html;
}

// Update influencer list display
function updateInfluencerList() {
  const listDiv = document.getElementById('influencerList');
  const countSpan = document.getElementById('influencerCount');

  if (countSpan) {
    countSpan.textContent = influencers.filter(i => i.status === 'active').length;
  }

  if (influencers.length === 0) {
    listDiv.innerHTML = '<p style="color: #999;">Noch keine Influencer registriert.</p>';
    return;
  }

  let html = '<div style="overflow-x: auto;"><table>';
  html += '<thead><tr>';
  html += '<th>Name</th>';
  html += '<th>Plattform</th>';
  html += '<th>Follower</th>';
  html += '<th>Verkäufe</th>';
  html += '<th>Umsatz</th>';
  html += '<th>Tracking-Code</th>';
  html += '</tr></thead><tbody>';

  influencers.forEach((influencer) => {
    const followerCount = influencer.followers.toLocaleString('de-DE');
    const statusBadge = influencer.status === 'active'
      ? '<span class="badge badge-success">Aktiv</span>'
      : '<span class="badge badge-warning">Inaktiv</span>';

    html += `<tr>`;
    html += `<td><strong>${influencer.name}</strong><br><small style="color: #666;">${influencer.email}</small></td>`;
    html += `<td>${influencer.platform} ${statusBadge}</td>`;
    html += `<td>${followerCount}</td>`;
    html += `<td><strong>${influencer.sales}</strong></td>`;
    html += `<td><strong>€${influencer.revenue.toFixed(2)}</strong></td>`;
    html += `<td style="font-family: monospace;">${influencer.trackingCode}</td>`;
    html += `</tr>`;
  });

  html += '</tbody></table></div>';
  listDiv.innerHTML = html;
}

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
  loadData();
});
