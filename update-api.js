#!/usr/bin/env node

/**
 * Automatic API Configuration Updater
 *
 * This script automatically updates the script.js file with new API configuration.
 * Usage: node update-api.js
 *
 * Password: JoHanna268219$
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const CONFIG = {
    password: 'JoHanna268219$',
    scriptFile: path.join(__dirname, 'script.js'),
    backupFile: path.join(__dirname, 'script.js.backup')
};

const COLORS = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(COLORS[color] + message + COLORS.reset);
}

function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

async function authenticate() {
    log('\n🔐 Simple Weather App - API Configuration Updater', 'cyan');
    log('━'.repeat(60), 'blue');

    const password = await question('\nBitte Passwort eingeben: ');

    if (password !== CONFIG.password) {
        log('\n❌ Falsches Passwort! Zugriff verweigert.\n', 'red');
        process.exit(1);
    }

    log('✅ Authentifizierung erfolgreich!', 'green');
}

async function selectApiProvider() {
    log('\n📋 Verfügbare API-Anbieter:', 'cyan');
    log('━'.repeat(60), 'blue');
    log('1. WeatherAPI.com (Empfohlen - 1M calls/Monat, kostenlos)');
    log('2. OpenWeatherMap (1K calls/Tag)');
    log('3. Visual Crossing (1K records/Tag)');
    log('4. Open-Meteo (10K calls/Tag, kein Key nötig)');
    log('5. Custom API');

    const choice = await question('\nWähle einen Anbieter (1-5): ');

    const providers = {
        '1': 'weatherapi',
        '2': 'openweather',
        '3': 'visualcrossing',
        '4': 'openmeteo',
        '5': 'custom'
    };

    return providers[choice] || 'weatherapi';
}

async function getApiKey(provider) {
    if (provider === 'openmeteo') {
        log('\n💡 Open-Meteo benötigt keinen API-Key!', 'yellow');
        return '';
    }

    log(`\n🔑 API-Key für ${provider} eingeben:`, 'cyan');
    const key = await question('API-Key: ');

    if (!key) {
        log('⚠️  Warnung: Kein API-Key eingegeben!', 'yellow');
    }

    return key;
}

function generateCode(provider, apiKey) {
    const templates = {
        weatherapi: () => `
// WeatherAPI.com Configuration
const API_KEY = '${apiKey}';
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
`,
        openweather: () => `
// OpenWeatherMap Configuration
const API_KEY = '${apiKey}';
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
`,
        openmeteo: () => `
// Open-Meteo Configuration (No API Key required)
const API_KEY = '';
const API_URL = 'https://api.open-meteo.com/v1/forecast';
const USE_DEMO_API = false;

async function fetchWeatherAPI(city) {
    const geoUrl = \`https://geocoding-api.open-meteo.com/v1/search?name=\${encodeURIComponent(city)}&count=1&language=de&format=json\`;
    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
        throw new Error('Stadt nicht gefunden');
    }

    const location = geoData.results[0];
    const weatherUrl = \`\${API_URL}?latitude=\${location.latitude}&longitude=\${location.longitude}&current_weather=true&temperature_unit=celsius&windspeed_unit=kmh\`;
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();
    const current = weatherData.current_weather;

    return {
        name: location.name,
        country: location.country,
        temp: Math.round(current.temperature),
        feels_like: Math.round(current.temperature),
        humidity: 0,
        wind: Math.round(current.windspeed),
        description: 'Wetter'
    };
}
`
    };

    return templates[provider] ? templates[provider]() : templates.weatherapi();
}

function createBackup() {
    if (!fs.existsSync(CONFIG.scriptFile)) {
        log('❌ script.js nicht gefunden!', 'red');
        return false;
    }

    try {
        fs.copyFileSync(CONFIG.scriptFile, CONFIG.backupFile);
        log('✅ Backup erstellt: script.js.backup', 'green');
        return true;
    } catch (error) {
        log('❌ Backup fehlgeschlagen: ' + error.message, 'red');
        return false;
    }
}

function updateScriptFile(newCode) {
    try {
        // Read current script.js
        let content = fs.readFileSync(CONFIG.scriptFile, 'utf8');

        // Find the section to replace (from API_KEY to end of fetchWeatherAPI function)
        const startMarker = '// Weather API URL';
        const endMarker = 'async function getWeather()';

        const startIndex = content.indexOf(startMarker);
        const endIndex = content.indexOf(endMarker);

        if (startIndex === -1 || endIndex === -1) {
            log('⚠️  Warnung: Konnte Marker nicht finden. Vollständiges Ersetzen...', 'yellow');

            // Fallback: Replace from beginning to getWeather function
            const beforeGetWeather = content.substring(0, content.indexOf('async function getWeather()'));
            const afterGetWeather = content.substring(content.indexOf('async function getWeather()'));

            content = '// Weather App JavaScript\n' + newCode.trim() + '\n\n' + afterGetWeather;
        } else {
            // Replace the API configuration section
            const before = content.substring(0, startIndex);
            const after = content.substring(endIndex);

            content = before + newCode.trim() + '\n\n' + after;
        }

        // Write updated content
        fs.writeFileSync(CONFIG.scriptFile, content, 'utf8');

        log('\n✅ script.js erfolgreich aktualisiert!', 'green');
        return true;
    } catch (error) {
        log('❌ Update fehlgeschlagen: ' + error.message, 'red');
        return false;
    }
}

async function main() {
    try {
        // Authenticate
        await authenticate();

        // Select provider
        const provider = await selectApiProvider();
        log(`\n✅ Gewählt: ${provider}`, 'green');

        // Get API key
        const apiKey = await getApiKey(provider);

        // Generate code
        log('\n🔨 Generiere Code...', 'cyan');
        const newCode = generateCode(provider, apiKey);

        // Show preview
        log('\n📝 Generierter Code:', 'cyan');
        log('━'.repeat(60), 'blue');
        log(newCode, 'yellow');
        log('━'.repeat(60), 'blue');

        // Confirm
        const confirm = await question('\n⚠️  script.js mit diesem Code aktualisieren? (ja/nein): ');

        if (confirm.toLowerCase() !== 'ja' && confirm.toLowerCase() !== 'j' && confirm.toLowerCase() !== 'yes') {
            log('\n❌ Abgebrochen. Keine Änderungen vorgenommen.', 'yellow');
            rl.close();
            return;
        }

        // Create backup
        log('\n💾 Erstelle Backup...', 'cyan');
        if (!createBackup()) {
            const continueAnyway = await question('⚠️  Backup fehlgeschlagen. Trotzdem fortfahren? (ja/nein): ');
            if (continueAnyway.toLowerCase() !== 'ja') {
                log('\n❌ Abgebrochen.', 'yellow');
                rl.close();
                return;
            }
        }

        // Update file
        log('\n🔧 Aktualisiere script.js...', 'cyan');
        if (updateScriptFile(newCode)) {
            log('\n━'.repeat(60), 'green');
            log('✅ ERFOLGREICH! API-Konfiguration aktualisiert!', 'green');
            log('━'.repeat(60), 'green');
            log('\n📝 Nächste Schritte:', 'cyan');
            log('   1. Öffne index.html im Browser');
            log('   2. Teste die Wetter-Suche');
            log('   3. Bei Problemen: Backup wiederherstellen (script.js.backup)');
            log('');
        }
    } catch (error) {
        log('\n❌ Fehler: ' + error.message, 'red');
    } finally {
        rl.close();
    }
}

// Run
main();
