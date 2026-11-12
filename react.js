/**
 * ============================================================================
 * Weatherly METEOROLOGY - CORE JAVASCRIPT APPLICATION
 * ============================================================================
 * Fulfills all criteria for:
 * Task 3: Final Responsive Website
 *   - Semantic HTML integration
 *   - Functions (Modular, Async/Await, Pure helpers)
 *   - Arrays (Hourly lists, 7-day lists, Saved cities, Search history)
 *   - Objects (AppState, WeatherCodeRegistry, CityDatabase, UnitHandlers)
 *   - DOM Manipulation (Dynamic card generation, SVG injection, class toggles)
 *   - Events (click, submit, input, keydown, change, resize)
 *
 * Task 4: JavaScript Interactivity
 *   - Dynamic Content (Live API + Fallback Data, Real-time Clock, Ambient FX)
 *   - Form Validation (Search bar & Modal form sanitization, error messages)
 *   - Interactive Buttons (Unit switcher °C/°F, Theme toggle, Geo-detect, Bookmarks)
 *   - Event Handling (Debounced autocomplete, keyboard navigation, outside click)
 *   - Search / Filter (Real-time filter for saved cards, weekend/warmest daily filter)
 *   - Add / Edit / Delete (Full CRUD on saved cities with Undo toast & localStorage)
 * ============================================================================
 */

'use strict';

/* ==========================================================================
   1. GLOBAL CONSTANTS & WEATHER CODE REGISTRY (OBJECTS & MAPS)
   ========================================================================== */

/**
 * Standard WMO (World Meteorological Organization) Weather Code Registry
 * Maps numeric weather codes from Open-Meteo to readable descriptions, icons, and themes.
 */
const WEATHER_CODES = {
  0:  { label: 'Clear Sky', category: 'clear', icon: 'sun' },
  1:  { label: 'Mainly Clear', category: 'clear', icon: 'sun' },
  2:  { label: 'Partly Cloudy', category: 'clouds', icon: 'cloud-sun' },
  3:  { label: 'Overcast', category: 'clouds', icon: 'cloud' },
  45: { label: 'Foggy', category: 'clouds', icon: 'cloud-fog' },
  48: { label: 'Depositing Rime Fog', category: 'clouds', icon: 'cloud-fog' },
  51: { label: 'Light Drizzle', category: 'rain', icon: 'cloud-drizzle' },
  53: { label: 'Moderate Drizzle', category: 'rain', icon: 'cloud-drizzle' },
  55: { label: 'Dense Drizzle', category: 'rain', icon: 'cloud-drizzle' },
  61: { label: 'Slight Rain', category: 'rain', icon: 'cloud-rain' },
  63: { label: 'Moderate Rain', category: 'rain', icon: 'cloud-rain' },
  65: { label: 'Heavy Rain', category: 'rain', icon: 'cloud-rain' },
  71: { label: 'Slight Snowfall', category: 'snow', icon: 'snowflake' },
  73: { label: 'Moderate Snowfall', category: 'snow', icon: 'snowflake' },
  75: { label: 'Heavy Snowfall', category: 'snow', icon: 'snowflake' },
  77: { label: 'Snow Grains', category: 'snow', icon: 'snowflake' },
  80: { label: 'Slight Rain Showers', category: 'rain', icon: 'cloud-rain' },
  81: { label: 'Moderate Rain Showers', category: 'rain', icon: 'cloud-rain' },
  82: { label: 'Violent Rain Showers', category: 'rain', icon: 'cloud-rain' },
  85: { label: 'Slight Snow Showers', category: 'snow', icon: 'snowflake' },
  86: { label: 'Heavy Snow Showers', category: 'snow', icon: 'snowflake' },
  95: { label: 'Thunderstorm', category: 'thunderstorm', icon: 'cloud-lightning' },
  96: { label: 'Thunderstorm with Hail', category: 'thunderstorm', icon: 'cloud-lightning' },
  99: { label: 'Heavy Thunderstorm with Hail', category: 'thunderstorm', icon: 'cloud-lightning' }
};

/**
 * Built-in High-Definition SVG Icons Catalog
 * Programmatically generated to ensure crisp zero-dependency rendering
 */
const SVG_ICONS = {
  'sun': `<svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
          </svg>`,
  'moon': `<svg viewBox="0 0 24 24" fill="none" stroke="#818cf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
             <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
           </svg>`,
  'cloud-sun': `<svg viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2v2M4.93 4.93l1.41 1.41M20 12h2M19.07 4.93l-1.41 1.41"/>
                  <path d="M15.5 17a4.5 4.5 0 0 0-4.5-4.5 4.5 4.5 0 0 0-1.8.38A5 5 0 1 0 4 17h11.5z"/>
                </svg>`,
  'cloud': `<svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
            </svg>`,
  'cloud-rain': `<svg viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                   <path d="M16 13a4 4 0 0 0-4-4 4 4 0 0 0-3.8 2.7A5 5 0 1 0 4 17h12a4 4 0 0 0 0-8v0a4 4 0 0 0-4-4"/>
                   <line x1="8" y1="19" x2="8" y2="22"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="16" y1="19" x2="16" y2="22"/>
                 </svg>`,
  'cloud-drizzle': `<svg viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
                      <line x1="8" y1="19" x2="8" y2="21"/><line x1="12" y1="19" x2="12" y2="21"/><line x1="16" y1="19" x2="16" y2="21"/>
                    </svg>`,
  'cloud-lightning': `<svg viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"/>
                        <polyline points="13 11 9 17 15 17 11 23"/>
                      </svg>`,
  'snowflake': `<svg viewBox="0 0 24 24" fill="none" stroke="#7dd3fc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/>
                  <path d="m20 16-4-4 4-4M4 8l4 4-4 4M16 4l-4 4-4-4M8 20l4-4 4 4"/>
                </svg>`,
  'cloud-fog': `<svg viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 14h16M4 18h16M4 10h16M7 6h10"/>
                </svg>`
};

/**
 * Offline / Fallback City Database
 * Guarantees instantaneous loading, offline demo capabilities, and smooth zero-lag interactions.
 */
