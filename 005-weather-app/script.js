const searchForm = document.getElementById('searchForm');
const cityInput = document.getElementById('cityInput');
const statusEl = document.getElementById('status');
const weatherCard = document.getElementById('weatherCard');

const locationName = document.getElementById('locationName');
const currentSummary = document.getElementById('currentSummary');
const currentTemp = document.getElementById('currentTemp');
const feelsLike = document.getElementById('feelsLike');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const forecastList = document.getElementById('forecastList');

const weatherCodeMap = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  71: 'Slight snow fall',
  73: 'Moderate snow fall',
  75: 'Heavy snow fall',
  80: 'Rain showers',
  81: 'Rain showers',
  82: 'Heavy rain showers',
  95: 'Thunderstorm'
};

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.style.color = isError ? '#b91c1c' : '#64748b';
}

function formatDayLabel(dateStr) {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
}

async function fetchCoordinates(city) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Unable to search city right now.');
  }

  const data = await response.json();
  if (!data.results || data.results.length === 0) {
    throw new Error('City not found. Try another name.');
  }

  return data.results[0];
}

async function fetchWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Unable to fetch weather data.');
  }
  return response.json();
}

function renderWeather(place, weatherData) {
  const country = place.country ? `, ${place.country}` : '';
  locationName.textContent = `${place.name}${country}`;

  const code = weatherData.current.weather_code;
  currentSummary.textContent = weatherCodeMap[code] || 'Unknown weather';
  currentTemp.textContent = Math.round(weatherData.current.temperature_2m);
  feelsLike.textContent = `${Math.round(weatherData.current.apparent_temperature)}\u00B0C`;
  humidity.textContent = `${weatherData.current.relative_humidity_2m}%`;
  windSpeed.textContent = `${Math.round(weatherData.current.wind_speed_10m)} km/h`;

  forecastList.innerHTML = '';
  weatherData.daily.time.slice(0, 5).forEach((day, index) => {
    const max = Math.round(weatherData.daily.temperature_2m_max[index]);
    const min = Math.round(weatherData.daily.temperature_2m_min[index]);
    const weatherCode = weatherData.daily.weather_code[index];

    const item = document.createElement('article');
    item.className = 'forecast-item';
    item.innerHTML = `
      <p><strong>${formatDayLabel(day)}</strong></p>
      <p>${weatherCodeMap[weatherCode] || 'Weather'}</p>
      <p>${max}\u00B0 / ${min}\u00B0</p>
    `;
    forecastList.appendChild(item);
  });

  weatherCard.classList.remove('hidden');
}

async function handleSearch(city) {
  setStatus('Loading weather...');

  try {
    const place = await fetchCoordinates(city);
    const weatherData = await fetchWeather(place.latitude, place.longitude);
    renderWeather(place, weatherData);
    setStatus(`Showing weather for ${place.name}.`);
  } catch (error) {
    weatherCard.classList.add('hidden');
    setStatus(error.message || 'Something went wrong.', true);
  }
}

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const city = cityInput.value.trim();
  if (!city) {
    setStatus('Please enter a city name.', true);
    return;
  }

  handleSearch(city);
});

handleSearch('New York');
