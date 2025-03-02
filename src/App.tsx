import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, 
  Wind, 
  Droplets, 
  Thermometer,
  Sun,
  Moon,
  Eye,
  Gauge,
  CloudRain,
  Navigation,
  AlertTriangle,
  Leaf,
  SunMoon
} from 'lucide-react';
import type { WeatherData, WeatherBackground, AirQuality } from './types';

const weatherBackgrounds: WeatherBackground = {
  day: {
    clear: 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?auto=format&fit=crop&w=2000&q=80',
    clouds: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=2000&q=80',
    rain: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&w=2000&q=80',
    snow: 'https://images.unsplash.com/photo-1478265409131-1f65c88f965c?auto=format&fit=crop&w=2000&q=80',
    mist: 'https://images.unsplash.com/photo-1543968996-ee822b8176ba?auto=format&fit=crop&w=2000&q=80'
  },
  night: {
    clear: 'https://images.unsplash.com/photo-1532074205216-d0e1f4b87368?auto=format&fit=crop&w=2000&q=80',
    clouds: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?auto=format&fit=crop&w=2000&q=80',
    rain: 'https://images.unsplash.com/photo-1501999635878-71cb5379c2d8?auto=format&fit=crop&w=2000&q=80',
    snow: 'https://images.unsplash.com/photo-1517799094725-e3453440724e?auto=format&fit=crop&w=2000&q=80',
    mist: 'https://images.unsplash.com/photo-1549277513-f1b32fe1f8f5?auto=format&fit=crop&w=2000&q=80'
  }
};

const getAirQuality = (value: number): AirQuality => {
  if (value <= 50) {
    return { value, level: 'Good', color: 'text-green-500' };
  } else if (value <= 100) {
    return { value, level: 'Moderate', color: 'text-yellow-500' };
  } else if (value <= 150) {
    return { value, level: 'Poor', color: 'text-orange-500' };
  } else {
    return { value, level: 'Very Poor', color: 'text-red-500' };
  }
};