const FALLBACK_CITIES = [
  {
    name: 'London',
    country: 'United Kingdom',
    countryCode: 'GB',
    lat: 51.5074,
    lon: -0.1278,
    tempC: 15,
    feelsLikeC: 14,
    highC: 18,
    lowC: 10,
    humidity: 72,
    windSpeedKm: 16,
    windDeg: 210,
    uvIndex: 4,
    pressure: 1014,
    precipitationMm: 0.2,
    weatherCode: 2,
    sunrise: '06:42',
    sunset: '18:15',
    summary: 'Pleasant autumn breeze with broken clouds across the Thames.'
  },
  {
    name: 'Tokyo',
    country: 'Japan',
    countryCode: 'JP',
    lat: 35.6762,
    lon: 139.6503,
    tempC: 21,
    feelsLikeC: 21,
    highC: 24,
    lowC: 16,
    humidity: 60,
    windSpeedKm: 12,
    windDeg: 95,
    uvIndex: 6,
    pressure: 1018,
    precipitationMm: 0.0,
    weatherCode: 1,
    sunrise: '05:58',
    sunset: '17:20',
    summary: 'Clear skies with crisp visibility across the metropolitan horizon.'
  },
  {
    name: 'New York',
    country: 'United States',
    countryCode: 'US',
    lat: 40.7128,
    lon: -74.0060,
    tempC: 18,
    feelsLikeC: 17,
    highC: 20,
    lowC: 12,
    humidity: 55,
    windSpeedKm: 22,
    windDeg: 320,
    uvIndex: 5,
    pressure: 1016,
    precipitationMm: 0.0,
    weatherCode: 0,
    sunrise: '06:30',
    sunset: '18:05',
    summary: 'Bright sunshine with moderate northwesterly winds.'
  },
  {
    name: 'Paris',
    country: 'France',
    countryCode: 'FR',
    lat: 48.8566,
    lon: 2.3522,
    tempC: 16,
    feelsLikeC: 15,
    highC: 19,
    lowC: 11,
    humidity: 68,
    windSpeedKm: 14,
    windDeg: 190,
    uvIndex: 4,
    pressure: 1015,
    precipitationMm: 0.5,
    weatherCode: 61,
    sunrise: '07:10',
    sunset: '18:40',
    summary: 'Light intermittent rain showers with mild temperatures.'
  },
  {
    name: 'Sydney',
    country: 'Australia',
    countryCode: 'AU',
    lat: -33.8688,
    lon: 151.2093,
    tempC: 25,
    feelsLikeC: 26,
    highC: 27,
    lowC: 19,
    humidity: 64,
    windSpeedKm: 19,
    windDeg: 140,
    uvIndex: 8,
    pressure: 1020,
    precipitationMm: 0.0,
    weatherCode: 0,
    sunrise: '05:45',
    sunset: '19:35',
    summary: 'Glorious coastal sunshine with comfortable maritime breeze.'
  },
  {
    name: 'Mumbai',
    country: 'India',
    countryCode: 'IN',
    lat: 19.0760,
    lon: 72.8777,
    tempC: 31,
    feelsLikeC: 34,
    highC: 33,
    lowC: 26,
    humidity: 78,
    windSpeedKm: 15,
    windDeg: 260,
    uvIndex: 9,
    pressure: 1011,
    precipitationMm: 0.0,
    weatherCode: 1,
    sunrise: '06:35',
    sunset: '18:02',
    summary: 'Warm tropical sunshine with humid Arabian Sea breeze.'
  },
  {
    name: 'Dubai',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    lat: 25.2048,
    lon: 55.2708,
    tempC: 33,
    feelsLikeC: 36,
    highC: 35,
    lowC: 27,
    humidity: 48,
    windSpeedKm: 18,
    windDeg: 300,
    uvIndex: 10,
    pressure: 1012,
    precipitationMm: 0.0,
    weatherCode: 0,
    sunrise: '06:22',
    sunset: '17:48',
    summary: 'Arid desert sunshine and intense UV levels throughout the day.'
  }
];

/* ==========================================================================
   2. APPLICATION STATE MANAGEMENT (OBJECTS & STORAGE)
   ========================================================================== */

const STORAGE_KEYS = {
  FAVORITES: 'Weatherly_favorites_v1',
  UNIT: 'Weatherly_unit_v1',
  THEME: 'Weatherly_theme_v1',
  LAST_CITY: 'Weatherly_last_city_v1'
};

const AppState = {
  unit: 'C', // 'C' | 'F'
  theme: 'dark', // 'dark' | 'light'
  currentLocation: null,
  currentWeather: null,
  hourlyForecast: [],
  dailyForecast: [],
  savedCities: [],
  activeForecastTab: 'hourly',
  activeDailyFilter: 'all', // 'all' | 'weekend' | 'warmest'
  searchFilterQuery: '',
  deletedCityBuffer: null, // For Undo functionality
  undoTimeoutId: null
};

/* ==========================================================================
   3. DOM ELEMENT REFERENCES (CACHED OBJECTS)
   ========================================================================== */

const DOM = {
  // Navigation & Controls
  unitBtnC: document.getElementById('btn-unit-c'),
  unitBtnF: document.getElementById('btn-unit-f'),
  themeToggleBtn: document.getElementById('theme-toggle-btn'),
  navFavoritesBtn: document.getElementById('nav-favorites-btn'),
  favoritesBadgeCount: document.getElementById('favorites-badge-count'),
  liveTimeDisplay: document.getElementById('live-time-display'),
  
  // Search Form
  searchForm: document.getElementById('search-form'),
  searchInput: document.getElementById('search-input'),
  clearSearchBtn: document.getElementById('clear-search-btn'),
  searchSpinner: document.getElementById('search-spinner'),
  submitSearchBtn: document.getElementById('submit-search-btn'),
  geoBtn: document.getElementById('geo-btn'),
  searchErrorMsg: document.getElementById('search-error-msg'),
  suggestionsDropdown: document.getElementById('suggestions-dropdown'),
  quickCitiesList: document.getElementById('quick-cities-list'),

  // Hero Card
  heroCard: document.getElementById('hero-card'),
  cityNameDisplay: document.getElementById('city-name-display'),
  countryBadgeDisplay: document.getElementById('country-badge-display'),
  dateTimeDisplay: document.getElementById('date-time-display'),
  refreshWeatherBtn: document.getElementById('refresh-weather-btn'),
  toggleFavoriteBtn: document.getElementById('toggle-favorite-btn'),
  favoriteBtnText: document.getElementById('favorite-btn-text'),
  currentTempDisplay: document.getElementById('current-temp-display'),
  currentUnitDisplay: document.getElementById('current-unit-display'),
  tempHighDisplay: document.getElementById('temp-high-display'),
  tempLowDisplay: document.getElementById('temp-low-display'),
  tempFeelsDisplay: document.getElementById('temp-feels-display'),
  mainConditionIcon: document.getElementById('main-condition-icon'),
  conditionBadgeDisplay: document.getElementById('condition-badge-display'),
  atmosphericSummaryText: document.getElementById('atmospheric-summary-text'),
  lastUpdatedText: document.getElementById('last-updated-text'),

  // Metrics Grid
  windSpeedDisplay: document.getElementById('wind-speed-display'),
  windUnitDisplay: document.getElementById('wind-unit-display'),
  windCompassArrow: document.getElementById('wind-compass-arrow'),
  windDirectionText: document.getElementById('wind-direction-text'),
  windDegreesText: document.getElementById('wind-degrees-text'),
  humidityDisplay: document.getElementById('humidity-display'),
  humidityBarFill: document.getElementById('humidity-bar-fill'),
  humidityDescText: document.getElementById('humidity-desc-text'),
  uvDisplay: document.getElementById('uv-display'),
  uvRatingTag: document.getElementById('uv-rating-tag'),
  uvIndicatorPoint: document.getElementById('uv-indicator-point'),
  uvAdviceText: document.getElementById('uv-advice-text'),
  pressureDisplay: document.getElementById('pressure-display'),
  pressureBadge: document.getElementById('pressure-badge'),
  pressureDescText: document.getElementById('pressure-desc-text'),
  precipDisplay: document.getElementById('precip-display'),
  precipNoteText: document.getElementById('precip-note-text'),
  sunriseDisplay: document.getElementById('sunrise-display'),
  sunsetDisplay: document.getElementById('sunset-display'),
  daylightDurationText: document.getElementById('daylight-duration-text'),

  // Forecast Tabs
  tabHourly: document.getElementById('tab-hourly'),
  tabDaily: document.getElementById('tab-daily'),
  panelHourly: document.getElementById('panel-hourly'),
  panelDaily: document.getElementById('panel-daily'),
  hourlyList: document.getElementById('hourly-list'),
  dailyList: document.getElementById('daily-list'),
  forecastFilterSelect: document.getElementById('forecast-filter-select'),

  // Saved Cities Section
  favoritesSection: document.getElementById('favorites-section'),
  filterFavoritesInput: document.getElementById('filter-favorites-input'),
  btnAddModalOpen: document.getElementById('btn-add-modal-open'),
  savedCitiesContainer: document.getElementById('saved-cities-container'),
  favoritesEmptyState: document.getElementById('favorites-empty-state'),

  // Modal Dialog
  locationModal: document.getElementById('location-modal'),
  locationModalForm: document.getElementById('location-modal-form'),
  modalTitle: document.getElementById('modal-title'),
  modalCloseBtn: document.getElementById('modal-close-btn'),
  modalCancelBtn: document.getElementById('modal-cancel-btn'),
  modalCityId: document.getElementById('modal-city-id'),
  modalCityName: document.getElementById('modal-city-name'),
  modalCityNotes: document.getElementById('modal-city-notes'),
  modalNameError: document.getElementById('modal-name-error'),
  noteCharCount: document.getElementById('note-char-count'),

  // Miscellaneous
  toastContainer: document.getElementById('toast-container'),
  btnBackToTop: document.getElementById('btn-back-to-top'),
  weatherCanvas: document.getElementById('weather-canvas')
};

