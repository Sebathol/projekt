// Weather App JavaScript

const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const weatherInfo = document.getElementById('weather-info');

// Weather API URL - Using OpenWeatherMap API
// Note: This uses a demo API key. For production, get your own key from openweathermap.org
const API_KEY = 'YOUR_API_KEY_HERE'; // User should replace this
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Alternative: Use wttr.in for demo (no API key needed)
const USE_DEMO_API = true;

// Event Listeners
searchBtn.addEventListener('click', getWeather);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getWeather();
    }
});

// Get weather on page load for default city
window.addEventListener('load', () => {
    getWeather();
});

async function getWeather() {
    const city = cityInput.value.trim();

    if (!city) {
        showError('Bitte gib einen Stadtnamen ein!');
        return;
    }

    // Hide previous results
    hideAll();
    loading.classList.remove('hidden');

    try {
        let weatherData;

        if (USE_DEMO_API) {
            // Using wttr.in as a demo (no API key required)
            weatherData = await fetchWeatherDemo(city);
        } else {
            // Using OpenWeatherMap (requires API key)
            weatherData = await fetchWeatherAPI(city);
        }

        displayWeather(weatherData);
    } catch (err) {
        showError('Stadt nicht gefunden oder Fehler beim Laden der Daten.');
        console.error(err);
    } finally {
        loading.classList.add('hidden');
    }
}

async function fetchWeatherDemo(city) {
    // Using wttr.in free API
    const response = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);

    if (!response.ok) {
        throw new Error('Fehler beim Laden der Wetterdaten');
    }

    const data = await response.json();
    const current = data.current_condition[0];
    const location = data.nearest_area[0];

    // Transform to our format
    return {
        name: location.areaName[0].value,
        country: location.country[0].value,
        temp: current.temp_C,
        feels_like: current.FeelsLikeC,
        humidity: current.humidity,
        wind: current.windspeedKmph,
        description: current.weatherDesc[0].value
    };
}

async function fetchWeatherAPI(city) {
    // OpenWeatherMap API (requires API key)
    const url = `${API_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=de`;
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
        wind: Math.round(data.wind.speed * 3.6), // m/s to km/h
        description: data.weather[0].description
    };
}

function displayWeather(data) {
    document.getElementById('city-name').textContent = `${data.name}, ${data.country}`;
    document.getElementById('temp').textContent = `${data.temp}°C`;
    document.getElementById('description').textContent = data.description;
    document.getElementById('feels-like').textContent = `${data.feels_like}°C`;
    document.getElementById('humidity').textContent = `${data.humidity}%`;
    document.getElementById('wind').textContent = `${data.wind} km/h`;

    weatherInfo.classList.remove('hidden');
}

function showError(message) {
    error.textContent = message;
    error.classList.remove('hidden');
}

function hideAll() {
    weatherInfo.classList.add('hidden');
    error.classList.add('hidden');
}
