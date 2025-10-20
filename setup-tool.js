// Simple Weather App - Setup Tool JavaScript
// Password: JoHanna268219$

// Configuration
const CONFIG = {
    password: 'JoHanna268219$', // Setup password
    storageKey: 'weatherapp_api_keys',
    authKey: 'weatherapp_auth'
};

// API Templates
const API_TEMPLATES = {
    weatherapi: {
        name: 'WeatherAPI.com',
        url: 'https://api.weatherapi.com/v1/current.json',
        requiresKey: true,
        free: true,
        limits: '1M calls/month',
        template: (key) => `
// WeatherAPI.com Configuration
const API_KEY = '${key}';
const API_URL = 'https://api.weatherapi.com/v1/current.json';
const USE_DEMO_API = false;

async function fetchWeatherAPI(city) {
    const url = \`\${API_URL}?key=\${API_KEY}&q=\${encodeURIComponent(city)}&lang=de\`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Stadt nicht gefunden');
    }

    const data = await response.json();

    return {
        name: data.location.name,
        country: data.location.country,
        temp: Math.round(data.current.temp_c),
        feels_like: Math.round(data.current.feelslike_c),
        humidity: data.current.humidity,
        wind: Math.round(data.current.wind_kph),
        description: data.current.condition.text
    };
}
`
    },
    openweather: {
        name: 'OpenWeatherMap',
        url: 'https://api.openweathermap.org/data/2.5/weather',
        requiresKey: true,
        free: true,
        limits: '1000 calls/day',
        template: (key) => `
// OpenWeatherMap Configuration
const API_KEY = '${key}';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const USE_DEMO_API = false;

async function fetchWeatherAPI(city) {
    const url = \`\${API_URL}?q=\${encodeURIComponent(city)}&appid=\${API_KEY}&units=metric&lang=de\`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Stadt nicht gefunden');
    }

    const data = await response.json();

    return {
        name: data.name,
        country: data.sys.country,
        temp: Math.round(data.main.temp),
        feels_like: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        wind: Math.round(data.wind.speed * 3.6),
        description: data.weather[0].description
    };
}
`
    },
    visualcrossing: {
        name: 'Visual Crossing',
        url: 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline',
        requiresKey: true,
        free: true,
        limits: '1000 records/day',
        template: (key) => `
// Visual Crossing Configuration
const API_KEY = '${key}';
const API_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';
const USE_DEMO_API = false;

async function fetchWeatherAPI(city) {
    const url = \`\${API_URL}/\${encodeURIComponent(city)}/today?unitGroup=metric&key=\${API_KEY}&contentType=json\`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Stadt nicht gefunden');
    }

    const data = await response.json();
    const current = data.currentConditions;

    return {
        name: data.resolvedAddress,
        country: '',
        temp: Math.round(current.temp),
        feels_like: Math.round(current.feelslike),
        humidity: current.humidity,
        wind: Math.round(current.windspeed),
        description: current.conditions
    };
}
`
    },
    openmeteo: {
        name: 'Open-Meteo',
        url: 'https://api.open-meteo.com/v1/forecast',
        requiresKey: false,
        free: true,
        limits: '10K calls/day',
        template: () => `
// Open-Meteo Configuration (No API Key required)
const API_KEY = ''; // Not required
const API_URL = 'https://api.open-meteo.com/v1/forecast';
const USE_DEMO_API = false;

async function fetchWeatherAPI(city) {
    // First, geocode the city
    const geoUrl = \`https://geocoding-api.open-meteo.com/v1/search?name=\${encodeURIComponent(city)}&count=1&language=de&format=json\`;
    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
        throw new Error('Stadt nicht gefunden');
    }

    const location = geoData.results[0];

    // Get weather data
    const weatherUrl = \`\${API_URL}?latitude=\${location.latitude}&longitude=\${location.longitude}&current_weather=true&temperature_unit=celsius&windspeed_unit=kmh\`;
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    const current = weatherData.current_weather;

    return {
        name: location.name,
        country: location.country,
        temp: Math.round(current.temperature),
        feels_like: Math.round(current.temperature), // Open-Meteo doesn't provide feels_like
        humidity: 0, // Not available in basic plan
        wind: Math.round(current.windspeed),
        description: getWeatherDescription(current.weathercode)
    };
}

function getWeatherDescription(code) {
    const descriptions = {
        0: 'Klar', 1: 'Überwiegend klar', 2: 'Teilweise bewölkt', 3: 'Bewölkt',
        45: 'Neblig', 48: 'Nebel mit Reifablagerung',
        51: 'Leichter Nieselregen', 53: 'Nieselregen', 55: 'Starker Nieselregen',
        61: 'Leichter Regen', 63: 'Regen', 65: 'Starker Regen',
        71: 'Leichter Schneefall', 73: 'Schneefall', 75: 'Starker Schneefall',
        95: 'Gewitter'
    };
    return descriptions[code] || 'Unbekannt';
}
`
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadApiKeys();
    updateApiSelect();

    // Show/hide custom URL field
    document.getElementById('api-provider').addEventListener('change', function() {
        const customField = document.getElementById('custom-url-group');
        if (this.value === 'custom') {
            customField.style.display = 'block';
        } else {
            customField.style.display = 'none';
        }
    });
});