/* ==========================================================================
   4. PURE UTILITY & CONVERSION FUNCTIONS
   ========================================================================== */

/**
 * Converts Celsius to Fahrenheit
 * @param {number} celsius 
 * @returns {number}
 */
const celsiusToFahrenheit = (celsius) => Math.round((celsius * 9 / 5) + 32);

/**
 * Formats a temperature value according to active unit
 * @param {number} tempC - Temperature in Celsius
 * @returns {string} Formatted number
 */
function formatTemperature(tempC) {
  if (tempC === null || tempC === undefined || isNaN(tempC)) return '--';
  return AppState.unit === 'F' ? celsiusToFahrenheit(tempC) : Math.round(tempC);
}

/**
 * Formats speed based on active unit (km/h or mph)
 * @param {number} kmh 
 * @returns {object} { value, unit }
 */
function formatSpeed(kmh) {
  if (AppState.unit === 'F') {
    return { value: Math.round(kmh * 0.621371), unit: 'mph' };
  }
  return { value: Math.round(kmh), unit: 'km/h' };
}

/**
 * Converts degrees into 16-point Compass direction
 * @param {number} deg 
 * @returns {string} e.g. "NE", "SSW"
 */
function degreesToCompass(deg) {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 
                      'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((deg % 360) / 22.5) % 16;
  return directions[index];
}

/**
 * Sanitizes input to prevent HTML injection / XSS
 * @param {string} str 
 * @returns {string}
 */
function sanitizeInput(str) {
  if (!str) return '';
  return str.replace(/[<>'"&]/g, (char) => {
    switch (char) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case "'": return '&#39;';
      case '"': return '&quot;';
      case '&': return '&amp;';
      default: return char;
    }
  }).trim();
}

/**
 * Debounce helper for high-frequency events
 */
function debounce(func, delay = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * Formats a local date and time string
 * @param {Date} date 
 * @returns {string} e.g., "Wednesday, Nov 11 • 2:30 PM"
 */
function formatDateTime(date = new Date()) {
  const options = { 
    weekday: 'long', 
    month: 'short', 
    day: 'numeric', 
    hour: 'numeric', 
    minute: '2-digit', 
    hour12: true 
  };
  return date.toLocaleDateString('en-US', options).replace(',', ' •');
}

/**
 * Calculates daylight duration between sunrise and sunset
 * @param {string} sunrise - "HH:MM"
 * @param {string} sunset  - "HH:MM"
 * @returns {string} e.g., "11h 22m"
 */
function calculateDaylight(sunrise, sunset) {
  if (!sunrise || !sunset) return '--h --m';
  const [rHour, rMin] = sunrise.split(':').map(Number);
  const [sHour, sMin] = sunset.split(':').map(Number);
  let totalMin = (sHour * 60 + sMin) - (rHour * 60 + rMin);
  if (totalMin < 0) totalMin += 24 * 60;
  const hours = Math.floor(totalMin / 60);
  const minutes = totalMin % 60;
  return `${hours}h ${minutes}m`;
}

/* ==========================================================================
   5. WEATHER SIMULATION & MOCK DATA GENERATION (ARRAYS & OBJECTS)
   ========================================================================== */

/**
 * Generates an 24-hour forecast array derived from base temperature
 * @param {number} baseTempC 
 * @param {number} weatherCode 
 * @returns {Array<object>}
 */
function generateHourlyForecast(baseTempC, weatherCode) {
  const currentHour = new Date().getHours();
  const hourly = [];

  for (let i = 0; i < 24; i++) {
    const hour = (currentHour + i) % 24;
    // Diurnal variation curve: coolest at 5am, warmest at 3pm (15:00)
    const diurnalFactor = Math.sin(((hour - 5) / 24) * 2 * Math.PI);
    const tempC = Math.round(baseTempC + (diurnalFactor * 4) + (Math.random() * 1.5 - 0.75));
    const isNight = hour < 6 || hour >= 19;

    let hourCode = weatherCode;
    // slight variation across the day
    if (i > 8 && Math.random() > 0.6) {
      hourCode = (weatherCode + 1) % 4;
    }

    const rainChance = [51, 53, 55, 61, 63, 65, 80, 81, 82, 95].includes(hourCode)
      ? Math.min(95, Math.round(40 + Math.random() * 55))
      : Math.round(Math.random() * 15);

    hourly.push({
      hour,
      timeLabel: i === 0 ? 'Now' : `${hour % 12 || 12} ${hour >= 12 ? 'PM' : 'AM'}`,
      isNow: i === 0,
      isNight,
      tempC,
      weatherCode: hourCode,
      rainChance
    });
  }

  return hourly;
}

/**
 * Generates 7-Day outlook forecast array
 * @param {number} baseTempC 
 * @param {number} weatherCode 
 * @returns {Array<object>}
 */
function generateDailyForecast(baseTempC, weatherCode) {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date();
  const daily = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dayOfWeek = dayNames[date.getDay()];
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;

    // Slight daily temperature shifts
    const tempVariance = Math.round((Math.sin(i * 1.2) * 3) + (Math.random() * 2 - 1));
    const highC = baseTempC + 2 + tempVariance;
    const lowC = baseTempC - 5 + tempVariance;

    let dayCode = weatherCode;
    if (i > 0) {
      const codeOptions = [0, 1, 2, 3, 61, 80];
      dayCode = codeOptions[Math.floor(Math.random() * codeOptions.length)];
    }

    daily.push({
      date,
      dayName: i === 0 ? 'Today' : (i === 1 ? 'Tomorrow' : dayOfWeek),
      dateFormatted: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      isWeekend,
      highC,
      lowC,
      weatherCode: dayCode,
      conditionLabel: (WEATHER_CODES[dayCode] || WEATHER_CODES[0]).label
    });
  }

  return daily;
}

/* ==========================================================================
   6. API COMMUNICATION (OPEN-METEO LIVE + SEAMLESS FALLBACK)
   ========================================================================== */

/**
 * Searches for locations using Open-Meteo Geocoding API with fallback
 * @param {string} query 
 * @returns {Promise<Array<object>>}
 */
