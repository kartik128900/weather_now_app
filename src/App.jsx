import { useState } from "react";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      // First fetch coordinates using Open-Meteo geocoding API
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        setError("City not found.");
        setLoading(false);
        return;
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      // Fetch weather using Open-Meteo API
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      const weatherData = await weatherRes.json();

      setWeather({
        city: name,
        country: country,
        temperature: weatherData.current_weather.temperature,
        windspeed: weatherData.current_weather.windspeed,
        weathercode: weatherData.current_weather.weathercode,
      });
    } catch (err) {
      setError("Failed to fetch weather. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">🌤️ Weather Now</h1>

      <form onSubmit={fetchWeather} className="flex gap-2 mb-6 w-full max-w-md">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name..."
          className="flex-grow border p-2 rounded-lg"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Search
        </button>
      </form>

      {loading && <p className="text-gray-600">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {weather && (
        <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md text-center">
          <h2 className="text-2xl font-semibold mb-2">
            {weather.city}, {weather.country}
          </h2>
          <p className="text-lg">🌡️ Temperature: {weather.temperature}°C</p>
          <p className="text-lg">💨 Wind Speed: {weather.windspeed} km/h</p>
          <p className="text-lg">⛅ Weather Code: {weather.weathercode}</p>
        </div>
      )}
    </div>
  );
}

export default App;