// Authentication
function login(event) {
    event.preventDefault();

    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('login-error');

    if (password === CONFIG.password) {
        // Store auth token
        sessionStorage.setItem(CONFIG.authKey, btoa(password));

        // Show success
        errorElement.classList.remove('active');

        // Switch to setup panel
        document.getElementById('login-form').classList.remove('active');
        document.getElementById('setup-panel').classList.add('active');
        document.getElementById('logout-btn').style.display = 'block';

        // Clear password field
        document.getElementById('password').value = '';
    } else {
        errorElement.textContent = '❌ Falsches Passwort! Zugriff verweigert.';
        errorElement.classList.add('active');

        // Shake animation
        const form = event.target;
        form.style.animation = 'shake 0.5s';
        setTimeout(() => {
            form.style.animation = '';
        }, 500);
    }
}

function logout() {
    sessionStorage.removeItem(CONFIG.authKey);
    document.getElementById('login-form').classList.add('active');
    document.getElementById('setup-panel').classList.remove('active');
    document.getElementById('logout-btn').style.display = 'none';
}

function checkAuth() {
    const auth = sessionStorage.getItem(CONFIG.authKey);
    if (auth && atob(auth) === CONFIG.password) {
        document.getElementById('login-form').classList.remove('active');
        document.getElementById('setup-panel').classList.add('active');
        document.getElementById('logout-btn').style.display = 'block';
    }
}

// Tab switching
function switchTab(tabName) {
    // Remove active class from all tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // Add active class to selected tab
    event.target.classList.add('active');
    document.getElementById('tab-' + tabName).classList.add('active');
}

// API Key Management
function loadApiKeys() {
    const keys = JSON.parse(localStorage.getItem(CONFIG.storageKey) || '[]');
    return keys;
}

function saveApiKeys(keys) {
    localStorage.setItem(CONFIG.storageKey, JSON.stringify(keys));
}

function saveApiKey() {
    const provider = document.getElementById('api-provider').value;
    const name = document.getElementById('api-name').value.trim();
    const key = document.getElementById('api-key').value.trim();
    const customUrl = document.getElementById('api-url').value.trim();

    const errorElement = document.getElementById('save-error');
    const successElement = document.getElementById('save-success');

    // Reset messages
    errorElement.classList.remove('active');
    successElement.classList.remove('active');

    // Validation
    if (!name) {
        errorElement.textContent = '❌ Bitte gib eine Bezeichnung ein!';
        errorElement.classList.add('active');
        return;
    }

    if (API_TEMPLATES[provider]?.requiresKey && !key) {
        errorElement.textContent = '❌ Bitte gib einen API-Key ein!';
        errorElement.classList.add('active');
        return;
    }

    if (provider === 'custom' && !customUrl) {
        errorElement.textContent = '❌ Bitte gib eine API-URL ein!';
        errorElement.classList.add('active');
        return;
    }

    // Create API key object
    const apiKey = {
        id: Date.now().toString(),
        provider: provider,
        name: name,
        key: key,
        customUrl: customUrl,
        createdAt: new Date().toISOString()
    };

    // Save to storage
    const keys = loadApiKeys();
    keys.push(apiKey);
    saveApiKeys(keys);

    // Show success
    successElement.textContent = `✅ API-Key "${name}" erfolgreich gespeichert!`;
    successElement.classList.add('active');

    // Clear form
    document.getElementById('api-name').value = '';
    document.getElementById('api-key').value = '';
    document.getElementById('api-url').value = '';

    // Refresh display
    displayApiKeys();
    updateApiSelect();

    // Scroll to list
    setTimeout(() => {
        document.querySelector('.api-list').scrollIntoView({ behavior: 'smooth' });
    }, 500);
}

function displayApiKeys() {
    const keys = loadApiKeys();
    const container = document.getElementById('api-keys-container');

    if (keys.length === 0) {
        container.innerHTML = '<p style="color: #999; text-align: center; padding: 40px;">Noch keine API-Keys gespeichert</p>';
        return;
    }

    container.innerHTML = keys.map(apiKey => `
        <div class="api-item">
            <h3>${apiKey.name}</h3>
            <div class="api-info">
                <div><strong>Provider:</strong> ${API_TEMPLATES[apiKey.provider]?.name || apiKey.provider}</div>
                <div><strong>API-Key:</strong> <span class="api-key-display">${maskApiKey(apiKey.key)}</span></div>
                ${apiKey.customUrl ? `<div><strong>URL:</strong> ${apiKey.customUrl}</div>` : ''}
                <div><strong>Erstellt am:</strong> ${new Date(apiKey.createdAt).toLocaleString('de-DE')}</div>
            </div>
            <div style="margin-top: 15px;">
                <button class="btn btn-danger btn-small" onclick="deleteApiKey('${apiKey.id}')">🗑️ Löschen</button>
                <button class="btn btn-secondary btn-small" onclick="viewFullKey('${apiKey.id}')">👁️ Key anzeigen</button>
            </div>
        </div>
    `).join('');
}

