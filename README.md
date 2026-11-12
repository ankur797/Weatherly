# 🌤️ Weatherly Meteorology — Responsive Weather Web Application

Weatherly is a real-time, responsive meteorological web application built with **Semantic HTML5, CSS3 (Box Model, Flexbox, Grid, Media Queries), and Modern Vanilla JavaScript (ES6+)**.

This project has been engineered to fulfill the requirements of **Task 3: Final Responsive Website (30 Marks)** and **Task 4: JavaScript Interactivity (15 Marks)**.

---

## 📋 Table of Contents
1. [Project Overview & Key Features](#-project-overview--key-features)
2. [Task 3: Final Responsive Website Rubric (30 Marks)](#-task-3-final-responsive-website-rubric-30-marks)
   - [HTML Structure & Semantics](#1-html-structure--semantic-html)
   - [CSS Styling (Box Model, Flexbox, Grid, Media Queries)](#2-css-styling--responsive-architecture)
   - [JavaScript Fundamentals (Functions, Arrays, Objects, DOM, Events)](#3-javascript-fundamentals)
3. [Task 4: JavaScript Interactivity Rubric (15 Marks)](#-task-4-javascript-interactivity-rubric-15-marks)
   - [Dynamic Content](#1-dynamic-content)
   - [Form Validation](#2-form-validation)
   - [Interactive Buttons & State](#3-interactive-buttons--controls)
   - [Search / Filter Functionality](#4-search--filter-capabilities)
   - [Add / Edit / Delete Functionality (CRUD)](#5-add--edit--delete-functionality-crud)
4. [File Structure](#-file-structure)
5. [How to Run the Project](#-how-to-run-the-project)
6. [Offline & Network Fallback Strategy](#-offline--network-fallback-strategy)

---

## 🌟 Project Overview & Key Features

- **Real-Time Global Weather**: Live meteorological data (temperature, feels-like, highs/lows, humidity, UV index, air pressure, wind velocity & compass direction, precipitation, sunrise, sunset, daylight duration).
- **Glassmorphic Modern UI**: Glassmorphic styling with backdrop blurs, glow shadows, animated SVG weather badges, and responsive typography (`clamp()`).
- **Dynamic Adaptive Themes**: Background theme changes dynamically based on current weather condition (Clear/Sunny golden glow, Clouds silver slate, Rain azure mist, Snow frosted cyan, Thunderstorm deep indigo) and supports a manual **Dark / Light mode** toggle.
- **Interactive Timelines**: 24-Hour hourly forecast carousel + 7-Day daily outlook with temperature range visualizers.
- **Personal Watchlist (Saved Cities)**: Add, edit, filter, and delete favorite cities with custom tags (`Home`, `Work`, `Travel`, `Family`) and personal notes, backed by `localStorage` persistence and an "Undo" toast banner.

---

## 🏆 Task 3: Final Responsive Website Rubric (30 Marks)

### 1. HTML Structure & Semantic HTML
The document adheres strictly to W3C standards using modern semantic elements:
- `<header class="app-header">`: Top navigation containing branding, live ticking clock, unit switcher, theme toggle, and saved locations jump link.
- `<nav class="app-nav">`: Accessible button controls with `aria-label`, `aria-pressed`, and role groups.
- `<main class="main-content">`: Main content wrapper.
  - `<section class="search-section">`: Search bar, location autocomplete, and quick pill selectors.
  - `<section class="hero-weather-section">`: `<article class="weather-hero-card">` with `<header>`, `<time>`, temperature metrics, and atmospheric summary footer.
  - `<section class="metrics-section">`: Detailed weather metrics cards.
  - `<section class="forecast-section">`: Forecast timeline tabs (`role="tablist"`, `role="tab"`, `role="tabpanel"`).
  - `<section class="saved-cities-section">`: User watchlist manager.
- `<footer>`: Semantic attribution, compliance notes, and back-to-top button.
- `<dialog>` / Modal with semantic form controls (`<form>`, `<fieldset>`, `<label>`, `<input>`, `<textarea>`).

### 2. CSS Styling & Responsive Architecture
- **Box Model**:
  - Global `*, *::before, *::after { box-sizing: border-box; }` reset.
  - Well-defined padding, margin spacing scale, borders with translucent alpha channels, and accessible `:focus-visible` outline rings.
- **Flexbox**:
  - Top header navigation bar (`display: flex; justify-content: space-between; align-items: center`).
  - Search input container with leading icon and trailing action buttons.
  - Current temperature and extremes row.
  - 24-Hour hourly forecast horizontal scroll carousel (`flex: 0 0 110px; overflow-x: auto`).
  - Action button groups, pill badges, and modal action buttons.
- **CSS Grid**:
  - Detailed Metrics Dashboard (`display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem`).
  - Saved Cities Watchlist (`display: grid; grid-template-columns: repeat(auto-fill, minmax(310px, 1fr)); gap: 1.25rem`).
  - Modal tag selector (`display: grid; grid-template-columns: repeat(2, 1fr)`).
  - Sun cycle dual-card layout (`display: grid; grid-template-columns: 1fr 1fr`).
- **Responsive Design & Media Queries**:
  - Fluid typography with `clamp()` for responsive font sizes across all screen sizes.
  - **Desktop (> 1024px)**: Multi-column metrics grid, expanded search bar, side-by-side daily forecast rows.
  - **Tablets (768px – 1024px)**: 2-column metrics grid, adaptive cards.
  - **Mobile (< 768px)**: Stacked single-column layouts, touch-friendly tap targets (minimum 44px), optimized search bar, hidden extraneous text.
  - **Small Mobile (< 480px)**: Compact padding, scaled-down hero typography, single-column tag selector.

### 3. JavaScript Fundamentals
- **Functions**:
  - Pure conversion functions: `celsiusToFahrenheit()`, `formatTemperature()`, `formatSpeed()`, `degreesToCompass()`, `calculateDaylight()`, `sanitizeInput()`.
  - Asynchronous functions: `fetchWeatherData()`, `searchLocations()`, `loadCityWeatherByName()`.
  - UI Rendering functions: `renderWeatherDashboard()`, `renderHourlyForecast()`, `renderDailyForecast()`, `renderSavedCities()`.
- **Arrays**:
  - `hourlyForecast`: Array of 24 hourly objects, iterated with `.forEach()`.
  - `dailyForecast`: Array of 7 day objects, filtered with `.filter()` and sorted with `.sort()`.
  - `savedCities`: Array of user locations, manipulated with `.push()`, `.unshift()`, `.splice()`, `.find()`, `.findIndex()`, and `.some()`.
  - `FALLBACK_CITIES`: Built-in world city dataset.
- **Objects**:
  - `AppState`: Centralized state management object holding current city, unit, theme, active filter, and undo buffer.
  - `WEATHER_CODES`: Registry mapping WMO codes to descriptions, icons, and theme classes.
  - `SVG_ICONS`: Scalable vector graphic strings for crisp zero-latency icon rendering.
  - `DOM`: Cached DOM elements for optimal performance.
- **DOM Manipulation**:
  - Dynamic element generation via `document.createElement()`.
  - Attribute updates: `setAttribute('aria-pressed', ...)`, `classList.toggle()`, `classList.add()`, `classList.remove()`.
  - Inline CSS style calculations: dynamic compass needle rotation (`transform: rotate(${deg}deg)`), humidity progress bar width, UV index position point.
- **Events**:
  - `submit` (search form, modal form).
  - `input` (search debounced autocomplete, saved cities filter, textarea character counter).
  - `click` (unit switch, theme toggle, geo detect, bookmark, modal controls, tab switches, undo button).
  - `keydown` (`Escape` key to close dialogs, `Enter` key to submit).
  - `DOMContentLoaded` and `resize` (canvas particles).

---

## ⚡ Task 4: JavaScript Interactivity Rubric (15 Marks)

### 1. Dynamic Content
- **Live Meteorological Feed**: Connects to the Open-Meteo REST API (free, open, no API key required) for real-time worldwide weather.
- **Real-Time Live Clock**: Ticks every second in the header with formatted time.
- **Dynamic Weather Themes**: When a city is loaded, the page background and canvas particle generator dynamically switch to match (Rain droplets for rainy weather, snowflakes for snowy conditions, golden aura for sunny weather).
- **Diurnal Sun Cycle**: Dynamically calculates daylight hours and minutes between sunrise and sunset.

### 2. Form Validation
- **Search Bar Validation**:
  - Validates minimum query length (>= 2 characters).
  - Sanitizes against script injection / illegal characters (`<`, `>`, `{`, `}`, `[`, `]`, `;`, `$`).
  - Shakes the input field on error with CSS keyframe animation.
  - Provides clear, accessible error text in an `aria-live="polite"` error container and marks `aria-invalid="true"`.
- **Modal Location Validation**:
  - City name is mandatory (checks for empty input).
  - Enforces character limits (maximum 40 for city name, 150 for personal notes).
  - Live character countdown for notes (`0 / 150 characters`).
  - Prevents duplicate city entries.

### 3. Interactive Buttons & Controls
- **°C / °F Unit Switcher**: Instantly recalculates every displayed temperature (current, feels-like, highs, lows, 24-hour forecast, 7-day outlook, and saved city cards) without reloading or refetching.
- **Theme Switcher**: One-click toggle between Dark Mode and Light Mode, persisted in `localStorage`.
- **GPS Location Detection**: Uses browser `navigator.geolocation` to detect coordinates and display local weather.
- **Manual Refresh Button**: Features an animated 360-degree spin animation while refreshing data.
- **Forecast Tab Switcher**: Seamlessly toggles between "24-Hour Forecast" and "7-Day Outlook" panels.
- **Back to Top Button**: Smooth scroll back to the header from the footer.

### 4. Search & Filter Capabilities
- **Debounced Autocomplete Search (300ms)**: Displays a drop-down list of matched locations as the user types.
- **Popular City Quick Pills**: Instant one-click weather for London, Tokyo, New York, Paris, Dubai, Sydney, and Mumbai.
- **Saved Cities Filter**: Real-time search filter input above the watchlist allows instantaneous filtering by city name, country, custom category tag, or personal note keywords.
- **Daily Forecast Filter**: Allows filtering the 7-day outlook by:
  - *Show All 7 Days*
  - *Weekend Only*
  - *Warmest Days First* (sorts by highest temperature descending)

### 5. Add / Edit / Delete Functionality (CRUD)
- **Add**:
  - Click the **Save** bookmark icon in the hero card to instantly bookmark the current city.
  - Or click **+ Add Location** to open the modal, select a custom category tag (`🏠 Home`, `💼 Work`, `✈️ Travel`, `❤️ Family`), and write personal notes.
- **Edit**:
  - Click the pencil icon on any saved city card.
  - Opens the Edit Modal pre-populated with current values.
  - Change the nickname, category tag, or personal notes.
  - Saves changes to `localStorage` and updates the DOM immediately.
- **Delete**:
  - Click the trash icon on any saved card.
  - Removes the card with a smooth exit.
  - Triggers a floating **Undo Toast** banner allowing the user to restore the deleted city within 5 seconds!
- **Persistence**:
  - All saved cities, selected temperature unit (°C/°F), and theme preference are stored in `localStorage` so data remains available upon page reload.

---

## 📁 File Structure

```
Whether/
├── index.html        # Semantic HTML5 document structure
├── style.css         # Modern CSS system (Box Model, Flexbox, Grid, Media Queries)
├── app.js            # Vanilla JavaScript (API handling, state, DOM manipulation, CRUD)
└── README.md         # Comprehensive project documentation & rubric mapping
```

---

## 🚀 How to Run the Project

1. **Directly in Browser**:
   - Double-click `index.html` or right-click and choose **Open with > Google Chrome** (or Microsoft Edge, Firefox, Safari).
2. **Via Live Server (VS Code / IDE)**:
   - Right-click `index.html` and click **"Open with Live Server"**.
3. No build tools, bundlers, npm packages, or API keys are required.

---

## 🛡️ Offline & Network Fallback Strategy

The application is engineered with high resilience:
- When online, it queries the live Open-Meteo REST API.
- If offline, rate-limited, or blocked by CORS, it seamlessly switches to an embedded dataset of major global cities (London, Tokyo, New York, Paris, Sydney, Mumbai, Dubai) with simulated meteorological patterns.
- All SVG icons are generated in pure code, eliminating broken third-party font/image links.

---

**Developed for Internship Evaluation — Final Responsive Website & JavaScript Interactivity.**

