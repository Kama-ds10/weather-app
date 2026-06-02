// Keep all previous API + processor functions above

const form = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const currentWeatherDiv = document.getElementById('current-weather');
const forecastDiv = document.getElementById('forecast');

async function getWeatherIcon(iconCode) {
  // Webpack will bundle all files matching this pattern
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  return iconUrl;
}

// Display current weather on page
async function displayCurrentWeather(data) {
  const iconUrl = await getWeatherIcon(data.icon);
  
  currentWeatherDiv.innerHTML = `
    <h2>${data.city}, ${data.country}</h2>
    <img src="${iconUrl}" alt="${data.description}">
    <h3>${data.temp}°C</h3>
    <p>Feels like ${data.feelsLike}°C</p>
    <p>${data.description}</p>
    <p>Humidity: ${data.humidity}% | Wind: ${data.windSpeed} m/s</p>
  `;
}

// Display 5-day forecast
async function displayForecast(forecastArray) {
  forecastDiv.innerHTML = '';
  
  for (const day of forecastArray) {
    const iconUrl = await getWeatherIcon(day.icon);
    const dayName = new Date(day.date).toLocaleDateString('en', { weekday: 'short' });
    
    const card = document.createElement('div');
    card.className = 'forecast-card';
    card.innerHTML = `
      <p>${dayName}</p>
      <img src="${iconUrl}" alt="${day.description}">
      <p>${day.temp}°C</p>
      <p>${day.description}</p>
    `;
    forecastDiv.appendChild(card);
  }
}


// Update form submit handler to display instead of console.log
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (!city) return;

  const rawWeather = await getWeatherByCity(city);
  if (rawWeather) {
    const weather = processCurrentWeather(rawWeather);
    await displayCurrentWeather(weather);
  }
  
  const rawForecast = await getForecastByCity(city);
  if (rawForecast) {
    const forecast = processForecast(rawForecast);
    await displayForecast(forecast);
  }
  
  cityInput.value = '';
});

form.addEventListener('submit', async (e) => {
  e.preventDefault(); // Stop page from reloading
  
  const city = cityInput.value.trim();
  
  if (!city) {
    console.log('Please enter a city name');
    return;
  }

  console.log(`Searching weather for: ${city}`);
  
  // 1. Fetch current weather
  const rawWeather = await getWeatherByCity(city);
  if (rawWeather) {
    const weather = processCurrentWeather(rawWeather);
    console.log('Current Weather:', weather);
  }
  
  // 2. Fetch forecast
  const rawForecast = await getForecastByCity(city);
  if (rawForecast) {
    const forecast = processForecast(rawForecast);
    console.log('Forecast:', forecast);
  }
  
  // Clear input after search
  cityInput.value = '';
});

// console.log("Weather app loaded ✅");

console.log("Weather app loaded ✅");


const API_KEY = '5dd20bf39b151802ef4c587f358a187a'; // Replace with your actual API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Function 1: Get current weather by city name
async function getWeatherByCity(city) {
  try {
    const url = `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`City not found: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Current Weather:', data);
    return data;
  } catch (error) {
    console.error('Error fetching weather:', error.message);
  }
}

// Function 2: Get 5-day forecast
async function getForecastByCity(city) {
  try {
    const url = `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Forecast not found: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('5-Day Forecast:', data);
    return data;
  } catch (error) {
    console.error('Error fetching forecast:', error.message);
  }
}

// Test it - remove later when we add search input
getWeatherByCity('Lagos');
getForecastByCity('Lagos');



// Process current weather JSON → clean object
function processCurrentWeather(data) {
  return {
    city: data.name,
    country: data.sys.country,
    temp: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    timestamp: data.dt
  };
}

// Process 5-day forecast JSON → array of daily objects
function processForecast(data) {
  // API returns 3hr intervals. We’ll group by day and take midday forecast
  const daily = {};

  data.list.forEach(item => {
    const date = new Date(item.dt * 1000).toDateString();

    // Take the forecast closest to 12:00 PM for each day
    if (!daily[date] || item.dt_txt.includes('12:00:00')) {
      daily[date] = {
        date: date,
        temp: Math.round(item.main.temp),
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        humidity: item.main.humidity
      };
    }
  });

  // Return first 5 days only
  return Object.values(daily).slice(0, 5);
}

// Update test code to use processors
async function testWeatherApp() {
  const rawWeather = await getWeatherByCity('Lagos');
  if (rawWeather) {
    const cleanWeather = processCurrentWeather(rawWeather);
    console.log('Processed Current Weather:', cleanWeather);
  }

  const rawForecast = await getForecastByCity('Lagos');
  if (rawForecast) {
    const cleanForecast = processForecast(rawForecast);
    console.log('Processed Forecast:', cleanForecast);
  }
}

testWeatherApp();