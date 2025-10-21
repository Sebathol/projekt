// Password Protection
const MASTER_PASSWORD = 'JoHanna268219$';
let isAuthenticated = false;
let licenses = [];

// Load licenses from localStorage
function loadLicenses() {
  const stored = localStorage.getItem('pdf_licenses');
  if (stored) {
    licenses = JSON.parse(stored);
    updateLicenseList();
  }
}

// Save licenses to localStorage
function saveLicenses() {
  localStorage.setItem('pdf_licenses', JSON.stringify(licenses));
  updateLicenseList();
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
    loadLicenses();
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

  // Generate unique license key
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const licenseKey = `PDF-${level.toUpperCase()}-${timestamp.toString(36).toUpperCase()}-${random.toUpperCase()}`;

  // Create license object
  const license = {
    key: licenseKey,
    customer: customerName,
    level: level,
    generated: new Date().toISOString(),
    status: 'active'
  };

  // Add to licenses array
  licenses.push(license);
  saveLicenses();

  // Display license
  document.getElementById('licenseKeyDisplay').textContent = licenseKey;
  document.getElementById('generatedLicense').style.display = 'block';

  // Update license type in dashboard
  updateLicenseType(level);

  // Scroll to license
  document.getElementById('generatedLicense').scrollIntoView({ behavior: 'smooth' });
}

// Copy license to clipboard
function copyLicense() {
  const licenseKey = document.getElementById('licenseKeyDisplay').textContent;

  // Modern clipboard API
  if (navigator.clipboard) {
    navigator.clipboard.writeText(licenseKey).then(() => {
      alert('✅ Lizenz-Key in Zwischenablage kopiert!');
    });
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = licenseKey;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    alert('✅ Lizenz-Key in Zwischenablage kopiert!');
  }
}

// Update license list display
function updateLicenseList() {
  const listDiv = document.getElementById('licenseList');

  if (licenses.length === 0) {
    listDiv.innerHTML = '<p style="color: #999;">Noch keine Lizenzen generiert.</p>';
    return;
  }

  let html = '<div style="overflow-x: auto;"><table style="width: 100%; border-collapse: collapse;">';
  html += '<thead><tr style="background: #f8f9fa;">';
  html += '<th style="padding: 12px; text-align: left;">Kunde</th>';
  html += '<th style="padding: 12px; text-align: left;">Level</th>';
  html += '<th style="padding: 12px; text-align: left;">Key</th>';
  html += '<th style="padding: 12px; text-align: left;">Datum</th>';
  html += '<th style="padding: 12px; text-align: left;">Status</th>';
  html += '</tr></thead><tbody>';

  licenses.forEach((license, index) => {
    const date = new Date(license.generated).toLocaleDateString('de-DE');
    html += `<tr style="border-bottom: 1px solid #e0e0e0;">`;
    html += `<td style="padding: 12px;">${license.customer}</td>`;
    html += `<td style="padding: 12px;"><span style="background: #667eea; color: white; padding: 4px 12px; border-radius: 4px; font-size: 12px;">${license.level.toUpperCase()}</span></td>`;
    html += `<td style="padding: 12px; font-family: monospace; font-size: 12px;">${license.key.substring(0, 30)}...</td>`;
    html += `<td style="padding: 12px;">${date}</td>`;
    html += `<td style="padding: 12px;"><span style="color: #28a745;">✓ Aktiv</span></td>`;
    html += `</tr>`;
  });

  html += '</tbody></table></div>';
  listDiv.innerHTML = html;
}

// Update license type in dashboard
function updateLicenseType(level) {
  const licenseTypeDiv = document.getElementById('licenseType');
  if (licenseTypeDiv) {
    licenseTypeDiv.textContent = level.charAt(0).toUpperCase() + level.slice(1);
  }
}

// Export licenses as JSON
function exportLicenses() {
  const dataStr = JSON.stringify(licenses, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'pdf-licenses-' + Date.now() + '.json';
  link.click();
  URL.revokeObjectURL(url);
}

// Import licenses from JSON
function importLicenses(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      licenses = [...licenses, ...imported];
      saveLicenses();
      alert('✅ Lizenzen erfolgreich importiert!');
    } catch (error) {
      alert('❌ Fehler beim Importieren: ' + error.message);
    }
  };
  reader.readAsText(file);
}

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
  loadLicenses();
});