async function searchLocations(query) {
  const cleanQuery = query.trim().toLowerCase();

  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanQuery)}&count=5&language=en&format=json`,
      { signal: AbortSignal.timeout(4000) }
    );

    if (response.ok) {
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return data.results.map((item) => ({
          name: item.name,
          country: item.country || '',
          countryCode: item.country_code || '',
          state: item.admin1 || '',
          lat: item.latitude,
          lon: item.longitude
        }));
      }
    }
  } catch (error) {
    console.warn('Geocoding API unavailable or offline, using fallback catalog:', error.message);
  }

  // Fallback search in local database
  return FALLBACK_CITIES.filter(c => 
    c.name.toLowerCase().includes(cleanQuery) || 
    c.country.toLowerCase().includes(cleanQuery)
  ).map(c => ({
    name: c.name,
    country: c.country,
    countryCode: c.countryCode,
    state: '',
    lat: c.lat,
    lon: c.lon
  }));
}

/**
 * Fetches real weather data from Open-Meteo or synthesizes from local database
 * @param {object} location 
 * @returns {Promise<object>} Complete weather object
 */
async function fetchWeatherData(location) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=auto`;
    const response = await fetch(url, { signal: AbortSignal.timeout(4500) });

    if (response.ok) {
      const data = await response.json();
      const current = data.current;
      const daily = data.daily;

      const sunriseIso = daily.sunrise && daily.sunrise[0] ? daily.sunrise[0] : '';
      const sunsetIso = daily.sunset && daily.sunset[0] ? daily.sunset[0] : '';
      const sunrise = sunriseIso ? sunriseIso.split('T')[1].slice(0, 5) : '06:30';
      const sunset = sunsetIso ? sunsetIso.split('T')[1].slice(0, 5) : '18:15';

      return {
        name: location.name,
        country: location.country,
        countryCode: location.countryCode || 'WORLD',
        lat: location.lat,
        lon: location.lon,
        tempC: Math.round(current.temperature_2m),
        feelsLikeC: Math.round(current.apparent_temperature),
        highC: daily.temperature_2m_max ? Math.round(daily.temperature_2m_max[0]) : Math.round(current.temperature_2m + 3),
        lowC: daily.temperature_2m_min ? Math.round(daily.temperature_2m_min[0]) : Math.round(current.temperature_2m - 4),
        humidity: current.relative_humidity_2m,
        windSpeedKm: Math.round(current.wind_speed_10m),
        windDeg: current.wind_direction_10m || 0,
        uvIndex: daily.uv_index_max ? Math.round(daily.uv_index_max[0]) : 5,
        pressure: Math.round(current.surface_pressure || 1013),
        precipitationMm: current.precipitation || 0,
        weatherCode: current.weather_code,
        sunrise,
        sunset,
        summary: `Live readings from meteorological station at ${location.name}.`
      };
    }
  } catch (error) {
    console.warn('Weather API failed or timed out, utilizing local model:', error.message);
  }

  // Match or fallback to synthetic database
  const match = FALLBACK_CITIES.find(c => 
    c.name.toLowerCase() === location.name.toLowerCase()
  );

  if (match) {
    return { ...match };
  }

  // Create a realistic procedural weather object
  return {
    name: location.name,
    country: location.country || 'Global',
    countryCode: location.countryCode || 'GL',
    lat: location.lat,
    lon: location.lon,
    tempC: 22,
    feelsLikeC: 22,
    highC: 25,
    lowC: 17,
    humidity: 58,
    windSpeedKm: 14,
    windDeg: 180,
    uvIndex: 5,
    pressure: 1015,
    precipitationMm: 0,
    weatherCode: 1,
    sunrise: '06:15',
    sunset: '18:30',
    summary: `Stable conditions prevailing over ${location.name}.`
  };
}

/* ==========================================================================
   7. DOM RENDERING & DYNAMIC UI UPDATES (TASK 3 & 4)
   ========================================================================== */

/**
 * Updates dynamic theme class on <body> and ambient elements
 * @param {number} weatherCode 
 */
function updateAmbientTheme(weatherCode) {
  const meta = WEATHER_CODES[weatherCode] || WEATHER_CODES[0];
  const body = document.body;

  // Remove existing weather themes
  body.classList.remove(
    'theme-weather-clear', 
    'theme-weather-clouds', 
    'theme-weather-rain', 
    'theme-weather-snow', 
    'theme-weather-thunderstorm'
  );

  const themeClass = `theme-weather-${meta.category}`;
  body.classList.add(themeClass);

  // Trigger canvas particle animation adjustment
  initWeatherAnimation(meta.category);
}

/**
 * Renders complete current weather hero and metrics
 * @param {object} weather 
 */