function maskApiKey(key) {
    if (!key) return 'Kein Key (nicht erforderlich)';
    if (key.length < 8) return key;
    return key.substring(0, 4) + '•'.repeat(Math.min(20, key.length - 8)) + key.substring(key.length - 4);
}

function deleteApiKey(id) {
    if (!confirm('API-Key wirklich löschen?')) return;

    const keys = loadApiKeys();
    const filtered = keys.filter(k => k.id !== id);
    saveApiKeys(filtered);

    displayApiKeys();
    updateApiSelect();
}

function viewFullKey(id) {
    const keys = loadApiKeys();
    const apiKey = keys.find(k => k.id === id);

    if (apiKey) {
        alert(`Vollständiger API-Key:\n\n${apiKey.key}\n\n⚠️ Niemals öffentlich teilen!`);
    }
}

function updateApiSelect() {
    const keys = loadApiKeys();
    const select = document.getElementById('select-api');

    select.innerHTML = '<option value="">-- Bitte wählen --</option>' +
        keys.map(apiKey => `<option value="${apiKey.id}">${apiKey.name} (${API_TEMPLATES[apiKey.provider]?.name || apiKey.provider})</option>`).join('');

    displayApiKeys();
}

// Code Generation
function generateCode() {
    const selectElement = document.getElementById('select-api');
    const selectedId = selectElement.value;

    const errorElement = document.getElementById('save-error');
    const container = document.getElementById('generated-code-container');
    const codeElement = document.getElementById('generated-code');

    if (!selectedId) {
        alert('❌ Bitte wähle einen API-Key aus!');
        return;
    }

    const keys = loadApiKeys();
    const apiKey = keys.find(k => k.id === selectedId);

    if (!apiKey) {
        alert('❌ API-Key nicht gefunden!');
        return;
    }

    // Generate code based on provider
    let code;
    if (API_TEMPLATES[apiKey.provider]) {
        code = API_TEMPLATES[apiKey.provider].template(apiKey.key);
    } else {
        // Custom provider
        code = generateCustomCode(apiKey);
    }

    // Display code
    codeElement.textContent = code.trim();
    container.style.display = 'block';

    // Scroll to code
    setTimeout(() => {
        container.scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

function generateCustomCode(apiKey) {
    return `
// Custom API Configuration
const API_KEY = '${apiKey.key}';
const API_URL = '${apiKey.customUrl}';
const USE_DEMO_API = false;

async function fetchWeatherAPI(city) {
    // TODO: Implementiere deine eigene API-Logik
    // Beispiel:
    const url = \`\${API_URL}?city=\${encodeURIComponent(city)}&key=\${API_KEY}\`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Stadt nicht gefunden');
    }

    const data = await response.json();

    // WICHTIG: Passe die Datenstruktur an deine API an!
    return {
        name: data.city_name,        // Anpassen!
        country: data.country,        // Anpassen!
        temp: data.temperature,       // Anpassen!
        feels_like: data.feels_like,  // Anpassen!
        humidity: data.humidity,      // Anpassen!
        wind: data.wind_speed,        // Anpassen!
        description: data.description // Anpassen!
    };
}
`;
}

function copyCode() {
    const codeElement = document.getElementById('generated-code');
    const code = codeElement.textContent;

    // Create temporary textarea
    const textarea = document.createElement('textarea');
    textarea.value = code;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);

    // Select and copy
    textarea.select();
    document.execCommand('copy');

    // Remove textarea
    document.body.removeChild(textarea);

    // Show feedback
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = '✅ Kopiert!';
    button.style.background = '#28a745';

    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
    }, 2000);
}

function downloadCode() {
    const codeElement = document.getElementById('generated-code');
    const code = codeElement.textContent;

    // Create blob
    const blob = new Blob([code], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);

    // Create download link
    const a = document.createElement('a');
    a.href = url;
    a.download = 'weather-api-config.js';
    a.click();

    // Cleanup
    URL.revokeObjectURL(url);

    // Show feedback
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = '✅ Heruntergeladen!';

    setTimeout(() => {
        button.textContent = originalText;
    }, 2000);
}

// Add shake animation
const style = document.createElement('style');
style.textContent = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
}
`;
document.head.appendChild(style);

console.log('🔧 Simple Weather App Setup Tool loaded');
console.log('🔐 Secured with password protection');