function App() {
  const [city, setCity] = useState('London');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isNight, setIsNight] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [airQuality, setAirQuality] = useState<AirQuality>({ value: 35, level: 'Good', color: 'text-green-500' });

  const API_KEY = 'REPLACE WITH YOUR ACTUAL API KEY';
  
  const getBackgroundImage = (weather: WeatherData | null) => {
    if (!weather) return weatherBackgrounds.day.clear;
    
    const condition = weather.weather[0].main.toLowerCase();
    const timeOfDay = isNight ? 'night' : 'day';
    
    switch (condition) {
      case 'clear':
        return weatherBackgrounds[timeOfDay].clear;
      case 'clouds':
        return weatherBackgrounds[timeOfDay].clouds;
      case 'rain':
      case 'drizzle':
      case 'thunderstorm':
        return weatherBackgrounds[timeOfDay].rain;
      case 'snow':
        return weatherBackgrounds[timeOfDay].snow;
      case 'mist':
      case 'fog':
      case 'haze':
        return weatherBackgrounds[timeOfDay].mist;
      default:
        return weatherBackgrounds[timeOfDay].clear;
    }
  };

  const fetchWeather = async (searchCity: string) => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get<WeatherData>(
        `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${API_KEY}&units=metric`
      );
      setWeather(response.data);
      
      // Simulate air quality data (since it requires a different API)
      const randomAqi = Math.floor(Math.random() * 200);
      setAirQuality(getAirQuality(randomAqi));
      
      // Check if it's night time
      if (response.data.sys) {
        const now = Date.now() / 1000; // Convert to seconds
        setIsNight(now < response.data.sys.sunrise || now > response.data.sys.sunset);
      }
    } catch (err) {
      setError('City not found. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWeather(city);
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getWindDirection = (degrees: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  const getWeatherAlert = (weather: WeatherData) => {
    const temp = weather.main.temp;
    const windSpeed = weather.wind.speed;
    
    if (temp > 35) {
      return {
        message: 'Extreme heat warning! Stay hydrated and avoid direct sun exposure.',
        color: 'text-red-500'
      };
    } else if (temp < 0) {
      return {
        message: 'Freezing conditions! Bundle up and be careful of ice.',
        color: 'text-blue-500'
      };
    } else if (windSpeed > 10) {
      return {
        message: 'Strong winds! Secure loose objects and exercise caution.',
        color: 'text-yellow-500'
      };
    }
    return null;
  };

  return (
    <div 
      className={`min-h-screen flex flex-col items-center justify-between p-4 transition-all duration-1000 ${darkMode ? 'dark' : ''}`}
      style={{
        backgroundImage: `url('${getBackgroundImage(weather)}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className={`max-w-4xl w-full ${darkMode ? 'bg-gray-900/90' : 'bg-white/80'} backdrop-blur-md rounded-2xl shadow-xl p-8 transition-all duration-300`}>
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-4xl font-bold text-center ${darkMode ? 'text-white' : 'text-gray-800'} flex items-center gap-2`}>
            {isNight ? <Moon className="text-blue-600" /> : <Sun className="text-yellow-500" />}
            Weather Forecast
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'} hover:opacity-80 transition-all duration-300`}
          >
            <SunMoon size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name"
              className={`w-full px-4 py-3 rounded-lg ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                  : 'bg-white/50 border-gray-300 text-gray-800'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12 text-lg transition-colors duration-300`}
            />
            <button
              type="submit"
              className={`absolute right-2 top-1/2 -translate-y-1/2 ${
                darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
              } transition-colors`}
            >
              <Search size={24} />
            </button>
          </div>
        </form>

        {loading && (
          <div className={`text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'} text-xl`}>
            <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-2"></div>
            <p>Fetching weather data...</p>
          </div>
        )}

        {error && (
          <div className="text-center text-red-500 mb-4 text-lg">{error}</div>
        )}

        {weather && !loading && !error && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className={`text-3xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {weather.name}, {weather.sys.country}
              </h2>
              <div className={`mt-4 text-7xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} flex items-center justify-center gap-4`}>
                <span>{Math.round(weather.main.temp)}°C</span>
                <span className={`text-2xl ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {weather.main.temp_min.toFixed(1)}° / {weather.main.temp_max.toFixed(1)}°
                </span>
              </div>
              <p className={`text-2xl ${darkMode ? 'text-gray-300' : 'text-gray-600'} capitalize mt-2`}>
                {weather.weather[0].description}
              </p>
            </div>

            {getWeatherAlert(weather) && (
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white/50'} flex items-center gap-3`}>
                <AlertTriangle className={getWeatherAlert(weather)?.color} />
                <p className={`${getWeatherAlert(weather)?.color} font-medium`}>
                  {getWeatherAlert(weather)?.message}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`flex flex-col items-center p-4 rounded-lg hover:scale-105 transition-all duration-300 ${
                darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white/50 hover:bg-white/70'
              }`}>
                <Thermometer className="text-red-500 mb-2" size={28} />
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Feels Like</span>
                <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} text-lg`}>
                  {Math.round(weather.main.feels_like)}°C
                </span>
              </div>
              <div className={`flex flex-col items-center p-4 rounded-lg hover:scale-105 transition-all duration-300 ${
                darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white/50 hover:bg-white/70'
              }`}>
                <Droplets className="text-blue-500 mb-2" size={28} />
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Humidity</span>
                <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} text-lg`}>
                  {weather.main.humidity}%
                </span>
              </div>
              <div className={`flex flex-col items-center p-4 rounded-lg hover:scale-105 transition-all duration-300 ${
                darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white/50 hover:bg-white/70'
              }`}>
                <Wind className="text-teal-500 mb-2" size={28} />
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Wind</span>
                <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} text-lg flex items-center gap-2`}>
                  <span>{weather.wind.speed} m/s</span>
                  <Navigation 
                    size={16} 
                    className="transform transition-transform" 
                    style={{ transform: `rotate(${weather.wind.deg}deg)` }}
                  />
                  <span className="text-sm">({getWindDirection(weather.wind.deg)})</span>
                </div>
              </div>
              <div className={`flex flex-col items-center p-4 rounded-lg hover:scale-105 transition-all duration-300 ${
                darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white/50 hover:bg-white/70'
              }`}>
                <Eye className="text-purple-500 mb-2" size={28} />
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Visibility</span>
                <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} text-lg`}>
                  {(weather.visibility / 1000).toFixed(1)} km
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white/50 hover:bg-white/70'} rounded-lg p-4 transition-all duration-300`}>
                <div className="flex items-center gap-2 mb-2">
                  <Sun className="text-yellow-500" />
                  <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Sun Schedule</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Sunrise</p>
                    <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {formatTime(weather.sys.sunrise)}
                    </p>
                  </div>
                  <div>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Sunset</p>
                    <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {formatTime(weather.sys.sunset)}
                    </p>
                  </div>
                </div>
              </div>
              <div className={`${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white/50 hover:bg-white/70'} rounded-lg p-4 transition-all duration-300`}>
                <div className="flex items-center gap-2 mb-2">
                  <Gauge className="text-blue-500" />
                  <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Atmospheric Conditions
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Pressure</p>
                    <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {weather.main.pressure} hPa
                    </p>
                  </div>
                  <div>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Cloud Cover</p>
                    <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {weather.clouds.all}%
                    </p>
                  </div>
                </div>
              </div>
              <div className={`${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white/50 hover:bg-white/70'} rounded-lg p-4 transition-all duration-300`}>
                <div className="flex items-center gap-2 mb-2">
                  <Leaf className={airQuality.color} />
                  <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Air Quality
                  </h3>
                </div>
                <div>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>AQI Level</p>
                  <p className={`font-semibold ${airQuality.color} text-lg`}>
                    {airQuality.level} ({airQuality.value})
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <footer className={`mt-8 text-center ${darkMode ? 'text-white/80' : 'text-gray-800/80'} backdrop-blur-sm py-2 px-4 rounded-full text-sm font-medium`}>
        © {new Date().getFullYear()} RexoSystems. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
