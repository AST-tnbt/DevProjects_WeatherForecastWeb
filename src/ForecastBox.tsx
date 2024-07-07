import { FormEvent, useEffect, useState } from "react";
import Image from "./Image";
import Time from "./Time";

interface WeatherData {
    coord: { lon: number; lat: number };
    weather: { id: number; main: string; description: string; icon: string }[];
    base: string;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      humidity: number;
      sea_level: number;
      grnd_level: number;
    };
    visibility: number;
    wind: { speed: number; deg: number };
    rain?: { '1h': number };
    clouds: { all: number };
    dt: number;
    sys: {
      type: number;
      id: number;
      country: string;
      sunrise: number;
      sunset: number;
    };
    timezone: number;
    id: number;
    name: string;
    cod: number;
  }
  

export default function ForecastBox() {
    const [location, setLocation] = useState("");
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const ApiKeyWeather = import.meta.env.VITE_API_WEATHER_KEY;
    const ApiKeyMap = import.meta.env.VITE_API_MAP_KEY;

    async function fetchData() {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${ApiKeyWeather}`);
            if (!response.ok) {
                throw new Error("Network respone was not ok!");
            }
            const data = await response.json();
            setWeatherData(data as WeatherData);
        }
        catch (error) {
            console.error("Can not fetching data: ");
        }
    }

    async function getCityName(lat: number, long: number) {
        try {
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${ApiKeyMap}`);
            const data = await response.json();
            const cityName = data.results[0].address_components[data.results[0].address_components.length - 2].long_name;
            setLocation(cityName);
        }
        catch (error) {
            console.error("Can not get location");
        }
    }

    useEffect(() => {
        let watchId: number;
        if (navigator.geolocation) {
            watchId = navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    // console.log("longitude: ", longitude, "latitude: ", latitude);
                    getCityName(latitude, longitude);
                }
            )
        }
        return () => {
            if (watchId) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, [])

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        // console.log(location);
        fetchData();
    }

    const getWeatherIcon = (icon: string) => {
        if (icon == "01d") return Image.icon01d;
        if (icon == "01n") return Image.icon01n;
        if (icon == "02d") return Image.icon02d;
        if (icon == "02n") return Image.icon02n;
        if (icon == "03d") return Image.icon03d;
        if (icon == "03n") return Image.icon03n;
        if (icon == "04d") return Image.icon04d;
        if (icon == "04n") return Image.icon04n;
        if (icon == "09d") return Image.icon09d;
        if (icon == "09n") return Image.icon09n;
        if (icon == "10d") return Image.icon10d;
        if (icon == "10n") return Image.icon10n;
        if (icon == "11d") return Image.icon11d;
        if (icon == "11n") return Image.icon11n;
        if (icon == "13d") return Image.icon13d;
        if (icon == "13n") return Image.icon13n;
        if (icon == "50d") return Image.icon50d;
        if (icon == "50n") return Image.icon50n;
        if (icon == "unknown") return Image.unknown;
    }

    return (
        <div className="bg-white p-16 rounded-md font-popi shadow-lg select-none">
            <form className="flex gap-2 items-center" onSubmit={handleSubmit}>
                <label htmlFor="location" className="text-lg font-medium">Your city</label>
                <input id="location" type="text" value={location} onChange={input => { setLocation(input.target.value) }} className="outline-none rounded-sm p-2 border-[2px] border-[#DDE6EB]" />
            </form>

            {weatherData && <div className="flex flex-col items-center justify-center">
                <Time />
                <div className="mt-4">
                    <img src={getWeatherIcon(weatherData.weather[0].icon)} alt={weatherData.weather[0].description} className="bg-[#333] rounded-lg" />
                    <h2 className="text-3xl font-semibold text-center mt-6">{weatherData.main.temp}&deg;C</h2>
                    <h2 className="text-3xl font-semibold text-center">{weatherData.weather[0].main}</h2>
                </div>
                <div className="flex mt-8">
                    <div className="mr-8">
                        <p className="text-lg text-[#435057]">Humidity</p>
                        <p className="text-lg font-medium text-center mt-1">{weatherData.main.humidity}%</p>
                    </div>
                    <div>
                        <p className="text-lg text-[#435057]">Wind speed</p>
                        <p className="text-lg font-medium text-center mt-1">{weatherData.wind.speed} m/s</p>
                    </div>
                </div>
            </div>}
        </div>
    )
}
