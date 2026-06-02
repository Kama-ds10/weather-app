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