import React, { useState, useEffect } from 'react';

const WeatherDashboard = () => {
  const [city, setCity] = useState("Telangana");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get API key from environment variable or use fallback
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY || '58d7eea3755a475e9fd45725250611';

  const fetchWeather = async (place) => {
    if (!place || !place.trim()) {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(place)}&aqi=yes`
      );

      if (!res.ok) {
        throw new Error('Failed to fetch weather data. Please check the city name.');
      }

      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError(err.message || 'Failed to fetch weather data');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch weather for default city on mount
  useEffect(() => {
    fetchWeather(city);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim() !== "") {
      fetchWeather(city);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col items-center p-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Header */}
      <header className="text-center mb-6 w-full">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">WeatherNow 🌦</h1>
        <p className="text-sm text-gray-500">Live weather updates powered by WeatherAPI</p>
      </header>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6 w-full max-w-md">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name (e.g., Mumbai, New York, Telangana)..."
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          Search
        </button>
      </form>

      {/* Error Message */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 w-full max-w-md">
          <p className="text-red-600 font-medium text-center">Error: {error}</p>
        </div>
      )}

      {/* Loader */}
      {loading && (
        <div className="flex flex-col items-center justify-center mt-10">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-3 text-gray-500 font-medium">Fetching weather...</p>
        </div>
      )}

      {/* Weather Info */}
      {data && !loading && (
        <div className="w-full max-w-2xl space-y-6">
          {/* Weather Summary Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center text-center space-y-3 transition-all duration-500 hover:scale-105">
            <img
              src={data.current.condition.icon.startsWith('//') ? `https:${data.current.condition.icon}` : data.current.condition.icon}
              alt={data.current.condition.text}
              className="w-16 h-16"
            />
            <h2 className="text-4xl font-bold text-gray-900">
              {data.current.temp_c}°C
            </h2>
            <p className="text-lg text-gray-600">{data.current.condition.text}</p>
            <p className="text-sm text-gray-500">
              {data.location.name}, {data.location.region}
            </p>
          </div>

          {/* Detailed Stats Grid */}
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="bg-blue-50 rounded-xl p-4 text-center transition-all hover:scale-105 hover:shadow-md">
              <p className="text-gray-500 text-sm">Humidity</p>
              <p className="text-xl font-semibold">{data.current.humidity}%</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 text-center transition-all hover:scale-105 hover:shadow-md">
              <p className="text-gray-500 text-sm">Wind Speed</p>
              <p className="text-xl font-semibold">{data.current.wind_kph} km/h</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 text-center transition-all hover:scale-105 hover:shadow-md">
              <p className="text-gray-500 text-sm">Pressure</p>
              <p className="text-xl font-semibold">{data.current.pressure_mb} mb</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 text-center transition-all hover:scale-105 hover:shadow-md">
              <p className="text-gray-500 text-sm">UV Index</p>
              <p className="text-xl font-semibold">{data.current.uv}</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 text-center transition-all hover:scale-105 hover:shadow-md">
              <p className="text-gray-500 text-sm">PM2.5</p>
              <p className="text-xl font-semibold">
                {data.current.air_quality?.pm2_5 !== undefined ? data.current.air_quality.pm2_5 : 'N/A'}
              </p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 text-center transition-all hover:scale-105 hover:shadow-md">
              <p className="text-gray-500 text-sm">CO</p>
              <p className="text-xl font-semibold">
                {data.current.air_quality?.co !== undefined ? data.current.air_quality.co : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-10 text-gray-500 text-sm text-center">
        <p>© 2025 WeatherNow | Powered by{" "}
          <a
            href="https://www.weatherapi.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-700"
          >
            WeatherAPI.com
          </a>
        </p>
      </footer>
    </div>
  );
};

export default WeatherDashboard;