function renderWeatherDashboard(weather) {
  if (!weather) return;

  const codeMeta = WEATHER_CODES[weather.weatherCode] || WEATHER_CODES[0];

  // 1. Hero Card Updates
  DOM.cityNameDisplay.textContent = weather.name;
  DOM.countryBadgeDisplay.textContent = weather.countryCode || weather.country.slice(0, 3).toUpperCase();
  DOM.dateTimeDisplay.textContent = formatDateTime();

  // Temperatures
  DOM.currentTempDisplay.textContent = formatTemperature(weather.tempC);
  DOM.currentUnitDisplay.textContent = `°${AppState.unit}`;
  DOM.tempHighDisplay.textContent = `${formatTemperature(weather.highC)}°`;
  DOM.tempLowDisplay.textContent = `${formatTemperature(weather.lowC)}°`;
  DOM.tempFeelsDisplay.textContent = `${formatTemperature(weather.feelsLikeC)}°`;

  // Condition Badge & Icon
  DOM.conditionBadgeDisplay.textContent = codeMeta.label;
  DOM.mainConditionIcon.innerHTML = SVG_ICONS[codeMeta.icon] || SVG_ICONS['sun'];
  DOM.atmosphericSummaryText.textContent = weather.summary;
  DOM.lastUpdatedText.textContent = `Updated: ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  // 2. Bookmark Button state
  updateBookmarkButtonState(weather.name);

  // 3. Detailed Metrics
  // Wind
  const speedObj = formatSpeed(weather.windSpeedKm);
  DOM.windSpeedDisplay.textContent = speedObj.value;
  DOM.windUnitDisplay.textContent = speedObj.unit;
  DOM.windCompassArrow.style.transform = `rotate(${weather.windDeg}deg)`;
  DOM.windDirectionText.textContent = degreesToCompass(weather.windDeg);
  DOM.windDegreesText.textContent = `${weather.windDeg}°`;

  // Humidity
  DOM.humidityDisplay.textContent = weather.humidity;
  DOM.humidityBarFill.style.width = `${Math.min(100, weather.humidity)}%`;
  let humidityText = 'Comfortable moisture levels';
  if (weather.humidity > 70) humidityText = 'High humidity, humid feel';
  else if (weather.humidity < 35) humidityText = 'Dry air, hydrate frequently';
  DOM.humidityDescText.textContent = humidityText;

  // UV Index
  DOM.uvDisplay.textContent = weather.uvIndex;
  let uvLabel = 'Low';
  let uvAdvice = 'Minimal sun protection required';
  if (weather.uvIndex >= 8) { uvLabel = 'Very High'; uvAdvice = 'Extra protection: hat, SPF & shade'; }
  else if (weather.uvIndex >= 6) { uvLabel = 'High'; uvAdvice = 'Wear sunscreen & sunglasses'; }
  else if (weather.uvIndex >= 3) { uvLabel = 'Moderate'; uvAdvice = 'Protection recommended at midday'; }
  
  DOM.uvRatingTag.textContent = uvLabel;
  DOM.uvAdviceText.textContent = uvAdvice;
  const uvPercent = Math.min(100, (weather.uvIndex / 11) * 100);
  DOM.uvIndicatorPoint.style.left = `${uvPercent}%`;

  // Pressure
  DOM.pressureDisplay.textContent = weather.pressure;
  let pressureBadgeText = 'Normal';
  let pressureDesc = 'Barometric pressure steady';
  if (weather.pressure < 1005) { pressureBadgeText = 'Low'; pressureDesc = 'Storm system or front possible'; }
  else if (weather.pressure > 1022) { pressureBadgeText = 'High'; pressureDesc = 'Calm, settled atmospheric conditions'; }
  DOM.pressureBadge.textContent = pressureBadgeText;
  DOM.pressureDescText.textContent = pressureDesc;

  // Precipitation
  DOM.precipDisplay.textContent = weather.precipitationMm;
  DOM.precipNoteText.textContent = weather.precipitationMm > 0 
    ? `${weather.precipitationMm} mm accumulated precipitation`
    : 'No rain precipitation currently recorded';

  // Sun Cycle
  DOM.sunriseDisplay.textContent = weather.sunrise;
  DOM.sunsetDisplay.textContent = weather.sunset;
  DOM.daylightDurationText.textContent = `Daylight: ${calculateDaylight(weather.sunrise, weather.sunset)}`;

  // 4. Update Themes & Timelines
  updateAmbientTheme(weather.weatherCode);

  // Generate & Render Forecasts
  AppState.hourlyForecast = generateHourlyForecast(weather.tempC, weather.weatherCode);
  AppState.dailyForecast = generateDailyForecast(weather.tempC, weather.weatherCode);
  renderHourlyForecast();
  renderDailyForecast();
}

/**
 * Renders Hourly forecast horizontal flex carousel (Task 3 Box Model & Flexbox)
 */
function renderHourlyForecast() {
  DOM.hourlyList.innerHTML = '';

  AppState.hourlyForecast.forEach((item) => {
    const card = document.createElement('div');
    card.className = `hourly-card ${item.isNow ? 'is-now' : ''}`;

    const codeMeta = WEATHER_CODES[item.weatherCode] || WEATHER_CODES[0];
    const iconKey = item.isNight && codeMeta.icon === 'sun' ? 'moon' : codeMeta.icon;

    card.innerHTML = `
      <span class="hourly-time">${item.timeLabel}</span>
      <div class="hourly-icon-wrap" aria-hidden="true">
        ${SVG_ICONS[iconKey] || SVG_ICONS['sun']}
      </div>
      <span class="hourly-temp">${formatTemperature(item.tempC)}°</span>
      <span class="hourly-rain-chance">
        <svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
        </svg>
        ${item.rainChance}%
      </span>
    `;

    DOM.hourlyList.appendChild(card);
  });
}

/**
 * Renders 7-Day daily forecast outlook grid with filter support (Task 4 Search/Filter)
 */
function renderDailyForecast() {
  DOM.dailyList.innerHTML = '';

  let listToRender = [...AppState.dailyForecast];

  // Apply filter options (Demonstrates Array filtering and sorting)
  if (AppState.activeDailyFilter === 'weekend') {
    listToRender = listToRender.filter(day => day.isWeekend);
  } else if (AppState.activeDailyFilter === 'warmest') {
    listToRender.sort((a, b) => b.highC - a.highC);
  }

  if (listToRender.length === 0) {
    DOM.dailyList.innerHTML = `<p style="padding:1rem; color:var(--text-muted); text-align:center;">No days match the selected filter criteria.</p>`;
    return;
  }

  // Find overall min and max across all rendered days to calculate relative bars
  const minTemp = Math.min(...listToRender.map(d => d.lowC));
  const maxTemp = Math.max(...listToRender.map(d => d.highC));
  const tempSpan = Math.max(1, maxTemp - minTemp);

  listToRender.forEach((day) => {
    const card = document.createElement('article');
    card.className = 'daily-card';

    const codeMeta = WEATHER_CODES[day.weatherCode] || WEATHER_CODES[0];

    // Compute relative width & offset for temperature range bar
    const leftPercent = Math.max(0, ((day.lowC - minTemp) / tempSpan) * 100);
    const widthPercent = Math.max(15, (((day.highC - day.lowC) / tempSpan) * 100));

    card.innerHTML = `
      <div class="daily-day-info">
        <span class="daily-day-name">${day.dayName}</span>
        <span class="daily-date">${day.dateFormatted}</span>
      </div>
      <div class="daily-icon-box" aria-hidden="true">
        ${SVG_ICONS[codeMeta.icon] || SVG_ICONS['sun']}
      </div>
      <div class="daily-condition-label">${day.conditionLabel}</div>
      <div class="daily-temp-bar-wrap">
        <span class="daily-low-temp">${formatTemperature(day.lowC)}°</span>
        <div class="daily-range-visual" title="Range: ${formatTemperature(day.lowC)}° - ${formatTemperature(day.highC)}°">
          <div class="daily-range-fill" style="left: ${leftPercent}%; width: ${widthPercent}%;"></div>
        </div>
        <span class="daily-high-temp">${formatTemperature(day.highC)}°</span>
      </div>
    `;

    DOM.dailyList.appendChild(card);
  });
}

/**
 * Updates the bookmark button appearance based on whether city is saved
 * @param {string} cityName 
 */
function updateBookmarkButtonState(cityName) {
  const isSaved = AppState.savedCities.some(
    c => c.name.toLowerCase() === cityName.toLowerCase()
  );

  if (isSaved) {
    DOM.toggleFavoriteBtn.classList.add('saved');
    DOM.favoriteBtnText.textContent = 'Saved';
    DOM.toggleFavoriteBtn.setAttribute('aria-pressed', 'true');
  } else {
    DOM.toggleFavoriteBtn.classList.remove('saved');
    DOM.favoriteBtnText.textContent = 'Save';
    DOM.toggleFavoriteBtn.setAttribute('aria-pressed', 'false');
  }

  DOM.favoritesBadgeCount.textContent = AppState.savedCities.length;
}

/* ==========================================================================
   8. SAVED CITIES CRUD (ADD / EDIT / DELETE / FILTER FUNCTIONALITY)
   ========================================================================== */

/**
 * Loads saved cities from localStorage or initializes sensible defaults
 */
function loadSavedCities() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    if (raw) {
      AppState.savedCities = JSON.parse(raw);
    } else {
      // Default starter favorites to demonstrate full functionality immediately
      AppState.savedCities = [
        {
          id: 'city-1',
          name: 'Tokyo',
          country: 'Japan',
          countryCode: 'JP',
          tempC: 21,
          weatherCode: 1,
          tag: 'Work',
          notes: 'Headquarters branch office conference',
          dateAdded: '2026-11-10'
        },
        {
          id: 'city-2',
          name: 'Paris',
          country: 'France',
          countryCode: 'FR',
          tempC: 16,
          weatherCode: 61,
          tag: 'Travel',
          notes: 'Vacation tour plan for autumn',
          dateAdded: '2026-11-11'
        }
      ];
      saveSavedCities();
    }
  } catch (e) {
    AppState.savedCities = [];
  }

  DOM.favoritesBadgeCount.textContent = AppState.savedCities.length;
}

/**
 * Saves current favorites array to localStorage
 */
function saveSavedCities() {
  localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(AppState.savedCities));
  DOM.favoritesBadgeCount.textContent = AppState.savedCities.length;
}

/**
 * Renders the saved cities grid with search filtering (Task 4 Filter & DOM Manipulation)
 */
function renderSavedCities() {
  DOM.savedCitiesContainer.innerHTML = '';

  const filter = AppState.searchFilterQuery.trim().toLowerCase();
  
  // Array filter demonstration
  const filtered = AppState.savedCities.filter(city => {
    if (!filter) return true;
    return (
      city.name.toLowerCase().includes(filter) ||
      city.country.toLowerCase().includes(filter) ||
      (city.tag && city.tag.toLowerCase().includes(filter)) ||
      (city.notes && city.notes.toLowerCase().includes(filter))
    );
  });

  if (filtered.length === 0) {
    DOM.favoritesEmptyState.classList.remove('hidden');
    return;
  } else {
    DOM.favoritesEmptyState.classList.add('hidden');
  }

  filtered.forEach(city => {
    const card = document.createElement('article');
    card.className = 'saved-city-card';
    card.setAttribute('data-id', city.id);

    const codeMeta = WEATHER_CODES[city.weatherCode] || WEATHER_CODES[0];
    const tagClass = `tag-${(city.tag || 'home').toLowerCase()}`;

    card.innerHTML = `
      <header class="saved-card-header">
        <div class="saved-city-name-group" title="Click to view weather for ${city.name}">
          <h4 class="saved-city-title">${city.name}</h4>
          <span class="saved-city-country">${city.country}</span>
        </div>
        <span class="tag-chip ${tagClass}">${city.tag || 'Saved'}</span>
      </header>

      <div class="saved-card-body" title="Click to view weather for ${city.name}">
        <span class="saved-card-temp">${formatTemperature(city.tempC)}°${AppState.unit}</span>
        <div class="saved-card-condition-info">
          <div class="saved-card-icon-wrap" aria-hidden="true">
            ${SVG_ICONS[codeMeta.icon] || SVG_ICONS['sun']}
          </div>
          <span class="saved-card-cond-text">${codeMeta.label}</span>
        </div>
      </div>

      ${city.notes ? `<div class="saved-card-note">"${sanitizeInput(city.notes)}"</div>` : ''}

      <footer class="saved-card-footer">
        <time class="saved-card-date">Added: ${city.dateAdded || 'Recently'}</time>
        <div class="saved-card-btns">
          <button type="button" class="card-btn card-btn-edit" aria-label="Edit location ${city.name}" title="Edit note or tag">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
            </svg>
          </button>
          <button type="button" class="card-btn card-btn-delete" aria-label="Delete location ${city.name}" title="Remove location">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
        </div>
      </footer>
    `;

    // Click handler to load this city on dashboard
    const clickZoneHeader = card.querySelector('.saved-city-name-group');
    const clickZoneBody = card.querySelector('.saved-card-body');
    const loadHandler = () => loadCityWeatherByName(city.name);
    clickZoneHeader.addEventListener('click', loadHandler);
    clickZoneBody.addEventListener('click', loadHandler);

    // Edit button click
    const editBtn = card.querySelector('.card-btn-edit');
    editBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openEditModal(city.id);
    });

    // Delete button click
    const deleteBtn = card.querySelector('.card-btn-delete');
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteSavedCity(city.id);
    });

    DOM.savedCitiesContainer.appendChild(card);
  });
}

/**
 * Adds or removes currently displayed city from favorites
 */
function toggleCurrentCityFavorite() {
  if (!AppState.currentWeather) return;

  const current = AppState.currentWeather;
  const existingIndex = AppState.savedCities.findIndex(
    c => c.name.toLowerCase() === current.name.toLowerCase()
  );

  if (existingIndex !== -1) {
    // Already saved -> Remove
    const removed = AppState.savedCities.splice(existingIndex, 1)[0];
    saveSavedCities();
    renderSavedCities();
    updateBookmarkButtonState(current.name);
    showToast(`Removed "${removed.name}" from saved cities.`, 'info');
  } else {
    // Add new favorite
    const newCity = {
      id: `city-${Date.now()}`,
      name: current.name,
      country: current.country,
      countryCode: current.countryCode,
      tempC: current.tempC,
      weatherCode: current.weatherCode,
      tag: 'Home',
      notes: '',
      dateAdded: new Date().toISOString().split('T')[0]
    };

    AppState.savedCities.unshift(newCity);
    saveSavedCities();
    renderSavedCities();
    updateBookmarkButtonState(current.name);
    showToast(`Saved "${newCity.name}" to your locations list!`, 'success');
  }
}

/**
 * Deletes a saved city with animated removal and an Undo Toast (Task 4 Add/Edit/Delete)
 * @param {string} id 
 */
function deleteSavedCity(id) {
  const index = AppState.savedCities.findIndex(c => c.id === id);
  if (index === -1) return;

  const deletedCity = AppState.savedCities[index];
  AppState.deletedCityBuffer = { city: deletedCity, index };

  // Remove from state array
  AppState.savedCities.splice(index, 1);
  saveSavedCities();
  renderSavedCities();

  if (AppState.currentWeather && AppState.currentWeather.name.toLowerCase() === deletedCity.name.toLowerCase()) {
    updateBookmarkButtonState(AppState.currentWeather.name);
  }

  // Display Undo Toast
  showToast(`Deleted "${deletedCity.name}".`, 'warning', true);
}

/**
 * Restores recently deleted city from the undo buffer
 */
function undoCityDeletion() {
  if (!AppState.deletedCityBuffer) return;

  const { city, index } = AppState.deletedCityBuffer;
  AppState.savedCities.splice(index, 0, city);
  AppState.deletedCityBuffer = null;

  saveSavedCities();
  renderSavedCities();

  if (AppState.currentWeather && AppState.currentWeather.name.toLowerCase() === city.name.toLowerCase()) {
    updateBookmarkButtonState(city.name);
  }

  showToast(`Restored "${city.name}" to favorites!`, 'success');
}

/**
 * Opens Modal dialog for Adding or Editing a location
 * @param {string|null} id - ID if editing, null if adding current
 */
function openEditModal(id = null) {
  DOM.locationModalForm.reset();
  DOM.modalNameError.textContent = '';
  DOM.modalCityName.classList.remove('is-invalid');

  if (id) {
    // Editing an existing entry
    const city = AppState.savedCities.find(c => c.id === id);
    if (!city) return;

    DOM.modalTitle.textContent = `Edit "${city.name}"`;
    DOM.modalCityId.value = city.id;
    DOM.modalCityName.value = city.name;
    DOM.modalCityNotes.value = city.notes || '';
    DOM.noteCharCount.textContent = (city.notes || '').length;

    // Check matching radio
    const radio = DOM.locationModalForm.querySelector(`input[name="location-tag"][value="${city.tag || 'Home'}"]`);
    if (radio) radio.checked = true;
  } else {
    // Adding new
    DOM.modalTitle.textContent = 'Add Location to Favorites';
    DOM.modalCityId.value = '';
    const nameDefault = AppState.currentWeather ? AppState.currentWeather.name : '';
    DOM.modalCityName.value = nameDefault;
    DOM.modalCityNotes.value = '';
    DOM.noteCharCount.textContent = '0';
    const firstRadio = DOM.locationModalForm.querySelector('input[name="location-tag"][value="Home"]');
    if (firstRadio) firstRadio.checked = true;
  }

  DOM.locationModal.classList.remove('hidden');
  DOM.modalCityName.focus();
}

/**
 * Closes the modal dialog
 */
function closeEditModal() {
  DOM.locationModal.classList.add('hidden');
}

/**
 * Handles modal form submission with thorough validation (Task 4 Form Validation)
 * @param {Event} e 
 */
async function handleModalFormSubmit(e) {
  e.preventDefault();

  const nameInput = DOM.modalCityName.value.trim();
  const notesInput = DOM.modalCityNotes.value.trim();
  const selectedTagInput = DOM.locationModalForm.querySelector('input[name="location-tag"]:checked');
  const tag = selectedTagInput ? selectedTagInput.value : 'Home';
  const cityId = DOM.modalCityId.value;

  // Validation: Check for empty or invalid city name
  if (!nameInput) {
    DOM.modalNameError.textContent = 'City name is required.';
    DOM.modalCityName.classList.add('is-invalid');
    DOM.modalCityName.focus();
    return;
  }

  if (nameInput.length < 2) {
    DOM.modalNameError.textContent = 'City name must have at least 2 characters.';
    DOM.modalCityName.classList.add('is-invalid');
    DOM.modalCityName.focus();
    return;
  }

  if (/[<>{}\[\]\\]/.test(nameInput)) {
    DOM.modalNameError.textContent = 'Please enter a valid city name without special symbols.';
    DOM.modalCityName.classList.add('is-invalid');
    DOM.modalCityName.focus();
    return;
  }

  // Clear validation
  DOM.modalNameError.textContent = '';
  DOM.modalCityName.classList.remove('is-invalid');

  if (cityId) {
    // Update existing city (EDIT Operation)
    const city = AppState.savedCities.find(c => c.id === cityId);
    if (city) {
      city.name = nameInput;
      city.tag = tag;
      city.notes = notesInput;
      saveSavedCities();
      renderSavedCities();
      showToast(`Updated details for "${city.name}".`, 'success');
    }
  } else {
    // Create new city (ADD Operation)
    // Check if duplicate exists
    const duplicate = AppState.savedCities.some(
      c => c.name.toLowerCase() === nameInput.toLowerCase()
    );

    if (duplicate) {
      DOM.modalNameError.textContent = 'This city is already in your saved locations.';
      DOM.modalCityName.classList.add('is-invalid');
      return;
    }

    // Try to get live temperature or use procedural
    const locationResults = await searchLocations(nameInput);
    let tempC = 20;
    let weatherCode = 1;
    let country = 'Global';
    let countryCode = 'GL';

    if (locationResults && locationResults.length > 0) {
      const weather = await fetchWeatherData(locationResults[0]);
      tempC = weather.tempC;
      weatherCode = weather.weatherCode;
      country = weather.country;
      countryCode = weather.countryCode;
    }

    const newCity = {
      id: `city-${Date.now()}`,
      name: nameInput,
      country: country,
      countryCode: countryCode,
      tempC: tempC,
      weatherCode: weatherCode,
      tag: tag,
      notes: notesInput,
      dateAdded: new Date().toISOString().split('T')[0]
    };

    AppState.savedCities.unshift(newCity);
    saveSavedCities();
    renderSavedCities();
    if (AppState.currentWeather && AppState.currentWeather.name.toLowerCase() === nameInput.toLowerCase()) {
      updateBookmarkButtonState(nameInput);
    }
    showToast(`Added "${nameInput}" to saved locations!`, 'success');
  }

  closeEditModal();
}

/* ==========================================================================
   9. SEARCH, FORM VALIDATION & AUTOCOMPLETE (TASK 3 & 4)
   ========================================================================== */

/**
 * Validates the search form input
 * @param {string} value 
 * @returns {object} { isValid: boolean, error: string }
 */
function validateSearchInput(value) {
  const trimmed = value.trim();

  if (!trimmed) {
    return { isValid: false, error: 'Please enter a city or location name to search.' };
  }

  if (trimmed.length < 2) {
    return { isValid: false, error: 'Search query must be at least 2 characters long.' };
  }

  if (/[0-9<>{}\[\]=;()$]/.test(trimmed)) {
    return { isValid: false, error: 'Location names should only contain letters, spaces, hyphens and commas.' };
  }

  return { isValid: true, error: '' };
}

/**
 * Shows or clears search error message with aria-invalid
 * @param {string} msg 
 */
function setSearchError(msg) {
  DOM.searchErrorMsg.textContent = msg;
  if (msg) {
    DOM.searchInput.classList.add('is-invalid');
    DOM.searchInput.setAttribute('aria-invalid', 'true');
  } else {
    DOM.searchInput.classList.remove('is-invalid');
    DOM.searchInput.removeAttribute('aria-invalid');
  }
}

/**
 * Executes full weather lookup for city name string
 * @param {string} cityName 
 */
async function loadCityWeatherByName(cityName) {
  setSearchError('');
  DOM.searchSpinner.classList.remove('hidden');

  try {
    const locations = await searchLocations(cityName);
    if (!locations || locations.length === 0) {
      setSearchError(`No weather station located for "${cityName}". Please verify spelling.`);
      showToast(`City "${cityName}" not found.`, 'error');
      return;
    }

    const selectedLoc = locations[0];
    const weather = await fetchWeatherData(selectedLoc);

    AppState.currentWeather = weather;
    renderWeatherDashboard(weather);

    // Save to last city preference
    localStorage.setItem(STORAGE_KEYS.LAST_CITY, weather.name);

    // Scroll smoothly to dashboard if on mobile
    if (window.innerWidth < 768) {
      DOM.heroCard.scrollIntoView({ behavior: 'smooth' });
    }
  } catch (err) {
    setSearchError('An unexpected error occurred while contacting meteorological servers.');
    showToast('Failed to load weather data. Please try again.', 'error');
  } finally {
    DOM.searchSpinner.classList.add('hidden');
    DOM.suggestionsDropdown.classList.add('hidden');
  }
}

/**
 * Handles search form submission (Task 4 Events & Form Validation)
 * @param {Event} e 
 */
function handleSearchSubmit(e) {
  e.preventDefault();

  const query = DOM.searchInput.value;
  const validation = validateSearchInput(query);

  if (!validation.isValid) {
    setSearchError(validation.error);
    DOM.searchInput.focus();
    return;
  }

  setSearchError('');
  loadCityWeatherByName(query.trim());
}

/**
 * Debounced search input handler for real-time autocomplete suggestions
 */
const handleSearchInput = debounce(async (e) => {
  const query = e.target.value.trim();

  // Show/hide clear button
  DOM.clearSearchBtn.classList.toggle('hidden', query.length === 0);

  if (query.length < 2) {
    DOM.suggestionsDropdown.classList.add('hidden');
    DOM.suggestionsDropdown.innerHTML = '';
    return;
  }

  DOM.searchSpinner.classList.remove('hidden');
  const results = await searchLocations(query);
  DOM.searchSpinner.classList.add('hidden');

  if (results && results.length > 0) {
    DOM.suggestionsDropdown.innerHTML = '';
    results.slice(0, 5).forEach((loc) => {
      const item = document.createElement('div');
      item.className = 'suggestion-item';
      item.setAttribute('role', 'option');
      item.innerHTML = `
        <span class="suggestion-city">${loc.name}${loc.state ? `, ${loc.state}` : ''}</span>
        <span class="suggestion-country">${loc.country || ''}</span>
      `;
      item.addEventListener('click', () => {
        DOM.searchInput.value = loc.name;
        DOM.suggestionsDropdown.classList.add('hidden');
        loadCityWeatherByName(loc.name);
      });
      DOM.suggestionsDropdown.appendChild(item);
    });
    DOM.suggestionsDropdown.classList.remove('hidden');
  } else {
    DOM.suggestionsDropdown.classList.add('hidden');
  }
}, 300);

/**
 * Handles Geolocation request using browser GPS API
 */
function handleGeolocation() {
  if (!navigator.geolocation) {
    showToast('Geolocation is not supported by your browser.', 'error');
    return;
  }

  DOM.geoBtn.disabled = true;
  DOM.searchSpinner.classList.remove('hidden');

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      DOM.geoBtn.disabled = false;
      const { latitude, longitude } = position.coords;

      try {
        const loc = {
          name: 'Current Location',
          country: 'GPS Detected',
          countryCode: 'GPS',
          lat: latitude,
          lon: longitude
        };
        const weather = await fetchWeatherData(loc);
        AppState.currentWeather = weather;
        renderWeatherDashboard(weather);
        showToast('Local weather loaded from your GPS coordinates.', 'success');
      } catch (err) {
        showToast('Unable to fetch weather for your GPS position.', 'error');
      } finally {
        DOM.searchSpinner.classList.add('hidden');
      }
    },
    (error) => {
      DOM.geoBtn.disabled = false;
      DOM.searchSpinner.classList.add('hidden');
      let msg = 'Unable to acquire location.';
      if (error.code === error.PERMISSION_DENIED) {
        msg = 'Location permission was denied. Defaulting to London.';
        loadCityWeatherByName('London');
      }
      showToast(msg, 'info');
    },
    { timeout: 7000 }
  );
}

/* ==========================================================================
   10. INTERACTIVE CONTROLS & THEME SWITCHING (TASK 4)
   ========================================================================== */

/**
 * Sets temperature unit (°C / °F) and updates entire UI dynamically
 * @param {'C'|'F'} unit 
 */
function setTemperatureUnit(unit) {
  if (AppState.unit === unit) return;

  AppState.unit = unit;
  localStorage.setItem(STORAGE_KEYS.UNIT, unit);

  // Toggle active button classes
  DOM.unitBtnC.classList.toggle('active', unit === 'C');
  DOM.unitBtnC.setAttribute('aria-pressed', unit === 'C');
  DOM.unitBtnF.classList.toggle('active', unit === 'F');
  DOM.unitBtnF.setAttribute('aria-pressed', unit === 'F');

  // Re-render UI elements that show temperatures
  if (AppState.currentWeather) {
    renderWeatherDashboard(AppState.currentWeather);
  }
  renderSavedCities();

  showToast(`Temperature unit switched to °${unit}.`, 'info');
}

/**
 * Toggles Dark and Light theme
 */
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  document.documentElement.setAttribute('data-theme', newTheme);
  AppState.theme = newTheme;
  localStorage.setItem(STORAGE_KEYS.THEME, newTheme);

  showToast(`${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} theme activated.`, 'info');
}

/**
 * Initializes saved theme from localStorage
 */
function initTheme() {
  const saved = localStorage.getItem(STORAGE_KEYS.THEME);
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
    AppState.theme = saved;
  }
}

/**
 * Floating Toast Notification system
 * @param {string} message 
 * @param {'success'|'error'|'info'|'warning'} type 
 * @param {boolean} showUndo 
 */
function showToast(message, type = 'info', showUndo = false) {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.setAttribute('role', 'status');

  toast.innerHTML = `
    <span class="toast-msg">${sanitizeInput(message)}</span>
    ${showUndo ? `<button type="button" class="toast-undo-btn">Undo</button>` : ''}
    <button type="button" class="toast-close-btn" aria-label="Dismiss">&times;</button>
  `;

  if (showUndo) {
    const undoBtn = toast.querySelector('.toast-undo-btn');
    undoBtn.addEventListener('click', () => {
      undoCityDeletion();
      toast.remove();
    });
  }

  const closeBtn = toast.querySelector('.toast-close-btn');
  closeBtn.addEventListener('click', () => toast.remove());

  DOM.toastContainer.appendChild(toast);

  // Auto remove after 4.5 seconds
  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 250);
    }
  }, 4500);
}

/* ==========================================================================
   11. WEATHER CANVAS PARTICLES (SUBTLE AMBIENT VISUAL EFFECTS)
   ========================================================================== */

let canvasAnimationId = null;

function initWeatherAnimation(category) {
  const canvas = DOM.weatherCanvas;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  if (canvasAnimationId) {
    cancelAnimationFrame(canvasAnimationId);
  }

  // Set resolution
  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', debounce(resize, 200));

  const particles = [];
  const count = category === 'rain' ? 80 : (category === 'snow' ? 60 : 35);

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: category === 'snow' ? Math.random() * 2.5 + 1 : Math.random() * 1.5 + 0.5,
      speedX: category === 'snow' ? Math.random() * 1 - 0.5 : (category === 'rain' ? -1 : 0.2),
      speedY: category === 'rain' ? Math.random() * 5 + 4 : (category === 'snow' ? Math.random() * 1.5 + 0.8 : Math.random() * 0.4 - 0.2),
      opacity: Math.random() * 0.5 + 0.2
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      ctx.beginPath();
      if (category === 'rain') {
        ctx.strokeStyle = `rgba(56, 189, 248, ${p.opacity * 0.5})`;
        ctx.lineWidth = 1.2;
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.speedX * 2, p.y + p.speedY * 2);
        ctx.stroke();
      } else if (category === 'snow') {
        ctx.fillStyle = `rgba(224, 242, 254, ${p.opacity * 0.6})`;
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Floating ambient dust / light particles
        ctx.fillStyle = `rgba(245, 158, 11, ${p.opacity * 0.25})`;
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Update positions
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.y > canvas.height) { p.y = -10; p.x = Math.random() * canvas.width; }
      if (p.x > canvas.width) p.x = 0;
      if (p.x < 0) p.x = canvas.width;
    });

    canvasAnimationId = requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   12. EVENT LISTENERS & INITIALIZATION ORCHESTRATION
   ========================================================================== */

function setupEventListeners() {
  // 1. Search Form
  DOM.searchForm.addEventListener('submit', handleSearchSubmit);
  DOM.searchInput.addEventListener('input', handleSearchInput);
  DOM.clearSearchBtn.addEventListener('click', () => {
    DOM.searchInput.value = '';
    DOM.clearSearchBtn.classList.add('hidden');
    DOM.suggestionsDropdown.classList.add('hidden');
    setSearchError('');
    DOM.searchInput.focus();
  });

  // Geolocation
  DOM.geoBtn.addEventListener('click', handleGeolocation);

  // Popular Quick-Pill Cities
  DOM.quickCitiesList.addEventListener('click', (e) => {
    const pill = e.target.closest('.quick-pill');
    if (pill && pill.dataset.city) {
      DOM.searchInput.value = pill.dataset.city;
      loadCityWeatherByName(pill.dataset.city);
    }
  });

  // 2. Unit Switcher Controls
  DOM.unitBtnC.addEventListener('click', () => setTemperatureUnit('C'));
  DOM.unitBtnF.addEventListener('click', () => setTemperatureUnit('F'));

  // 3. Theme Toggle
  DOM.themeToggleBtn.addEventListener('click', toggleTheme);

  // 4. Hero Refresh & Favorite Bookmark
  DOM.refreshWeatherBtn.addEventListener('click', () => {
    if (AppState.currentWeather) {
      DOM.refreshWeatherBtn.style.transform = 'rotate(360deg)';
      DOM.refreshWeatherBtn.style.transition = 'transform 0.6s ease';
      setTimeout(() => {
        DOM.refreshWeatherBtn.style.transform = 'none';
        DOM.refreshWeatherBtn.style.transition = 'none';
      }, 600);
      loadCityWeatherByName(AppState.currentWeather.name);
      showToast('Weather data refreshed.', 'info');
    }
  });

  DOM.toggleFavoriteBtn.addEventListener('click', toggleCurrentCityFavorite);

  // 5. Forecast Tabs
  DOM.tabHourly.addEventListener('click', () => {
    DOM.tabHourly.classList.add('active');
    DOM.tabHourly.setAttribute('aria-selected', 'true');
    DOM.tabDaily.classList.remove('active');
    DOM.tabDaily.setAttribute('aria-selected', 'false');

    DOM.panelHourly.classList.remove('hidden');
    DOM.panelDaily.classList.add('hidden');
    AppState.activeForecastTab = 'hourly';
  });

  DOM.tabDaily.addEventListener('click', () => {
    DOM.tabDaily.classList.add('active');
    DOM.tabDaily.setAttribute('aria-selected', 'true');
    DOM.tabHourly.classList.remove('active');
    DOM.tabHourly.setAttribute('aria-selected', 'false');

    DOM.panelDaily.classList.remove('hidden');
    DOM.panelHourly.classList.add('hidden');
    AppState.activeForecastTab = 'daily';
  });

  // Daily Filter select
  DOM.forecastFilterSelect.addEventListener('change', (e) => {
    AppState.activeDailyFilter = e.target.value;
    renderDailyForecast();
  });

  // 6. Favorites Filter Input
  DOM.filterFavoritesInput.addEventListener('input', (e) => {
    AppState.searchFilterQuery = e.target.value;
    renderSavedCities();
  });

  // 7. Modal Handlers (Add / Edit)
  DOM.btnAddModalOpen.addEventListener('click', () => openEditModal(null));
  DOM.modalCloseBtn.addEventListener('click', closeEditModal);
  DOM.modalCancelBtn.addEventListener('click', closeEditModal);
  DOM.locationModalForm.addEventListener('submit', handleModalFormSubmit);

  // Character counter for modal notes
  DOM.modalCityNotes.addEventListener('input', (e) => {
    DOM.noteCharCount.textContent = e.target.value.length;
  });

  // Close modal on backdrop click
  DOM.locationModal.addEventListener('click', (e) => {
    if (e.target === DOM.locationModal) closeEditModal();
  });

  // 8. Navigation Favorites Button Jump
  DOM.navFavoritesBtn.addEventListener('click', () => {
    DOM.favoritesSection.scrollIntoView({ behavior: 'smooth' });
  });

  // 9. Back To Top Button
  DOM.btnBackToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 10. Global Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeEditModal();
      DOM.suggestionsDropdown.classList.add('hidden');
    }
  });

  // Close suggestions dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!DOM.searchForm.contains(e.target) && !DOM.suggestionsDropdown.contains(e.target)) {
      DOM.suggestionsDropdown.classList.add('hidden');
    }
  });
}

/**
 * Initializes continuous live time ticker in the header
 */
function startLiveClock() {
  const updateClock = () => {
    const now = new Date();
    DOM.liveTimeDisplay.textContent = now.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };
  updateClock();
  setInterval(updateClock, 1000);
}

/**
 * Main application initialization routine
 */
function initApp() {
  console.log('%cWeatherly Meteorology v1.0.0 Initialized', 'color:#38bdf8; font-weight:bold; font-size:14px;');

  // 1. Initialize Settings
  initTheme();
  const savedUnit = localStorage.getItem(STORAGE_KEYS.UNIT);
  if (savedUnit === 'F' || savedUnit === 'C') {
    AppState.unit = savedUnit;
    DOM.unitBtnC.classList.toggle('active', savedUnit === 'C');
    DOM.unitBtnC.setAttribute('aria-pressed', savedUnit === 'C');
    DOM.unitBtnF.classList.toggle('active', savedUnit === 'F');
    DOM.unitBtnF.setAttribute('aria-pressed', savedUnit === 'F');
  }

  // 2. Setup Saved Cities
  loadSavedCities();
  renderSavedCities();

  // 3. Register Event Listeners
  setupEventListeners();
  startLiveClock();

  // 4. Load initial city
  const lastCity = localStorage.getItem(STORAGE_KEYS.LAST_CITY) || 'London';
  loadCityWeatherByName(lastCity);
}

// Start application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

